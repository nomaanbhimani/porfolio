import { BaseWindow } from './BaseWindow'
import { WindowData } from '../../types/Window'
import { useState, useEffect } from 'react'

interface YouTubeWindowProps {
    window: WindowData
}

interface VideoResult {
    id: string
    title: string
    thumbnail: string
    channel: string
}

export function YouTubeWindow({ window: windowData }: YouTubeWindowProps) {
    const initialQuery = windowData.content?.searchQuery || ''
    const [searchQuery, setSearchQuery] = useState(initialQuery)
    const [results, setResults] = useState<VideoResult[]>([])
    const [currentVideoId, setCurrentVideoId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [showSettings, setShowSettings] = useState(false)
    const [apiKey, setApiKey] = useState(localStorage.getItem('youtube_api_key') || '')
    const [error, setError] = useState('')

    // Auto-search on initial query
    useEffect(() => {
        if (initialQuery && apiKey) {
            searchYouTube(initialQuery)
        }
    }, [])

    const searchYouTube = async (query: string) => {
        if (!apiKey) {
            setError('Please configure your YouTube API key in settings (⚙)')
            setShowSettings(true)
            return
        }

        setIsLoading(true)
        setError('')

        try {
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=8&q=${encodeURIComponent(query)}&type=video&key=${apiKey}`
            )

            if (!response.ok) {
                if (response.status === 403) {
                    throw new Error('API key invalid or quota exceeded')
                }
                throw new Error('Search failed')
            }

            const data = await response.json()
            const videos: VideoResult[] = data.items.map((item: any) => ({
                id: item.id.videoId,
                title: item.snippet.title,
                thumbnail: item.snippet.thumbnails.medium.url,
                channel: item.snippet.channelTitle
            }))

            setResults(videos)
        } catch (err: any) {
            setError(err.message || 'Search failed')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            searchYouTube(searchQuery.trim())
        }
    }

    const saveApiKey = () => {
        localStorage.setItem('youtube_api_key', apiKey)
        setShowSettings(false)
        if (searchQuery) {
            searchYouTube(searchQuery)
        }
    }

    return (
        <BaseWindow window={windowData}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                gap: '12px',
                background: 'linear-gradient(180deg, rgba(255,0,0,0.03) 0%, transparent 100%)'
            }}>
                {/* Search Bar */}
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search YouTube..."
                        style={{
                            flex: 1,
                            background: 'rgba(255, 0, 0, 0.08)',
                            border: '1px solid rgba(255, 0, 0, 0.4)',
                            borderRadius: '4px',
                            color: '#fff',
                            padding: '12px 14px',
                            fontFamily: 'Share Tech Mono',
                            fontSize: '13px',
                            outline: 'none',
                            transition: 'all 0.3s'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#FF0000'
                            e.target.style.boxShadow = '0 0 10px rgba(255,0,0,0.3)'
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = 'rgba(255, 0, 0, 0.4)'
                            e.target.style.boxShadow = 'none'
                        }}
                    />
                    <button type="submit" disabled={isLoading} style={{
                        background: 'linear-gradient(135deg, #FF0000, #CC0000)',
                        border: 'none',
                        borderRadius: '4px',
                        color: '#fff',
                        cursor: isLoading ? 'wait' : 'pointer',
                        padding: '0 18px',
                        fontFamily: 'Orbitron',
                        fontSize: '14px',
                        opacity: isLoading ? 0.6 : 1,
                        transition: 'all 0.2s'
                    }}>
                        {isLoading ? '⟳' : '🔍'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setCurrentVideoId(null)}
                        style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '4px',
                            color: '#fff',
                            cursor: 'pointer',
                            padding: '0 14px',
                            fontSize: '14px'
                        }}
                    >
                        🏠
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowSettings(!showSettings)}
                        style={{
                            background: showSettings ? 'rgba(255, 183, 0, 0.3)' : 'rgba(255, 183, 0, 0.1)',
                            border: '1px solid #ffb700',
                            borderRadius: '4px',
                            color: '#ffb700',
                            cursor: 'pointer',
                            padding: '0 14px'
                        }}
                    >
                        ⚙
                    </button>
                </form>

                {/* Settings Panel */}
                {showSettings && (
                    <div style={{
                        background: 'rgba(0, 0, 0, 0.6)',
                        border: '1px solid #ffb700',
                        padding: '15px',
                        borderRadius: '6px'
                    }}>
                        <div style={{ color: '#ffb700', fontSize: '11px', marginBottom: '10px', fontFamily: 'Orbitron' }}>
                            YOUTUBE API KEY
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="Enter YouTube Data API v3 key..."
                                style={{
                                    flex: 1,
                                    background: 'rgba(0, 0, 0, 0.5)',
                                    border: '1px solid #ffb700',
                                    borderRadius: '4px',
                                    color: '#fff',
                                    padding: '10px 12px',
                                    fontFamily: 'Share Tech Mono',
                                    fontSize: '11px'
                                }}
                            />
                            <button onClick={saveApiKey} style={{
                                background: 'linear-gradient(135deg, #ffb700, #ff8c00)',
                                border: 'none',
                                borderRadius: '4px',
                                color: '#000',
                                padding: '10px 20px',
                                cursor: 'pointer',
                                fontFamily: 'Orbitron',
                                fontWeight: 'bold'
                            }}>
                                SAVE
                            </button>
                        </div>
                        <div style={{ color: '#666', fontSize: '9px', marginTop: '8px' }}>
                            Get API key from: console.cloud.google.com → APIs → YouTube Data API v3
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div style={{
                        background: 'rgba(255, 0, 0, 0.15)',
                        border: '1px solid #FF0000',
                        padding: '12px',
                        borderRadius: '4px',
                        color: '#FF6666',
                        fontSize: '12px',
                        fontFamily: 'Share Tech Mono'
                    }}>
                        ⚠ {error}
                    </div>
                )}

                {/* Content Area */}
                <div style={{
                    flex: 1,
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 0, 0, 0.2)',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    position: 'relative'
                }}>
                    {currentVideoId ? (
                        // Video Player
                        <iframe
                            src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1`}
                            style={{
                                width: '100%',
                                height: '100%',
                                border: 'none'
                            }}
                            title="YouTube Player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : results.length > 0 ? (
                        // Search Results Grid
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                            gap: '12px',
                            padding: '12px',
                            overflowY: 'auto',
                            height: '100%'
                        }}>
                            {results.map((video) => (
                                <div
                                    key={video.id}
                                    onClick={() => setCurrentVideoId(video.id)}
                                    style={{
                                        cursor: 'pointer',
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        borderRadius: '6px',
                                        overflow: 'hidden',
                                        transition: 'all 0.3s',
                                        border: '1px solid transparent'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 0, 0, 0.15)'
                                        e.currentTarget.style.transform = 'scale(1.03)'
                                        e.currentTarget.style.borderColor = 'rgba(255, 0, 0, 0.4)'
                                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(255, 0, 0, 0.2)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'
                                        e.currentTarget.style.transform = 'scale(1)'
                                        e.currentTarget.style.borderColor = 'transparent'
                                        e.currentTarget.style.boxShadow = 'none'
                                    }}
                                >
                                    <div style={{ position: 'relative' }}>
                                        <img
                                            src={video.thumbnail}
                                            alt={video.title}
                                            style={{ width: '100%', height: 'auto', display: 'block' }}
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            inset: 0,
                                            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)'
                                        }} />
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '8px',
                                            left: '8px',
                                            right: '8px',
                                            fontSize: '30px',
                                            color: '#FF0000',
                                            opacity: 0.8,
                                            textAlign: 'center'
                                        }}>
                                            ▶
                                        </div>
                                    </div>
                                    <div style={{ padding: '10px' }}>
                                        <div style={{
                                            color: '#fff',
                                            fontSize: '11px',
                                            fontFamily: 'Share Tech Mono',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            lineHeight: '1.4'
                                        }}>
                                            {video.title}
                                        </div>
                                        <div style={{
                                            color: '#FF6666',
                                            fontSize: '10px',
                                            marginTop: '6px',
                                            opacity: 0.8
                                        }}>
                                            {video.channel}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        // Welcome Screen
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            color: '#666',
                            fontFamily: 'Share Tech Mono',
                            background: 'radial-gradient(circle at center, rgba(255,0,0,0.05) 0%, transparent 70%)'
                        }}>
                            <div style={{
                                fontSize: '60px',
                                marginBottom: '20px',
                                color: '#FF0000',
                                opacity: 0.5,
                                animation: 'pulse 2s infinite'
                            }}>
                                ▶
                            </div>
                            <div style={{
                                fontSize: '16px',
                                fontFamily: 'Orbitron',
                                color: '#FF0000',
                                marginBottom: '8px'
                            }}>
                                YOUTUBE INTERFACE
                            </div>
                            <div style={{ fontSize: '12px', color: '#555' }}>
                                {apiKey ? 'Search for videos above' : 'Configure API key in ⚙ to enable search'}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </BaseWindow>
    )
}
