import React from 'react';
import { FileText, ExternalLink, AlertTriangle } from 'lucide-react';

export const PdfViewer = ({ fileUrl }) => {
  
  const getEmbedUrl = (url) => {
    if (!url) return '';
    const idMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (idMatch && idMatch[1]) {
      return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
    }
    return url;
  };

  const embedUrl = getEmbedUrl(fileUrl);

  return (
    <div className="w-full h-full bg-[#0A0A0A] border border-white/10 rounded-[2rem] overflow-hidden flex flex-col relative shadow-2xl">
      
      {/* 🛡️ HEADER VE KAÇIŞ BUTONU */}
      <div className="bg-[#111] p-4 border-b border-white/5 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <FileText className="text-[#FDB912]" size={20} />
          <h3 className="text-white font-black tracking-widest text-sm uppercase">Savaş Dokümanı (PDF)</h3>
        </div>
        
        {/* 🚀 DOKÜMANI YENİ SEKMEYE FIRLATAN BUTON */}
        <button 
          onClick={() => window.open(fileUrl, '_blank')}
          className="flex items-center gap-2 bg-[#FDB912]/10 hover:bg-[#FDB912]/20 text-[#FDB912] px-4 py-2 rounded-lg text-[10px] sm:text-xs font-black tracking-widest uppercase transition-all border border-[#FDB912]/30"
          title="Google Drive engeline takılırsan dosyayı yeni sekmede aç"
        >
          <ExternalLink size={14} /> DOKÜMANI YENİ SEKMEDE AÇ
        </button>
      </div>
      
      <div className="flex-1 w-full bg-[#050505] relative flex flex-col">
        {embedUrl ? (
          <>
            {/* 1. KATMAN: İFRAME (Eğer Google izin verirse burada açılır) */}
            <iframe 
              src={embedUrl} 
              className="absolute inset-0 w-full h-full border-0 z-10"
              title="Adrenalin PDF Viewer"
              allow="autoplay"
            />
            
            {/* 0. KATMAN: İFRAME ENGELLENİRSE ALTTAN ÇIKACAK UYARI (Güvenlik Ağı) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-0 bg-[#050505]">
              <AlertTriangle size={48} className="text-gray-800 mb-4" />
              <p className="text-gray-500 font-mono text-sm mb-6 max-w-md">
                Google Drive güvenlik kalkanı nedeniyle doküman bu alana yansıtılamadı. Lütfen dokümanı yeni sekmede açarak savaşa devam edin.
              </p>
              <button 
                onClick={() => window.open(fileUrl, '_blank')}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold tracking-widest uppercase transition-all flex items-center gap-2"
              >
                <ExternalLink size={18} /> YENİ SEKMEYE GİT
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 font-mono text-sm uppercase">
            [HATA: PDF Bağlantısı Bulunamadı]
          </div>
        )}
      </div>
    </div>
  );
};