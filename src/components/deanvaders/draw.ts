import { Game, Enemy, WIDTH, HEIGHT, PLAYER_Y } from "./engine";
const INK = "#1b2044";
function rounded(c: CanvasRenderingContext2D,x:number,y:number,w:number,h:number,r:number,fill:string,stroke?:string){
  c.beginPath(); c.roundRect(x,y,w,h,r); c.fillStyle=fill; c.fill();
  if(stroke){c.strokeStyle=stroke;c.lineWidth=2.5;c.stroke();}
}
function line(c:CanvasRenderingContext2D,points:number[],color:string,width=2){
  c.beginPath(); c.moveTo(points[0],points[1]);
  for(let i=2;i<points.length;i+=2)c.lineTo(points[i],points[i+1]);
  c.lineWidth=width;c.strokeStyle=color;c.lineCap="round";c.lineJoin="round";c.stroke();
}
function eyes(c:CanvasRenderingContext2D,y=2){
  c.fillStyle=INK; for(const x of [-8,8]){c.beginPath();c.arc(x,y,2.4,0,Math.PI*2);c.fill();}
}
export function enemy(c:CanvasRenderingContext2D,e:Enemy,t:number){
 c.save();c.translate(e.x,e.y+Math.sin(t*2+e.phase)*3);c.rotate(Math.sin(t+e.phase)*.045);
 c.shadowColor="#050e3144";c.shadowBlur=0;c.shadowOffsetY=5;
 if(e.kind==="email"){
   rounded(c,-27,-19,54,39,9,"#94f4e3",INK);c.shadowOffsetY=0;
   line(c,[-24,-14,0,3,24,-14],"#36a9a0",2.5);eyes(c,9);
   rounded(c,13,-27,20,20,8,"#ff7f97",INK);c.fillStyle=INK;c.font="bold 12px Arial";c.textAlign="center";c.fillText("9",23,-13);
 }else if(e.kind==="bill"){
   rounded(c,-21,-24,42,49,6,"#ffe4a1",INK);c.shadowOffsetY=0;
   c.fillStyle="#b05e27";c.font="900 23px Arial";c.textAlign="center";c.fillText("$",0,2);eyes(c,13);
   line(c,[-12,-15,12,-15],"#e5ad58");
 }else if(e.kind==="zoom"){
   rounded(c,-27,-20,54,41,10,"#a2c7ff",INK);c.shadowOffsetY=0;
   rounded(c,-16,-10,22,17,4,"#fff");
   c.beginPath();c.moveTo(8,-7);c.lineTo(17,-12);c.lineTo(17,8);c.lineTo(8,4);c.closePath();c.fill();eyes(c,13);
 }else{
   rounded(c,-25,-23,50,46,8,"#e6bdff",INK);c.shadowOffsetY=0;
   rounded(c,-17,-16,34,7,3,"#ad78d8");
   c.fillStyle=INK;c.font="bold 10px Arial";c.textAlign="center";c.fillText("TO DO",0,5);eyes(c,14);
   c.fillStyle="#fff";c.beginPath();c.arc(25,-20,8,0,Math.PI*2);c.fill();c.strokeStyle=INK;c.lineWidth=2;c.stroke();
   line(c,[25,-24,25,-18,29,-18],INK,1.5);
 }
 c.restore();
}
function coffee(c:CanvasRenderingContext2D,x:number,y:number){
 c.save();c.translate(x,y);c.shadowColor="#ffd66f";c.shadowBlur=15;
 c.strokeStyle="#ffe6ac";c.lineWidth=5;c.beginPath();c.arc(11,0,8,-Math.PI/2,Math.PI/2);c.stroke();
 rounded(c,-14,-14,28,31,7,"#ffe6ac",INK);c.shadowBlur=0;
 rounded(c,-14,-6,28,11,1,"#a8754e");c.font="15px Arial";c.fillStyle="#fff";c.textAlign="center";c.fillText("✦",0,6);
 line(c,[-5,-20,-2,-26],"#fff4d9",2);line(c,[5,-19,8,-25],"#fff4d9",2);c.restore();
}
export function draw(c:CanvasRenderingContext2D,g:Game,head:HTMLImageElement|null,reduced:boolean){
 c.clearRect(0,0,WIDTH,HEIGHT);
 const bg=c.createLinearGradient(0,0,0,HEIGHT);bg.addColorStop(0,"#131b43");bg.addColorStop(1,"#292753");
 c.fillStyle=bg;c.fillRect(0,0,WIDTH,HEIGHT);
 // Quiet stars and soft orbital bands, never flashing.
 for(let i=0;i<48;i++){
  const x=(i*137+32)%WIDTH,y=(i*83+18)%HEIGHT;
  c.fillStyle=i%4===0?"#8ac3dd77":"#b1c2ed33";c.beginPath();c.arc(x,y,i%4===0?1.7:1,0,Math.PI*2);c.fill();
 }
 c.strokeStyle="#959be712";c.lineWidth=1;
 for(let i=0;i<4;i++){c.beginPath();c.ellipse(WIDTH/2,HEIGHT+120,240+i*105,210+i*75,0,Math.PI,Math.PI*2);c.stroke();}
 c.fillStyle="#7891cc0d";c.fillRect(0,440,WIDTH,120);
 c.setLineDash([5,7]);line(c,[18,440,WIDTH-18,440],"#96b9ff28",1);c.setLineDash([]);
 c.fillStyle="#a6b1d1";c.font="bold 10px Arial";c.textAlign="right";c.fillText("PROTECT YOUR PEACE",WIDTH-22,HEIGHT-20);
 for(const e of g.enemies)enemy(c,e,reduced?0:g.time);
 for(const h of g.hazards){rounded(c,h.x-4,h.y-9,8,18,4,"#ffa2af");}
 for(const s of g.shots){
  c.shadowBlur=reduced?0:10;c.shadowColor=g.coffee>0?"#ffcd6f":"#70f8df";
  rounded(c,s.x-2.5,s.y-13,5,23,3,g.coffee>0?"#ffe7a9":"#aefff0");
 } c.shadowBlur=0;
 for(const cup of g.cups)coffee(c,cup.x,cup.y);
 c.save();c.translate(g.x,PLAYER_Y);
 if(g.invincible>0)c.globalAlpha=.55;
 // A soft shield communicates temporary immunity without strobing.
 if(g.invincible>0 || g.coffee>0){
  c.strokeStyle=g.coffee>0?"#ffd175":"#91e8ed";c.lineWidth=2.5;c.beginPath();c.ellipse(0,0,42,48,0,0,Math.PI*2);c.stroke();
 }
 if(head && head.complete && head.naturalWidth) c.drawImage(head,-48,-48,96,96);
 else {rounded(c,-27,-31,54,65,22,"#e9ac83",INK);rounded(c,-28,-37,56,22,12,"#a5a8b6",INK);eyes(c,-9);rounded(c,-16,12,32,22,10,"#dae0e6");line(c,[-10,13,0,18,10,13],INK,3);}
 // Laser glow is anchored to the two eyes of the head sprite.
 if(g.cooldown>.1 && g.status==="playing"){
   for(const x of [-10,11]){c.fillStyle=g.coffee>0?"#ffe9a8":"#99ffe9";c.beginPath();c.ellipse(x,-2,4,2.5,0,0,Math.PI*2);c.fill();}
 }
 c.restore();
 if(!reduced)for(const s of g.sparks){c.globalAlpha=Math.max(0,s.life*2);rounded(c,s.x-3,s.y-3,6,6,2,s.color);}c.globalAlpha=1;
 if(g.noticeTime>0){
  c.font="bold 14px Arial";c.textAlign="center";
  const w=c.measureText(g.notice).width+32;
  rounded(c,(WIDTH-w)/2,365,w,35,12,"#0c133cdd","#8ee9dd66");
  c.fillStyle="#e1fff7";c.fillText(g.notice,WIDTH/2,388);
 }
}
