import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'

import { LanguageProvider } from './LanguageContext'
import Navbar from './Navbar'

import Home from './pages/Home'
import PassportTool from './pages/PassportTool'
import CompressTool from './pages/CompressTool'
import PdfTools from './pages/PdfTools'
import SignatureTool from './pages/SignatureTool'
import QrSession from './pages/QrSession'
import MobileUpload from './pages/MobileUpload'
import About from './pages/About'
import Help from './pages/Help'

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Navbar />
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: 'var(--card)',
                color: 'var(--text)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              },
            }}
          />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/help" element={<Help />} />
            <Route path="/passport" element={<PassportTool />} />
            <Route path="/compress" element={<CompressTool />} />
            <Route path="/pdf" element={<PdfTools />} />
            <Route path="/signature" element={<SignatureTool />} />
            <Route path="/qr-session" element={<QrSession />} />
            <Route path="/upload/:sessionId" element={<MobileUpload />} />
          </Routes>
        </div>
      </BrowserRouter>
    </LanguageProvider>
  )
}

export default App
