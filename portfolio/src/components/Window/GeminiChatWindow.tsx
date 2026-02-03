import { BaseWindow } from './BaseWindow'
import { WindowData } from '../../types/Window'
import { useState, useEffect, useRef } from 'react'

interface GeminiChatWindowProps {
    window: WindowData
}

interface Message {
    role: 'user' | 'ai'
    text: string
    timestamp: number
}

// Get API key from localStorage or environment
const getApiKey = (): string | null => {
    return localStorage.getItem('gemini_api_key') || null
}

export function GeminiChatWindow({ window: windowData }: GeminiChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'ai', text: 'J.A.R.V.I.S. Online. Gemini neural link active.', timestamp: Date.now() }
    ])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [apiKey, setApiKey] = useState<string | null>(getApiKey())
    const [showApiInput, setShowApiInput] = useState(false)
    const [tempApiKey, setTempApiKey] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const saveApiKey = () => {
        if (tempApiKey.trim()) {
            localStorage.setItem('gemini_api_key', tempApiKey.trim())
            setApiKey(tempApiKey.trim())
            setShowApiInput(false)
            setMessages(prev => [...prev, {
                role: 'ai',
                text: 'API key configured. Full neural capabilities unlocked.',
                timestamp: Date.now()
            }])
        }
    }

    const handleSend = async () => {
        if (!input.trim()) return

        const userMsg: Message = { role: 'user', text: input, timestamp: Date.now() }
        setMessages(prev => [...prev, userMsg])
        const userInput = input
        setInput('')
        setIsTyping(true)

        try {
            if (!apiKey) {
                // No API key - simulation mode
                setTimeout(() => {
                    setMessages(prev => [...prev, {
                        role: 'ai',
                        text: 'API key not configured. Click the ⚙ button to add your Gemini API key for full functionality.',
                        timestamp: Date.now()
                    }])
                    setIsTyping(false)
                }, 800)
                return
            }

            // Real Gemini API call
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: `You are J.A.R.V.I.S., Tony Stark's AI assistant. Respond helpfully but with JARVIS's characteristic wit and British formality. Keep responses concise (2-3 sentences max unless detailed explanation needed). User query: ${userInput}`
                            }]
                        }],
                        generationConfig: {
                            temperature: 0.7,
                            maxOutputTokens: 500
                        }
                    })
                }
            )

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`)
            }

            const data = await response.json()
            const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I encountered an error processing your request.'

            setMessages(prev => [...prev, {
                role: 'ai',
                text: aiText,
                timestamp: Date.now()
            }])
        } catch (error) {
            console.error('Gemini API error:', error)
            setMessages(prev => [...prev, {
                role: 'ai',
                text: `Neural link disrupted. Error: ${error instanceof Error ? error.message : 'Unknown error'}. Please verify your API key.`,
                timestamp: Date.now()
            }])
        } finally {
            setIsTyping(false)
        }
    }

    return (
        <BaseWindow window={windowData}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '10px' }}>

                {/* Header with API Key toggle */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(0, 240, 255, 0.2)',
                    paddingBottom: '10px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: apiKey ? '#00FF00' : '#FF6600',
                            boxShadow: apiKey ? '0 0 10px #00FF00' : '0 0 10px #FF6600'
                        }} />
                        <span style={{ color: '#666', fontSize: '10px', fontFamily: 'Share Tech Mono' }}>
                            {apiKey ? 'GEMINI CONNECTED' : 'SIMULATION MODE'}
                        </span>
                    </div>
                    <button
                        onClick={() => setShowApiInput(!showApiInput)}
                        style={{
                            background: 'transparent',
                            border: '1px solid rgba(0, 240, 255, 0.3)',
                            color: '#00F0FF',
                            padding: '4px 8px',
                            cursor: 'pointer',
                            fontSize: '12px'
                        }}
                    >
                        ⚙
                    </button>
                </div>

                {/* API Key Input (collapsible) */}
                {showApiInput && (
                    <div style={{
                        display: 'flex',
                        gap: '8px',
                        padding: '10px',
                        background: 'rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(0, 240, 255, 0.2)'
                    }}>
                        <input
                            type="password"
                            value={tempApiKey}
                            onChange={(e) => setTempApiKey(e.target.value)}
                            placeholder="Enter Gemini API Key..."
                            style={{
                                flex: 1,
                                background: 'rgba(0, 0, 0, 0.5)',
                                border: '1px solid rgba(0, 240, 255, 0.3)',
                                padding: '8px',
                                color: '#fff',
                                fontFamily: 'Share Tech Mono',
                                fontSize: '12px'
                            }}
                        />
                        <button
                            onClick={saveApiKey}
                            style={{
                                background: 'rgba(0, 255, 0, 0.1)',
                                border: '1px solid #00FF00',
                                color: '#00FF00',
                                padding: '8px 15px',
                                cursor: 'pointer',
                                fontFamily: 'Share Tech Mono'
                            }}
                        >
                            SAVE
                        </button>
                    </div>
                )}

                {/* Chat History */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px',
                    paddingRight: '5px'
                }}>
                    {messages.map((msg, i) => (
                        <div key={i} style={{
                            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '85%',
                            animation: 'fadeIn 0.3s'
                        }}>
                            <div style={{
                                fontSize: '10px',
                                color: msg.role === 'user' ? '#00F0FF' : '#ffb700',
                                marginBottom: '4px',
                                textAlign: msg.role === 'user' ? 'right' : 'left'
                            }}>
                                {msg.role === 'user' ? 'USER' : 'J.A.R.V.I.S'}
                            </div>
                            <div style={{
                                background: msg.role === 'user' ? 'rgba(0, 240, 255, 0.1)' : 'rgba(255, 183, 0, 0.05)',
                                border: `1px solid ${msg.role === 'user' ? 'rgba(0, 240, 255, 0.3)' : 'rgba(255, 183, 0, 0.2)'}`,
                                padding: '12px',
                                fontSize: '13px',
                                color: '#ccc',
                                fontFamily: 'Share Tech Mono',
                                lineHeight: '1.5',
                                borderLeft: msg.role === 'ai' ? '3px solid #ffb700' : 'none',
                                borderRight: msg.role === 'user' ? '3px solid #00F0FF' : 'none'
                            }}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div style={{ color: '#ffb700', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ animation: 'pulse 1s infinite' }}>●</span> PROCESSING QUERY...
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    borderTop: '1px solid rgba(0, 240, 255, 0.2)',
                    paddingTop: '15px'
                }}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !isTyping && handleSend()}
                        placeholder="ENTER QUERY..."
                        disabled={isTyping}
                        style={{
                            flex: 1,
                            background: 'rgba(0,0,0,0.5)',
                            border: '1px solid rgba(0, 240, 255, 0.3)',
                            padding: '12px',
                            color: '#fff',
                            fontFamily: 'Share Tech Mono',
                            fontSize: '14px',
                            outline: 'none',
                            opacity: isTyping ? 0.5 : 1
                        }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isTyping}
                        style={{
                            background: 'rgba(0, 240, 255, 0.1)',
                            border: '1px solid #00F0FF',
                            color: '#00F0FF',
                            padding: '0 20px',
                            cursor: isTyping ? 'not-allowed' : 'pointer',
                            fontFamily: 'Orbitron',
                            fontSize: '12px',
                            opacity: isTyping ? 0.5 : 1
                        }}
                    >
                        SEND
                    </button>
                </div>

            </div>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
            `}</style>
        </BaseWindow>
    )
}
