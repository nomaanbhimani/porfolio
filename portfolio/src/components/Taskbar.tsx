import { useWindowManager } from '../managers/WindowManager'
import { sfx } from '../managers/SoundManager'

export function Taskbar() {
    const { windows, minimizeWindow, focusWindow } = useWindowManager()
    const minimizedWindows = windows.filter(w => w.isMinimized)

    if (minimizedWindows.length === 0) return null

    const handleRestore = (windowId: string) => {
        sfx.playClick()
        minimizeWindow(windowId) // Toggle minimize off
        focusWindow(windowId)
    }

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '50px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.7))',
            borderTop: '1px solid rgba(0, 240, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 20px',
            gap: '10px',
            zIndex: 9999,
            backdropFilter: 'blur(10px)'
        }}>
            {/* Label */}
            <span style={{
                color: '#444',
                fontFamily: 'Share Tech Mono',
                fontSize: '10px',
                marginRight: '10px'
            }}>
                MINIMIZED:
            </span>

            {/* Minimized Window Pills */}
            {minimizedWindows.map(win => (
                <div
                    key={win.id}
                    onClick={() => handleRestore(win.id)}
                    style={{
                        background: 'rgba(0, 240, 255, 0.1)',
                        border: '1px solid rgba(0, 240, 255, 0.3)',
                        padding: '8px 15px',
                        cursor: 'pointer',
                        fontFamily: 'Share Tech Mono',
                        fontSize: '11px',
                        color: '#00F0FF',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 240, 255, 0.2)'
                        e.currentTarget.style.borderColor = '#00F0FF'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 240, 255, 0.1)'
                        e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.3)'
                    }}
                >
                    <span style={{ opacity: 0.5 }}>▢</span>
                    {win.title.split('//')[0].trim()}
                </div>
            ))}
        </div>
    )
}
