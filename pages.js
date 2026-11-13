/* Sadino Workplace v3: navigasi 4 menu, halaman baru, Admin Center.
   Dimuat setelah app.js. Menambah ke V, MODS, SHEETS, FORMS tanpa mengubah logika lama. */
const CENTRAL=[["AI Director","Chief AI Coordinator","Central Management","Menerima instruksi CEO, membuat perencanaan, mendelegasikan tugas, mengawasi karyawan, mengelola approval, menyusun laporan.",["Perencanaan pekerjaan","Delegasi tugas","Pengawasan karyawan","Pengelolaan approval","Laporan untuk CEO"]],
["AI Setup Assistant","Technical Operations Agent (Virtual CTO)","Central Management","Mengevaluasi, menyiapkan, membangun, menguji, dan memelihara sistem AI.",["Technology Discovery","Framework Evaluation","Agent Engineering","Instalasi & konfigurasi","Pengujian & troubleshooting","Pemeliharaan"]]];
const CNAMES=CENTRAL.map(x=>x[0]);
const SUB={cmd:[["cmd","Instruksi"],["task","Tugas"],["appr","Persetujuan"],["proj","Proyek"]],kin:[["kin","Kantor"],["emp","Karyawan"],["org","Organisasi"]],has:[["has","Semua hasil"],["files","File"],["kb","Pengetahuan"]]};
const PARENT={task:"cmd",appr:"cmd",proj:"cmd",emp:"kin",org:"kin",files:"has",kb:"has",aiset:"adm",agent:"adm",model:"adm",tech:"adm",sec:"adm",set:"adm",fin:"adm",gh:"adm"};
const MAINS=[["dash","Dashboard","home"],["cmd","Command","cmd"],["kin","Kinerja","users"],["has","Hasil","file"]];
MODS.push(["kin","Kinerja","users"],["has","Hasil","file"],["adm","Admin Center","cpu"],["aiset","AI Setup Center","cpu"],["agent","Agent Management","users"],["tech","Technology Registry","git"]);
IC.cog=IC.cog||"M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6|M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z";
const SUBL={cmd:"Instruksi",task:"Tugas",appr:"Persetujuan",proj:"Proyek",kin:"Kantor",emp:"Karyawan",org:"Organisasi",has:"Semua hasil",files:"File",kb:"Pengetahuan"};
const ADM=[["aiset","AI Setup Center","Pusat kendali AI Setup Assistant: discovery, inventori, instalasi, pengujian."],["agent","Agent Management","15 agent: profil, skills, model, tools, memori, izin."],["model","Model & Provider","Provider, model, kuota, routing, cadangan, konsep 9Router."],["tech","Technology Registry","Daftar teknologi, versi, status, lisensi, biaya."],["sec","Security & Permissions","Izin, approval, status keamanan, audit log, kredensial."],["set","General Settings","Tema, bahasa, profil perusahaan, notifikasi, data."]];
const ADMX=[["fin","Anggaran & Biaya","Catatan anggaran dan pengeluaran manual."],["gh","GitHub","Repository dan sinkronisasi (menunggu backend)."]];
const ALLP=CENTRAL.map(x=>x[0]).concat(NAMES);
const dm=t=>`<span class="dm">DEMO</span>`;
const cardx=(t,body,x)=>`<div class="card"><div class="li" style="border:0;padding:0"><h3 style="margin:0">${e(t)}</h3>${x||""}</div>${body}</div>`;
const wait=(t)=>`<div class="empty sm">${e(t)}</div>`;

