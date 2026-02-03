import { BaseWindow } from './BaseWindow'
import { WindowData } from '../../types/Window'
import { useState, useEffect } from 'react'

interface GeminiTerminalWindowProps {
    windowData: WindowData
    voiceQuery?: string
}

export function GeminiTerminalWindow({ windowData, voiceQuery }: GeminiTerminalWindowProps) {
    const [inputQuery, setInputQuery] = useState('')

    useEffect(() => {
        if (voiceQuery) {
            setInputQuery(voiceQuery)
            handleSubmitToGemini(voiceQuery)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [voiceQuery])

    const handleSubmitToGemini = (query: string) => {
        if (!query.trim()) return
        const geminiUrl = `https://gemini.google.com/app?q=${encodeURIComponent(query)}`
        globalThis.window.open(geminiUrl, '_blank')
        setInputQuery('')
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmitToGemini(inputQuery)
        }
    }

    return (
        <BaseWindow window={windowData}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                gap: '10px'
            }}>
                {/* Header Controls */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '5px 0',
                    borderBottom: '1px solid rgba(0, 240, 255, 0.2)'
                }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <div style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: '#00FF00',
                            boxShadow: '0 0 10px #00FF00'
                        }} />
                        <span style={{
                            color: '#00F0FF',
                            fontFamily: 'Share Tech Mono',
                            fontSize: '12px'
                        }}>
                            GEMINI NEURAL LINK // ACTIVE
                        </span>
                    </div>
                    <button
                        onClick={() => globalThis.window.open('https://gemini.google.com', '_blank')}
                        style={{
                            background: 'rgba(0, 240, 255, 0.1)',
                            border: '1px solid rgba(0, 240, 255, 0.3)',
                            color: '#00F0FF',
                            padding: '5px 10px',
                            fontSize: '10px',
                            cursor: 'pointer',
                            fontFamily: 'Orbitron'
                        }}
                    >
                        OPEN FULL INTERFACE
                    </button>
                </div>

                {/* Info Panel */}
                <div style={{
                    flex: 1,
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(0, 240, 255, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                }}>
                    <div style={{ textAlign: 'center', padding: '40px', maxWidth: '400px' }}>
                        <div style={{
                            fontSize: '60px',
                            marginBottom: '20px',
                            background: 'linear-gradient(135deg, #00F0FF, #8B5CF6)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontFamily: 'Orbitron'
                        }}>
                            ✦
                        </div>
                        <h2 style={{
                            color: '#fff',
                            fontFamily: 'Orbitron',
                            fontSize: '18px',
                            marginBottom: '15px',
                            letterSpacing: '2px'
                        }}>
                            GEMINI AI INTERFACE
                        </h2>
                        <p style={{
                            color: '#888',
                            fontSize: '12px',
                            lineHeight: '1.6',
                            fontFamily: 'Share Tech Mono',
                            marginBottom: '20px'
                        }}>
                            Type your query below or use voice commands.
                            Your request will be sent directly to Google Gemini AI.
                        </p>

                        {/* Quick Actions */}
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            {['Code Review', 'Explain Code', 'Debug Help', 'Architecture'].map(action => (
                                <button
                                    key={action}
                                    onClick={() => handleSubmitToGemini(action)}
                                    style={{
                                        background: 'rgba(139, 92, 246, 0.1)',
                                        border: '1px solid rgba(139, 92, 246, 0.3)',
                                        color: '#8B5CF6',
                                        padding: '8px 12px',
                                        fontSize: '10px',
                                        cursor: 'pointer',
                                        fontFamily: 'Share Tech Mono'
                                    }}
                                >
                                    {action}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Input Area */}
                <div style={{ display: 'flex', gap: '10px', padding: '10px 0' }}>
                    <input
                        type="text"
                        value={inputQuery}
                        onChange={(e) => setInputQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="ASK GEMINI... (or use voice: 'Ask Gemini...')"
                        style={{
                            flex: 1,
                            background: 'rgba(0, 0, 0, 0.5)',
                            border: '1px solid rgba(139, 92, 246, 0.3)',
                            padding: '12px 15px',
                            color: '#fff',
                            fontFamily: 'Share Tech Mono',
                            fontSize: '14px',
                            outline: 'none'
                        }}
                    />
                    <button
                        onClick={() => handleSubmitToGemini(inputQuery)}
                        style={{
                            background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(139, 92, 246, 0.2))',
                            border: '1px solid #8B5CF6',
                            color: '#fff',
                            padding: '0 25px',
                            cursor: 'pointer',
                            fontFamily: 'Orbitron',
                            fontSize: '12px',
                            letterSpacing: '1px'
                        }}
                    >
                        SEND →
                    </button>
                </div>

                {/* Voice Hint */}
                <div style={{
                    fontSize: '10px',
                    color: '#555',
                    textAlign: 'center',
                    fontFamily: 'Share Tech Mono'
                }}>
                    VOICE: "Ask Gemini [your question]" • EXAMPLE: "Ask Gemini how to optimize React"
                </div>
            </div>
        </BaseWindow>
    )
}
