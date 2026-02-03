import { BaseWindow } from './BaseWindow'
import { WindowData } from '../../types/Window'
import { useState, useEffect } from 'react'

interface GitHubWindowProps {
    window: WindowData
}

// Noman's GitHub profile data
const USER_DATA = {
    login: "nomaanbhimani",
    name: "Noman I. Bhimani",
    bio: "AI/ML Developer | Data Science | Building production AI systems that solve real-world problems",
    public_repos: 15,
    followers: 50,
    following: 30,
    avatar_url: "https://github.com/nomaanbhimani.png"
}

// Noman's project repositories (based on CV)
const REPOS = [
    { id: 1, name: "legal-rag", description: "AI-Powered Legal Document Analyzer with fine-tuned InLegalBERT, custom QA architecture, and RAG pipeline.", language: "Python", stargazers_count: 25, url: "https://legal-rag-wqwf.onrender.com" },
    { id: 2, name: "ai-img-detector", description: "Sentinal - Multi-layer forensic analysis system to detect AI-generated images using spectral analysis.", language: "Python", stargazers_count: 18, url: "https://ai-img-detector.onrender.com" },
    { id: 3, name: "fitness-nutrition-ai", description: "AI-driven personalized fitness and nutrition recommendation system.", language: "Python", stargazers_count: 12, url: "https://ai-driven-personalized-fitness-and.onrender.com" },
    { id: 4, name: "pathoinsight", description: "RAG system processing 10K+ pathology documents with 89% relevance score.", language: "Python", stargazers_count: 15 },
    { id: 5, name: "mcu-analytics", description: "Power BI dashboard analyzing 30+ MCU films with 50K+ data points.", language: "PowerBI", stargazers_count: 8 },
    { id: 6, name: "jarvis-portfolio", description: "This portfolio! Voice-activated Iron Man inspired interface.", language: "TypeScript", stargazers_count: 10 }
]

export function GitHubWindow({ window: windowData }: GitHubWindowProps) {
    const [user] = useState(USER_DATA)
    const [repos] = useState(REPOS)

    const openRepo = (repo: typeof REPOS[0]) => {
        if (repo.url) {
            globalThis.window.open(repo.url, '_blank')
        } else {
            globalThis.window.open(`https://github.com/nomaanbhimani/${repo.name}`, '_blank')
        }
    }

    return (
        <BaseWindow window={windowData}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

                {/* User Header */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '20px',
                    padding: '20px', borderBottom: '1px solid rgba(0, 240, 255, 0.2)',
                    background: 'linear-gradient(90deg, rgba(0,240,255,0.05), transparent)'
                }}>
                    <div style={{
                        width: '60px', height: '60px', borderRadius: '50%', overflow: 'hidden',
                        border: '2px solid #00F0FF', boxShadow: '0 0 15px rgba(0,240,255,0.5)'
                    }}>
                        <img src={user.avatar_url} alt="Profile" style={{ width: '100%', height: '100%' }} />
                    </div>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '24px', fontFamily: 'Rajdhani', color: '#fff' }}>{user.name}</h2>
                        <div style={{ fontSize: '12px', fontFamily: 'Share Tech Mono', color: '#00F0FF' }}>@{user.login}</div>
                        <div style={{ marginTop: '5px', fontSize: '11px', color: '#aaa', maxWidth: '400px' }}>{user.bio}</div>
                    </div>
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '20px', fontFamily: 'Share Tech Mono', fontSize: '12px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ color: '#00F0FF', fontSize: '16px' }}>{user.public_repos}</div>
                            <div style={{ color: '#666' }}>REPOS</div>
                        </div>
                    </div>
                </div>

                {/* Repos Grid */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                    <h3 style={{ fontSize: '14px', color: '#ffb700', borderBottom: '1px solid #ffb700', paddingBottom: '5px', marginBottom: '15px', width: 'max-content' }}>
                        // PUBLIC_REPOSITORIES
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '15px' }}>
                        {repos.map((repo, i) => (
                            <div key={repo.id} style={{
                                background: 'rgba(0,0,0,0.3)',
                                border: '1px solid rgba(0,240,255,0.1)',
                                padding: '15px',
                                display: 'flex', flexDirection: 'column',
                                gap: '10px',
                                animation: `slideIn 0.3s ease-out ${i * 0.1}s backwards`,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                                onClick={() => openRepo(repo)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#00F0FF'
                                    e.currentTarget.style.background = 'rgba(0,240,255,0.1)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(0,240,255,0.1)'
                                    e.currentTarget.style.background = 'rgba(0,0,0,0.3)'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <span style={{ color: '#00F0FF', fontWeight: 'bold', fontSize: '13px' }}>{repo.name}</span>
                                    <span style={{ fontSize: '9px', color: '#ffb700', border: '1px solid #ffb700', padding: '2px 4px' }}>{repo.language}</span>
                                </div>
                                <p style={{ fontSize: '10px', color: '#aaa', margin: 0, lineHeight: '1.4', flex: 1 }}>{repo.description}</p>
                                <div style={{ fontSize: '10px', color: '#666', display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <span>★ {repo.stargazers_count}</span>
                                    {repo.url && <span style={{ color: '#00FF88' }}>🌐 LIVE</span>}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Open GitHub Profile Button */}
                    <button
                        onClick={() => globalThis.window.open('https://github.com/nomaanbhimani', '_blank')}
                        style={{
                            marginTop: '20px',
                            background: 'linear-gradient(135deg, rgba(0,240,255,0.2), rgba(0,100,150,0.3))',
                            border: '1px solid #00F0FF',
                            padding: '12px 24px',
                            color: '#00F0FF',
                            fontFamily: 'Orbitron',
                            fontSize: '12px',
                            cursor: 'pointer',
                            width: '100%',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(0,240,255,0.3)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,240,255,0.2), rgba(0,100,150,0.3))'
                        }}
                    >
                        OPEN FULL GITHUB PROFILE ↗
                    </button>
                </div>
            </div>
            <style>{`@keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }`}</style>
        </BaseWindow>
    )
}
