import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import { Shield } from 'lucide-react';

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const location = useLocation();

  const isUploadPage = location.pathname.startsWith('/upload/');
  if (isUploadPage) return null; // Don't show nav on the customer upload page

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px',
      marginBottom: '20px',
      background: 'var(--card)',
      borderRadius: '16px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      border: '1px solid var(--border)'
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'var(--text)' }}>
        <Shield size={24} color="var(--primary)" />
        <span style={{ fontWeight: 800, fontSize: '18px', letterSpacing: '-0.3px' }}>CyberSathi</span>
      </Link>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '12px', fontSize: '14px', fontWeight: 600 }}>
          <Link to="/" style={{ color: location.pathname === '/' ? 'var(--primary)' : 'var(--muted)', textDecoration: 'none' }}>{t.nav_home}</Link>
          <Link to="/about" style={{ color: location.pathname === '/about' ? 'var(--primary)' : 'var(--muted)', textDecoration: 'none' }}>{t.nav_about}</Link>
          <Link to="/help" style={{ color: location.pathname === '/help' ? 'var(--primary)' : 'var(--muted)', textDecoration: 'none' }}>{t.nav_help}</Link>
        </div>

        <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '16px', display: 'flex', gap: '4px' }}>
          <button 
            onClick={() => setLang('en')}
            style={{
              padding: '4px 8px',
              borderRadius: '6px',
              border: 'none',
              background: lang === 'en' ? 'var(--primary)' : 'transparent',
              color: lang === 'en' ? '#fff' : 'var(--muted)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '12px'
            }}
          >EN</button>
          <button 
            onClick={() => setLang('hi')}
            style={{
              padding: '4px 8px',
              borderRadius: '6px',
              border: 'none',
              background: lang === 'hi' ? 'var(--primary)' : 'transparent',
              color: lang === 'hi' ? '#fff' : 'var(--muted)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '12px'
            }}
          >HI</button>
        </div>
      </div>
    </nav>
  );
}
