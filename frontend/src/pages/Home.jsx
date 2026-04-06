import { useNavigate } from 'react-router-dom'
import { Camera, FileArchive, FileText, PenLine, QrCode, Zap, Shield, Clock } from 'lucide-react'

const tools = [
    {
        icon: Camera,
        title: 'Passport Photo',
        desc: 'Print-ready 4/8/16 photos on A4 sheet',
        path: '/passport',
        gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
        glow: 'rgba(99,102,241,0.3)',
        label: 'POPULAR',
        labelColor: '#818cf8',
    },
    {
        icon: FileArchive,
        title: 'File Size Reducer',
        desc: 'Compress to exact 20KB, 50KB or 100KB',
        path: '/compress',
        gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)',
        glow: 'rgba(245,158,11,0.3)',
        label: 'INSTANT',
        labelColor: '#fbbf24',
    },
    {
        icon: FileText,
        title: 'PDF Tools',
        desc: 'Merge · JPG→PDF · Compress',
        path: '/pdf',
        gradient: 'linear-gradient(135deg,#10b981,#06b6d4)',
        glow: 'rgba(16,185,129,0.3)',
        label: '3-IN-1',
        labelColor: '#34d399',
    },
    {
        icon: PenLine,
        title: 'Signature Tool',
        desc: 'Remove BG → transparent PNG signature',
        path: '/signature',
        gradient: 'linear-gradient(135deg,#ec4899,#f43f5e)',
        glow: 'rgba(236,72,153,0.3)',
        label: 'SMART',
        labelColor: '#f472b6',
    },
    {
        icon: QrCode,
        title: 'QR File Transfer',
        desc: 'Customer uploads from phone via QR code',
        path: '/qr-session',
        gradient: 'linear-gradient(135deg,#0ea5e9,#6366f1)',
        glow: 'rgba(14,165,233,0.3)',
        label: 'LIVE',
        labelColor: '#38bdf8',
    },
]

const stats = [
    { icon: Zap, label: '5 tools', sub: 'all-in-one' },
    { icon: Shield, label: 'Cloud', sub: 'powered' },
    { icon: Clock, label: 'Sessions', sub: '10-min QR' },
]

export default function Home() {
    const nav = useNavigate()

    return (
        <div className="page">
            {/* ── Hero ───────────────────────────────── */}
            <div style={{ textAlign: 'center', padding: '36px 0 32px', animation: 'fadeSlide 0.5s ease both' }}>
                <div style={{
                    width: 72, height: 72, borderRadius: 24, margin: '0 auto 20px',
                    background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 32, boxShadow: '0 8px 32px rgba(99,102,241,0.45)',
                    animation: 'pulse-ring 2.5s infinite',
                }}>🏪</div>

                <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>
                    MP Online Hub
                </h1>
                <p style={{ color: '#64748b', marginTop: 6, fontSize: 14, fontWeight: 500 }}>
                    Cyber Café Toolkit — Fast &amp; Simple
                </p>

                {/* Stats row */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 24 }}>
                    {stats.map((s) => (
                        <div key={s.label} style={{ textAlign: 'center' }}>
                            <s.icon size={16} color="#6366f1" style={{ margin: '0 auto 4px' }} />
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>{s.label}</div>
                            <div style={{ fontSize: 11, color: '#475569' }}>{s.sub}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Tool cards ─────────────────────────── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {tools.map((tool, i) => (
                    <button
                        key={tool.path}
                        onClick={() => nav(tool.path)}
                        className="card"
                        style={{
                            display: 'flex', alignItems: 'center', gap: 16,
                            padding: '16px 18px', cursor: 'pointer', textAlign: 'left',
                            transition: 'transform 0.18s, box-shadow 0.18s',
                            animation: `fadeSlide 0.4s ${i * 0.06}s ease both`,
                            border: 'none',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)'
                            e.currentTarget.style.boxShadow = `0 8px 32px ${tool.glow}`
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)'
                            e.currentTarget.style.boxShadow = 'none'
                        }}
                    >
                        {/* Icon */}
                        <div style={{
                            width: 52, height: 52, borderRadius: 16, flexShrink: 0,
                            background: tool.gradient,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: `0 4px 16px ${tool.glow}`,
                        }}>
                            <tool.icon size={22} color="#fff" />
                        </div>

                        {/* Text */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                                <span style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>{tool.title}</span>
                                <span style={{
                                    fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
                                    color: tool.labelColor, background: `${tool.glow}`,
                                    padding: '2px 6px', borderRadius: 6,
                                }}>
                                    {tool.label}
                                </span>
                            </div>
                            <div style={{ fontSize: 13, color: '#64748b' }}>{tool.desc}</div>
                        </div>

                        <div style={{ color: '#334155', fontSize: 20, flexShrink: 0 }}>›</div>
                    </button>
                ))}
            </div>

            <p style={{ textAlign: 'center', color: '#1e293b', marginTop: 36, fontSize: 11 }}>
                MP Online Hub v2.0 • Cyber Café Edition
            </p>
        </div>
    )
}
