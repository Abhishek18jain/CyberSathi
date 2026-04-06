import { useNavigate } from 'react-router-dom'
import { Camera, FileArchive, FileText, PenLine, QrCode, Zap, Shield, Clock } from 'lucide-react'
import { useLanguage } from '../LanguageContext'

export default function Home() {
    const nav = useNavigate()
    const { t } = useLanguage()

    const tools = [
        {
            icon: Camera,
            title: t.tool_passport,
            desc: t.tool_passport_desc,
            path: '/passport',
            gradient: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
            glow: 'rgba(79,70,229,0.2)',
            label: 'POPULAR',
            labelColor: '#6366f1',
        },
        {
            icon: FileArchive,
            title: t.tool_compress,
            desc: t.tool_compress_desc,
            path: '/compress',
            gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)',
            glow: 'rgba(245,158,11,0.2)',
            label: 'INSTANT',
            labelColor: '#fbbf24',
        },
        {
            icon: FileText,
            title: t.tool_pdf,
            desc: t.tool_pdf_desc,
            path: '/pdf',
            gradient: 'linear-gradient(135deg,#10b981,#06b6d4)',
            glow: 'rgba(16,185,129,0.2)',
            label: '3-IN-1',
            labelColor: '#34d399',
        },
        {
            icon: PenLine,
            title: t.tool_signature,
            desc: t.tool_signature_desc,
            path: '/signature',
            gradient: 'linear-gradient(135deg,#ec4899,#f43f5e)',
            glow: 'rgba(236,72,153,0.2)',
            label: 'SMART',
            labelColor: '#f472b6',
        },
        {
            icon: QrCode,
            title: t.tool_qr,
            desc: t.tool_qr_desc,
            path: '/qr-session',
            gradient: 'linear-gradient(135deg,#0ea5e9,#4f46e5)',
            glow: 'rgba(14,165,233,0.2)',
            label: 'LIVE',
            labelColor: '#38bdf8',
        },
    ]

    const stats = [
        { icon: Zap, label: '5 tools', sub: 'all-in-one' },
        { icon: Shield, label: 'Cloud', sub: 'powered' },
        { icon: Clock, label: 'Sessions', sub: '10-min QR' },
    ]

    return (
        <div className="page">
            {/* ── Hero ───────────────────────────────── */}
            <div style={{ textAlign: 'center', padding: '10px 0 32px', animation: 'fadeSlide 0.5s ease both' }}>
                <div style={{
                    width: 72, height: 72, borderRadius: 24, margin: '0 auto 20px',
                    background: 'var(--primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 32, boxShadow: '0 8px 32px var(--primary-glow)',
                    animation: 'pulse-ring 2.5s infinite',
                }}>🚀</div>

                <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.5px' }}>
                    {t.home_title}
                </h1>
                <p style={{ color: 'var(--muted)', marginTop: 6, fontSize: 14, fontWeight: 500 }}>
                    {t.home_sub}
                </p>

                {/* Stats row */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 24 }}>
                    {stats.map((s) => (
                        <div key={s.label} style={{ textAlign: 'center' }}>
                            <s.icon size={16} color="var(--primary)" style={{ margin: '0 auto 4px' }} />
                            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{s.label}</div>
                            <div style={{ fontSize: 11, color: 'var(--muted)' }}>{s.sub}</div>
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
                            border: '1px solid var(--border)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)'
                            e.currentTarget.style.boxShadow = `0 8px 16px ${tool.glow}`
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)'
                            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.05)'
                        }}
                    >
                        {/* Icon */}
                        <div style={{
                            width: 52, height: 52, borderRadius: 16, flexShrink: 0,
                            background: tool.gradient,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: `0 4px 12px ${tool.glow}`,
                        }}>
                            <tool.icon size={22} color="#fff" />
                        </div>

                        {/* Text */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                                <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>{tool.title}</span>
                                <span style={{
                                    fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
                                    color: tool.labelColor, background: `${tool.glow}`,
                                    padding: '2px 6px', borderRadius: 6,
                                }}>
                                    {tool.label}
                                </span>
                            </div>
                            <div style={{ fontSize: 13, color: 'var(--muted)' }}>{tool.desc}</div>
                        </div>

                        <div style={{ color: 'var(--muted)', fontSize: 20, flexShrink: 0, opacity: 0.5 }}>›</div>
                    </button>
                ))}
            </div>
            
            <p style={{ textAlign: 'center', color: 'var(--muted)', marginTop: 36, fontSize: 12 }}>
                CyberSathi © 2026
            </p>
        </div>
    )
}
