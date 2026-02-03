import { BaseWindow } from './BaseWindow'
import { WindowData } from '../../types/Window'
import { useState } from 'react'

interface ExternalWindowProps {
    window: WindowData
}

export function ExternalWindow({ window }: ExternalWindowProps) {
    const [isLoading, setIsLoading] = useState(true)
    const url = window.content?.url || 'about:blank'

    return (
        <BaseWindow window={window}>
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>

                {/* URL Bar (Decorative) */}
                <div style={{
                    padding: '8px',
                    background: 'rgba(0, 240, 255, 0.1)',
                    borderBottom: '1px solid rgba(0, 240, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <span style={{ color: '#00F0FF', fontSize: '12px' }}>🔒 SECURE_CONNECTION</span>
                    <div style={{
                        flex: 1,
                        background: 'rgba(0, 0, 0, 0.3)',
                        padding: '4px 10px',
                        borderRadius: '2px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '11px',
                        fontFamily: 'Share Tech Mono'
                    }}>
                        {url}
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div style={{
                        position: 'absolute',
                        inset: '40px 0 0 0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(0,0,0,0.8)',
                        zIndex: 1
                    }}>
                        <div style={{ color: '#00F0FF', fontFamily: 'Orbitron' }}>ESTABLISHING UPLINK...</div>
                    </div>
                )}

                {/* Iframe Content */}
                {/* Note: Many sites (GitHub, LinkedIn) deny iframe embedding via X-Frame-Options.
            For a real portfolio, we might need to just open in new tab or show a specific API-based component.
            For now, we will try to embed, but if it fails, we show a button to open externally.
        */}
                <div style={{ flex: 1, position: 'relative' }}>
                    <iframe
                        src={url}
                        title={window.title}
                        style={{ width: '100%', height: '100%', border: 'none', background: 'white' }}
                        onLoad={() => setIsLoading(false)}
                        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    />

                    {/* Overlay for blocked sites */}
                    <div style={{
                        position: 'absolute',
                        bottom: '20px',
                        right: '20px',
                        padding: '10px',
                        background: 'rgba(0,0,0,0.9)',
                        border: '1px solid #00F0FF',
                        maxWidth: '300px',
                        fontSize: '12px',
                        zIndex: 2,
                        pointerEvents: 'none' // Let clicks pass through if possible, but actually we want the button to be clickable
                    }}>
                        <div style={{ marginBottom: '5px', color: '#ffb700' }}>⚠ SECURITY PROTOCOL RESTRICTION</div>
                        <div style={{ marginBottom: '10px', opacity: 0.8 }}>Target server may refuse iframe connection.</div>
                        <button
                            style={{
                                background: '#00F0FF',
                                color: '#000',
                                border: 'none',
                                padding: '5px 10px',
                                cursor: 'pointer',
                                pointerEvents: 'auto',
                                fontWeight: 'bold'
                            }}
                            onClick={() => globalThis.window.open(url, '_blank')}
                        >
                            OPEN IN NEW TAB ↗
                        </button>
                    </div>
                </div>
            </div>
        </BaseWindow>
    )
}
