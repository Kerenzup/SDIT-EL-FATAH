import React, { useState } from 'react';
import { ArkasBudgetItem, Account } from '../../types';
import {
  PieChart,
  DollarSign,
  TrendingUp,
  PlusCircle,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Target,
  Clock,
} from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';

interface ArkasBudgetViewProps {
  arkasBudget: ArkasBudgetItem[];
  onAddBudgetItem: (item: Omit<ArkasBudgetItem, 'id' | 'code'>) => void;
}

export const ArkasBudgetView: React.FC<ArkasBudgetViewProps> = ({
  arkasBudget,
  onAddBudgetItem,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [activityName, setActivityName] = useState('');
  const [category, setCategory] = useState<'OPERASIONAL' | 'BELANJA_BARANG' | 'BELANJA_MODAL' | 'HONOR_SDM'>('OPERASIONAL');
  const [plannedBudget, setPlannedBudget] = useState<number>(0);
  const [fundingSource, setFundingSource] = useState<'DANA_BOS' | 'DANA_SPP' | 'HIBAH_YAYASAN'>('DANA_BOS');
  const [targetRombel, setTargetRombel] = useState('Rombel Kelas 1 - 6');

  const totalPlanned = arkasBudget.reduce((acc, b) => acc + b.plannedBudget, 0);
  const totalRealized = arkasBudget.reduce((acc, b) => acc + b.realizedAmount, 0);
  const totalVariance = totalPlanned - totalRealized;
  const realizationPercentage = totalPlanned > 0 ? Math.round((totalRealized / totalPlanned) * 100) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityName || plannedBudget <= 0) return;

    onAddBudgetItem({
      activityName,
      category,
      plannedBudget,
      realizedAmount: 0,
      fundingSource,
      targetRombel,
    });

    setActivityName('');
    setPlannedBudget(0);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 rounded-3xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-700">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-black rounded-full border border-emerald-500/30">
            <FileSpreadsheet className="w-3.5 h-3.5" /> RKAS & ARKAS (Rencana Kerja & Anggaran Sekolah 1 T.A.)
          </div>
          <h2 className="text-2xl font-black text-white">Anggaran Kegiatan Terencana 1 Tahun (ARKAS)</h2>
          <p className="text-xs text-slate-300">
            Laporan Keuangan Berbasis Kas untuk pengeluaran dana kegiatan yang terencana dalam 1 tahun anggaran.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow flex items-center justify-center gap-2 cursor-pointer transition shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tambah Program Kegiatan ARKAS</span>
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-bold text-slate-500">Total Anggaran Terencana (ARKAS)</p>
          <p className="text-xl font-black text-slate-900">{formatRupiah(totalPlanned)}</p>
          <p className="text-[11px] text-slate-400 font-mono">1 Tahun Ajaran</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-bold text-slate-500">Realisasi Pengeluaran Kas</p>
          <p className="text-xl font-black text-emerald-600">{formatRupiah(totalRealized)}</p>
          <p className="text-[11px] text-emerald-700 font-extrabold">{realizationPercentage}% Terpenuhi</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-bold text-slate-500">Sisa Pagu Anggaran Kegiatan</p>
          <p className="text-xl font-black text-blue-600">{formatRupiah(totalVariance)}</p>
          <p className="text-[11px] text-blue-700 font-extrabold">Dana Tersedia</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-bold text-slate-500">Persentase Ketercapaian</p>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mt-2">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(realizationPercentage, 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 font-bold pt-1">{realizationPercentage}% dari Target 1 Tahun</p>
        </div>
      </div>

      {/* ARKAS Budget Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="font-extrabold text-slate-900 text-base">Daftar Rencana Kerja & Anggaran Sekolah (ARKAS)</h3>
          <span className="text-xs font-bold text-slate-500">Total {arkasBudget.length} Program Kegiatan</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 font-bold text-slate-700 border-b border-slate-200">
                <th className="p-3">Kode / Program Kegiatan ARKAS</th>
                <th className="p-3">Kategori & Target Rombel</th>
                <th className="p-3 text-center">Sumber Dana</th>
                <th className="p-3 text-right">Rencana Anggaran (Rp)</th>
                <th className="p-3 text-right">Realisasi Kas (Rp)</th>
                <th className="p-3 text-center">Sisa Pagu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {arkasBudget.map((item) => {
                const itemVar = item.plannedBudget - item.realizedAmount;
                const pct = Math.round((item.realizedAmount / item.plannedBudget) * 100);

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3">
                      <p className="font-extrabold text-slate-900">{item.activityName}</p>
                      <p className="text-[10px] font-mono font-bold text-emerald-800">{item.code}</p>
                    </td>

                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-800 text-[10px] font-bold rounded-md uppercase">
                        {item.category}
                      </span>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.targetRombel || 'Fasilitas Kampus'}</p>
                    </td>

                    <td className="p-3 text-center font-bold text-slate-700">
                      <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[10px]">
                        {item.fundingSource}
                      </span>
                    </td>

                    <td className="p-3 text-right font-mono font-bold text-slate-900">
                      {formatRupiah(item.plannedBudget)}
                    </td>

                    <td className="p-3 text-right font-mono font-bold text-emerald-700">
                      {formatRupiah(item.realizedAmount)}
                    </td>

                    <td className="p-3 text-center font-mono font-bold text-slate-700">
                      {formatRupiah(itemVar)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Budget */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">Tambah Program Kegiatan ARKAS</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">
                Batal
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Program / Kegiatan ARKAS</label>
                <input
                  type="text"
                  value={activityName}
                  onChange={(e) => setActivityName(e.target.value)}
                  placeholder="Contoh: Pemeliharaan Sarana Sanitasi & AC Rombel"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Pengeluaran</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    <option value="OPERASIONAL">OPERASIONAL</option>
                    <option value="BELANJA_BARANG">BELANJA_BARANG</option>
                    <option value="BELANJA_MODAL">BELANJA_MODAL</option>
                    <option value="HONOR_SDM">HONOR_SDM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sumber Alokasi Dana</label>
                  <select
                    value={fundingSource}
                    onChange={(e) => setFundingSource(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    <option value="DANA_BOS">Dana BOS Kemdikbud</option>
                    <option value="DANA_SPP">Dana SPP Operasional</option>
                    <option value="HIBAH_YAYASAN">Dana Hibah Yayasan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Rencana Biaya 1 T.A. (Rp)</label>
                  <input
                    type="number"
                    value={plannedBudget || ''}
                    onChange={(e) => setPlannedBudget(Number(e.target.value))}
                    placeholder="25000000"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Peruntukan Rombel</label>
                  <input
                    type="text"
                    value={targetRombel}
                    onChange={(e) => setTargetRombel(e.target.value)}
                    placeholder="Rombel Kelas 1 - 6 / Fasilitas"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow"
                >
                  Simpan Ke Rencana ARKAS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
