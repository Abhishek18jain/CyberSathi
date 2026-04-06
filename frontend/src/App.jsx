import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'

import Home from './pages/Home'
import PassportTool from './pages/PassportTool'
import CompressTool from './pages/CompressTool'
import PdfTools from './pages/PdfTools'
import SignatureTool from './pages/SignatureTool'
import QrSession from './pages/QrSession'
import MobileUpload from './pages/MobileUpload'

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#1a1730',
            color: '#e2e8f0',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/passport" element={<PassportTool />} />
        <Route path="/compress" element={<CompressTool />} />
        <Route path="/pdf" element={<PdfTools />} />
        <Route path="/signature" element={<SignatureTool />} />
        <Route path="/qr-session" element={<QrSession />} />
        <Route path="/upload/:sessionId" element={<MobileUpload />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
