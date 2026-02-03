import { BaseWindow } from './BaseWindow'
import { WindowData } from '../../types/Window'

interface SkillsWindowProps {
    window: WindowData
}

export function SkillsWindow({ window }: SkillsWindowProps) {
    const skills = [
        { category: 'PROGRAMMING', items: ['Python', 'C++', 'SQL', 'Java'], color: '#00F0FF' },
        { category: 'AI / ML', items: ['Machine Learning', 'Deep Learning', 'RAG Systems', 'NLP', 'Hugging Face'], color: '#A855F7' },
        { category: 'DATA SCIENCE', items: ['Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Scikit-learn', 'Predictive Modeling'], color: '#00FF88' },
        { category: 'TOOLS', items: ['VS Code', 'Jupyter Notebook', 'Git', 'GitHub', 'Power BI', 'Streamlit', 'MySQL Workbench'], color: '#FFB700' }
    ]

    return (
        <BaseWindow window={window}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', height: '100%', alignContent: 'start' }}>
                {skills.map((skillGroup, i) => (
                    <div key={i} style={{
                        background: 'rgba(0, 20, 30, 0.3)',
                        border: `1px solid ${skillGroup.color}40`,
                        padding: '15px'
                    }}>
                        <h3 style={{
                            margin: '0 0 15px 0',
                            color: skillGroup.color,
                            fontSize: '14px',
                            borderBottom: `1px solid ${skillGroup.color}40`,
                            paddingBottom: '5px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontFamily: 'Orbitron'
                        }}>
                            {skillGroup.category}
                            <span style={{ fontSize: '10px', opacity: 0.5 }}>SYS.0{i + 1}</span>
                        </h3>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {skillGroup.items.map(item => (
                                <div key={item} style={{
                                    fontSize: '11px',
                                    color: '#fff',
                                    background: `${skillGroup.color}15`,
                                    padding: '5px 10px',
                                    borderLeft: `2px solid ${skillGroup.color}80`,
                                    transition: 'all 0.2s'
                                }}>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </BaseWindow>
    )
}
