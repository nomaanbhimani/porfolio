import { useState, useMemo, useEffect } from 'react'
import { useWindowManager } from './managers/WindowManager'
import { WindowRenderer } from './components/WindowRenderer'
import { HUDOverlay } from './components/HUDOverlay'
import { HolographicBackground } from './components/3D/HolographicBackground'
import { CommandInput } from './components/CommandInput'
import { Taskbar } from './components/Taskbar'
import { VoiceIndicator } from './components/VoiceIndicator'
import { useJarvisVoice } from './hooks/useJarvisVoice'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { VoiceCommandProcessor } from './commands/CommandMapper'
import { JarvisSpeechSystem } from './systems/JarvisSpeechSystem'
import { sfx } from './managers/SoundManager'
import { SystemLogs } from './components/SystemLogs'
import './styles/windows.scss'

type SystemState = 'sleeping' | 'initializing' | 'active'

function App() {
    const [systemState, setSystemState] = useState<SystemState>('sleeping')
    const [secretMode, setSecretMode] = useState(false)
    const [logs, setLogs] = useState<{ id: string, text: string, timestamp: number }[]>([])

    const { windows, createWindow, closeAllWindows } = useWindowManager()
    const { transcript, startListening, isListening } = useJarvisVoice()

    const jarvis = useMemo(() => new JarvisSpeechSystem(), [])
    const commandProcessor = useMemo(() => new VoiceCommandProcessor(), [])

    const addLog = (text: string) => {
        const newLog = { id: Date.now().toString(), text, timestamp: Date.now() }
        setLogs(prev => [newLog, ...prev].slice(0, 5))
        setTimeout(() => setLogs(prev => prev.filter(l => l.id !== newLog.id)), 4000)
    }

    const speak = async (text: string) => {
        addLog(`JARVIS: ${text}`)
        await jarvis.speakWithAnimation({ text })
    }

    // Pre-warm Render hosted projects (they take 60s+ to cold start)
    useEffect(() => {
        const renderProjects = [
            'https://legal-rag-wqwf.onrender.com',
            'https://ai-img-detector.onrender.com',
            'https://ai-driven-personalized-fitness-and.onrender.com'
        ]

        // Fire off requests to wake up the servers
        renderProjects.forEach(url => {
            fetch(url, { mode: 'no-cors' }).catch(() => {
                // Silently ignore errors - we're just waking up the servers
            })
        })
    }, [])

    const getConstrainedWindowConfig = (requestedW: number, requestedH: number) => {
        // Cap window size to screen dimensions minus padding
        const maxWidth = Math.min(requestedW, window.innerWidth - 80)
        const maxHeight = Math.min(requestedH, window.innerHeight - 150)
        const w = Math.max(300, maxWidth)
        const h = Math.max(200, maxHeight)
        return {
            size: { width: w, height: h },
            position: {
                x: Math.max(20, (window.innerWidth - w) / 2 + (Math.random() * 40 - 20)),
                y: Math.max(60, (window.innerHeight - h) / 2 + (Math.random() * 40 - 20))
            }
        }
    }

    // ============================================
    // EXECUTE COMMAND - Central Command Handler
    // ============================================
    const executeCommand = async (action: string, params?: any) => {
        console.log("Executing:", action, params)
        addLog(`COMMAND: ${action}`)

        switch (action) {
            case 'SYSTEM_WAKE':
                if (systemState === 'sleeping') {
                    setSystemState('initializing')
                    sfx.playSecretMode()
                    setTimeout(async () => {
                        setSystemState('active')
                        sfx.playWindowOpen()
                        addLog("SYSTEMS ONLINE")
                        await speak('Good evening. All systems online.')
                    }, 2500)
                }
                break

            case 'CLOSE_ALL_WINDOWS':
                await speak('Closing all windows.')
                closeAllWindows()
                break

            case 'OPEN_PROFILE_WINDOW':
                await speak('Displaying profile data.')
                createWindow({
                    type: 'profile',
                    title: 'PROFILE // SUMMARY',
                    content: {},
                    ...getConstrainedWindowConfig(700, 500)
                })
                break

            case 'OPEN_PROJECTS_LIST':
                await speak('Accessing project archives.')
                createWindow({
                    type: 'projects-list',
                    title: 'ARCHIVES // PROJECTS',
                    content: {},
                    ...getConstrainedWindowConfig(900, 600)
                })
                break

            case 'OPEN_GITHUB_WINDOW':
                await speak('Accessing secure repositories.')
                createWindow({
                    type: 'github-profile',
                    title: 'GITHUB // REPOSITORIES',
                    content: { username: params?.username || 'yourusername' },
                    ...getConstrainedWindowConfig(700, 500)
                })
                break

            case 'OPEN_EXTERNAL':
                const title = params?.title || 'External Link'
                const url = params?.url || 'https://google.com'
                await speak(`Opening ${title}.`)
                createWindow({
                    type: 'external',
                    title: title.toUpperCase(),
                    content: { url },
                    ...getConstrainedWindowConfig(800, 600)
                })
                break

            case 'OPEN_LINKEDIN_WINDOW':
                await speak('Accessing professional network.')
                createWindow({
                    type: 'linkedin',
                    title: 'LINKEDIN // PROFILE',
                    content: {},
                    ...getConstrainedWindowConfig(550, 600)
                })
                break

            case 'OPEN_YOUTUBE':
                await speak('Loading media interface.')
                createWindow({
                    type: 'youtube',
                    title: 'MEDIA // YOUTUBE',
                    content: {},
                    ...getConstrainedWindowConfig(800, 550)
                })
                break

            case 'OPEN_YOUTUBE_SEARCH':
                const ytQuery = params?.captured?.find((c: string) => c && c.length > 2) || ''
                await speak(`Searching YouTube for ${ytQuery}.`)
                createWindow({
                    type: 'youtube',
                    title: `YOUTUBE // SEARCH`,
                    content: { searchQuery: ytQuery },
                    ...getConstrainedWindowConfig(800, 550)
                })
                break

            case 'OPEN_CHROME':
                await speak('Launching browser.')
                createWindow({
                    type: 'chrome',
                    title: 'CHROME // BROWSER',
                    content: { url: 'https://www.google.com/webhp?igu=1' },
                    ...getConstrainedWindowConfig(900, 600)
                })
                break

            case 'OPEN_CHROME_SEARCH':
                const chromeQuery = params?.captured?.find((c: string) => c && c.length > 2) || ''
                await speak(`Searching for ${chromeQuery}.`)
                createWindow({
                    type: 'chrome',
                    title: `CHROME // SEARCH`,
                    content: { url: `https://www.google.com/search?igu=1&q=${encodeURIComponent(chromeQuery)}` },
                    ...getConstrainedWindowConfig(900, 600)
                })
                break

            case 'OPEN_PROJECT_DETAIL':
                const projectName = params?.captured?.[0]?.toLowerCase()
                const projectsDB = [
                    { id: 'p1', name: 'LegalMind', description: 'AI-Powered Legal Document Analyzer with fine-tuned InLegalBERT, custom QA architecture, and RAG pipeline. 40% better accuracy on legal documents.', tech: ['Python', 'InLegalBERT', 'RAG', 'Streamlit'], status: 'DEPLOYED', url: 'https://legal-rag-wqwf.onrender.com' },
                    { id: 'p2', name: 'Sentinal', description: 'AI image detector using multi-layer forensic analysis - spectral analysis, DCT, and "Council of Experts" ensemble voting system.', tech: ['Python', 'ReportLab', 'ML'], status: 'DEPLOYED', url: 'https://ai-img-detector.onrender.com' },
                    { id: 'p3', name: 'Fitness & Nutrition', description: 'AI-driven personalized fitness and nutrition recommendation system with Flask backend and ML-powered recommendations.', tech: ['Flask', 'HTML/CSS/JS', 'ML'], status: 'DEPLOYED', url: 'https://ai-driven-personalized-fitness-and.onrender.com' },
                    { id: 'p4', name: 'PathoInsight', description: 'RAG system processing 10K+ pathology documents. Evaluated 3 embedding models, achieved 89% relevance score.', tech: ['RAG', 'Embeddings', 'Mistral'], status: 'COMPLETE' },
                    { id: 'p5', name: 'MCU Analytics', description: 'Interactive Power BI dashboard analyzing 30+ films with 50K+ data points and time-series forecasting.', tech: ['Power BI', 'Data Analysis'], status: 'COMPLETE' }
                ]
                const foundProject = projectsDB.find(p => p.name.toLowerCase().includes(projectName || ''))
                if (foundProject) {
                    await speak(`Accessing file: ${foundProject.name}.`)
                    createWindow({
                        type: 'project-detail',
                        title: `PROJECT // ${foundProject.name}`,
                        content: foundProject,
                        ...getConstrainedWindowConfig(800, 600)
                    })
                } else {
                    await speak(`Project not found.`)
                }
                break

            case 'OPEN_SKILLS_WINDOW':
                await speak('Analyzing technical competencies.')
                createWindow({
                    type: 'skills',
                    title: 'SYSTEM // SKILLS',
                    content: {},
                    ...getConstrainedWindowConfig(600, 500)
                })
                break

            case 'OPEN_CONTACT_WINDOW':
                await speak('Opening communication channels.')
                createWindow({
                    type: 'contact',
                    title: 'COMMUNICATION // LINK',
                    content: {},
                    ...getConstrainedWindowConfig(500, 400)
                })
                break

            case 'OPEN_GEMINI_CHAT':
                await speak('Establishing neural link.')
                createWindow({
                    type: 'gemini-chat',
                    title: 'J.A.R.V.I.S. // AI CORE',
                    content: {},
                    ...getConstrainedWindowConfig(500, 600)
                })
                break

            case 'OPEN_GEMINI_WITH_QUERY':
                const geminiQuery = params?.captured?.[0] || ''
                await speak(`Sending to Gemini: ${geminiQuery}`)
                // Open Gemini in new tab with query
                const geminiUrl = `https://gemini.google.com/app?q=${encodeURIComponent(geminiQuery)}`
                globalThis.window.open(geminiUrl, '_blank')
                break

            case 'OPEN_GEMINI_TERMINAL':
                await speak('Opening Gemini terminal.')
                createWindow({
                    type: 'gemini-terminal',
                    title: 'GEMINI // TERMINAL',
                    content: {},
                    ...getConstrainedWindowConfig(600, 550)
                })
                break

            case 'OPEN_HELP_WINDOW':
                await speak('Displaying command protocols.')
                createWindow({
                    type: 'help',
                    title: 'SYSTEM // COMMANDS',
                    content: {},
                    ...getConstrainedWindowConfig(500, 550)
                })
                break

            case 'ACTIVATE_SECRET_MODE':
                if (!secretMode) {
                    await speak('Element synthesis protocol engaged.')
                    setSecretMode(true)
                } else {
                    await speak('Returning to standard display.')
                    setSecretMode(false)
                }
                break

            case 'WINDOW_RESIZE':
                const focusedWindow = windows.find(w => w.isFocused)
                if (focusedWindow) {
                    const scale = params?.scale || 1
                    const newWidth = Math.max(300, focusedWindow.size.width * scale)
                    const newHeight = Math.max(200, focusedWindow.size.height * scale)
                    useWindowManager.getState().resizeWindow(focusedWindow.id, { width: newWidth, height: newHeight })
                    await speak(scale > 1 ? 'Expanding interface.' : 'Compressing interface.')
                }
                break

            case 'WINDOW_MINIMIZE':
                const activeWin = windows.find(w => w.isFocused)
                if (activeWin) {
                    useWindowManager.getState().minimizeWindow(activeWin.id)
                    await speak('Minimizing.')
                }
                break

            case 'ARRANGE_WINDOWS':
                await speak('Organizing workspace.')
                useWindowManager.getState().arrangeWindows()
                break

            case 'SYSTEM_SLEEP':
                await speak('Powering down systems.')
                closeAllWindows()
                setSystemState('sleeping')
                setSecretMode(false)
                break
        }
    }

    // ============================================
    // CRITICAL: Process Voice Transcripts
    // ============================================
    useEffect(() => {
        if (!transcript) return

        console.log('🎤 Voice input received:', transcript)
        console.log('📊 Current system state:', systemState)

        const result = commandProcessor.processCommand(transcript)
        console.log('🔍 Command result:', result)

        // If sleeping, only process wake commands
        if (systemState === 'sleeping') {
            // Check for wake keywords directly as backup
            const lowerTranscript = transcript.toLowerCase()
            const isWakeCommand = result?.action === 'SYSTEM_WAKE' ||
                lowerTranscript.includes('jarvis') ||
                lowerTranscript.includes('wake') ||
                lowerTranscript.includes('hello') ||
                lowerTranscript.includes('start')

            if (isWakeCommand) {
                console.log('✅ Wake command detected while sleeping!')
                addLog(`VOICE: "${transcript}"`)
                executeCommand('SYSTEM_WAKE')
            } else {
                console.log('❌ Non-wake command ignored while sleeping')
            }
            return
        }

        addLog(`VOICE: "${transcript}"`)

        if (result) {
            executeCommand(result.action, result.params)
        } else {
            addLog(`UNRECOGNIZED: "${transcript}"`)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transcript])

    const handleManualStart = () => {
        sfx.playClick()
        startListening()
        executeCommand('SYSTEM_WAKE')
    }

    // Activate keyboard shortcuts
    useKeyboardShortcuts()

    return (
        <div className="app-container" style={{
            width: '100vw',
            height: '100vh',
            background: '#000',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Layer */}
            <HolographicBackground
                secretMode={secretMode}
                initializing={systemState === 'initializing'}
            />

            {/* Secret Mode Overlay */}
            {secretMode && (
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(circle at center, transparent 30%, rgba(0, 150, 255, 0.1) 80%)',
                    pointerEvents: 'none',
                    zIndex: 1
                }} />
            )}

            {/* UI Overlay Layer - Only when active */}
            {systemState === 'active' && <HUDOverlay />}
            {systemState === 'active' && <WindowRenderer />}
            {systemState === 'active' && <SystemLogs logs={logs} />}
            {systemState === 'active' && <Taskbar />}
            {systemState === 'active' && <VoiceIndicator isListening={isListening} />}
            {systemState === 'active' && (
                <CommandInput onCommand={(cmd) => {
                    const result = commandProcessor.processCommand(cmd)
                    if (result) {
                        executeCommand(result.action, result.params)
                    } else {
                        addLog(`Unknown: "${cmd}"`)
                    }
                }} />
            )}

            {/* Simple Boot Screen */}
            {systemState === 'sleeping' && (
                <div
                    onClick={handleManualStart}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: 10000,
                        background: 'rgba(0,0,0,0.85)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                    }}
                >
                    <h1 style={{
                        fontFamily: 'Orbitron',
                        color: '#444',
                        letterSpacing: '8px',
                        margin: '0 0 10px 0',
                        fontSize: '22px'
                    }}>
                        J.A.R.V.I.S.
                    </h1>
                    <p style={{ fontFamily: 'Share Tech Mono', color: '#333', margin: 0, fontSize: '12px' }}>
                        CLICK TO INITIALIZE INTERFACE
                    </p>
                    {isListening && <div style={{ color: 'lime', marginTop: '20px', fontSize: '11px' }}>MIC ACTIVE</div>}

                    {/* Footer info */}
                    <div style={{
                        position: 'absolute',
                        bottom: '30px',
                        fontFamily: 'Share Tech Mono',
                        fontSize: '10px',
                        color: 'rgba(255,255,255,0.15)',
                        textAlign: 'center'
                    }}>
                        <div>NOMAN BHIMANI • DATA SCIENTIST</div>
                    </div>
                </div>
            )}

            {/* Initializing Screen with Progress */}
            {systemState === 'initializing' && (
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 10000,
                    background: 'rgba(0,0,0,0.95)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <h1 style={{
                        fontFamily: 'Orbitron',
                        color: '#00F0FF',
                        letterSpacing: '8px',
                        margin: '0 0 30px 0',
                        fontSize: '24px',
                        animation: 'technical-pulse 1s infinite'
                    }}>
                        INITIALIZING...
                    </h1>

                    {/* Progress bar */}
                    <div style={{
                        width: '300px',
                        height: '4px',
                        background: 'rgba(0,240,255,0.1)',
                        borderRadius: '2px',
                        overflow: 'hidden',
                        marginBottom: '20px'
                    }}>
                        <div style={{
                            height: '100%',
                            background: 'linear-gradient(90deg, #00F0FF, #00FF88)',
                            animation: 'progress-fill 2.5s ease-out forwards',
                            boxShadow: '0 0 10px #00F0FF'
                        }} />
                    </div>

                    {/* Boot messages */}
                    <div style={{
                        fontFamily: 'Share Tech Mono',
                        fontSize: '11px',
                        color: '#00FF88',
                        textAlign: 'left',
                        width: '300px'
                    }}>
                        <div style={{ animation: 'fade-in 0.3s forwards', animationDelay: '0s' }}>✓ CORE SYSTEMS ONLINE</div>
                        <div style={{ animation: 'fade-in 0.3s forwards', animationDelay: '0.5s', opacity: 0 }}>✓ NEURAL INTERFACE ACTIVE</div>
                        <div style={{ animation: 'fade-in 0.3s forwards', animationDelay: '1s', opacity: 0 }}>✓ HOLOGRAPHIC DISPLAY READY</div>
                        <div style={{ animation: 'fade-in 0.3s forwards', animationDelay: '1.5s', opacity: 0 }}>✓ VOICE RECOGNITION ENABLED</div>
                        <div style={{ animation: 'fade-in 0.3s forwards', animationDelay: '2s', opacity: 0 }}>✓ ALL SYSTEMS OPERATIONAL</div>
                    </div>

                    <style>{`
                        @keyframes progress-fill {
                            0% { width: 0%; }
                            100% { width: 100%; }
                        }
                        @keyframes fade-in {
                            0% { opacity: 0; transform: translateX(-10px); }
                            100% { opacity: 1; transform: translateX(0); }
                        }
                        @keyframes technical-pulse {
                            0%, 100% { opacity: 0.8; text-shadow: 0 0 10px rgba(0,240,255,0.5); }
                            50% { opacity: 1; text-shadow: 0 0 20px rgba(0,240,255,0.8); }
                        }
                    `}</style>
                </div>
            )}

            {/* Voice Transcript Debug */}
            {transcript && (
                <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    right: '20px',
                    color: 'rgba(0, 240, 255, 0.8)',
                    fontFamily: 'Share Tech Mono',
                    background: 'rgba(0,0,0,0.8)',
                    padding: '10px',
                    border: '1px solid #00F0FF',
                    zIndex: 10001
                }}>
                    "{transcript}"
                </div>
            )}
        </div>
    )
}

export default App
