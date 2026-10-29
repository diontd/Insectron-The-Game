import { SpecialMoveType } from '../game/species';

// Synthesized Web Audio SFX for Rogue Galaxy Insectron with Heavy Sub-Bass & Signature Move Audio

class SoundManager {
  private ctx: AudioContext | null = null;
  public muted = false;

  private getContext(): AudioContext | null {
    if (this.muted || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public playSelect(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(780, now + 0.08);
    gain.gain.setValueAtTime(0.11, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  public playMove(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    // Crisp chitinous step + subtle sub thud
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.11);
    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  public playAttack(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // 1. Sub-bass chest punch (150Hz -> 36Hz)
    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(155, now);
    sub.frequency.exponentialRampToValueAtTime(36, now + 0.24);
    subGain.gain.setValueAtTime(0.34, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    sub.connect(subGain);
    subGain.connect(ctx.destination);
    sub.start(now);
    sub.stop(now + 0.25);

    // 2. Metallic carapace crunch (sawtooth transient)
    const crunch = ctx.createOscillator();
    const crunchGain = ctx.createGain();
    crunch.type = 'sawtooth';
    crunch.frequency.setValueAtTime(320, now);
    crunch.frequency.exponentialRampToValueAtTime(68, now + 0.16);
    crunchGain.gain.setValueAtTime(0.22, now);
    crunchGain.gain.exponentialRampToValueAtTime(0.001, now + 0.17);
    crunch.connect(crunchGain);
    crunchGain.connect(ctx.destination);
    crunch.start(now);
    crunch.stop(now + 0.17);
  }

  public playCriticalHit(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Sub-bass heavy seismic thump
    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(190, now);
    sub.frequency.exponentialRampToValueAtTime(28, now + 0.38);
    subGain.gain.setValueAtTime(0.48, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    sub.connect(subGain);
    subGain.connect(ctx.destination);
    sub.start(now);
    sub.stop(now + 0.4);

    // High crystalline crack / piercing transient
    const crack = ctx.createOscillator();
    const crackGain = ctx.createGain();
    crack.type = 'sawtooth';
    crack.frequency.setValueAtTime(880, now);
    crack.frequency.exponentialRampToValueAtTime(140, now + 0.22);
    crackGain.gain.setValueAtTime(0.3, now);
    crackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
    crack.connect(crackGain);
    crackGain.connect(ctx.destination);
    crack.start(now);
    crack.stop(now + 0.24);
  }

  public playWallSlam(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Stone parapet crunch and rumble
    const stone = ctx.createOscillator();
    const stoneGain = ctx.createGain();
    stone.type = 'triangle';
    stone.frequency.setValueAtTime(130, now);
    stone.frequency.exponentialRampToValueAtTime(45, now + 0.32);
    stoneGain.gain.setValueAtTime(0.42, now);
    stoneGain.gain.exponentialRampToValueAtTime(0.001, now + 0.34);
    stone.connect(stoneGain);
    stoneGain.connect(ctx.destination);
    stone.start(now);
    stone.stop(now + 0.34);
  }

  public playFumble(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Dull wobbling tap
    const wobble = ctx.createOscillator();
    const wobbleGain = ctx.createGain();
    wobble.type = 'sine';
    wobble.frequency.setValueAtTime(120, now);
    wobble.frequency.linearRampToValueAtTime(80, now + 0.15);
    wobbleGain.gain.setValueAtTime(0.18, now);
    wobbleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
    wobble.connect(wobbleGain);
    wobbleGain.connect(ctx.destination);
    wobble.start(now);
    wobble.stop(now + 0.16);
  }

  public playSignatureMove(sigId?: SpecialMoveType): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Distinct windup + impact sound signature per insect move
    if (sigId === 'emperor_rage' || sigId === 'cannon_blast' || sigId === 'rolling_thunder') {
      // Deep plasma / artillery charge + heavy detonation
      const charge = ctx.createOscillator();
      const cGain = ctx.createGain();
      charge.type = 'sawtooth';
      charge.frequency.setValueAtTime(120, now);
      charge.frequency.exponentialRampToValueAtTime(640, now + 0.22);
      cGain.gain.setValueAtTime(0.18, now);
      cGain.gain.exponentialRampToValueAtTime(0.01, now + 0.23);
      charge.connect(cGain);
      cGain.connect(ctx.destination);
      charge.start(now);
      charge.stop(now + 0.23);

      // Boom at +0.20s
      const boom = ctx.createOscillator();
      const bGain = ctx.createGain();
      boom.type = 'sine';
      boom.frequency.setValueAtTime(180, now + 0.2);
      boom.frequency.exponentialRampToValueAtTime(32, now + 0.62);
      bGain.gain.setValueAtTime(0.38, now + 0.2);
      bGain.gain.exponentialRampToValueAtTime(0.001, now + 0.64);
      boom.connect(bGain);
      bGain.connect(ctx.destination);
      boom.start(now + 0.2);
      boom.stop(now + 0.64);
      return;
    }

    if (sigId === 'healing_jig' || sigId === 'charm_beam') {
      // Shimmering harmonic arpeggio
      const notes = sigId === 'healing_jig' ? [523.25, 659.25, 783.99, 1046.5] : [440, 554.37, 659.25, 880, 1108.73];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.055);
        gain.gain.setValueAtTime(0.16, now + idx * 0.055);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.055 + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.055);
        osc.stop(now + idx * 0.055 + 0.28);
      });
      return;
    }

    // Heavy physical signature impact (Crushing Horn, Scissor Throw, Fortress Quake, Sky Dive, Body Blow, Sickle Dance, Poison Needle)
    const windup = ctx.createOscillator();
    const wGain = ctx.createGain();
    windup.type = 'triangle';
    windup.frequency.setValueAtTime(220, now);
    windup.frequency.exponentialRampToValueAtTime(580, now + 0.14);
    wGain.gain.setValueAtTime(0.18, now);
    wGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    windup.connect(wGain);
    wGain.connect(ctx.destination);
    windup.start(now);
    windup.stop(now + 0.15);

    const slam = ctx.createOscillator();
    const sGain = ctx.createGain();
    slam.type = 'sine';
    slam.frequency.setValueAtTime(190, now + 0.14);
    slam.frequency.exponentialRampToValueAtTime(34, now + 0.52);
    sGain.gain.setValueAtTime(0.38, now + 0.14);
    sGain.gain.exponentialRampToValueAtTime(0.001, now + 0.54);
    slam.connect(sGain);
    sGain.connect(ctx.destination);
    slam.start(now + 0.14);
    slam.stop(now + 0.54);
  }

  public playSpecial(sigId?: SpecialMoveType): void {
    this.playSignatureMove(sigId);
  }

  public playRingOut(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    // Dramatic seismic impact + falling whistle into the Zerard abyss
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(640, now);
    osc.frequency.exponentialRampToValueAtTime(65, now + 0.52);
    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.54);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.54);

    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(140, now);
    sub.frequency.exponentialRampToValueAtTime(28, now + 0.45);
    subGain.gain.setValueAtTime(0.35, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.46);
    sub.connect(subGain);
    subGain.connect(ctx.destination);
    sub.start(now);
    sub.stop(now + 0.46);
  }

  public playVictory(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const chord = [523.25, 659.25, 783.99, 1046.5];
    chord.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.09);
      gain.gain.setValueAtTime(0.18, now + i * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.48);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.09);
      osc.stop(now + i * 0.09 + 0.48);
    });
  }
}

export const soundFX = new SoundManager();
