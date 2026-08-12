import React from 'react';
import { Account, FixedAsset, FoundationProfile } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import { BookOpen, ShieldAlert, Coins, Building2 } from 'lucide-react';

interface CALKViewProps {
  accounts: Account[];
  fixedAssets: FixedAsset[];
  year: number;
  foundationProfile?: FoundationProfile;
}

export const CALKView: React.FC<CALKViewProps> = ({ accounts, fixedAssets, year, foundationProfile }) => {
  const bosRevenue = accounts.find((a) => a.code === '4101')?.balance || 0;
  const sppRevenue = accounts.find((a) => a.code === '4102')?.balance || 0;
  const pangkalRevenue = accounts.find((a) => a.code === '4103')?.balance || 0;
  const seragamRevenue = accounts.find((a) => a.code === '4104')?.balance || 0;
  const donasiRevenue = accounts.find((a) => a.code === '4105')?.balance || 0;

  const totalRevenue = bosRevenue + sppRevenue + pangkalRevenue + seragamRevenue + donasiRevenue;

  const kewajibanItems = accounts.filter((a) => a.category === 'KEWAJIBAN');

  return (
    <div className="space-y-8 text-xs text-slate-800 leading-relaxed">
      
      {/* Intro ISAK 35 Statement */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
        <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <span>CATATAN ATAS LAPORAN KEUANGAN (CALK) YAYASAN PENDIDIKAN</span>
        </h4>
        <p className="text-slate-600">
          Catatan Atas Laporan Keuangan merupakan bagian tak terpisahkan dari Laporan Keuangan {foundationProfile?.name || 'Yayasan Pendidikan Widya Nusantara'} untuk tahun buku yang berakhir pada 31 Desember {year}. Penyajian disesuaikan dengan <strong>ISAK 35 (Penyajian Laporan Keuangan Entitas Berorientasi Nonlaba)</strong>.
        </p>
      </div>

      {/* A. SUMBER PENDAPATAN */}
      <div className="space-y-3">
        <h5 className="font-extrabold text-sm text-slate-900 border-b border-slate-300 pb-1.5 flex items-center gap-2">
          <Coins className="w-4 h-4 text-emerald-600" />
          <span>A. SUMBER PENDAPATAN YAYASAN</span>
        </h5>
        <p className="text-slate-600">
          Pendapatan Yayasan diklasifikasikan berdasarkan sumber penerimaan operasional dan pembatasan penggunaannya oleh pemberi sumber daya:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-100 font-bold text-slate-800">
              <tr>
                <th className="p-2 border.b border-slate-200">No</th>
                <th className="p-2 border-b border-slate-200">Sumber Pendapatan</th>
                <th className="p-2 border-b border-slate-200">Sifat Pembatasan</th>
                <th className="p-2 border-b border-slate-200 text-right">Nominal (Rp)</th>
                <th className="p-2 border-b border-slate-200 text-right">Persentase</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-2">1</td>
                <td className="p-2 font-semibold">Dana Bantuan Operasional Sekolah (BOS)</td>
                <td className="p-2">Dengan Pembatasan (Juknis Pemerintah)</td>
                <td className="p-2 text-right font-mono">{formatRupiah(bosRevenue)}</td>
                <td className="p-2 text-right font-mono">{( (bosRevenue / totalRevenue) * 100 ).toFixed(1)}%</td>
              </tr>
              <tr>
                <td className="p-2">2</td>
                <td className="p-2 font-semibold">SPP Bulanan Siswa</td>
                <td className="p-2">Tanpa Pembatasan</td>
                <td className="p-2 text-right font-mono">{formatRupiah(sppRevenue)}</td>
                <td className="p-2 text-right font-mono">{( (sppRevenue / totalRevenue) * 100 ).toFixed(1)}%</td>
              </tr>
              <tr>
                <td className="p-2">3</td>
                <td className="p-2 font-semibold">Uang Pangkal / Pendaftaran Siswa Baru</td>
                <td className="p-2">Tanpa Pembatasan</td>
                <td className="p-2 text-right font-mono">{formatRupiah(pangkalRevenue)}</td>
                <td className="p-2 text-right font-mono">{( (pangkalRevenue / totalRevenue) * 100 ).toFixed(1)}%</td>
              </tr>
              <tr>
                <td className="p-2">4</td>
                <td className="p-2 font-semibold">Pendapatan Donasi & Hibah Yayasan</td>
                <td className="p-2">Tanpa Pembatasan</td>
                <td className="p-2 text-right font-mono">{formatRupiah(donasiRevenue)}</td>
                <td className="p-2 text-right font-mono">{( (donasiRevenue / totalRevenue) * 100 ).toFixed(1)}%</td>
              </tr>
              <tr>
                <td className="p-2">5</td>
                <td className="p-2 font-semibold">Penjualan Seragam & Modul</td>
                <td className="p-2">Tanpa Pembatasan</td>
                <td className="p-2 text-right font-mono">{formatRupiah(seragamRevenue)}</td>
                <td className="p-2 text-right font-mono">{( (seragamRevenue / totalRevenue) * 100 ).toFixed(1)}%</td>
              </tr>
            </tbody>
            <tfoot className="bg-slate-100 font-bold text-slate-900">
              <tr>
                <td colSpan={3} className="p-2 text-right">TOTAL PENDAPATAN YAYASAN</td>
                <td className="p-2 text-right font-mono">{formatRupiah(totalRevenue)}</td>
                <td className="p-2 text-right font-mono">100.0%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* B. ASET TETAP */}
      <div className="space-y-3">
        <h5 className="font-extrabold text-sm text-slate-900 border-b border-slate-300 pb-1.5 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-emerald-600" />
          <span>B. RINCIAN ASET TETAP & AKUMULASI PENYUSUTAN</span>
        </h5>
        <p className="text-slate-600">
          Aset Tetap dicatat sebesar harga perolehan dikurangi akumulasi penyusutan. Penyusutan dihitung dengan metode Garis Lurus (Straight-Line Method) berdasarkan estimasi masa manfaat.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-100 font-bold text-slate-800">
              <tr>
                <th className="p-2 border-b border-slate-200">Kode Aset</th>
                <th className="p-2 border-b border-slate-200">Nama Barang / Aset</th>
                <th className="p-2 border-b border-slate-200 text-center">Masa (Thn)</th>
                <th className="p-2 border-b border-slate-200 text-right">Harga Perolehan</th>
                <th className="p-2 border-b border-slate-200 text-right">Akum. Penyusutan</th>
                <th className="p-2 border-b border-slate-200 text-right">Nilai Buku</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fixedAssets.map((asset) => (
                <tr key={asset.id}>
                  <td className="p-2 font-mono text-[11px] text-slate-500">{asset.code}</td>
                  <td className="p-2 font-semibold text-slate-800">{asset.name}</td>
                  <td className="p-2 text-center">{asset.usefulLifeYears === 0 ? 'Permanen' : `${asset.usefulLifeYears} Thn`}</td>
                  <td className="p-2 text-right font-mono">{formatRupiah(asset.acquisitionCost)}</td>
                  <td className="p-2 text-right font-mono text-rose-600">
                    {asset.accumulatedDepreciation > 0 ? `(${formatRupiah(asset.accumulatedDepreciation)})` : 'Rp 0'}
                  </td>
                  <td className="p-2 text-right font-mono font-bold text-slate-900">{formatRupiah(asset.bookValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* C. KEWAJIBAN */}
      <div className="space-y-3">
        <h5 className="font-extrabold text-sm text-slate-900 border-b border-slate-300 pb-1.5 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          <span>C. RINCIAN KEWAJIBAN JANGKA PENDEK</span>
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-rose-50/60 border border-rose-100 rounded-xl space-y-2">
            <p className="font-bold text-slate-900">Rincian Hutang Operasional Per 31 Des {year}:</p>
            <ul className="space-y-1.5 pl-2 text-slate-700">
              {kewajibanItems.map((kew) => (
                <li key={kew.code} className="flex justify-between border-b border-rose-100 pb-1">
                  <span>{kew.name}</span>
                  <span className="font-mono font-semibold text-slate-900">{formatRupiah(kew.balance)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-slate-600">
            <p className="font-bold text-slate-900">Catatan Kebijakan Pelunasan Kewajiban:</p>
            <p>
              Seluruh kewajiban jangka pendek merupakan kewajiban operasional rutin bulanan (Gaji Guru, PPh 21, BPJS Ketenagakerjaan, dan Tagihan Supplier ATK) yang akan dilunasi pada minggu pertama bulan Januari tahun berikutnya dari saldo kas operasional yayasan.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
