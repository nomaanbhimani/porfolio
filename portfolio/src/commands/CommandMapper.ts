export interface VoiceCommand {
    patterns: RegExp[]
    action: string
    params?: any
}

export const COMMAND_MAP: Record<string, VoiceCommand> = {
    // System Commands
    WAKE: {
        patterns: [
            /.*wake.*/i,
            /.*online.*/i,
            /.*startup.*/i,
            /.*start up.*/i,
            /.*hey jarvis.*/i,
            /.*jarvis.*/i,
            /.*hello.*/i
        ],
        action: 'SYSTEM_WAKE'
    },

    CLEAR: {
        patterns: [
            /^clear$/i,
            /.*close all.*/i,
            /.*minimize all.*/i,
            /.*hide all.*/i,
            /.*shut.*down.*windows.*/i
        ],
        action: 'CLOSE_ALL_WINDOWS'
    },

    SLEEP: {
        patterns: [
            /.*sleep.*/i,
            /.*shut down.*/i,
            /.*shutdown.*/i,
            /.*power down.*/i,
            /.*goodbye.*/i,
            /.*bye.*/i,
            /.*offline.*/i,
            /.*power off.*/i
        ],
        action: 'SYSTEM_SLEEP'
    },

    // Profile Commands
    SHOW_DETAILS: {
        patterns: [
            /.*who are you.*/i,
            /.*your profile.*/i,
            /.*about you.*/i,
            /.*introduce yourself.*/i,
            /^show profile$/i,
            /^profile$/i,
            /.*(show|open|display) profile.*/i
        ],
        action: 'OPEN_PROFILE_WINDOW'
    },

    // Project Commands
    SHOW_PROJECTS: {
        patterns: [
            /.*show projects.*/i,
            /.*show project$/i,
            /^projects?$/i,
            /.*list projects.*/i,
            /.*my work.*/i,
            /.*portfolio.*/i,
            /.*archives.*/i
        ],
        action: 'OPEN_PROJECTS_LIST'
    },

    OPEN_PROJECT: {
        patterns: [
            /.*open project (\w+).*/i,
            /.*show project (\w+).*/i,
            /.*project (\w+) details.*/i
        ],
        action: 'OPEN_PROJECT_DETAIL'
    },

    // External Links - Flexible verbs
    OPEN_GITHUB: {
        patterns: [
            /.*(open|start|launch|run|show).*github.*/i,
            /.*(open|start|launch|run|show).*git hub.*/i,
            /.*(open|start|launch|run|show).*repositories.*/i,
            /^git$/i,
            /^github$/i,
            /.*(open|show|launch).*git$/i
        ],
        action: 'OPEN_GITHUB_WINDOW',
        params: { username: 'nomaanbhimani' }
    },

    OPEN_LINKEDIN: {
        patterns: [
            /.*(open|start|launch|run|show).*linkedin.*/i,
            /.*(open|start|launch|run|show).*linked in.*/i,
            /^linkedin$/i,
            /^linked in$/i
        ],
        action: 'OPEN_LINKEDIN_WINDOW'
    },

    OPEN_YOUTUBE: {
        patterns: [
            /^(open|start|launch|run|play) youtube$/i,
            /^youtube$/i
        ],
        action: 'OPEN_YOUTUBE'
    },

    // YouTube with search query
    YOUTUBE_SEARCH: {
        patterns: [
            /.*(open|play|search) youtube.*(for|and search|search for|search) (.+)/i,
            /.*youtube.*search (.+)/i,
            /.*search youtube for (.+)/i,
            /.*play (.+) on youtube/i
        ],
        action: 'OPEN_YOUTUBE_SEARCH'
    },

    // Chrome Browser
    OPEN_CHROME: {
        patterns: [
            /^(open|start|launch) (chrome|browser)$/i,
            /^chrome$/i,
            /^browser$/i
        ],
        action: 'OPEN_CHROME'
    },

    // Chrome with search query
    CHROME_SEARCH: {
        patterns: [
            /.*(open|search) (chrome|browser|google).*(for|and search|search for) (.+)/i,
            /.*google (.+)/i,
            /.*search for (.+)/i,
            /.*search (.+) on google/i
        ],
        action: 'OPEN_CHROME_SEARCH'
    },

    // Skills
    SHOW_SKILLS: {
        patterns: [
            /.*(show|display|list).*skills.*/i,
            /.*what can you do.*/i,
            /.*capabilities.*/i,
            /.*tech stack.*/i
        ],
        action: 'OPEN_SKILLS_WINDOW'
    },

    // Contact
    SHOW_CONTACT: {
        patterns: [
            /.*(open|show|start).*contact.*/i,
            /.*email.*/i,
            /.*get in touch.*/i,
            /.*message.*/i
        ],
        action: 'OPEN_CONTACT_WINDOW'
    },

    // Gemini AI
    ASK_GEMINI: {
        patterns: [
            /.*(open|start|launch).*chat.*/i,
            /.*talk to ai.*/i,
            /.*(open|start|launch).*gemini.*/i
        ],
        action: 'OPEN_GEMINI_CHAT'
    },

    // Gemini Query - Forward voice to Gemini
    ASK_GEMINI_QUERY: {
        patterns: [
            /.*ask gemini (.+)/i,
            /.*gemini (.+)/i,
            /.*ask ai (.+)/i
        ],
        action: 'OPEN_GEMINI_WITH_QUERY'
    },

    // Window Control
    WINDOW_ENLARGE: {
        patterns: [/.*enlarge.*/i, /.*bigger.*/i, /.*enhance.*/i],
        action: 'WINDOW_RESIZE',
        params: { scale: 1.2 }
    },
    WINDOW_SHRINK: {
        patterns: [/.*shrink.*/i, /.*smaller.*/i, /.*reduce.*/i],
        action: 'WINDOW_RESIZE',
        params: { scale: 0.8 }
    },
    WINDOW_MINIMIZE: {
        patterns: [/.*minimize.*/i, /.*hide current.*/i, /.*drop it.*/i],
        action: 'WINDOW_MINIMIZE'
    },

    // Special
    SHOW_HELP: {
        patterns: [/.*help.*/i, /.*commands.*/i, /.*manual.*/i, /.*assist.*/i],
        action: 'OPEN_HELP_WINDOW'
    },

    SECRET_CODE: {
        patterns: [/.*protocol arc.*/i, /.*arc reactor.*/i, /.*house party.*/i],
        action: 'ACTIVATE_SECRET_MODE'
    },

    // Window Management
    MANAGE_WINDOWS: {
        patterns: [
            /.*manage windows.*/i,
            /.*arrange windows.*/i,
            /.*organize windows.*/i,
            /.*tile windows.*/i,
            /.*fix windows.*/i,
            /.*sort windows.*/i
        ],
        action: 'ARRANGE_WINDOWS'
    }
}

