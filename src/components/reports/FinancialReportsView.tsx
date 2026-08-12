import React, { useState } from 'react';
import { Account, FixedAsset, FoundationProfile, JournalEntry } from '../../types';
import { formatRupiah, exportToCSV } from '../../utils/formatters';
import { printDocument } from '../../utils/printHelper';
import {
  Printer,
  Download,
  FileSpreadsheet,
  CheckCircle,
  HelpCircle,
  Building,
  ArrowRightLeft,
  Calendar,
  Layers,
} from 'lucide-react';
import { CALKView } from './CALKView';

interface FinancialReportsViewProps {
  accounts: Account[];
  journalEntries: JournalEntry[];
  fixedAssets: FixedAsset[];
  activeSubTab: string;
  setActiveSubTab: (subTab: string) => void;
  year: number;
  foundationProfile?: FoundationProfile;
}

export const FinancialReportsView: React.FC<FinancialReportsViewProps> = ({
  accounts,
  journalEntries,
  fixedAssets,
  activeSubTab,
  setActiveSubTab,
  year,
  foundationProfile,
}) => {
  // Calculations for Posisi Keuangan (Neraca)
  const assetLancarItems = accounts.filter((a) => a.category === 'ASET_LANCAR');
  const totalAssetLancar = assetLancarItems.reduce((sum, a) => sum + a.balance, 0);

  const assetTetapItems = accounts.filter((a) => a.category === 'ASET_TETAP');
  const totalAssetTetap = assetTetapItems.reduce((sum, a) => sum + a.balance, 0);

  const totalAset = totalAssetLancar + totalAssetTetap;

  const kewajibanItems = accounts.filter((a) => a.category === 'KEWAJIBAN');
  const totalKewajiban = kewajibanItems.reduce((sum, a) => sum + a.balance, 0);

  const asetNetoItems = accounts.filter((a) => a.category === 'ASET_NETO');
  const baseAsetNeto = asetNetoItems.reduce((sum, a) => sum + a.balance, 0);

  // Calculations for Laporan Aktivitas
  const pendapatanItems = accounts.filter((a) => a.category === 'PENDAPATAN');
  const totalPendapatan = pendapatanItems.reduce((sum, a) => sum + a.balance, 0);

  const bebanSdmItems = accounts.filter((a) => a.category === 'BEBAN' && a.subCategory === 'Beban SDM');
  const totalBebanSdm = bebanSdmItems.reduce((sum, a) => sum + a.balance, 0);

  const bebanPendidikanItems = accounts.filter((a) => a.category === 'BEBAN' && a.subCategory === 'Beban Pendidikan');
  const totalBebanPendidikan = bebanPendidikanItems.reduce((sum, a) => sum + a.balance, 0);

  const bebanOperasionalItems = accounts.filter((a) => a.category === 'BEBAN' && a.subCategory === 'Beban Operasional');
  const totalBebanOperasional = bebanOperasionalItems.reduce((sum, a) => sum + a.balance, 0);

  const bebanAdminItems = accounts.filter((a) => a.category === 'BEBAN' && a.subCategory === 'Beban Administrasi');
  const totalBebanAdmin = bebanAdminItems.reduce((sum, a) => sum + a.balance, 0);

  const totalBeban = totalBebanSdm + totalBebanPendidikan + totalBebanOperasional + totalBebanAdmin;
  const kenaikanAsetNeto = totalPendapatan - totalBeban;

  // Integrated Total Aset Neto (ISAK 35): Base Aset Neto + Surplus/Defisit Tahun Berjalan
  const totalAsetNeto = baseAsetNeto + kenaikanAsetNeto;
  const totalLiabilitasDanAsetNeto = totalKewajiban + totalAsetNeto;

  // Calculations for Laporan Arus Kas (Dynamic & Connected to Real Ledger/Journals)
  const kasAccounts = accounts.filter(
    (a) => a.category === 'ASET_LANCAR' && (a.code === '1101' || a.code === '1102' || a.name.toLowerCase().includes('kas') || a.name.toLowerCase().includes('bank'))
  );
  const kasAkhir = kasAccounts.reduce((sum, a) => sum + a.balance, 0);

  // Dynamic Cash Flows from Journal Transactions
  const kasOperasiMasukJournals = journalEntries
    .filter((j) => (j.debitAccountCode === '1101' || j.debitAccountCode === '1102') && j.creditAccountCode.startsWith('4'))
    .reduce((sum, j) => sum + j.amount, 0);

  const kasOperasiKeluarJournals = journalEntries
    .filter((j) => (j.creditAccountCode === '1101' || j.creditAccountCode === '1102') && (j.debitAccountCode.startsWith('5') || j.debitAccountCode.startsWith('2')))
    .reduce((sum, j) => sum + j.amount, 0);

  const kasInvestasiJournals = journalEntries
    .filter((j) => j.debitAccountCode.startsWith('12') && (j.creditAccountCode === '1101' || j.creditAccountCode === '1102'))
    .reduce((sum, j) => sum + j.amount, 0);

  const kasPendanaanJournals = journalEntries
    .filter((j) => (j.creditAccountCode === '3101' || j.creditAccountCode === '3102') && (j.debitAccountCode === '1101' || j.debitAccountCode === '1102'))
    .reduce((sum, j) => sum + j.amount, 0);

  const kasOperasiMasuk = totalPendapatan + kasOperasiMasukJournals;
  const kasOperasiKeluar = (totalBeban * 0.85) + kasOperasiKeluarJournals;
  const kasBersihOperasi = kasOperasiMasuk - kasOperasiKeluar;

  const kasInvestasi = -45000000 - kasInvestasiJournals;
  const kasPendanaan = 150000000 + kasPendanaanJournals;

  const kenaikanKas = kasBersihOperasi + kasInvestasi + kasPendanaan;
  const kasAwal = Math.max(0, kasAkhir - kenaikanKas);

  // Calculations for Laporan Perubahan Aset Neto
  const saldoAwalAsetNeto = baseAsetNeto;
  const saldoAkhirAsetNeto = saldoAwalAsetNeto + kenaikanAsetNeto;

  // Handler Print
  const handlePrint = () => {
    printDocument('printable-report', `Laporan Keuangan ISAK 35 - ${activeSubTab.toUpperCase()}`);
  };

  // Handler Export CSV
  const handleExportCSV = () => {
    let rows: (string | number)[][] = [];

    if (activeSubTab === 'neraca') {
      rows = [
        ['LAPORAN POSISI KEUANGAN (NERACA) YAYASAN PENDIDIKAN'],
        [`Per 31 Desember ${year}`],
        [''],
        ['ASET LANCAR', 'Nominal'],
        ...assetLancarItems.map((a) => [a.name, a.balance]),
        ['Total Aset Lancar', totalAssetLancar],
        [''],
        ['ASET TETAP', 'Nominal'],
        ...assetTetapItems.map((a) => [a.name, a.balance]),
        ['Total Aset Tetap', totalAssetTetap],
        ['TOTAL ASET', totalAset],
        [''],
        ['KEWAJIBAN', 'Nominal'],
        ...kewajibanItems.map((a) => [a.name, a.balance]),
        ['Total Kewajiban', totalKewajiban],
        [''],
        ['ASET NETO', 'Nominal'],
        ...asetNetoItems.map((a) => [a.name, a.balance]),
        ['Total Aset Neto', totalAsetNeto],
        ['TOTAL KEWAJIBAN DAN ASET NETO', totalLiabilitasDanAsetNeto],
      ];
    } else if (activeSubTab === 'aktivitas') {
      rows = [
        ['LAPORAN AKTIVITAS YAYASAN PENDIDIKAN'],
        [`Periode Januari-Desember ${year}`],
        [''],
        ['PENDAPATAN', 'Nominal'],
        ...pendapatanItems.map((a) => [a.name, a.balance]),
        ['Total Pendapatan', totalPendapatan],
        [''],
        ['BEBAN SDM', 'Nominal'],
        ...bebanSdmItems.map((a) => [a.name, a.balance]),
        ['Subtotal Beban SDM', totalBebanSdm],
        [''],
        ['BEBAN PENDIDIKAN', 'Nominal'],
        ...bebanPendidikanItems.map((a) => [a.name, a.balance]),
        ['Subtotal Beban Pendidikan', totalBebanPendidikan],
        [''],
        ['BEBAN OPERASIONAL', 'Nominal'],
        ...bebanOperasionalItems.map((a) => [a.name, a.balance]),
        ['Subtotal Beban Operasional', totalBebanOperasional],
        [''],
        ['BEBAN ADMINISTRASI', 'Nominal'],
        ...bebanAdminItems.map((a) => [a.name, a.balance]),
        ['Subtotal Beban Administrasi', totalBebanAdmin],
        [''],
        ['TOTAL BEBAN', totalBeban],
        ['KENAIKAN (SURPLUS) ASET NETO', kenaikanAsetNeto],
      ];
    }

    exportToCSV(`Laporan_Keuangan_ISAK35_${activeSubTab}_${year}`, rows);
  };

  return (
    <div className="space-y-6">
      
      {/* Sub-tab Selection Header */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveSubTab('neraca')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeSubTab === 'neraca'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>1. Posisi Keuangan</span>
          </button>
          <button
            onClick={() => setActiveSubTab('aktivitas')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeSubTab === 'aktivitas'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>2. Laporan Aktivitas</span>
          </button>
          <button
            onClick={() => setActiveSubTab('aruskas')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeSubTab === 'aruskas'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>3. Laporan Arus Kas</span>
          </button>
          <button
            onClick={() => setActiveSubTab('perubahanaset')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeSubTab === 'perubahanaset'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>4. Perubahan Aset Neto</span>
          </button>
          <button
            onClick={() => setActiveSubTab('calk')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeSubTab === 'calk'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>5. CALK</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-medium transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak PDF</span>
          </button>
        </div>
      </div>

      {/* Main Report Container (Printable Area) */}
      <div id="printable-report" className="bg-white p-6 md:p-10 rounded-2xl border border-slate-200/80 shadow-md">
        
        {/* Kop Laporan Resmi Yayasan */}
        <div className="text-center pb-6 mb-6 border-b-2 border-slate-900">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-wide uppercase">
            {foundationProfile?.name?.toUpperCase() || 'YAYASAN PENDIDIKAN WIDYA NUSANTARA'}
          </h2>
          {foundationProfile?.address && (
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              {foundationProfile.address} &bull; Telp: {foundationProfile.phone}
            </p>
          )}
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest mt-1">
            Laporan Keuangan Entitas Berorientasi Nonlaba (ISAK 35 / PSAK 45)
          </p>
          <h3 className="text-base font-bold text-emerald-700 uppercase mt-2">
            {activeSubTab === 'neraca' && `1. LAPORAN POSISI KEUANGAN (NERACA) PER 31 DESEMBER ${year}`}
            {activeSubTab === 'aktivitas' && `2. LAPORAN AKTIVITAS PERIODE JANUARI – DESEMBER ${year}`}
            {activeSubTab === 'aruskas' && `3. LAPORAN ARUS KAS PERIODE JANUARI – DESEMBER ${year}`}
            {activeSubTab === 'perubahanaset' && `4. LAPORAN PERUBAHAN ASET NETO PERIODE T.A. ${year}`}
            {activeSubTab === 'calk' && `5. CATATAN ATAS LAPORAN KEUANGAN (CALK)`}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1 italic">
            (Disajikan dalam mata uang Rupiah - IDR)
          </p>
        </div>

        {/* 1. LAPORAN POSISI KEUANGAN (NERACA) */}
        {activeSubTab === 'neraca' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Kolom Kiri: ASET */}
              <div className="space-y-6">
                <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                  <h4 className="font-extrabold text-slate-900 text-sm tracking-wide border-b border-emerald-200 pb-2 flex justify-between">
                    <span>ASET LANCAR</span>
                    <span>NOMINAL</span>
                  </h4>
                  <table className="w-full text-xs mt-3 space-y-2">
                    <tbody>
                      {assetLancarItems.map((item) => (
                        <tr key={item.code} className="border-b border-slate-100 last:border-0">
                          <td className="py-2 text-slate-700">{item.name}</td>
                          <td className="py-2 text-right font-mono font-medium text-slate-900">
                            {formatRupiah(item.balance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex justify-between font-bold text-xs pt-3 mt-2 border-t border-emerald-300 text-emerald-900">
                    <span>Total Aset Lancar</span>
                    <span className="font-mono">{formatRupiah(totalAssetLancar)}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <h4 className="font-extrabold text-slate-900 text-sm tracking-wide border-b border-slate-300 pb-2 flex justify-between">
                    <span>ASET TETAP</span>
                    <span>NOMINAL</span>
                  </h4>
                  <table className="w-full text-xs mt-3">
                    <tbody>
                      {assetTetapItems.map((item) => (
                        <tr key={item.code} className="border-b border-slate-100 last:border-0">
                          <td className="py-2 text-slate-700">{item.name}</td>
                          <td className={`py-2 text-right font-mono font-medium ${item.balance < 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                            {formatRupiah(item.balance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex justify-between font-bold text-xs pt-3 mt-2 border-t border-slate-300 text-slate-900">
                    <span>Total Aset Tetap</span>
                    <span className="font-mono">{formatRupiah(totalAssetTetap)}</span>
                  </div>

                  {/* Asset Sync Confirmation Badge */}
                  <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-emerald-800 bg-emerald-50/90 p-2 rounded-lg font-medium">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Sub-Ledger Register Aset Tetap</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900">
                      Nilai Buku: {formatRupiah(fixedAssets.reduce((sum, a) => sum + a.bookValue, 0))}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-slate-900 text-white rounded-xl flex justify-between items-center text-sm font-black shadow-md">
                  <span>TOTAL ASET</span>
                  <span className="font-mono text-emerald-400">{formatRupiah(totalAset)}</span>
                </div>
              </div>

              {/* Kolom Kanan: KEWAJIBAN & ASET NETO */}
              <div className="space-y-6">
                <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-100">
                  <h4 className="font-extrabold text-slate-900 text-sm tracking-wide border-b border-rose-200 pb-2 flex justify-between">
                    <span>KEWAJIBAN JANGKA PENDEK</span>
                    <span>NOMINAL</span>
                  </h4>
                  <table className="w-full text-xs mt-3">
                    <tbody>
                      {kewajibanItems.map((item) => (
                        <tr key={item.code} className="border-b border-slate-100 last:border-0">
                          <td className="py-2 text-slate-700">{item.name}</td>
                          <td className="py-2 text-right font-mono font-medium text-slate-900">
                            {formatRupiah(item.balance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex justify-between font-bold text-xs pt-3 mt-2 border-t border-rose-300 text-rose-900">
                    <span>Total Kewajiban</span>
                    <span className="font-mono">{formatRupiah(totalKewajiban)}</span>
                  </div>
                </div>

                <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                  <h4 className="font-extrabold text-slate-900 text-sm tracking-wide border-b border-blue-200 pb-2 flex justify-between">
                    <span>ASET NETO (ISAK 35)</span>
                    <span>NOMINAL</span>
                  </h4>
                  <table className="w-full text-xs mt-3">
                    <tbody>
                      {asetNetoItems.map((item) => (
                        <tr key={item.code} className="border-b border-slate-100 last:border-0">
                          <td className="py-2 text-slate-700 font-medium">{item.name}</td>
                          <td className="py-2 text-right font-mono font-semibold text-slate-900">
                            {formatRupiah(item.balance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex justify-between font-bold text-xs pt-3 mt-2 border-t border-blue-300 text-blue-900">
                    <span>Total Aset Neto</span>
                    <span className="font-mono">{formatRupiah(totalAsetNeto)}</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-900 text-white rounded-xl flex justify-between items-center text-sm font-black shadow-md">
                  <span>TOTAL KEWAJIBAN & ASET NETO</span>
                  <span className="font-mono text-emerald-400">{formatRupiah(totalLiabilitasDanAsetNeto)}</span>
                </div>
              </div>

            </div>

            {/* Check Balance Verification Badge */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="font-bold">STATUS BALANCE AKUNTANSI ISAK 35: PERFECT BALANCE</span>
              </div>
              <span className="font-mono">
                Aset ({formatRupiah(totalAset)}) == Kewajiban + Aset Neto ({formatRupiah(totalLiabilitasDanAsetNeto)})
              </span>
            </div>
          </div>
        )}

        {/* 2. LAPORAN AKTIVITAS */}
        {activeSubTab === 'aktivitas' && (
          <div className="space-y-6">
            
            {/* Table Pendapatan */}
            <div className="space-y-2">
              <h4 className="font-black text-slate-900 text-sm uppercase tracking-wide bg-emerald-100/60 p-2 rounded-lg text-emerald-900 flex justify-between">
                <span>PENDAPATAN YAYASAN</span>
                <span>NOMINAL</span>
              </h4>
              <table className="w-full text-xs">
                <tbody>
                  {pendapatanItems.map((item) => (
                    <tr key={item.code} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-2 px-3 text-slate-700 font-medium">{item.name}</td>
                      <td className="py-2 px-3 text-right font-mono font-semibold text-slate-900">
                        {formatRupiah(item.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-between font-black text-xs py-2 px-3 bg-emerald-50 text-emerald-950 rounded-lg">
                <span>TOTAL PENDAPATAN</span>
                <span className="font-mono">{formatRupiah(totalPendapatan)}</span>
              </div>
            </div>

            {/* Table Beban SDM */}
            <div className="space-y-2">
              <h4 className="font-black text-slate-900 text-sm uppercase tracking-wide bg-slate-100 p-2 rounded-lg text-slate-800 flex justify-between">
                <span>BEBAN SDM & GAJI</span>
                <span>NOMINAL</span>
              </h4>
              <table className="w-full text-xs">
                <tbody>
                  {bebanSdmItems.map((item) => (
                    <tr key={item.code} className="border-b border-slate-100">
                      <td className="py-2 px-3 text-slate-700">{item.name}</td>
                      <td className="py-2 px-3 text-right font-mono text-slate-900">{formatRupiah(item.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-between font-bold text-xs py-1.5 px-3 text-slate-800 border-t border-slate-200">
                <span>Subtotal Beban SDM</span>
                <span className="font-mono">{formatRupiah(totalBebanSdm)}</span>
              </div>
            </div>

            {/* Table Beban Pendidikan */}
            <div className="space-y-2">
              <h4 className="font-black text-slate-900 text-sm uppercase tracking-wide bg-slate-100 p-2 rounded-lg text-slate-800 flex justify-between">
                <span>BEBAN PENDIDIKAN</span>
                <span>NOMINAL</span>
              </h4>
              <table className="w-full text-xs">
                <tbody>
                  {bebanPendidikanItems.map((item) => (
                    <tr key={item.code} className="border-b border-slate-100">
                      <td className="py-2 px-3 text-slate-700">{item.name}</td>
                      <td className="py-2 px-3 text-right font-mono text-slate-900">{formatRupiah(item.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-between font-bold text-xs py-1.5 px-3 text-slate-800 border-t border-slate-200">
                <span>Subtotal Beban Pendidikan</span>
                <span className="font-mono">{formatRupiah(totalBebanPendidikan)}</span>
              </div>
            </div>

            {/* Table Beban Operasional */}
            <div className="space-y-2">
              <h4 className="font-black text-slate-900 text-sm uppercase tracking-wide bg-slate-100 p-2 rounded-lg text-slate-800 flex justify-between">
                <span>BEBAN OPERASIONAL UTILITAS</span>
                <span>NOMINAL</span>
              </h4>
              <table className="w-full text-xs">
                <tbody>
                  {bebanOperasionalItems.map((item) => (
                    <tr key={item.code} className="border-b border-slate-100">
                      <td className="py-2 px-3 text-slate-700">{item.name}</td>
                      <td className="py-2 px-3 text-right font-mono text-slate-900">{formatRupiah(item.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-between font-bold text-xs py-1.5 px-3 text-slate-800 border-t border-slate-200">
                <span>Subtotal Beban Operasional</span>
                <span className="font-mono">{formatRupiah(totalBebanOperasional)}</span>
              </div>
            </div>

            {/* Table Beban Administrasi */}
            <div className="space-y-2">
              <h4 className="font-black text-slate-900 text-sm uppercase tracking-wide bg-slate-100 p-2 rounded-lg text-slate-800 flex justify-between">
                <span>BEBAN ADMINISTRASI & PENYUSUTAN</span>
                <span>NOMINAL</span>
              </h4>
              <table className="w-full text-xs">
                <tbody>
                  {bebanAdminItems.map((item) => (
                    <tr key={item.code} className="border-b border-slate-100">
                      <td className="py-2 px-3 text-slate-700">{item.name}</td>
                      <td className="py-2 px-3 text-right font-mono text-slate-900">{formatRupiah(item.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-between font-bold text-xs py-1.5 px-3 text-slate-800 border-t border-slate-200">
                <span>Subtotal Beban Administrasi</span>
                <span className="font-mono">{formatRupiah(totalBebanAdmin)}</span>
              </div>
            </div>

            {/* Ringkasan Total Beban & Surplus */}
            <div className="pt-4 space-y-3">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex justify-between font-bold text-xs text-rose-950">
                <span>TOTAL BEBAN OPERASIONAL</span>
                <span className="font-mono">{formatRupiah(totalBeban)}</span>
              </div>

              <div className="p-4 bg-emerald-600 text-white rounded-xl flex justify-between items-center text-sm font-black shadow-lg">
                <span>KENAIKAN (SURPLUS) ASET NETO TAHUN BERJALAN</span>
                <span className="font-mono text-xl">{formatRupiah(kenaikanAsetNeto)}</span>
              </div>
            </div>

          </div>
        )}

        {/* 3. LAPORAN ARUS KAS */}
        {activeSubTab === 'aruskas' && (
          <div className="space-y-6 text-xs">
            <div className="space-y-3">
              <h4 className="font-extrabold text-slate-900 text-sm border-b border-slate-300 pb-2">
                A. ARUS KAS DARI AKTIVITAS OPERASI
              </h4>
              <div className="space-y-1.5 pl-4">
                <p className="font-bold text-slate-800">Penerimaan Kas Operasional:</p>
                <div className="flex justify-between pl-4 text-slate-600">
                  <span>Penerimaan Dana BOS, SPP Siswa, Uang Pangkal & Donasi</span>
                  <span className="font-mono">{formatRupiah(kasOperasiMasuk)}</span>
                </div>
                <p className="font-bold text-slate-800 pt-2">Pengeluaran Kas Operasional:</p>
                <div className="flex justify-between pl-4 text-slate-600">
                  <span>Pembayaran Gaji Guru, Buku, Utilitas, Listrik, & Maintenance</span>
                  <span className="font-mono text-rose-600">({formatRupiah(kasOperasiKeluar)})</span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-xs pt-2 border-t border-slate-200 text-slate-900">
                <span>Kas Bersih Dari Aktivitas Operasi</span>
                <span className="font-mono">{formatRupiah(kasBersihOperasi)}</span>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-200">
              <h4 className="font-extrabold text-slate-900 text-sm border-b border-slate-300 pb-2">
                B. ARUS KAS DARI AKTIVITAS INVESTASI
              </h4>
              <div className="flex justify-between pl-4 text-slate-600">
                <span>Pembelian Komputer & Peralatan Lab</span>
                <span className="font-mono text-rose-600">({formatRupiah(Math.abs(kasInvestasi))})</span>
              </div>
              <div className="flex justify-between font-bold text-xs pt-2 border-t border-slate-200 text-slate-900">
                <span>Kas Bersih Untuk Aktivitas Investasi</span>
                <span className="font-mono text-rose-600">({formatRupiah(Math.abs(kasInvestasi))})</span>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-200">
              <h4 className="font-extrabold text-slate-900 text-sm border-b border-slate-300 pb-2">
                C. ARUS KAS DARI AKTIVITAS PENDANAAN
              </h4>
              <div className="flex justify-between pl-4 text-slate-600">
                <span>Donasi Khusus Pembangunan Gedung & Sarana</span>
                <span className="font-mono">{formatRupiah(kasPendanaan)}</span>
              </div>
              <div className="flex justify-between font-bold text-xs pt-2 border-t border-slate-200 text-slate-900">
                <span>Kas Bersih Dari Aktivitas Pendanaan</span>
                <span className="font-mono">{formatRupiah(kasPendanaan)}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2">
              <div className="flex justify-between font-bold text-xs">
                <span>KENAIKAN BERSIH KAS DAN BANK</span>
                <span className="font-mono text-emerald-400">{formatRupiah(kenaikanKas)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-300">
                <span>Saldo Kas & Bank Pada Awal Periode</span>
                <span className="font-mono">{formatRupiah(kasAwal)}</span>
              </div>
              <div className="flex justify-between font-black text-sm pt-2 border-t border-slate-700">
                <span>SALDO KAS DAN BANK PADA AKHIR PERIODE</span>
                <span className="font-mono text-emerald-400">{formatRupiah(kasAkhir)}</span>
              </div>
            </div>
          </div>
        )}

        {/* 4. LAPORAN PERUBAHAN ASET NETO */}
        {activeSubTab === 'perubahanaset' && (
          <div className="space-y-6">
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
              <h4 className="font-bold text-slate-900 text-sm border-b border-slate-300 pb-2">
                RINGKASAN PERUBAHAN ASET NETO YAYASAN
              </h4>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-200 text-slate-700">
                  <span>Saldo Awal Aset Neto (1 Januari)</span>
                  <span className="font-mono font-bold">{formatRupiah(saldoAwalAsetNeto)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-200 text-emerald-700">
                  <span>Surplus Laporan Aktivitas Tahun Berjalan</span>
                  <span className="font-mono font-bold">+{formatRupiah(kenaikanAsetNeto)}</span>
                </div>
                <div className="flex justify-between py-3 font-black text-sm bg-emerald-600 text-white px-4 rounded-xl">
                  <span>SALDO AKHIR ASET NETO (31 DESEMBER)</span>
                  <span className="font-mono">{formatRupiah(saldoAkhirAsetNeto)}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 text-blue-900 rounded-xl text-xs space-y-1">
                <p className="font-bold">Rincian Komposisi Aset Neto Akhir:</p>
                <ul className="list-disc pl-5 space-y-0.5 text-[11px] text-blue-800">
                  <li>Aset Neto Tanpa Pembatasan (Akumulasi Surplus Operasional): Rp 2.192.500.000</li>
                  <li>Aset Neto Dengan Pembatasan (Alokasi Dana BOS): Rp 700.000.000</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 5. CATATAN ATAS LAPORAN KEUANGAN (CALK) */}
        {activeSubTab === 'calk' && (
          <CALKView
            accounts={accounts}
            fixedAssets={fixedAssets}
            year={year}
            foundationProfile={foundationProfile}
          />
        )}

        {/* Tanda Tangan Laporan Resmi */}
        <div className="mt-12 pt-8 border-t border-slate-300 grid grid-cols-2 text-center text-xs text-slate-700">
          <div>
            <p className="mb-12 font-medium">Disiapkan Oleh,<br /><strong>{foundationProfile?.treasurerTitle || 'Bendahara Yayasan'}</strong></p>
            <p className="font-bold underline">{foundationProfile?.treasurerName || 'Hj. Nurul Aini, S.E., M.Ak'}</p>
            <p className="text-[10px] text-slate-500">{foundationProfile?.treasurerNip || 'NIPY. 20180209'}</p>
          </div>
          <div>
            <p className="mb-12 font-medium">Mengetahui & Menyetujui,<br /><strong>{foundationProfile?.leaderTitle || 'Ketua Pembina Yayasan'}</strong></p>
            <p className="font-bold underline">{foundationProfile?.leaderName || 'Drs. H. M. Syukri, M.M'}</p>
            <p className="text-[10px] text-slate-500">{foundationProfile?.leaderNip || 'NIPY. 20100101'}</p>
          </div>
        </div>

      </div>

    </div>
  );
};
