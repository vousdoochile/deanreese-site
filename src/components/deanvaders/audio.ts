import { clamp, Game, getPressure } from "./engine";

// An original four-note pulse, synthesized locally. Low-mid notes stay audible
// on small PC/phone speakers; the lasers retain their original voice and level.
const NOTES = [293.66, 261.63, 220, 246.94];
export const MUSIC_LEVEL = .02;
export const EFFECT_LEVEL = .035;
export const pulseInterval = (pressure: number) => .66 - clamp(pressure, 0, 1) * .44;
type Voice = { oscillator: OscillatorNode; gain: GainNode; music: boolean };

/** Driven by the game loop, not a background timer, so paused games stay quiet. */
export class ArcadeAudio {
  private enabled = false;
  private musicEnabled = true;
  private disposed = false;
  private nextPulse = 0;
  private note = 0;
  private voices = new Set<Voice>();
  private musicBus: GainNode;
  private filter: BiquadFilterNode;

  constructor(private context: AudioContext) {
    this.musicBus = context.createGain();
    this.filter = context.createBiquadFilter();
    this.filter.type = "lowpass";
    this.filter.frequency.value = 1000;
    this.filter.Q.value = .5;
    this.filter.connect(this.musicBus);
    this.musicBus.connect(context.destination);
  }

  async unlock() {
    if (this.disposed) return;
    await this.context.resume();
    if (this.context.state !== "running") throw new Error("Audio is suspended");
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    this.nextPulse = 0;
    if (!enabled) this.silence();
  }

  setMusic(enabled: boolean) {
    this.musicEnabled = enabled;
    this.nextPulse = 0;
    if (!enabled) this.stopVoices(true);
  }

  reset() {
    this.silence();
    this.note = 0;
  }

  private stopVoices(musicOnly = false) {
    for (const voice of this.voices) {
      if (musicOnly && !voice.music) continue;
      // Disconnect immediately on mute/pause, including already scheduled notes.
      voice.gain.disconnect();
      voice.oscillator.stop();
      this.voices.delete(voice);
    }
  }

  silence() {
    this.stopVoices();
    this.nextPulse = 0;
  }

  private tone(frequency: number, music: boolean, hit = false) {
    const ac = this.context, now = ac.currentTime;
    const oscillator = ac.createOscillator(), gain = ac.createGain();
    oscillator.type = music ? "square" : hit ? "triangle" : "sine";
    oscillator.frequency.setValueAtTime(frequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(frequency * (music ? .93 : .5), now + .09);
    gain.gain.setValueAtTime(.0001, now);
    gain.gain.linearRampToValueAtTime(music ? MUSIC_LEVEL : EFFECT_LEVEL, now + .004);
    if (music) gain.gain.setValueAtTime(MUSIC_LEVEL * .7, now + .035);
    gain.gain.exponentialRampToValueAtTime(.0001, now + (music ? .16 : .11));
    oscillator.connect(gain);
    gain.connect(music ? this.filter : ac.destination);
    const voice = { oscillator, gain, music };
    this.voices.add(voice);
    oscillator.onended = () => {
      oscillator.disconnect(); gain.disconnect(); this.voices.delete(voice);
    };
    oscillator.start(); oscillator.stop(now + (music ? .17 : .12));
  }

  update(g: Game) {
    if (this.disposed || !this.enabled || this.context.state !== "running") return;
    if (g.status !== "playing") {
      this.silence();
      // End the soundtrack immediately, but let the final collision be heard.
      if (g.status === "over" && g.sound === "hit") this.tone(100, false, true);
      return;
    }
    const now = this.context.currentTime;
    if (g.sound) {
      // The laser/effects remain in front of the bass, even during rapid coffee fire.
      const level = this.musicBus.gain;
      level.cancelScheduledValues(now);
      level.setValueAtTime(.7, now);
      level.setValueAtTime(.7, now + .06);
      level.linearRampToValueAtTime(1, now + .13);
      this.tone({ shot: 700, pop: 260, hit: 100, coffee: 900 }[g.sound], false, g.sound === "hit");
    }
    if (!this.musicEnabled || g.waveDelay > 0 || !g.enemies.length) {
      this.stopVoices(true); this.nextPulse = 0; return;
    }
    if (now >= this.nextPulse) {
      this.tone(NOTES[this.note++ % NOTES.length], true);
      // Never catch up missed notes after a hidden tab, pause or muted interval.
      this.nextPulse = now + pulseInterval(getPressure(g));
    }
  }

  dispose() {
    this.disposed = true;
    this.silence();
    this.filter.disconnect(); this.musicBus.disconnect();
    void this.context.close().catch(() => {});
  }
}

export function createArcadeAudio() {
  const Audio = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Audio) throw new Error("Web Audio is unavailable");
  return new ArcadeAudio(new Audio());
}
