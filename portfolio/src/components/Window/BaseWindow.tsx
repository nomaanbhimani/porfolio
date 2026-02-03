import { useRef } from 'react'
import { useDrag } from '@use-gesture/react'
import { useWindowManager } from '../../managers/WindowManager'
import { WindowData } from '../../types/Window'
import '../../styles/windows.scss'

interface BaseWindowProps {
    window: WindowData
    children?: React.ReactNode
}

export function BaseWindow({ window, children }: BaseWindowProps) {
    const {
        closeWindow,
        focusWindow,
        minimizeWindow,
        updateWindowPosition,
        resizeWindow
    } = useWindowManager()

    const windowRef = useRef<HTMLDivElement>(null)

    // Drag functionality for Moving with Flick-to-Minimize
    const bindMove = useDrag(({ offset: [x, y], first, last, velocity: [vx, vy] }) => {
        if (first) {
            focusWindow(window.id)
        }
        updateWindowPosition(window.id, { x, y })

        // FLICK DETECTION: If velocity is high and user releases
        if (last) {
            const v = Math.sqrt(vx * vx + vy * vy)
            const screenW = globalThis.window.innerWidth
            const screenH = globalThis.window.innerHeight

            if (v > 0.5) { // Threshold for flick

                // Predict where the window is heading with generous multiplier
                const projectedX = x + (vx * 150)
                const projectedY = y + (vy * 150)

                // Relaxed Center Check (20% to 80% of screen)
                const isCenterFlick =
                    projectedX > screenW * 0.2 && projectedX < screenW * 0.8 &&
                    projectedY > screenH * 0.2 && projectedY < screenH * 0.8

                // Also confirm it's NOT heading definitively out (redundant but safe)
                const isNotCorner = !(projectedX < 100 || projectedX > screenW - 100 || projectedY < 100 || projectedY > screenH - 100)

                if (isCenterFlick && isNotCorner) {
                    // RESTORE TO DEFAULT LARGE SIZE
                    resizeWindow(window.id, { width: 800, height: 600 })
                    // Center it
                    updateWindowPosition(window.id, {
                        x: (screenW - 800) / 2,
                        y: (screenH - 600) / 2
                    })
                } else {
                    // SNAP TO CORNER & SHRINK
                    const padding = 20
                    const smallW = 320
                    const smallH = 240

                    const targetX = vx > 0 ? screenW - smallW - padding : padding
                    const targetY = vy > 0 ? screenH - smallH - padding : padding

                    resizeWindow(window.id, { width: smallW, height: smallH })
                    updateWindowPosition(window.id, { x: targetX, y: targetY })
                }
            }
        }
    }, {
        from: () => [window.position.x, window.position.y],
        // Ensure header (with close button) always stays visible
        bounds: {
            left: -window.size.width + 100,
            top: 0,
            right: globalThis.window.innerWidth - 60,
            bottom: globalThis.window.innerHeight - 50
        }
    })

    // Drag functionality for Resizing
    const bindResize = useDrag(({ offset: [width, height], first }) => {
        if (first) {
            focusWindow(window.id)
        }
        resizeWindow(window.id, { width, height })
    }, {
        from: () => [window.size.width, window.size.height],
        bounds: { left: 300, top: 200, right: 1920, bottom: 1080 } // Min/Max limits
    })

    return (
        <div
            ref={windowRef}
            className={`jarvis-window ${window.isFocused ? 'focused' : ''} ${window.isMinimized ? 'minimized' : ''}`}
            style={{
                left: window.position.x,
                top: window.position.y,
                width: window.size.width,
                height: window.size.height,
                zIndex: window.zIndex
            }}
            onMouseDown={() => focusWindow(window.id)}
        >
            {/* Decorative Borders */}
            < div className="window-decorations" >
                <div className="bottom-decor">
                    <div className="decor-line" />
                    <div className="decor-line" />
                </div>
            </div >

            {/* Window Header (Title Bar) */}
            < div className="window-header" {...(bindMove() as any)}>
                <div className="header-left">
                    <div className="window-id-tag">MONITOR {window.zIndex}</div>
                    <div className="window-title">
                        <span className="title-decoration">:</span>
                        <span>{window.title}</span>
                    </div>
                </div>

                <div className="window-controls">
                    <button
                        className="control-btn minimize"
                        onClick={(e) => {
                            e.stopPropagation()
                            minimizeWindow(window.id)
                        }}
                    >
                        _
                    </button>
                    <button
                        className="control-btn close"
                        onClick={(e) => {
                            e.stopPropagation()
                            closeWindow(window.id)
                        }}
                    >
                        X
                    </button>
                </div>
            </div >

            {/* Sub-Header (Technical Details) */}
            < div className="window-subheader" >
                <div className="subheader-left">SEARCHING_ARCHIVES...</div>
                <div className="subheader-right">
                    {new Date().toLocaleTimeString('en-US', { hour12: false })}
                </div>
            </div >

            {/* Window Content */}
            < div className="window-content" >
                {children || (
                    // Default content if no children provided (for testing)
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <h3 style={{ color: '#00F0FF', borderBottom: '1px solid #00F0FF', paddingBottom: '10px' }}>
                // SYSTEM_INITIALIZED
                        </h3>
                        <p style={{ color: '#fff', fontSize: '14px', lineHeight: '1.6' }}>
                            AWAITING INPUT...<br />
                            CORE SYSTEMS: ONLINE<br />
                            VOICE MODULE: STANDBY
                        </p>
                        <div style={{
                            marginTop: 'auto',
                            border: '1px solid rgba(0,240,255,0.3)',
                            padding: '10px',
                            fontSize: '10px',
                            fontFamily: 'monospace'
                        }}>
                            ID: {window.id.substring(0, 12)}...<br />
                            TYPE: {window.type.toUpperCase()}<br />
                            MEM_ADDR: 0x{Math.floor(Math.random() * 1000000).toString(16).toUpperCase()}
                        </div>
                    </div>
                )}
            </div >

            {/* Scanline Effect */}
            < div className="scanline-overlay" />

            {/* Resize Handle (Bottom Right) - Enhanced Visibility */}
            < div
                className="resize-handle"
                {...(bindResize() as any)}
                style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '30px', // Larger area
                    height: '30px',
                    cursor: 'nwse-resize',
                    zIndex: 20,
                    background: 'linear-gradient(135deg, transparent 45%, #00F0FF 45%, #00F0FF 55%, transparent 55%, transparent 65%, #00F0FF 65%, #00F0FF 75%, transparent 75%)', // Striped gripping texture
                    borderBottomRightRadius: '2px', // Match boxy aesthetics
                    opacity: 1
                }}
            />
        </div >
    )
}
