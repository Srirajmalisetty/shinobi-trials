import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { certificateApi } from '../api/certificateApi';
import { Certificate } from '../types/quiz';
import { useSoundEffect } from '../hooks/useSoundEffect';
import { tokenStorage } from '../utils/tokenStorage';

export const CertificatePage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const { playSound } = useSoundEffect();
  const [cert, setCert] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<boolean>(false);

  useEffect(() => {
    if (!code) return;
    setLoading(true);
    certificateApi.getCertificate(code)
      .then((data) => {
        setCert(data);
        setLoading(false);
        // Certificate scroll finished unrolling
        playSound('unlock');
      })
      .catch((err) => {
        console.error('Failed to load certificate:', err);
        setError('Official shinobi diploma not found or invalid registry code.');
        setLoading(false);
      });
  }, [code]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <div className="w-12 h-12 border-4 border-tertiary border-t-transparent rounded-full animate-spin"></div>
        <span className="font-label text-sm text-tertiary uppercase tracking-wider">
          Unrolling Grand Shinobi Scroll...
        </span>
      </div>
    );
  }

  if (error || !cert) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <span className="material-symbols-outlined text-5xl text-red-400 mb-3">gavel</span>
        <h2 className="font-headline font-bold text-2xl text-on-surface mb-2">Diploma Not Found</h2>
        <p className="font-body text-sm text-on-surface-variant mb-6">{error || 'Certificate records could not be verified.'}</p>
        <Link
          to="/missions"
          onClick={() => playSound('click')}
          className="px-6 py-2.5 rounded-xl bg-primary-container text-white font-label text-xs uppercase font-bold"
        >
          Explore Available Trials
        </Link>
      </div>
    );
  }

  const pdfDownloadUrl = certificateApi.getPdfDownloadUrl(cert.certificateCode);

  const handleDownloadPdf = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (downloading || !cert) return;
    playSound('unlock');
    setDownloading(true);

    try {
      const token = tokenStorage.getToken();
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await fetch(pdfDownloadUrl, { headers });
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
      }
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `shinobi-certificate-${cert.certificateCode}.pdf`;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }, 200);
    } catch (err) {
      console.error('Blob PDF download failed, falling back to window open:', err);
      window.open(pdfDownloadUrl, '_blank');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen py-12 max-w-4xl mx-auto px-4 w-full items-center">
      {/* Action Header */}
      <div className="w-full flex items-center justify-between gap-4 mb-6">
        <Link
          to="/missions"
          onClick={() => playSound('click')}
          className="text-on-surface-variant hover:text-on-surface font-label text-xs flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Mission Board
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { playSound('click'); window.print(); }}
            className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label text-xs uppercase flex items-center gap-1.5 border border-[#28283d]"
          >
            <span className="material-symbols-outlined text-base">print</span>
            Print Scroll
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-primary-container to-tertiary hover:opacity-95 disabled:opacity-50 text-white font-label font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(255,107,26,0.4)] transition"
          >
            <span className="material-symbols-outlined text-base">
              {downloading ? 'hourglass_top' : 'download'}
            </span>
            <span>{downloading ? 'Inscribing PDF...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      {/* Official Ninja Scroll Diploma (Stitch Replica) */}
      <div className="w-full bg-[#111125] p-8 sm:p-14 rounded-3xl border-4 border-[#ffc93c] relative shadow-[0_0_50px_rgba(244,191,50,0.2)] overflow-hidden">
        {/* Inner double border */}
        <div className="border border-[#ff6b1a]/40 p-6 sm:p-10 rounded-2xl bg-[#1a1a2e]/90 relative">
          {/* Watermark leaf crest */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
            <span className="material-symbols-outlined text-[300px]">shield</span>
          </div>

          {/* Seal Ribbon Top */}
          <div className="text-center mb-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-lowest border border-[#ffc93c]/50 text-tertiary font-label text-xs uppercase tracking-widest font-bold mb-4 shadow-sm">
              <span className="material-symbols-outlined text-sm text-primary">local_fire_department</span>
              Hidden Leaf Academy • Grand Council Directive
            </div>
            <h1 className="font-headline font-black text-3xl sm:text-5xl uppercase tracking-tight text-white mb-2">
              Official Shinobi Diploma
            </h1>
            <p className="font-body italic text-sm sm:text-base text-on-surface-variant">
              This grand scroll testifies before the Five Nations that
            </p>
          </div>

          {/* Student Shinobi Name */}
          <div className="text-center my-6 relative z-10">
            <h2 className="font-headline font-black text-3xl sm:text-5xl text-primary tracking-wide uppercase">
              {cert.studentName}
            </h2>
            <div className="w-48 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-2"></div>
          </div>

          {/* Exam Details */}
          <div className="text-center mb-8 relative z-10 max-w-xl mx-auto">
            <p className="font-body text-sm sm:text-base text-on-surface-variant leading-relaxed">
              has satisfactorily completed the intense qualification trial of
            </p>
            <h3 className="font-headline font-bold text-xl sm:text-2xl text-white mt-1 mb-3">
              {cert.quizTitle}
            </h3>
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-label text-xs font-bold uppercase tracking-wider">
              <span>Domain: {cert.topicName}</span>
              <span>•</span>
              <span>Rank: {cert.ninjaRank}-Rank Shinobi</span>
            </div>
          </div>

          {/* Score Banner */}
          <div className="text-center my-6 relative z-10">
            <span className="font-label text-sm uppercase tracking-wider text-tertiary font-bold px-4 py-2 rounded-full bg-surface-container-lowest border border-[#28283d] inline-block">
              Chakra Mastery Score: <span className="text-white font-extrabold">{cert.scorePercentage}%</span>
            </span>
          </div>

          {/* Signatures & QR Seal */}
          <div className="mt-12 pt-8 border-t border-[#28283d] flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
            {/* Left Signature */}
            <div className="text-center sm:text-left">
              <div className="w-40 border-b border-[#5a4137] pb-1 mb-1">
                <span className="font-body italic text-sm text-primary font-semibold">Uzumaki Naruto</span>
              </div>
              <span className="font-label text-[11px] uppercase tracking-wider text-on-surface-variant block">
                Lord Seventh Hokage
              </span>
            </div>

            {/* Center QR Verification Code */}
            <div className="flex flex-col items-center">
              <div className="p-2 bg-white rounded-xl shadow-md mb-1">
                {/* Visual QR presentation with verification link */}
                <div className="w-20 h-20 bg-slate-900 rounded-lg flex flex-col items-center justify-center text-white">
                  <span className="material-symbols-outlined text-2xl text-tertiary">qr_code_2</span>
                  <span className="text-[8px] font-mono text-center px-1 font-bold text-amber-300">SCAN VERIFY</span>
                </div>
              </div>
              <span className="font-label text-[10px] text-tertiary uppercase tracking-wider font-bold">
                {cert.certificateCode}
              </span>
            </div>

            {/* Right Signature */}
            <div className="text-center sm:text-right">
              <div className="w-40 border-b border-[#5a4137] pb-1 mb-1 sm:ml-auto">
                <span className="font-body italic text-sm text-secondary font-semibold">Kakashi Hatake</span>
              </div>
              <span className="font-label text-[11px] uppercase tracking-wider text-on-surface-variant block">
                Grand Academy Proctor
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
