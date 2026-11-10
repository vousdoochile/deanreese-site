"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createGame, Game, Input, step, WIDTH, HEIGHT } from "./engine";
import { draw } from "./draw";
import { ArcadeAudio, createArcadeAudio } from "./audio";
import styles from "./deanvaders.module.css";

const emptyInput = (): Input => ({left:false,right:false,fire:false,target:null});
const bestKey = "deanvaders-best-v1";
export default function Deanvaders() {
  const helpId=useId();
  const shell=useRef<HTMLDivElement>(null);
  const canvas=useRef<HTMLCanvasElement>(null);
  const game=useRef<Game>(createGame());
  const input=useRef<Input>(emptyInput());
  const head=useRef<HTMLImageElement|null>(null);
  const audio=useRef<ArcadeAudio|null>(null);
  const soundRequest=useRef(0);
  const soundOn=useRef(false);
  const reduced=useRef(false);
  const [status,setStatus]=useState<Game["status"]>("ready");
  const [hud,setHud]=useState({score:0,wave:1,lives:3,coffee:0,kills:0});
  const [best,setBest]=useState(0);
  const [muted,setMuted]=useState(true);
  const [music,setMusic]=useState(true);
  const [calm,setCalm]=useState(false);
  const [message,setMessage]=useState("");

  const paint=useCallback(()=>{
    const c=canvas.current?.getContext("2d"); if(!c)return;
    draw(c,game.current,head.current,reduced.current);
  },[]);
  const pause=useCallback(()=>{
    if(game.current.status!=="playing")return;
    game.current.status="paused";input.current=emptyInput();audio.current?.silence();setStatus("paused");
  },[]);
  const start=()=>{
    audio.current?.reset();
    game.current=createGame();game.current.status="playing";input.current=emptyInput();
    setHud({score:0,wave:1,lives:3,coffee:0,kills:0});setStatus("playing");
    setMessage("Game started. Move with arrow keys or A and D. Hold Space to fire.");
    canvas.current?.focus();
    if(soundOn.current)void audio.current?.unlock().catch(()=>{});
  };
  const resume=()=>{if(soundOn.current)void audio.current?.unlock().catch(()=>{});game.current.status="playing";input.current=emptyInput();setStatus("playing");canvas.current?.focus();};

  useEffect(()=>{
    const img=new Image();img.onload=paint;img.src="/deanvaders-head.webp";head.current=img;
    const media=window.matchMedia("(prefers-reduced-motion: reduce)");
    reduced.current=media.matches;
    // Initialize browser-only preferences after hydration, with cleanup on unmount.
    const preferencesFrame=requestAnimationFrame(()=>{
      setCalm(media.matches);
      try {const n=Number(localStorage.getItem(bestKey));if(Number.isFinite(n)&&n>0)setBest(Math.floor(n));}catch{/* Storage is optional. */}
    });
    const change=()=>{reduced.current=media.matches;setCalm(media.matches);paint();};
    media.addEventListener("change",change);
    paint();
    const onHidden=()=>{if(document.hidden)pause();};
    document.addEventListener("visibilitychange",onHidden);
    window.addEventListener("blur",pause);
    const observer=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)pause();},{threshold:0});
    if(shell.current)observer.observe(shell.current);
    return ()=>{cancelAnimationFrame(preferencesFrame);media.removeEventListener("change",change);document.removeEventListener("visibilitychange",onHidden);window.removeEventListener("blur",pause);observer.disconnect();img.onload=null;audio.current?.dispose();audio.current=null;};
  },[paint,pause]);

  useEffect(()=>{
    if(status!=="playing"){paint();return;}
    let frame=0,last=0,lastHud=0,lastNotice="";
    const tick=(now:number)=>{
      const g=game.current;
      if(game.current.status!=="playing")return;
      step(g,input.current,last?(now-last)/1000:0);last=now;
      audio.current?.update(g);
      paint();
      if(now-lastHud>100 || g.status==="over"){
        setHud({score:g.score,wave:g.wave,lives:g.lives,coffee:g.coffee,kills:g.kills});lastHud=now;
      }
      if(g.noticeTime>0 && g.notice!==lastNotice){lastNotice=g.notice;setMessage(g.notice);}
      if(g.status==="over"){
        input.current=emptyInput();setStatus("over");
        setMessage(`Game over. Score ${g.score}. Wave ${g.wave}. Play again to try another round.`);
        setBest(previous=>{const next=Math.max(previous,g.score);try{localStorage.setItem(bestKey,String(next));}catch{}return next;});
        return;
      }
      frame=requestAnimationFrame(tick);
    };
    frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);
  },[status,paint]);

  const toggleSound=async()=>{
    const request=++soundRequest.current;
    if(soundOn.current){soundOn.current=false;audio.current?.setEnabled(false);setMuted(true);return;}
    try{
      audio.current??=createArcadeAudio();
      const player=audio.current;
      await player.unlock();
      if(request!==soundRequest.current || audio.current!==player)return;
      player.setMusic(music);player.setEnabled(true);soundOn.current=true;setMuted(false);
    }
    catch{setMessage("Sound is unavailable in this browser. You can still play silently.");}
  };
  const toggleMusic=()=>{audio.current?.setMusic(!music);setMusic(!music);};
  const key=(e:React.KeyboardEvent,down:boolean)=>{
    if(e.target!==canvas.current)return;
    const k=e.key.toLowerCase();
    if(["arrowleft","arrowright","arrowup","arrowdown","a","d"," ","p","escape"].includes(k))e.preventDefault();
    if(k==="arrowleft"||k==="a")input.current.left=down;
    if(k==="arrowright"||k==="d")input.current.right=down;
    if(k===" ")input.current.fire=down;
    if(down&&!e.repeat&&(k==="p"||k==="escape")){if(game.current.status==="playing")pause();else if(game.current.status==="paused")resume();}
  };
  const target=(e:React.PointerEvent<HTMLCanvasElement>)=>{
    const rect=e.currentTarget.getBoundingClientRect();
    input.current.target=(e.clientX-rect.left)/rect.width*WIDTH;
  };
  const release=()=>{input.current.target=null;input.current.fire=false;};
  const touch=(e:React.PointerEvent<HTMLButtonElement>,direction:"left"|"right"|"fire",down:boolean)=>{
    e.preventDefault();
    if(down){e.currentTarget.setPointerCapture(e.pointerId);canvas.current?.focus();}
    input.current[direction]=down;
  };
  const controlKey=(e:React.KeyboardEvent<HTMLButtonElement>,direction:"left"|"right"|"fire",down:boolean)=>{
    if(e.key!==" " && e.key!=="Enter")return;
    e.preventDefault();e.stopPropagation();input.current[direction]=down;
  };
  return <div ref={shell} className={styles.game} onKeyDown={e=>key(e,true)} onKeyUp={e=>key(e,false)}
    onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node|null))pause();}}>
    <div className={styles.topbar}><span><i aria-hidden="true"/> DEAN&apos;S MINI ARCADE</span><span>BEST {String(Math.max(best,hud.score)).padStart(5,"0")}</span></div>
    <div className={styles.hud} aria-label={`Score ${hud.score}, wave ${hud.wave}, ${hud.lives} lives`}>
      <div><span>SCORE</span><strong>{String(hud.score).padStart(5,"0")}</strong></div>
      <div><span>WAVE</span><strong>{String(hud.wave).padStart(2,"0")}</strong></div>
      <div><span>PEACE OF MIND</span><strong className={styles.hearts} aria-label={`${hud.lives} lives`}>{"♥".repeat(hud.lives)}<b>{"♡".repeat(3-hud.lives)}</b></strong></div>
      <div className={styles.coffee}><span>COFFEE</span><strong>{hud.coffee>0?`${Math.ceil(hud.coffee)}s ⚡`:"☕ READY?"}</strong></div>
    </div>
    <div className={styles.arena}>
      <canvas ref={canvas} width={WIDTH} height={HEIGHT} tabIndex={0} aria-label="Deanvaders game field" aria-describedby={helpId} onBlur={()=>{input.current=emptyInput();}}
        onPointerDown={e=>{if(game.current.status!=="playing")return;e.currentTarget.setPointerCapture(e.pointerId);e.currentTarget.focus();target(e);input.current.fire=true;}}
        onPointerMove={e=>{if(e.currentTarget.hasPointerCapture(e.pointerId))target(e);}}
        onPointerUp={release} onPointerCancel={release} onLostPointerCapture={release}>
        A visual arcade game. Move left and right, fire eye lasers, and catch coffee. Controls and status are available below.
      </canvas>
      {status!=="playing" && <div className={styles.overlay}>
        <div className={styles.intro}>
          <span className={styles.eyebrow}>{status==="ready"?"GET YOUR HEAD IN THE GAME":status==="paused"?"TAKE YOUR TIME":"THE INBOX ALWAYS RETURNS"}</span>
          <h2>{status==="ready"?<>DEAN<span>VADERS</span></>:status==="paused"?"COFFEE BREAK.":"OUT OF OFFICE."}</h2>
          <p>{status==="ready"?"One head. Two lasers. Entirely too many meetings.":status==="paused"?"Your peace and your progress are protected.":`You cleared ${hud.kills} distractions and scored ${hud.score.toLocaleString()} points.`}</p>
          <button className={styles.play} onClick={status==="paused"?resume:start}>{status==="ready"?"LET'S CLEAR MY SCHEDULE":status==="paused"?"BACK TO IT":"ONE MORE COFFEE ↻"}<span aria-hidden="true">{status==="ready"?" →":""}</span></button>
          <div className={styles.introHint}>{status==="ready"?"Move ← → or A / D · Hold SPACE to fire":"No rush. This is the fun kind of work."}</div>
          {status==="ready" && <div className={styles.touchHint}>On your phone? Drag anywhere in the game to move + fire.</div>}
        </div>
      </div>}
    </div>
    <div className={styles.controls}>
      <div className={styles.touchControls} aria-label="Touch game controls">
        <button aria-label="Move left" disabled={status!=="playing"} onPointerDown={e=>touch(e,"left",true)} onPointerUp={e=>touch(e,"left",false)} onPointerCancel={e=>touch(e,"left",false)} onLostPointerCapture={e=>touch(e,"left",false)} onKeyDown={e=>controlKey(e,"left",true)} onKeyUp={e=>controlKey(e,"left",false)} onBlur={()=>{input.current.left=false;}}>←</button>
        <button aria-label="Move right" disabled={status!=="playing"} onPointerDown={e=>touch(e,"right",true)} onPointerUp={e=>touch(e,"right",false)} onPointerCancel={e=>touch(e,"right",false)} onLostPointerCapture={e=>touch(e,"right",false)} onKeyDown={e=>controlKey(e,"right",true)} onKeyUp={e=>controlKey(e,"right",false)} onBlur={()=>{input.current.right=false;}}>→</button>
        <button aria-label="Fire eye lasers" className={styles.fire} disabled={status!=="playing"} onPointerDown={e=>touch(e,"fire",true)} onPointerUp={e=>touch(e,"fire",false)} onPointerCancel={e=>touch(e,"fire",false)} onLostPointerCapture={e=>touch(e,"fire",false)} onKeyDown={e=>controlKey(e,"fire",true)} onKeyUp={e=>controlKey(e,"fire",false)} onBlur={()=>{input.current.fire=false;}}>FIRE</button>
      </div>
      <div className={styles.settings}>
        <button onClick={()=>status==="paused"?resume():pause()} disabled={status==="ready"||status==="over"}>{status==="paused"?"▶ Resume":"Ⅱ Pause"}</button>
        <button onClick={toggleSound} aria-pressed={!muted}>Sound {muted?"off":"on"}</button>
        <button onClick={toggleMusic} aria-pressed={music} disabled={muted} title={muted?"Turn Sound on to hear music":"Toggle the quiet 8-bit pulse; keep laser sounds"}>Music {music?"on":"off"}</button>
        <button onClick={()=>{reduced.current=!calm;setCalm(!calm);paint();}} aria-pressed={calm}>Calm FX {calm?"on":"off"}</button>
      </div>
    </div>
    <p id={helpId} className={styles.help}>← → / A D to move · Hold Space to fire · P / Esc to pause.<br/>Catch coffee for 8 seconds of extra-caffeinated lasers. Each wave gets faster.<br/>Turn Sound on for lasers + a quiet 8-bit pulse. Music can be switched off separately.</p>
    <div role="status" aria-live="polite" className="sr-only">{message}</div>
    <p className={styles.privacy}>Made for a little breathing room. High score stays in this browser.</p>
  </div>;
}
