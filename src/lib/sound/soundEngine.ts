/**
 * Synthesized Tactile Web Audio Engine
 * Zero external audio files · Zero network latency · Pure Web Audio API
 * Built for micro-haptic auditory feedback inspired by Apple & Emil Kowalski.
 */

class SoundEngine {
  private ctx: AudioContext | null = null
  private enabled: boolean = true
  private volume: number = 0.045 // Whisper-quiet 4.5% volume
  private lastTapTime: number = 0

  constructor() {
    // Sound is the default native tactile behavior
    this.enabled = true
  }

  public isEnabled(): boolean {
    return this.enabled
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }

  public toggle(): boolean {
    this.setEnabled(!this.enabled)
    return this.enabled
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioContextClass) {
        this.ctx = new AudioContextClass()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return this.ctx
  }

  /**
   * 1. Mechanical Toggle Switch
   * Physical weighted click for ThemeToggle (140Hz -> 30Hz, 18ms).
   */
  public playSwitch(): void {
    if (!this.enabled) return
    const ac = this.getContext()
    if (!ac) return

    const now = ac.currentTime
    const osc = ac.createOscillator()
    const gain = ac.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(140, now)
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.018)

    gain.gain.setValueAtTime(this.volume * 1.2, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018)

    osc.connect(gain)
    gain.connect(ac.destination)

    osc.start(now)
    osc.stop(now + 0.018)
  }

  /**
   * 2. Feather-Light Tap
   * 8ms high-passed noise tick for tabs, carousel navigation, and pills.
   */
  public playTap(): void {
    if (!this.enabled) return
    const nowMs = typeof performance !== 'undefined' ? performance.now() : Date.now()
    if (nowMs - this.lastTapTime < 60) return
    this.lastTapTime = nowMs

    const ac = this.getContext()
    if (!ac) return

    const now = ac.currentTime
    const bufferSize = Math.floor(ac.sampleRate * 0.008)
    const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const noise = ac.createBufferSource()
    noise.buffer = buffer

    const filter = ac.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.setValueAtTime(1200, now)

    const gain = ac.createGain()
    gain.gain.setValueAtTime(this.volume * 0.5, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.008)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(ac.destination)

    noise.start(now)
  }

  /**
   * 3. Positive Confirmation Chirp
   * 35ms harmonic sine sweep for copy buttons, form submissions, and success states.
   */
  public playChirp(): void {
    if (!this.enabled) return
    const ac = this.getContext()
    if (!ac) return

    const now = ac.currentTime
    const osc = ac.createOscillator()
    const gain = ac.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(480, now)
    osc.frequency.exponentialRampToValueAtTime(960, now + 0.035)

    gain.gain.setValueAtTime(this.volume * 0.8, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035)

    osc.connect(gain)
    gain.connect(ac.destination)

    osc.start(now)
    osc.stop(now + 0.035)
  }

  /**
   * 4. Modal / Lightbox Pop
   * 25ms acoustic air pop when modals or lightboxes open.
   */
  public playPop(): void {
    if (!this.enabled) return
    const ac = this.getContext()
    if (!ac) return

    const now = ac.currentTime
    const osc = ac.createOscillator()
    const gain = ac.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(320, now)
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.025)

    gain.gain.setValueAtTime(this.volume * 1.0, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025)

    osc.connect(gain)
    gain.connect(ac.destination)

    osc.start(now)
    osc.stop(now + 0.025)
  }
}

export const sound = new SoundEngine()
