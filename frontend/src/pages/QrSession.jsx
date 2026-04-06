import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { io } from 'socket.io-client'
import { ArrowLeft, QrCode, FileText, Clock, Wifi, WifiOff, Download, Image } from 'lucide-react'

const TOOL_TYPES = [
    { id: 'passport', label: '📸 Passport Photo', color: '#6366f1' },
    { id: 'compress', label: '📦 File Compress', color: '#f59e0b' },
    { id: 'pdf', label: '📄 PDF Tools', color: '#10b981' },
    { id: 'signature', label: '✍️ Signature', color: '#ec4899' },
]

export default function QrSession() {
    const nav = useNavigate()
    const [toolType, setToolType] = useState('passport')
    const [session, setSession] = useState(null)
    const [loading, setLoading] = useState(false)
    const [files, setFiles] = useState([])
    const [timeLeft, setTimeLeft] = useState(600)
    const [connected, setConnected] = useState(false)
    const socketRef = useRef(null)
    const timerRef = useRef(null)

    // Countdown
    useEffect(() => {
        if (!session) return
        timerRef.current = setInterval(() => {
            setTimeLeft((t) => {
                if (t <= 1) { clearInterval(timerRef.current); handleEnd(); return 0 }
                return t - 1
            })
        }, 1000)
        return () => clearInterval(timerRef.current)
    }, [session])

    function connectSocket(sessionId) {
        const socket = io(window.location.origin.includes('5173') ? 'http://localhost:5000' : window.location.origin)
        socket.on('connect', () => { setConnected(true); socket.emit('join-session', sessionId) })
        socket.on('disconnect', () => setConnected(false))
        socket.on('file-uploaded', (data) => {
            setFiles((prev) => [data.file, ...prev])
            toast.success(`📁 ${data.file.originalname} received!`)
        })
        socketRef.current = socket
    }

    async function handleCreate() {
        setLoading(true)
        try {
            const res = await axios.post('/session/create', { toolType })
            const s = res.data.session
            setSession(s)
            setFiles([])
            setTimeLeft(600)
            connectSocket(s.sessionId)
            toast.success('Session created! Share the QR code.')
        } catch { toast.error('Failed to create session') }
        finally { setLoading(false) }
    }

    function handleEnd() {
        socketRef.current?.disconnect()
        clearInterval(timerRef.current)
        setSession(null)
        setFiles([])
        setConnected(false)
    }

    const mm = String(Math.floor(timeLeft / 60)).padStart(2, '0')
    const ss = String(timeLeft % 60).padStart(2, '0')
    const danger = timeLeft < 60

    return (
        <div className="page">
            <div className="back-header">
                <button className="back-btn" onClick={() => { handleEnd(); nav('/') }}><ArrowLeft size={18} /></button>
                <div>
                    <div className="page-title">QR File Transfer</div>
                    <div className="page-sub">Customer uploads from their phone</div>
                </div>
            </div>

            {!session ? (
                /* ── Session creation ─────────────────────────── */
                <>
                    <span className="section-label" style={{ display: 'block', marginBottom: 12 }}>
                        Select the service type
                    </span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
                        {TOOL_TYPES.map((t) => (
                            <button key={t.id} onClick={() => setToolType(t.id)}
                                style={{
                                    padding: '16px 12px', borderRadius: 14, border: '1.5px solid',
                                    borderColor: toolType === t.id ? t.color : 'rgba(255,255,255,0.07)',
                                    background: toolType === t.id ? `${t.color}22` : 'rgba(255,255,255,0.04)',
                                    color: toolType === t.id ? '#fff' : '#64748b',
                                    fontWeight: 600, fontSize: 14, cursor: 'pointer',
                                    transition: 'all 0.18s', fontFamily: 'inherit',
                                }}>
                                {t.label}
                            </button>
                        ))}
                    </div>

                    <button className="btn-primary" onClick={handleCreate} disabled={loading}
                        style={{ background: 'linear-gradient(135deg,#0ea5e9,#6366f1)' }}>
                        {loading ? <><span className="spin">◌</span> Creating…</> : <><QrCode size={18} /> Generate QR Code</>}
                    </button>
                </>
            ) : (
                /* ── Active session ───────────────────────────── */
                <>
                    {/* Status bar */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '10px 14px', borderRadius: 12, marginBottom: 20,
                        background: danger ? 'rgba(239,68,68,0.08)' : 'rgba(14,165,233,0.08)',
                        border: `1px solid ${danger ? 'rgba(239,68,68,0.25)' : 'rgba(14,165,233,0.25)'}`,
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {connected
                                ? <Wifi size={15} color="#38bdf8" />
                                : <WifiOff size={15} color="#f87171" />}
                            <span style={{ fontSize: 13, fontWeight: 600, color: connected ? '#38bdf8' : '#f87171' }}>
                                {connected ? 'Live' : 'Connecting…'}
                            </span>
                            <span style={{ fontSize: 12, color: '#475569' }}>· {files.length} file{files.length !== 1 ? 's' : ''}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: danger ? '#f87171' : '#64748b', fontFamily: 'monospace', fontWeight: 700, fontSize: 15 }}>
                            <Clock size={14} />{mm}:{ss}
                        </div>
                    </div>

                    {/* QR */}
                    <div style={{ textAlign: 'center', marginBottom: 22 }}>
                        <div style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>
                            Show this QR to the customer
                        </div>
                        <div style={{ display: 'inline-block', padding: 14, background: '#fff', borderRadius: 18, boxShadow: '0 8px 32px rgba(99,102,241,0.2)' }}>
                            <img src={session.qrDataUrl} alt="QR" style={{ width: 200, height: 200, display: 'block' }} />
                        </div>
                        <div style={{ fontSize: 11, color: '#334155', marginTop: 8, wordBreak: 'break-all' }}>
                            {session.uploadUrl}
                        </div>
                    </div>

                    <div className="divider" />

                    {/* Files */}
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', marginBottom: 10 }}>
                            Received Files <span style={{ color: '#475569' }}>({files.length})</span>
                        </div>
                        {files.length === 0 ? (
                            <div style={{
                                textAlign: 'center', padding: '32px 20px',
                                color: '#334155', fontSize: 14, borderRadius: 14,
                                border: '1px dashed rgba(255,255,255,0.06)',
                            }}>
                                Waiting for uploads…
                            </div>
                        ) : (
                            files.map((f, i) => {
                                const isImg = f.mimetype?.startsWith('image/')
                                return (
                                    <div key={i} className="file-item" style={{ animation: 'fadeSlide 0.3s ease both' }}>
                                        {isImg
                                            ? <img src={f.url} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8 }} />
                                            : <FileText size={22} color="#0ea5e9" />
                                        }
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {f.originalname}
                                            </div>
                                            <div style={{ fontSize: 11, color: '#475569' }}>
                                                {Math.round(f.size / 1024)}KB · {new Date(f.uploadedAt).toLocaleTimeString()}
                                            </div>
                                        </div>
                                        <a href={f.url} download={f.originalname} target="_blank" rel="noreferrer"
                                            style={{ color: '#38bdf8', fontSize: 13, fontWeight: 600, textDecoration: 'none', flexShrink: 0 }}>
                                            <Download size={15} />
                                        </a>
                                    </div>
                                )
                            })
                        )}
                    </div>

                    <button className="btn-danger" onClick={handleEnd}>
                        Stop Session
                    </button>
                </>
            )}
        </div>
    )
}
