import { BaseWindow } from './BaseWindow'
import { WindowData } from '../../types/Window'
import { useState } from 'react'

interface ProjectDetailWindowProps {
    window: WindowData
}

export function ProjectDetailWindow({ window: windowData }: ProjectDetailWindowProps) {
    const project = windowData.content || {}
    const [activeTab, setActiveTab] = useState<'overview' | 'tech' | 'logs'>('overview')

    const handleLaunch = () => {
        if (project.url) {
            globalThis.window.open(project.url, '_blank')
        } else if (project.github) {
            globalThis.window.open(project.github, '_blank')
        } else {
            // Fallback to guessed GitHub URL
            globalThis.window.open(`https://github.com/nomaanbhimani/${project.name?.toLowerCase().replace(/\s+/g, '-')}`, '_blank')
        }
    }

    return (
        <BaseWindow window={windowData}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '15px' }}>

                {/* Header with Status and Launch Button */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '15px',
                    background: 'linear-gradient(90deg, rgba(0,240,255,0.1), transparent)',
                    borderBottom: '1px solid rgba(0,240,255,0.3)'
                }}>
                    <div>
                        <h1 style={{
                            margin: 0,
                            fontSize: '22px',
                            fontFamily: 'Rajdhani',
                            color: '#00F0FF',
                            textShadow: '0 0 10px rgba(0,240,255,0.5)'
                        }}>
                            {project.name || 'UNKNOWN PROJECT'}
                        </h1>
                        <div style={{
                            display: 'inline-block',
                            marginTop: '8px',
                            padding: '3px 10px',
                            background: project.status === 'DEPLOYED' ? '#00FF88' : project.status === 'ONLINE' ? '#00F0FF' : '#FFB700',
                            color: '#000',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            fontFamily: 'Orbitron'
                        }}>
                            {project.status || 'STATUS UNKNOWN'}
                        </div>
                    </div>

                    {/* Big Launch Button */}
                    {project.url && (
                        <button
                            onClick={handleLaunch}
                            style={{
                                background: 'linear-gradient(135deg, #00FF88, #00CC66)',
                                border: 'none',
                                padding: '15px 30px',
                                color: '#000',
                                fontFamily: 'Orbitron',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                boxShadow: '0 0 20px rgba(0,255,136,0.4)',
                                transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)'
                                e.currentTarget.style.boxShadow = '0 0 30px rgba(0,255,136,0.6)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)'
                                e.currentTarget.style.boxShadow = '0 0 20px rgba(0,255,136,0.4)'
                            }}
                        >
                            🚀 LAUNCH APP
                        </button>
                    )}
                </div>

                {/* Navigation Tabs */}
                <div style={{ display: 'flex', gap: '2px', borderBottom: '1px solid rgba(0, 240, 255, 0.3)' }}>
                    {['overview', 'tech', 'logs'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            style={{
                                background: activeTab === tab ? 'rgba(0, 240, 255, 0.2)' : 'transparent',
                                color: activeTab === tab ? '#00F0FF' : 'rgba(255,255,255,0.6)',
                                border: 'none',
                                padding: '8px 20px',
                                fontFamily: 'Share Tech Mono',
                                cursor: 'pointer',
                                borderTop: activeTab === tab ? '2px solid #00F0FF' : '2px solid transparent',
                                transition: 'all 0.2s'
                            }}
                        >
                            {tab.toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div style={{ flex: 1, overflowY: 'auto', paddingRight: '10px' }}>

                    {activeTab === 'overview' && (
                        <div style={{ animation: 'fadeIn 0.3s' }}>
                            <h2 style={{ fontFamily: 'Rajdhani', fontSize: '18px', margin: '0 0 15px 0', color: '#FFB700' }}>
                                // PROJECT_DESCRIPTION
                            </h2>
                            <p style={{ fontFamily: 'Share Tech Mono', lineHeight: '1.8', color: '#ccc', fontSize: '13px' }}>
                                {project.description || 'Classified project data. Authorization required for full access.'}
                            </p>

                            {/* Tech Tags in Overview */}
                            <div style={{ marginTop: '20px' }}>
                                <h3 style={{ fontSize: '12px', color: '#00F0FF', marginBottom: '10px' }}>TECHNOLOGIES USED:</h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {(project.tech || ['UNKNOWN']).map((tech: string) => (
                                        <span key={tech} style={{
                                            padding: '5px 12px',
                                            background: 'rgba(0,240,255,0.1)',
                                            border: '1px solid rgba(0,240,255,0.3)',
                                            fontSize: '11px',
                                            color: '#00F0FF'
                                        }}>
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'tech' && (
                        <div style={{ animation: 'fadeIn 0.3s' }}>
                            <h3 style={{ color: '#ffb700', fontSize: '14px', marginBottom: '15px' }}>// TECH_STACK</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                                {(project.tech || ['UNKNOWN']).map((tech: string) => (
                                    <div key={tech} style={{
                                        background: 'rgba(0, 240, 255, 0.05)',
                                        padding: '15px',
                                        borderLeft: '3px solid #00F0FF',
                                        fontFamily: 'Share Tech Mono',
                                        fontSize: '14px'
                                    }}>
                                        {tech}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'logs' && (
                        <div style={{ animation: 'fadeIn 0.3s', fontFamily: 'monospace', fontSize: '12px', color: '#0f0' }}>
                            <div style={{ marginBottom: '5px' }}>[19:42:01] INITIATING BOOT SEQUENCE...</div>
                            <div style={{ marginBottom: '5px' }}>[19:42:03] CONNECTING TO RENDER.COM... OK</div>
                            <div style={{ marginBottom: '5px' }}>[19:42:05] DOWNLOADING ASSETS... 100%</div>
                            <div style={{ marginBottom: '5px' }}>[19:42:08] COMPILING SOURCE CODE... OK</div>
                            <div style={{ marginBottom: '5px' }}>[19:42:10] SYSTEM READY.</div>
                            <div style={{ marginBottom: '5px', color: '#00FF88' }}>[19:42:12] APPLICATION DEPLOYED SUCCESSFULLY ✓</div>
                        </div>
                    )}

                </div>

                {/* Footer Actions */}
                <div style={{ borderTop: '1px solid rgba(0, 240, 255, 0.2)', paddingTop: '15px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button
                        onClick={handleLaunch}
                        style={{
                            background: project.url ? '#00FF88' : '#00F0FF',
                            border: 'none',
                            color: '#000',
                            padding: '12px 25px',
                            fontFamily: 'Orbitron',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    >
                        {project.url ? '🚀 LAUNCH LIVE APP' : '📂 VIEW ON GITHUB'}
                    </button>
                </div>

            </div>
            <style>{`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
        </BaseWindow>
    )
}
