const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync('js/app.js', 'utf8');
function app(saved) {
  const elements = new Map();
  function element(id) {
    if (!elements.has(id)) elements.set(id, {innerHTML:'',dataset:{},classList:{add(){},remove(){},toggle(){}},
      querySelector(){return element('body')},querySelectorAll(){return []},scrollTop:0,
      style:{setProperty(){}},setAttribute(){},removeAttribute(){},addEventListener(){}});
    return elements.get(id);
  }
  const storage = new Map(saved ? [['fridge.v1',JSON.stringify(saved)]] : []);
  const ctx = {console, Date, Math, setTimeout(){},clearTimeout(){},
    document:{querySelector:element,querySelectorAll(){return []},addEventListener(){}},
    window:{addEventListener(){},matchMedia:null},
    localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},
    sessionStorage:{getItem:()=> '1'}};
  vm.createContext(ctx);
  vm.runInContext(source.replace(/\}\)\(\);\s*$/, 'globalThis.test={cleanImport,resolve,esc,render,ui,getState:()=>S};})();'),ctx);
  return {api:ctx.test,elements,storage};
}
const {api,elements} = app();
for(const tab of ['tonight','week','meals','fridge']) {
  api.ui.tab=tab;api.render();
  assert(elements.get('#screen').innerHTML.length>100,tab);
}
assert.equal(api.resolve('constructor'),null);
const attack={items:[{id:'" onclick="alert(1)',name:'<img src=x onerror=alert(1)>',exp:'2027-01-01',shelf:'__proto__',qty:Infinity},
 {name:'bad date',exp:'2026-02-31'}],staples:['__proto__','rice'],prefs:{days:999,avoid:['__proto__']}};
const clean=api.cleanImport(attack);
assert.equal(clean.items.length,1);
assert.equal(clean.items[0].shelf,'middle');
assert(!clean.items[0].id.includes('"'));
assert.equal(clean.items[0].qty,99);
assert.equal(clean.prefs.days,4);
assert.equal(clean.staples.join(','),'rice');
assert.equal(api.cleanImport({}),null);
assert.equal(api.cleanImport({items:[]}).items.length,0);
assert(api.esc(attack.items[0].name).includes('&lt;img'));
const restored=app(attack);
assert.equal(restored.api.getState().items.length,1);
restored.api.ui.tab='fridge';restored.api.render();
assert(!restored.elements.get('#screen').innerHTML.includes('<img src=x'));
assert(!restored.elements.get('#screen').innerHTML.includes('onclick='));
const html=fs.readFileSync('index.html','utf8');
assert(!/<script(?![^>]*\bsrc=)[^>]*>/i.test(html),'No inline scripts');
assert(html.includes('Content-Security-Policy'));
const manifest=JSON.parse(fs.readFileSync('manifest.webmanifest','utf8'));
for(const icon of manifest.icons) assert(fs.existsSync(icon.src));
assert.equal(manifest.display,'standalone');
for(const f of ['js/app.js','js/register.js','sw.js']) new vm.Script(fs.readFileSync(f,'utf8'));
console.log('PASS: four screens, startup, saved/imported hostile data, dates, escaping, CSP and assets.');

(async()=>{
  const handlers={};const entries=new Map();let requests=0,offline=false;
  const cache={addAll:async()=>{},put:async(req,res)=>entries.set(req.url,res),match:async req=>entries.get(req.url)};
  const removed=[];
  const scope='https://example.test/fridge/';
  const current='last-night-'+encodeURIComponent(scope)+'-v2';
  const sw={URL,Request,Response,Set,Error,encodeURIComponent,
    self:{registration:{scope},clients:{claim:async()=>{}},addEventListener:(name,fn)=>handlers[name]=fn},
    caches:{open:async()=>cache,keys:async()=>[current,current.replace('v2','v1'),'other-app-cache'],delete:async name=>removed.push(name)},
    fetch:async()=>{requests++;if(offline)throw Error('offline');return new Response('current app')}};
  vm.runInNewContext(fs.readFileSync('sw.js','utf8'),sw);
  let response;
  const request=url=>{response=undefined;handlers.fetch({request:new Request(url),respondWith:p=>response=p});return response};
  assert.equal(await (await request(scope+'js/app.js')).text(),'current app');
  offline=true;
  assert.equal(await (await request(scope+'js/app.js')).text(),'current app');
  const before=requests;
  assert.equal(request(scope+'.env'),undefined);
  assert.equal(request(scope+'fridge-backup.json'),undefined);
  assert.equal(request('https://outside.test/script.js'),undefined);
  assert.equal(requests,before);
  let activation;handlers.activate({waitUntil:p=>activation=p});await activation;
  assert.equal(removed.length,1);
  assert(!removed.includes('other-app-cache'));
  console.log('PASS: offline fallback, asset allowlist, external/private request exclusion and scoped cache cleanup.');
})().catch(e=>{console.error(e);process.exitCode=1});
