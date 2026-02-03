export interface WindowData {
    id: string
    type: 'profile' | 'projects-list' | 'project-detail' | 'external' | 'skills' | 'contact' | 'gemini-chat' | 'gemini-terminal' | 'github-profile' | 'help' | 'youtube' | 'chrome' | 'linkedin'
    title: string
    content: any // Specific to window type
    position: { x: number; y: number }
    size: { width: number; height: number }
    zIndex: number
    isMinimized: boolean
    isFocused: boolean
    isLoading: boolean
}

export interface WindowConfig {
    profile: {
        name: string
        title: string
        bio: string[]
        image: string
        skills: string[]
        socials: { platform: string; url: string }[]
    }
}
