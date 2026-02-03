import { BaseWindow } from './BaseWindow'
import { WindowData } from '../../types/Window'

interface ProfileWindowProps {
    window: WindowData
}

export function ProfileWindow({ window }: ProfileWindowProps) {
    return (
        <BaseWindow window={window}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>

                {/* Header Section */}
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', borderBottom: '1px solid rgba(0,240,255,0.2)', paddingBottom: '20px' }}>
                    <div style={{
                        width: '100px', height: '100px',
                        background: 'linear-gradient(135deg, rgba(0,240,255,0.2), rgba(0,100,150,0.3))',
                        border: '2px solid #00F0FF',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 0 20px rgba(0,240,255,0.3)'
                    }}>
                        <span style={{ fontSize: '32px', color: '#00F0FF', fontWeight: 'bold' }}>NB</span>
                    </div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '24px', color: '#fff', textShadow: '0 0 10px #00F0FF' }}>NOMAN I. BHIMANI</h1>
                        <p style={{ margin: '5px 0', color: '#00A8FF' }}>DATA SCIENTIST // AI/ML DEVELOPER</p>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                            <Badge text="PYTHON" />
                            <Badge text="DATA SCIENCE" />
                            <Badge text="ML/AI" />
                            <Badge text="RAG" />
                        </div>
                    </div>
                </div>

                {/* Grid Layout for Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <StatCard label="PROJECTS DEPLOYED" value="5+" />
                    <StatCard label="SPECIALIZATION" value="DATA SCIENCE" />
                    <StatCard label="STATUS" value="B.E STUDENT" active />
                    <StatCard label="GRADUATION" value="JUNE 2026" />
                </div>

                {/* Bio Section */}
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', border: '1px solid rgba(0,240,255,0.1)', flex: 1 }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#FFB700', fontSize: '14px' }}>// MISSION OBJECTIVE</h3>
                    <p style={{ lineHeight: '1.6', fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>
                        Computer Engineering student building production AI systems that solve complex real-world problems.
                        Proven track record shipping end-to-end applications combining fine-tuned models, custom neural architectures, and RAG systems.
                    </p>
                    <br />
                    <p style={{ lineHeight: '1.6', fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>
                        Strong focus on bridging cutting-edge research with practical deployment.
                        Experienced with rapid experimentation evaluating multiple approaches before implementing novel solutions.
                    </p>
                </div>

                {/* Education */}
                <div style={{
                    background: 'rgba(0,240,255,0.05)',
                    padding: '12px',
                    borderLeft: '2px solid #00F0FF',
                    fontSize: '12px'
                }}>
                    <div style={{ color: '#00F0FF', fontWeight: 'bold' }}>Guru Gobind Singh College of Engineering and Research Centre</div>
                    <div style={{ color: '#aaa', marginTop: '4px' }}>B.E. in Computer Engineering • Nashik, Maharashtra</div>
                </div>
            </div>
        </BaseWindow>
    )
}

function Badge({ text }: { text: string }) {
    return (
        <span style={{
            background: 'rgba(0,240,255,0.1)',
            padding: '2px 8px',
            fontSize: '10px',
            border: '1px solid rgba(0,240,255,0.4)',
            color: '#00F0FF'
        }}>
            {text}
        </span>
    )
}

function StatCard({ label, value, active }: { label: string, value: string, active?: boolean }) {
    return (
        <div style={{
            background: 'rgba(0,20,30,0.4)',
            padding: '10px',
            borderLeft: `2px solid ${active ? '#00F0FF' : '#333'}`,
            display: 'flex', flexDirection: 'column'
        }}>
            <span style={{ fontSize: '10px', color: '#666', letterSpacing: '1px' }}>{label}</span>
            <span style={{ fontSize: '18px', color: active ? '#00F0FF' : '#fff', fontWeight: 'bold' }}>{value}</span>
        </div>
    )
}
