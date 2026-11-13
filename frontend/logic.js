const ST=["Pending","Planned","Waiting Approval","Approved","In Progress","Waiting Laptop","Waiting External Service","Completed","Failed","Cancelled"];
const now=()=>new Date().toISOString();
const newId=p=>p+Date.now().toString(36)+Math.random().toString(36).slice(2,5);
function addTask(S,t){const k={id:newId("T"),title:t.title,projectId:t.projectId,owner:t.owner||"",status:"Pending",priority:t.priority||"Sedang",created:now(),history:[{at:now(),note:"Dibuat"}]};S.tasks.push(k);return k}
function setStatus(S,id,st){const k=S.tasks.find(x=>x.id===id);if(!k||!ST.includes(st))return null;k.history.push({at:now(),note:k.status+" → "+st});k.status=st;if(st==="In Progress"&&!k.started)k.started=now();if(st==="Completed")k.finished=now();return k}
function requestApproval(S,a){const r={id:newId("A"),taskId:a.taskId||"",action:a.action,why:a.why,impact:a.impact,risk:a.risk,cost:a.cost||"-",status:"Menunggu",created:now()};S.approvals.push(r);if(r.taskId)setStatus(S,r.taskId,"Waiting Approval");return r}
function decide(S,id,ok){const a=S.approvals.find(x=>x.id===id);if(!a||a.status!=="Menunggu")return null;a.status=ok?"Disetujui":"Ditolak";if(a.taskId)setStatus(S,a.taskId,ok?"Approved":"Cancelled");return a}
function stats(S){const c=s=>S.tasks.filter(t=>s.includes(t.status)).length,n=S.tasks.length;
const test=S.tasks.filter(t=>t.status==="In Progress"&&t.owner==="CAKRA").length;
const work=c(["In Progress","Waiting Laptop","Waiting External Service"])-test;
return{total:n,active:c(["In Progress"]),pending:c(["Pending","Planned"]),waiting:c(["Waiting Approval","Waiting Laptop","Waiting External Service"]),done:c(["Completed"]),
pct:n?Math.round(c(["Completed"])/n*100):0,stages:{basecamp:c(["Pending"]),plan:c(["Planned","Waiting Approval","Approved"]),work,test,peak:c(["Completed"])}}}
function addKB(S,k){const r={id:newId("K"),title:k.title,body:k.body,source:k.source||"CEO",project:k.project||"",date:now(),version:1};S.kb.push(r);return r}
function ensureState(d){return Object.assign({projects:[],tasks:[],approvals:[],kb:[],files:[]},d||{})}
function validFile(f,max){max=max||26214400;if(!f||!f.name||!f.size)return"Pilih file yang tidak kosong";if(f.size>max)return"File terlalu besar (maks 25 MB)";return""}
function category(n,t){t=t||"";n=(n||"").toLowerCase();if(t.startsWith("image/"))return"Gambar";if(t.startsWith("audio/"))return"Audio";if(t.startsWith("video/"))return"Video";if(/\.zip$/.test(n))return"ZIP";if(/\.(js|ts|py|html|css|json|java|kt|php)$/.test(n))return"Source code";if(/\.(pdf|docx?|txt|md|xlsx?|pptx?)$/.test(n)||t.startsWith("text/"))return"Dokumen";return"Lainnya"}
function addFileMeta(S,f,d){const v=S.files.filter(x=>x.name===f.name&&x.projectId===d.projectId).length+1;const m={id:newId("F"),name:f.name,size:f.size,type:f.type||"",category:category(f.name,f.type),projectId:d.projectId,folder:d.folder||"07_Deliverables",version:v,by:"CEO",created:now()};S.files.push(m);return m}
function filterFiles(l,q,p){q=(q||"").toLowerCase();return(l||[]).filter(x=>(!p||x.projectId===p)&&(x.name+x.category+x.folder).toLowerCase().includes(q)).slice().reverse()}
if(typeof module!=="undefined")module.exports={ST,addTask,setStatus,requestApproval,decide,stats,addKB,ensureState,validFile,category,addFileMeta,filterFiles};
