import React, { useEffect, useState } from 'react'

export const HUDOverlay: React.FC = () => {
    const [time, setTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    return (
        <div style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 9999, // On top of everything
            padding: '20px',
            fontFamily: 'Share Tech Mono, monospace',
            color: '#00F0FF',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
        }}>
            {/* Top Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,240,255,0.3)', paddingBottom: '10px' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '24px' }}>JARVIS // OS</div>
                    <div style={{ fontSize: '12px', opacity: 0.7 }}>SYS.V.10.4.2</div>
                </div>

                <div style={{ display: 'flex', gap: '40px' }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '10px', color: '#ffb700' }}>LOCATION</div>
                        <div>NEW YORK, US</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '10px', color: '#ffb700' }}>TIME</div>
                        <div>{time.toLocaleTimeString()}</div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div style={{ fontSize: '12px', opacity: 0.6, maxWidth: '300px' }}>
                    &gt; INITIALIZING NEURAL LINK... <br />
                    &gt; ESTABLISHING SECURE CONNECTION... <br />
                    &gt; 39% PROCESSING POWER ALLOCATED
                </div>

                <div style={{
                    display: 'flex',
                    gap: '5px',
                    alignItems: 'center'
                }}>
                    <div style={{ width: '10px', height: '10px', background: '#00F0FF', borderRadius: '50%', boxShadow: '0 0 10px #00F0FF' }} />
                    <span style={{ fontWeight: 600 }}>SYSTEM ONLINE</span>
                </div>
            </div>

            {/* Decorative corners */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100px', height: '100px', borderTop: '2px solid #00F0FF', borderLeft: '2px solid #00F0FF' }} />
            <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', borderTop: '2px solid #00F0FF', borderRight: '2px solid #00F0FF' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100px', height: '100px', borderBottom: '2px solid #00F0FF', borderLeft: '2px solid #00F0FF' }} />
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: '100px', height: '100px', borderBottom: '2px solid #00F0FF', borderRight: '2px solid #00F0FF' }} />
        </div>
    )
}
