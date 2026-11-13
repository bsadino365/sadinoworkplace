const assert=require("assert");const L=require("../frontend/logic.js");
const S=L.ensureState();
const P=L.addProject(S,{name:"Bawaulin.cash",type:"software",budget:"1000000"});assert.equal(P.budget,1000000);assert.equal(P.status,"Aktif");
const t=L.addTask(S,{title:"Buat web",projectId:P.id,owner:"AKSARA"});assert.equal(t.status,"Pending");
const a=L.requestApproval(S,{category:"Deployment produksi",action:"Deploy",why:"x",impact:"y",risk:"z",taskId:t.id});assert.equal(S.tasks[0].status,"Waiting Approval");
assert.equal(L.decide(S,a.id,true).status,"Disetujui");assert.equal(S.tasks[0].status,"Approved");assert.equal(L.decide(S,a.id,false),null);
assert.equal(S.kb.filter(k=>k.type==="CEO Decision Memory").length,1,"keputusan masuk memori CEO");
assert.equal(L.setStatus(S,t.id,"Ngawur"),null);L.setStatus(S,t.id,"Completed");assert.equal(L.stats(S).pct,100);
// knowledge versi
const k=L.addKB(S,{title:"a",body:"b",type:"Project Memory"});assert.equal(k.version,1);assert.equal(k.type,"Project Memory");assert.equal(L.addKB(S,{title:"x",body:"y",type:"ngawur"}).type,"Knowledge Base");
L.editKB(S,k.id,{title:"a2",body:"b2"});assert.equal(k.version,2);assert.equal(k.versions[0].title,"a");assert.equal(L.editKB(S,k.id,{title:"",body:"x"}),null);
// command
assert.equal(L.addCommand(S,{text:"  "}),null);const c=L.addCommand(S,{text:"Buat website",projectId:P.id});assert.equal(c.status,"Menunggu Direktur");
assert.equal(L.commandToTask(S,c.id).status,"Pending");assert.equal(c.status,"Jadi tugas");assert.equal(L.commandToTask(S,c.id),null);
assert.equal(L.commandToTask(S,L.addCommand(S,{text:"tanpa proyek"}).id),null);
// provider tidak boleh berisi secret & tidak pernah "Terhubung" dari frontend
assert.equal(L.addProvider(S,{name:"X",model:"sk-abcdefghijklmnop1234"}),null);
const pv=L.addProvider(S,{name:"Prov A",kind:"Google"});assert.equal(pv.status,"Belum Terhubung");assert.equal(pv.enabled,false);assert.equal(L.toggleProvider(S,pv.id).enabled,true);
// aktivasi karyawan
assert.equal(L.activation(S,"AKSARA").ok,false);L.setEmp(S,"AKSARA",{model:pv.id,perms:["read_proj"],projects:[P.id]});
let ac=L.activation(S,"AKSARA");assert.equal(ac.ok,false,"belum aktif tanpa koneksi nyata");assert.equal(ac.checks.filter(x=>x[1]).length,3);
assert.equal(L.activeEmployees(S,["AKSARA","CAKRA"]),0);pv.status="Terhubung";assert.equal(L.activation(S,"AKSARA").ok,true);pv.status="Belum Terhubung";
assert(L.removeProvider(S,pv.id));assert.equal(S.emp.AKSARA.model,"");
// anggaran
assert.equal(L.budgetState(S).level,"none");assert.equal(L.setBudget(S,1000,200),null);L.setBudget(S,1000,80);
assert.equal(L.addExpense(S,{label:"x",amount:0}),null);L.addExpense(S,{label:"API",amount:500,projectId:P.id});assert.equal(L.budgetState(S).level,"ok");
L.addExpense(S,{label:"Server",amount:350});assert.equal(L.budgetState(S).level,"warn");L.addExpense(S,{label:"Est",amount:9999,kind:"Estimasi"});assert.equal(L.budgetState(S).actual,850);assert.equal(L.budgetState(S).est,9999);
L.addExpense(S,{label:"Lagi",amount:200});assert.equal(L.budgetState(S).level,"over");assert.equal(L.projectStats(S,P.id).spent,500);
// secret
assert(L.secretScan("ghp_"+"a".repeat(30)));assert(!L.secretScan("halo dunia"));assert(L.secretScan('api_key: "abcdefghijkl12"'));
// audit
assert(S.audit.length>5);assert(S.audit.every(x=>x.at&&x.act));
// kompatibilitas data lama v1.0/1.1
const o=L.ensureState({projects:[{id:"P9"}],tasks:[1],kb:[{id:"K",title:"t",body:"b"}]});assert.deepEqual(o.files,[]);assert.equal(o.projects[0].status,"Aktif");assert.equal(o.kb[0].type,"Knowledge Base");assert.equal(o.budget.warn,80);assert.equal(L.ensureState().kb.length,0);
// file
assert(L.validFile({name:"a",size:0}));assert(L.validFile({name:"a",size:99999999}));assert.equal(L.validFile({name:"a.pdf",size:10}),"");
assert.equal(L.category("x.zip"),"ZIP");assert.equal(L.category("a.png","image/png"),"Gambar");assert.equal(L.category("a.js"),"Source code");
const m1=L.addFileMeta(S,{name:"a.pdf",size:10,type:"application/pdf"},{projectId:P.id}),m2=L.addFileMeta(S,{name:"a.pdf",size:12,type:"application/pdf"},{projectId:P.id});
assert.equal(m2.version,2);assert.equal(m1.folder,"07_Deliverables");assert.equal(L.filterFiles(S.files,"PDF",P.id).length,2);assert.equal(L.filterFiles(S.files,"zzz","").length,0);assert.equal(L.filterFiles(S.files,"","P2").length,0);
console.log("logic OK");
{const bad=L.ensureState({projects:[{id:'x"><img src=x onerror=alert(1)>',name:'A'},{id:"P1",name:"ok"}],tasks:"bukan array",emp:{"<b>":{},ARUNA:{model:""}},routing:{Riset:'"><x>'}});
assert.equal(bad.projects.length,1);assert.equal(bad.tasks.length,0);assert(!("<b>" in bad.emp));assert(!bad.routing.Riset);console.log("impor jahat dibersihkan OK")}
