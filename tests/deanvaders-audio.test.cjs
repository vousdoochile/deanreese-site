// Run: node --test tests/deanvaders-audio.test.cjs
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
function load(name, dependencies = {}) {
  const code = ts.transpileModule(fs.readFileSync(`src/components/deanvaders/${name}.ts`, 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
  const mod = {exports:{}};
  new Function('exports','module','require',code)(mod.exports,mod,path=>dependencies[path]);
  return mod.exports;
}
const engine = load('engine');
const {ArcadeAudio, pulseInterval, MUSIC_LEVEL, EFFECT_LEVEL} = load('audio', {'./engine':engine});
class Param {
  value = 1; events = [];
  setValueAtTime(...args) { this.events.push(['set',...args]); }
  linearRampToValueAtTime(...args) { this.events.push(['linear',...args]); }
  exponentialRampToValueAtTime(...args) { this.events.push(['exponential',...args]); }
  cancelScheduledValues(...args) { this.events.push(['cancel',...args]); }
}
class Node {
  gain = new Param(); frequency = new Param(); Q = new Param(); disconnected = false; stops = [];
  connect(target) { this.target = target; }
  disconnect() { this.disconnected = true; }
  start() { this.started = true; }
  stop(time) { this.stops.push(time); }
}
class Context {
  currentTime = 0; state = 'suspended'; oscillators = []; gains = []; filters = []; destination = {};
  createGain() { const n = new Node(); this.gains.push(n); return n; }
  createBiquadFilter() { const n = new Node(); this.filters.push(n); return n; }
  createOscillator() { const n = new Node(); this.oscillators.push(n); return n; }
  async resume() { this.state = 'running'; }
  async close() { this.state = 'closed'; }
}
function setup() { const context = new Context(); const audio = new ArcadeAudio(context); const game = engine.createGame(); game.status = 'playing'; return {context,audio,game}; }
test('silent by default, and suspended contexts never schedule audio', async()=>{
  const {context,audio,game} = setup(); audio.update(game); assert.equal(context.oscillators.length,0);
  audio.setEnabled(true); audio.update(game); assert.equal(context.oscillators.length,0);
  await audio.unlock(); audio.update(game); assert.equal(context.oscillators.length,1);
});
test('music stays lower than effects and ducks under a laser', async()=>{
  assert.ok(MUSIC_LEVEL < EFFECT_LEVEL / 3);
  const {context,audio,game} = setup(); await audio.unlock(); audio.setEnabled(true); game.sound='shot'; audio.update(game);
  assert.equal(context.oscillators.length,2); assert.equal(context.oscillators[0].type,'sine'); assert.equal(context.oscillators[1].type,'square');
  assert.equal(context.filters[0].type,'lowpass'); assert.equal(context.filters[0].frequency.value,620);
  assert.ok(context.gains[0].gain.events.some(e=>e[0]==='set' && e[1]===.32));
  assert.ok(context.gains[1].gain.events.some(e=>e[0]==='linear' && e[1]===EFFECT_LEVEL));
  assert.ok(context.gains[2].gain.events.some(e=>e[0]==='linear' && e[1]===MUSIC_LEVEL));
});
test('original four-note pulse loops without a catch-up burst', async()=>{
  const {context,audio,game}=setup(); await audio.unlock(); audio.setEnabled(true);
  for (const time of [0, .7, 1.4, 2.1, 100]) { context.currentTime=time; audio.update(game); }
  const notes=context.oscillators.map(n=>n.frequency.events[0][1]);
  assert.deepEqual(notes,[146.83,130.81,110,123.47,146.83]);
  audio.update(game); assert.equal(context.oscillators.length,5);
});
test('tempo grows with waves, thinning enemies and enemy approach, with a ceiling', ()=>{
  const game=engine.createGame(), initial=pulseInterval(engine.getPressure(game));
  game.wave=5; const wave5=pulseInterval(engine.getPressure(game)); assert.ok(wave5<initial);
  game.enemies=game.enemies.slice(0,2); const thin=pulseInterval(engine.getPressure(game)); assert.ok(thin<wave5);
  game.enemies.forEach(e=>e.y=420); assert.ok(pulseInterval(engine.getPressure(game))<thin);
  assert.equal(pulseInterval(-1),.66); assert.ok(Math.abs(pulseInterval(100)-.22)<.000001);
});
test('music-only switch stops pulse but retains effects', async()=>{
  const {context,audio,game}=setup(); await audio.unlock(); audio.setEnabled(true); audio.update(game);
  audio.setMusic(false); assert.ok(context.oscillators[0].stops.includes(undefined));
  context.currentTime=2; game.sound='shot'; audio.update(game); assert.equal(context.oscillators.length,2); assert.equal(context.oscillators[1].type,'sine');
});
test('mute/pause/intermission/game over stop music immediately', async()=>{
  for (const mode of ['mute','paused','over','wave']) {
    const {context,audio,game}=setup(); await audio.unlock(); audio.setEnabled(true); audio.update(game);
    if(mode==='mute') audio.setEnabled(false); else { if(mode==='wave')game.waveDelay=2;else game.status=mode; audio.update(game); }
    assert.ok(context.oscillators[0].stops.includes(undefined),mode);
    assert.equal(context.gains[1].disconnected,true,mode);
    context.currentTime=20; audio.update(game); assert.equal(context.oscillators.length,1,mode);
  }
});
test('resuming/restarting cannot stack tracks; dispose releases nodes/context', async()=>{
  const {context,audio,game}=setup(); await audio.unlock(); audio.setEnabled(true); audio.update(game);
  audio.silence(); context.currentTime=5; audio.update(game); assert.equal(context.oscillators.length,2);
  audio.reset(); context.currentTime=6; audio.update(game); assert.equal(context.oscillators[2].frequency.events[0][1],146.83);
  audio.dispose(); assert.equal(context.state,'closed'); assert.ok(context.filters[0].disconnected); assert.ok(context.gains[0].disconnected);
  audio.update(game); assert.equal(context.oscillators.length,3);
});
