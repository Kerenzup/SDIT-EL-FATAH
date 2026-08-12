import React from 'react';
import { FoundationProfile } from '../../types';
import { formatRupiah, numberToWordsID, formatDateIndonesian } from '../../utils/formatters';
import { printDocument } from '../../utils/printHelper';
import { Printer, X, CheckCircle, ShieldCheck } from 'lucide-react';

interface ReceiptModalProps {
  receiptNo: string;
  receivedFrom: string;
  amount: number;
  forPayment: string;
  date: string;
  category: string;
  foundationProfile?: FoundationProfile;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  receiptNo,
  receivedFrom,
  amount,
  forPayment,
  date,
  category,
  foundationProfile,
  onClose,
}) => {
  const isPayroll =
    category?.toLowerCase().includes('gaji') ||
    category?.toLowerCase().includes('slip') ||
    category?.toLowerCase().includes('payroll') ||
    forPayment?.toLowerCase().includes('gaji');

  const handlePrint = () => {
    printDocument('printable-receipt', `Kuitansi Pembayaran - ${receiptNo}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm">
              {isPayroll ? 'SLIP GAJI & BUKTI PEMBAYARAN RESMI' : 'BUKTI PEMBAYARAN RESMI / KUITANSI YAYASAN'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Body */}
        <div id="printable-receipt" className="p-8 space-y-6">
          
          {/* Header Kop Kuitansi */}
          <div className="border-b-2 border-slate-900 pb-4 text-center">
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-wide">
              {foundationProfile?.name?.toUpperCase() || 'YAYASAN PENDIDIKAN WIDYA NUSANTARA'}
            </h2>
            <p className="text-[11px] text-slate-600 font-medium">
              {foundationProfile?.address || 'Jl. Pendidikan No. 45, Kompleks Sekolah Widya Nusantara'} &bull; Telp: {foundationProfile?.phone || '(021) 7890123'}
            </p>
            <div className="mt-2 inline-block px-3 py-1 bg-emerald-100 text-emerald-900 font-black text-xs rounded-full uppercase tracking-wider">
              {isPayroll ? 'SLIP GAJI & KUITANSI PAYROLL' : `KUITANSI ${category}`}
            </div>
          </div>

          {/* Details Table */}
          <div className="space-y-3 text-xs text-slate-800">
            <div className="flex justify-between items-center text-slate-500 font-mono">
              <span>No. Kuitansi: <strong className="text-slate-900">{receiptNo}</strong></span>
              <span>Tanggal: {formatDateIndonesian(date)}</span>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="grid grid-cols-4 gap-2 py-1">
                <span className="text-slate-500 font-medium">
                  {isPayroll ? 'Diserahkan Kepada:' : 'Telah Diterima Dari:'}
                </span>
                <span className="col-span-3 font-extrabold text-slate-900 text-sm">{receivedFrom}</span>
              </div>

              <div className="grid grid-cols-4 gap-2 py-1">
                <span className="text-slate-500 font-medium">Uang Sejumlah:</span>
                <span className="col-span-3 italic font-semibold text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-200">
                  "{numberToWordsID(amount)}"
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 py-1">
                <span className="text-slate-500 font-medium">Untuk Pembayaran:</span>
                <span className="col-span-3 font-semibold text-slate-900">{forPayment}</span>
              </div>
            </div>

            {/* Total Box */}
            <div className="mt-4 p-4 bg-emerald-50 border-2 border-emerald-500 rounded-xl flex items-center justify-between">
              <span className="text-xs font-black text-emerald-900 uppercase">
                {isPayroll ? 'Gaji Bersih Diterima (THP):' : 'Jumlah Pembayaran:'}
              </span>
              <span className="font-mono text-xl font-black text-emerald-900">{formatRupiah(amount)}</span>
            </div>
          </div>

          {/* Signatures */}
          <div className="pt-6 grid grid-cols-2 text-center text-xs text-slate-700">
            <div>
              <p className="text-slate-500 mb-14">
                {isPayroll ? 'Penerima Gaji / Pegawai,' : 'Penyetor / Siswa,'}
              </p>
              <p className="font-bold underline">{receivedFrom}</p>
            </div>
            <div>
              <p className="text-slate-500 mb-14">Kasir / Bendahara Yayasan,</p>
              <p className="font-bold underline">{foundationProfile?.treasurerName || 'Hj. Nurul Aini, S.E.'}</p>
              <p className="text-[10px] text-slate-500">Stempel & Tanda Tangan Sah</p>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition"
          >
            Selesai
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Kuitansi</span>
          </button>
        </div>

      </div>
    </div>
  );
};