/* ---------- render baru: 4 menu ---------- */
function subbar(t){const par=PARENT[t]||t;
if(SUB[par])return`<div class="chips sub">${SUB[par].map(x=>`<a class="pill ${x[0]===t?"on":""}" href="#${x[0]}">${x[1]}</a>`).join("")}</div>`;
if(par==="adm"&&t!=="adm")return`<div class="chips sub"><a class="pill" href="#adm">‹ Admin Center</a></div>`;return""}
function render(){if(!V[tab])tab="dash";const m=MODS.find(x=>x[0]===tab)||MODS[0],p=pendingN(),on=typeof navigator==="undefined"||navigator.onLine!==false,par=PARENT[tab]||tab;
const ttl=par==="adm"?(tab==="adm"?"Admin Center":m[1]):(MAINS.find(x=>x[0]===par)||m)[1];
$("#hd").innerHTML=`<div class="logo">S</div><div class="ht"><b>${ttl}</b><small>Sadino Workplace</small></div>${chip(on?"Online":"Offline",on?"ok":"warn")}<button class="ib" data-a="go" data-id="appr" aria-label="Persetujuan">${I("bell")}${p?`<i class="dot">${p}</i>`:""}</button><button class="ib ${par==="adm"?"on":""}" data-a="go" data-id="adm" aria-label="Admin Center">${I("cog")}</button>`;
$("#tabs").innerHTML=MAINS.map(x=>`<a href="#${x[0]}" class="${x[0]===par?"on":""}" ${x[0]===par?'aria-current="page"':""}>${I(x[2])}<span>${x[1]}</span>${x[0]==="cmd"&&p?`<i class="dot">${p}</i>`:""}</a>`).join("");
$("#side").innerHTML=`<div class="brand"><div class="logo">S</div><div><b>Sadino</b><small>Workplace</small></div></div><h4>Menu</h4>`+MAINS.map(x=>`<a href="#${x[0]}" class="${x[0]===par?"on":""}">${I(x[2])}${x[1]}${x[0]==="cmd"&&p?`<i class="dot">${p}</i>`:""}</a>`).join("")+`<h4>Administrasi</h4><a href="#adm" class="${par==="adm"?"on":""}">${I("cog")}Admin Center</a>`;
if(typeof OF!=="undefined"&&tab!=="kin")OF.stop();
$("#main").innerHTML=subbar(tab)+V[tab]();if(SH&&!$("#sheet").hidden)$("#panel").innerHTML=SH();
if(tab==="kin")OF.mount();
const r=typeof document!=="undefined"&&document.documentElement;if(r&&r.setAttribute)r.setAttribute("data-theme",S.settings.theme)}

/* ---------- Dashboard: pelengkap komponen ---------- */
const _dash=V.dash;
V.dash=function(){const prov=S.providers,conn=prov.filter(p=>p.status==="Terhubung").length,b=budgetState(S),w=S.approvals.filter(a=>a.status==="Menunggu").length,s=stats(S);
const own={};S.tasks.filter(t=>["In Progress","Pending","Planned","Approved","Waiting Approval","Waiting Laptop","Waiting External Service"].includes(t.status)).forEach(t=>{const k=t.owner||"(belum ditugaskan)";own[k]=(own[k]||0)+1});
const notes=[];if(w)notes.push(w+" persetujuan menunggu keputusan");if(b.level==="warn"||b.level==="over")notes.push(b.level==="over"?"Anggaran bulan ini terlampaui":"Anggaran mendekati batas");notes.push("Backend AI belum terhubung");
return _dash()+`<h3 class="sec">Pusat kendali perusahaan</h3><div class="cols">
${cardx("AI Director",`<small>Belum terhubung. Instruksi CEO dicatat dan menunggu.</small>`,nc)}
${cardx("Employee Overview",`<div class="pawns">${ALLP.map(n=>`<a href="#kin" title="${e(n)}">${pawnAv(n,22)}</a>`).join("")}</div><small>15 posisi AI: 2 pusat + 13 specialist. Semua belum terhubung.</small>`)}
${cardx("Operational Health",`<div class="li"><span>Healthy / Working</span><b>0</b></div><div class="li"><span>Belum terhubung</span><b>15</b></div><small>Status asli. Pratinjau status ada di Kinerja (berlabel DEMO).</small>`)}
${cardx("Provider & Model",`<div class="li"><span>Provider terdaftar</span><b>${prov.length}</b></div><div class="li"><span>Terhubung</span><b>${conn}</b></div><div class="acts"><button class="btn ghost sm" data-a="go" data-id="model">Buka Model & Provider</button></div>`)}
${cardx("Token Usage",wait("Belum tersedia. Menunggu integrasi."))}
${cardx("Provider Quota",wait("Belum tersedia. Menunggu integrasi."))}
${cardx("Beban kerja",Object.keys(own).length?Object.keys(own).map(k=>`<div class="li"><span>${e(k)}</span><b>${own[k]}</b></div>`).join("")+`<small>Dari tugas nyata di perangkat ini.</small>`:wait("Belum ada tugas aktif."))}
${cardx("Notifikasi sistem",notes.map(x=>`<div class="li"><span>${e(x)}</span></div>`).join(""))}</div>`};

