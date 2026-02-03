import { useState, useEffect } from 'react'

interface SpeechConfig {
    text: string
    onWordSpoken?: (word: string, index: number) => void
    onComplete?: () => void
}

export class JarvisSpeechSystem {
    private synth = window.speechSynthesis
    private voice: SpeechSynthesisVoice | null = null

    constructor() {
        this.initVoice()
    }

    private initVoice() {
        // Try to load voices immediately
        const voices = this.synth.getVoices()
        this.setVoice(voices)

        // And also wait for the event
        this.synth.onvoiceschanged = () => {
            const voices = this.synth.getVoices()
            this.setVoice(voices)
        }
    }

    private setVoice(voices: SpeechSynthesisVoice[]) {
        // Try to find a British Male voice or Google UK Male
        this.voice = voices.find(v =>
            (v.name.includes('Male') && v.lang.includes('GB')) ||
            v.name.includes('Google UK English Male')
        ) || voices.find(v => v.lang.includes('en-GB')) || voices[0]
    }

    async speakWithAnimation(config: SpeechConfig): Promise<void> {
        const { text, onWordSpoken, onComplete } = config

        // Stop any current speech
        this.synth.cancel()

        // Ensure voice is set (sometimes init is slow)
        if (!this.voice) {
            this.setVoice(this.synth.getVoices())
        }

        return new Promise((resolve) => {
            const words = text.split(' ')
            const utterance = new SpeechSynthesisUtterance(text)
            if (this.voice) utterance.voice = this.voice
            utterance.rate = 1.0
            utterance.pitch = 0.9 // Slightly lower pitch for Jarvis effect
            utterance.volume = 1.0

            // Track word boundaries for synchronization
            let wordIndex = 0
            utterance.onboundary = (event) => {
                if (event.name === 'word' && wordIndex < words.length) {
                    onWordSpoken?.(words[wordIndex], wordIndex)
                    wordIndex++
                }
            }

            utterance.onend = () => {
                onComplete?.()
                resolve()
            }

            utterance.onerror = (e) => {
                console.error("Speech Error:", e)
                onComplete?.()
                resolve()
            }

            this.synth.speak(utterance)
        })
    }

    stop() {
        this.synth.cancel()
    }
}

// Hook for animated text display
export function useAnimatedSpeech(text: string, autoSpeak = true) {
    const [displayedText, setDisplayedText] = useState('')
    const [currentWordIndex, setCurrentWordIndex] = useState(0)
    const [isSpeaking, setIsSpeaking] = useState(false)

    useEffect(() => {
        if (!text || !autoSpeak) return

        const jarvis = new JarvisSpeechSystem()
        setDisplayedText('')
        setCurrentWordIndex(0)
        setIsSpeaking(true)

        jarvis.speakWithAnimation({
            text,
            onWordSpoken: (word, index) => {
                setCurrentWordIndex(index)
                setDisplayedText(prev => prev + (prev ? ' ' : '') + word)
            },
            onComplete: () => {
                setIsSpeaking(false)
                setDisplayedText(text) // Ensure full text matches at end
            }
        })

        return () => jarvis.stop()
    }, [text, autoSpeak])

    return { displayedText, currentWordIndex, isSpeaking }
}
