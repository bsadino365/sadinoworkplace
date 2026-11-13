/* Sadino Workplace v3.1.0 - tata letak kantor (hanya geometri, tanpa data operasional). Satuan: tile. */
var LAYOUT=(function(){
var rooms=[
{id:"dir",n:"AI Director Office",x0:0,y0:0,x1:11,y1:9,row:0},
{id:"lng",n:"Reception & Lounge",x0:13,y0:0,x1:24,y1:9,row:0},
{id:"set",n:"AI Setup Assistant Office",x0:25,y0:0,x1:36,y1:9,row:0},
{id:"res",n:"Research & Strategy",x0:0,y0:12,x1:10,y1:20,row:1},
{id:"cre",n:"Creative Studio",x0:12,y0:12,x1:24,y1:20,row:1},
{id:"eng",n:"Engineering Lab",x0:26,y0:12,x1:36,y1:20,row:1},
{id:"mkt",n:"Marketing Office",x0:0,y0:23,x1:7,y1:31,row:2},
{id:"dsg",n:"Design Studio",x0:9,y0:23,x1:16,y1:31,row:2},
{id:"sec",n:"Security Office",x0:18,y0:23,x1:25,y1:31,row:2},
{id:"mtg",n:"Meeting & Conference",x0:27,y0:23,x1:36,y1:31,row:2},
{id:"caf",n:"Cafeteria",x0:0,y0:34,x1:20,y1:42,row:3},
{id:"rec",n:"Recharge & Rest Zone",x0:22,y0:34,x1:36,y1:42,row:3}];
var corr=[[0,9,36,12],[0,20,36,23],[0,31,36,34]];
var CY=[10.5,21.5,32.5];
var doors={};
rooms.forEach(function(r){var top=r.row===0,cy=CY[r.row===0?0:r.row-1===0?0:r.row-1];
 var c=r.row===0?0:r.row-1; cy=CY[c];
 var x=(r.x0+r.x1)/2;
 doors[r.id]={x:x,cy:cy,iy:top?r.y1-.8:r.y0+.8}});
var seats={
"AI Director":{x:5.5,y:4.8,room:"dir"},"AI Setup Assistant":{x:30.5,y:4.8,room:"set"},
"ARUNA":{x:2.5,y:16,room:"res"},"NALAR":{x:5.5,y:16,room:"res"},"SMRITI":{x:8.5,y:16,room:"res"},
"KANSA":{x:14,y:16,room:"cre"},"NARA":{x:17,y:16,room:"cre"},"RUPA":{x:20,y:16,room:"cre"},"VEDA":{x:23,y:16,room:"cre"},
"AKSARA":{x:28,y:16,room:"eng"},"CAKRA":{x:31,y:16,room:"eng"},"DHARA":{x:34,y:16,room:"eng"},
"SAGARA":{x:3.5,y:27.5,room:"mkt"},"LARAS":{x:12.5,y:27.5,room:"dsg"},"RAKSA":{x:21.5,y:27.5,room:"sec"}};
/* spot: [x,y,z]; sofa=Lounge, caf=Cafeteria, pod=Recharge, meet=Meeting */
var spots={
sofa:[[15.8,5,.35],[18.5,5,.35],[21.2,5,.35]],
caf:[[4,39,0],[8,39,0],[12,39,0],[16,39,0]],
pod:[[25,39,.16],[28,39,.16],[31,39,.16],[34,39,.16]],
meet:[[29,25.5,0],[31.5,25.5,0],[34,25.5,0],[29,29,0],[31.5,29,0],[34,29,0]]};
var spotRoom={sofa:"lng",caf:"caf",pod:"rec",meet:"mtg"};
return{W:36,D:42,rooms:rooms,corr:corr,doors:doors,seats:seats,spots:spots,spotRoom:spotRoom,spine:25.5};
})();
if(typeof module!=="undefined")module.exports=LAYOUT;
