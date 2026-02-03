import { useWindowManager } from '../managers/WindowManager'
import { BaseWindow } from './Window/BaseWindow'
import { ProfileWindow } from './Window/ProfileWindow'
import { ExternalWindow } from './Window/ExternalWindow'
import { ProjectsListWindow } from './Window/ProjectsListWindow'
import { ProjectDetailWindow } from './Window/ProjectDetailWindow'
import { GitHubWindow } from './Window/GitHubWindow'
import { GeminiChatWindow } from './Window/GeminiChatWindow'
import { GeminiTerminalWindow } from './Window/GeminiTerminalWindow'
import { HelpWindow } from './Window/HelpWindow'
import { YouTubeWindow } from './Window/YouTubeWindow'
import { ChromeWindow } from './Window/ChromeWindow'
import { LinkedInWindow } from './Window/LinkedInWindow'

import { SkillsWindow } from './Window/SkillsWindow'
import { ContactWindow } from './Window/ContactWindow'

export function WindowRenderer() {
    const { windows } = useWindowManager()

    return (
        <>
            {windows.map((window) => {
                if (window.type === 'profile') {
                    return <ProfileWindow key={window.id} window={window} />
                }
                if (window.type === 'skills') {
                    return <SkillsWindow key={window.id} window={window} />
                }
                if (window.type === 'contact') {
                    return <ContactWindow key={window.id} window={window} />
                }
                if (window.type === 'projects-list') {
                    return <ProjectsListWindow key={window.id} window={window} />
                }
                if (window.type === 'project-detail') {
                    return <ProjectDetailWindow key={window.id} window={window} />
                }
                if (window.type === 'github-profile') {
                    return <GitHubWindow key={window.id} window={window} />
                }
                if (window.type === 'gemini-chat') {
                    return <GeminiChatWindow key={window.id} window={window} />
                }
                if (window.type === 'gemini-terminal') {
                    return <GeminiTerminalWindow key={window.id} windowData={window} />
                }
                if (window.type === 'help') {
                    return <HelpWindow key={window.id} window={window} />
                }
                if (window.type === 'youtube') {
                    return <YouTubeWindow key={window.id} window={window} />
                }
                if (window.type === 'chrome') {
                    return <ChromeWindow key={window.id} window={window} />
                }
                if (window.type === 'linkedin') {
                    return <LinkedInWindow key={window.id} window={window} />
                }
                if (window.type === 'external') {
                    return <ExternalWindow key={window.id} window={window} />
                }

                // Fallback for other types until they are implemented
                return (
                    <BaseWindow key={window.id} window={window}>
                        <div style={{ padding: '20px' }}>
                            <h3>{window.title}</h3>
                            <p>Module loaded. Content rendering pending...</p>
                        </div>
                    </BaseWindow>
                )
            })}
        </>
    )
}
