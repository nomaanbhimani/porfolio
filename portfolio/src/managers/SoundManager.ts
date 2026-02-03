export class SoundManager {
    private context: AudioContext | null = null;
    private masterGain: GainNode | null = null;

    constructor() {
        this.init();
    }

    private init() {
        try {
            // @ts-ignore - Handle browser differences
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            this.context = new AudioContextClass();
            this.masterGain = this.context.createGain();
            this.masterGain.gain.value = 0.3; // Master volume
            this.masterGain.connect(this.context.destination);
        } catch (e) {
            console.error("Web Audio API not supported", e);
        }
    }

    private playTone(freq: number, type: OscillatorType, duration: number, startTime: number = 0, volume: number = 1) {
        if (!this.context || !this.masterGain) return;

        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.context.currentTime + startTime);

        gain.gain.setValueAtTime(volume, this.context.currentTime + startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + startTime + duration);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(this.context.currentTime + startTime);
        osc.stop(this.context.currentTime + startTime + duration);
    }

    // --- SFX PRESETS ---

    public playHover() {
        // High pitched short blip
        this.playTone(800, 'sine', 0.1, 0, 0.1);
    }

    public playClick() {
        // Mechanical click
        this.playTone(1200, 'square', 0.05, 0, 0.1);
        this.playTone(600, 'square', 0.05, 0.02, 0.1);
    }

    public playWindowOpen() {
        // Sci-fi sweep up
        if (!this.context || !this.masterGain) return;
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        osc.frequency.setValueAtTime(200, this.context.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, this.context.currentTime + 0.3);

        gain.gain.setValueAtTime(0.2, this.context.currentTime);
        gain.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.context.currentTime + 0.3);
    }

    public playAlert() {
        // Error / Alert buzz
        this.playTone(150, 'sawtooth', 0.3, 0, 0.2);
        this.playTone(150, 'sawtooth', 0.3, 0.15, 0.2);
    }

    public playSecretMode() {
        // Arc Reactor Power Up Sound (Rising Bass)
        if (!this.context || !this.masterGain) return;

        const osc = this.context.createOscillator();
        const sub = this.context.createOscillator();
        const gain = this.context.createGain();

        osc.type = 'sawtooth';
        sub.type = 'sine';

        // Risers
        osc.frequency.setValueAtTime(50, this.context.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, this.context.currentTime + 2);

        sub.frequency.setValueAtTime(30, this.context.currentTime);
        sub.frequency.exponentialRampToValueAtTime(100, this.context.currentTime + 2);

        gain.gain.setValueAtTime(0, this.context.currentTime);
        gain.gain.linearRampToValueAtTime(0.5, this.context.currentTime + 1);
        gain.gain.linearRampToValueAtTime(0, this.context.currentTime + 2.5);

        osc.connect(gain);
        sub.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        sub.start();
        osc.stop(this.context.currentTime + 2.5);
        sub.stop(this.context.currentTime + 2.5);
    }
}

export const sfx = new SoundManager();
