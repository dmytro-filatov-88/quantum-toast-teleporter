/**
 * CERN-TOASTRON 9000: Quantum Toast Teleporter
 * High-Energy Breakfast Accelerator & Murphy Nullifier
 * Built with Vanilla JS & Web Audio API
 */

(function () {
  'use strict';

  // --- AUDIO SYNTHESIZER (Web Audio API) ---
  class QuantumAudioSynthesizer {
    constructor() {
      this.ctx = null;
      this.masterGain = null;
      this.muted = false;
      this.purrOsc = null;
      this.purrGain = null;
    }

    init() {
      if (this.ctx) return;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }

    resume() {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggleMute() {
      this.muted = !this.muted;
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.3, this.ctx.currentTime);
      }
      return !this.muted;
    }

    // Lever release & clamp opening clank
    playClampRelease() {
      if (this.muted) return;
      this.init();
      this.resume();
      const now = this.ctx.currentTime;

      // Metallic impact click
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.12);

      // Servo motor whir
      const servo = this.ctx.createOscillator();
      const servoGain = this.ctx.createGain();
      servo.type = 'sawtooth';
      servo.frequency.setValueAtTime(220, now);
      servo.frequency.linearRampToValueAtTime(440, now + 0.15);
      servoGain.gain.setValueAtTime(0.15, now);
      servoGain.gain.linearRampToValueAtTime(0.01, now + 0.15);
      servo.connect(servoGain);
      servoGain.connect(this.masterGain);
      servo.start(now);
      servo.stop(now + 0.15);
    }

    // Squishy butter slap
    playButterSquelch() {
      if (this.muted) return;
      this.init();
      this.resume();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.14);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      filter.Q.setValueAtTime(4, now);

      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.14);
    }

    // Free fall aerodynamic whoosh
    playWhoosh(pitchFactor = 1.0) {
      if (this.muted) return;
      this.init();
      this.resume();
      const now = this.ctx.currentTime;
      const dur = 0.35;

      const bufferSize = this.ctx.sampleRate * dur;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(300 * pitchFactor, now);
      filter.frequency.exponentialRampToValueAtTime(1200 * pitchFactor, now + dur * 0.5);
      filter.frequency.exponentialRampToValueAtTime(200, now + dur);
      filter.Q.setValueAtTime(3, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.4, now + dur * 0.3);
      gain.gain.exponentialRampToValueAtTime(0.01, now + dur);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      whiteNoise.start(now);
      whiteNoise.stop(now + dur);
    }

    // Murphy Failure: Loud buzzer & squelch
    playMurphyFail() {
      if (this.muted) return;
      this.init();
      this.resume();
      const now = this.ctx.currentTime;

      // Dissonant dual horn buzzer
      [140, 195].forEach((freq) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.45);
      });

      // Butter splat on carpet
      const noiseSize = this.ctx.sampleRate * 0.2;
      const noiseBuf = this.ctx.createBuffer(1, noiseSize, this.ctx.sampleRate);
      const data = noiseBuf.getChannelData(0);
      for (let i = 0; i < noiseSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (noiseSize * 0.2));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuf;
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.6, now);
      noiseGain.connect(this.masterGain);
      noise.start(now);
    }

    // Cat meow & purr synthesis
    playCatSound(isCyber = false) {
      if (this.muted) return;
      this.init();
      this.resume();
      const now = this.ctx.currentTime;

      if (!isCyber) {
        // Natural cat meow: formant modulated sine/triangle
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(480, now);
        osc.frequency.linearRampToValueAtTime(750, now + 0.12);
        osc.frequency.exponentialRampToValueAtTime(380, now + 0.4);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.4, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.4);
      } else {
        // Cyber kitten 8-bit chirp
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.setValueAtTime(1320, now + 0.06);
        osc.frequency.setValueAtTime(1760, now + 0.12);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    }

    // Paradox continuous purr-loop start/stop
    startParadoxHum() {
      if (this.muted || this.purrOsc) return;
      this.init();
      this.resume();
      const now = this.ctx.currentTime;

      this.purrOsc = this.ctx.createOscillator();
      this.purrGain = this.ctx.createGain();

      // Low rumble 45 Hz with 12 Hz amplitude pulsation
      this.purrOsc.type = 'sawtooth';
      this.purrOsc.frequency.setValueAtTime(50, now);

      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(16, now);
      lfoGain.gain.setValueAtTime(15, now);
      lfo.connect(this.purrOsc.frequency);
      lfo.start();

      this.purrGain.gain.setValueAtTime(0.01, now);
      this.purrGain.gain.linearRampToValueAtTime(0.25, now + 0.2);

      this.purrOsc.connect(this.purrGain);
      this.purrGain.connect(this.masterGain);
      this.purrOsc.start(now);
    }

    stopParadoxHum() {
      if (this.purrOsc && this.ctx) {
        const now = this.ctx.currentTime;
        this.purrGain.gain.linearRampToValueAtTime(0.01, now + 0.15);
        setTimeout(() => {
          if (this.purrOsc) {
            this.purrOsc.stop();
            this.purrOsc.disconnect();
            this.purrOsc = null;
            this.purrGain = null;
          }
        }, 160);
      }
    }

    // Portal wormhole sound: deep resonant chirp & laser warp
    playPortalWarp() {
      if (this.muted) return;
      this.init();
      this.resume();
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(90, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.18);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.4);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.4);
    }

    // Triumphant Quantum Victory: Celestial Arpeggio Chime
    playVictoryFanfare() {
      if (this.muted) return;
      this.init();
      this.resume();
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.28, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.8);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.85);
      });
    }

    // Black Hole SCRAM alarm
    playScramSiren() {
      if (this.muted) return;
      this.init();
      this.resume();
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.linearRampToValueAtTime(300, now + 0.3);
      osc.frequency.linearRampToValueAtTime(800, now + 0.6);
      osc.frequency.linearRampToValueAtTime(300, now + 0.9);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 1.2);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 1.2);
    }
  }

  // --- PARTICLE EMITTERS ---
  class ParticlePool {
    constructor() {
      this.particles = [];
    }

    spawn(x, y, vx, vy, color, size, life, shape = 'circle') {
      this.particles.push({
        x, y, vx, vy,
        color, size,
        maxLife: life,
        life,
        shape,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.2
      });
    }

    update(dt) {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.life -= dt;
        if (p.life <= 0) {
          this.particles.splice(i, 1);
          continue;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.rotSpeed;
      }
    }

    draw(ctx) {
      for (const p of this.particles) {
        const progress = p.life / p.maxLife;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = Math.max(0, Math.min(1, progress));
        ctx.fillStyle = p.color;

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * progress, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'spark') {
          ctx.fillRect(-p.size * 0.5, -p.size * 0.1, p.size, p.size * 0.2);
          ctx.fillRect(-p.size * 0.1, -p.size * 0.5, p.size * 0.2, p.size);
        } else if (p.shape === 'square') {
          ctx.fillRect(-p.size * 0.5, -p.size * 0.5, p.size, p.size);
        }
        ctx.restore();
      }
    }
  }

  // --- MAIN APP CONTROLLER ---
  class QuantumToastApp {
    constructor() {
      this.audio = new QuantumAudioSynthesizer();
      this.particles = new ParticlePool();

      // State Modules
      this.config = {
        butter: 'none',       // 'none' | 'standard' | 'double'
        cat: 'off',          // 'off' | 'ginger' | 'cyber'
        antigrav: 'off',     // 'off' | 'low' | 'repulsion'
        portal: 'off'        // 'off' | 'wormhole' | 'singularity'
      };

      // Physical Toast Object
      this.toast = {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        angle: 0,             // 0 = upright (butter top), PI = upside down (butter bottom)
        angularVelocity: 0,
        scale: 1,
        opacity: 1,
        state: 'clamped',     // 'clamped' | 'dropping' | 'portal_warp' | 'paradox' | 'landed'
        isUpright: true,
        paradoxRpm: 0
      };

      this.stats = {
        drops: 0,
        fails: 0,
        teleports: 0,
        paradoxes: 0
      };

      this.bgCanvas = document.getElementById('bg-canvas');
      this.bgCtx = this.bgCanvas ? this.bgCanvas.getContext('2d') : null;
      this.chamberCanvas = document.getElementById('chamber-canvas');
      this.chamberCtx = this.chamberCanvas ? this.chamberCanvas.getContext('2d') : null;

      this.lastTime = performance.now();
      this.initElements();
      this.initEvents();
      this.resize();
      this.rechamberToast(false);
      this.updateTelemetryHUD();

      // Start animation loop
      requestAnimationFrame((t) => this.loop(t));
    }

    initElements() {
      this.el = {
        carriage: document.getElementById('crane-carriage'),
        portalAlpha: document.getElementById('portal-alpha'),
        portalBeta: document.getElementById('portal-beta'),
        platter: document.getElementById('target-platter'),
        statProb: document.getElementById('stat-probability'),
        statEntropy: document.getElementById('stat-entropy'),
        statParadox: document.getElementById('stat-paradox'),
        termLog: document.getElementById('term-log'),
        resultBanner: document.getElementById('result-banner'),
        bannerIcon: document.getElementById('banner-icon'),
        bannerTitle: document.getElementById('banner-title'),
        bannerDesc: document.getElementById('banner-desc'),
        bannerBtn: document.getElementById('banner-dismiss-btn'),
        btnDrop: document.getElementById('btn-drop'),
        btnRechamber: document.getElementById('btn-rechamber'),
        btnAutoSolve: document.getElementById('btn-auto-solve'),
        btnSound: document.getElementById('btn-sound'),
        soundLabel: document.getElementById('sound-label'),
        btnManual: document.getElementById('btn-manual'),
        modalManual: document.getElementById('modal-manual'),
        btnCloseModal: document.getElementById('btn-close-modal'),
        btnManualAck: document.getElementById('btn-manual-ack'),
        btnScram: document.getElementById('btn-scram'),
        scramOverlay: document.getElementById('scram-overlay'),
        btnScramReset: document.getElementById('btn-scram-reset'),
        scramToastSwarm: document.getElementById('scram-toast-swarm')
      };
    }

    initEvents() {
      window.addEventListener('resize', () => this.resize());

      // Module toggle buttons
      document.querySelectorAll('.toggle-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const target = e.currentTarget;
          const parent = target.closest('.control-module');
          if (!parent) return;

          parent.querySelectorAll('.toggle-btn').forEach((b) => b.classList.remove('active'));
          target.classList.add('active');

          if (target.dataset.butter) {
            this.config.butter = target.dataset.butter;
            this.audio.playButterSquelch();
            this.log(`Butter setting updated: [${this.config.butter.toUpperCase()}]. Murphy drag recalculated.`, 'cyan');
          } else if (target.dataset.cat) {
            this.config.cat = target.dataset.cat;
            this.audio.playCatSound(this.config.cat === 'cyber');
            this.log(`Feline module set to: [${this.config.cat.toUpperCase()}]. Angular righting ready.`, 'magenta');
          } else if (target.dataset.antigrav) {
            this.config.antigrav = target.dataset.antigrav;
            const rails = document.querySelector('.containment-rails');
            if (this.config.antigrav !== 'off') {
              rails?.classList.add('active-antigrav');
            } else {
              rails?.classList.remove('active-antigrav');
            }
            this.log(`Graviton Inverter: [${this.config.antigrav.toUpperCase()}]. Containment coils humming.`, 'cyan');
          } else if (target.dataset.portal) {
            this.config.portal = target.dataset.portal;
            if (this.config.portal !== 'off') {
              this.el.portalAlpha.classList.add('active');
              this.el.portalBeta.classList.add('active');
              this.audio.playPortalWarp();
              this.log(`Dimensional Wormhole [${this.config.portal.toUpperCase()}] established. Spacetime ruptured.`, 'magenta');
            } else {
              this.el.portalAlpha.classList.remove('active');
              this.el.portalBeta.classList.remove('active');
              this.log('Dimensional Portals deactivated. Quantum tunnel collapsed.', 'dim');
            }
          }

          this.updateTelemetryHUD();
          if (this.toast.state === 'clamped') {
            this.rechamberToast(false);
          }
        });
      });

      // Master Action Buttons
      this.el.btnDrop.addEventListener('click', () => this.initiateDrop());
      this.el.btnRechamber.addEventListener('click', () => this.rechamberToast(true));
      this.el.bannerBtn.addEventListener('click', () => this.rechamberToast(true));
      this.el.btnAutoSolve.addEventListener('click', () => this.autoSolveParadox());

      // Audio Toggle
      this.el.btnSound.addEventListener('click', () => {
        const on = this.audio.toggleMute();
        this.el.soundLabel.textContent = on ? 'Audio ON' : 'Audio OFF';
      });

      // Lab Manual Modal
      this.el.btnManual.addEventListener('click', () => this.el.modalManual.classList.remove('hidden'));
      this.el.btnCloseModal.addEventListener('click', () => this.el.modalManual.classList.add('hidden'));
      this.el.btnManualAck.addEventListener('click', () => this.el.modalManual.classList.add('hidden'));

      // Emergency SCRAM Button (Easter Egg)
      this.el.btnScram.addEventListener('click', () => this.triggerScram());
      this.el.btnScramReset.addEventListener('click', () => this.resetScram());

      // Keyboard Shortcuts
      window.addEventListener('keydown', (e) => {
        // Avoid hotkeys when modal is open or when typing in inputs
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        if (e.code === 'Space') {
          e.preventDefault();
          this.initiateDrop();
        } else if (e.key === 'r' || e.key === 'R') {
          e.preventDefault();
          this.rechamberToast(true);
        } else if (e.key === 'm' || e.key === 'M') {
          e.preventDefault();
          const on = this.audio.toggleMute();
          this.el.soundLabel.textContent = on ? 'Audio ON' : 'Audio OFF';
        } else if (e.key === 'b' || e.key === 'B') {
          e.preventDefault();
          this.cycleButter();
        } else if (e.key === 'c' || e.key === 'C') {
          e.preventDefault();
          this.cycleCat();
        }
      });
    }

    cycleButter() {
      const modes = ['none', 'standard', 'double'];
      const nextIdx = (modes.indexOf(this.config.butter) + 1) % modes.length;
      const targetBtn = document.querySelector(`[data-butter="${modes[nextIdx]}"]`);
      if (targetBtn) targetBtn.click();
    }

    cycleCat() {
      const modes = ['off', 'ginger', 'cyber'];
      const nextIdx = (modes.indexOf(this.config.cat) + 1) % modes.length;
      const targetBtn = document.querySelector(`[data-cat="${modes[nextIdx]}"]`);
      if (targetBtn) targetBtn.click();
    }

    resize() {
      const w = window.innerWidth;
      const h = window.innerHeight;

      if (this.bgCanvas) {
        this.bgCanvas.width = w;
        this.bgCanvas.height = h;
      }

      if (this.chamberCanvas) {
        const chamber = document.getElementById('chamber-container');
        if (chamber) {
          this.chamberCanvas.width = chamber.clientWidth;
          this.chamberCanvas.height = chamber.clientHeight;
        }
      }

      if (this.toast.state === 'clamped') {
        this.rechamberToast(false);
      }
    }

    log(text, colorClass = '') {
      if (!this.el.termLog) return;
      const line = document.createElement('div');
      line.className = 'log-line ' + (colorClass ? 'text-' + colorClass : '');
      const timeStr = new Date().toTimeString().split(' ')[0];
      line.textContent = `[${timeStr}] ${text}`;
      this.el.termLog.appendChild(line);
      this.el.termLog.scrollTop = this.el.termLog.scrollHeight;
    }

    updateTelemetryHUD() {
      let prob = 50.0;
      let entropy = 5.0;
      let paradox = 0.0;

      if (this.config.butter === 'standard') {
        prob = 0.2;
        entropy = 9.81;
      } else if (this.config.butter === 'double') {
        prob = 0.0;
        entropy = 14.2;
        paradox += 1.5;
      }

      if (this.config.cat !== 'off') {
        paradox += 3.5;
        entropy *= 0.5;
        prob = 35.0; // Levitation paradox prevents regular landing
      }

      if (this.config.antigrav === 'low') {
        prob += 15.0;
        entropy *= 0.7;
      } else if (this.config.antigrav === 'repulsion') {
        prob = 0.0;
        entropy = 1.0;
      }

      if (this.config.portal === 'wormhole') {
        prob = 100.0;
        entropy = 0.01;
      } else if (this.config.portal === 'singularity') {
        prob = 50.0;
        paradox += 5.0;
      }

      this.el.statProb.textContent = `${Math.min(100, Math.max(0, prob)).toFixed(1)}%`;
      this.el.statEntropy.textContent = `${entropy.toFixed(2)} μM`;
      this.el.statParadox.textContent = `${paradox.toFixed(2)}x`;
    }

    rechamberToast(playSound = true) {
      this.audio.stopParadoxHum();
      this.el.resultBanner.classList.add('hidden');
      this.el.carriage.classList.add('clamped');

      const cw = this.chamberCanvas ? this.chamberCanvas.width : 800;
      this.toast.x = cw / 2;
      this.toast.y = 48; // clamped directly under crane carriage
      this.toast.vx = 0;
      this.toast.vy = 0;
      this.toast.angle = 0;
      this.toast.angularVelocity = 0;
      this.toast.scale = 1;
      this.toast.opacity = 1;
      this.toast.state = 'clamped';
      this.toast.paradoxRpm = 0;

      if (playSound) {
        this.audio.playClampRelease();
        this.log('Toast loaded and securely clamped in high-energy drop clamp.', 'cyan');
      }
    }

    initiateDrop() {
      if (this.toast.state !== 'clamped') {
        this.rechamberToast(true);
        return;
      }

      this.stats.drops++;
      this.toast.state = 'dropping';
      this.el.carriage.classList.remove('clamped');
      this.audio.playClampRelease();
      this.audio.playWhoosh(1.2);
      this.log('EMITTER RELEASED! Toast is in free-fall through the quantum vacuum chamber!', 'amber');

      // Physics initial push
      this.toast.vy = 1.0;
      this.toast.vx = (Math.random() - 0.5) * 0.4;

      // Murphy Butter Torque
      if (this.config.butter === 'standard') {
        // High tendency to rotate 180 degrees (butter down)
        this.toast.angularVelocity = 0.085;
      } else if (this.config.butter === 'double') {
        // Chaotic tumble
        this.toast.angularVelocity = (Math.random() - 0.5) * 0.15;
      } else {
        // Gentle flutter
        this.toast.angularVelocity = (Math.random() - 0.5) * 0.04;
      }
    }

    autoSolveParadox() {
      this.log('AUTO-SOLVE ENGAGED: Calibrating Einstein-Rosen Bridge & Feline Matrix...', 'magenta');

      const butterBtn = document.querySelector('[data-butter="standard"]');
      const catBtn = document.querySelector('[data-cat="ginger"]');
      const antigravBtn = document.querySelector('[data-antigrav="low"]');
      const portalBtn = document.querySelector('[data-portal="wormhole"]');

      if (butterBtn) butterBtn.click();
      if (catBtn) catBtn.click();
      if (antigravBtn) antigravBtn.click();
      if (portalBtn) portalBtn.click();

      setTimeout(() => {
        this.initiateDrop();
      }, 350);
    }

    triggerScram() {
      this.audio.playScramSiren();
      this.el.scramOverlay.classList.remove('hidden');
      this.log('CRITICAL: EMERGENCY SCRAM INITIATED! Event horizon collapse!', 'crimson');

      // Generate floating swarm of panicked toast emojis
      if (this.el.scramToastSwarm) {
        this.el.scramToastSwarm.innerHTML = '';
        for (let i = 0; i < 20; i++) {
          const t = document.createElement('span');
          t.textContent = ['🍞', '🧈', '🐱', '⚛️', '🌀'][Math.floor(Math.random() * 5)];
          t.style.position = 'absolute';
          t.style.left = `${Math.random() * 80 + 10}%`;
          t.style.top = `${Math.random() * 60 + 20}%`;
          t.style.fontSize = `${Math.random() * 24 + 18}px`;
          t.style.transform = `rotate(${Math.random() * 360}deg)`;
          this.el.scramToastSwarm.appendChild(t);
        }
      }
    }

    resetScram() {
      this.el.scramOverlay.classList.add('hidden');
      this.rechamberToast(true);
      this.log('SCRAM cleared. Cryogenic helium pumps restored.', 'emerald');
    }

    showResult(type, title, desc, icon = '🍞') {
      this.el.resultBanner.className = 'result-banner ' + type;
      this.el.bannerIcon.textContent = icon;
      this.el.bannerTitle.textContent = title;
      this.el.bannerDesc.textContent = desc;
      this.el.resultBanner.classList.remove('hidden');
    }

    // --- PHYSICS UPDATE ---
    updatePhysics(dt) {
      if (this.toast.state === 'clamped') {
        // Sparkle occasionally at clamp
        if (Math.random() < 0.15) {
          this.particles.spawn(
            this.toast.x + (Math.random() - 0.5) * 30,
            this.toast.y + 10,
            (Math.random() - 0.5) * 20,
            Math.random() * 20,
            '#38bdf8',
            3,
            0.6,
            'spark'
          );
        }
        return;
      }

      const ch = this.chamberCanvas ? this.chamberCanvas.height : 500;
      const cw = this.chamberCanvas ? this.chamberCanvas.width : 800;
      const floorY = ch - 80;

      // 1. STATE: DROPPING
      if (this.toast.state === 'dropping') {
        // Gravity
        let g = 280; // px / s^2
        if (this.config.antigrav === 'low') g = 75;
        if (this.config.antigrav === 'repulsion') g = -120;

        this.toast.vy += g * dt;
        this.toast.y += this.toast.vy * dt;
        this.toast.x += this.toast.vx * dt;

        // Feline Righting vs Murphy Butter Paradox Check
        if (this.config.cat !== 'off' && this.config.butter !== 'none') {
          // Mid-air paradox hover!
          if (this.toast.y > ch * 0.38) {
            this.toast.state = 'paradox';
            this.stats.paradoxes++;
            this.audio.playCatSound(this.config.cat === 'cyber');
            this.audio.startParadoxHum();
            this.log('PARADOX EQUILIBRIUM ACHIEVED! Cat and Butter cancel Newtonian physics!', 'magenta');
            this.showResult(
              'paradox',
              'PERPETUAL ROTATION PARADOX!',
              'The cat refuses to land on butter; the butter refuses to land on cat! The toast is suspended in perpetual 12,000 RPM levitation!',
              '🐱⚡'
            );
            return;
          }
        }

        // Portal Interception Check
        if (this.config.portal !== 'off' && this.toast.y > ch * 0.55 && Math.abs(this.toast.x - (cw * 0.22)) < 90) {
          // Toast sucked into Portal Alpha
          this.toast.state = 'portal_warp';
          this.audio.playPortalWarp();
          this.log('Toast intercepted by Portal Alpha! Warping through hyperspace...', 'cyan');
          return;
        }

        // Repulsive antigravity floating out of top
        if (this.config.antigrav === 'repulsion' && this.toast.y < 20) {
          this.toast.state = 'landed';
          this.log('Toast escaped ceiling aperture into upper stratosphere!', 'amber');
          this.showResult(
            'fail',
            'LOST TO STRATOSPHERE',
            'Negative gravity propelled your brioche into low-earth orbit. Mission failed, but astronomy was advanced.',
            '🛸'
          );
          return;
        }

        // Normal Rotation Physics
        this.toast.angle += this.toast.angularVelocity;

        // Murphy effect: if buttered and near floor, snap to butter-side down (angle ~ PI)
        if (this.config.butter === 'standard' && this.toast.y > ch * 0.5) {
          const targetAngle = Math.PI;
          const diff = targetAngle - (this.toast.angle % (Math.PI * 2));
          this.toast.angularVelocity += diff * 0.08 * dt;
        }

        // Floor Impact
        if (this.toast.y >= floorY) {
          this.toast.y = floorY;
          this.toast.vy = 0;
          this.toast.vx = 0;
          this.toast.angularVelocity = 0;
          this.toast.state = 'landed';

          // Determine outcome: Upright vs Butter-Down
          const normAngle = Math.abs(this.toast.angle % (Math.PI * 2));
          const isButterDown = normAngle > Math.PI * 0.4 && normAngle < Math.PI * 1.6;

          if (this.config.butter !== 'none' && isButterDown) {
            // Failed: Buttered side splattered!
            this.stats.fails++;
            this.audio.playMurphyFail();
            this.log('CATASTROPHE: Toast landed butter-side down! Murphy wins again.', 'crimson');

            // Butter splatter particles
            for (let i = 0; i < 18; i++) {
              this.particles.spawn(
                this.toast.x, floorY + 10,
                (Math.random() - 0.5) * 140,
                -Math.random() * 80,
                '#facc15',
                Math.random() * 6 + 3,
                0.8,
                'circle'
              );
            }

            this.showResult(
              'fail',
              "MURPHY'S LAW PREVAILS",
              '100% butter contamination. The carpet fibers have established an ionic bond with the churned dairy.',
              '💀🧈'
            );
          } else {
            // Success: Landed upright or dry toast
            this.stats.teleports++;
            this.audio.playVictoryFanfare();
            if (window.confetti) {
              window.confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
            }
            this.log('VICTORY! Toast landed butter-side UP on the platter! Coherence 100%.', 'emerald');
            this.showResult(
              'success',
              'QUANTUM VICTORY!',
              'Flawless butter-side-UP touchdown! The breakfast continuum is preserved.',
              '✨🍞'
            );
          }
        }
      }

      // 2. STATE: PARADOX (Perpetual Spinning in mid-air)
      else if (this.toast.state === 'paradox') {
        this.toast.paradoxRpm = Math.min(14000, this.toast.paradoxRpm + 1200 * dt);
        this.toast.angle += (this.toast.paradoxRpm / 60) * Math.PI * 2 * dt;

        // Gentle levitation bob
        this.toast.y += Math.sin(performance.now() * 0.005) * 0.3;

        // Paradox electric spark rings
        if (Math.random() < 0.6) {
          const colors = ['#f472b6', '#38bdf8', '#facc15'];
          this.particles.spawn(
            this.toast.x + (Math.random() - 0.5) * 40,
            this.toast.y + (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 160,
            (Math.random() - 0.5) * 160,
            colors[Math.floor(Math.random() * colors.length)],
            Math.random() * 5 + 2,
            0.5,
            'spark'
          );
        }
      }

      // 3. STATE: PORTAL WARP
      else if (this.toast.state === 'portal_warp') {
        // Spiral shrink into Portal Alpha, then pop out of Portal Beta
        this.toast.scale -= 1.8 * dt;
        this.toast.angle += 12 * dt;

        // Sparkle
        this.particles.spawn(
          this.toast.x, this.toast.y,
          (Math.random() - 0.5) * 80,
          (Math.random() - 0.5) * 80,
          '#38bdf8',
          4, 0.4, 'spark'
        );

        if (this.toast.scale <= 0.1) {
          // Materialize out of Portal Beta right above the breakfast platter!
          this.toast.state = 'portal_emerge';
          this.toast.x = cw * 0.5; // directly over platter
          this.toast.y = floorY - 60;
          this.toast.angle = 0; // guaranteed butter-side UP!
          this.toast.scale = 0.1;
          this.toast.vy = 40;
          this.audio.playPortalWarp();
          this.log('Toast emerging from Portal Beta with 100% quantum coherence!', 'emerald');
        }
      }

      // 4. STATE: PORTAL EMERGE
      else if (this.toast.state === 'portal_emerge') {
        this.toast.scale = Math.min(1.0, this.toast.scale + 2.5 * dt);
        this.toast.y += this.toast.vy * dt;

        // Magenta exit sparks
        this.particles.spawn(
          this.toast.x, this.toast.y,
          (Math.random() - 0.5) * 70,
          (Math.random() - 0.5) * 70,
          '#f472b6',
          4, 0.4, 'spark'
        );

        if (this.toast.y >= floorY - 5) {
          this.toast.y = floorY - 5;
          this.toast.scale = 1.0;
          this.toast.state = 'landed';
          this.stats.teleports++;
          this.audio.playVictoryFanfare();
          if (window.confetti) {
            window.confetti({ particleCount: 80, spread: 90, origin: { y: 0.75 } });
          }
          this.log('TELEPORTATION SUCCESS: Toast deposited butter-side UP on silver platter!', 'emerald');
          this.showResult(
            'success',
            '100% TELEPORTATION SUCCESS!',
            'Spacetime geometry inverted the Murphy vector! The sourdough is safely plated, golden butter gleaming under pristine quantum lighting.',
            '🏆🍞'
          );
        }
      }

      // Dynamic Particle trail while in motion
      if (this.toast.state === 'dropping') {
        const pColor = this.config.cat !== 'off' ? '#f472b6' : '#38bdf8';
        this.particles.spawn(
          this.toast.x + (Math.random() - 0.5) * 16,
          this.toast.y - 10,
          (Math.random() - 0.5) * 20,
          -10,
          pColor,
          3,
          0.4,
          'circle'
        );
      }
    }

    // --- DRAWING CODE ---
    drawChamber(ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // Draw particle effects
      this.particles.draw(ctx);

      // Draw the Toast and attachments
      ctx.save();
      ctx.translate(this.toast.x, this.toast.y);
      ctx.rotate(this.toast.angle);
      ctx.scale(this.toast.scale, this.toast.scale);
      ctx.globalAlpha = this.toast.opacity;

      this.renderToastObject(ctx);

      ctx.restore();
    }

    renderToastObject(ctx) {
      const w = 64;
      const h = 72;

      // 1. Toast Slice Base (Crust & Crumb)
      ctx.save();

      // Outer Crust
      ctx.fillStyle = '#8c4b18';
      ctx.beginPath();
      // Round top bread loaf shape
      ctx.moveTo(-w * 0.4, -h * 0.3);
      ctx.bezierCurveTo(-w * 0.45, -h * 0.6, -w * 0.1, -h * 0.65, 0, -h * 0.65);
      ctx.bezierCurveTo(w * 0.1, -h * 0.65, w * 0.45, -h * 0.6, w * 0.4, -h * 0.3);
      ctx.lineTo(w * 0.38, h * 0.45);
      ctx.bezierCurveTo(w * 0.35, h * 0.55, -w * 0.35, h * 0.55, -w * 0.38, h * 0.45);
      ctx.closePath();
      ctx.fill();

      // Inner Golden Crumb
      ctx.fillStyle = '#f5b041';
      ctx.beginPath();
      ctx.moveTo(-w * 0.35, -h * 0.28);
      ctx.bezierCurveTo(-w * 0.38, -h * 0.55, -w * 0.08, -h * 0.58, 0, -h * 0.58);
      ctx.bezierCurveTo(w * 0.08, -h * 0.58, w * 0.38, -h * 0.55, w * 0.35, -h * 0.28);
      ctx.lineTo(w * 0.32, h * 0.4);
      ctx.bezierCurveTo(w * 0.3, h * 0.48, -w * 0.3, h * 0.48, -w * 0.32, h * 0.4);
      ctx.closePath();
      ctx.fill();

      // Toast texture spots
      ctx.fillStyle = 'rgba(140, 75, 24, 0.25)';
      ctx.beginPath();
      ctx.arc(-8, -10, 4, 0, Math.PI * 2);
      ctx.arc(10, 5, 5, 0, Math.PI * 2);
      ctx.arc(-4, 14, 3, 0, Math.PI * 2);
      ctx.arc(8, -18, 3, 0, Math.PI * 2);
      ctx.fill();

      // 2. Butter Layer (Top, or Double)
      if (this.config.butter === 'standard' || this.config.butter === 'double') {
        // Golden melted butter pat on TOP surface (-h * 0.15)
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.roundRect(-14, -18, 28, 22, 6);
        ctx.fill();

        // Shiny butter highlight
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.roundRect(-10, -15, 12, 6, 3);
        ctx.fill();

        // Melted butter gloss drips
        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.arc(8, 7, 3, 0, Math.PI * 2);
        ctx.arc(-10, 6, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // If Double-Glazed butter: Also draw butter on opposite side
      if (this.config.butter === 'double') {
        ctx.fillStyle = 'rgba(250, 204, 21, 0.85)';
        ctx.beginPath();
        ctx.roundRect(-12, 10, 24, 18, 5);
        ctx.fill();
      }

      // 3. Feline Attachment Module (Strapped on the back!)
      if (this.config.cat !== 'off') {
        this.renderCatHarness(ctx, w, h);
      }

      ctx.restore();
    }

    renderCatHarness(ctx, w, h) {
      const isCyber = this.config.cat === 'cyber';
      const catColor = isCyber ? '#0284c7' : '#ea580c'; // Cyber cyan or ginger orange
      const earInner = isCyber ? '#38bdf8' : '#fda4af';

      ctx.save();
      // Position cat strapped to back/center of toast
      ctx.translate(0, 4);

      // Strapping belts around toast
      ctx.strokeStyle = isCyber ? '#38bdf8' : '#1e293b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-w * 0.42, -6);
      ctx.lineTo(w * 0.42, -6);
      ctx.moveTo(-w * 0.42, 16);
      ctx.lineTo(w * 0.42, 16);
      ctx.stroke();

      // Cat Head / Body
      ctx.fillStyle = catColor;
      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, Math.PI * 2);
      ctx.fill();

      // Ears
      ctx.beginPath();
      ctx.moveTo(-12, -8);
      ctx.lineTo(-16, -24);
      ctx.lineTo(-4, -14);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(12, -8);
      ctx.lineTo(16, -24);
      ctx.lineTo(4, -14);
      ctx.closePath();
      ctx.fill();

      // Inner ears
      ctx.fillStyle = earInner;
      ctx.beginPath();
      ctx.moveTo(-11, -9);
      ctx.lineTo(-14, -20);
      ctx.lineTo(-5, -13);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(11, -9);
      ctx.lineTo(14, -20);
      ctx.lineTo(5, -13);
      ctx.closePath();
      ctx.fill();

      // Cat Eyes / Visor
      if (!isCyber) {
        // Cute big cat eyes
        ctx.fillStyle = '#10b981'; // Green emerald eyes
        ctx.beginPath();
        ctx.ellipse(-6, -2, 4, 5, 0, 0, Math.PI * 2);
        ctx.ellipse(6, -2, 4, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Pupils
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.ellipse(-6, -2, 1.5, 4, 0, 0, Math.PI * 2);
        ctx.ellipse(6, -2, 1.5, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Nose & mouth
        ctx.fillStyle = '#fda4af';
        ctx.beginPath();
        ctx.polygon = [[0, 3], [-2, 1], [2, 1]];
        ctx.arc(0, 2, 2, 0, Math.PI);
        ctx.fill();
      } else {
        // Cyber Visor
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.roundRect(-10, -5, 20, 8, 3);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Cat Paws holding toast edges
      ctx.fillStyle = catColor;
      ctx.beginPath();
      ctx.arc(-w * 0.36, -4, 5, 0, Math.PI * 2);
      ctx.arc(w * 0.36, -4, 5, 0, Math.PI * 2);
      ctx.arc(-w * 0.34, 18, 5, 0, Math.PI * 2);
      ctx.arc(w * 0.34, 18, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // --- BACKGROUND CHERENKOV FX ---
    drawBackground(ctx) {
      const w = ctx.canvas.width;
      const h = ctx.canvas.height;
      ctx.clearRect(0, 0, w, h);

      const time = performance.now() * 0.001;

      // Subtle undulating quantum field grid lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 48;

      ctx.beginPath();
      for (let x = 0; x < w; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();

      // Atmospheric floating Cherenkov dust particles
      ctx.fillStyle = 'rgba(56, 189, 248, 0.18)';
      for (let i = 0; i < 24; i++) {
        const px = ((i * 137.5 + time * 15) % w);
        const py = ((i * 89.2 + Math.sin(time + i) * 30) % h);
        const size = (i % 3) + 1.5;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // --- MAIN TICK LOOP ---
    loop(currentTime) {
      const dt = Math.min(0.1, (currentTime - this.lastTime) * 0.001);
      this.lastTime = currentTime;

      // Physics & Logic
      this.updatePhysics(dt);
      this.particles.update(dt);

      // Rendering
      if (this.bgCtx) this.drawBackground(this.bgCtx);
      if (this.chamberCtx) this.drawChamber(this.chamberCtx);

      requestAnimationFrame((t) => this.loop(t));
    }
  }

  // Auto-boot on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.__QUANTUM_TOAST_APP__ = new QuantumToastApp();
    });
  } else {
    window.__QUANTUM_TOAST_APP__ = new QuantumToastApp();
  }
})();
