import { BaseWindow } from './BaseWindow'
import { WindowData } from '../../types/Window'
import { useState } from 'react'

interface ChromeWindowProps {
    window: WindowData
}

export function ChromeWindow({ window: windowData }: ChromeWindowProps) {
    const initialUrl = windowData.content?.url || 'https://www.google.com'
    const [url, setUrl] = useState(initialUrl)
    const [inputValue, setInputValue] = useState(initialUrl)

    const handleNavigate = (e: React.FormEvent) => {
        e.preventDefault()
        let targetUrl = inputValue.trim()

        if (!targetUrl) return

        // If not a URL, treat as Google search
        if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
            if (!targetUrl.includes('.')) {
                // It's a search query
                targetUrl = `https://www.google.com/search?igu=1&q=${encodeURIComponent(targetUrl)}`
            } else {
                targetUrl = `https://${targetUrl}`
            }
        }

        setUrl(targetUrl)
    }

    const goHome = () => {
        setUrl('https://www.google.com/webhp?igu=1')
        setInputValue('https://www.google.com')
    }

    return (
        <BaseWindow window={windowData}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '10px' }}>
                {/* URL Bar */}
                <form onSubmit={handleNavigate} style={{ display: 'flex', gap: '8px' }}>
                    <button
                        type="button"
                        onClick={goHome}
                        style={{
                            background: 'rgba(0, 240, 255, 0.1)',
                            border: '1px solid rgba(0, 240, 255, 0.3)',
                            color: '#00F0FF',
                            padding: '8px 12px',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        🏠
                    </button>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Enter URL or search..."
                        style={{
                            flex: 1,
                            background: 'rgba(0, 0, 0, 0.5)',
                            border: '1px solid rgba(0, 240, 255, 0.3)',
                            padding: '8px 12px',
                            color: '#fff',
                            fontFamily: 'Share Tech Mono',
                            fontSize: '12px'
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            background: 'rgba(0, 240, 255, 0.1)',
                            border: '1px solid #00F0FF',
                            color: '#00F0FF',
                            padding: '8px 15px',
                            cursor: 'pointer',
                            fontFamily: 'Share Tech Mono',
                            fontSize: '12px'
                        }}
                    >
                        GO
                    </button>
                </form>

                {/* Browser Frame */}
                <div style={{
                    flex: 1,
                    border: '1px solid rgba(0, 240, 255, 0.2)',
                    background: '#fff',
                    borderRadius: '2px',
                    overflow: 'hidden'
                }}>
                    <iframe
                        src={url}
                        style={{
                            width: '100%',
                            height: '100%',
                            border: 'none'
                        }}
                        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                        title="Chrome Browser"
                    />
                </div>
            </div>
        </BaseWindow>
    )
}
