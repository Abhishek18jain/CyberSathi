import { useLanguage } from '../LanguageContext';

export default function Help() {
  const { t } = useLanguage();

  return (
    <div className="page">
      <div className="card">
        <h1 className="page-title" style={{ color: 'var(--text)', marginBottom: '16px' }}>{t.nav_help}</h1>
        <p style={{ color: 'var(--muted)', lineHeight: '1.6', marginBottom: '16px' }}>
          Need assistance? Here is how to use CyberSathi:
        </p>
        <ul style={{ color: 'var(--muted)', lineHeight: '1.8', marginLeft: '20px' }}>
          <li><strong>QR File Transfer:</strong> Generate a QR code to let customers upload files securely directly from their smartphones, without USB cables or WhatsApp.</li>
          <li><strong>Passport Photo:</strong> Quickly generate an A4 printable sheet of passport photos in multiple quantities.</li>
          <li><strong>PDF Tools:</strong> Merge images into PDFs or compress existing PDFs directly in your browser.</li>
          <li><strong>File Size Reducer:</strong> Compress images to an exact target file size in KB.</li>
        </ul>
      </div>
    </div>
  );
}
