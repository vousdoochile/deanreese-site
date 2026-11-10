/** Small, dependency-free simulation. All art/audio is local and original. */
export const WIDTH = 720;
export const HEIGHT = 560;
export const PLAYER_Y = 492;
export type Kind = "email" | "bill" | "zoom" | "jira";
export type Enemy = { id: number; x: number; y: number; kind: Kind; phase: number };
export type Shot = { x: number; y: number; vx: number; vy: number };
export type Spark = { x: number; y: number; vx: number; vy: number; life: number; color: string };
export type Input = { left: boolean; right: boolean; fire: boolean; target: number | null };
export type Game = {
  status: "ready" | "playing" | "paused" | "over";
  x: number; time: number; score: number; wave: number; lives: number; kills: number;
  coffee: number; invincible: number; cooldown: number; fireClock: number;
  direction: number; waveDelay: number; enemies: Enemy[]; shots: Shot[]; hazards: Shot[];
  cups: {x: number; y: number}[]; sparks: Spark[]; notice: string; noticeTime: number;
  sound: "shot" | "pop" | "hit" | "coffee" | null;
};
export function spawnWave(wave: number): Enemy[] {
  const kinds: Kind[] = ["email", "bill", "zoom", "jira"];
  return Array.from({length: 18}, (_, i) => ({id: wave * 100 + i,
    x: 140 + (i % 6) * 86, y: 78 + Math.floor(i / 6) * 63,
    kind: kinds[(i + wave - 1) % 4], phase: i * .7}));
}
export function createGame(): Game {
  return {status:"ready", x:360, time:0, score:0, wave:1, lives:3, kills:0,
    coffee:0, invincible:0, cooldown:0, fireClock:1.4, direction:1, waveDelay:0,
    enemies:spawnWave(1), shots:[], hazards:[], cups:[], sparks:[],
    notice:"", noticeTime:0, sound:null};
}
export const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
function burst(g: Game, x: number, y: number, color: string) {
  for (let i=0; i<10; i++) {
    const a = i / 10 * Math.PI * 2;
    g.sparks.push({x,y,vx:Math.cos(a)*90,vy:Math.sin(a)*90,life:.5,color});
  }
  if (g.sparks.length > 120) g.sparks.splice(0, g.sparks.length-120);
}
function damage(g: Game) {
  if (g.invincible > 0) return;
  g.lives--; g.invincible=1.7; g.sound="hit";
  burst(g,g.x,PLAYER_Y,"#ff8799");
  g.notice=g.lives ? "That could have been an email." : "OUT OF OFFICE.";
  g.noticeTime=1.7;
  if (!g.lives) g.status="over";
}
export function step(g: Game, input: Input, seconds: number, random = Math.random) {
  if (g.status !== "playing") return;
  const dt=clamp(seconds,0,.04);
  g.time+=dt; g.sound=null; g.coffee=Math.max(0,g.coffee-dt);
  g.invincible=Math.max(0,g.invincible-dt); g.cooldown-=dt; g.fireClock-=dt;
  g.noticeTime=Math.max(0,g.noticeTime-dt);
  if (input.target !== null) g.x += clamp(input.target-g.x,-480*dt,480*dt);
  else g.x += ((input.right?1:0)-(input.left?1:0))*360*dt;
  g.x=clamp(g.x,38,WIDTH-38);
  if (input.fire && g.cooldown<=0) {
    for (const offset of [-10,11]) g.shots.push({x:g.x+offset,y:PLAYER_Y-2,vx:0,vy:-620});
    if (g.coffee>0) for (const sign of [-1,1]) g.shots.push({x:g.x+sign*11,y:PLAYER_Y-2,vx:sign*110,vy:-580});
    g.cooldown=g.coffee>0 ? .13 : .24; g.sound="shot";
  }
  const speed=31+Math.min(g.wave-1,12)*5;
  if (g.enemies.some(e => (g.direction>0 && e.x>=WIDTH-49) || (g.direction<0 && e.x<=49))) {
    g.direction *= -1;
    g.enemies.forEach(e=>e.y+=12);
  }
  g.enemies.forEach(e=>e.x+=g.direction*speed*dt);
  if (g.fireClock<=0 && g.enemies.length && g.hazards.length < 16) {
    const e=g.enemies[Math.floor(random()*g.enemies.length)];
    g.hazards.push({x:e.x,y:e.y+24,vx:clamp((g.x-e.x)*.12,-40,40),vy:150+Math.min(g.wave,15)*9});
    g.fireClock=Math.max(.34,1.05-g.wave*.055);
  }
  for (const s of g.shots) {s.x+=s.vx*dt; s.y+=s.vy*dt;}
  for (const s of g.hazards) {s.x+=s.vx*dt; s.y+=s.vy*dt;}
  for (const s of g.shots) {
    const index=g.enemies.findIndex(e=>Math.abs(s.x-e.x)<26 && Math.abs(s.y-e.y)<24);
    if(index<0) continue;
    const e=g.enemies[index]; g.enemies.splice(index,1); s.y=-100;
    g.kills++; g.score+=e.kind==="jira"?150:e.kind==="zoom"?125:100;
    burst(g,e.x,e.y,["#6df4dc","#ffce74","#96b9ff","#f9a4d7"][["email","bill","zoom","jira"].indexOf(e.kind)]);
    g.sound="pop";
    if(g.kills%6===0) g.cups.push({x:e.x,y:e.y});
  }
  g.shots=g.shots.filter(s=>s.y>-30 && s.x>-20 && s.x<WIDTH+20);
  for(const h of g.hazards) {
    if(Math.abs(h.x-g.x)<24 && Math.abs(h.y-PLAYER_Y)<31) {damage(g); h.y=HEIGHT+50;}
  }
  g.hazards=g.hazards.filter(s=>s.y<HEIGHT+30);
  for (const cup of g.cups) {
    cup.y+=115*dt;
    if(Math.abs(cup.x-g.x)<42 && Math.abs(cup.y-PLAYER_Y)<40) {
      g.coffee=8; g.score+=250; cup.y=HEIGHT+80; g.sound="coffee";
      g.notice="COFFEE MODE. LET'S DO THIS."; g.noticeTime=2;
      burst(g,g.x,PLAYER_Y,"#ffce74");
    }
  }
  g.cups=g.cups.filter(c=>c.y<HEIGHT+35);
  g.sparks.forEach(s=>{s.x+=s.vx*dt; s.y+=s.vy*dt; s.life-=dt;});
  g.sparks=g.sparks.filter(s=>s.life>0);
  if(g.enemies.some(e=>e.y>PLAYER_Y-55)) {
    g.lives=0; g.status="over"; g.notice="Your calendar won this round.";
  }
  if(!g.enemies.length && !g.waveDelay && g.status==="playing") {
    g.score+=500; g.waveDelay=2; g.hazards=[];
    g.notice="INBOX ZERO! +500"; g.noticeTime=2;
  }
  if(g.waveDelay>0) {
    g.waveDelay-=dt;
    if(g.waveDelay<=0) {g.wave++; g.enemies=spawnWave(g.wave); g.waveDelay=0; g.fireClock=1.4; g.shots=[];}
  }
}
