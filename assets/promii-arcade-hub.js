
const PROTOCOLS = [
  {id:'01',title:'01 · DUET GLASS',cat:'Skill & Physics',file:'games/01_duet_glass.html',desc:'Twin orbital droplets in anti-phase. Dodge monoliths.'},
  {id:'02',title:'02 · RESONANCE KEYS',cat:'Skill & Physics',file:'games/02_resonance_keys.html',desc:'4-lane harmonic codex erecting parametric glass towers.'},
  {id:'03',title:'03 · GLASS COLLAPSE',cat:'Skill & Physics',file:'games/03_glass_collapse.html',desc:'Ballistic demolition with structural gravity crush.'},
  {id:'04',title:'04 · AETHER DRIFT',cat:'Skill & Physics',file:'games/04_aether_drift.html',desc:'Buoyant flight; refraction rings multiply your swarm.'},
  {id:'05',title:'05 · ARCHI-ARCANA',cat:'Skill & Physics',file:'games/05_archi_arcana.html',desc:'Translucent roguelite deck of architectural triads.'},
  {id:'06',title:'06 · MONOLITH RELIC',cat:'Skill & Physics',file:'games/06_monolith_relic.html',desc:'Rotate prisms to illuminate brutalist sanctuaries.'},
  {id:'07',title:'07 · LIQUID HARVEST',cat:'Strategy & Sims',file:'games/07_liquid_harvest.html',desc:'Cultivate fractal crystals and trade Lumens.'},
  {id:'08',title:'08 · KINETIC KITCHEN',cat:'Strategy & Sims',file:'games/08_kinetic_kitchen.html',desc:'Photon synthesis mixing Cyan, Crimson, Cobalt.'},
  {id:'09',title:'09 · THE ARCHIVIST',cat:'Strategy & Sims',file:'games/09_the_archivist.html',desc:'Magnetic tome sorting by height and pitch.'},
  {id:'10',title:'10 · ABYSS MAZE',cat:'Strategy & Sims',file:'games/10_abyss_maze.html',desc:'Inertia sphere across walkways above the void.'},
  {id:'11',title:'11 · PRISM RACER',cat:'Arcade & Party',file:'games/11_prism_racer.html',desc:'Fiber tunnel runner with banking and boosts.'},
  {id:'12',title:'12 · VOID FLYER',cat:'Arcade & Party',file:'games/12_void_flyer.html',desc:'360° vector flight purging Glitch-Blocks.'},
  {id:'13',title:'13 · ILLUSION FINDER',cat:'Arcade & Party',file:'games/13_illusion_finder.html',desc:'Spot the forged anomaly between twin plates.'},
  {id:'14',title:'14 · ANOMALY HUNT',cat:'Arcade & Party',file:'games/14_anomaly_hunt.html',desc:'Tap fading anomalies before they vanish.'},
  {id:'15',title:'15 · CHRONICLE DELVER',cat:'Arcade & Party',file:'games/15_chronicle_delver.html',desc:'Collect artifacts across harmonic depth layers.'},
  {id:'16',title:'16 · SLAB TOWER',cat:'Originals & BIM',file:'games/16_slab_tower.html',desc:'Drop cantilevered floor slabs in rhythm.'},
  {id:'17',title:'17 · CLASH MATRIX',cat:'Originals & BIM',file:'games/17_clash_matrix.html',desc:'BIM MEP vs structural beam audit.'},
  {id:'18',title:'18 · DROPLET GRAVITY',cat:'Originals & BIM',file:'games/18_droplet_gravity.html',desc:'N-body liquid-glass figure-eight wells.'},
  {id:'19',title:'19 · PLINTH STRIDER',cat:'Skill & Physics',file:'games/19_plinth_strider.html',desc:'Side-scroller: double-jump, stomp drones, cobalt pads.'},
  {id:'20',title:'20 · MENAGERIE RUNNER',cat:'Arcade & Party',file:'games/20_menagerie_runner.html',desc:'Endless horizon — Rex, Michi, Sasha or Milo.'}
];
let activeCat='ALL', modalOpen=false, hubStars=0;
const aliasInput=document.getElementById('curatorAlias');
try{aliasInput.value=PeakStore.getAlias()}catch(e){}
aliasInput.addEventListener('change',()=>{try{aliasInput.value=PeakStore.setAlias(aliasInput.value)}catch(e){}});
document.getElementById('starRow').querySelectorAll('button').forEach(b=>{
  b.onclick=()=>{hubStars=+b.dataset.s;document.getElementById('starRow').querySelectorAll('button').forEach(x=>x.style.borderColor='');b.style.borderColor='var(--cyan)'};
});
function saveHubRating(){
  try{const all=JSON.parse(localStorage.getItem('promii_hub_ratings')||'[]');all.push({stars:hubStars,note:document.getElementById('rateNote').value,ts:Date.now()});localStorage.setItem('promii_hub_ratings',JSON.stringify(all.slice(-50)));if(window.PromiiToast)PromiiToast('RATING SAVED')}catch(e){}
  document.getElementById('rateHub').classList.remove('open');
}
function renderCards(){
  const grid=document.getElementById('grid');
  if(!grid) return;
  const list=PROTOCOLS.filter(p=>activeCat==='ALL'||p.cat===activeCat);
  grid.innerHTML=list.map(p=>`<article class="card" data-id="${p.id}" onclick="openTheater('${p.id}')"><div class="card-top"><span class="badge">${p.cat}</span></div><h3>${p.title}</h3><p>${p.desc}</p><div class="card-cta">PLAY PROTOCOL →</div></article>`).join('');
}
function setCat(cat,btn){
  activeCat=cat;
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  renderCards();
}
function openTheater(id){
  const p=PROTOCOLS.find(x=>x.id===id); if(!p) return;
  modalOpen=true;
  const modal=document.getElementById('theater');
  if(!modal) return;
  modal.classList.add('open');
  const frame=document.getElementById('theaterFrame');
  const title=document.getElementById('theaterTitle');
  if(title) title.textContent=p.title;
  if(frame) frame.src='/'+p.file;
}
function closeTheater(){
  modalOpen=false;
  const modal=document.getElementById('theater');
  const frame=document.getElementById('theaterFrame');
  if(frame) frame.src='about:blank';
  if(modal) modal.classList.remove('open');
}
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&modalOpen)closeTheater()});
const params=new URLSearchParams(location.search);if(params.get('protocol')){const t=PROTOCOLS.find(p=>p.id===params.get('protocol'));if(t)setTimeout(()=>openTheater(t.id),250)}
const bg=document.getElementById('bgCanvas'),bctx=bg?bg.getContext('2d'):null;let bw=0,bh=0;
function resizeBg(){if(!bg||!bctx)return;const d=Math.min(devicePixelRatio||1,2);bw=innerWidth;bh=innerHeight;bg.width=bw*d;bg.height=bh*d;bg.style.width=bw+'px';bg.style.height=bh+'px';bctx.setTransform(d,0,0,d,0,0)}
if(bg){resizeBg();addEventListener('resize',resizeBg);}
const motes=Array.from({length:36},()=>({x:Math.random(),y:Math.random(),r:.6+Math.random()*1.8,vy:.006+Math.random()*.014,vx:(Math.random()-.5)*.004,c:Math.random()<.6?'rgba(34,224,200,.28)':Math.random()<.5?'rgba(47,107,255,.22)':'rgba(255,255,255,.14)'}));
const flares=Array.from({length:5},(_,i)=>({x:.15+i*.18,y:.2+Math.random()*.5,r:40+Math.random()*50,phase:Math.random()*Math.PI*2}));
function loopBg(){requestAnimationFrame(loopBg);if(!bctx||modalOpen||document.hidden)return;
  bctx.fillStyle='#08080C';bctx.fillRect(0,0,bw,bh);
  const t=performance.now()*0.001;
  flares.forEach((f,i)=>{const px=f.x*bw+Math.sin(t*.3+f.phase)*20;const py=f.y*bh+Math.cos(t*.25+f.phase)*12;
    const g=bctx.createRadialGradient(px,py,0,px,py,f.r);g.addColorStop(0,i%2?'rgba(34,224,200,.07)':'rgba(47,107,255,.06)');g.addColorStop(1,'transparent');
    bctx.fillStyle=g;bctx.beginPath();bctx.arc(px,py,f.r,0,Math.PI*2);bctx.fill();});
  motes.forEach(m=>{m.y-=m.vy;m.x+=m.vx;if(m.y<0)m.y=1;if(m.x<0)m.x=1;if(m.x>1)m.x=0;
    bctx.beginPath();bctx.arc(m.x*bw,m.y*bh,m.r,0,Math.PI*2);bctx.fillStyle=m.c;bctx.fill();});
}
renderCards();requestAnimationFrame(loopBg);
