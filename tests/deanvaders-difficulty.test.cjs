// Run: node --test tests/deanvaders-difficulty.test.cjs
const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const ts = require('typescript');
const source = ts.transpileModule(fs.readFileSync('src/components/deanvaders/engine.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const mod = { exports: {} };
new Function('exports', 'module', source)(mod.exports, mod);
const { createGame, step, spawnWave, getWaveTuning, getPressure, WIDTH, PLAYER_Y } = mod.exports;
const idle = { left: false, right: false, fire: false, target: null };
const game = (wave = 1) => Object.assign(createGame(), { status: 'playing', wave, enemies: spawnWave(wave) });
const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-9, `${a} ≈ ${b}`);

test('each advancing wave raises all challenge factors without exceeding touch-safe ceilings', () => {
  let previous = getWaveTuning(1);
  for (let wave = 2; wave <= 100; wave++) {
    const tuning = getWaveTuning(wave);
    assert.ok(tuning.speed > previous.speed);
    assert.ok(tuning.drop > previous.drop);
    assert.ok(tuning.hazardSpeed > previous.hazardSpeed);
    assert.ok(tuning.fireInterval < previous.fireInterval);
    assert.ok(tuning.firstShotDelay < previous.firstShotDelay);
    previous = tuning;
  }
  for (const wave of [1, 5, 20, 100, 1e9]) {
    const t = getWaveTuning(wave);
    assert.ok(t.speed >= 36 && t.speed <= 110);
    assert.ok(t.drop >= 14 && t.drop <= 24);
    assert.ok(t.fireInterval >= .38 && t.fireInterval <= .98);
    assert.ok(t.hazardSpeed >= 165 && t.hazardSpeed <= 275);
    assert.ok(t.firstShotDelay >= .95 && t.firstShotDelay <= 1.4);
  }
  assert.ok(getWaveTuning(5).speed > getWaveTuning(1).speed * 1.8);
});

test('invalid wave inputs safely use the opening difficulty', () => {
  for (const wave of [-100, 0, NaN, Infinity]) assert.deepEqual(getWaveTuning(wave), getWaveTuning(1));
});

test('every wave preserves the original 18-enemy formation and fresh IDs', () => {
  for (const wave of [1, 2, 10, 100]) {
    const enemies = spawnWave(wave);
    assert.equal(enemies.length, 18);
    assert.equal(new Set(enemies.map(e => e.id)).size, 18);
    assert.deepEqual(enemies.map(e => [e.x, e.y]), spawnWave(1).map(e => [e.x, e.y]));
  }
});

test('movement and enemy bullets actually apply the harder wave tuning', () => {
  for (const wave of [1, 5, 20, 1000]) {
    const g = game(wave), t = getWaveTuning(wave), start = g.enemies[0].x;
    g.fireClock = 0;
    step(g, idle, .02, () => 0);
    close(g.enemies[0].x - start, t.speed * .02);
    close(g.hazards[0].vy, t.hazardSpeed);
    close(g.fireClock, t.fireInterval);
  }
});

test('thinning enemies accelerate movement and fire, with firm maximum rates', () => {
  for (const wave of [1, 5, 1000]) {
    let lastSpeed = 0, lastInterval = Infinity;
    for (const count of [18, 12, 6, 1]) {
      const g = game(wave);
      g.enemies = g.enemies.slice(0, count);
      g.fireClock = 0;
      const start = g.enemies[0].x;
      step(g, idle, .02, () => 0);
      const speed = (g.enemies[0].x - start) / .02;
      assert.ok(speed >= lastSpeed && speed <= 190 + 1e-9);
      assert.ok(g.fireClock <= lastInterval && g.fireClock >= .30);
      lastSpeed = speed; lastInterval = g.fireClock;
    }
  }
});

test('formation reverses and drops exactly once at either wall, without overshoot', () => {
  for (const direction of [-1, 1]) {
    const g = game(15);
    g.enemies = [{ ...g.enemies[0], x: direction > 0 ? WIDTH - 49 : 49 }];
    g.direction = direction;
    const y = g.enemies[0].y;
    step(g, idle, .04, () => 0);
    assert.equal(g.direction, -direction);
    close(g.enemies[0].y, y + getWaveTuning(15).drop);
    assert.ok(g.enemies[0].x > 49 && g.enemies[0].x < WIDTH - 49);
    const droppedY = g.enemies[0].y;
    step(g, idle, .04, () => 0);
    close(g.enemies[0].y, droppedY);
  }
});

test('enemy fire remains capped at sixteen hazards even in late waves', () => {
  const g = game(1000);
  g.hazards = Array.from({ length: 16 }, () => ({ x: 50, y: 250, vx: 0, vy: 0 }));
  g.fireClock = -10;
  step(g, idle, .02, () => 0);
  assert.equal(g.hazards.length, 16);
  g.hazards.pop();
  step(g, idle, .02, () => 0);
  assert.equal(g.hazards.length, 16);
  assert.ok(g.fireClock >= .30);
});

test('wave clear gives one bonus and a safe breather before the tougher formation', () => {
  const g = game(4);
  g.enemies = [];
  g.direction = -1;
  g.hazards = [{ x: 100, y: 200, vx: 0, vy: 100 }];
  step(g, idle, .02, () => 0);
  assert.equal(g.score, 500);
  assert.equal(g.hazards.length, 0);
  for (let i = 0; i < 50; i++) step(g, idle, .02, () => 0);
  assert.equal(g.wave, 4);
  assert.equal(g.score, 500);
  while (g.wave === 4) step(g, idle, .02, () => 0);
  assert.equal(g.wave, 5);
  assert.equal(g.direction, 1);
  assert.equal(g.enemies.length, 18);
  assert.equal(g.shots.length, 0);
  close(g.fireClock, getWaveTuning(5).firstShotDelay);
  for (let i = 0; i < 40; i++) step(g, idle, .02, () => 0);
  assert.equal(g.hazards.length, 0, 'first-shot grace allows touch repositioning');
});

test('music pressure is pure, bounded and rises with wave, depletion and approach', () => {
  const g = game();
  const saved = JSON.stringify(g);
  assert.equal(getPressure(g), 0);
  assert.equal(JSON.stringify(g), saved);
  const later = game(5);
  assert.ok(getPressure(later) > getPressure(g));
  later.enemies = later.enemies.slice(0, 6);
  const thinned = getPressure(later);
  assert.ok(thinned > getPressure(game(5)));
  later.enemies.forEach(e => e.y += 200);
  assert.ok(getPressure(later) > thinned);
  for (const wave of [1, 5, 1e9]) for (const count of [0, 1, 18]) {
    const state = game(wave);
    state.enemies = state.enemies.slice(0, count);
    state.enemies.forEach(e => e.y = PLAYER_Y + 10000);
    assert.ok(getPressure(state) >= 0 && getPressure(state) <= 1);
  }
});

test('ready, paused and over states freeze every difficulty clock and entity', () => {
  for (const status of ['ready', 'paused', 'over']) {
    const g = game(20); g.status = status;
    const before = JSON.stringify(g);
    step(g, { ...idle, fire: true }, 100, () => 0);
    assert.equal(JSON.stringify(g), before);
  }
});

test('seeded continuous-play simulation is deterministic and remains in bounds', () => {
  function run() {
    let seed = 12345;
    const rng = () => ((seed = (1664525 * seed + 1013904223) >>> 0) / 2 ** 32);
    const g = game(8);
    for (let i = 0; i < 1800; i++) {
      step(g, { ...idle, fire: true, target: 360 + Math.sin(i / 90) * 260 }, 1 / 60, rng);
      assert.ok(g.hazards.length <= 16);
      assert.ok(g.enemies.every(e => e.x >= 49 && e.x <= WIDTH - 49));
      assert.ok(g.x >= 38 && g.x <= WIDTH - 38);
    }
    return g;
  }
  assert.deepEqual(run(), run());
});
