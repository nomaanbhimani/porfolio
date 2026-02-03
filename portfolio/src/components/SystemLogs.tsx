import { motion, AnimatePresence } from 'framer-motion'

interface LogMessage {
    id: string
    text: string
    timestamp: number
}

interface SystemLogsProps {
    logs: LogMessage[]
}

export function SystemLogs({ logs }: SystemLogsProps) {
    return (
        <div style={{
            position: 'absolute',
            top: '25%',
            left: '20px',
            width: '300px',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            zIndex: 10,
            pointerEvents: 'none', // Letting clicks pass through
            fontFamily: 'Share Tech Mono',
            fontSize: '14px'
        }}>
            <AnimatePresence>
                {logs.map((log) => (
                    <motion.div
                        key={log.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5 }}
                        style={{
                            color: '#00F0FF',
                            textShadow: '0 0 5px rgba(0, 240, 255, 0.5)',
                            display: 'flex',
                            gap: '10px'
                        }}
                    >
                        <span style={{ opacity: 0.5, fontSize: '10px', paddingTop: '2px' }}>
                            {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                        <span>{`> ${log.text}`}</span>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}
