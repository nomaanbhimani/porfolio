import { useState, useEffect, useRef, useCallback } from 'react'

export function useJarvisVoice() {
    const [isListening, setIsListening] = useState(false)
    const [transcript, setTranscript] = useState('')
    const recognitionRef = useRef<any>(null)
    const shouldBeListening = useRef(false)

    useEffect(() => {
        // Type definition for Window with webkitSpeechRecognition
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

        if (!SpeechRecognition) {
            console.error('Speech Recognition API not supported in this browser.')
            return
        }

        const recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = false
        recognition.lang = 'en-US'

        recognition.onstart = () => {
            console.log('Voice recognition started')
            setIsListening(true)
        }

        recognition.onend = () => {
            console.log('Voice recognition ended')
            setIsListening(false)

            // Auto-restart if we should still be listening
            if (shouldBeListening.current && recognitionRef.current) {
                console.log('Auto-restarting voice recognition...')
                setTimeout(() => {
                    try {
                        recognitionRef.current?.start()
                    } catch (e) {
                        console.error('Auto-restart failed:', e)
                    }
                }, 100)
            }
        }

        recognition.onerror = (event: any) => {
            console.error('Voice recognition error:', event.error)
            // Don't restart on 'no-speech' - that's normal
            if (event.error === 'no-speech') {
                // Just restart
                if (shouldBeListening.current) {
                    setTimeout(() => {
                        try {
                            recognitionRef.current?.start()
                        } catch (e) {
                            console.error('Restart after no-speech failed:', e)
                        }
                    }, 100)
                }
            }
        }

        recognition.onresult = (event: any) => {
            const lastResult = event.results[event.results.length - 1]
            if (lastResult.isFinal) {
                const text = lastResult[0].transcript
                console.log('Voice Input:', text)
                setTranscript(text)

                // Clear transcript after processing
                setTimeout(() => setTranscript(''), 2000)
            }
        }

        recognitionRef.current = recognition

        return () => {
            shouldBeListening.current = false
            recognition.stop()
        }
    }, [])

    const startListening = useCallback(() => {
        shouldBeListening.current = true
        if (recognitionRef.current && !isListening) {
            try {
                recognitionRef.current.start()
                console.log('Started listening')
            } catch (e) {
                console.error("Error starting recognition:", e)
            }
        }
    }, [isListening])

    const stopListening = useCallback(() => {
        shouldBeListening.current = false
        if (recognitionRef.current) {
            recognitionRef.current.stop()
            console.log('Stopped listening')
        }
    }, [])

    return { isListening, transcript, startListening, stopListening }
}