/* ---------- Command: perencanaan & detail ---------- */
const _cmd=V.cmd;
V.cmd=function(){return _cmd()+`<h3 class="sec">Rencana & eksekusi AI Director</h3><div class="cols">
${cardx("Rencana pekerjaan",wait("Muncul setelah AI Director terhubung."),nc)}${cardx("Task breakdown",wait("Muncul setelah AI Director terhubung."),nc)}
${cardx("Delegasi",wait("Menunggu integrasi."),nc)}${cardx("Progress & timeline",wait("Belum ada eksekusi. Tidak ada progres palsu."),nc)}
${cardx("Laporan AI Director",wait("Belum ada laporan."),nc)}${cardx("Approval request",`<small>Permintaan yang Anda ajukan ada di tab Persetujuan.</small><div class="acts"><a class="btn ghost sm" href="#appr">Buka Persetujuan</a></div>`)}</div>`};
SHEETS.cmd=id=>()=>{const c=S.commands.find(x=>x.id===id);if(!c)return sheetHead("Instruksi");
return sheetHead("Detail instruksi")+`<div class="card"><p style="white-space:pre-wrap">${e(c.text)}</p><div style="margin-top:8px">${chip(c.status,c.taskId?"ok":"warn")}</div><small>${dt(c.at)} · ${e(pname(c.projectId))} · prioritas ${e(c.priority)}</small></div>
<div class="card"><h3>Rencana & timeline</h3>${wait("Belum ada rencana dari AI Director (belum terhubung).")}</div>${c.taskId?`<small>Sudah menjadi tugas.</small>`:`<div class="acts"><button class="btn" data-a="mkt" data-id="${c.id}">Jadikan tugas</button></div>`}`};

/* ---------- Kinerja ---------- */
V.kin=function(){
return head("Kinerja","Kantor virtual dan pemantauan 15 karyawan AI.")+OF.html()+`<h3 class="sec">Employee Operational Health</h3><div class="card"><div class="stl">${OF.ST.map(s=>`<span class="st"><u style="background:${s[2]}"></u>${s[1]}</span>`).join("")}</div><small>Representasi kondisi operasional sistem (bukan perasaan AI). Akan terhubung ke data backend.</small></div>
<h3 class="sec">Karyawan</h3><input id="eq2" placeholder="Cari nama atau jabatan" value="${e(F.eq)}"><div id="el2" style="margin-top:12px">${kinList()}</div>
<h3 class="sec">Metrik kinerja</h3><div class="card">${wait("Belum tersedia. Statistik kinerja menunggu data tugas nyata dari backend.")}</div>`};
function kinList(){const q=(F.eq||"").toLowerCase();const card=(n,r,d,m)=>`<div class="card tap" data-a="emp" data-id="${e(n)}"><div style="display:flex;gap:12px;align-items:center">${pawnAv(n,28)}<div style="flex:1;min-width:0"><b>${e(n)}</b><br><small>${e(r)}</small></div>${nc}</div><small>${m||"Model: "+e((S.providers.find(p=>p.id===(S.emp[n]||{}).model)||{name:"belum dipilih"}).name)}</small></div>`;
const cen=CENTRAL.filter(x=>(x[0]+x[1]).toLowerCase().includes(q)),out=[];
if(cen.length)out.push(`<h3 class="sec">Central Management</h3><div class="cols">${cen.map(x=>card(x[0],x[1],0,"Peran pusat")).join("")}</div>`);
DEPTS.forEach(d=>{const l=EMP.filter(x=>x[2]===d&&x.join(" ").toLowerCase().includes(q));if(l.length)out.push(`<h3 class="sec">${e(d)}</h3><div class="cols">${l.map(x=>card(x[0],x[1])).join("")}</div>`)});
return out.join("")||empty("Tidak ditemukan.","users")}
document.addEventListener("input",ev=>{if(ev.target.id==="eq2"){F.eq=ev.target.value;$("#el2").innerHTML=kinList()}});

