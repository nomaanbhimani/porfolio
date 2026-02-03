import { useEffect, useRef, useState } from 'react'

interface VoiceIndicatorProps {
    isListening: boolean
}

export function VoiceIndicator({ isListening }: VoiceIndicatorProps) {
    const [bars, setBars] = useState<number[]>([0.3, 0.5, 0.7, 0.5, 0.3])
    const animationRef = useRef<number | undefined>(undefined)

    useEffect(() => {
        if (isListening) {
            const animate = () => {
                setBars(prev => prev.map(() => 0.2 + Math.random() * 0.8))
                animationRef.current = requestAnimationFrame(animate)
            }
            // Slower animation - update every 100ms
            const interval = setInterval(() => {
                setBars(prev => prev.map(() => 0.2 + Math.random() * 0.8))
            }, 100)
            return () => clearInterval(interval)
        } else {
            setBars([0.3, 0.5, 0.7, 0.5, 0.3])
        }
    }, [isListening])

    if (!isListening) return null

    return (
        <div style={{
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            display: 'flex',
            alignItems: 'flex-end',
            gap: '3px',
            padding: '15px 20px',
            background: 'rgba(0, 0, 0, 0.8)',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            borderRadius: '8px',
            zIndex: 10000
        }}>
            {/* Waveform Bars */}
            {bars.map((height, i) => (
                <div
                    key={i}
                    style={{
                        width: '4px',
                        height: `${height * 30}px`,
                        background: 'linear-gradient(to top, #00F0FF, #8B5CF6)',
                        borderRadius: '2px',
                        transition: 'height 0.1s ease'
                    }}
                />
            ))}

            {/* Label */}
            <span style={{
                marginLeft: '10px',
                color: '#00F0FF',
                fontFamily: 'Share Tech Mono',
                fontSize: '10px',
                animation: 'pulse 1s infinite'
            }}>
                LISTENING...
            </span>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </div>
    )
}
