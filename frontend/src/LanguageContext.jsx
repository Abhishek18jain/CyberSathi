import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    home_title: "CyberSathi",
    home_sub: "Smart Toolkit — Fast & Simple",
    tool_passport: "Passport Photo",
    tool_passport_desc: "Print-ready 4/8/16 photos on A4 sheet",
    tool_compress: "File Size Reducer",
    tool_compress_desc: "Compress to exact 20KB, 50KB or 100KB",
    tool_pdf: "PDF Tools",
    tool_pdf_desc: "Merge · JPG→PDF · Compress",
    tool_signature: "Signature Tool",
    tool_signature_desc: "Remove BG → transparent PNG signature",
    tool_qr: "QR File Transfer",
    tool_qr_desc: "Customer uploads from phone via QR code",
    nav_home: "Home",
    nav_about: "About",
    nav_help: "Help",
    qr_title: "QR File Transfer",
    qr_sub: "Customer uploads from their phone",
    qr_show: "Show this QR to the customer",
    qr_generate: "Generate QR Code",
    qr_stop: "Stop Session",
    qr_pause: "Pause",
    qr_resume: "Resume",
    btn_upload: "Upload image",
    btn_download: "Download"
  },
  hi: {
    home_title: "CyberSathi (साइबर साथी)",
    home_sub: "स्मार्ट टूलकिट — तेज़ और सरल",
    tool_passport: "पासपोर्ट फोटो",
    tool_passport_desc: "A4 शीट पर 4/8/16 प्रिंट-रेडी फोटो",
    tool_compress: "फाइल साइज कम करें",
    tool_compress_desc: "सटीक 20KB, 50KB या 100KB में बदलें",
    tool_pdf: "पीडीएफ टूल्स",
    tool_pdf_desc: "जोड़ें · JPG→PDF · कंप्रेस",
    tool_signature: "हस्ताक्षर टूल",
    tool_signature_desc: "बैकग्राउंड हटाएं → पारदर्शी PNG",
    tool_qr: "QR फाइल ट्रांसफर",
    tool_qr_desc: "ग्राहक QR कोड स्कैन कर फोन से भेजें",
    nav_home: "होम",
    nav_about: "हमारे बारे में",
    nav_help: "मदद",
    qr_title: "QR फाइल ट्रांसफर",
    qr_sub: "ग्राहक अपने फोन से अपलोड करेंगे",
    qr_show: "यह QR ग्राहक को दिखाएं",
    qr_generate: "QR कोड बनाएं",
    qr_stop: "सेशन बंद करें",
    qr_pause: "रोकें",
    qr_resume: "चालू करें",
    btn_upload: "फोटो अपलोड करें",
    btn_download: "डाउनलोड करें"
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');
  const t = translations[lang] || translations.en;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
