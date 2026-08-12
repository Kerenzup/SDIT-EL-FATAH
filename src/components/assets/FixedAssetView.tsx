import React, { useState } from 'react';
import { FixedAsset } from '../../types';
import { formatRupiah, formatDateIndonesian } from '../../utils/formatters';
import { printDocument } from '../../utils/printHelper';
import {
  Building,
  PlusCircle,
  Printer,
  Edit,
  Trash2,
  Search,
  CheckCircle2,
  X,
  AlertCircle,
} from 'lucide-react';

interface FixedAssetViewProps {
  assets: FixedAsset[];
  onAddAsset: (asset: FixedAsset) => void;
  onUpdateAsset?: (asset: FixedAsset) => void;
  onDeleteAsset?: (id: string) => void;
}

export const FixedAssetView: React.FC<FixedAssetViewProps> = ({
  assets,
  onAddAsset,
  onUpdateAsset,
  onDeleteAsset,
}) => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingAsset, setEditingAsset] = useState<FixedAsset | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('SEMUA');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State for Add
  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<string>('Komputer & Laptop');
  const [purchaseDate, setPurchaseDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [acquisitionCost, setAcquisitionCost] = useState<number>(15000000);
  const [usefulLifeYears, setUsefulLifeYears] = useState<number>(4);
  const [accumulatedDep, setAccumulatedDep] = useState<number>(0);
  const [condition, setCondition] = useState<'Baik' | 'Perlu Perbaikan' | 'Rusak'>('Baik');

  // Form State for Edit
  const [editName, setEditName] = useState<string>('');
  const [editCode, setEditCode] = useState<string>('');
  const [editCategory, setEditCategory] = useState<string>('');
  const [editPurchaseDate, setEditPurchaseDate] = useState<string>('');
  const [editAcquisitionCost, setEditAcquisitionCost] = useState<number>(0);
  const [editUsefulLifeYears, setEditUsefulLifeYears] = useState<number>(0);
  const [editAccumulatedDep, setEditAccumulatedDep] = useState<number>(0);
  const [editCondition, setEditCondition] = useState<'Baik' | 'Perlu Perbaikan' | 'Rusak'>('Baik');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const totalAcquisition = assets.reduce((sum, a) => sum + a.acquisitionCost, 0);
  const totalAccumulatedDep = assets.reduce((sum, a) => sum + a.accumulatedDepreciation, 0);
  const totalBookValue = assets.reduce((sum, a) => sum + a.bookValue, 0);

  const filteredAssets = assets.filter((ast) => {
    const matchesSearch =
      ast.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ast.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ast.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'SEMUA' || ast.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const annualDep = usefulLifeYears > 0 ? Math.round(acquisitionCost / usefulLifeYears) : 0;
    const bkValue = Math.max(0, acquisitionCost - accumulatedDep);

    const newAsset: FixedAsset = {
      id: `ast-${Date.now()}`,
      code: `AST-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      category,
      purchaseDate,
      acquisitionCost,
      usefulLifeYears,
      accumulatedDepreciation: accumulatedDep,
      bookValue: bkValue,
      annualDepreciation: annualDep,
      condition,
    };

    onAddAsset(newAsset);
    setShowAddModal(false);
    setName('');
    setAccumulatedDep(0);
    showToast(`Aset "${newAsset.name}" berhasil ditambahkan ke Register!`);
  };

  const handleOpenEdit = (ast: FixedAsset) => {
    setEditingAsset(ast);
    setEditCode(ast.code);
    setEditName(ast.name);
    setEditCategory(ast.category);
    setEditPurchaseDate(ast.purchaseDate);
    setEditAcquisitionCost(ast.acquisitionCost);
    setEditUsefulLifeYears(ast.usefulLifeYears);
    setEditAccumulatedDep(ast.accumulatedDepreciation);
    setEditCondition(ast.condition || 'Baik');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAsset || !onUpdateAsset) return;

    const annualDep = editUsefulLifeYears > 0 ? Math.round(editAcquisitionCost / editUsefulLifeYears) : 0;
    const bkValue = Math.max(0, editAcquisitionCost - editAccumulatedDep);

    const updated: FixedAsset = {
      ...editingAsset,
      code: editCode,
      name: editName,
      category: editCategory,
      purchaseDate: editPurchaseDate,
      acquisitionCost: editAcquisitionCost,
      usefulLifeYears: editUsefulLifeYears,
      accumulatedDepreciation: editAccumulatedDep,
      bookValue: bkValue,
      annualDepreciation: annualDep,
      condition: editCondition,
    };

    onUpdateAsset(updated);
    setEditingAsset(null);
    showToast(`Data aset "${updated.name}" berhasil diperbarui!`);
  };

  const handleDelete = (id: string, name: string) => {
    if (onDeleteAsset) {
      onDeleteAsset(id);
      showToast(`Aset "${name}" berhasil dihapus dari Register.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      {toastMessage && (
        <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-lg flex items-center justify-between gap-3 animate-fade-in print:hidden">
          <div className="flex items-center gap-3 text-xs font-bold">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)}>
            <X className="w-4 h-4 opacity-80 hover:opacity-100" />
          </button>
        </div>
      )}

      {/* Top Banner & Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">TOTAL HARGA PEROLEHAN ASET</p>
          <p className="text-xl font-extrabold text-slate-900 mt-1 font-mono">{formatRupiah(totalAcquisition)}</p>
          <p className="text-[11px] text-slate-400 mt-1">Gedung, Tanah, Lab & Komputer</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">AKUMULASI PENYUSUTAN ASET</p>
          <p className="text-xl font-extrabold text-rose-600 mt-1 font-mono">({formatRupiah(totalAccumulatedDep)})</p>
          <p className="text-[11px] text-slate-400 mt-1">Metode Garis Lurus (Straight-Line)</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">NILAI BUKU BERSIH (BOOK VALUE)</p>
          <p className="text-xl font-extrabold text-emerald-600 mt-1 font-mono">{formatRupiah(totalBookValue)}</p>
          <p className="text-[11px] text-slate-400 mt-1">Dicatat pada Neraca Aset Tetap</p>
        </div>
      </div>

      {/* Main Table Register */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="font-bold text-slate-900 text-base">Register Aset Tetap & Depresiasi Sekolah</h3>
              <p className="text-xs text-slate-500">
                Inventarisasi & Akumulasi Penyusutan Berstandar Akuntansi ISAK 35 (Dapat Di-edit)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Registrasi Aset Baru</span>
            </button>
            <button
              onClick={() => printDocument('printable-report', 'Register Aset Tetap Yayasan')}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow transition cursor-pointer"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>Cetak Register Aset</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari kode atau nama barang aset..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Filter Kategori:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-emerald-500"
            >
              <option value="SEMUA">Semua Kategori</option>
              <option value="Tanah">Tanah</option>
              <option value="Bangunan Gedung">Bangunan Gedung</option>
              <option value="Peralatan Mengajar">Peralatan Mengajar & Lab</option>
              <option value="Komputer & Laptop">Komputer & Laptop</option>
              <option value="Kendaraan">Kendaraan Operasional</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 font-extrabold text-slate-800 uppercase tracking-wider">
              <tr>
                <th className="p-3 border-b border-slate-200">Kode Aset</th>
                <th className="p-3 border-b border-slate-200">Nama Barang / Inventaris</th>
                <th className="p-3 border-b border-slate-200">Kategori</th>
                <th className="p-3 border-b border-slate-200">Tgl Beli</th>
                <th className="p-3 border-b border-slate-200 text-right">Harga Perolehan</th>
                <th className="p-3 border-b border-slate-200 text-center">Masa (Thn)</th>
                <th className="p-3 border-b border-slate-200 text-right">Akum. Penyusutan</th>
                <th className="p-3 border-b border-slate-200 text-right">Nilai Buku</th>
                <th className="p-3 border-b border-slate-200 text-center print:hidden">Aksi Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-6 text-center text-slate-500 italic">
                    Tidak ada data aset tetap yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredAssets.map((ast) => (
                  <tr key={ast.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-mono font-bold text-slate-900">{ast.code}</td>
                    <td className="p-3 font-semibold text-slate-900">
                      <div>{ast.name}</div>
                      {ast.condition && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                            ast.condition === 'Baik'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ast.condition === 'Perlu Perbaikan'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {ast.condition}
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-semibold text-slate-600">{ast.category}</td>
                    <td className="p-3 font-mono text-slate-500">{formatDateIndonesian(ast.purchaseDate)}</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900">
                      {formatRupiah(ast.acquisitionCost)}
                    </td>
                    <td className="p-3 text-center">
                      {ast.usefulLifeYears === 0 ? 'Permanen' : `${ast.usefulLifeYears} Thn`}
                    </td>
                    <td className="p-3 text-right font-mono text-rose-600">
                      {ast.accumulatedDepreciation > 0 ? `(${formatRupiah(ast.accumulatedDepreciation)})` : 'Rp 0'}
                    </td>
                    <td className="p-3 text-right font-mono font-extrabold text-emerald-700">
                      {formatRupiah(ast.bookValue)}
                    </td>
                    <td className="p-3 text-center print:hidden">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(ast)}
                          className="p-1.5 bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 rounded-lg transition cursor-pointer"
                          title="Edit Data Aset & Depresiasi"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(ast.id, ast.name)}
                          className="p-1.5 bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700 rounded-lg transition cursor-pointer"
                          title="Hapus Aset"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Asset */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 text-base">Registrasi Aset Tetap Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Barang / Aset</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: 10 Unit Proyektor Epson HD"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Aset</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                >
                  <option value="Tanah">Tanah</option>
                  <option value="Bangunan Gedung">Bangunan Gedung</option>
                  <option value="Peralatan Mengajar">Peralatan Mengajar & Lab</option>
                  <option value="Komputer & Laptop">Komputer & Laptop</option>
                  <option value="Kendaraan">Kendaraan Operasional</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Harga Perolehan (Rp)</label>
                  <input
                    type="number"
                    value={acquisitionCost}
                    onChange={(e) => setAcquisitionCost(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Akum. Penyusutan (Rp)</label>
                  <input
                    type="number"
                    value={accumulatedDep}
                    onChange={(e) => setAccumulatedDep(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-rose-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Masa Manfaat (Thn)</label>
                  <input
                    type="number"
                    value={usefulLifeYears}
                    onChange={(e) => setUsefulLifeYears(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kondisi Barang</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as 'Baik' | 'Perlu Perbaikan' | 'Rusak')}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Baik">Baik</option>
                    <option value="Perlu Perbaikan">Perlu Perbaikan</option>
                    <option value="Rusak">Rusak</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Perolehan</label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow cursor-pointer"
                >
                  Simpan Aset Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Asset */}
      {editingAsset && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Edit Register Aset & Penyusutan</h3>
              </div>
              <button onClick={() => setEditingAsset(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kode Aset</label>
                  <input
                    type="text"
                    value={editCode}
                    onChange={(e) => setEditCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Aset</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Tanah">Tanah</option>
                    <option value="Bangunan Gedung">Bangunan Gedung</option>
                    <option value="Peralatan Mengajar">Peralatan Mengajar & Lab</option>
                    <option value="Komputer & Laptop">Komputer & Laptop</option>
                    <option value="Kendaraan">Kendaraan Operasional</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Barang / Inventaris</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Harga Perolehan (Rp)</label>
                  <input
                    type="number"
                    value={editAcquisitionCost}
                    onChange={(e) => setEditAcquisitionCost(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Akumulasi Penyusutan (Rp)</label>
                  <input
                    type="number"
                    value={editAccumulatedDep}
                    onChange={(e) => setEditAccumulatedDep(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-rose-600 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              {/* Real-Time Calculated Book Value preview */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex justify-between items-center text-xs">
                <span className="font-bold text-emerald-900">Nilai Buku Bersih Terhitung:</span>
                <span className="font-mono font-black text-emerald-800 text-sm">
                  {formatRupiah(Math.max(0, editAcquisitionCost - editAccumulatedDep))}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Masa Manfaat (Thn)</label>
                  <input
                    type="number"
                    value={editUsefulLifeYears}
                    onChange={(e) => setEditUsefulLifeYears(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kondisi Barang</label>
                  <select
                    value={editCondition}
                    onChange={(e) => setEditCondition(e.target.value as 'Baik' | 'Perlu Perbaikan' | 'Rusak')}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Baik">Baik</option>
                    <option value="Perlu Perbaikan">Perlu Perbaikan</option>
                    <option value="Rusak">Rusak</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Perolehan</label>
                <input
                  type="date"
                  value={editPurchaseDate}
                  onChange={(e) => setEditPurchaseDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingAsset(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow cursor-pointer"
                >
                  Simpan Perubahan Aset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
