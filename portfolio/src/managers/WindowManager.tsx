import { create } from 'zustand'
import { WindowData } from '../types/Window'

interface WindowManagerState {
    windows: WindowData[]
    focusedWindowId: string | null

    // Actions
    createWindow: (windowData: Omit<WindowData, 'id' | 'zIndex' | 'isMinimized' | 'isFocused' | 'isLoading'>) => string
    closeWindow: (windowId: string) => void
    closeAllWindows: () => void
    focusWindow: (id: string) => void
    minimizeWindow: (id: string) => void
    updateWindowPosition: (id: string, position: { x: number; y: number }) => void
    resizeWindow: (id: string, size: { width: number; height: number }) => void
    updateWindowSize: (windowId: string, size: { width: number; height: number }) => void
    arrangeWindows: () => void
}

export const useWindowManager = create<WindowManagerState>((set, get) => ({
    windows: [],
    focusedWindowId: null,

    createWindow: (windowData) => {
        const newWindow: WindowData = {
            ...windowData,
            id: `window-${Date.now()}-${Math.random()}`,
            zIndex: get().windows.length + 1,
            isMinimized: false,
            isFocused: true,
            isLoading: false
        }

        set((state) => ({
            windows: [...state.windows, newWindow],
            focusedWindowId: newWindow.id
        }))

        return newWindow.id
    },

    closeWindow: (windowId) => {
        set((state) => ({
            windows: state.windows.filter(w => w.id !== windowId),
            focusedWindowId: state.focusedWindowId === windowId ? null : state.focusedWindowId
        }))
    },

    closeAllWindows: () => {
        set({ windows: [], focusedWindowId: null })
    },

    focusWindow: (windowId) => {
        set((state) => {
            const maxZ = Math.max(...state.windows.map(w => w.zIndex), 0)
            return {
                windows: state.windows.map(w => ({
                    ...w,
                    isFocused: w.id === windowId,
                    zIndex: w.id === windowId ? maxZ + 1 : w.zIndex
                })),
                focusedWindowId: windowId
            }
        })
    },

    minimizeWindow: (windowId) => {
        set((state) => ({
            windows: state.windows.map(w =>
                w.id === windowId ? { ...w, isMinimized: !w.isMinimized } : w
            )
        }))
    },

    updateWindowPosition: (id, position) =>
        set((state) => ({
            windows: state.windows.map((w) =>
                w.id === id ? { ...w, position: { ...w.position, ...position } } : w
            ),
        })),

    updateWindowSize: (windowId, size) => {
        set((state) => ({
            windows: state.windows.map(w =>
                w.id === windowId ? { ...w, size } : w
            )
        }))
    },

    resizeWindow: (id, size) =>
        set((state) => ({
            windows: state.windows.map((w) =>
                w.id === id ? { ...w, size: { ...w.size, ...size } } : w
            )
        })),

    // Arrange all windows in a neat grid
    arrangeWindows: () => {
        set((state) => {
            const visibleWindows = state.windows.filter(w => !w.isMinimized)
            const count = visibleWindows.length

            if (count === 0) return state

            // Calculate grid dimensions
            const screenW = window.innerWidth
            const screenH = window.innerHeight - 100 // Leave space for taskbar and command input
            const padding = 20
            const topOffset = 60 // HUD offset

            // Determine grid layout
            let cols = 1
            let rows = 1
            if (count === 1) { cols = 1; rows = 1 }
            else if (count === 2) { cols = 2; rows = 1 }
            else if (count <= 4) { cols = 2; rows = 2 }
            else if (count <= 6) { cols = 3; rows = 2 }
            else { cols = 3; rows = Math.ceil(count / 3) }

            const cellW = (screenW - padding * (cols + 1)) / cols
            const cellH = (screenH - topOffset - padding * (rows + 1)) / rows

            // Position each window
            const arranged = state.windows.map(w => {
                if (w.isMinimized) {
                    // Restore minimized windows
                    return { ...w, isMinimized: false }
                }

                const idx = visibleWindows.findIndex(vw => vw.id === w.id)
                if (idx === -1) return w

                const col = idx % cols
                const row = Math.floor(idx / cols)

                return {
                    ...w,
                    isMinimized: false,
                    position: {
                        x: padding + col * (cellW + padding),
                        y: topOffset + padding + row * (cellH + padding)
                    },
                    size: {
                        width: Math.min(cellW, 600),
                        height: Math.min(cellH, 500)
                    },
                    zIndex: idx + 1
                }
            })

            return { windows: arranged }
        })
    }
}))

