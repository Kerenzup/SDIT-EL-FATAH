import React, { useState } from 'react';
import { Account, FixedAsset, JournalEntry } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import { Sparkles, Send, Bot, FileSearch, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';

interface AiFinancialAdvisorProps {
  accounts: Account[];
  journalEntries: JournalEntry[];
  fixedAssets: FixedAsset[];
}

export const AiFinancialAdvisor: React.FC<AiFinancialAdvisorProps> = ({
  accounts,
  journalEntries,
  fixedAssets,
}) => {
  const [question, setQuestion] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Quick preset questions
  const presets = [
    'Evaluasi Kesehatan Keuangan Yayasan berdasarkan standar ISAK 35',
    'Cek Kepatuhan Alokasi & Penggunaan Dana BOS terhadap Beban Operasional',
    'Analisis Rasio Beban SDM (Gaji Guru) terhadap Total Pendapatan Yayasan',
    'Rekomendasi Efisiensi Beban Administrasi & Pemeliharaan Gedung',
  ];

  const handleAskAI = async (queryText?: string) => {
    const activeQuestion = queryText || question;
    if (!activeQuestion) return;

    setLoading(true);
    setErrorMessage(null);

    // Prepare report summary payload
    const totalAset = accounts
      .filter((a) => a.category === 'ASET_LANCAR' || a.category === 'ASET_TETAP')
      .reduce((sum, a) => sum + a.balance, 0);

    const totalKewajiban = accounts
      .filter((a) => a.category === 'KEWAJIBAN')
      .reduce((sum, a) => sum + a.balance, 0);

    const totalAsetNeto = accounts
      .filter((a) => a.category === 'ASET_NETO')
      .reduce((sum, a) => sum + a.balance, 0);

    const totalPendapatan = accounts
      .filter((a) => a.category === 'PENDAPATAN')
      .reduce((sum, a) => sum + a.balance, 0);

    const totalBeban = accounts
      .filter((a) => a.category === 'BEBAN')
      .reduce((sum, a) => sum + a.balance, 0);

    const reportSummary = {
      yayasan: 'Yayasan Pendidikan Widya Nusantara',
      standar: 'ISAK 35',
      totalAset: formatRupiah(totalAset),
      totalKewajiban: formatRupiah(totalKewajiban),
      totalAsetNeto: formatRupiah(totalAsetNeto),
      totalPendapatan: formatRupiah(totalPendapatan),
      totalBeban: formatRupiah(totalBeban),
      surplusTahunBerjalan: formatRupiah(totalPendapatan - totalBeban),
      pendapatanBOS: formatRupiah(accounts.find((a) => a.code === '4101')?.balance || 0),
      pendapatanSPP: formatRupiah(accounts.find((a) => a.code === '4102')?.balance || 0),
      bebanGajiGuru: formatRupiah(accounts.find((a) => a.code === '5101')?.balance || 0),
    };

    try {
      const res = await fetch('/api/ai-financial-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportSummary,
          question: activeQuestion,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Terjadi kesalahan saat memanggil Konsultan AI.');
      }

      setAnalysisResult(data.result);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal memuat rekomendasi AI.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-2xl p-6 text-white border border-emerald-900/40 shadow-xl flex items-start gap-4">
        <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30 shrink-0">
          <Bot className="w-8 h-8" />
        </div>
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 uppercase">
            POWERED BY GEMINI AI
          </span>
          <h2 className="text-xl font-extrabold text-white mt-1">
            Asisten & Konsultan Akuntan ISAK 35 Yayasan
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Dapatkan evaluasi otomatis mengenai kesehatan neraca, rasio likuiditas, kepatuhan juknis dana BOS, serta saran strategis efisiensi beban operasional sekolah secara real-time.
          </p>
        </div>
      </div>

      {/* Preset Action Buttons */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-slate-600">PILIH TOPIK ANALISIS CEPAT:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuestion(preset);
                handleAskAI(preset);
              }}
              className="p-3 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-500 rounded-xl text-left text-xs font-semibold text-slate-800 transition flex items-center justify-between group shadow-sm"
            >
              <div className="flex items-center gap-2">
                <FileSearch className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{preset}</span>
              </div>
              <Sparkles className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Custom Prompt Box */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
        <label className="block text-xs font-bold text-slate-700">Tanyakan sesuatu tentang keuangan yayasan:</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ketik pertanyaan audit/analisis (cth: Apakah saldo kas cukup untuk membayar kewajiban bulan depan?)..."
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-emerald-500 text-slate-900"
          />
          <button
            onClick={() => handleAskAI()}
            disabled={loading || !question}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white font-bold rounded-xl text-xs transition shadow-md flex items-center gap-2 shrink-0"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Menganalisis...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Kirim</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* AI Analysis Result Display */}
      {analysisResult && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-md space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-emerald-800 font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>HASIL AUDIT & REKOMENDASI STRATEGIS ISAK 35</span>
          </div>

          <div className="prose prose-sm text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
            {analysisResult}
          </div>
        </div>
      )}

    </div>
  );
};
