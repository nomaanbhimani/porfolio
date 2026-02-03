import { useState, useRef } from 'react'

interface CommandInputProps {
    onCommand: (command: string) => void
}

export function CommandInput({ onCommand }: CommandInputProps) {
    const [input, setInput] = useState('')
    const [history, setHistory] = useState<string[]>([])
    const [historyIndex, setHistoryIndex] = useState(-1)
    const [isExpanded, setIsExpanded] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (input.trim()) {
            onCommand(input)
            setHistory(prev => [input, ...prev].slice(0, 50))
            setInput('')
            setHistoryIndex(-1)
            setIsExpanded(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault()
            if (history.length > 0 && historyIndex < history.length - 1) {
                const newIndex = historyIndex + 1
                setHistoryIndex(newIndex)
                setInput(history[newIndex])
            }
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1
                setHistoryIndex(newIndex)
                setInput(history[newIndex])
            } else if (historyIndex === 0) {
                setHistoryIndex(-1)
                setInput('')
            }
        }
        if (e.key === 'Escape') {
            setIsExpanded(false)
            inputRef.current?.blur()
        }
    }

    return (
        <>
            {/* Collapsed Button - Top Right */}
            {!isExpanded && (
                <button
                    onClick={() => {
                        setIsExpanded(true)
                        setTimeout(() => inputRef.current?.focus(), 100)
                    }}
                    style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        zIndex: 10002,
                        background: 'rgba(5, 10, 16, 0.8)',
                        border: '1px solid rgba(0, 240, 255, 0.5)',
                        padding: '10px 15px',
                        color: '#00F0FF',
                        fontFamily: 'Share Tech Mono',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 240, 255, 0.15)'
                        e.currentTarget.style.boxShadow = '0 0 15px rgba(0,240,255,0.3)'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(5, 10, 16, 0.8)'
                        e.currentTarget.style.boxShadow = 'none'
                    }}
                >
                    <span style={{ fontSize: '14px' }}>⌨</span>
                    COMMAND
                </button>
            )}

            {/* Expanded Command Input */}
            {isExpanded && (
                <form
                    onSubmit={handleSubmit}
                    style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        zIndex: 10002,
                        width: 'min(90%, 450px)'
                    }}
                >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: 'rgba(5, 10, 16, 0.95)',
                        border: '1px solid rgba(0, 240, 255, 0.6)',
                        padding: '10px 15px',
                        borderRadius: '2px',
                        boxShadow: '0 0 25px rgba(0, 240, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                        position: 'relative'
                    }}>
                        <span style={{
                            color: '#00F0FF',
                            marginRight: '10px',
                            fontWeight: 'bold',
                            fontFamily: 'Share Tech Mono',
                            fontSize: '16px',
                            textShadow: '0 0 10px #00F0FF'
                        }}>&gt;</span>

                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onBlur={() => {
                                if (!input) setIsExpanded(false)
                            }}
                            placeholder="Enter command... (ESC to close)"
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontFamily: 'Share Tech Mono',
                                fontSize: '14px',
                                width: '100%',
                                outline: 'none',
                                letterSpacing: '1px',
                                textTransform: 'uppercase'
                            }}
                            autoFocus
                        />

                        <button
                            type="button"
                            onClick={() => setIsExpanded(false)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#666',
                                cursor: 'pointer',
                                padding: '5px',
                                fontSize: '16px',
                                lineHeight: 1
                            }}
                        >
                            ×
                        </button>

                        {/* Corner Decorations */}
                        <div style={{ position: 'absolute', top: '-1px', left: '-1px', width: '8px', height: '8px', borderTop: '2px solid #00F0FF', borderLeft: '2px solid #00F0FF' }} />
                        <div style={{ position: 'absolute', top: '-1px', right: '-1px', width: '8px', height: '8px', borderTop: '2px solid #00F0FF', borderRight: '2px solid #00F0FF' }} />
                        <div style={{ position: 'absolute', bottom: '-1px', left: '-1px', width: '8px', height: '8px', borderBottom: '2px solid #00F0FF', borderLeft: '2px solid #00F0FF' }} />
                        <div style={{ position: 'absolute', bottom: '-1px', right: '-1px', width: '8px', height: '8px', borderBottom: '2px solid #00F0FF', borderRight: '2px solid #00F0FF' }} />
                    </div>
                </form>
            )}
        </>
    )
}