/* profil: 15 posisi */
const _semp=SHEETS.emp;
const extraProfile=n=>`<h3 class="sec">Informasi lain</h3><div class="card"><table style="width:100%"><tr><td>Status operasional</td><td>Belum terhubung</td></tr><tr><td>Skills</td><td>Menunggu integrasi</td></tr><tr><td>Tools</td><td>Menunggu integrasi</td></tr><tr><td>Performance metrics</td><td>Belum tersedia</td></tr><tr><td>Riwayat aktivitas</td><td>Belum ada</td></tr></table></div>`;
SHEETS.emp=n=>{const c=CENTRAL.find(x=>x[0]===n);if(!c){const f=_semp(n);return()=>{const o=f();return o.replace(/<div class="av">[^<]*<\/div>/,pawnAv(n,32))+extraProfile(n)}}
return()=>sheetHead(c[0])+`<div style="display:flex;gap:12px;align-items:center;margin-bottom:12px">${pawnAv(n,32)}<div><b>${e(c[1])}</b><br><small>${e(c[2])}</small></div></div><p style="font-size:14px;margin-bottom:12px">${e(c[3])}</p><div class="card"><h3>Tanggung jawab</h3>${c[4].map(x=>`<div class="li"><span>${e(x)}</span></div>`).join("")}</div><div class="card"><h3>Model AI dikonfigurasi</h3><small>Belum dikonfigurasi. Menunggu integrasi backend.</small></div>`+extraProfile(n)};

