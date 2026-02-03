import { BaseWindow } from './BaseWindow'
import { WindowData } from '../../types/Window'

interface ContactWindowProps {
    window: WindowData
}

const CONTACT_LINKS = [
    { label: 'EMAIL', value: 'nomanbhimani@gmail.com', url: 'mailto:nomanbhimani@gmail.com', icon: '📧' },
    { label: 'GITHUB', value: 'github.com/nomaanbhimani', url: 'https://github.com/nomaanbhimani', icon: '💻' },
    { label: 'LINKEDIN', value: 'Noman Bhimani', url: 'https://www.linkedin.com/in/noman-bhimani-3063b7294', icon: '🔗' }
]

export function ContactWindow({ window: windowData }: ContactWindowProps) {
    return (
        <BaseWindow window={windowData}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', justifyContent: 'center', alignItems: 'center' }}>

                <div style={{
                    width: '80px', height: '80px',
                    borderRadius: '50%',
                    border: '2px dashed #00F0FF',
                    animation: 'spin 10s linear infinite',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{ width: '10px', height: '10px', background: '#00F0FF', borderRadius: '50%' }} />
                </div>

                <h2 style={{ color: '#fff', fontSize: '20px', margin: 0, letterSpacing: '2px' }}>COMMUNICATION CHANNELS</h2>
                <p style={{ color: '#00F0FF', fontSize: '12px', opacity: 0.8 }}>NOMAN I. BHIMANI</p>

                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                    {CONTACT_LINKS.map((link) => (
                        <div
                            key={link.label}
                            style={{
                                background: 'rgba(0, 240, 255, 0.05)',
                                border: '1px solid rgba(0, 240, 255, 0.2)',
                                padding: '12px 15px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onClick={() => globalThis.window.open(link.url, '_blank')}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(0, 240, 255, 0.15)'
                                e.currentTarget.style.borderColor = '#00F0FF'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(0, 240, 255, 0.05)'
                                e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.2)'
                            }}
                        >
                            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '18px' }}>{link.icon}</span>
                                <span style={{ fontWeight: 'bold', color: '#00A8FF' }}>{link.label}</span>
                            </span>
                            <span style={{ color: '#fff', fontFamily: 'Share Tech Mono', fontSize: '12px' }}>{link.value}</span>
                        </div>
                    ))}
                </div>

                <div style={{
                    marginTop: 'auto',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    width: '100%',
                    paddingTop: '10px',
                    textAlign: 'center',
                    fontSize: '10px',
                    color: '#666'
                }}>
                    SECURE CHANNEL ACTIVE • NASHIK, MAHARASHTRA
                </div>
            </div>
        </BaseWindow>
    )
}
