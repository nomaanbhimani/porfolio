import { useEffect } from 'react'
import { useWindowManager } from '../managers/WindowManager'

export function useKeyboardShortcuts() {
    const { windows, focusedWindowId, closeWindow, minimizeWindow } = useWindowManager()

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Find focused window
            const focusedWindow = windows.find(w => w.id === focusedWindowId)

            // Escape - Minimize focused window
            if (e.key === 'Escape' && focusedWindow && !focusedWindow.isMinimized) {
                e.preventDefault()
                minimizeWindow(focusedWindow.id)
            }

            // Ctrl+W - Close focused window
            if (e.ctrlKey && e.key === 'w' && focusedWindow) {
                e.preventDefault()
                closeWindow(focusedWindow.id)
            }

            // Ctrl+Shift+A - Close all windows
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                e.preventDefault()
                useWindowManager.getState().closeAllWindows()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [windows, focusedWindowId, closeWindow, minimizeWindow])
}
