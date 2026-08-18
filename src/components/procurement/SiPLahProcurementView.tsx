import React, { useState } from 'react';
import {
  SiPLahProcurement,
  ProcurementStatus,
  Account,
  FixedAsset,
  JournalEntry,
  UserRole,
} from '../../types';
import {
  ShoppingBag,
  PlusCircle,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck2,
  Building,
  DollarSign,
  ShieldCheck,
  UserCheck,
  PackageCheck,
  FileText,
  Filter,
  Layers,
  ArrowRight,
  TrendingUp,
  FileUp,
} from 'lucide-react';
import { formatRupiah, formatDateIndonesian } from '../../utils/formatters';
import { MediaUploader } from '../common/MediaUploader';

interface SiPLahProcurementViewProps {
  procurements: SiPLahProcurement[];
  accounts: Account[];
  currentRole: UserRole;
  onProposeProcurement: (procurement: Omit<SiPLahProcurement, 'id' | 'code' | 'status'>) => void;
  onApproveByTreasurer: (id: string, treasurerName: string) => void;
  onAcknowledgeByChairman: (id: string, chairmanName: string) => void;
  onDisburseProcurement: (id: string) => void;
}

export const SiPLahProcurementView: React.FC<SiPLahProcurementViewProps> = ({
  procurements,
  accounts,
  currentRole,
  onProposeProcurement,
  onApproveByTreasurer,
  onAcknowledgeByChairman,
  onDisburseProcurement,
}) => {
  const [showFormModal, setShowFormModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Form State for proposing procurement
  const [title, setTitle] = useState('');
  const [merchantName, setMerchantName] = useState('');
  const [category, setCategory] = useState<'ASET_TETAP' | 'PERLENGKAPAN_ATK' | 'JASA_OPERASIONAL' | 'BUKU_MODUL'>(
    'PERLENGKAPAN_ATK'
  );
  const [amount, setAmount] = useState<number>(0);
  const [proposedBy, setProposedBy] = useState('Masykur Rohana, S.Sos (Kepala Sekolah)');
  const [fundingSource, setFundingSource] = useState<'DANA_BOS' | 'DANA_SPP' | 'HIBAH_YAYASAN'>('DANA_BOS');
  const [debitAccountCode, setDebitAccountCode] = useState('5112');
  const [notes, setNotes] = useState('');
  const [proofFileUrl, setProofFileUrl] = useState('');

  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || amount <= 0) return;

    const selectedAcc = accounts.find((a) => a.code === debitAccountCode);
    const debitAccountName = selectedAcc ? selectedAcc.name : 'Beban Operasional';

    onProposeProcurement({
      title,
      merchantName,
      category,
      amount,
      proposedBy,
      proposedDate: new Date().toISOString().split('T')[0],
      fundingSource,
      debitAccountCode,
      debitAccountName,
      notes,
    });

    // Reset Form
    setTitle('');
    setMerchantName('');
    setAmount(0);
    setNotes('');
    setShowFormModal(false);
  };

  const filteredProcurements = procurements.filter((p) => {
    if (filterStatus === 'ALL') return true;
    return p.status === filterStatus;
  });

  const totalAmountProcurements = procurements.reduce((acc, p) => acc + p.amount, 0);
  const totalDisbursed = procurements
    .filter((p) => p.status === 'DICAIRKAN')
    .reduce((acc, p) => acc + p.amount, 0);

  const getStatusBadge = (status: ProcurementStatus) => {
    switch (status) {
      case 'DIUSULKAN_KEPSEK':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200">
            <Clock className="w-3 h-3 text-blue-600" />
            1. Diusulkan Kepala Sekolah
          </span>
        );
      case 'DISETUJUI_BENDAHARA':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
            <UserCheck className="w-3 h-3 text-amber-600" />
            2. Disetujui Bendahara Yayasan
          </span>
        );
      case 'DIKETAHUI_KETUA':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-800 border border-purple-200">
            <ShieldCheck className="w-3 h-3 text-purple-600" />
            3. Diketahui Ketua Yayasan
          </span>
        );
      case 'DICAIRKAN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            4. Teraplikasi & Dicairkan
          </span>
        );
      case 'DITOLAK':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            Pengusulan Ditolak
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Controls */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 rounded-3xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-700">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-black rounded-full border border-emerald-500/30">
            <ShoppingBag className="w-3.5 h-3.5" /> Modul Pengeluaran Belanja SiPLah Regulasi Pemerintah
          </div>
          <h2 className="text-2xl font-black text-white">Belanja Barang & Jasa Sekolah (SiPLah)</h2>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Pengusulan berjenjang oleh Kepala Sekolah &rarr; Disetujui Bendahara Yayasan &rarr; Diketahui Ketua Yayasan
            &rarr; Terintegrasi Otomatis dengan Laporan Keuangan (Kas & Neraca).
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {(currentRole === 'SUPERADMIN' ||
            currentRole === 'KEPALA_SEKOLAH' ||
            currentRole === 'BENDAHARA_SEKOLAH') && (
            <button
              onClick={() => setShowFormModal(true)}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Usulkan Belanja Barang Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500">Total Usulan SiPLah</p>
            <p className="text-xl font-black text-slate-900">{procurements.length} Pengajuan</p>
            <p className="text-[11px] text-slate-400 font-mono">{formatRupiah(totalAmountProcurements)}</p>
          </div>
          <div className="p-3 bg-blue-100 text-blue-800 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500">Menunggu Persetujuan Yayasan</p>
            <p className="text-xl font-black text-amber-600">
              {procurements.filter((p) => p.status !== 'DICAIRKAN' && p.status !== 'DITOLAK').length} Pengajuan
            </p>
            <p className="text-[11px] text-slate-400 font-medium">Multi-stage Approval</p>
          </div>
          <div className="p-3 bg-amber-100 text-amber-800 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500">Realisasi Pencairan Keuangan</p>
            <p className="text-xl font-black text-emerald-600">{formatRupiah(totalDisbursed)}</p>
            <p className="text-[11px] text-emerald-700 font-extrabold">Terbuku di Jurnal & Neraca</p>
          </div>
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-extrabold text-slate-700">Filter Status Approval:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { id: 'ALL', label: 'Semua Status' },
            { id: 'DIUSULKAN_KEPSEK', label: '1. Pengusulan Kepsek' },
            { id: 'DISETUJUI_BENDAHARA', label: '2. Disetujui Bendahara' },
            { id: 'DIKETAHUI_KETUA', label: '3. Diketahui Ketua' },
            { id: 'DICAIRKAN', label: '4. Dicairkan & Terbuku' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterStatus === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Procurement List */}
      <div className="space-y-4">
        {filteredProcurements.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-xs font-medium">
            Tidak ada data belanja barang SiPLah pada filter status ini.
          </div>
        ) : (
          filteredProcurements.map((proc) => (
            <div
              key={proc.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-black text-emerald-800 px-2.5 py-0.5 bg-emerald-100 rounded-md">
                      {proc.code}
                    </span>
                    <span className="text-xs font-bold text-slate-500">&bull; Merchant: {proc.merchantName}</span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base">{proc.title}</h3>
                </div>

                <div className="flex flex-col md:items-end gap-1">
                  <p className="text-lg font-black text-slate-900">{formatRupiah(proc.amount)}</p>
                  <div>{getStatusBadge(proc.status)}</div>
                </div>
              </div>

              {/* Workflow Audit Trail Stepper */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs">
                {/* Step 1: Proposal */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                      1
                    </div>
                    <span>Diusulkan Kepala Sekolah</span>
                  </div>
                  <p className="text-[11px] text-slate-600">{proc.proposedBy}</p>
                  <p className="text-[10px] text-slate-400 font-mono">Tgl: {formatDateIndonesian(proc.proposedDate)}</p>
                </div>

                {/* Step 2: Treasurer Approval */}
                <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0 sm:pl-3">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <div
                      className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold ${
                        proc.approvedByTreasurer ? 'bg-amber-600 text-white' : 'bg-slate-300 text-slate-600'
                      }`}
                    >
                      2
                    </div>
                    <span>Disetujui Bendahara Yayasan</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {proc.approvedByTreasurer || 'Menunggu Persetujuan Bendahara...'}
                  </p>
                  {proc.approvedTreasurerDate && (
                    <p className="text-[10px] text-slate-400 font-mono">
                      Tgl: {formatDateIndonesian(proc.approvedTreasurerDate)}
                    </p>
                  )}
                </div>

                {/* Step 3: Chairman Acknowledgment */}
                <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0 sm:pl-3">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <div
                      className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold ${
                        proc.acknowledgedByChairman ? 'bg-purple-600 text-white' : 'bg-slate-300 text-slate-600'
                      }`}
                    >
                      3
                    </div>
                    <span>Diketahui Ketua Yayasan</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {proc.acknowledgedByChairman || 'Menunggu Diketahui Ketua...'}
                  </p>
                  {proc.acknowledgedChairmanDate && (
                    <p className="text-[10px] text-slate-400 font-mono">
                      Tgl: {formatDateIndonesian(proc.acknowledgedChairmanDate)}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons Based on Role & Status */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="text-xs text-slate-500">
                  Sumber Dana: <span className="font-bold text-slate-800">{proc.fundingSource}</span> &bull; Akun
                  Debet: <span className="font-bold text-slate-800">{proc.debitAccountName} ({proc.debitAccountCode})</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Bendahara Yayasan Action */}
                  {proc.status === 'DIUSULKAN_KEPSEK' && (
                    <button
                      onClick={() =>
                        onApproveByTreasurer(proc.id, 'Hj. Nurul Aini, S.E., M.Ak (Bendahara Yayasan)')
                      }
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5 cursor-pointer transition"
                      title="Menyetujui usulan dan secara otomatis mencatat pengeluaran di Laporan Keuangan ISAK 35"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Setujui & Catat Otomatis ke Laporan Keuangan</span>
                    </button>
                  )}

                  {/* Ketua Yayasan Action */}
                  {proc.status === 'DISETUJUI_BENDAHARA' && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                        <span>Tercatat Otomatis di Jurnal & Lap. Keuangan</span>
                      </div>
                      <button
                        onClick={() =>
                          onAcknowledgeByChairman(proc.id, 'Drs. H. M. Syukri, M.M (Ketua Yayasan)')
                        }
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5 cursor-pointer transition"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Ketahui Sebagai Ketua Yayasan</span>
                      </button>
                    </div>
                  )}

                  {/* Disburse Action (Bendahara Sekolah / Kepsek) */}
                  {proc.status === 'DIKETAHUI_KETUA' && (
                    <button
                      onClick={() => onDisburseProcurement(proc.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5 cursor-pointer"
                    >
                      <PackageCheck className="w-4 h-4" />
                      <span>Tandai Selesai / Pencairan Fisik</span>
                    </button>
                  )}

                  {proc.status === 'DICAIRKAN' && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Terbuku di Jurnal, Laporan Keuangan & Register Aset</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Form Propose Procurement */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">Usulan Belanja Barang / Jasa (SiPLah)</h3>
              </div>
              <button onClick={() => setShowFormModal(false)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">
                Batal
              </button>
            </div>

            <form onSubmit={handleSubmitProposal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul / Rincian Pengadaan Barang</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Pengadaan 10 Unit Laptop Core i5 Lab Komputer"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Penyedia / Toko SiPLah</label>
                  <input
                    type="text"
                    value={merchantName}
                    onChange={(e) => setMerchantName(e.target.value)}
                    placeholder="Contoh: PT Gramedia / Tokopedia SiPLah"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Pengeluaran</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="ASET_TETAP">Aset Tetap (Komputer, Mebel, Peralatan)</option>
                    <option value="BUKU_MODUL">Buku Cetak & Modul Siswa</option>
                    <option value="PERLENGKAPAN_ATK">Perlengkapan ATK Kelas</option>
                    <option value="JASA_OPERASIONAL">Jasa Pemeliharaan / Operasional</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Total Biaya Belanja (Rp)</label>
                  <input
                    type="number"
                    value={amount || ''}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    placeholder="85000000"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sumber Alokasi Dana</label>
                  <select
                    value={fundingSource}
                    onChange={(e) => setFundingSource(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="DANA_BOS">Dana BOS Kemdikbud</option>
                    <option value="DANA_SPP">Dana SPP Operasional</option>
                    <option value="HIBAH_YAYASAN">Dana Hibah / Donasi Yayasan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pilih Akun Debet Keuangan (Laporan Posisi Keuangan)
                </label>
                <select
                  value={debitAccountCode}
                  onChange={(e) => setDebitAccountCode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                >
                  <option value="1204">1204 - Komputer & Laptop Pembelajaran (Aset Tetap)</option>
                  <option value="1203">1203 - Mebel & Peralatan Kantor (Aset Tetap)</option>
                  <option value="1202">1202 - Bangunan & Prasarana Sekolah (Aset Tetap)</option>
                  <option value="5104">5104 - Beban Buku Pelajaran & Modul (Beban Operational)</option>
                  <option value="5112">5112 - Beban ATK & Cetak Materi (Beban Operational)</option>
                  <option value="5103">5103 - Beban Sarana Prasarana (Beban Operational)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pengusul (Kepala Sekolah)</label>
                <input
                  type="text"
                  value={proposedBy}
                  onChange={(e) => setProposedBy(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Catatan / Alasan Pengadaan</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Keterangan peruntukan rombel atau persiapan akreditasi..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <MediaUploader
                label="Upload Nota/Invoice/Bukti Pengadaan SiPLah (Lokal)"
                value={proofFileUrl}
                onChange={(url) => setProofFileUrl(url)}
                mediaType="any"
              />

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow cursor-pointer"
                >
                  Kirim Usulan Belanja
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
