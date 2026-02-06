import { BaseWindow } from './BaseWindow'
import { WindowData } from '../../types/Window'
import { useWindowManager } from '../../managers/WindowManager'

interface ProjectsListWindowProps {
    window: WindowData
}

// Noman's actual projects from CV
const PROJECTS = [
    {
        id: 'p1',
        name: 'LegalMind',
        description: 'AI-Powered Legal Document Analyzer with fine-tuned InLegalBERT, custom QA architecture, and RAG pipeline. 40% better accuracy on legal documents.',
        tech: ['Python', 'InLegalBERT', 'RAG', 'Streamlit'],
        status: 'DEPLOYED',
        url: 'https://legal-rag-wqwf.onrender.com'
    },
    {
        id: 'p2',
        name: 'Sentinal',
        description: 'AI image detector using multi-layer forensic analysis - spectral analysis (Gram Matrix, DCT) and \"Council of Experts\" ensemble voting system.',
        tech: ['Python', 'ReportLab', 'ML'],
        status: 'DEPLOYED',
        url: 'https://nomanbhimani-sentinel.hf.space'
    },
    {
        id: 'p3',
        name: 'Fitness & Nutrition AI',
        description: 'AI-driven personalized fitness and nutrition recommendation system with Flask backend and ML-powered recommendations.',
        tech: ['Flask', 'HTML/CSS/JS', 'ML'],
        status: 'DEPLOYED',
        url: 'https://ai-driven-personalized-fitness-and.onrender.com'
    },
    {
        id: 'p4',
        name: 'PathoInsight',
        description: 'RAG system processing 10K+ pathology documents. Evaluated 3 embedding models, achieved 31% precision improvement and 89% relevance score.',
        tech: ['RAG', 'Mistral', 'Embeddings'],
        status: 'COMPLETE',
        github: 'https://github.com/nomaanbhimani/PathoInsight-An-Pathology-Rag-app-'
    },
    {
        id: 'p5',
        name: 'MCU Analytics',
        description: 'Interactive Power BI dashboard analyzing 30+ films with 50K+ data points. Time-series forecasting and cost-revenue analysis across $15B+ franchise.',
        tech: ['Power BI', 'Data Analysis'],
        status: 'COMPLETE',
        github: 'https://github.com/nomaanbhimani/MARVELytics-Power-BI-Dashboard'
    },
    {
        id: 'p6',
        name: 'J.A.R.V.I.S. Portfolio',
        description: 'This portfolio! Voice-activated Iron Man inspired interface with 3D holographic background, window management, and AI assistant.',
        tech: ['React', 'Three.js', 'TypeScript'],
        status: 'ONLINE'
    }
]

export function ProjectsListWindow({ window }: ProjectsListWindowProps) {
    const { createWindow } = useWindowManager()

    const handleOpenProject = (project: typeof PROJECTS[0]) => {
        // Always open project detail window (with launch button for deployed projects)
        createWindow({
            type: 'project-detail',
            title: `PROJECT // ${project.name}`,
            content: project,
            position: { x: Math.max(50, (globalThis.window.innerWidth - 600) / 2), y: 80 },
            size: { width: 600, height: 500 }
        })
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DEPLOYED': return '#00FF88'
            case 'ONLINE': return '#00F0FF'
            case 'COMPLETE': return '#FFB700'
            default: return '#666'
        }
    }

    return (
        <BaseWindow window={window}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                {PROJECTS.map((p, i) => (
                    <div
                        key={p.id}
                        onClick={() => handleOpenProject(p)}
                        className="project-card"
                        style={{
                            padding: '15px',
                            border: '1px solid rgba(0, 240, 255, 0.2)',
                            background: 'rgba(0, 240, 255, 0.05)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            animation: `fadeIn 0.3s ease-out ${i * 0.1}s backwards`,
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(0, 240, 255, 0.15)'
                            e.currentTarget.style.borderColor = '#00F0FF'
                            e.currentTarget.style.transform = 'translateY(-2px)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(0, 240, 255, 0.05)'
                            e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.2)'
                            e.currentTarget.style.transform = 'translateY(0)'
                        }}
                    >
                        {/* Project Status Indicator */}
                        <div style={{
                            position: 'absolute',
                            top: '0',
                            right: '0',
                            padding: '2px 8px',
                            background: getStatusColor(p.status),
                            color: '#000',
                            fontSize: '9px',
                            fontWeight: 'bold'
                        }}>
                            {p.status}
                        </div>

                        <div style={{
                            width: '100%',
                            height: '60px',
                            background: 'rgba(0,0,0,0.3)',
                            marginBottom: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderBottom: `2px solid ${getStatusColor(p.status)}40`
                        }}>
                            <span style={{ fontSize: '24px', opacity: 0.5 }}>
                                {p.url ? '🌐' : '⚡'}
                            </span>
                        </div>

                        <h3 style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#00F0FF' }}>{p.name}</h3>
                        <p style={{ margin: '0 0 10px 0', fontSize: '10px', color: '#aaa', lineHeight: '1.4' }}>{p.description}</p>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                            {p.tech.map(t => (
                                <span key={t} style={{ fontSize: '9px', padding: '2px 5px', border: '1px solid rgba(255,255,255,0.2)', color: '#888' }}>
                                    {t}
                                </span>
                            ))}
                        </div>

                        {(p.url || (p as any).github) && (
                            <div style={{
                                marginTop: '10px',
                                fontSize: '10px',
                                color: p.url ? '#00FF88' : '#00F0FF',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                            }}>
                                {p.url ? '🚀 Click for details + launch' : '📂 Click for details + GitHub'}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <style>{`
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
        </BaseWindow>
    )
}