/* ---------- Hasil ---------- */
const HF=[["all","Semua"],["done","Tugas selesai"],["doc","Dokumen"],["rep","Laporan"],["file","File"],["res","Riset"],["qa","QA"],["rev","Revisi"],["hist","Riwayat"]];
function resItems(){const L=[];S.tasks.filter(t=>t.status==="Completed").forEach(t=>L.push({k:"done",t:t.title,d:t.finished||t.created,sub:"Tugas selesai · "+(t.owner||"-")+" · "+pname(t.projectId),a:"tk",id:t.id}));
S.files.forEach(f=>{const k=/Research/.test(f.folder||"")?"res":/Testing/.test(f.folder||"")?"qa":/Documentation|Deliverables/.test(f.folder||"")&&f.category==="Dokumen"?"rep":f.category==="Dokumen"?"doc":"file";L.push({k,k2:f.category==="Dokumen"?"doc":"",t:f.name,d:f.created,sub:f.category+" · "+(f.folder||"")+" · "+pname(f.projectId),a:"dl",id:f.id,f:1})});return L}
function hasList(){const q=(F.hq||"").toLowerCase(),f=F.hf||"all",o=F.hs||"new";
if(f==="hist"){const a=S.audit.slice(-60).reverse().filter(x=>(x.act+x.det).toLowerCase().includes(q));return a.map(x=>`<div class="card"><div class="li" style="border:0;padding:0"><div><b>${e(x.act)}</b><br><small>${e(x.det)}</small></div><small>${dt(x.at)}</small></div></div>`).join("")||empty("Belum ada riwayat kerja.","inbox")}
if(f==="rev")return empty("Belum ada permintaan revisi. Muncul setelah AI Director terhubung.","inbox");
let l=resItems().filter(x=>(f==="all"||x.k===f||x.k2===f)&&x.t.toLowerCase().includes(q));
l.sort((a,b)=>o==="name"?a.t.localeCompare(b.t):o==="old"?String(a.d).localeCompare(String(b.d)):String(b.d).localeCompare(String(a.d)));
const kb=(f==="all"||f==="doc")?S.kb.filter(k=>(k.title+k.body).toLowerCase().includes(q)).map(k=>`<div class="card tap" data-a="ked" data-id="${k.id}"><b>${e(k.title)}</b> ${chip("Pengetahuan","info")}<br><small>${e(k.type)} · v${k.version} · ${e(k.date.slice(0,10))}</small></div>`).join(""):"";
return l.map(x=>`<div class="card"><div class="li" style="border:0;padding:0"><b style="word-break:break-all">${e(x.t)}</b>${chip(x.k==="done"?"Selesai":"File",x.k==="done"?"ok":"info")}</div><small>${e(x.sub)} · ${e(String(x.d).slice(0,10))}</small>${x.f?`<div class="acts"><button class="btn sm" data-a="dl" data-id="${x.id}">Unduh</button><button class="btn ghost sm" data-a="pv" data-id="${x.id}">Lihat</button></div>`:""}</div>`).join("")+kb||empty("Belum ada hasil"+(f!=="all"?" untuk kategori ini":"")+(q?" yang cocok":"")+". Hasil muncul setelah ada pekerjaan; tidak ada hasil palsu.","inbox")}
V.has=function(){return head("Hasil","Pusat hasil kerja: tugas selesai, dokumen, file, riset, dan QA.")+`<input id="hq" placeholder="Cari hasil..." value="${e(F.hq||"")}"><div class="chips" style="margin-top:10px">${HF.map(x=>`<button type="button" class="pill ${(F.hf||"all")===x[0]?"on":""}" data-a="hf" data-id="${x[0]}">${x[1]}</button>`).join("")}</div><div class="fr" style="margin-bottom:10px"><label>Urutkan<select id="hs"><option value="new"${F.hs==="new"||!F.hs?" selected":""}>Terbaru</option><option value="old"${F.hs==="old"?" selected":""}>Terlama</option><option value="name"${F.hs==="name"?" selected":""}>Nama</option></select></label></div><div id="hl">${hasList()}</div>`};
document.addEventListener("input",ev=>{if(ev.target.id==="hq"){F.hq=ev.target.value;$("#hl").innerHTML=hasList()}});
document.addEventListener("change",ev=>{if(ev.target.id==="hs"){F.hs=ev.target.value;$("#hl").innerHTML=hasList()}});

