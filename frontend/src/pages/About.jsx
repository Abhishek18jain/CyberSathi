import { useLanguage } from '../LanguageContext';

export default function About() {
  const { t } = useLanguage();

  return (
    <div className="page">
      <div className="card">
        <h1 className="page-title" style={{ color: 'var(--text)', marginBottom: '16px' }}>{t.nav_about}</h1>
        <p style={{ color: 'var(--muted)', lineHeight: '1.6', marginBottom: '16px' }}>
          Welcome to CyberSathi! This smart toolkit is designed specifically for Cyber Cafés and local businesses to help them quickly handle customer files, process photos, and share documents seamlessly.
        </p>
        <p style={{ color: 'var(--muted)', lineHeight: '1.6' }}>
          Built with ease-of-use in mind, our aim is to make digital document management accessible to anyone, anywhere.
        </p>
      </div>
    </div>
  );
}
