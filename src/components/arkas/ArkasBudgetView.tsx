import React, { useState } from 'react';
import { ArkasBudgetItem } from '../../types';
import {
  PlusCircle,
  FileSpreadsheet,
  Edit,
  Trash2,
  Printer,
  X,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  DollarSign,
  PieChart,
  Search,
  Filter,
} from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';
import { printDocument } from '../../utils/printHelper';

interface ArkasBudgetViewProps {
  arkasBudget: ArkasBudgetItem[];
  onAddBudgetItem: (item: Omit<ArkasBudgetItem, 'id' | 'code'>) => void;
  onUpdateBudgetItem?: (item: ArkasBudgetItem) => void;
  onDeleteBudgetItem?: (id: string) => void;
}

export const ArkasBudgetView: React.FC<ArkasBudgetViewProps> = ({
  arkasBudget,
  onAddBudgetItem,
  onUpdateBudgetItem,
  onDeleteBudgetItem,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ArkasBudgetItem | null>(null);

  // Form State
  const [activityName, setActivityName] = useState('');
  const [category, setCategory] = useState<'OPERASIONAL' | 'BELANJA_BARANG' | 'BELANJA_MODAL' | 'HONOR_SDM'>('OPERASIONAL');
  const [plannedBudget, setPlannedBudget] = useState<number>(0);
  const [realizedAmount, setRealizedAmount] = useState<number>(0);
  const [fundingSource, setFundingSource] = useState<'DANA_BOS' | 'DANA_SPP' | 'HIBAH_YAYASAN'>('DANA_BOS');
  const [targetRombel, setTargetRombel] = useState('Rombel Kelas 1 - 6');

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');

  // Delete confirm state
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<ArkasBudgetItem | null>(null);

  const totalPlanned = arkasBudget.reduce((acc, b) => acc + b.plannedBudget, 0);
  const totalRealized = arkasBudget.reduce((acc, b) => acc + b.realizedAmount, 0);
  const totalVariance = totalPlanned - totalRealized;
  const realizationPercentage = totalPlanned > 0 ? Math.round((totalRealized / totalPlanned) * 100) : 0;

  const filteredBudget = arkasBudget.filter((b) => {
    const matchesSearch =
      searchTerm === '' ||
      b.activityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.targetRombel && b.targetRombel.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = categoryFilter === 'ALL' || b.category === categoryFilter;
    const matchesSource = sourceFilter === 'ALL' || b.fundingSource === sourceFilter;

    return matchesSearch && matchesCategory && matchesSource;
  });

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setActivityName('');
    setCategory('OPERASIONAL');
    setPlannedBudget(0);
    setRealizedAmount(0);
    setFundingSource('DANA_BOS');
    setTargetRombel('Rombel Kelas 1 - 6');
    setShowModal(true);
  };

  const handleOpenEditModal = (item: ArkasBudgetItem) => {
    setEditingItem(item);
    setActivityName(item.activityName);
    setCategory(item.category);
    setPlannedBudget(item.plannedBudget);
    setRealizedAmount(item.realizedAmount);
    setFundingSource(item.fundingSource);
    setTargetRombel(item.targetRombel || 'Rombel Kelas 1 - 6');
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityName.trim() || plannedBudget <= 0) {
      alert('Mohon isi nama program kegiatan dan rencana anggaran dengan benar.');
      return;
    }

    if (editingItem && onUpdateBudgetItem) {
      onUpdateBudgetItem({
        ...editingItem,
        activityName: activityName.trim(),
        category,
        plannedBudget,
        realizedAmount,
        fundingSource,
        targetRombel: targetRombel.trim(),
      });
    } else {
      onAddBudgetItem({
        activityName: activityName.trim(),
        category,
        plannedBudget,
        realizedAmount: realizedAmount || 0,
        fundingSource,
        targetRombel: targetRombel.trim(),
      });
    }

    setShowModal(false);
    setEditingItem(null);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmItem && onDeleteBudgetItem) {
      onDeleteBudgetItem(deleteConfirmItem.id);
      setDeleteConfirmItem(null);
    }
  };

  const handlePrintFullArkas = () => {
    printDocument('arkas-full-report-print', `Laporan_ARKAS_1_Tahun_${new Date().getFullYear()}`, {
      orientation: 'landscape',
    });
  };

  const handlePrintSingleItem = (item: ArkasBudgetItem) => {
    printDocument(`arkas-single-item-${item.id}`, `Lembar_Kegiatan_ARKAS_${item.code}`, {
      orientation: 'portrait',
    });
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

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handlePrintFullArkas}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl shadow-md border border-slate-600 flex items-center justify-center gap-2 cursor-pointer transition"
            title="Cetak Seluruh Rekapitulasi Dokumen ARKAS 1 Tahun"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Cetak Rekap ARKAS (PDF)</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow flex items-center justify-center gap-2 cursor-pointer transition shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Program Kegiatan ARKAS</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-bold text-slate-500">Total Anggaran Terencana (ARKAS)</p>
          <p className="text-xl font-black text-slate-900">{formatRupiah(totalPlanned)}</p>
          <p className="text-[11px] text-slate-400 font-mono">1 Tahun Ajaran (2026/2027)</p>
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

      {/* ARKAS Budget Table & Controls */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Daftar Rencana Kerja & Anggaran Sekolah (ARKAS)</h3>
            <p className="text-xs text-slate-500">Total {filteredBudget.length} dari {arkasBudget.length} Program Kegiatan Terdaftar</p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari program / kode / rombel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="ALL">Semua Kategori</option>
              <option value="OPERASIONAL">OPERASIONAL</option>
              <option value="BELANJA_BARANG">BELANJA_BARANG</option>
              <option value="BELANJA_MODAL">BELANJA_MODAL</option>
              <option value="HONOR_SDM">HONOR_SDM</option>
            </select>

            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="ALL">Semua Sumber Dana</option>
              <option value="DANA_BOS">Dana BOS</option>
              <option value="DANA_SPP">Dana SPP</option>
              <option value="HIBAH_YAYASAN">Hibah Yayasan</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-bold border-b border-slate-800">
                <th className="p-3 w-12 text-center">No</th>
                <th className="p-3">Kode & Program Kegiatan ARKAS</th>
                <th className="p-3">Kategori & Target Rombel</th>
                <th className="p-3 text-center">Sumber Dana</th>
                <th className="p-3 text-right">Rencana Anggaran (Rp)</th>
                <th className="p-3 text-right">Realisasi Kas (Rp)</th>
                <th className="p-3 text-center">Sisa Pagu</th>
                <th className="p-3 text-center w-36">Aksi (Edit / Hapus / Cetak)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBudget.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 font-semibold">
                    Tidak ada data program ARKAS yang cocok dengan kriteria filter atau pencarian.
                  </td>
                </tr>
              ) : (
                filteredBudget.map((item, idx) => {
                  const itemVar = item.plannedBudget - item.realizedAmount;
                  const pct = item.plannedBudget > 0 ? Math.round((item.realizedAmount / item.plannedBudget) * 100) : 0;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3 text-center font-bold text-slate-500">{idx + 1}</td>
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
                        <span className="block text-[10px] text-slate-400 font-normal">({pct}%)</span>
                      </td>

                      <td className="p-3 text-center font-mono font-bold text-slate-700">
                        <span className={itemVar < 0 ? 'text-rose-600 font-black' : 'text-blue-700 font-bold'}>
                          {formatRupiah(itemVar)}
                        </span>
                      </td>

                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Edit Button */}
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition cursor-pointer"
                            title="Edit Kegiatan ARKAS"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => setDeleteConfirmItem(item)}
                            className="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg transition cursor-pointer"
                            title="Hapus Kegiatan ARKAS"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Printer Button */}
                          <button
                            onClick={() => handlePrintSingleItem(item)}
                            className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition cursor-pointer"
                            title="Cetak Lembar Dokumen RKAS Kegiatan Ini"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-black text-slate-900 border-t-2 border-slate-300">
                <td colSpan={4} className="p-3 text-right uppercase text-[11px]">
                  Total Seluruh Rencana Anggaran (ARKAS):
                </td>
                <td className="p-3 text-right font-mono text-xs">{formatRupiah(totalPlanned)}</td>
                <td className="p-3 text-right font-mono text-xs text-emerald-700">{formatRupiah(totalRealized)}</td>
                <td className="p-3 text-center font-mono text-xs text-blue-700">{formatRupiah(totalVariance)}</td>
                <td className="p-3 text-center text-[10px] text-slate-500 font-bold">100% Sah & Resmi</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Budget */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-slate-900 text-base">
                  {editingItem ? 'Edit Program Kegiatan ARKAS' : 'Tambah Program Kegiatan ARKAS'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingItem(null);
                }}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {editingItem && (
                <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center justify-between font-mono">
                  <span>Kode Dokumen:</span>
                  <span className="font-black text-blue-950">{editingItem.code}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Program / Kegiatan ARKAS <span className="text-rose-500">*</span>
                </label>
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Rencana Anggaran 1 T.A. (Rp) <span className="text-rose-500">*</span>
                  </label>
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">Realisasi Kas Berjalan (Rp)</label>
                  <input
                    type="number"
                    value={realizedAmount || ''}
                    onChange={(e) => setRealizedAmount(Number(e.target.value))}
                    placeholder="0"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Peruntukan Rombel / Sasaran</label>
                <input
                  type="text"
                  value={targetRombel}
                  onChange={(e) => setTargetRombel(e.target.value)}
                  placeholder="Rombel Kelas 1 - 6 / Fasilitas Kampus"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingItem ? 'Simpan Perubahan ARKAS' : 'Simpan Ke Rencana ARKAS'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-3 bg-rose-100 rounded-2xl">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Hapus Program ARKAS?</h3>
                <p className="text-xs text-slate-500 font-mono">{deleteConfirmItem.code}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Apakah Anda yakin ingin menghapus kegiatan <strong>"{deleteConfirmItem.activityName}"</strong> dengan rencana anggaran{' '}
              <strong>{formatRupiah(deleteConfirmItem.plannedBudget)}</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteConfirmItem(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow transition"
              >
                Ya, Hapus Kegiatan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= HIDDEN PRINTABLE ELEMENTS ================= */}
      <div className="hidden" aria-hidden="true">
        {/* 1. Full ARKAS 1-Year Report Print */}
        <div id="arkas-full-report-print" className="p-8 space-y-6 bg-white text-slate-900 font-sans">
          <div className="text-center border-b-2 border-slate-900 pb-4">
            <h2 className="text-xl font-black uppercase tracking-wide">
              RENCANA KERJA & ANGGARAN SEKOLAH (ARKAS) 1 TAHUN AJARAN
            </h2>
            <p className="text-sm font-extrabold">SDIT EL-FATAH &bull; YAYASAN PENDIDIKAN DAARUL HABIBAH</p>
            <p className="text-xs text-slate-600">
              Tahun Anggaran 2026/2027 &bull; Berbasis Akuntansi Pesantren & Kemdikbud
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-xs font-bold bg-slate-100 p-4 rounded-lg">
            <div>
              <p className="text-slate-500">Total Rencana Anggaran (ARKAS):</p>
              <p className="text-base font-black text-slate-900">{formatRupiah(totalPlanned)}</p>
            </div>
            <div>
              <p className="text-slate-500">Total Realisasi Pengeluaran Kas:</p>
              <p className="text-base font-black text-emerald-700">{formatRupiah(totalRealized)} ({realizationPercentage}%)</p>
            </div>
            <div>
              <p className="text-slate-500">Sisa Pagu Tersedia:</p>
              <p className="text-base font-black text-blue-700">{formatRupiah(totalVariance)}</p>
            </div>
          </div>

          <table className="w-full text-left text-xs border-collapse border border-slate-400">
            <thead>
              <tr className="bg-slate-200 font-black">
                <th className="border border-slate-400 p-2 text-center w-8">No</th>
                <th className="border border-slate-400 p-2">Kode</th>
                <th className="border border-slate-400 p-2">Nama Program / Kegiatan ARKAS</th>
                <th className="border border-slate-400 p-2">Kategori</th>
                <th className="border border-slate-400 p-2">Target Rombel</th>
                <th className="border border-slate-400 p-2 text-center">Sumber Dana</th>
                <th className="border border-slate-400 p-2 text-right">Rencana (Rp)</th>
                <th className="border border-slate-400 p-2 text-right">Realisasi (Rp)</th>
                <th className="border border-slate-400 p-2 text-right">Sisa Pagu (Rp)</th>
              </tr>
            </thead>
            <tbody>
              {arkasBudget.map((item, idx) => (
                <tr key={`print-ark-${item.id}`}>
                  <td className="border border-slate-400 p-2 text-center">{idx + 1}</td>
                  <td className="border border-slate-400 p-2 font-mono font-bold">{item.code}</td>
                  <td className="border border-slate-400 p-2 font-bold">{item.activityName}</td>
                  <td className="border border-slate-400 p-2">{item.category}</td>
                  <td className="border border-slate-400 p-2">{item.targetRombel || '-'}</td>
                  <td className="border border-slate-400 p-2 text-center font-bold">{item.fundingSource}</td>
                  <td className="border border-slate-400 p-2 text-right font-mono">{formatRupiah(item.plannedBudget)}</td>
                  <td className="border border-slate-400 p-2 text-right font-mono">{formatRupiah(item.realizedAmount)}</td>
                  <td className="border border-slate-400 p-2 text-right font-mono font-bold">
                    {formatRupiah(item.plannedBudget - item.realizedAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-extrabold border-t-2 border-slate-400">
                <td colSpan={6} className="border border-slate-400 p-2 text-right uppercase">
                  Total Anggaran 1 Tahun:
                </td>
                <td className="border border-slate-400 p-2 text-right font-mono font-black">{formatRupiah(totalPlanned)}</td>
                <td className="border border-slate-400 p-2 text-right font-mono font-black text-emerald-800">{formatRupiah(totalRealized)}</td>
                <td className="border border-slate-400 p-2 text-right font-mono font-black text-blue-800">{formatRupiah(totalVariance)}</td>
              </tr>
            </tfoot>
          </table>

          <div className="grid grid-cols-3 gap-6 pt-10 text-center text-xs">
            <div>
              <p>Mengetahui,</p>
              <p className="font-bold">Ketua Yayasan Pendidikan Daarul Habibah</p>
              <div className="h-16"></div>
              <p className="font-bold underline">Ubaidillah, M.Pd</p>
              <p className="text-[10px] text-slate-500 font-mono">NIY: 1980010101</p>
            </div>
            <div>
              <p>Diverifikasi oleh,</p>
              <p className="font-bold">Bendahara Sekolah & Yayasan</p>
              <div className="h-16"></div>
              <p className="font-bold underline">Hj. Siti Aminah, S.E.</p>
              <p className="text-[10px] text-slate-500 font-mono">NIPY: 1987051403</p>
            </div>
            <div>
              <p>
                Kabupaten Tangerang,{' '}
                {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <p className="font-bold">Kepala Sekolah SDIT EL-FATAH</p>
              <div className="h-16"></div>
              <p className="font-bold underline">Masykur Rohana, S.Sos</p>
              <p className="text-[10px] text-slate-500 font-mono">NIPY: 1985031201</p>
            </div>
          </div>
        </div>

        {/* 2. Individual Single Item RKAS Print Slips */}
        {arkasBudget.map((item) => (
          <div
            key={`print-single-${item.id}`}
            id={`arkas-single-item-${item.id}`}
            className="p-8 space-y-6 bg-white text-slate-900 font-sans"
          >
            <div className="text-center border-b-2 border-slate-900 pb-3">
              <h2 className="text-lg font-black uppercase">LEMBAR PERENCANAAN & PENGAJUAN KEGIATAN ARKAS</h2>
              <p className="text-xs font-bold">SDIT EL-FATAH &bull; YAYASAN PENDIDIKAN DAARUL HABIBAH</p>
              <p className="text-[11px] text-slate-600">Kode Dokumen: {item.code}</p>
            </div>

            <div className="border border-slate-300 rounded-lg p-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <p><strong>Nama Program Kegiatan:</strong> {item.activityName}</p>
                <p><strong>Kode Registrasi:</strong> {item.code}</p>
                <p><strong>Kategori Anggaran:</strong> {item.category}</p>
                <p><strong>Sumber Alokasi Dana:</strong> {item.fundingSource}</p>
                <p><strong>Target Sasaran / Rombel:</strong> {item.targetRombel || 'Fasilitas Kampus'}</p>
                <p><strong>Tahun Anggaran:</strong> 2026/2027</p>
              </div>
            </div>

            <table className="w-full text-left text-xs border-collapse border border-slate-400">
              <thead>
                <tr className="bg-slate-200">
                  <th className="border border-slate-400 p-2">Rencana Anggaran (Rp)</th>
                  <th className="border border-slate-400 p-2">Realisasi Berjalan (Rp)</th>
                  <th className="border border-slate-400 p-2">Sisa Pagu Tersedia (Rp)</th>
                  <th className="border border-slate-400 p-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-400 p-3 font-mono font-bold text-sm">{formatRupiah(item.plannedBudget)}</td>
                  <td className="border border-slate-400 p-3 font-mono font-bold text-sm text-emerald-700">{formatRupiah(item.realizedAmount)}</td>
                  <td className="border border-slate-400 p-3 font-mono font-bold text-sm text-blue-700">
                    {formatRupiah(item.plannedBudget - item.realizedAmount)}
                  </td>
                  <td className="border border-slate-400 p-3 text-center font-bold">TERENCANA & AKTIF</td>
                </tr>
              </tbody>
            </table>

            <div className="grid grid-cols-2 gap-8 pt-8 text-center text-xs">
              <div>
                <p>Pengusul Kegiatan,</p>
                <p className="font-bold">Kepala Sekolah SDIT EL-FATAH</p>
                <div className="h-16"></div>
                <p className="font-bold underline">Masykur Rohana, S.Sos</p>
                <p className="text-[10px] text-slate-500 font-mono">NIPY: 1985031201</p>
              </div>
              <div>
                <p>Disetujui oleh,</p>
                <p className="font-bold">Bendahara & Ketua Yayasan</p>
                <div className="h-16"></div>
                <p className="font-bold underline">Ubaidillah, M.Pd</p>
                <p className="text-[10px] text-slate-500 font-mono">NIY: 1980010101</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
