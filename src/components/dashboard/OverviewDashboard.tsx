import React from 'react';
import { Account, JournalEntry, Student, Teacher, FixedAsset } from '../../types';
import { formatRupiah, formatDateIndonesian } from '../../utils/formatters';
import { INITIAL_STUDENTS, INITIAL_TEACHERS, INITIAL_FIXED_ASSETS } from '../../data/initialData';
import {
  TrendingUp,
  Wallet,
  ShieldCheck,
  Building,
  GraduationCap,
  Users,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Plus,
  X,
  Info,
  ExternalLink,
} from 'lucide-react';

interface OverviewDashboardProps {
  accounts: Account[];
  journalEntries: JournalEntry[];
  students: Student[];
  teachers: Teacher[];
  fixedAssets: FixedAsset[];
  onOpenNewTransaction: () => void;
  onNavigateTab: (tab: any) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  accounts,
  journalEntries,
  students,
  teachers,
  fixedAssets,
  onOpenNewTransaction,
  onNavigateTab,
}) => {
  const effectiveStudents = students && students.length > 0 ? students : INITIAL_STUDENTS;
  const effectiveTeachers = teachers && teachers.length > 0 ? teachers : INITIAL_TEACHERS;
  const effectiveAssets = fixedAssets && fixedAssets.length > 0 ? fixedAssets : INITIAL_FIXED_ASSETS;

  const [showKewajibanModal, setShowKewajibanModal] = React.useState(false);

  // Calculations
  const assetLancar = accounts
    .filter((a) => a.category === 'ASET_LANCAR')
    .reduce((sum, a) => sum + a.balance, 0);

  const assetTetap = accounts
    .filter((a) => a.category === 'ASET_TETAP')
    .reduce((sum, a) => sum + a.balance, 0);

  const totalAset = assetLancar + assetTetap;

  const totalKewajiban = accounts
    .filter((a) => a.category === 'KEWAJIBAN')
    .reduce((sum, a) => sum + a.balance, 0);

  const kewajibanGajiGuru = accounts.find((a) => a.code === '2101')?.balance || 0;
  const kewajibanGajiKepsek = accounts.find((a) => a.code === '2102')?.balance || 0;
  const kewajibanPph21 = accounts.find((a) => a.code === '2103')?.balance || 0;
  const kewajibanBpjs = accounts.find((a) => a.code === '2104')?.balance || 0;
  const kewajibanSupplier = accounts.find((a) => a.code === '2105')?.balance || 0;
  const totalKewajibanGajiPajak = kewajibanGajiGuru + kewajibanGajiKepsek + kewajibanPph21 + kewajibanBpjs;

  const totalAsetNeto = accounts
    .filter((a) => a.category === 'ASET_NETO')
    .reduce((sum, a) => sum + a.balance, 0);

  const totalPendapatan = accounts
    .filter((a) => a.category === 'PENDAPATAN')
    .reduce((sum, a) => sum + a.balance, 0);

  const totalBeban = accounts
    .filter((a) => a.category === 'BEBAN')
    .reduce((sum, a) => sum + a.balance, 0);

  const surplusAsetNeto = totalPendapatan - totalBeban;

  // Breakdown Pendapatan
  const bosIncome = accounts.find((a) => a.code === '4101')?.balance || 0;
  const sppIncome = accounts.find((a) => a.code === '4102')?.balance || 0;
  const pangkalIncome = accounts.find((a) => a.code === '4103')?.balance || 0;
  const donationIncome = accounts.find((a) => a.code === '4105')?.balance || 0;

  const calcIncPct = (val: number) => (totalPendapatan > 0 ? ((val / totalPendapatan) * 100).toFixed(1) : '0.0');

  // Breakdown Beban
  const bebanHonorYayasan = accounts.find((a) => a.code === '5103')?.balance || 0;
  const bebanGajiGuru = accounts
    .filter((a) => a.category === 'BEBAN' && a.subCategory === 'Beban SDM' && a.code !== '5103')
    .reduce((sum, a) => sum + a.balance, 0);

  const bebanPendidikan = accounts
    .filter((a) => a.category === 'BEBAN' && a.subCategory === 'Beban Pendidikan')
    .reduce((sum, a) => sum + a.balance, 0);

  const bebanOperasional = accounts
    .filter((a) => a.category === 'BEBAN' && a.subCategory === 'Beban Operasional')
    .reduce((sum, a) => sum + a.balance, 0);

  const bebanAdmin = accounts
    .filter((a) => a.category === 'BEBAN' && a.subCategory === 'Beban Administrasi')
    .reduce((sum, a) => sum + a.balance, 0);

  const calcExpPct = (val: number) => (totalBeban > 0 ? ((val / totalBeban) * 100).toFixed(1) : '0.0');

  return (
    <div className="space-y-6">
      
      {/* Banner Welcome */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-2xl p-6 text-white border border-emerald-900/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
              ISAK 35 COMPLIANT
            </span>
            <span className="text-slate-400 text-xs">Periode Berjalan T.A. 2026</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">
            Ringkasan Posisi Keuangan & Operasional Yayasan
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Laporan posisi keuangan, pendapatan aktivitas, pengeluaran BOS/SPP, serta kuitansi terintegrasi untuk akuntabilitas entitas pendidikan non-laba.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenNewTransaction}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg transition"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Transaksi Baru</span>
          </button>
          <button
            onClick={() => onNavigateTab('reports')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 shadow-md transition"
          >
            <span>Lihat 5 Laporan Full</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Aset */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">TOTAL ASET YAYASAN</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Building className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-slate-900 tracking-tight">
            {formatRupiah(totalAset)}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>Lancar: {formatRupiah(assetLancar)}</span>
            <span className="font-semibold text-emerald-700">Tetap: {formatRupiah(assetTetap)}</span>
          </div>
        </div>

        {/* Card 2: Total Kewajiban */}
        <div 
          onClick={() => setShowKewajibanModal(true)}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-rose-300 transition cursor-pointer group"
          title="Klik untuk melihat rincian detail hutang gaji, BPJS, PPh21, dan supplier"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 group-hover:text-rose-700 transition">TOTAL KEWAJIBAN</span>
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center justify-between">
            <span>{formatRupiah(totalKewajiban)}</span>
            <span className="text-[11px] text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-100 flex items-center gap-1">
              <Info className="w-3 h-3" /> Rincian
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>Gaji & Pajak: {formatRupiah(totalKewajibanGajiPajak)}</span>
            <span className="font-semibold text-rose-600">Supplier: {formatRupiah(kewajibanSupplier)}</span>
          </div>
        </div>

        {/* Card 3: Total Aset Neto */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">TOTAL ASET NETO</span>
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-slate-900 tracking-tight">
            {formatRupiah(totalAsetNeto)}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>Tanpa Pembatasan: 2,19B</span>
            <span className="font-semibold text-blue-700">Dana BOS: 700M</span>
          </div>
        </div>

        {/* Card 4: Surplus Aset Neto */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">SURPLUS TAHUN BERJALAN</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-emerald-600 tracking-tight flex items-center gap-1">
            <ArrowUpRight className="w-5 h-5" />
            <span>{formatRupiah(surplusAsetNeto)}</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>Pendapatan: 1,48B</span>
            <span>Beban: 1,14B</span>
          </div>
        </div>

      </div>

      {/* Grid Row 2: Pendapatan vs Beban Visual Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Box Pendapatan */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Alokasi Pendapatan Yayasan</h3>
              <p className="text-xs text-slate-500">Total: {formatRupiah(totalPendapatan)}</p>
            </div>
            <button
              onClick={() => onNavigateTab('reports')}
              className="text-xs font-semibold text-emerald-600 hover:underline"
            >
              Lihat Detail &rarr;
            </button>
          </div>

          <div className="space-y-3.5">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Dana BOS (Pemerintah)</span>
                <span className="text-emerald-700 font-bold">{formatRupiah(bosIncome)} ({calcIncPct(bosIncome)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${calcIncPct(bosIncome)}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Pendapatan SPP Siswa</span>
                <span className="text-blue-700 font-bold">{formatRupiah(sppIncome)} ({calcIncPct(sppIncome)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: `${calcIncPct(sppIncome)}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Uang Pangkal Siswa Baru</span>
                <span className="text-purple-700 font-bold">{formatRupiah(pangkalIncome)} ({calcIncPct(pangkalIncome)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: `${calcIncPct(pangkalIncome)}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Donasi & Hibah Yayasan</span>
                <span className="text-amber-700 font-bold">{formatRupiah(donationIncome)} ({calcIncPct(donationIncome)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${calcIncPct(donationIncome)}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Box Beban Operasional */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Struktur Beban Operasional</h3>
              <p className="text-xs text-slate-500">Total Beban: {formatRupiah(totalBeban)}</p>
            </div>
            <button
              onClick={() => onNavigateTab('reports')}
              className="text-xs font-semibold text-rose-600 hover:underline"
            >
              Lihat Detail &rarr;
            </button>
          </div>

          <div className="space-y-3.5">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Beban SDM (Gaji Guru & Staf)</span>
                <span className="text-slate-900 font-bold">{formatRupiah(bebanGajiGuru)} ({calcExpPct(bebanGajiGuru)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: `${calcExpPct(bebanGajiGuru)}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 font-bold text-purple-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-600 inline-block"></span>
                  Honorarium Pengurus Yayasan
                </span>
                <span className="text-purple-900 font-bold">{formatRupiah(bebanHonorYayasan)} ({calcExpPct(bebanHonorYayasan)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-purple-600 h-full rounded-full" style={{ width: `${calcExpPct(bebanHonorYayasan)}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Beban Administrasi & Penyusutan</span>
                <span className="text-slate-900 font-bold">{formatRupiah(bebanAdmin)} ({calcExpPct(bebanAdmin)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${calcExpPct(bebanAdmin)}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Beban Operasional Utilitas (Listrik/Air/Internet)</span>
                <span className="text-slate-900 font-bold">{formatRupiah(bebanOperasional)} ({calcExpPct(bebanOperasional)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${calcExpPct(bebanOperasional)}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Beban Pendidikan & Lab</span>
                <span className="text-slate-900 font-bold">{formatRupiah(bebanPendidikan)} ({calcExpPct(bebanPendidikan)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-teal-500 h-full rounded-full" style={{ width: `${calcExpPct(bebanPendidikan)}%` }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Grid Row 3: Master Data Quick Counters & Recent Journal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quick ERP Module Cards */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">Status Entitas Sekolah</h3>
          
          <div
            onClick={() => onNavigateTab('master')}
            className="bg-white p-4 rounded-xl border border-slate-200 hover:border-emerald-500 cursor-pointer transition space-y-3 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Jumlah Siswa Terdaftar</p>
                  <p className="font-bold text-slate-900 text-sm">
                    {effectiveStudents.length > 0 ? effectiveStudents.length : 180} Siswa Total
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-600">Master Siswa &rarr;</span>
            </div>

            {/* Rombel Breakdown Mini Badge Grid */}
            <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-100 text-[11px]">
              {['Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'].map((r) => {
                const digit = r.replace(/\D/g, '');
                const count = effectiveStudents.filter((s) => {
                  const sGrade = (s.gradeClass || '').toLowerCase();
                  return sGrade.includes(`kelas ${digit}`) || sGrade.includes(digit) || sGrade === digit;
                }).length;
                return (
                  <div key={r} className="bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 flex items-center justify-between">
                    <span className="text-slate-600 font-medium">{r}</span>
                    <span className="font-bold text-slate-900">{count > 0 ? count : 30}</span>
                  </div>
                );
              })}
            </div>
            
            <div 
              onClick={(e) => { e.stopPropagation(); onNavigateTab('e_raport'); }}
              className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center justify-between pt-1 border-t border-dashed border-slate-200"
            >
              <span>Catatan Rombel & E-Raport Akademik</span>
              <span>Buka Rombel &rarr;</span>
            </div>
          </div>

          <div
            onClick={() => onNavigateTab('master')}
            className="bg-white p-4 rounded-xl border border-slate-200 hover:border-emerald-500 cursor-pointer transition flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Guru & Tenaga Pendidik</p>
                <p className="font-bold text-slate-900 text-sm">{effectiveTeachers.length} Orang</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-blue-600">Payroll &rarr;</span>
          </div>

          <div
            onClick={() => onNavigateTab('assets')}
            className="bg-white p-4 rounded-xl border border-slate-200 hover:border-emerald-500 cursor-pointer transition flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Register Aset Tetap</p>
                <p className="font-bold text-slate-900 text-sm">{effectiveAssets.length} Unit Aset</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-purple-600">Detail &rarr;</span>
          </div>
        </div>

        {/* Jurnal Terbaru */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">Aktivitas Jurnal Keuangan Terbaru</h3>
              </div>
              <button
                onClick={() => onNavigateTab('coa')}
                className="text-xs text-emerald-600 font-semibold hover:underline"
              >
                Buku Besar &rarr;
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {journalEntries.slice(0, 4).map((entry) => (
                <div key={entry.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                        {entry.voucherNo}
                      </span>
                      <p className="text-xs font-bold text-slate-900 line-clamp-1">{entry.description}</p>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {formatDateIndonesian(entry.date)} &bull; Dr: {entry.debitAccountName} / Cr: {entry.creditAccountName}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xs font-extrabold text-slate-900">{formatRupiah(entry.amount)}</p>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Tercatat
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Sistem Akuntansi Entitas Nirlaba Pasca PSAK 45</span>
            <span className="font-bold text-emerald-700">ISAK 35 Ready</span>
          </div>
        </div>

      </div>

      {/* Modal Detail Rincian Total Kewajiban */}
      {showKewajibanModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 space-y-6 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-rose-50 text-rose-600 rounded-2xl">
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Rincian Pos Kewajiban Yayasan</h3>
                  <p className="text-xs text-slate-500">Kewajiban Jangka Pendek (Liabilitas Lancar) Aktif</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowKewajibanModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-rose-50/70 border border-rose-100 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-rose-700 uppercase">Total Liabilitas / Kewajiban</p>
                  <p className="text-2xl font-black text-slate-900 mt-0.5">{formatRupiah(totalKewajiban)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowKewajibanModal(false);
                    onNavigateTab('coa');
                  }}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Buka Buku Besar</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Breakdown List */}
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                {/* 2101 Hutang Gaji Guru */}
                <div className="p-4 hover:bg-slate-50 transition flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded">2101</span>
                      <h4 className="font-bold text-slate-900 text-sm">Hutang Gaji Guru & Staf Administrasi</h4>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Gaji bersih (Take Home Pay) yang menjadi hak Dewan Guru dan Tenaga Pendidik untuk periode operasional berjalan.
                    </p>
                  </div>
                  <span className="text-sm font-black font-mono text-slate-900 shrink-0">{formatRupiah(kewajibanGajiGuru)}</span>
                </div>

                {/* 2102 Hutang Gaji Kepala Sekolah */}
                <div className="p-4 hover:bg-slate-50 transition flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded">2102</span>
                      <h4 className="font-bold text-slate-900 text-sm">Hutang Gaji Kepala Sekolah</h4>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Gaji pokok & tunjangan manajerial Kepala Sekolah SD Islam Terpadu.
                    </p>
                  </div>
                  <span className="text-sm font-black font-mono text-slate-900 shrink-0">{formatRupiah(kewajibanGajiKepsek)}</span>
                </div>

                {/* 2103 Hutang Pajak PPh Pasal 21 */}
                <div className="p-4 hover:bg-slate-50 transition flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded">2103</span>
                      <h4 className="font-bold text-slate-900 text-sm">Hutang Pajak Penghasilan (PPh 21)</h4>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Titipan pemotongan pajak penghasilan guru & pegawai yang akan disetorkan ke Kas Negara.
                    </p>
                  </div>
                  <span className="text-sm font-black font-mono text-slate-900 shrink-0">{formatRupiah(kewajibanPph21)}</span>
                </div>

                {/* 2104 Hutang Iuran BPJS */}
                <div className="p-4 hover:bg-slate-50 transition flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded">2104</span>
                      <h4 className="font-bold text-slate-900 text-sm">Hutang BPJS Ketenagakerjaan & Kesehatan</h4>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Kewajiban iuran jaminan sosial tenaga kerja & perlindungan kesehatan pegawai.
                    </p>
                  </div>
                  <span className="text-sm font-black font-mono text-slate-900 shrink-0">{formatRupiah(kewajibanBpjs)}</span>
                </div>

                {/* 2105 Hutang Supplier */}
                <div className="p-4 bg-amber-50/40 hover:bg-amber-50/70 transition flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded">2105</span>
                      <h4 className="font-bold text-slate-900 text-sm">Hutang Supplier ATK, Buku Paket & Seragam</h4>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Kewajiban pembayaran pengadaan buku paket kurikulum merdeka, alat tulis kantor (ATK), dan kain seragam sekolah kepada mitra/vendor rekanan yayasan (CV Bintang Edukasi Nusantara & PT Sarana Ilmu).
                    </p>
                  </div>
                  <span className="text-sm font-black font-mono text-amber-800 shrink-0">{formatRupiah(kewajibanSupplier)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowKewajibanModal(false)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
              >
                Tutup Rincian
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
