
(()=>{
"use strict";

/* ---------- dates ---------- */
const DAY=86400000;
const sod=d=>{const x=new Date(d);x.setHours(0,0,0,0);return x};
const pad=n=>String(n).padStart(2,"0");
const iso=d=>d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
const parse=s=>{const a=s.split("-").map(Number);return new Date(a[0],a[1]-1,a[2])};
const addDays=(d,n)=>{const x=sod(d);x.setDate(x.getDate()+n);return x};
const diff=(a,b)=>Math.round((sod(a)-sod(b))/DAY);
let TODAY=sod(new Date());

/* ---------- catalogue: key, label, default days, shelf, aliases ---------- */
const CAT=[
["eggs","Eggs",14,"middle",["egg"]],
["milk","Milk",7,"door",[]],
["butter","Butter",30,"door",[]],
["cheddar","Cheddar",21,"middle",["cheese","cheddar cheese"]],
["mozzarella","Mozzarella",8,"middle",[]],
["feta","Feta",14,"middle",[]],
["parmesan","Parmesan",45,"middle",["parmigiano"]],
["yoghurt","Yoghurt",10,"middle",["yogurt","greek yoghurt","greek yogurt"]],
["cream","Cream",6,"door",["double cream","single cream"]],
["cream cheese","Cream cheese",14,"middle",[]],
["halloumi","Halloumi",21,"middle",[]],
["chicken","Chicken",3,"bottom",["chicken breast","chicken breasts","chicken thighs","chicken thigh"]],
["mince","Beef mince",2,"bottom",["beef mince","minced beef","ground beef"]],
["bacon","Bacon",6,"bottom",[]],
["sausages","Sausages",4,"bottom",["sausage"]],
["salmon","Salmon",2,"bottom",["salmon fillet"]],
["prawns","Prawns",2,"bottom",["prawn","shrimp"]],
["ham","Ham",5,"middle",[]],
["chorizo","Chorizo",14,"middle",[]],
["spinach","Spinach",4,"crisper",[]],
["tomatoes","Tomatoes",5,"crisper",["tomato","cherry tomatoes","cherry tomato"]],
["peppers","Peppers",7,"crisper",["pepper","bell pepper","bell peppers","red pepper","red peppers"]],
["onion","Onions",30,"crisper",["onion","red onion","white onion","onions"]],
["garlic","Garlic",30,"crisper",[]],
["carrots","Carrots",14,"crisper",["carrot"]],
["courgette","Courgette",7,"crisper",["zucchini","courgettes"]],
["mushrooms","Mushrooms",5,"crisper",["mushroom","chestnut mushrooms"]],
["broccoli","Broccoli",6,"crisper",[]],
["lettuce","Lettuce",5,"crisper",["salad","salad leaves","gem lettuce"]],
["cucumber","Cucumber",7,"crisper",[]],
["avocado","Avocado",3,"crisper",["avocados"]],
["potatoes","Potatoes",21,"crisper",["potato","new potatoes"]],
["sweet potato","Sweet potato",21,"crisper",["sweet potatoes"]],
["aubergine","Aubergine",7,"crisper",["eggplant"]],
["spring onion","Spring onions",7,"crisper",["spring onions","scallion","scallions"]],
["leek","Leek",10,"crisper",["leeks"]],
["kale","Kale",6,"crisper",[]],
["beetroot","Beetroot",14,"crisper",["beets","beet"]],
["sweetcorn","Sweetcorn",5,"crisper",[]],
["peas","Peas",30,"crisper",[]],
["coriander","Coriander",5,"crisper",["cilantro"]],
["basil","Basil",5,"crisper",[]],
["parsley","Parsley",6,"crisper",[]],
["ginger","Ginger",21,"crisper",[]],
["lemon","Lemon",14,"crisper",["lemons"]],
["lime","Lime",14,"crisper",["limes"]],
["chilli","Chilli",10,"crisper",["chili","chillies","chile"]],
["hummus","Hummus",7,"middle",["houmous"]],
["tofu","Tofu",7,"middle",[]],
["pesto","Pesto",14,"door",[]],
["olives","Olives",30,"door",["olive"]],
["cooked rice","Leftover rice",3,"top",["leftover rice"]],
["pasta","Pasta",60,"cupboard",[]],
["rice","Rice",60,"cupboard",[]],
["noodles","Noodles",60,"cupboard",["noodle"]],
["flour","Flour",90,"cupboard",[]],
["oats","Oats",90,"cupboard",[]],
["tortillas","Tortillas",14,"cupboard",["wraps","tortilla","wrap"]],
["bread","Bread",5,"cupboard",["sourdough","toast","loaf"]],
["tinned tomatoes","Tinned tomatoes",90,"cupboard",["chopped tomatoes","canned tomatoes"]],
["passata","Passata",90,"cupboard",[]],
["chickpeas","Chickpeas",90,"cupboard",["chickpea"]],
["black beans","Black beans",90,"cupboard",["black bean"]],
["kidney beans","Kidney beans",90,"cupboard",["kidney bean"]],
["lentils","Lentils",90,"cupboard",["lentil","red lentils"]],
["coconut milk","Coconut milk",90,"cupboard",[]]
];
const BYKEY=Object.create(null),LOOK=Object.create(null);
for(const c of CAT){
  BYKEY[c[0]]={key:c[0],label:c[1],days:c[2],shelf:c[3]};
  for(const n of [c[0],c[1].toLowerCase()].concat(c[4])){
    LOOK[n]=c[0];LOOK[n+"s"]=c[0];LOOK[n+"es"]=c[0];
    if(n.endsWith("y"))LOOK[n.slice(0,-1)+"ies"]=c[0];
  }
}
const LOOKKEYS=Object.keys(LOOK).sort((a,b)=>b.length-a.length);
const PANTRY=/\b(oil|salt|black pepper|vinegar|sugar|spices?|sauce|ketchup|mayo|mayonnaise|mustard|jam|honey|ice cream)\b/;
const isPantry=n=>PANTRY.test(n.toLowerCase())&&!/ice cream/.test(n.toLowerCase());
function resolve(name){
  const s=name.toLowerCase().replace(/[^a-z\s]/g," ").replace(/\s+/g," ").trim();
  if(!s||PANTRY.test(s))return null;
  if(LOOK[s])return LOOK[s];
  for(const k of LOOKKEYS){ if((" "+s+" ").indexOf(" "+k+" ")>-1)return LOOK[k]; }
  return null;
}
const lab=k=>BYKEY[k]?BYKEY[k].label:k;
const CUPBOARD=["pasta","rice","noodles","flour","oats","tortillas","bread","tinned tomatoes","passata","chickpeas","black beans","kidney beans","lentils","coconut milk"];
const SHELVES=[["top","Top shelf"],["middle","Middle shelf"],["bottom","Bottom shelf"],["crisper","Crisper"],["door","Door"],["cupboard","Cupboard"]];
const SHELFNAME=Object.fromEntries(SHELVES);

/* ---------- recipes ---------- */
const R=[];
const rec=(n,t,v,ings,m)=>R.push({n,t,v,g:ings.map(s=>s.split("|")),m});
rec("Spinach and feta omelette",10,1,["eggs","spinach","feta"],"Wilt the spinach in a little oil for a minute. Pour in three beaten eggs, crumble the feta over, and fold once the edges set.");
rec("Shakshuka",25,1,["eggs","onion","tomatoes|tinned tomatoes|passata","peppers|chilli"],"Soften sliced onion and pepper with cumin. Add the tomatoes and simmer until thick, then make wells and crack in the eggs. Cover until just set.");
rec("Egg fried rice",15,1,["eggs","rice|cooked rice","spring onion|onion","peas|sweetcorn|carrots"],"Scramble the eggs and push them aside. Fry the rice and veg hot and fast, then finish with soy sauce and the spring onion.");
rec("Garlic mushroom pasta",20,1,["pasta","mushrooms","garlic","cream|parmesan|cream cheese"],"Boil the pasta. Brown the mushrooms hard, add garlic for thirty seconds, then stir in the cream or cheese with a splash of pasta water and toss.");
rec("Chicken stir-fry",20,0,["chicken","peppers|broccoli|carrots|courgette|mushrooms","noodles|rice","garlic|ginger"],"Slice the chicken thin and fry until golden. Add garlic or ginger and the veg, then soy sauce, and serve over noodles or rice.");
rec("Creamy spinach chicken",25,0,["chicken","spinach","cream|cream cheese","garlic"],"Sear the chicken and set it aside. Soften the garlic, stir in cream and spinach until wilted, then return the chicken for five minutes.");
rec("Mozzarella and tomato toastie",10,1,["bread","mozzarella","tomatoes|pesto"],"Layer mozzarella and sliced tomato, or a spoon of pesto, between buttered bread. Toast in a pan, pressed down, until the cheese gives way.");
rec("Halloumi wraps",15,1,["halloumi","tortillas","lettuce|cucumber|tomatoes","hummus|yoghurt"],"Fry the halloumi until striped and golden. Spread the wrap with hummus or yoghurt, add salad and the cheese, and roll tight.");
rec("Carrot and lentil soup",35,1,["lentils","carrots","onion"],"Soften the onion, add chopped carrot, red lentils and water to cover. Simmer until soft, blend if you like, and season hard.");
rec("Sausage and potato tray bake",45,0,["sausages","potatoes","onion|peppers"],"Cut potatoes and onion into chunks, toss in oil and roast hot. Add the sausages after ten minutes and turn once until everything is browned.");
rec("Bacon, egg and cheddar toastie",10,0,["bacon","eggs","bread","cheddar"],"Crisp the bacon and fry an egg. Stack both with cheddar between bread and toast until melted.");
rec("Salmon with greens",20,0,["salmon","broccoli|spinach|kale|courgette","lemon|lime"],"Pan-fry the salmon skin down until crisp, then flip briefly. Steam or saute the greens and finish everything with citrus.");
rec("Prawn linguine",20,0,["prawns","pasta","garlic","lemon|chilli|tomatoes"],"Boil the pasta. Fry garlic with chilli or tomato, add the prawns until pink, then toss with the pasta, lemon and a ladle of its water.");
rec("Black bean tacos",15,1,["black beans","tortillas","avocado|tomatoes|lettuce","lime|yoghurt"],"Warm the beans with cumin and a splash of water, mashing a few. Fill warm tortillas and top with avocado or salad and a squeeze of lime.");
rec("Chickpea coconut curry",30,1,["chickpeas","coconut milk","onion","spinach|tomatoes|sweet potato","ginger|garlic"],"Soften the onion with ginger or garlic and curry powder. Add chickpeas, coconut milk and tomato or sweet potato, then simmer. Stir in spinach at the end.");
rec("Crisp tofu stir-fry",20,1,["tofu","broccoli|peppers|carrots|courgette|mushrooms","rice|noodles"],"Press and cube the tofu and fry until crisp on every side. Add the veg and soy sauce, and serve on rice or noodles.");
rec("Potato and leek soup",35,1,["potatoes","leek|onion","milk|cream"],"Soften the leek, add diced potato and water to cover, and simmer until tender. Blend with milk or cream and plenty of pepper.");
rec("Cheese and onion frittata",25,1,["eggs","onion","cheddar|parmesan|feta|mozzarella"],"Soften the onion, pour over beaten eggs and scatter the cheese. Cook gently, then finish under the grill until puffed.");
rec("Beef ragu",45,0,["mince","onion","tinned tomatoes|passata|tomatoes","pasta","garlic"],"Brown the mince hard, add onion and garlic, then the tomatoes. Simmer low for half an hour and toss through pasta.");
rec("Chilli con carne",45,0,["mince","tinned tomatoes|passata","kidney beans|black beans","onion","peppers"],"Brown the mince with onion and pepper, add spices, tomatoes and beans. Simmer until thick and serve with rice.");
rec("Pesto pasta with greens",15,1,["pasta","pesto","tomatoes|spinach|courgette"],"Boil the pasta, wilt or sear the greens, then toss everything with pesto and a little pasta water.");
rec("Avocado toast with egg",10,1,["bread","avocado","eggs|feta"],"Mash avocado with lemon and salt onto hot toast. Top with a soft egg or crumbled feta.");
rec("Greek salad",10,1,["cucumber","tomatoes","feta","olives|onion"],"Chop everything chunky, crumble over the feta, and dress with oil and a pinch of salt.");
rec("Courgette fritters",25,1,["courgette","eggs","flour","feta|parmesan|cheddar"],"Grate and squeeze the courgette dry, then mix with egg, flour and cheese. Fry spoonfuls until golden on both sides.");
rec("Sweet potato and bean bowl",35,1,["sweet potato","black beans|chickpeas","rice|tortillas","avocado|yoghurt|lime"],"Roast cubed sweet potato until caramelised. Pile over rice with warm beans and something cool and creamy.");
rec("Aubergine bake",45,1,["aubergine","tinned tomatoes|passata|tomatoes","mozzarella|parmesan"],"Roast aubergine slices until soft, layer with tomato sauce and cheese, and bake until bubbling.");
rec("Ham and cheese quesadilla",10,0,["ham","cheddar|mozzarella","tortillas"],"Fill a tortilla with ham and cheese, fold, and fry both sides until crisp and molten.");
rec("Roast chicken, potatoes and carrots",55,0,["chicken","potatoes","carrots"],"Roast the chicken on a bed of chunky potatoes and carrots at 200 degrees until the juices run clear.");
rec("Chorizo and egg hash",25,0,["chorizo","potatoes","eggs","peppers|onion"],"Crisp diced potato and chorizo in one pan, add pepper or onion, then make wells for the eggs and cover until set.");
rec("Overnight oats",5,1,["oats","milk|yoghurt"],"Stir oats with milk or yoghurt and leave overnight. Top with whatever fruit you have.");
rec("Beetroot and feta salad",10,1,["beetroot","feta","spinach|lettuce|kale"],"Slice the beetroot, pile over the leaves, crumble the feta on top and dress with lemon and oil.");
rec("French toast",10,1,["eggs","bread","milk"],"Whisk egg with milk, soak thick slices, and fry in butter until golden.");

/* ---------- state ---------- */
const AVOIDABLE=[...new Set(R.flatMap(r=>r.g.flat()))].filter(k=>!CUPBOARD.includes(k)).sort((a,b)=>lab(a).localeCompare(lab(b)));
const LS="fridge.v1";
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
function mkItem(name,qty,days,shelf,life){
  const key=resolve(name),c=key?BYKEY[key]:null;
  const exp=addDays(TODAY,days);
  return {id:uid(),name:name.trim(),key,qty,shelf:shelf||(c?c.shelf:"middle"),exp:iso(exp),added:iso(addDays(exp,-(life||Math.max(days,1)))),life:life||Math.max(days,1)};
}
function seed(){
  const S=[["Eggs",6,12],["Spinach",1,1],["Feta",1,9],["Tomatoes",4,3],["Onions",2,20],["Peppers",2,4],["Chicken",2,2],["Mushrooms",1,3],["Cream",1,4],["Cheddar",1,14],["Halloumi",1,12],["Courgette",1,5],["Yoghurt",1,6],["Carrots",3,12],["Garlic",1,25],["Potatoes",4,15],["Hummus",1,5],["Tortillas",1,8],["Butter",1,25],["Lemon",1,10],["Leftover rice",1,2]];
  return {items:S.map(a=>{const c=BYKEY[resolve(a[0])];return mkItem(a[0],a[1],a[2],null,c.days)}),staples:["pasta","rice","noodles","flour","oats"]};
}
function load(){
  try{const r=JSON.parse(localStorage.getItem(LS));const clean=cleanImport(r);if(clean)return clean}catch(e){}
  return seed();
}
function persist(){try{localStorage.setItem(LS,JSON.stringify(S))}catch(e){toast("Unable to save on this device. Back up your fridge before closing.")}}
let S=load();
const DEF={veg:false,avoid:[],days:4,urgent:2};
function norm(){S.prefs=Object.assign({},DEF,S.prefs||{});delete S.prefs.name;if(!Array.isArray(S.prefs.avoid))S.prefs.avoid=[]}
norm();
const dleft=it=>diff(parse(it.exp),TODAY);
const frac=it=>{const d=dleft(it);return d<0?0:Math.max(0,Math.min(1,d/Math.max(1,it.life)))};

/* ---------- cooking logic ---------- */
function pool(d,cons){
  const p={};
  for(const it of S.items){
    if(!it.key||S.prefs.avoid.includes(it.key))continue;const dl=dleft(it);if(dl<d)continue;
    const e=p[it.key]||(p[it.key]={fq:0,days:Infinity,staple:false});
    e.fq+=it.qty;e.days=Math.min(e.days,dl);
  }
  if(cons)for(const k in cons)if(p[k])p[k].fq-=cons[k];
  for(const k of S.staples){const e=p[k]||(p[k]={fq:0,days:Infinity,staple:false});e.staple=true}
  return p;
}
const blocked=r=>(S.prefs.veg&&!r.v)||r.g.some(g=>g.every(k=>S.prefs.avoid.includes(k)));
function evalR(r,p){
  if(blocked(r))return {r,uses:[],missing:[[],[]],ok:false,blocked:true};
  const uses=[],missing=[];
  for(const g of r.g){
    let best=null;
    for(const k of g){
      const e=p[k];
      if(e&&(e.fq>0||e.staple)){
        const f=e.fq>0,d=f?e.days:Infinity;
        if(!best||d<best.d||(d===best.d&&f&&!best.f))best={k,d,f};
      }
    }
    if(best)uses.push(best);else missing.push(g);
  }
  return {r,uses,missing,ok:!missing.length};
}
function planWeek(n,swaps){
  const out=[],used=new Set(),cons={};
  for(let d=0;d<n;d++){
    const p=pool(d,cons),list=[];
    for(const r of R){
      if(used.has(r.n))continue;
      const e=evalR(r,p);if(!e.ok)continue;
      let sc=e.uses.length*.15;
      for(const u of e.uses)if(u.f)sc+=2/(u.d+1);
      list.push({...e,sc});
    }
    list.sort((a,b)=>b.sc-a.sc);
    if(!list.length){out.push({d,none:true});continue}
    const pick=list[(swaps[d]||0)%list.length];
    used.add(pick.r.n);
    for(const u of pick.uses)if(u.f)cons[u.k]=(cons[u.k]||0)+1;
    out.push({d,...pick,alts:list.length});
  }
  while(out.length&&out[out.length-1].none)out.pop();
  return out;
}

/* ---------- helpers ---------- */
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const $=s=>document.querySelector(s);
const andList=a=>a.length<2?(a[0]||""):a.slice(0,-1).join(", ")+" and "+a[a.length-1];
const plural=(n,w)=>n+" "+w+(n===1?"":"s");
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
const urg=()=>S.prefs.urgent;
const daysLong=d=>d<0?plural(-d,"day")+" past the date":d===0?"use today":plural(d,"day")+" left";
const shortDays=d=>d<0?"past":d===0?"today":d<14?d+"d":Math.round(d/7)+"w";
const meter=(pct,sm)=>`<span class="meter${sm?" sm":""}" style="--p:${Math.max(6,Math.min(94,pct))}%"></span>`;
const dayLabel=d=>d===0?"Tonight":d===1?"Tomorrow":addDays(TODAY,d).toLocaleDateString("en-GB",{weekday:"short"});
const soonCount=e=>e.uses.filter(u=>u.f&&u.d<=urg()).length;
const pct=(e)=>Math.round(e.uses.length/e.r.g.length*100);
function rays(items){
  const arr=items.slice().sort((a,b)=>dleft(a)-dleft(b)).slice(0,22);
  const n=Math.max(arr.length,1);let s="";
  arr.forEach((it,i)=>{
    const a=Math.PI-(n===1?Math.PI/2:(i/(n-1))*Math.PI);
    const len=7+frac(it)*14,r0=11;
    const x1=34+Math.cos(a)*r0,y1=34-Math.sin(a)*r0,x2=34+Math.cos(a)*(r0+len),y2=34-Math.sin(a)*(r0+len);
    s+=`<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${dleft(it)<=urg()?"#e4572e":"#0d0d10"}" stroke-width="1.3" stroke-linecap="round"/>`;
  });
  return `<svg class="rays" viewBox="0 0 68 36" aria-hidden="true">${s}</svg>`;
}
const chipsHtml=e=>e.uses.map(u=>`<span class="chip ${u.f?"have":"stp"}">${u.f&&u.d<=urg()?'<i class="d"></i>':""}${esc(lab(u.k).toLowerCase())}</span>`).join("")
  +e.missing.map(g=>`<button class="chip miss" data-act="shortadd" data-name="${esc(lab(g[0]))}" aria-label="Add ${esc(lab(g[0]))} to the fridge">+ ${esc(g.slice(0,2).map(lab).join(" or ").toLowerCase())}</button>`).join("");
const diet=r=>r.v?"vegetarian":"with meat or fish";

/* ---------- ui state ---------- */
const ui={tab:"tonight",day:0,seg:"ready",quick:false,veg:false,all:false,swaps:{}};
let E0=[];

function ctx(){
  TODAY=sod(new Date());
  const items=S.items,P0=pool(0);
  E0=R.map(r=>evalR(r,P0));
  const plan=planWeek(S.prefs.days,ui.swaps);
  const top=plan[0]&&!plan[0].none?plan[0]:null;
  const readyIdx=E0.map((e,i)=>i).filter(i=>E0[i].ok).sort((a,b)=>soonCount(E0[b])-soonCount(E0[a])||R[a].t-R[b].t);
  const shortN=E0.filter(e=>e.missing.length===1).length;
  let near=null;
  if(!top&&items.length)near=E0.map((e,i)=>({e,i})).filter(o=>o.e.missing.length===1).sort((a,b)=>b.e.uses.length-a.e.uses.length)[0]||null;
  const live=items.filter(i=>dleft(i)>=0),expired=items.length-live.length;
  const first=live.slice().sort((a,b)=>dleft(a)-dleft(b))[0];
  const soonN=live.filter(i=>dleft(i)<=2).length;
  const fr=items.length?Math.round(items.reduce((s,i)=>s+frac(i),0)/items.length*100):0;
  const lit=!items.length?0:fr>60?3:fr>30?2:1;
  return {items,plan,top,readyIdx,shortN,near,expired,first,soonN,fr,lit};
}

/* ---------- screens ---------- */
const mini=(i,mode)=>{
  const e=E0[i],r=R[i],soon=soonCount(e);
  const meta=mode==="short"?"needs "+lab(e.missing[0][0]).toLowerCase():`${r.t} min${soon?` · ${soon} soon`:""}`;
  return `<button class="mc" data-act="recipe" data-r="${i}"><span class="mn">${esc(r.n)}</span><span><span class="lb s">${esc(meta)}</span><span class="mb"><i style="width:${pct(e)}%"></i></span></span></button>`;
};

const healthBar=fr=>`<div class="bar" role="meter" aria-label="Fridge freshness" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${fr}"><i style="width:${Math.max(fr,8)}%"></i><b>${fr}</b><span class="lb">% freshness</span></div>`;

function renderTonight(c){
  const {items,top,near,first,fr,lit,readyIdx,expired}=c;
  const date=new Date().toLocaleDateString("en-GB");
  const stars=`<span class="stars">${[0,1,2].map(i=>`<i class="${i<lit?"on":""}"></i>`).join("")}</span>`;
  if(!items.length)return {body:`<div class="pad"><div class="ph"><span class="lb">The fridge is empty</span><span class="lb">${date}</span></div><div class="empty"><h1 class="big" style="margin:0">Nothing in here yet.</h1><p>Add what you have and I will work out what it can become.</p><div class="acts"><button class="btn" data-act="add">Add something</button><button class="btn ghost" data-act="sample">Try a sample fridge</button></div></div></div>`};
  let label="Tonight's pick",name="Nothing quite fits",time="—",uses="—",ri=-1;
  if(top){name=top.r.n;time=top.r.t+" min";uses=plural(top.uses.filter(u=>u.f).length,"item");ri=R.indexOf(top.r)}
  else if(near){label="Almost there";name=near.e.r.n;time=near.e.r.t+" min";uses="needs "+lab(near.e.missing[0][0]).toLowerCase();ri=near.i}
  const swap=top&&top.alts>1?`<button class="link" data-act="swap" data-d="0">Another idea</button>`:`<span class="lb">${date}</span>`;
  const nameHtml=ri>=0?`<button data-act="recipe" data-r="${ri}">${esc(name)}</button>`:esc(name);
  const also=readyIdx.filter(i=>i!==ri).slice(0,6);
  const soon=items.slice().sort((a,b)=>dleft(a)-dleft(b)).slice(0,10);
  const body=`<div class="pad">
    <div class="ph"><span class="lb">${label}${stars}</span>${swap}</div>
    <h1 class="big${name.length>17?" s":""}">${nameHtml}</h1>
    <div class="g3">
      <div class="cell"><span class="lb">Time to cook</span><div class="v">${esc(time)}</div></div>
      <div class="cell"><span class="lb">Uses up</span><div class="v">${esc(uses)}</div></div>
      <div class="cell m"><div><span class="lb">Use first</span><div class="v">${first?esc(first.name):"None"}</div>${first?`<small>${first&&dleft(first)===0?"today":plural(dleft(first),"day")+" left"}</small>`:""}</div>${first?meter(frac(first)*100):""}</div>
    </div>
    <div class="sl"><span>Also ready</span><button class="link" data-act="seeall">See all ${readyIdx.length}</button></div>
    ${also.length?`<div class="car">${also.map(i=>mini(i,"ready")).join("")}</div>`:`<p class="note">Nothing else is ready right now.</p>`}
    <div class="sl"><span>Use these first</span>${expired?`<span class="lb al">${plural(expired,"item")} past the date</span>`:`<span>${plural(items.length,"item")}</span>`}</div>
    <div class="strip">${soon.map(it=>{const d=dleft(it);return `<button class="chip use${d<0?" past":""}" data-act="edit" data-id="${esc(it.id)}">${d>=0&&d<=urg()?'<i class="d"></i>':""}${esc(it.name.toLowerCase())} <b>${shortDays(d)}</b></button>`}).join("")}</div>
    ${healthBar(fr)}
  </div>`;
  return {body};
}

function renderWeek(c){
  const plan=c.plan.length?c.plan:[{d:0,none:true,empty:true}];
  ui.day=Math.max(0,Math.min(ui.day,plan.length-1));
  const top=`<div class="pills">${plan.map((p,i)=>`<button class="pill${i===ui.day?" on":""}" data-act="pill" data-i="${i}" aria-pressed="${i===ui.day}">${dayLabel(p.d)}</button>`).join("")}</div>`;
  const slides=plan.map(p=>{
    if(p.none)return `<section class="slide"><span class="lb">${dayLabel(p.d)}</span><h2 class="big">Time to shop.</h2><p class="why">${p.empty?"Nothing in the fridge makes a full meal yet.":"The fridge runs out of ideas by this day."} Add a few things and the plan fills in.</p><div class="acts" style="margin-top:24px"><button class="btn" data-act="add">Add something</button></div></section>`;
    const r=p.r,ri=R.indexOf(r);
    const soon=p.uses.filter(u=>u.f&&u.d<=urg()+1).map(u=>lab(u.k).toLowerCase());
    const why=soon.length?`${cap(andList(soon))} ${soon.length>1?"are":"is"} closest to the date, so this goes first.`:"Nothing is rushing, so this one is about what you fancy.";
    return `<section class="slide"><span class="lb">${dayLabel(p.d)} · ${addDays(TODAY,p.d).toLocaleDateString("en-GB",{day:"numeric",month:"short"})}</span>
      <h2 class="big${r.n.length>20?" s":""}">${esc(r.n)}</h2>
      <div class="lb s" style="margin-top:12px">${r.t} min · ${diet(r)}</div>
      <p class="why">${why}</p>
      <span class="lb t">Uses</span><div class="chips">${chipsHtml(p)}</div>
      <span class="lb t">Method</span><p class="meth">${esc(r.m)}</p>
      <div class="acts"><button class="btn" data-act="cook" data-r="${ri}">Cooked it</button>${p.alts>1?`<button class="btn ghost" data-act="swap" data-d="${p.d}">Another idea</button>`:""}</div></section>`;
  }).join("");
  return {top,body:`<div class="pager" id="pager">${slides}</div>`,cls:" nopad"};
}

function renderMeals(c){
  const ok=e=>(!ui.quick||e.r.t<=20)&&(!ui.veg||e.r.v);
  const all=E0.map((e,i)=>({e,i}));
  const ready=all.filter(o=>o.e.ok&&ok(o.e)).sort((a,b)=>soonCount(b.e)-soonCount(a.e)||a.e.r.t-b.e.r.t);
  const short=all.filter(o=>o.e.missing.length===1&&ok(o.e)).sort((a,b)=>a.e.r.t-b.e.r.t);
  const list=ui.seg==="ready"?ready:short;
  const shown=ui.all?list:list.slice(0,8);
  const top=`<div class="seg"><button class="${ui.seg==="ready"?"on":""}" data-act="seg" data-s="ready" aria-pressed="${ui.seg==="ready"}">Ready now<em>${ready.length}</em></button><button class="${ui.seg==="short"?"on":""}" data-act="seg" data-s="short" aria-pressed="${ui.seg==="short"}">One short<em>${short.length}</em></button></div>
    <div class="fl"><button class="chip pick${ui.quick?" on":""}" data-act="quick" aria-pressed="${ui.quick}">Under 20 min</button><button class="chip pick${ui.veg?" on":""}" data-act="veg" aria-pressed="${ui.veg}">Vegetarian</button></div>`;
  const body=list.length?`<div class="grid">${shown.map(o=>mini(o.i,ui.seg)).join("")}</div>${list.length>8&&!ui.all?`<button class="btn ghost block" style="width:calc(100% - 40px);margin:-8px 20px 24px" data-act="showall">Show all ${list.length}</button>`:""}`
    :`<div class="pad"><p class="note">${ui.seg==="ready"?"Nothing is ready with that filter. Try One short.":"No near misses with that filter."}</p></div>`;
  return {top,body};
}

function renderFridge(c){
  const tile=it=>{
    const d=dleft(it),f=Math.round(frac(it)*100),lv=d<0?"x":d<=urg()?"hot":d<=urg()+3?"mid":"ok";
    return `<button class="tile${d<0?" past":""}" data-act="edit" data-id="${esc(it.id)}" aria-label="${esc(it.name)}, ${it.qty} in stock, ${daysLong(d)}"><span class="tn">${esc(it.name)}</span><span class="tb"><span class="td${d<=1?" al":""}">${shortDays(d)}</span>${it.qty>1?`<span class="q">×${it.qty}</span>`:""}</span><span class="fb ${lv}" aria-hidden="true"><i style="width:${d<0?100:Math.max(f,6)}%"></i></span></button>`;
  };
  const shelf=([k,name])=>{
    const its=S.items.filter(i=>i.shelf===k).sort((a,b)=>dleft(a)-dleft(b));
    let h=`<section class="shelf"><div class="sh-h"><span class="lb">${name}</span><button class="mini" data-act="add" data-shelf="${k}" aria-label="Add to ${name}">+</button></div><div class="tiles">${its.length?its.map(tile).join(""):`<span class="emp">Nothing here</span>`}</div><div class="lip"></div>`;
    if(k==="cupboard")h+=`<div class="tiles stp"><span class="lb s">Always have</span>${CUPBOARD.map(s=>`<button class="chip pick${S.staples.includes(s)?" on":""}" data-act="staple" data-k="${esc(s)}" aria-pressed="${S.staples.includes(s)}">${esc(lab(s).toLowerCase())}</button>`).join("")}</div>`;
    return h+`</section>`;
  };
  return {body:`<div class="fpad"><div class="cab">${SHELVES.map(shelf).join("")}</div></div>`};
}

/* ---------- hero, nav, render ---------- */
const ICON={
  tonight:'<path d="M6 18a6 6 0 0 1 12 0"/><path d="M2.5 20.5h19"/><path d="M12 5.5v2.5M4.5 9.5l1.8 1.8M19.5 9.5l-1.8 1.8M2.5 14.5h2M19.5 14.5h2"/>',
  week:'<rect x="4" y="5" width="16" height="15" rx="3.5"/><path d="M4 10h16M9 3v4M15 3v4"/>',
  meals:'<rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/>',
  fridge:'<rect x="6" y="3" width="12" height="18" rx="3.5"/><path d="M6 10h12M9 6.2v1.6M9 13v3"/>'
};
const nb=(t,n)=>`<button class="nb" data-act="tab" data-t="${t}" aria-label="${n}"><svg viewBox="0 0 24 24" aria-hidden="true">${ICON[t]}</svg><span>${n}</span></button>`;
$("#nav").innerHTML=nb("tonight","Tonight")+nb("week","Week")+`<button class="addb" data-act="add" aria-label="Add something to the fridge"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button>`+nb("meals","Meals")+nb("fridge","Fridge");

function renderHero(c){
  $("#hero").dataset.s=ui.tab;
  $("#raysw").innerHTML=rays(c.items);
  const T={week:["Spread to use things up","This week"],meals:["From what you have","Meals"],fridge:[`${plural(c.items.length,"item")} · ${c.fr}% fresh`,"The fridge"]}[ui.tab];
  $("#ht").innerHTML=T?`<span class="lb">${esc(T[0])}</span><h1>${esc(T[1])}</h1>`:"";
  
}

function render(anim){
  const c=ctx();
  $("#app").dataset.screen=ui.tab;
  renderHero(c);
  const scr=$("#screen");
  const oldBody=scr.querySelector(".body");
  const st=oldBody&&!anim?oldBody.scrollTop:0;
  const hs=anim?[]:[...scr.querySelectorAll(".tiles,.car,.strip")].map(e=>e.scrollLeft);
  const s=({tonight:renderTonight,week:renderWeek,meals:renderMeals,fridge:renderFridge})[ui.tab](c);
  scr.className="screen"+(anim?" in":"");
  scr.innerHTML=(s.top?`<div class="top">${s.top}</div>`:"")+`<div class="body${s.cls||""}">${s.body}</div>`;
  const b=scr.querySelector(".body");b.scrollTop=st;
  [...scr.querySelectorAll(".tiles,.car,.strip")].forEach((e,i)=>{if(hs[i])e.scrollLeft=hs[i]});
  document.querySelectorAll(".nb").forEach(n=>{const on=n.dataset.t===ui.tab;n.classList.toggle("on",on);if(on)n.setAttribute("aria-current","page");else n.removeAttribute("aria-current")});
  if(ui.tab==="week")setupPager();
}
const syncPills=()=>document.querySelectorAll(".pill").forEach((b,i)=>{b.classList.toggle("on",i===ui.day);b.setAttribute("aria-pressed",i===ui.day)});
function setupPager(){
  const pg=$("#pager");if(!pg)return;
  pg.scrollLeft=ui.day*pg.clientWidth;
  let t;
  pg.addEventListener("scroll",()=>{clearTimeout(t);t=setTimeout(()=>{const i=Math.round(pg.scrollLeft/pg.clientWidth);if(i!==ui.day){ui.day=i;syncPills();const p=document.querySelectorAll(".pill")[i];if(p)p.scrollIntoView({inline:"nearest",block:"nearest"})}},70)},{passive:true});
}

window.addEventListener("resize",()=>{const pg=$("#pager");if(pg)pg.scrollLeft=ui.day*pg.clientWidth});
/* ---------- undo + toast ---------- */
let snapJ=null,tt=null;
const snap=()=>{snapJ=JSON.stringify(S)};
function toast(msg,undo){
  const t=$("#toast");
  t.innerHTML=`<span>${esc(msg)}</span>${undo?`<button data-act="undo">Undo</button>`:""}`;
  t.classList.add("on");clearTimeout(tt);tt=setTimeout(()=>t.classList.remove("on"),5200);
}
function commit(){persist();render()}

/* ---------- cook ---------- */
function cook(i){
  const e=evalR(R[i],pool(0));if(!e.ok){toast("Something is missing for that one.");return}
  snap();const names=[];
  for(const u of e.uses){
    if(!u.f)continue;
    const cands=S.items.filter(x=>x.key===u.k&&dleft(x)>=0).sort((a,b)=>dleft(a)-dleft(b));
    if(cands[0]){cands[0].qty--;names.push(lab(u.k).toLowerCase())}
  }
  S.items=S.items.filter(x=>x.qty>0);
  closeSheet();
  toast("Cooked "+R[i].n.toLowerCase()+". Used "+andList(names)+".",true);
  commit();
}

/* ---------- sheets ---------- */
let sh=null;
let lastFocus=null;
function closeSheet(){$("#sheetRoot").innerHTML="";sh=null;const f=lastFocus;lastFocus=null;if(f&&document.contains(f)){try{f.focus()}catch(e){}}}
function openRecipe(i){
  closeSheet();lastFocus=document.activeElement;
  const e=E0[i],r=R[i];
  const action=e.ok?`<button class="btn main" data-act="cook" data-r="${i}">Cooked it</button>`
    :`<button class="btn main" data-act="shortadd" data-name="${esc(lab(e.missing[0][0]))}">Add ${esc(lab(e.missing[0][0]).toLowerCase())}</button>`;
  $("#sheetRoot").innerHTML=`<div class="scrim" id="scrim"><div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(r.n)}"><div class="grab"></div>
    <span class="lb">${r.t} min · ${diet(r)}${soonCount(e)?` · uses ${soonCount(e)} soon`:""}</span>
    <h2>${esc(r.n)}</h2>
    <div class="chips">${chipsHtml(e)}</div>
    <p class="meth">${esc(r.m)}</p>
    ${action}</div></div>`;
  setTimeout(()=>{const b=document.querySelector("#sheetRoot .btn.main");if(b)b.focus()},60);
}
function openSheet(init){
  closeSheet();lastFocus=document.activeElement;
  const it=init&&init.id?S.items.find(i=>i.id===init.id):null;
  sh={id:it?it.id:null,name:it?it.name:(init&&init.name)||"",qty:it?it.qty:1,shelf:it?it.shelf:null,days:it?dleft(it):null,sT:!!it,dT:!!it};
  if(!it&&init&&init.shelf){sh.shelf=init.shelf;sh.sT=true}
  $("#sheetRoot").innerHTML=`<div class="scrim" id="scrim"><form class="sheet" id="sheetForm" role="dialog" aria-modal="true" aria-labelledby="sh-t" novalidate>
    <div class="grab"></div>
    <h2 id="sh-t">${it?"Edit item":"What went in?"}</h2>
    <div class="hint" id="sh-hint"></div>
    <div class="fld"><label class="lb" for="sh-name">Name</label><input class="inp" id="sh-name" maxlength="60" list="sh-list" autocomplete="off" autocapitalize="sentences" placeholder="Spinach, leftover rice, a half lemon" value="${esc(sh.name)}"><datalist id="sh-list">${CAT.map(c=>`<option value="${esc(c[1])}">`).join("")}</datalist></div>
    ${it?"":`<div class="fld"><span class="lb">Common</span><div class="chips" style="margin-top:8px">${["eggs","milk","spinach","tomatoes","chicken","cheddar","yoghurt","carrots","mushrooms","lemon","tofu","potatoes"].map(k=>`<button type="button" class="chip pick" data-q="${esc(lab(k))}">${esc(lab(k).toLowerCase())}</button>`).join("")}</div></div>`}
    <div class="fld two"><div><span class="lb" style="display:block;margin-bottom:8px">How many</span><div class="step"><button type="button" id="sh-m" aria-label="One fewer">−</button><span id="sh-q">1</span><button type="button" id="sh-p" aria-label="One more">+</button></div></div>
      <div><label class="lb" for="sh-days" style="display:block;margin-bottom:8px">Days left</label><input class="inp" id="sh-days" type="number" inputmode="numeric" min="-60" max="999" step="1"></div></div>
    <div class="chips" id="sh-dchips" style="margin-top:10px">${[1,2,3,5,7,14,30].map(n=>`<button type="button" class="chip pick" data-d="${n}">${n}</button>`).join("")}</div>
    <div class="fld"><span class="lb">Where is it</span><div class="chips" id="sh-shelf" style="margin-top:8px">${SHELVES.map(s=>`<button type="button" class="chip pick" data-s="${s[0]}">${s[1].replace(" shelf","")}</button>`).join("")}</div></div>
    <button class="btn main" type="submit">${it?"Save changes":"Put it in the fridge"}</button>
    ${it?`<button type="button" class="del" id="sh-del">Remove from the fridge</button>`:""}
  </form></div>`;
  syncSheet(true);
  setTimeout(()=>{const n=$("#sh-name");if(n&&!it)n.focus()},60);
}
function syncSheet(init){
  if(!sh)return;
  const key=resolve(sh.name),c=key?BYKEY[key]:null;
  if(!sh.sT)sh.shelf=c?c.shelf:"middle";
  if(!sh.dT)sh.days=c?c.days:5;
  $("#sh-q").textContent=sh.qty;
  const di=$("#sh-days");if(init||document.activeElement!==di)di.value=sh.days;
  document.querySelectorAll("#sh-shelf .chip").forEach(b=>b.classList.toggle("on",b.dataset.s===sh.shelf));
  document.querySelectorAll("#sh-dchips .chip").forEach(b=>b.classList.toggle("on",Number(b.dataset.d)===Number(sh.days)));
  const h=$("#sh-hint");
  if(!sh.name.trim())h.textContent=sh.id?"":"Type it, or tap something common.";
  else if(c){const n=R.filter(r=>r.g.some(g=>g.includes(key))).length;h.textContent=`Recognised as ${c.label.toLowerCase()}. It shows up in ${n} of ${R.length} meals.`}
  else if(isPantry(sh.name))h.textContent="That sounds like a pantry staple. I assume you always have it, so it can sit here without affecting meals.";
  else h.textContent="I don't know this one yet, so it will sit in the list without suggesting meals.";
}
function saveSheet(){
  const name=sh.name.trim().slice(0,60),ni=$("#sh-name");
  if(!name){ni.classList.add("err");ni.focus();return}
  const days=Math.max(-60,Math.min(999,Math.round(Number(sh.days))));
  if(sh.days===""||Number.isNaN(days)){$("#sh-days").focus();return}
  snap();
  if(sh.id){
    const it=S.items.find(i=>i.id===sh.id);
    if(it){Object.assign(it,{name,key:resolve(name),qty:sh.qty,shelf:sh.shelf,exp:iso(addDays(TODAY,days))});it.life=Math.max(it.life,days,1);it.added=iso(addDays(parse(it.exp),-it.life))}
    toast("Saved "+name.toLowerCase(),true);
  }else{
    const n=mkItem(name,sh.qty,days,sh.shelf);
    const twin=n.key&&S.items.find(i=>i.key===n.key&&i.exp===n.exp&&i.shelf===n.shelf);
    if(twin)twin.qty+=sh.qty;else S.items.push(n);
    toast("Added "+name.toLowerCase(),true);
  }
  closeSheet();commit();
}

/* ---------- settings ---------- */

let armErase=false,eraseT=null;
function openSettings(){
  closeSheet();lastFocus=document.activeElement;
  $("#sheetRoot").innerHTML=`<div class="scrim" id="scrim"><div class="sheet" id="setSheet" role="dialog" aria-modal="true" aria-label="Settings"><div class="grab"></div><div id="setBody"></div><input type="file" id="restoreFile" accept="application/json,.json" hidden></div></div>`;
  fillSettings();
  setTimeout(()=>{const b=document.querySelector("#setSheet .sw");if(b)b.focus()},60);
}
function fillSettings(){
  const el=$("#setBody");if(!el)return;
  const P=S.prefs,sheet=$("#setSheet"),top=sheet?sheet.scrollTop:0;
  const chips=(arr,cur,act,fmt)=>arr.map(n=>`<button type="button" class="chip pick${n===cur?" on":""}" data-act="${act}" data-n="${n}" aria-pressed="${n===cur}">${fmt?fmt(n):n}</button>`).join("");
  el.innerHTML=`
    <h2>Settings</h2><div class="hint">Your fridge is saved in this browser.</div>
    <div class="sec">Cooking</div>
    <div class="srow"><div><div class="st">Vegetarian only</div><div class="sd">Hide every meal with meat or fish.</div></div><button type="button" class="sw" role="switch" aria-checked="${P.veg}" aria-label="Vegetarian only" data-act="set-veg"><span></span></button></div>
    <div class="srow col"><div><div class="st">Never suggest</div><div class="sd">Meals that need these are hidden, and swaps step in where a recipe has one. A taste filter, not an allergy check.</div></div>
      ${P.avoid.length?`<div class="chips">${P.avoid.map(k=>`<button type="button" class="chip pick on" data-act="unavoid" data-k="${esc(k)}" aria-label="Remove ${esc(lab(k))}">${esc(lab(k).toLowerCase())} ×</button>`).join("")}</div>`:""}
      <div class="addrow"><input class="inp" id="avoidIn" list="avoidList" placeholder="Add an ingredient" autocomplete="off" autocapitalize="off" aria-label="Ingredient to never suggest"><datalist id="avoidList">${AVOIDABLE.map(k=>`<option value="${esc(lab(k))}">`).join("")}</datalist><button type="button" class="btn ghost sm" data-act="avoid">Add</button></div></div>
    <div class="srow col"><div><div class="st">Plan ahead</div><div class="sd">How many days the Week screen covers.</div></div><div class="chips">${chips([3,4,5,7],P.days,"set-days",n=>n+" days")}</div></div>
    <div class="srow col"><div><div class="st">Urgent within</div><div class="sd">Items this close to the date turn orange and get used first.</div></div><div class="chips">${chips([1,2,3],P.urgent,"set-urgent",n=>plural(n,"day"))}</div></div>
    <div class="sec">App</div>
    <div class="srow"><div><div class="st">Opening screen</div><div class="sd">Watch the sunrise again.</div></div><button type="button" class="btn ghost sm" data-act="replay">Replay</button></div>
    <div class="sec">Your data</div>
    <p class="sd" style="margin:0 0 6px">${plural(S.items.length,"item")} stored in this browser. A backup keeps a copy or moves everything to another device.</p>
    <div class="two-b"><button type="button" class="btn ghost sm" data-act="backup">Back up</button><button type="button" class="btn ghost sm" data-act="restore">Restore</button><button type="button" class="btn ghost sm" data-act="sample">Sample fridge</button><button type="button" class="btn ghost sm" data-act="clear">Empty fridge</button></div>
    <button type="button" class="dang" data-act="erase">${armErase?"Tap again to erase everything":"Erase everything"}</button>
    <div class="ver">Version 1.1</div>`;
  if(sheet)sheet.scrollTop=top;
}
function prefsChanged(){persist();render();fillSettings()}
function doAvoid(){
  const inp=$("#avoidIn");if(!inp)return;
  const v=inp.value.trim();if(!v)return;
  const k=resolve(v);
  if(!k||!AVOIDABLE.includes(k)){toast("I don't use that in any meal, so there's nothing to hide.");return}
  if(!S.prefs.avoid.includes(k))S.prefs.avoid.push(k);
  prefsChanged();const n=$("#avoidIn");if(n)n.focus();
}
function backup(){
  const blob=new Blob([JSON.stringify({app:"last-night",version:1,exported:new Date().toISOString(),data:S},null,2)],{type:"application/json"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download=(brand().toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"fridge")+"-backup-"+iso(TODAY)+".json";
  document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(a.href),3000);
  toast("Backup saved to your downloads.");
}
function cleanImport(o){
  const d=o&&o.data?o.data:o;
  if(!d||!Array.isArray(d.items))return null;
  const validDate=s=>typeof s==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&Number.isFinite(parse(s).getTime())&&iso(parse(s))===s;
  const items=[];
  for(const it of d.items.slice(0,500)){
    if(!it||typeof it.name!=="string"||!validDate(it.exp))continue;
    const name=it.name.trim().slice(0,60);if(!name)continue;
    const key=resolve(name),life=Math.max(1,Math.min(999,Math.round(Number(it.life))||14));
    items.push({id:uid(),name,key,qty:Math.max(1,Math.min(99,Math.round(Number(it.qty))||1)),shelf:Object.prototype.hasOwnProperty.call(SHELFNAME,it.shelf)?it.shelf:(key?BYKEY[key].shelf:"middle"),exp:it.exp,added:validDate(it.added)?it.added:iso(addDays(parse(it.exp),-life)),life});
  }
  const pr=d.prefs&&typeof d.prefs==="object"?d.prefs:{};
  return {items,staples:Array.isArray(d.staples)?d.staples.filter(k=>CUPBOARD.includes(k)):[],prefs:{veg:!!pr.veg,avoid:Array.isArray(pr.avoid)?pr.avoid.filter(k=>AVOIDABLE.includes(k)):[],days:[3,4,5,7].includes(pr.days)?pr.days:4,urgent:[1,2,3].includes(pr.urgent)?pr.urgent:2}};
}

/* ---------- events ---------- */
document.addEventListener("click",ev=>{
  if(ev.target.id==="scrim"){closeSheet();return}
  const q=ev.target.closest("[data-q]");if(q&&sh){$("#sh-name").value=q.dataset.q;sh.name=q.dataset.q;$("#sh-name").classList.remove("err");syncSheet();return}
  const dc=ev.target.closest("[data-d]");if(dc&&sh){sh.days=Number(dc.dataset.d);sh.dT=true;syncSheet(true);return}
  const sc=ev.target.closest("#sh-shelf [data-s]");if(sc&&sh){sh.shelf=sc.dataset.s;sh.sT=true;syncSheet();return}
  if(ev.target.closest("#sh-m")&&sh){sh.qty=Math.max(1,sh.qty-1);syncSheet();return}
  if(ev.target.closest("#sh-p")&&sh){sh.qty=Math.min(99,sh.qty+1);syncSheet();return}
  if(ev.target.closest("#sh-del")&&sh){snap();const it=S.items.find(i=>i.id===sh.id);S.items=S.items.filter(i=>i.id!==sh.id);toast("Removed "+(it?it.name.toLowerCase():"item"),true);closeSheet();commit();return}
  const b=ev.target.closest("[data-act]");if(!b)return;
  const a=b.dataset.act,id=b.dataset.id;
  if(a==="tab"){if(ui.tab!==b.dataset.t){ui.tab=b.dataset.t;ui.all=false;render(true)}}
  else if(a==="add")openSheet(b.dataset.shelf?{shelf:b.dataset.shelf}:undefined);
  else if(a==="edit")openSheet({id});
  else if(a==="shortadd")openSheet({name:b.dataset.name});
  else if(a==="recipe")openRecipe(Number(b.dataset.r));
  else if(a==="seeall"){ui.tab="meals";ui.seg="ready";ui.all=false;render(true)}
  else if(a==="swap"){const d=Number(b.dataset.d);ui.swaps[d]=(ui.swaps[d]||0)+1;render()}
  else if(a==="pill"){const i=Number(b.dataset.i);ui.day=i;syncPills();const pg=$("#pager");if(pg)pg.scrollTo({left:i*pg.clientWidth,behavior:"smooth"})}
  else if(a==="seg"){ui.seg=b.dataset.s;ui.all=false;render()}
  else if(a==="quick"){ui.quick=!ui.quick;ui.all=false;render()}
  else if(a==="veg"){ui.veg=!ui.veg;ui.all=false;render()}
  else if(a==="showall"){ui.all=true;render()}
  else if(a==="staple"){const k=b.dataset.k;S.staples=S.staples.includes(k)?S.staples.filter(x=>x!==k):S.staples.concat(k);commit()}
  else if(a==="cook")cook(Number(b.dataset.r));
  else if(a==="splash")splash();
  else if(a==="settings")openSettings();
  else if(a==="set-veg"){S.prefs.veg=!S.prefs.veg;prefsChanged()}
  else if(a==="set-days"){S.prefs.days=Number(b.dataset.n);prefsChanged()}
  else if(a==="set-urgent"){S.prefs.urgent=Number(b.dataset.n);prefsChanged()}
  else if(a==="avoid")doAvoid();
  else if(a==="unavoid"){S.prefs.avoid=S.prefs.avoid.filter(k=>k!==b.dataset.k);prefsChanged()}
  else if(a==="replay"){closeSheet();setTimeout(splash,60)}
  else if(a==="backup")backup();
  else if(a==="restore"){const f=$("#restoreFile");if(f)f.click()}
  else if(a==="erase"){
    if(!armErase){armErase=true;fillSettings();clearTimeout(eraseT);eraseT=setTimeout(()=>{armErase=false;fillSettings()},4000);return}
    armErase=false;clearTimeout(eraseT);snap();
    S={items:[],staples:["pasta","rice","noodles","flour","oats"],prefs:Object.assign({},DEF,{avoid:[]})};
    closeSheet();toast("Everything erased",true);applyBrand();commit();
  }
  else if(a==="undo"){if(snapJ){S=JSON.parse(snapJ);norm();snapJ=null;$("#toast").classList.remove("on");applyBrand();commit()}}
  else if(a==="sample"){closeSheet();snap();const pr=S.prefs;S=seed();S.prefs=pr;toast("Sample fridge loaded",true);commit()}
  else if(a==="clear"){closeSheet();snap();S.items=[];toast("Fridge emptied",true);commit()}
});
document.addEventListener("input",ev=>{
  if(!sh)return;
  if(ev.target.id==="sh-name"){sh.name=ev.target.value;ev.target.classList.remove("err");syncSheet()}
  if(ev.target.id==="sh-days"){sh.days=ev.target.value===""?"":Number(ev.target.value);sh.dT=true;syncSheet()}
});
document.addEventListener("change",ev=>{
  if(ev.target.id!=="restoreFile")return;
  const f=ev.target.files&&ev.target.files[0];ev.target.value="";
  if(!f)return;
  if(f.size>1000000){toast("That file is too big to be a backup.");return}
  f.text().then(t=>{
    let o=null;try{o=JSON.parse(t)}catch(e){}
    const c=cleanImport(o);
    if(!c){toast("That isn't a backup I can read.");return}
    snap();S=c;norm();persist();closeSheet();applyBrand();render();
    toast("Restored "+plural(S.items.length,"item"),true);
  }).catch(()=>toast("I couldn't read that file."));
});
document.addEventListener("submit",ev=>{if(ev.target.id==="sheetForm"){ev.preventDefault();saveSheet()}});
document.addEventListener("keydown",ev=>{
  if(ev.key==="Escape"){closeSheet();return}
  if(ev.key==="Enter"&&ev.target.id==="avoidIn"){ev.preventDefault();doAvoid();return}
  if(ev.key==="Tab"){
    const sheet=document.querySelector("#sheetRoot .sheet");if(!sheet)return;
    const f=[...sheet.querySelectorAll("button,input,select,[tabindex]")].filter(e=>!e.disabled&&e.offsetParent!==null);
    if(!f.length)return;
    const first=f[0],last=f[f.length-1];
    if(!sheet.contains(document.activeElement)){first.focus();ev.preventDefault()}
    else if(ev.shiftKey&&document.activeElement===first){last.focus();ev.preventDefault()}
    else if(!ev.shiftKey&&document.activeElement===last){first.focus();ev.preventDefault()}
  }
});

const brand=()=>"Last Night";
function applyBrand(){document.title=brand();$("#lockup span").textContent=brand()}
applyBrand();
const reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
let spT=null;
function splashHTML(){
  const n=25,cx=100,cy=96,r0=24;let rays="";
  for(let i=0;i<n;i++){
    const t=i/(n-1),a=Math.PI-Math.PI*t;
    const len=12+44*Math.pow(Math.sin(Math.PI*t),.85)+(i%2?7:0);
    const x1=cx+Math.cos(a)*r0,y1=cy-Math.sin(a)*r0,x2=cx+Math.cos(a)*(r0+len),y2=cy-Math.sin(a)*(r0+len);
    rays+=`<line class="ray" pathLength="1" style="animation-delay:${(0.2+t*0.75).toFixed(2)}s" x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${i<3?"#e4572e":"#0d0d10"}" stroke-width="2.4" stroke-linecap="round"/>`;
  }
  rays+=`<line class="ray" pathLength="1" style="animation-delay:.1s" x1="22" y1="102" x2="178" y2="102" stroke="#0d0d10" stroke-width="1.8" stroke-linecap="round"/>`;
  return `<div class="sun"></div><svg class="fan" viewBox="0 0 200 106" aria-hidden="true">${rays}</svg><div class="wm" style="font-size:${brand().length>14?30:brand().length>10?38:46}px">${esc(brand())}</div><div class="tg">Cook from what is left</div><div class="skip">Tap to begin</div>`;
}
function splash(){
  const el=$("#splash");clearTimeout(spT);
  el.hidden=false;el.classList.remove("out");el.innerHTML=splashHTML();
  const done=()=>{clearTimeout(spT);el.classList.add("out");setTimeout(()=>{if(el.classList.contains("out"))el.hidden=true},1100)};
  el.onclick=done;
  spT=setTimeout(done,reduce?900:3300);
  try{sessionStorage.setItem("ll.splash","1")}catch(e){}
}
document.addEventListener("keydown",ev=>{const el=$("#splash");if(el&&!el.hidden&&!el.classList.contains("out"))el.click()});
render(true);
persist();
let seen=false;try{seen=sessionStorage.getItem("ll.splash")==="1"}catch(e){}
if(!seen)splash();
})();
