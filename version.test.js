const fs=require("fs"),assert=require("assert"),vm=require("vm");
const c={};vm.createContext(c);vm.runInContext(fs.readFileSync(__dirname+"/../frontend/version.js","utf8"),c);
assert.equal(c.APP_VERSION,require("../package.json").version,"versi version.js dan package.json harus sama");
const sw=fs.readFileSync(__dirname+"/../frontend/sw.js","utf8");assert(sw.includes('importScripts("version.js")'));
for(const f of ["version.js","logic.js","office.js","app.js","pages.js"])assert(sw.includes('"'+f+'"'),f+" belum di cache SW");
console.log("versi sinkron:",c.APP_VERSION);
