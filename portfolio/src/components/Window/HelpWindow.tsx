import { BaseWindow } from './BaseWindow'
import { WindowData } from '../../types/Window'

interface HelpWindowProps {
    window: WindowData
}

const COMMAND_CATEGORIES = [
    {
        category: "SYSTEM COMMANDS",
        color: '#00F0FF',
        commands: [
            { cmd: "Wake up / Hey Jarvis", desc: "Activate Systems" },
            { cmd: "Go to sleep / Shut down", desc: "Deactivate" },
            { cmd: "Close all / Clear", desc: "Clear Workspace" }
        ]
    },
    {
        category: "NAVIGATION",
        color: '#00FF88',
        commands: [
            { cmd: "Show Profile", desc: "Open Bio" },
            { cmd: "Show Projects", desc: "Project List" },
            { cmd: "Show Skills", desc: "Tech Stats" },
            { cmd: "Show Contact", desc: "Contact Info" }
        ]
    },
    {
        category: "SOCIAL & REPOS",
        color: '#FF6B6B',
        commands: [
            { cmd: "Open GitHub / Git", desc: "Repositories" },
            { cmd: "Open LinkedIn", desc: "Professional Profile" }
        ]
    },
    {
        category: "BROWSER & MEDIA",
        color: '#FF0000',
        commands: [
            { cmd: "Open Chrome / Browser", desc: "Web Browser" },
            { cmd: "Search Google for [X]", desc: "Google Search" },
            { cmd: "Open YouTube", desc: "Media Player" },
            { cmd: "YouTube search [X]", desc: "Video Search" }
        ]
    },
    {
        category: "AI ASSISTANT",
        color: '#A855F7',
        commands: [
            { cmd: "Open Chat / Gemini", desc: "AI Terminal" },
            { cmd: "Ask Gemini [query]", desc: "Direct Query" }
        ]
    },
    {
        category: "WINDOW CONTROL",
        color: '#ffb700',
        commands: [
            { cmd: "Arrange Windows", desc: "Tile Layout" },
            { cmd: "Bigger / Smaller", desc: "Resize Window" },
            { cmd: "Minimize", desc: "Hide Window" }
        ]
    },
    {
        category: "KEYBOARD",
        color: '#888',
        commands: [
            { cmd: "Esc", desc: "Minimize" },
            { cmd: "Ctrl + W", desc: "Close" },
            { cmd: "Ctrl + Shift + A", desc: "Close All" }
        ]
    },
    {
        category: "SECRET",
        color: '#0096FF',
        commands: [
            { cmd: "Protocol Arc", desc: "🔮 ???" }
        ]
    }
]

export function HelpWindow({ window }: HelpWindowProps) {
    return (
        <BaseWindow window={window}>
            <div style={{
                height: '100%',
                overflowY: 'auto',
                paddingRight: '5px',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '15px'
            }}>
                {COMMAND_CATEGORIES.map((cat, i) => (
                    <div key={i} style={{
                        background: 'rgba(0, 0, 0, 0.3)',
                        borderRadius: '4px',
                        padding: '12px',
                        border: `1px solid ${cat.color}30`
                    }}>
                        <h3 style={{
                            color: cat.color,
                            borderBottom: `1px solid ${cat.color}40`,
                            paddingBottom: '6px',
                            marginBottom: '10px',
                            fontSize: '10px',
                            letterSpacing: '1px',
                            fontFamily: 'Orbitron'
                        }}>
                            {cat.category}
                        </h3>
                        <div style={{ display: 'grid', gap: '5px' }}>
                            {cat.commands.map((c, j) => (
                                <div key={j} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    fontFamily: 'Share Tech Mono',
                                    fontSize: '11px',
                                    padding: '4px 6px',
                                    background: `${cat.color}08`,
                                    borderLeft: `2px solid ${cat.color}40`
                                }}>
                                    <span style={{ color: cat.color }}>{c.cmd}</span>
                                    <span style={{ color: '#666', fontSize: '10px' }}>{c.desc}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </BaseWindow>
    )
}
