/* Sadino Workplace v3: Kantor virtual 2.5D (SVG + CSS, tanpa library).
   Bawaan: semua karyawan "Belum terhubung" dan hanya bernapas/berkedip (hidup ambient).
   Status dan simulasi berjalan hanya sebagai PRATINJAU DEMO, bukan aktivitas AI nyata. */
const OF=(function(){
const OX=1018,OY=50,TW=24,TH=12,ZH=24,WW=1900,WH=1020;const LY=LAYOUT;
const N=(x,y,z)=>[OX+(x-y)*TW,OY+(x+y)*TH-(z||0)*ZH];
const J=(x,y,z)=>N(x,y,z).map(v=>v.toFixed(1)).join(",");
const poly=(p,st,cls)=>`<polygon points="${p.map(q=>J(q[0],q[1],q[2])).join(" ")}" ${cls?`class="${cls}"`:""} style="${st||""}"/>`;
const R=(a,b,c,d,z)=>[[a,b,z],[c,b,z],[c,d,z],[a,d,z]];
function box(x,y,w,d,z,t,l,r){return poly([[x+w,y,0],[x+w,y+d,0],[x+w,y+d,z],[x+w,y,z]],`fill:${r||"var(--o-r)"}`)+poly([[x,y+d,0],[x+w,y+d,0],[x+w,y+d,z],[x,y+d,z]],`fill:${l||"var(--o-l)"}`)+poly([[x,y,z],[x+w,y,z],[x+w,y+d,z],[x,y+d,z]],`fill:${t||"var(--o-t)"}`)}

/* 15 posisi: warna, bentuk kepala, aksesori unik */
const HEAD={r:'<rect x="-6.5" y="-29" width="13" height="11" rx="3.5"/>',sq:'<rect x="-6" y="-29" width="12" height="11" rx="1.6"/>',w:'<rect x="-7.5" y="-28" width="15" height="9.6" rx="4.6"/>',o:'<ellipse cx="0" cy="-23.4" rx="6.6" ry="5.9"/>',t:'<rect x="-5.6" y="-30" width="11.2" height="12.4" rx="4.2"/>'};
const ANT=a=>`<line x1="0" y1="-29" x2="0" y2="-32.4" stroke="#596682" stroke-width="1"/><circle class="ant" cx="0" cy="-33.4" r="1.6" fill="${a}"/>`;
const BOTS=[
{n:"AI Director",c:"#22365e",a:"#d9b56b",h:"r",tw:12,s:1.14,pre:'',post:'<path d="M-5.6 -29 L-5.6 -34.4 L-2.8 -31.3 L0 -35.6 L2.8 -31.3 L5.6 -34.4 L5.6 -29Z" fill="#d9b56b" stroke="#8a6a1c" stroke-width=".6"/><path d="M0 -17.5 L-2 -14.5 L0 -8 L2 -14.5Z" fill="#d9b56b"/>'},
{n:"AI Setup Assistant",c:"#3b6ea8",a:"#ffd27a",h:"sq",tw:11,s:1.08,pre:'',post:'<path d="M-7.4 -28.6 Q-7.4 -35 0 -35 Q7.4 -35 7.4 -28.6Z" fill="#f2a33a" stroke="#a5600d" stroke-width=".6"/><rect x="-8.2" y="-29.4" width="16.4" height="1.9" rx=".9" fill="#f2a33a"/><rect x="-1" y="-36" width="2" height="2" fill="#f2a33a"/><path d="M-2.6 -10 L2.4 -15.4" stroke="#fff" stroke-width="1.7"/><circle cx="3" cy="-16" r="1.7" fill="none" stroke="#fff" stroke-width="1"/>'},
{n:"ARUNA",c:"#19a39a",a:"#bff5ef",h:"o",pre:ANT("#bff5ef"),post:'<g class="prop"><circle cx="10" cy="-12" r="3.1" fill="#bff5ef55" stroke="#0e5f59" stroke-width="1"/><line x1="12.2" y1="-9.8" x2="14.2" y2="-7.4" stroke="#0e5f59" stroke-width="1.5" stroke-linecap="round"/></g>'},
{n:"NALAR",c:"#7c5cf0",a:"#e4dcff",h:"sq",pre:ANT("#e4dcff"),post:'<rect x="-5.8" y="-25.4" width="4.8" height="3.8" rx="1.3" fill="none" stroke="#3b2a8f" stroke-width=".9"/><rect x="1" y="-25.4" width="4.8" height="3.8" rx="1.3" fill="none" stroke="#3b2a8f" stroke-width=".9"/><line x1="-1" y1="-23.5" x2="1" y2="-23.5" stroke="#3b2a8f" stroke-width=".8"/><rect x="-3.6" y="-12" width="1.9" height="3" fill="#fff"/><rect x="-.9" y="-14.4" width="1.9" height="5.4" fill="#fff"/><rect x="1.8" y="-16" width="1.9" height="7" fill="#fff"/>'},
{n:"SAGARA",c:"#3fb950",a:"#d6ffd9",h:"w",pre:'<path d="M0 -28 V-33.5" stroke="#596682" stroke-width="1"/><path d="M-2.4 -31.2 L0 -34.6 L2.4 -31.2" fill="none" stroke="#3fb950" stroke-width="1.3" stroke-linejoin="round"/>',post:'<circle cx="-.8" cy="-13.6" r="2.6" fill="none" stroke="#fff" stroke-width="1.2"/><line x1="1.2" y1="-11.6" x2="3.4" y2="-9.4" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>'},
{n:"KANSA",c:"#e05a8a",a:"#ffe0ec",h:"r",pre:'',post:'<ellipse cx="-1.6" cy="-30" rx="7.4" ry="3" fill="#8a2a52" transform="rotate(-10 -1.6 -30)"/><circle cx="-1" cy="-33" r="1.1" fill="#8a2a52"/><path d="M10 -9 L14 -16" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/><path d="M9.4 -8 L10 -9.6 L10.9 -8.6Z" fill="#8a2a52"/>'},
{n:"NARA",c:"#f08a3c",a:"#fff0dc",h:"o",pre:'',post:'<path d="M-7.8 -23 Q-7.8 -33.6 0 -33.6 Q7.8 -33.6 7.8 -23" fill="none" stroke="#3a2a14" stroke-width="1.7"/><rect x="-9.4" y="-26.4" width="3.2" height="6.4" rx="1.4" fill="#f08a3c" stroke="#3a2a14" stroke-width=".6"/><rect x="6.2" y="-26.4" width="3.2" height="6.4" rx="1.4" fill="#f08a3c" stroke="#3a2a14" stroke-width=".6"/><path d="M-8.2 -20 Q-8 -16.6 -4 -16.6" fill="none" stroke="#3a2a14" stroke-width="1"/><circle cx="-3.6" cy="-16.6" r="1.1" fill="#3a2a14"/>'},
{n:"RUPA",c:"#d046c7",a:"#ffe0fb",h:"t",pre:'',post:'<g class="orb"><ellipse cx="0" cy="-34" rx="7" ry="2.2" fill="none" stroke="#d046c7" stroke-width=".8" opacity=".6"/><circle cx="7" cy="-34" r="1.7" fill="#d046c7"/></g><path d="M-4 -13 Q-1.5 -17 1 -13 T6 -13" fill="none" stroke="#fff" stroke-width="1.3" stroke-linecap="round"/>'},
{n:"VEDA",c:"#3aa7e8",a:"#dff2ff",h:"r",pre:'',post:'<path d="M-7 -28.6 Q-7 -33.6 0 -33.6 Q7 -33.6 7 -28.6Z" fill="#1d6fa8"/><rect x="-1" y="-30.2" width="10" height="1.7" rx=".8" fill="#1d6fa8"/><g class="prop"><rect x="9" y="-14" width="6.4" height="5" fill="#1b2434"/><path d="M9 -14 L15.4 -16.2 L15.4 -14Z" fill="#fff"/></g>'},
{n:"LARAS",c:"#8f9bf5",a:"#eef0ff",h:"w",pre:ANT("#eef0ff"),post:'<path d="M7.4 -25.6 L10.4 -31" stroke="#f5c542" stroke-width="1.7" stroke-linecap="round"/><circle cx="-3.4" cy="-13.6" r="1.4" fill="#ff7a7a"/><circle cx=".4" cy="-15" r="1.4" fill="#ffe27a"/><circle cx="3.4" cy="-11.6" r="1.4" fill="#7affc1"/>'},
{n:"AKSARA",c:"#12b886",a:"#d3fff0",h:"w",tw:11,pre:'',post:'<path d="M-8.4 -19 Q-8.6 -34 0 -34 Q8.6 -34 8.4 -19 L6.8 -19 Q6.8 -31.6 0 -31.8 Q-6.8 -31.6 -6.8 -19Z" fill="#0b7d5b"/><text x="0" y="-9.6" font-size="6" text-anchor="middle" fill="#fff" font-family="monospace" font-weight="700" style="fill:#fff;stroke:none">&lt;/&gt;</text>'},
{n:"CAKRA",c:"#b9c235",a:"#f8fbd0",h:"sq",pre:'<line x1="0" y1="-29" x2="0" y2="-32" stroke="#596682" stroke-width="1"/><circle class="ant" cx="0" cy="-34" r="2.3" fill="#e5484d"/><circle cx="-.8" cy="-34.6" r=".5" fill="#222"/><circle cx=".9" cy="-33.4" r=".5" fill="#222"/>',post:'<circle cx="0" cy="-12.6" r="3.4" fill="#fff"/><path d="M-1.7 -12.6 L-.4 -11.2 L2 -14.2" fill="none" stroke="#6d741d" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>'},
{n:"RAKSA",c:"#e5484d",a:"#fff1f1",h:"sq",tw:11,pre:'<path d="M-6.6 -29 Q0 -36 6.6 -29Z" fill="#b3282d"/><rect x="-7" y="-26.4" width="14" height="4.4" rx="2.2" fill="#2b0f12" opacity=".88"/>',post:'<path d="M0 -17 L4.4 -15.4 L4.4 -11.6 Q4.4 -9 0 -7.8 Q-4.4 -9 -4.4 -11.6 L-4.4 -15.4Z" fill="#fff" opacity=".92"/>'},
{n:"DHARA",c:"#5f7a99",a:"#e0ecf8",h:"sq",tw:12,pre:'',post:'<g class="spin"><circle cx="0" cy="-33.2" r="3.3" fill="#8da2bf" stroke="#3d4f69" stroke-width=".7"/><rect x="-.8" y="-37.4" width="1.6" height="2" fill="#8da2bf"/><rect x="-.8" y="-31" width="1.6" height="2" fill="#8da2bf"/><rect x="-5.4" y="-34" width="2" height="1.6" fill="#8da2bf"/><rect x="3.4" y="-34" width="2" height="1.6" fill="#8da2bf"/><circle cx="0" cy="-33.2" r="1.2" fill="#fff"/></g><path d="M-3.4 -10 Q-4.6 -13 -2 -13.4 Q-1.4 -16 1.4 -15 Q4.4 -15 4 -11.8 Q5 -10 3.4 -10Z" fill="#fff"/>'},
{n:"SMRITI",c:"#a77b4f",a:"#ffe9c9",h:"o",pre:'',post:'<path d="M-8.4 -29.4 L0 -33.8 L8.4 -29.4 L0 -26Z" fill="#4a2f17"/><rect x="-4.6" y="-29" width="9.2" height="2.6" fill="#4a2f17"/><path d="M8.4 -29.4 V-24.6" stroke="#e5b84a" stroke-width=".9"/><circle cx="8.4" cy="-24" r="1" fill="#e5b84a"/><g class="prop"><rect x="9" y="-13.4" width="6" height="4.6" fill="#e5b84a" stroke="#8a6a1c" stroke-width=".6"/><line x1="12" y1="-13.4" x2="12" y2="-8.8" stroke="#8a6a1c" stroke-width=".6"/></g>'}
];
const ST=[["nc","Belum terhubung","#93a0b8"],["healthy","Healthy","#58c28f"],["working","Working","#7fa6f5"],["overloaded","Overloaded","#e8975a"],["resting","Resting","#b48cf0"],["lowquota","Low Quota","#e8c14f"],["limit","Limit Reached","#e05c5c"],["cooldown","Cooldown","#5cc2d8"],["idle","Idle","#93a0b8"],["offline","Offline","#4b5468"]];
const STC=Object.fromEntries(ST.map(s=>[s[0],s]));
const ACTS={work:["working","Bekerja"],stretch:["stretch","Peregangan"],rest:["resting","Beristirahat"],recharge:["recharge","Recharge"],wait:["waiting","Menunggu rapat"],idle:["idle","Idle"],walk:["walk","Berjalan"]};
const ACOL={working:"#7fa6f5",stretch:"#7fa6f5",resting:"#b48cf0",recharge:"#58c28f",waiting:"#5cc2d8",idle:"#93a0b8",walk:"#93a0b8"};

function bot(i,o){o=o||{};const b=BOTS[i],tw=b.tw||10,hw=tw/2,a=b.a,s=b.s||1;
const fx=`<g class="fx fx-z"><text x="8" y="-30">z</text><text x="11" y="-36" style="font-size:7px">Z</text></g>
<g class="fx fx-w"><rect x="7" y="-42" width="15" height="8" rx="4" fill="#fff" stroke="#93a0b8" stroke-width=".7"/><circle class="d1" cx="11" cy="-38" r="1" fill="#445"/><circle class="d2" cx="14.5" cy="-38" r="1" fill="#445"/><circle class="d3" cx="18" cy="-38" r="1" fill="#445"/></g>
<g class="fx fx-bolt"><path d="M10 -28 L6.6 -22.6 L9.4 -22.6 L7 -17.4 L12.6 -24 L9.6 -24Z" fill="#ffd54a" stroke="#a37b00" stroke-width=".5"/></g>
<g class="fx fx-steam"><circle class="p1" cx="-4" cy="-37" r="1.8" fill="#ff8a5c"/><circle class="p2" cx="1" cy="-38" r="2.2" fill="#ff8a5c"/><circle class="p3" cx="5" cy="-37" r="1.7" fill="#ff8a5c"/></g>
<g class="fx fx-snow"><g class="sn"><path d="M0 -37 v-8 M-3.5 -39 l7 4 M3.5 -39 l-7 4" stroke="#5cc2d8" stroke-width="1.3" stroke-linecap="round" fill="none" transform="translate(0 5)"/></g></g>
<g class="fx fx-warn"><circle cx="9" cy="-33" r="4.4" fill="#e05c5c"/><text x="9" y="-30.6" text-anchor="middle" style="fill:#fff;font-size:7px;font-weight:700">!</text></g>
<g class="fx fx-batt"><rect x="-7" y="-41" width="13" height="6.4" rx="1.4" fill="none" stroke="#9fb0cc" stroke-width="1"/><rect x="6.4" y="-39.2" width="1.6" height="3" fill="#9fb0cc"/><rect class="bf" x="-6" y="-40" width="11" height="4.4" rx=".8" fill="#58c28f"/></g>
<path class="fx fx-x" d="M-4.6 -25.6 l3.8 3.8 m0 -3.8 l-3.8 3.8 M.8 -25.6 l3.8 3.8 m0 -3.8 l-3.8 3.8" stroke="#e05c5c" stroke-width="1.2" fill="none"/>`;
const arm=(sx)=>`<g class="${sx<0?"ar1":"ar2"}" style="transform-origin:${sx*(hw+1.2)}px -16.4px"><rect x="${sx<0?-hw-2.5:hw}" y="-17" width="2.5" height="8.4" rx="1.25" fill="${b.c}"/></g>`;
const body=`<g class="bd"><g class="lg"><rect class="l1" x="-4.2" y="-8" width="3.2" height="8" rx="1.3" fill="#45506a" style="transform-origin:-2.6px -8px"/><rect class="l2" x="1" y="-8" width="3.2" height="8" rx="1.3" fill="#45506a" style="transform-origin:2.6px -8px"/></g>
<rect x="${-hw}" y="-18" width="${tw}" height="11" rx="2.6" fill="${b.c}"/>${arm(-1)}${arm(1)}
<g class="hd" style="transform-origin:0 -18px"><g fill="#eef2fa" stroke="#596682" stroke-width=".9">${HEAD[b.h]}</g>${b.pre}<g class="eyes" style="transform-origin:0 -23.5px"><circle cx="-2.7" cy="-23.6" r="1.7" fill="${i<2||true?(b.c==="#22365e"?"#d9b56b":b.c):"#333"}"/><circle cx="2.7" cy="-23.6" r="1.7" fill="${b.c==="#22365e"?"#d9b56b":b.c}"/></g>${b.post}</g>${o.avatar?"":fx}</g>`;
if(o.avatar)return `<svg class="pawn" viewBox="-13 -42 26 46" width="${o.avatar}" height="${Math.round(o.avatar*1.77)}" aria-hidden="true"><g class="bot a-nc" style="--d:0s"><g transform="scale(${s})">${body}</g></g></svg>`;
const p=o.p;return `<g class="bot a-nc" id="b${i}" data-a="emp" data-id="${b.n}" tabindex="0" role="button" aria-label="${b.n}" style="--d:${(-i*.41).toFixed(2)}s" transform="translate(${p[0].toFixed(1)},${p[1].toFixed(1)})"><ellipse class="shd" rx="9" ry="3.4"/><ellipse class="ring" rx="11.5" ry="4.8"/><g transform="scale(${s})">${body}</g><rect class="hit" x="-14" y="-42" width="28" height="58" fill="transparent"/></g>`}

/* tata letak v3.1.0: data di office-layout.js */
const SEATS=LY.seats,SP=LY.spots;
const seat=i=>{const s=SEATS[BOTS[i].n];return[s.x,s.y,0]};
const PL=(x,y)=>{const p=N(x,y,.5);return`<g>${box(x-.2,y-.2,.4,.4,.38,"#7a5a3a","#6a4c30","#573e27")}<g transform="translate(${p[0].toFixed(1)} ${(p[1]-1).toFixed(1)})"><g class="pl"><path d="M0 0 Q-9 -8 -8 -18 Q-2 -12 0 0Z" fill="#3fa05a"/><path d="M0 0 Q9 -9 7 -19 Q2 -12 0 0Z" fill="#35894c"/><path d="M0 0 Q-1 -12 1 -22 Q4 -11 0 0Z" fill="#4fbf6d"/></g></g></g>`};
const GL="fill:var(--o-win);fill-opacity:.4;stroke:#1b2438;stroke-width:1";
function office(){
const items=[];let s="";const add=(k,h)=>items.push([k,h]);const Wh=1.9;
s+=poly(R(0,0,LY.W,LY.D,0),"fill:var(--o-f1)");
s+=poly([[0,0,0],[LY.W,0,0],[LY.W,0,Wh],[0,0,Wh]],"fill:var(--o-w2)")+poly([[0,0,0],[0,LY.D,0],[0,LY.D,Wh],[0,0,Wh]],"fill:var(--o-w1)");
for(let x=1;x<LY.W-2;x+=4.5)s+=poly([[x,0,.5],[x+3,0,.5],[x+3,0,1.6],[x,0,1.6]],"fill:var(--o-win);stroke:var(--o-w3);stroke-width:1.2");
for(let y=1;y<LY.D-2;y+=4.5)s+=poly([[0,y,.5],[0,y+3,.5],[0,y+3,1.6],[0,y,1.6]],"fill:var(--o-win);stroke:var(--o-w3);stroke-width:1.2");
const late=[];
LY.rooms.forEach(r=>{const d=LY.doors[r.id],c=(r.x0+r.x1)/2,lp=N(c,r.y0+1.2);
s+=poly(R(r.x0,r.y0,r.x1,r.y1,0),"fill:var(--o-f2)")+poly([[r.x0+1,r.y0,0],[r.x0+4,r.y0,0],[r.x0+7,r.y0+5,0],[r.x0+4,r.y0+5,0]],"fill:#fff;fill-opacity:.08");
s+=`<text class="zl" x="${lp[0].toFixed(1)}" y="${lp[1].toFixed(1)}" text-anchor="middle">${r.n}</text>`;
const seg=(y,x0,x1)=>poly([[x0,y,0],[x1,y,0],[x1,y,1.3],[x0,y,1.3]],GL);
if(r.row===0){late.push(seg(r.y1,r.x0,c-1),seg(r.y1,c+1,r.x1))}else{s+=seg(r.y0,r.x0,c-1)+seg(r.y0,c+1,r.x1)}
s+=poly([[r.x0,r.y0,0],[r.x0,r.y1,0],[r.x0,r.y1,1.3],[r.x0,r.y0,1.3]],GL)});
/* meja kerja */
BOTS.forEach((b,i)=>{const st=SEATS[b.n],big=i<2,w=big?3.4:2.2,x=st.x-w/2,y=st.y-1.45,mx=st.x-.5,my=y+.82,hh=big?.9:.7;
const scr=(xx)=>poly([[xx,my,.34],[xx+1,my,.34],[xx+1,my,.34+hh*.8],[xx,my,.34+hh*.8]],"fill:#0d1426;stroke:#596682;stroke-width:.8","scr");
const ln=[0,1,2].map(k=>{const a=N(mx+.1,my,.34+hh*.7-k*.14),e=N(mx+.9-(k===1?.2:0),my,.34+hh*.7-k*.14);return`<line class="ln" style="--k:${k}" x1="${a[0]}" y1="${a[1]}" x2="${e[0]}" y2="${e[1]}"/>`}).join("");
add(x+y+w+.9,`<g class="dsk" id="d${i}">${box(x,y,w,.9,.34,big?"var(--o-t2)":"var(--o-t)")}<g class="mon" id="m${i}">${scr(mx)}${ln}</g>${big?`<g>${poly([[mx+1.3,my,.34],[mx+2.3,my,.34],[mx+2.3,my,1],[mx+1.3,my,1]],"fill:#0d1426;stroke:#596682;stroke-width:.8")}</g>`:""}</g>`)});
/* furnitur ruang */
add(8,`<g>${box(9.2,.6,.6,.7,1.15,"#2b3a5c","#1f2b46","#18223a")}</g>`);
add(40,`<g>${box(27,.6,.6,.7,1.15,"#2b3a5c","#1f2b46","#18223a")}${[0,1,2].map(k=>{const p=N(27.3,1.32,.95-k*.26);return`<circle class="led" cx="${p[0]+4}" cy="${p[1]-2.3}" r="1.2"/>`}).join("")}</g>`);
add(20,`<g>${box(14.5,4.6,8.4,.75,.34,"#4b5d8a","#3a4a72","#2e3b5c")}${box(14.5,4.6,8.4,.22,.62,"#4b5d8a","#3a4a72","#2e3b5c")}</g>`);
add(17,`<g>${box(16,1.4,4,.8,.5,"var(--o-t2)")}</g>`);
add(60,`<g>${box(28.5,26.6,6,1.4,.32,"var(--o-t2)")}</g>`);
SP.meet.forEach(m=>add(m[0]+m[1]-.05,`<g>${box(m[0]-.28,m[1]-.28,.56,.56,.22,"var(--o-ch)","var(--o-l)","var(--o-r)")}</g>`));
[[3,36.6],[8,36.6],[13,36.6]].forEach(t=>add(t[0]+t[1]+1,`<g>${box(t[0],t[1],2.6,.9,.34,"var(--o-t)")}</g>`));
add(36,`<g>${box(1,34.8,9,.9,.55,"#8b97b3","#6f7b97","#59647c")}<g class="stm" transform="translate(${N(2.4,35.2,.95)[0].toFixed(1)} ${N(2.4,35.2,.95)[1].toFixed(1)})"><path class="s1" d="M0 0 q-2 -4 0 -7"/><path class="s2" d="M3 0 q-2 -4 0 -7"/></g></g>`);
SP.pod.forEach((p,k)=>add(p[0]+p[1]+.3,`<g class="pod" id="pd${k}">${box(p[0]-.38,p[1]-.38,.76,.76,.16,"#2e3b5c","#243049","#1c2640")}<polygon class="pg" points="${R(p[0]-.26,p[1]-.26,p[0]+.26,p[1]+.26,.17).map(q=>J(q[0],q[1],q[2])).join(" ")}"/></g>`));
[[.6,.6],[12,1.2],[.5,9.8],[24.6,9.6],[35.4,9.6],[11.3,20.5],[35.4,22],[.5,22],[.5,32.5],[35.5,32.5],[20.8,41],[1,41]].forEach(p=>add(p[0]+p[1]+.5,PL(p[0],p[1])));
items.sort((a,b)=>a[0]-b[0]);
return s+items.map(x=>x[1]).join("")+late.join("")}

/* simulasi */
const SIM={on:false,raf:0,R:[],last:0,acc:0,occ:{sofa:{},caf:{},pod:{},meet:{}},mode:"nc",zoom:0,sort:0,cnt:0};
function initR(){SIM.R=BOTS.map((b,i)=>{const p=seat(i);return{i,x:p[0],y:p[1],z:0,path:[],act:"idle",t:0,away:null,after:null}})}
initR();
const reduced=()=>typeof matchMedia!=="undefined"&&matchMedia("(prefers-reduced-motion:reduce)").matches;
function pos(r){const p=N(r.x,r.y,r.z);return p}
function route(r,kind,k){const sp=SP[kind][k],A=LY.doors[SEATS[BOTS[r.i].n].room],B=LY.doors[LY.spotRoom[kind]];
const pts=[[A.x,A.iy],[A.x,A.cy]];if(A.cy!==B.cy)pts.push([LY.spine,A.cy],[LY.spine,B.cy]);pts.push([B.x,B.cy],[B.x,B.iy],[sp[0],sp[1]]);return{pts,z:sp[2]||0}}
function free(kind,n){const o=SIM.occ[kind],a=[];for(let k=0;k<n;k++)if(!o[k])a.push(k);return a}
function setAct(r,act){r.act=act;const el=document.getElementById("b"+r.i);if(!el)return;const st=ACTS[act]?ACTS[act][0]:"idle";
el.setAttribute("class","bot a-"+(act==="walk"?"idle":st)+(act==="walk"?" w":"")+(SIM.on?" sim":""));
const ring=el.querySelector(".ring");if(ring)ring.style.stroke=ACOL[ACTS[act]?ACTS[act][0]:"idle"]||"#93a0b8";
const m=document.getElementById("m"+r.i);if(m)m.setAttribute("class","mon"+(act==="work"&&!r.away?" on":""));}
function next(r){
if(r.away){const rt=r.away;r.path=rt.back.slice();r.z=0;SIM.occ[rt.kind][rt.k]=0;r.after="seat";r.away=null;setAct(r,"walk");const pd=document.getElementById("pd"+rt.k);if(pd&&rt.kind==="pod")pd.setAttribute("class","pod");return}
const q=Math.random();let kind=null,act="work",d=7+Math.random()*7;
if(q<.46){act="work"}else if(q<.58){act="stretch";d=3.6}else if(q<.72){kind="caf";act="rest";d=6+Math.random()*4}else if(q<.8){kind="sofa";act="wait";d=5+Math.random()*3}else if(q<.9){kind="pod";act="recharge";d=7+Math.random()*3}else if(q<.97){kind="meet";act="wait";d=5+Math.random()*3}else{act="idle";d=3}
if(kind){const fr=free(kind,SP[kind].length);if(!fr.length){act="work"}else{const k=fr[Math.floor(Math.random()*fr.length)],rt=route(r,kind,k);SIM.occ[kind][k]=1;const s=seat(r.i);r.path=rt.pts.slice();r.away={kind,k,back:rt.pts.slice(0,-1).reverse().concat([[s[0],s[1]]]),act,d};r.after="spot";r.zNext=rt.z;setAct(r,"walk");return}}
r.t=d;setAct(r,act)}
function step(r,dt){
if(r.path.length){const g=r.path[0],dx=g[0]-r.x,dy=g[1]-r.y,L=Math.hypot(dx,dy),v=2.3*dt;
if(L<=v){r.x=g[0];r.y=g[1];r.path.shift();if(!r.path.length){if(r.after==="spot"){r.z=r.zNext||0;r.t=r.away.d;setAct(r,r.away.act);const pd=document.getElementById("pd"+r.away.k);if(pd&&r.away.kind==="pod")pd.setAttribute("class","pod on")}else{r.z=0;const s=seat(r.i);r.x=s[0];r.y=s[1];r.t=1+Math.random()*3;setAct(r,"idle")}}}
else{r.x+=dx/L*v;r.y+=dy/L*v}return true}
r.t-=dt;if(r.t<=0)next(r);return false}
function place(r){const el=document.getElementById("b"+r.i);if(!el)return;const p=pos(r);el.setAttribute("transform","translate("+p[0].toFixed(1)+","+p[1].toFixed(1)+")");const l=document.getElementById("l"+r.i);if(l){l.setAttribute("x",p[0].toFixed(1));l.setAttribute("y",(p[1]+13).toFixed(1))}}
function sortDom(){const g=document.getElementById("oBots");if(!g)return;SIM.R.slice().sort((a,b)=>(a.x+a.y)-(b.x+b.y)).forEach(r=>{const el=document.getElementById("b"+r.i);if(el)g.appendChild(el)})}
function tally(){const el=document.getElementById("oCnt");if(!el)return;const c={};
if(SIM.on)SIM.R.forEach(r=>{const l=r.act==="walk"?"Berjalan":ACTS[r.act][1];c[l]=(c[l]||0)+1});
else if(SIM.mode!=="nc")c[STC[SIM.mode][1]]=15;else c["Belum terhubung"]=15;
el.innerHTML=Object.keys(c).map(k=>`<span class="chip ${SIM.on||SIM.mode!=="nc"?"info":"bad"}">${k}: <b>${c[k]}</b></span>`).join(" ")}
function loop(t){if(!SIM.on||!document.getElementById("ofc")){SIM.raf=0;return}
if(!SIM.last)SIM.last=t;let dt=Math.min(.1,(t-SIM.last)/1000);SIM.last=t;SIM.acc+=dt;
if(SIM.acc>=.033){const d=SIM.acc;SIM.acc=0;let mv=false;SIM.R.forEach(r=>{if(step(r,d)){mv=true;place(r)}});SIM.sort+=d;SIM.cnt+=d;if(mv&&SIM.sort>.25){SIM.sort=0;sortDom()}if(SIM.cnt>.8){SIM.cnt=0;tally()}}
SIM.raf=requestAnimationFrame(loop)}
function stop(){SIM.on=false;if(SIM.raf&&typeof cancelAnimationFrame!=="undefined")cancelAnimationFrame(SIM.raf);SIM.raf=0}
function resetAll(){stop();SIM.occ={sofa:{},caf:{},pod:{},meet:{}};initR();SIM.R.forEach(r=>{place(r);const el=document.getElementById("b"+r.i);if(el){el.setAttribute("class","bot a-"+(SIM.mode==="nc"?"nc":SIM.mode));const ring=el.querySelector(".ring");if(ring)ring.style.stroke=(STC[SIM.mode]||STC.nc)[2]}});document.querySelectorAll(".mon").forEach(m=>m.setAttribute("class","mon"+(SIM.mode==="working"?" on":"")));document.querySelectorAll(".pod").forEach(p=>p.setAttribute("class","pod"));sortDom()}
function applyMode(m){SIM.mode=m;resetAll();tally()}
function start(){if(reduced()){if(typeof toast==="function")toast("Mode kurangi gerakan aktif di perangkat ini: simulasi bergerak dimatikan");return false}
SIM.mode="nc";const sel=document.getElementById("oSel");if(sel)sel.value="nc";resetAll();SIM.on=true;SIM.last=0;SIM.R.forEach((r,i)=>{r.t=.4+Math.random()*3.5;setAct(r,i%3===0?"idle":"work")});tally();SIM.raf=requestAnimationFrame(loop);return true}
function clock(){const d=new Date(),h=document.getElementById("ch"),m=document.getElementById("cm");if(!h)return;h.setAttribute("transform","rotate("+((d.getHours()%12)*30+d.getMinutes()/2)+")");m.setAttribute("transform","rotate("+(d.getMinutes()*6)+")")}
function svg(){const bots=SIM.R.map(r=>bot(r.i,{p:pos(r)})).join("");
return `<svg id="ofc" role="group" aria-label="Kantor virtual isometrik 2.5D dengan 15 posisi"><g id="world" style="transform-origin:0 0">${office()}<g id="oBots">${bots}</g><g id="oLbl">${SIM.R.map(r=>{const p=pos(r),n=BOTS[r.i].n;return`<text class="nm" id="l${r.i}" x="${p[0].toFixed(1)}" y="${(p[1]+13).toFixed(1)}" text-anchor="middle">${n==="AI Setup Assistant"?"SETUP":n==="AI Director"?"DIRECTOR":n}</text>`}).join("")}</g></g></svg>`}
function pawnAv(n,sz){const i=BOTS.findIndex(b=>b.n===n);return i<0?`<div class="av">${String(n).slice(0,2)}</div>`:`<div class="av pw">${bot(i,{avatar:sz||26})}</div>`}
const ZOOMS=[100,150,210,280];
function html(){
return `<div class="card ofw-c"><div class="oft"><select id="oSel" aria-label="Pratinjau status (DEMO)">${ST.map(s=>`<option value="${s[0]}"${s[0]===SIM.mode&&!SIM.on?" selected":""}>${s[0]==="nc"?"Status asli: Belum terhubung":"Pratinjau DEMO: "+s[1]}</option>`).join("")}</select><button type="button" class="btn sm" id="oSim">${SIM.on?"⏸ Hentikan simulasi":"▶ Simulasi hidup (DEMO)"}</button><span class="zb"><button type="button" class="btn ghost sm" id="oZm" aria-label="Perkecil">−</button><button type="button" class="btn ghost sm" id="oZp" aria-label="Perbesar">+</button><button type="button" class="btn ghost sm" id="oOv">Overview</button></span></div>
<div class="ofr" id="ofr">${LY.rooms.map(r=>`<button type="button" class="btn ghost sm" data-room="${r.id}">${r.n}</button>`).join("")}</div>
<div class="ofw" id="ofw">${svg()}</div>
<div class="banner warn" style="margin:10px 0 0"><div><b>Animasi = tampilan, bukan data.</b> Bawaan: semua karyawan <b>Belum terhubung</b> (hanya bernapas dan berkedip). Pratinjau dan simulasi berlabel DEMO, tidak menunjukkan pekerjaan AI yang nyata. Geser dan cubit untuk menjelajah; ketuk ruangan di atas atau ketuk dua kali untuk zoom; ketuk robot untuk profil.</div></div>
<div class="oct"><b>Ringkasan tampilan:</b> <span id="oCnt"></span></div></div>`}
const CAM={s:1,x:0,y:0,on:0};
function mount(){const q=id=>document.getElementById(id);if(!q("ofc"))return;clock();tally();
const box_=q("ofw"),wd=q("world"),cw=()=>box_.clientWidth,ch=()=>box_.clientHeight;
const clampS=v=>Math.max(.35,Math.min(3,v));
function clamp(){const M=60,w=WW*CAM.s,h=WH*CAM.s;CAM.x=w<=cw()-2*M?(cw()-w)/2:Math.min(M,Math.max(cw()-w-M,CAM.x));CAM.y=h<=ch()-2*M?(ch()-h)/2:Math.min(M,Math.max(ch()-h-M,CAM.y))}
function apply(anim){clamp();wd.classList.toggle("fly",!!anim&&!reduced());wd.style.transform=`translate(${CAM.x.toFixed(1)}px,${CAM.y.toFixed(1)}px) scale(${CAM.s.toFixed(3)})`;q("ofc").classList.toggle("lod",CAM.s<.55)}
function overview(anim){CAM.s=clampS(Math.min(cw()/WW,ch()/WH));CAM.x=0;CAM.y=0;apply(anim)}
function look(minx,miny,maxx,maxy,anim,fixS){const bw=maxx-minx+60,bh=maxy-miny+60;CAM.s=fixS||clampS(Math.min(cw()/bw,ch()/bh));CAM.x=cw()/2-(minx+maxx)/2*CAM.s;CAM.y=ch()/2-(miny+maxy)/2*CAM.s;apply(anim)}
function room(id,anim){const r=LY.rooms.find(o=>o.id===id);if(!r)return;const c=[[r.x0,r.y0,1.9],[r.x1,r.y0,0],[r.x1,r.y1,0],[r.x0,r.y1,0]].map(p=>N(p[0],p[1],p[2]));look(Math.min(...c.map(p=>p[0])),Math.min(...c.map(p=>p[1])),Math.max(...c.map(p=>p[0])),Math.max(...c.map(p=>p[1])),anim)}
function emp(i){const p=N(SIM.R[i].x,SIM.R[i].y,0);look(p[0],p[1]-20,p[0],p[1]-20,true,2.2)}
function zoomAt(f,cx,cy){const n=clampS(CAM.s*f),k=n/CAM.s;CAM.x=cx-(cx-CAM.x)*k;CAM.y=cy-(cy-CAM.y)*k;CAM.s=n;apply(false)}
overview(false);
q("oZp").onclick=()=>zoomAt(1.3,cw()/2,ch()/2);q("oZm").onclick=()=>zoomAt(1/1.3,cw()/2,ch()/2);q("oOv").onclick=()=>overview(true);
q("ofr").onclick=e=>{const b=e.target.closest("[data-room]");if(b)room(b.dataset.room,true)};
/* gestur: 1 jari geser, 2 jari cubit, ketuk dua kali = zoom ruangan */
const P=new Map();let drag=false,d0=0,tap=0,tx=0,ty=0;const sv=q("ofc");
const rel=e=>{const b=sv.getBoundingClientRect();return[e.clientX-b.left,e.clientY-b.top]};
sv.onpointerdown=e=>{P.set(e.pointerId,rel(e));drag=false;if(P.size===2){const a=[...P.values()];d0=Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1])}};
sv.onpointermove=e=>{if(!P.has(e.pointerId))return;const o=P.get(e.pointerId),n=rel(e);
if(P.size===1){const dx=n[0]-o[0],dy=n[1]-o[1];if(!drag&&Math.hypot(dx,dy)<5)return;if(!drag){drag=true;try{sv.setPointerCapture(e.pointerId)}catch(_){}}P.set(e.pointerId,n);CAM.x+=dx;CAM.y+=dy;apply(false)}
else if(P.size===2){P.set(e.pointerId,n);const a=[...P.values()],d=Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1]);if(d0>0&&d>0){zoomAt(d/d0,(a[0][0]+a[1][0])/2,(a[0][1]+a[1][1])/2)}d0=d;drag=true}};
const up=e=>{const was=drag,n=rel(e);P.delete(e.pointerId);if(P.size)return;
if(!was){const t=Date.now();if(t-tap<320&&Math.hypot(n[0]-tx,n[1]-ty)<24&&!e.target.closest("g.bot")){const wx=(n[0]-CAM.x)/CAM.s,wy=(n[1]-CAM.y)/CAM.s,u=(wx-OX)/TW,v=(wy-OY)/TH,x=(u+v)/2,y=(v-u)/2,r=LY.rooms.find(o=>x>=o.x0&&x<=o.x1&&y>=o.y0&&y<=o.y1);if(r)room(r.id,true)}tap=t;tx=n[0];ty=n[1]}drag=false};
sv.onpointerup=up;sv.onpointercancel=e=>{P.delete(e.pointerId)};
sv.onwheel=e=>{e.preventDefault();const n=rel(e);zoomAt(e.deltaY<0?1.15:1/1.15,n[0],n[1])};
sv.addEventListener("click",e=>{const g=e.target.closest("g.bot");if(g){const i=BOTS.findIndex(b=>b.n===g.dataset.id);if(i>=0)emp(i)}});
if(typeof ResizeObserver!=="undefined")new ResizeObserver(()=>apply(false)).observe(box_);
q("oSel").onchange=function(){applyMode(this.value);q("oSim").textContent="▶ Simulasi hidup (DEMO)"};
q("oSim").onclick=function(){if(SIM.on){stop();SIM.mode="nc";q("oSel").value="nc";resetAll();tally();this.textContent="▶ Simulasi hidup (DEMO)"}else if(start())this.textContent="⏸ Hentikan simulasi"};
if(SIM.on){stop();SIM.on=false;if(start()){q("oSim").textContent="⏸ Hentikan simulasi"}}
else if(SIM.mode!=="nc")applyMode(SIM.mode);
document.querySelectorAll("g.bot[data-a]").forEach(g=>{g.onkeydown=ev=>{if(ev.key==="Enter"||ev.key===" "){ev.preventDefault();g.dispatchEvent(new MouseEvent("click",{bubbles:true}))}}})}
return{BOTS,ST,html,mount,stop,pawnAv,names:BOTS.map(b=>b.n),seat,LAYOUT:LY}})();
const pawnAv=OF.pawnAv;
