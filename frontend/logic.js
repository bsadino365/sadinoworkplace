const ST=["Pending","Planned","Waiting Approval","Approved","In Progress","Waiting Laptop","Waiting External Service","Completed","Failed","Cancelled"];
const MEM=["Company Memory","CEO Decision Memory","Project Memory","Employee Memory","Historical Memory","Knowledge Base"];
const PERM=[["read_proj","Baca proyek"],["write_file","Tulis file"],["run_test","Jalankan tes"],["git","Akses GitHub"],["worker","Akses Local Worker"],["read_kb","Baca pengetahuan"],["write_kb","Tulis pengetahuan"]];
const APPR_CAT=["Pengeluaran uang","Hapus data penting","Hapus repository","Ubah visibilitas repository","Ubah izin akses","Instal software","Ubah konfigurasi server","Deployment produksi","Kirim data sensitif ke layanan eksternal","Lainnya"];
const JOBS=["Riset","Coding","Desain","Naskah & konten","Pengujian (QA)","Ringkasan murah"];
const now=()=>new Date().toISOString();
const newId=p=>p+Date.now().toString(36)+Math.random().toString(36).slice(2,5);
const SECRET=/(sk-[A-Za-z0-9_-]{16,}|ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|AIza[0-9A-Za-z_-]{30,}|api[_-]?key["']?\s*[:=]\s*["']?[A-Za-z0-9_-]{12,})/i;
const secretScan=t=>SECRET.test(String(t||""));
function log(S,by,act,det){(S.audit=S.audit||[]).push({id:newId("L"),at:now(),by:by||"CEO",act,det:det||""});if(S.audit.length>500)S.audit.splice(0,S.audit.length-500)}
function addProject(S,p){const r={id:newId("P"),name:p.name,type:p.type==="content"?"content":"software",goal:p.goal||"",status:"Aktif",budget:Number(p.budget)||0,created:now()};S.projects.push(r);log(S,"CEO","Proyek dibuat",r.name);return r}
function addTask(S,t){const k={id:newId("T"),title:t.title,projectId:t.projectId,owner:t.owner||"",status:"Pending",priority:t.priority||"Sedang",created:now(),history:[{at:now(),note:"Dibuat"}]};S.tasks.push(k);log(S,"CEO","Tugas dibuat",k.title);return k}
function setStatus(S,id,st){const k=S.tasks.find(x=>x.id===id);if(!k||!ST.includes(st))return null;k.history.push({at:now(),note:k.status+" → "+st});k.status=st;if(st==="In Progress"&&!k.started)k.started=now();if(st==="Completed")k.finished=now();log(S,"CEO","Status tugas",k.title+": "+st);return k}
function requestApproval(S,a){const r={id:newId("A"),taskId:a.taskId||"",category:a.category||"Lainnya",action:a.action,why:a.why,impact:a.impact,risk:a.risk,cost:a.cost||"-",status:"Menunggu",created:now()};S.approvals.push(r);if(r.taskId)setStatus(S,r.taskId,"Waiting Approval");log(S,"Sistem","Persetujuan diajukan",r.action);return r}
function decide(S,id,ok){const a=S.approvals.find(x=>x.id===id);if(!a||a.status!=="Menunggu")return null;a.status=ok?"Disetujui":"Ditolak";a.decided=now();if(a.taskId)setStatus(S,a.taskId,ok?"Approved":"Cancelled");addKB(S,{title:(ok?"Disetujui: ":"Ditolak: ")+a.action,body:"Mengapa: "+a.why+"\nDampak: "+a.impact+"\nRisiko: "+a.risk+"\nBiaya: "+a.cost,source:"Approval Center",type:"CEO Decision Memory"});log(S,"CEO",ok?"Menyetujui":"Menolak",a.action);return a}
function stats(S){const c=s=>S.tasks.filter(t=>s.includes(t.status)).length,n=S.tasks.length;
const test=S.tasks.filter(t=>t.status==="In Progress"&&t.owner==="CAKRA").length;
const work=c(["In Progress","Waiting Laptop","Waiting External Service"])-test;
return{total:n,active:c(["In Progress"]),pending:c(["Pending","Planned"]),waiting:c(["Waiting Approval","Waiting Laptop","Waiting External Service"]),done:c(["Completed"]),
pct:n?Math.round(c(["Completed"])/n*100):0,stages:{basecamp:c(["Pending"]),plan:c(["Planned","Waiting Approval","Approved"]),work,test,peak:c(["Completed"])}}}
function addKB(S,k){const r={id:newId("K"),title:k.title,body:k.body,source:k.source||"CEO",project:k.project||"",type:MEM.includes(k.type)?k.type:"Knowledge Base",by:k.by||"CEO",date:now(),version:1,versions:[]};S.kb.push(r);return r}
function editKB(S,id,p){const k=S.kb.find(x=>x.id===id);if(!k||!p.title||!p.body)return null;k.versions.push({v:k.version,title:k.title,body:k.body,at:k.date});k.title=p.title;k.body=p.body;k.version++;k.date=now();log(S,"CEO","Pengetahuan diubah",k.title+" v"+k.version);return k}
function addCommand(S,c){if(!c.text||!c.text.trim())return null;const r={id:newId("C"),text:c.text.trim(),projectId:c.projectId||"",priority:c.priority||"Sedang",status:"Menunggu Direktur",at:now()};S.commands.push(r);log(S,"CEO","Instruksi dikirim",r.text.slice(0,60));return r}
function commandToTask(S,id){const c=S.commands.find(x=>x.id===id);if(!c||c.taskId)return null;if(!c.projectId)return null;const t=addTask(S,{title:c.text.slice(0,80),projectId:c.projectId,priority:c.priority});c.taskId=t.id;c.status="Jadi tugas";return t}
function addProvider(S,p){if(!p.name||!p.name.trim()||secretScan(JSON.stringify(p)))return null;const r={id:newId("M"),name:p.name.trim(),kind:p.kind||"Lainnya",model:p.model||"",backup:p.backup||"",enabled:false,status:"Belum Terhubung"};S.providers.push(r);log(S,"CEO","Provider ditambahkan",r.name);return r}
function toggleProvider(S,id){const p=S.providers.find(x=>x.id===id);if(!p)return null;p.enabled=!p.enabled;log(S,"CEO","Provider "+(p.enabled?"diaktifkan":"dinonaktifkan"),p.name);return p}
function removeProvider(S,id){const n=S.providers.length;S.providers=S.providers.filter(x=>x.id!==id);for(const k of Object.keys(S.routing))if(S.routing[k]===id)delete S.routing[k];for(const k of Object.keys(S.emp))if(S.emp[k].model===id)S.emp[k].model="";return n!==S.providers.length}
function setEmp(S,n,p){const o=Object.assign({model:"",perms:[],projects:[]},S.emp[n],p);S.emp[n]=o;log(S,"CEO","Izin karyawan diubah",n);return o}
function activation(S,n){const e=S.emp[n]||{},pr=S.providers.find(x=>x.id===e.model);
const checks=[["Model AI dipilih",!!pr],["Model terhubung & lolos uji koneksi",!!pr&&pr.status==="Terhubung"],["Memiliki izin akses",(e.perms||[]).length>0],["Memiliki akses ke proyek",(e.projects||[]).length>0]];
return{ok:checks.every(c=>c[1]),checks}}
function activeEmployees(S,names){return names.filter(n=>activation(S,n).ok).length}
function setBudget(S,m,w){m=Number(m);w=Number(w);if(!(m>=0)||!(w>=1&&w<=100))return null;S.budget={monthly:m,warn:w};log(S,"CEO","Anggaran diatur",String(m));return S.budget}
function addExpense(S,x){const a=Number(x.amount);if(!x.label||!(a>0))return null;const r={id:newId("X"),label:x.label,amount:a,kind:x.kind==="Estimasi"?"Estimasi":"Aktual",cat:x.cat||"Lainnya",projectId:x.projectId||"",at:now()};S.expenses.push(r);log(S,"CEO","Pengeluaran dicatat",r.label+" "+a);return r}
function budgetState(S){const m=now().slice(0,7),cur=S.expenses.filter(x=>x.at.slice(0,7)===m),sum=k=>cur.filter(x=>x.kind===k).reduce((s,x)=>s+x.amount,0);
const actual=sum("Aktual"),est=sum("Estimasi"),mo=S.budget.monthly,pct=mo?Math.round(actual/mo*100):0;
return{actual,est,monthly:mo,pct,level:!mo?"none":pct>=100?"over":pct>=S.budget.warn?"warn":"ok"}}
function projectStats(S,pid){const t=S.tasks.filter(x=>x.projectId===pid),d=t.filter(x=>x.status==="Completed").length;return{tasks:t.length,done:d,pct:t.length?Math.round(d/t.length*100):0,files:S.files.filter(x=>x.projectId===pid).length,spent:S.expenses.filter(x=>x.projectId===pid&&x.kind==="Aktual").reduce((s,x)=>s+x.amount,0)}}
function validFile(f,max){max=max||26214400;if(!f||!f.name||!f.size)return"Pilih file yang tidak kosong";if(f.size>max)return"File terlalu besar (maks 25 MB)";return""}
function category(n,t){t=t||"";n=(n||"").toLowerCase();if(t.startsWith("image/"))return"Gambar";if(t.startsWith("audio/"))return"Audio";if(t.startsWith("video/"))return"Video";if(/\.zip$/.test(n))return"ZIP";if(/\.(js|ts|py|html|css|json|java|kt|php)$/.test(n))return"Source code";if(/\.(pdf|docx?|txt|md|xlsx?|pptx?)$/.test(n)||t.startsWith("text/"))return"Dokumen";return"Lainnya"}
function addFileMeta(S,f,d){const v=S.files.filter(x=>x.name===f.name&&x.projectId===d.projectId).length+1;const m={id:newId("F"),name:f.name,size:f.size,type:f.type||"",category:category(f.name,f.type),projectId:d.projectId,folder:d.folder||"07_Deliverables",version:v,by:"CEO",created:now()};S.files.push(m);log(S,"CEO","File diunggah",m.name);return m}
function filterFiles(l,q,p){q=(q||"").toLowerCase();return(l||[]).filter(x=>(!p||x.projectId===p)&&(x.name+x.category+x.folder).toLowerCase().includes(q)).slice().reverse()}
function ensureState(d){const S=Object.assign({projects:[],tasks:[],approvals:[],kb:[],files:[],commands:[],audit:[],providers:[],emp:{},expenses:[],routing:{}},d||{});
S.budget=Object.assign({monthly:0,warn:80},S.budget);S.settings=Object.assign({theme:"auto"},S.settings);
S.kb.forEach(k=>{if(!k.type)k.type="Knowledge Base";if(!k.versions)k.versions=[];if(!k.by)k.by="CEO"});
S.projects.forEach(p=>{if(!p.status)p.status="Aktif";if(p.budget==null)p.budget=0});return S}
if(typeof module!=="undefined")module.exports={ST,MEM,PERM,APPR_CAT,JOBS,secretScan,log,addProject,addTask,setStatus,requestApproval,decide,stats,addKB,editKB,addCommand,commandToTask,addProvider,toggleProvider,removeProvider,setEmp,activation,activeEmployees,setBudget,addExpense,budgetState,projectStats,ensureState,validFile,category,addFileMeta,filterFiles};
