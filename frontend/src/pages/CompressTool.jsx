import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'
import toast from 'react-hot-toast'
import { ArrowLeft, FileArchive, Download, Upload } from 'lucide-react'

export default function CompressTool() {
    const nav = useNavigate()
    const [file, setFile] = useState(null)
    const [targetKB, setTargetKB] = useState('100')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null) // { url, originalSizeKB, finalSizeKB }

    const onDrop = useCallback((accepted) => {
        if (!accepted[0]) return
        setFile(accepted[0])
        setResult(null)
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, maxFiles: 1 })

    async function handleCompress() {
        if (!file) return toast.error('Please select a file first')
        setLoading(true)
        try {
            const fd = new FormData()
            fd.append('file', file)
            fd.append('targetKB', targetKB)
            const res = await axios.post('/compress', fd)
            setResult(res.data)
            toast.success(`Compressed to ${res.data.finalSizeKB}KB!`)
        } catch (err) {
            toast.error(err.response?.data?.message || 'Compression failed')
        } finally { setLoading(false) }
    }

    const reductionPct = result
        ? Math.round(((result.originalSizeKB - result.finalSizeKB) / result.originalSizeKB) * 100)
        : 0

    return (
        <div className="page">
            <div className="back-header">
                <button className="back-btn" onClick={() => nav('/')}><ArrowLeft size={18} /></button>
                <div>
                    <div className="page-title">File Size Reducer</div>
                    <div className="page-sub">Compress to your exact KB target</div>
                </div>
            </div>

            {/* Dropzone */}
            <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`} style={{ marginBottom: 16 }}>
                <input {...getInputProps()} />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                    <Upload size={44} color="#f59e0b" style={{ opacity: 0.85 }} />
                    {file ? (
                        <>
                            <span style={{ fontWeight: 700, color: '#fff', fontSize: 15 }}>{file.name}</span>
                            <span className="badge badge-amber">{Math.round(file.size / 1024)} KB original</span>
                            <span style={{ fontSize: 12, color: '#475569' }}>Tap to change</span>
                        </>
                    ) : (
                        <>
                            <span style={{ color: '#94a3b8', fontSize: 15 }}>
                                {isDragActive ? 'Drop file here' : 'Tap to upload image or PDF'}
                            </span>
                            <span style={{ fontSize: 12, color: '#334155' }}>JPG, PNG, PDF – max 10MB</span>
                        </>
                    )}
                </div>
            </div>

            {/* Target selector */}
            <div style={{ marginBottom: 20 }}>
                <span className="section-label">Target file size</span>
                <div style={{ display: 'flex', gap: 10 }}>
                    {['20', '50', '100'].map((kb) => (
                        <button
                            key={kb}
                            className={`option-pill ${targetKB === kb ? 'selected' : ''}`}
                            onClick={() => setTargetKB(kb)}
                            style={targetKB === kb ? {
                                borderColor: '#f59e0b', background: 'rgba(245,158,11,0.15)', color: '#fbbf24'
                            } : {}}
                        >
                            <div style={{ fontSize: 16, fontWeight: 800 }}>{kb}</div>
                            <div style={{ fontSize: 11, opacity: 0.7 }}>KB</div>
                        </button>
                    ))}
                </div>
            </div>

            <button
                className="btn-primary"
                onClick={handleCompress}
                disabled={loading}
                style={{ background: 'linear-gradient(135deg,#f59e0b,#ef4444)' }}
            >
                {loading
                    ? <><span className="spin">◌</span> Compressing…</>
                    : <><FileArchive size={18} /> Compress File</>
                }
            </button>

            {/* Result */}
            {result && (
                <div className="result-success" style={{ animation: 'fadeSlide 0.4s ease both' }}>
                    {/* Before / after */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 14 }}>
                        <div style={{ flex: 1, textAlign: 'center' }}>
                            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>BEFORE</div>
                            <div style={{ fontSize: 22, fontWeight: 800, color: '#f87171' }}>
                                {result.originalSizeKB}<span style={{ fontSize: 13, fontWeight: 500, marginLeft: 2 }}>KB</span>
                            </div>
                        </div>
                        <div style={{ color: '#334155', fontSize: 24, padding: '0 12px' }}>→</div>
                        <div style={{ flex: 1, textAlign: 'center' }}>
                            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>AFTER</div>
                            <div style={{ fontSize: 22, fontWeight: 800, color: '#34d399' }}>
                                {result.finalSizeKB}<span style={{ fontSize: 13, fontWeight: 500, marginLeft: 2 }}>KB</span>
                            </div>
                        </div>
                        <div style={{ flex: 1, textAlign: 'center' }}>
                            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>SAVED</div>
                            <div style={{ fontSize: 22, fontWeight: 800, color: '#fbbf24' }}>
                                {reductionPct}<span style={{ fontSize: 13, fontWeight: 500, marginLeft: 1 }}>%</span>
                            </div>
                        </div>
                    </div>

                    {/* Progress bar showing compression */}
                    <div style={{ marginBottom: 14 }}>
                        <div className="progress-wrap">
                            <div className="progress-bar"
                                style={{ width: `${100 - Math.min(reductionPct, 100)}%`, background: 'linear-gradient(90deg,#34d399,#10b981)' }} />
                        </div>
                    </div>

                    <a
                        href={result.url}
                        download
                        target="_blank"
                        rel="noreferrer"
                        className="btn-secondary"
                        style={{ textDecoration: 'none' }}
                    >
                        <Download size={16} /> Download Compressed File
                    </a>
                </div>
            )}
        </div>
    )
}
