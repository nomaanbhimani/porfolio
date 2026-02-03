import { BaseWindow } from './BaseWindow'
import { WindowData } from '../../types/Window'

interface LinkedInWindowProps {
    window: WindowData
}

// Profile data - Noman Bhimani's LinkedIn info
const PROFILE_DATA = {
    name: 'Noman I. Bhimani',
    headline: 'Computer Engineering Student | Data Scientist | AI/ML Developer',
    location: 'Nashik, Maharashtra',
    profileUrl: 'https://www.linkedin.com/in/noman-bhimani-3063b7294',
    about: 'Computer Engineering student building production AI systems that solve complex real-world problems. Proven track record shipping end-to-end applications combining fine-tuned models, custom neural architectures, and RAG systems. Strong focus on bridging cutting-edge research with practical deployment.',
    experience: [
        {
            title: 'Data Science Intern',
            company: 'Netleap IT Training and Solution',
            duration: 'Dec 2024 – Feb 2025',
            description: 'End-to-end Python data science projects, ML algorithms, predictive modeling'
        },
        {
            title: 'Google Student Ambassador',
            company: 'Google',
            duration: '2024',
            description: 'Organized AI sessions for 200+ classmates with hands-on coding curriculum'
        }
    ],
    education: {
        school: 'GCOERC',
        degree: 'B.E. Computer Engineering',
        year: 'Expected 2026'
    },
    skills: ['Python', 'Machine Learning', 'Data Science', 'RAG Systems', 'Scikit-learn', 'Pandas', 'Power BI', 'Streamlit']
}

export function LinkedInWindow({ window: windowData }: LinkedInWindowProps) {
    const openLinkedIn = () => {
        globalThis.window.open(PROFILE_DATA.profileUrl, '_blank')
    }

    return (
        <BaseWindow window={windowData}>
            <div style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                overflow: 'auto',
                padding: '5px'
            }}>
                {/* Header Card with improved design */}
                <div style={{
                    background: 'linear-gradient(135deg, rgba(0, 119, 181, 0.25) 0%, rgba(0, 60, 100, 0.4) 100%)',
                    border: '1px solid rgba(0, 119, 181, 0.4)',
                    borderRadius: '4px',
                    padding: '20px',
                    position: 'relative'
                }}>
                    {/* LinkedIn Logo */}
                    <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: '#0077B5',
                        padding: '4px 8px',
                        borderRadius: '3px',
                        fontSize: '14px',
                        color: '#fff',
                        fontWeight: 'bold'
                    }}>
                        in
                    </div>

                    <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                        {/* Profile Avatar */}
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #0077B5, #00A0DC)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '28px',
                            fontWeight: 'bold',
                            color: '#fff',
                            border: '3px solid rgba(255,255,255,0.2)',
                            flexShrink: 0
                        }}>
                            NB
                        </div>

                        <div style={{ flex: 1 }}>
                            <h2 style={{
                                fontSize: '20px',
                                fontFamily: 'Rajdhani, sans-serif',
                                fontWeight: 700,
                                margin: '0 0 6px 0',
                                color: '#fff'
                            }}>
                                {PROFILE_DATA.name}
                            </h2>

                            <p style={{
                                fontSize: '12px',
                                color: 'rgba(255,255,255,0.85)',
                                margin: '0 0 10px 0',
                                lineHeight: 1.4
                            }}>
                                {PROFILE_DATA.headline}
                            </p>

                            <div style={{
                                display: 'flex',
                                gap: '15px',
                                fontSize: '11px',
                                color: 'rgba(255,255,255,0.6)'
                            }}>
                                <span>📍 {PROFILE_DATA.location}</span>
                                <span>🎓 {PROFILE_DATA.education.school}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* About Section */}
                <div style={{
                    background: 'rgba(0, 0, 0, 0.25)',
                    border: '1px solid rgba(0, 119, 181, 0.25)',
                    borderRadius: '4px',
                    padding: '14px'
                }}>
                    <h3 style={{
                        fontSize: '11px',
                        color: '#0077B5',
                        margin: '0 0 8px 0',
                        fontFamily: 'Orbitron',
                        letterSpacing: '1.5px'
                    }}>
                        ABOUT
                    </h3>
                    <p style={{
                        fontSize: '12px',
                        lineHeight: '1.6',
                        color: 'rgba(255,255,255,0.8)',
                        margin: 0
                    }}>
                        {PROFILE_DATA.about}
                    </p>
                </div>

                {/* Experience Section - Compact */}
                <div style={{
                    background: 'rgba(0, 0, 0, 0.25)',
                    border: '1px solid rgba(0, 119, 181, 0.25)',
                    borderRadius: '4px',
                    padding: '14px'
                }}>
                    <h3 style={{
                        fontSize: '11px',
                        color: '#0077B5',
                        margin: '0 0 12px 0',
                        fontFamily: 'Orbitron',
                        letterSpacing: '1.5px'
                    }}>
                        EXPERIENCE
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {PROFILE_DATA.experience.map((exp, i) => (
                            <div key={i} style={{
                                borderLeft: '2px solid #0077B5',
                                paddingLeft: '10px'
                            }}>
                                <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>
                                    {exp.title}
                                </div>
                                <div style={{ fontSize: '11px', color: '#0077B5' }}>
                                    {exp.company} • {exp.duration}
                                </div>
                                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginTop: '3px' }}>
                                    {exp.description}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Skills Section - Grid */}
                <div style={{
                    background: 'rgba(0, 0, 0, 0.25)',
                    border: '1px solid rgba(0, 119, 181, 0.25)',
                    borderRadius: '4px',
                    padding: '14px'
                }}>
                    <h3 style={{
                        fontSize: '11px',
                        color: '#0077B5',
                        margin: '0 0 10px 0',
                        fontFamily: 'Orbitron',
                        letterSpacing: '1.5px'
                    }}>
                        TOP SKILLS
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {PROFILE_DATA.skills.map((skill, i) => (
                            <span key={i} style={{
                                background: 'rgba(0, 119, 181, 0.2)',
                                border: '1px solid rgba(0, 119, 181, 0.4)',
                                padding: '4px 10px',
                                borderRadius: '12px',
                                fontSize: '10px',
                                color: '#00A0DC'
                            }}>
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Open LinkedIn Button */}
                <button
                    onClick={openLinkedIn}
                    style={{
                        background: 'linear-gradient(135deg, #0077B5, #00A0DC)',
                        border: 'none',
                        padding: '14px 24px',
                        borderRadius: '4px',
                        color: '#fff',
                        fontFamily: 'Orbitron',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        transition: 'all 0.3s',
                        marginTop: 'auto'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.02)'
                        e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 119, 181, 0.5)'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)'
                        e.currentTarget.style.boxShadow = 'none'
                    }}
                >
                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>in</span>
                    OPEN LINKEDIN PROFILE ↗
                </button>
            </div>
        </BaseWindow>
    )
}
