// src/utils/audio.js

class SoundController {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.masterGain = null;
    this.compressor = null;
    this.volume = 1.0;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();

        // Dynamics compressor to guarantee loud, punchy, crisp audio without digital clipping
        this.compressor = this.ctx.createDynamicsCompressor();
        this.compressor.threshold.setValueAtTime(-6, this.ctx.currentTime);
        this.compressor.knee.setValueAtTime(10, this.ctx.currentTime);
        this.compressor.ratio.setValueAtTime(4, this.ctx.currentTime);
        this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
        this.compressor.release.setValueAtTime(0.12, this.ctx.currentTime);

        // Master gain node with boosted overall loudness (1.45x master multiplier)
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.muted ? 0 : 1.45 * this.volume, this.ctx.currentTime);

        this.masterGain.connect(this.compressor);
        this.compressor.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  get destination() {
    this.init();
    if (!this.ctx) return null;
    return this.masterGain || this.ctx.destination;
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : 1.45 * this.volume, this.ctx.currentTime);
    }
    return this.muted;
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(2.0, Number(vol) || 1.0));
    if (this.masterGain && this.ctx && !this.muted) {
      this.masterGain.gain.setValueAtTime(1.45 * this.volume, this.ctx.currentTime);
    }
  }

  getVolume() {
    return this.volume;
  }

  isMuted() {
    return this.muted;
  }

  // --- TAB & NAVIGATION SOUNDS ---
  playTabSwitch() {
    if (this.muted) return;
    try {
      this.init();
      const dest = this.destination;
      if (!this.ctx || !dest) return;
      const now = this.ctx.currentTime;

      // Crisp wooden retro pip - loud & distinct
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.06); // A5

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.085);
    } catch {
      // AudioContext unavailable
    }
  }

  // --- FILTER & PILL SOUNDS ---
  playPillClick() {
    if (this.muted) return;
    try {
      this.init();
      const dest = this.destination;
      if (!this.ctx || !dest) return;
      const now = this.ctx.currentTime;

      // Tactile bubble pop
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(360, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.045);

      gain.gain.setValueAtTime(0.32, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.055);
    } catch {
      // ignore
    }
  }

  playDropdownSelect() {
    if (this.muted) return;
    try {
      this.init();
      const dest = this.destination;
      if (!this.ctx || !dest) return;
      const now = this.ctx.currentTime;

      // Affirmative twin chime
      [659.25, 880].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.045);

        gain.gain.setValueAtTime(0.30, now + idx * 0.045);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.045 + 0.09);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(now + idx * 0.045);
        osc.stop(now + idx * 0.045 + 0.1);
      });
    } catch {
      // ignore
    }
  }

  // --- STAR RATING SOUND ---
  playStarSelect(stars = 1) {
    if (this.muted) return;
    try {
      this.init();
      const dest = this.destination;
      if (!this.ctx || !dest) return;
      const now = this.ctx.currentTime;
      // Rising pentatonic frequency scale based on star count (1 to 5)
      const freqs = [523.25, 587.33, 659.25, 783.99, 1046.50]; // C5, D5, E5, G5, C6
      const freq = freqs[Math.min(4, Math.max(0, stars - 1))];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.05, now + 0.08);

      gain.gain.setValueAtTime(0.42, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.13);
    } catch {
      // ignore
    }
  }

  playClick() {
    this.playButtonClick();
  }

  // --- BUTTON SOUNDS ---
  playButtonClick() {
    if (this.muted) return;
    try {
      this.init();
      const dest = this.destination;
      if (!this.ctx || !dest) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);

      gain.gain.setValueAtTime(0.38, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // ignore
    }
  }

  // --- TIMER & RECORDING SOUNDS ---
  playTimerStart() {
    if (this.muted) return;
    try {
      this.init();
      const dest = this.destination;
      if (!this.ctx || !dest) return;
      const now = this.ctx.currentTime;

      // Inspiring 3-note ascending chime (Ready, Set, Go!)
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.065);

        gain.gain.setValueAtTime(0.40, now + idx * 0.065);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.065 + 0.18);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(now + idx * 0.065);
        osc.stop(now + idx * 0.065 + 0.2);
      });
    } catch {
      // ignore
    }
  }

  playTimerPause() {
    if (this.muted) return;
    try {
      this.init();
      const dest = this.destination;
      if (!this.ctx || !dest) return;
      const now = this.ctx.currentTime;

      // Soft descending 2-note tone (G4 -> E4)
      [392.0, 329.63].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0.34, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.12);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.13);
      });
    } catch {
      // ignore
    }
  }

  playTimerReset() {
    if (this.muted) return;
    try {
      this.init();
      const dest = this.destination;
      if (!this.ctx || !dest) return;
      const now = this.ctx.currentTime;

      // Retro rewind sweep
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(740, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.16);

      gain.gain.setValueAtTime(0.36, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.19);
    } catch {
      // ignore
    }
  }

  playTimerTimeAdjust() {
    if (this.muted) return;
    try {
      this.init();
      const dest = this.destination;
      if (!this.ctx || !dest) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

      gain.gain.setValueAtTime(0.32, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // ignore
    }
  }

  playRecordStart() {
    if (this.muted) return;
    try {
      this.init();
      const dest = this.destination;
      if (!this.ctx || !dest) return;
      const now = this.ctx.currentTime;

      // Walkie-talkie / mic active chirp
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1174.66, now); // D6
      osc.frequency.exponentialRampToValueAtTime(1480, now + 0.04);

      gain.gain.setValueAtTime(0.34, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // ignore
    }
  }

  playRecordStop() {
    if (this.muted) return;
    try {
      this.init();
      const dest = this.destination;
      if (!this.ctx || !dest) return;
      const now = this.ctx.currentTime;

      // Mic off double blip
      [880, 660].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        gain.gain.setValueAtTime(0.30, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.04);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.045);
      });
    } catch {
      // ignore
    }
  }

  // --- MODAL & REPORT SOUNDS ---
  playAnalysisOpen() {
    if (this.muted) return;
    try {
      this.init();
      const dest = this.destination;
      if (!this.ctx || !dest) return;
      const now = this.ctx.currentTime;

      // Majestic 4-note major arpeggio
      const notes = [349.23, 440.0, 523.25, 698.46]; // F4, A4, C5, F5
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.40, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.28);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.3);
      });
    } catch {
      // ignore
    }
  }

  playModalClose() {
    if (this.muted) return;
    try {
      this.init();
      const dest = this.destination;
      if (!this.ctx || !dest) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.06);

      gain.gain.setValueAtTime(0.30, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.075);
    } catch {
      // ignore
    }
  }

  playAccordionToggle(isOpening = true) {
    if (this.muted) return;
    try {
      this.init();
      const dest = this.destination;
      if (!this.ctx || !dest) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      const startFreq = isOpening ? 280 : 420;
      const endFreq = isOpening ? 440 : 260;
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.05);

      gain.gain.setValueAtTime(0.30, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.065);
    } catch {
      // ignore
    }
  }

  // --- MASCOT SOUNDS (SLEEP, WAKE, CHIRP) ---
  playMascotSleep() {
    if (this.muted) return;
    try {
      this.init();
      const dest = this.destination;
      if (!this.ctx || !dest) return;
      const now = this.ctx.currentTime;

      // Soft lullaby descending sequence
      const lullaby = [659.25, 523.25, 392.0, 329.63]; // E5, C5, G4, E4
      lullaby.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.14);

        gain.gain.setValueAtTime(0, now + idx * 0.14);
        gain.gain.linearRampToValueAtTime(0.32, now + idx * 0.14 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.14 + 0.35);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(now + idx * 0.14);
        osc.stop(now + idx * 0.14 + 0.38);
      });
    } catch {
      // ignore
    }
  }

  playMascotWake() {
    if (this.muted) return;
    try {
      this.init();
      const dest = this.destination;
      if (!this.ctx || !dest) return;
      const now = this.ctx.currentTime;

      // Cheerful sunrise wake-up bell sequence
      const wakeNotes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      wakeNotes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0, now + idx * 0.07);
        gain.gain.linearRampToValueAtTime(0.42, now + idx * 0.07 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.28);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.3);
      });
    } catch {
      // ignore
    }
  }

  playMascotClick() {
    if (this.muted) return;
    try {
      this.init();
      const dest = this.destination;
      if (!this.ctx || !dest) return;
      const now = this.ctx.currentTime;

      // Friendly playful squeak
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(784, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.08);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.13);
    } catch {
      // ignore
    }
  }

  // --- ORIGINAL LEVER, REEL, SNAP, FINISHED SOUNDS ---
  playLeverPull() {
    if (this.muted) return;
    try {
      this.init();
      const dest = this.destination;
      if (!this.ctx || !dest) return;
      const now = this.ctx.currentTime;

      // Mechanical lever clunk & ratchet sound - punchy and tactile
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.15);

      gain.gain.setValueAtTime(0.65, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.2);

      // Spring click
      setTimeout(() => {
        if (!this.ctx) return;
        const now2 = this.ctx.currentTime;
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(320, now2);
        osc2.frequency.exponentialRampToValueAtTime(540, now2 + 0.08);

        gain2.gain.setValueAtTime(0.50, now2);
        gain2.gain.exponentialRampToValueAtTime(0.01, now2 + 0.1);

        osc2.connect(gain2);
        gain2.connect(dest);
        osc2.start(now2);
        osc2.stop(now2 + 0.1);
      }, 120);
    } catch {
      // AudioContext unavailable
    }
  }

  playReelTick(pitch = 500) {
    if (this.muted) return;
    try {
      this.init();
      const dest = this.destination;
      if (!this.ctx || !dest) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, now);
      osc.frequency.exponentialRampToValueAtTime(pitch * 0.7, now + 0.04);

      gain.gain.setValueAtTime(0.30, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.045);
    } catch {
      // ignore
    }
  }

  playSnapChime() {
    if (this.muted) return;
    try {
      this.init();
      const dest = this.destination;
      if (!this.ctx || !dest) return;
      const now = this.ctx.currentTime;

      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0, now + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.48, now + idx * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.4);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.45);
      });
    } catch {
      // ignore
    }
  }

  playTimerFinished() {
    if (this.muted) return;
    try {
      this.init();
      const dest = this.destination;
      if (!this.ctx || !dest) return;
      const now = this.ctx.currentTime;

      // Celebratory two-tone chord
      const chords = [587.33, 739.99, 880.0, 1174.66];
      chords.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        gain.gain.setValueAtTime(0, now + idx * 0.1);
        gain.gain.linearRampToValueAtTime(0.55, now + idx * 0.1 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 1.2);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 1.3);
      });
    } catch {
      // ignore
    }
  }

  // --- CELEBRATION & COMPLETION SOUNDS ---
  playSuccessCelebration() {
    if (this.muted) return;
    try {
      this.init();
      const dest = this.destination;
      if (!this.ctx || !dest) return;
      const now = this.ctx.currentTime;

      // Joyful 5-note victory fanfare (C5, E5, G5, A5, C6)
      const fanfare = [523.25, 659.25, 783.99, 880.0, 1046.5];
      fanfare.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.48, now + idx * 0.08 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.38);
      });
    } catch {
      // ignore
    }
  }

  playTimerEndBuzz() {
    if (this.muted) return;
    try {
      this.init();
      const dest = this.destination;
      if (!this.ctx || !dest) return;
      const now = this.ctx.currentTime;

      // Crisp double buzzer tone - clear & unmistakable
      [0, 0.12].forEach((offset) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now + offset);
        osc.frequency.exponentialRampToValueAtTime(160, now + offset + 0.08);

        gain.gain.setValueAtTime(0.50, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.09);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(now + offset);
        osc.stop(now + offset + 0.1);
      });
    } catch {
      // ignore
    }
  }
}

const soundInstance = new SoundController();

// Auto-unlock audio context on user interaction (browser autoplay policy safe)
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    soundInstance.init();
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
  };
  window.addEventListener('click', unlockAudio, { once: true });
  window.addEventListener('keydown', unlockAudio, { once: true });
  window.addEventListener('touchstart', unlockAudio, { once: true });
}

// Proxy wrapper so ANY sound method call never throws "is not a function"
export const sound = new Proxy(soundInstance, {
  get(target, prop, receiver) {
    if (prop in target) {
      const val = Reflect.get(target, prop, receiver);
      return typeof val === 'function' ? val.bind(target) : val;
    }
    return (...args) => {
      console.warn(`[audio] sound.${String(prop)} is not implemented; safely falling back.`);
      try {
        if (target.playButtonClick) target.playButtonClick();
      } catch {
        // no-op
      }
    };
  },
});