// Command Processor
export class VoiceCommandProcessor {
    processCommand(transcript: string): { action: string; params?: any } | null {
        const cleaned = transcript.toLowerCase().trim()

        // 1. Exact/Regex Match
        for (const [, command] of Object.entries(COMMAND_MAP)) {
            for (const pattern of command.patterns) {
                const match = cleaned.match(pattern)
                if (match) {
                    const params = match.length > 1
                        ? { ...command.params, captured: match.slice(1) }
                        : command.params
                    return { action: command.action, params }
                }
            }
        }

        // 2. Fuzzy Keyword Fallback (if regex fails)
        // Check for specific keywords if no complex pattern matched
        if (cleaned.includes('youtube')) return { action: 'OPEN_YOUTUBE', params: {} }
        if (cleaned.includes('github') || cleaned === 'git') return { action: 'OPEN_GITHUB_WINDOW', params: { username: 'nomaanbhimani' } }
        if (cleaned.includes('linkedin')) return { action: 'OPEN_LINKEDIN_WINDOW', params: {} }
        if (cleaned.includes('profile')) return { action: 'OPEN_PROFILE_WINDOW', params: {} }
        if (cleaned.includes('project')) return { action: 'OPEN_PROJECTS_LIST', params: {} }
        if (cleaned.includes('skills')) return { action: 'OPEN_SKILLS_WINDOW', params: {} }
        if (cleaned.includes('contact')) return { action: 'OPEN_CONTACT_WINDOW', params: {} }
        if (cleaned.includes('wake')) return { action: 'SYSTEM_WAKE', params: {} }
        if (cleaned.includes('sleep')) return { action: 'SYSTEM_SLEEP', params: {} }

        return null
    }
}
