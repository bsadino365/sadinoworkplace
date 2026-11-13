const vm=require("vm"),fs=require("fs"),assert=require("assert");
const el={innerHTML:"",textContent:"",hidden:true};
const ctx={document:{querySelector:()=>el,addEventListener(){}},window:{addEventListener(){}},location:{hash:""},navigator:{},indexedDB:{open(){throw new Error("x")}},setTimeout,console,FormData:class{}};
vm.createContext(ctx);vm.runInContext(fs.readFileSync(__dirname+"/../frontend/logic.js","utf8"),ctx);vm.runInContext(fs.readFileSync(__dirname+"/../frontend/app.js","utf8"),ctx);
vm.runInContext("S.projects.push({id:'P1',name:'<b>X</b>',type:'software'});addTask(S,{title:'T',projectId:'P1',owner:'CAKRA'});",ctx);
for(const k of ["dash","emp","proj","task","appr","kb","files","int","set"]){const h=vm.runInContext(`V.${k}()`,ctx);assert(h.length>20,k)}
assert(!vm.runInContext("V.proj()",ctx).includes("<b>X</b>"));console.log("render OK (9 tampilan, XSS di-escape)");
