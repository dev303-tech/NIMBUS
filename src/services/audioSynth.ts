/**
 * Nimbus Atmospheric Audio Synthesizer
 * Pure Web Audio API: Procedural pink noise (wind) + pollution-modulated resonant sub-drone.
 * Zero external MP3 downloads required.
 */

class AtmosphericAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private masterGain: GainNode | null = null;
  private windGain: GainNode | null = null;
  private droneGain: GainNode | null = null;
  private droneFilter: BiquadFilterNode | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private noiseFilter: BiquadFilterNode | null = null;

  private initContext() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioCtx();

    // Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Wind Pink Noise Generator (5 seconds loop buffer)
    const bufferSize = this.ctx.sampleRate * 5;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }

    this.noiseNode = this.ctx.createBufferSource();
    this.noiseNode.buffer = noiseBuffer;
    this.noiseNode.loop = true;

    this.noiseFilter = this.ctx.createBiquadFilter();
    this.noiseFilter.type = 'bandpass';
    this.noiseFilter.frequency.setValueAtTime(320, this.ctx.currentTime);
    this.noiseFilter.Q.setValueAtTime(1.2, this.ctx.currentTime);

    this.windGain = this.ctx.createGain();
    this.windGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

    this.noiseNode.connect(this.noiseFilter);
    this.noiseFilter.connect(this.windGain);
    this.windGain.connect(this.masterGain);
    this.noiseNode.start();

    // Low Atmospheric Drone (detuned sine/saw)
    this.osc1 = this.ctx.createOscillator();
    this.osc1.type = 'sine';
    this.osc1.frequency.setValueAtTime(55, this.ctx.currentTime); // A1 note

    this.osc2 = this.ctx.createOscillator();
    this.osc2.type = 'triangle';
    this.osc2.frequency.setValueAtTime(54.2, this.ctx.currentTime); // slight detune beat

    this.droneFilter = this.ctx.createBiquadFilter();
    this.droneFilter.type = 'lowpass';
    this.droneFilter.frequency.setValueAtTime(140, this.ctx.currentTime);
    this.droneFilter.Q.setValueAtTime(3.0, this.ctx.currentTime);

    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.2, this.ctx.currentTime);

    this.osc1.connect(this.droneFilter);
    this.osc2.connect(this.droneFilter);
    this.droneFilter.connect(this.droneGain);
    this.droneGain.connect(this.masterGain);

    this.osc1.start();
    this.osc2.start();
  }

  public toggle(): boolean {
    this.initContext();
    if (!this.ctx || !this.masterGain) return false;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isPlaying = !this.isPlaying;
    const now = this.ctx.currentTime;
    if (this.isPlaying) {
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(0.4, now + 1.2);
    } else {
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.8);
    }

    return this.isPlaying;
  }

  public updateParameters(pollutionNorm: number, altitudeNorm: number) {
    if (!this.ctx || !this.isPlaying) return;
    const now = this.ctx.currentTime;

    // Altitude shapes wind: higher altitude = whistling thinner wind, lower = lower frequency rumble
    if (this.noiseFilter) {
      const windFreq = 200 + (1 - altitudeNorm) * 600;
      this.noiseFilter.frequency.setTargetAtTime(windFreq, now, 0.2);
    }

    // Pollution thickens drone: high pollution opens lowpass filter & adds gritty resonance
    if (this.droneFilter && this.droneGain) {
      const droneFreq = 80 + pollutionNorm * 280;
      const droneQ = 2.0 + pollutionNorm * 4.0;
      this.droneFilter.frequency.setTargetAtTime(droneFreq, now, 0.3);
      this.droneFilter.Q.setTargetAtTime(droneQ, now, 0.3);
      this.droneGain.gain.setTargetAtTime(0.15 + pollutionNorm * 0.25, now, 0.3);
    }
  }

  public onScrollVelocity(velocity: number) {
    if (!this.ctx || !this.isPlaying || !this.noiseFilter) return;
    const absV = Math.min(60, Math.abs(velocity));
    const now = this.ctx.currentTime;
    // Aerodynamic whoosh frequency sweep on fast scroll
    const boost = absV * 8.0;
    this.noiseFilter.frequency.setTargetAtTime(this.noiseFilter.frequency.value + boost, now, 0.05);
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }
}

export const audioEngine = new AtmosphericAudioEngine();