/* ---------- Admin Center ---------- */
V.adm=function(){return head("Admin Center","Halaman administrasi. Bukan menu utama.")+`<div class="cols">${ADM.map(a=>`<a class="card tap adc" href="#${a[0]}"><b>${a[1]}</b><br><small>${a[2]}</small></a>`).join("")}</div><h3 class="sec">Lainnya</h3><div class="cols">${ADMX.map(a=>`<a class="card tap adc" href="#${a[0]}"><b>${a[1]}</b><br><small>${a[2]}</small></a>`).join("")}</div>`};
V.aiset=function(){const sw=typeof navigator!=="undefined"&&navigator.serviceWorker&&navigator.serviceWorker.controller,idb=typeof indexedDB!=="undefined",on=typeof navigator==="undefined"||navigator.onLine!==false;
const chk=[["Service worker (offline)",!!sw],["Penyimpanan lokal (IndexedDB)",idb],["Koneksi internet",on]];
return head("AI Setup Center","Pusat kendali AI Setup Assistant. Assistant belum aktif.")+banner(`<b>AI Setup Assistant belum terhubung.</b> Semua bagian di bawah menunggu backend; tidak ada data karangan.`,"warn","alert")+`<div class="cols">
${cardx("Pemeriksaan sistem lokal",chk.map(c=>`<div class="li"><span>${c[0]}</span>${chip(c[1]?"Aktif":"Tidak aktif",c[1]?"ok":"warn")}</div>`).join("")+`<div class="li"><span>Versi aplikasi</span><b>${APP_VERSION}</b></div>`)}
${cardx("Technology Discovery",wait("Belum ada hasil discovery."),nc)}
${cardx("Framework Registry",`<small>Daftar teknologi yang dikenal aplikasi.</small><div class="acts"><a class="btn ghost sm" href="#tech">Buka Technology Registry</a></div>`)}
${cardx("Software Inventory",`<div class="li"><span>Frontend</span><small>HTML, CSS, JavaScript biasa</small></div><div class="li"><span>Data</span><small>IndexedDB di browser</small></div><div class="li"><span>Backend</span>${nc}</div>`)}
${cardx("Agent Management",`<div class="acts"><a class="btn ghost sm" href="#agent">Buka Agent Management</a></div>`)}
${cardx("Installation History",wait("Belum ada instalasi."),nc)}${cardx("Testing Results",wait("Belum ada hasil pengujian dari Setup Assistant."),nc)}${cardx("Troubleshooting",wait("Belum ada catatan."),nc)}
${cardx("Maintenance",`<small>Cadangan data lokal.</small><div class="acts"><button class="btn sm" data-a="ex">Ekspor JSON</button></div>`)}
${cardx("System Configuration",`<div class="acts"><a class="btn ghost sm" href="#set">Buka General Settings</a></div>`)}</div>`};
V.agent=function(){const rows=ALLP.map(n=>{const o=S.emp[n]||{},m=S.providers.find(p=>p.id===o.model),c=CENTRAL.find(x=>x[0]===n),r=c?c[1]:(EMP.find(x=>x[0]===n)||[])[1];
return`<tr class="tap" data-a="emp" data-id="${e(n)}"><td>${pawnAv(n,20)}</td><td><b>${e(n)}</b><br><small>${e(r)}</small></td><td>${e(m?m.name:"belum dipilih")}</td><td>${(o.perms||[]).length}</td><td>${(o.projects||[]).length}</td></tr>`}).join("");
return head("Agent Management","Daftar 15 agent. Ketuk baris untuk profil, model, dan izin.")+`<div class="card tw"><table><tr><th></th><th>Agent</th><th>Model</th><th>Izin</th><th>Proyek</th></tr>${rows}</table></div>
<div class="cols">${cardx("Skills Management",wait("Menunggu integrasi. SKILL.md belum dibuat."),nc)}${cardx("Tools Configuration",wait("Menunggu integrasi."),nc)}${cardx("Memory Configuration",wait("Menunggu integrasi."),nc)}${cardx("Permission Overview",`<small>Izin dicatat di perangkat ini (belum ditegakkan server).</small><div class="acts"><a class="btn ghost sm" href="#sec">Matriks izin</a></div>`)}</div>`};
const TECH=[["HTML + CSS + JavaScript","Frontend","-","Terpasang","Diuji (npm test, e2e)","Semua halaman","Standar web","Rp0"],["IndexedDB","Penyimpanan","-","Aktif","Diuji","Semua data lokal","Standar browser","Rp0"],["Service Worker + PWA","Offline","-","Aktif","Diuji","Aplikasi","Standar web","Rp0"],["Python backend","Backend","-","Belum dipasang","Belum diuji","-","Belum diperiksa","Belum ditentukan"],["PostgreSQL","Database","-","Belum dipasang","Belum diuji","-","Belum diperiksa","Belum ditentukan"],["9Router","Routing model","-","Belum dipasang","Belum diuji","-","Belum diperiksa","Belum ditentukan"]];
V.tech=function(){return head("Technology Registry","Teknologi yang dipakai dan direncanakan. Tidak ada status karangan.")+`<div class="card tw"><table><tr><th>Teknologi</th><th>Kategori</th><th>Versi</th><th>Instalasi</th><th>Pengujian</th><th>Dipakai</th><th>Lisensi</th><th>Biaya</th></tr>${TECH.map(r=>`<tr>${r.map((c,i)=>i===3?`<td>${chip(c,c==="Belum dipasang"?"":"ok")}</td>`:`<td>${e(c)}</td>`).join("")}</tr>`).join("")}</table></div><small>Baris "Belum dipasang" adalah rencana; versi, lisensi, dan biaya diisi saat Setup Assistant memeriksa.</small>
<h3 class="sec">Riwayat perubahan</h3><div class="card"><div class="li"><span>v${APP_VERSION}: UI 4 menu, kantor virtual, Admin Center</span></div></div>`};
const _model=V.model;
V.model=function(){return _model()+`<h3 class="sec">Kuota, 9Router, dan cadangan</h3><div class="cols">${cardx("Kuota provider",wait("Belum tersedia."),nc)}${cardx("Integrasi 9Router",`<small>Konsep disiapkan: provider akan dipilih lewat routing. Tidak ada endpoint atau status koneksi yang dikarang; dicek dari dokumentasi saat integrasi.</small>`,nc)}${cardx("Fallback",`<small>Model cadangan diisi per provider (form di atas). Penegakan fallback menunggu backend.</small>`)}</div>`};
const _sec=V.sec;
V.sec=function(){return _sec()+`<h3 class="sec">Kredensial & approval</h3><div class="cols">${cardx("Credential Management",`<small>Tampilan ini tidak menyimpan API key. Kunci hanya akan hidup di backend (.env) pada fase berikutnya.</small>`,nc)}${cardx("Approval settings",`<small>Persetujuan CEO dicatat; kategori ada di Persetujuan.</small><div class="acts"><a class="btn ghost sm" href="#appr">Buka Persetujuan</a></div>`)}</div>`};
const _set=V.set;
V.set=function(){const c=S.settings.company||{},nt=S.settings.notif||{};
return _set()+`<h3 class="sec">Profil perusahaan & preferensi</h3><form id="fcp" class="card form"><label>Nama perusahaan<input name="name" value="${e(c.name||"Sadino Workplace")}"></label><label>Nama CEO<input name="ceo" value="${e(c.ceo||"")}"></label><button class="btn">Simpan profil</button></form>
<div class="card"><h3>Bahasa</h3><div class="chips"><button type="button" class="pill on">Indonesia</button><button type="button" class="pill" data-a="na" data-id="Bahasa Inggris belum tersedia">English</button></div></div>
<div class="card"><h3>Notifikasi</h3><div class="li"><span>Persetujuan baru</span><button type="button" class="pill ${nt.appr===false?"":"on"}" data-a="ntf" data-id="appr">${nt.appr===false?"Mati":"Aktif"}</button></div><div class="li"><span>Peringatan anggaran</span><button type="button" class="pill ${nt.budget===false?"":"on"}" data-a="ntf" data-id="budget">${nt.budget===false?"Mati":"Aktif"}</button></div><small>Tersimpan di perangkat. Notifikasi push butuh backend.</small></div>
<div class="card"><h3>Akun</h3><small>Mode lokal tanpa login. Akun dan peran pengguna menunggu backend.</small></div>`};
FORMS.fcp=async d=>{S.settings.company={name:(d.name||"").slice(0,60),ceo:(d.ceo||"").slice(0,60)};log(S,"CEO","Profil perusahaan diubah","");return"Profil disimpan"};

/* aksi baru */
document.addEventListener("click",async ev=>{const t=ev.target.closest&&ev.target.closest("[data-a]");if(!t)return;const a=t.dataset.a,id=t.dataset.id;
if(a==="hf"){F.hf=id;return render()}
if(a==="cd")return openSheet(SHEETS.cmd(id));
if(a==="ntf"){S.settings.notif=S.settings.notif||{};S.settings.notif[id]=S.settings.notif[id]===false;return commit()}});
