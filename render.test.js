const vm=require("vm"),fs=require("fs"),assert=require("assert");
const el={innerHTML:"",textContent:"",hidden:true,setAttribute(){}};
const ctx={document:{querySelector:()=>el,addEventListener(){},documentElement:el},window:{addEventListener(){}},location:{hash:""},navigator:{},indexedDB:{open(){throw new Error("x")}},setTimeout,clearTimeout,console,FormData:class{}};
vm.createContext(ctx);vm.runInContext(fs.readFileSync(__dirname+"/../frontend/logic.js","utf8"),ctx);for(const f of ["version","office-layout","office","app","pages"])vm.runInContext(fs.readFileSync(__dirname+"/../frontend/"+f+".js","utf8"),ctx);
vm.runInContext("S.projects.push({id:'P1',name:'<b>X</b>',type:'software',status:'Aktif',budget:0});addTask(S,{title:'T',projectId:'P1',owner:'CAKRA'});addKB(S,{title:'<i>k</i>',body:'b'});",ctx);
const MODS=["kin","has","adm","aiset","agent","tech","dash","cmd","org","emp","task","proj","files","kb","model","gh","appr","fin","sec","set"];
for(const k of MODS){const h=vm.runInContext(`V.${k}()`,ctx);assert(h.length>100,k);assert(!h.includes("undefined"),k+" memuat 'undefined'")}
for(const x of ["V.proj()","V.kb()","V.gh()"]){const h=vm.runInContext(x,ctx);assert(!h.includes("<b>X</b>")&&!h.includes("<i>k</i>"),"XSS "+x)}
const sh=vm.runInContext("SHEETS.emp('AKSARA')()+SHEETS.proj('P1')()+SHEETS.more()+SHEETS.kb(S.kb[0].id)()",ctx);assert(sh.includes("Syarat aktivasi")&&!sh.includes("<b>X</b>"));
assert(vm.runInContext("MODS.length",ctx)===20);
assert(vm.runInContext("OF.BOTS.length",ctx)===15);
const kinH=vm.runInContext("V.kin()",ctx);assert(kinH.includes("ofc")&&kinH.includes("id=\"b14\""),"kantor memuat 15 robot");
assert(vm.runInContext("SHEETS.emp('AI Director')()",ctx).includes("Chief AI Coordinator"));
assert(vm.runInContext("SHEETS.emp('ARUNA')()",ctx).includes("Skills"));
vm.runInContext("render()",ctx);
console.log("render OK (20 modul + 4 sheet, XSS di-escape)");
