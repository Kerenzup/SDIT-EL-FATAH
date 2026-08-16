import React, { useState, useEffect } from 'react';
import { SchoolUniformItem, UniformScheduleDay } from '../../types';
import { INITIAL_UNIFORMS, INITIAL_UNIFORM_SCHEDULE } from '../../data/initialData';
import {
  Shirt,
  Calendar,
  Plus,
  Trash2,
  Edit2,
  Save,
  CheckCircle2,
  Image as ImageIcon,
  Clock,
  Sparkles,
  RotateCcw,
  Tag,
  Check,
  X,
  Eye,
  Info,
  ShieldCheck,
  ShoppingBag,
  AlertTriangle,
  AlertCircle,
} from 'lucide-react';
import { MediaUploader } from '../common/MediaUploader';
import { safeSetLocalStorage } from '../../utils/safeStorage';

interface UniformCmsEditorProps {
  uniforms: SchoolUniformItem[];
  schedules: UniformScheduleDay[];
  onUpdateUniforms: (uniforms: SchoolUniformItem[]) => void;
  onUpdateSchedules: (schedules: UniformScheduleDay[]) => void;
  foundationPhone?: string;
}

const COLOR_PRESETS = [
  { id: 'red', name: 'Merah Marun (Nasional)', value: 'from-rose-600 via-red-600 to-rose-800', bgBadge: 'bg-rose-600 text-white' },
  { id: 'purple', name: 'Ungu Violet (Identitas)', value: 'from-purple-600 via-violet-600 to-purple-800', bgBadge: 'bg-purple-600 text-white' },
  { id: 'green', name: 'Hijau Zamrud (Batik/Islami)', value: 'from-emerald-600 via-green-600 to-teal-700', bgBadge: 'bg-emerald-600 text-white' },
  { id: 'brown', name: 'Cokelat (Pramuka)', value: 'from-amber-800 via-amber-700 to-yellow-900', bgBadge: 'bg-amber-800 text-white' },
  { id: 'blue', name: 'Biru Cerah (Olahraga/PJOK)', value: 'from-blue-600 via-sky-600 to-indigo-700', bgBadge: 'bg-sky-600 text-white' },
  { id: 'gold', name: 'Kuning Emas / Amber', value: 'from-amber-600 via-yellow-600 to-amber-700', bgBadge: 'bg-amber-600 text-white' },
  { id: 'teal', name: 'Toska Modern', value: 'from-teal-600 via-cyan-600 to-teal-800', bgBadge: 'bg-teal-600 text-white' },
];

export const UniformCmsEditor: React.FC<UniformCmsEditorProps> = ({
  uniforms,
  schedules,
  onUpdateUniforms,
  onUpdateSchedules,
}) => {
  const [subTab, setSubTab] = useState<'katalog' | 'jadwal' | 'panduan'>('katalog');
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Local state for items
  const [localUniforms, setLocalUniforms] = useState<SchoolUniformItem[]>(uniforms || INITIAL_UNIFORMS);
  const [localSchedules, setLocalSchedules] = useState<UniformScheduleDay[]>(schedules || INITIAL_UNIFORM_SCHEDULE);

  // Modal states for delete confirmation and reset
  const [confirmDeleteModal, setConfirmDeleteModal] = useState<SchoolUniformItem | null>(null);
  const [confirmResetModal, setConfirmResetModal] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Synchronize local state with props when parent state changes
  useEffect(() => {
    if (uniforms && uniforms.length > 0) {
      setLocalUniforms(uniforms);
    }
  }, [uniforms]);

  useEffect(() => {
    if (schedules && schedules.length > 0) {
      setLocalSchedules(schedules);
    }
  }, [schedules]);

  // Modal / Form state for Editing Uniform
  const [editingUniform, setEditingUniform] = useState<SchoolUniformItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);

  // Form fields for uniform creation/edition
  const [formData, setFormData] = useState<SchoolUniformItem>({
    id: '',
    name: '',
    category: 'Seragam Sekolah',
    scheduleDay: 'Senin',
    scheduleTimeNote: 'Pukul 07.00 - 14.30 WIB',
    description: '',
    components: [],
    rules: [],
    imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80',
    priceEstimate: 'Rp 350.000 / Setel',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    badge: 'Senin • Upacara',
    colorTheme: 'from-rose-600 via-red-600 to-rose-800',
  });

  // Temporary item inputs for components & rules lists
  const [newComponentInput, setNewComponentInput] = useState<string>('');
  const [newRuleInput, setNewRuleInput] = useState<string>('');

  // Temporary tag input for schedule accessories
  const [newScheduleAccInput, setNewScheduleAccInput] = useState<{ [dayIdx: number]: string }>({});

  const showNotification = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3500);
  };

  // Open Edit Modal
  const handleOpenEdit = (item: SchoolUniformItem) => {
    setEditingUniform(item);
    setFormData({ ...item });
    setIsAddingNew(false);
    setFormError(null);
  };

  // Open Add New Modal
  const handleOpenAddNew = () => {
    setIsAddingNew(true);
    setEditingUniform(null);
    setFormError(null);
    setFormData({
      id: `uniform-${Date.now()}`,
      name: '',
      category: 'Seragam Identitas Baru',
      scheduleDay: 'Senin & Kamis',
      scheduleTimeNote: 'Pukul 07.00 - 14.30 WIB',
      description: 'Deskripsi lengkap model seragam, filosofi desain, dan bahan kain berkualitas...',
      components: [
        'Kemeja seragam berlogo bordir sekolah',
        'Bawahan celana/rok sesuai ketentuan',
        'Kaos kaki putih & Sepatu hitam',
      ],
      rules: [
        'Digunakan rapi dan bersih sesuai jadwal.',
        'Atribut dan badge terpasang pada posisi yang ditentukan.',
      ],
      imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80',
      priceEstimate: 'Rp 350.000 / Setel',
      availableSizes: ['S', 'M', 'L', 'XL', 'XXL', 'Custom'],
      badge: 'Seragam Baru',
      colorTheme: 'from-emerald-600 via-green-600 to-teal-700',
    });
  };

  // Close Modal
  const handleCloseModal = () => {
    setEditingUniform(null);
    setIsAddingNew(false);
    setFormError(null);
  };

  // Save Form (Add or Edit)
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Nama seragam tidak boleh kosong!');
      return;
    }

    let updated: SchoolUniformItem[];
    if (isAddingNew) {
      updated = [...localUniforms, formData];
    } else {
      updated = localUniforms.map((item) => (item.id === formData.id ? formData : item));
    }

    setLocalUniforms(updated);
    onUpdateUniforms(updated);
    safeSetLocalStorage('yayasan_school_uniforms', updated);
    handleCloseModal();
    showNotification(isAddingNew ? 'Seragam baru berhasil ditambahkan!' : 'Perubahan data seragam berhasil disimpan!');
  };

  // Trigger Delete Modal
  const handleRequestDelete = (item: SchoolUniformItem) => {
    setConfirmDeleteModal(item);
  };

  // Execute Delete
  const handleExecuteDelete = () => {
    if (!confirmDeleteModal) return;
    if (localUniforms.length <= 1) {
      showNotification('Gagal: Minimal harus tersisa 1 model seragam dalam sistem!');
      setConfirmDeleteModal(null);
      return;
    }

    const targetId = confirmDeleteModal.id;
    const updated = localUniforms.filter((item) => item.id !== targetId);
    setLocalUniforms(updated);
    onUpdateUniforms(updated);
    safeSetLocalStorage('yayasan_school_uniforms', updated);
    
    if (editingUniform?.id === targetId) {
      handleCloseModal();
    }
    
    setConfirmDeleteModal(null);
    showNotification('Model seragam berhasil dihapus dari website.');
  };

  // Trigger Reset Modal
  const handleRequestResetToDefault = () => {
    setConfirmResetModal(true);
  };

  // Execute Reset
  const handleExecuteResetToDefault = () => {
    setLocalUniforms(INITIAL_UNIFORMS);
    setLocalSchedules(INITIAL_UNIFORM_SCHEDULE);
    onUpdateUniforms(INITIAL_UNIFORMS);
    onUpdateSchedules(INITIAL_UNIFORM_SCHEDULE);
    safeSetLocalStorage('yayasan_school_uniforms', INITIAL_UNIFORMS);
    safeSetLocalStorage('yayasan_uniform_schedules', INITIAL_UNIFORM_SCHEDULE);
    setConfirmResetModal(false);
    showNotification('Data seragam & jadwal telah di-reset ke standar default.');
  };

  // Save All Schedules
  const handleSaveSchedules = () => {
    onUpdateSchedules(localSchedules);
    safeSetLocalStorage('yayasan_uniform_schedules', localSchedules);
    showNotification('Jadwal pemakaian seragam Senin - Sabtu berhasil disimpan live!');
  };

  // Add accessory to schedule
  const handleAddScheduleAccessory = (dayIdx: number) => {
    const val = newScheduleAccInput[dayIdx]?.trim();
    if (!val) return;
    const updated = [...localSchedules];
    updated[dayIdx].accessories = [...updated[dayIdx].accessories, val];
    setLocalSchedules(updated);
    setNewScheduleAccInput({ ...newScheduleAccInput, [dayIdx]: '' });
  };

  // Remove accessory from schedule
  const handleRemoveScheduleAccessory = (dayIdx: number, accIdx: number) => {
    const updated = [...localSchedules];
    updated[dayIdx].accessories = updated[dayIdx].accessories.filter((_, i) => i !== accIdx);
    setLocalSchedules(updated);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 bg-emerald-600 text-white font-black text-xs rounded-2xl shadow-2xl flex items-center gap-2.5 animate-bounce border-2 border-emerald-400">
          <CheckCircle2 className="w-5 h-5 text-amber-300" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Header Info Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white p-6 rounded-3xl border border-emerald-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-black rounded-full border border-emerald-500/30">
            <Shirt className="w-3.5 h-3.5 text-amber-300" /> Modul CMS Seragam Sekolah & Jadwal Siswa
          </div>
          <h2 className="text-2xl font-black text-white">Pengaturan Seragam Sekolah, Foto Katalog & Jadwal Pemakaian</h2>
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            Kelola 5 seragam resmi sekolah (Merah Putih, Kotak Ungu, Batik Hijau, Pramuka, Olahraga), upload foto asli seragam, atur atribut kelengkapan, rincian biaya setel, dan jadwal harian Senin s.d. Sabtu.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            type="button"
            onClick={handleRequestResetToDefault}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
            title="Kembalikan ke data 5 seragam standar"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Standar</span>
          </button>
          <button
            type="button"
            onClick={handleOpenAddNew}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl shadow-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Model Seragam</span>
          </button>
        </div>
      </div>

      {/* Sub Tab Navigation */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSubTab('katalog')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 cursor-pointer ${
            subTab === 'katalog' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Shirt className="w-4 h-4" />
          <span>Katalog 5 Model Seragam ({localUniforms.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setSubTab('jadwal')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 cursor-pointer ${
            subTab === 'jadwal' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Jadwal Pemakaian Harian (Senin - Sabtu)</span>
        </button>
        <button
          type="button"
          onClick={() => setSubTab('panduan')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 cursor-pointer ${
            subTab === 'panduan' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Info className="w-4 h-4" />
          <span>Panduan Ukuran & Tata Tertib</span>
        </button>
      </div>

      {/* ================= TAB 1: KATALOG SERAGAM ================= */}
      {subTab === 'katalog' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Shirt className="w-5 h-5 text-emerald-600" />
              <span>Daftar Model Seragam yang Tampil di Website Publik</span>
            </h3>
            <button
              type="button"
              onClick={handleOpenAddNew}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Seragam Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {localUniforms.map((item, idx) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition group"
              >
                <div>
                  {/* Photo with Overlay Badge */}
                  <div className="relative h-56 bg-slate-100 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-3 py-1 bg-amber-400 text-slate-950 font-black text-[11px] rounded-full shadow-sm">
                        #{idx + 1} {item.badge || item.scheduleDay}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                        {item.category}
                      </div>
                      <h4 className="text-base font-black text-white leading-snug drop-shadow-sm">
                        {item.name}
                      </h4>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-3.5">
                    {/* Time and Price */}
                    <div className="flex items-center justify-between text-xs gap-2 pt-1 border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{item.scheduleDay}</span>
                      </div>
                      {item.priceEstimate && (
                        <div className="font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg text-[11px]">
                          {item.priceEstimate.split('(')[0]}
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Components Preview */}
                    <div className="space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <Tag className="w-3 h-3 text-emerald-600" />
                        <span>Kelengkapan Atribut ({item.components.length}):</span>
                      </div>
                      <ul className="text-[11px] text-slate-700 space-y-1">
                        {item.components.slice(0, 3).map((comp, cIdx) => (
                          <li key={cIdx} className="flex items-center gap-1.5 truncate">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                            <span className="truncate">{comp}</span>
                          </li>
                        ))}
                        {item.components.length > 3 && (
                          <li className="text-[10px] font-bold text-emerald-700 pl-3">
                            +{item.components.length - 3} atribut lainnya...
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(item)}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Data & Foto</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRequestDelete(item)}
                    className="p-2.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-xl transition cursor-pointer flex items-center justify-center"
                    title={`Hapus model seragam ${item.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 2: JADWAL PEMAKAIAN HARIAN ================= */}
      {subTab === 'jadwal' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <span>Jadwal Seragam Siswa Senin s.d. Sabtu</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tentukan jenis seragam, kelengkapan aksesoris, dan catatan khusus kedisiplinan untuk tiap hari belajar.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSaveSchedules}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow-md flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Seluruh Jadwal</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {localSchedules.map((sch, dayIdx) => (
                <div key={dayIdx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3.5 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-slate-900 text-amber-300 font-black text-xs rounded-xl shadow-xs">
                        Hari {sch.day}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Jadwal #{dayIdx + 1}
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama Seragam</label>
                      <input
                        type="text"
                        value={sch.uniformName}
                        onChange={(e) => {
                          const updated = [...localSchedules];
                          updated[dayIdx].uniformName = e.target.value;
                          setLocalSchedules(updated);
                        }}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Tipe / Kategori Hari</label>
                      <input
                        type="text"
                        value={sch.uniformType}
                        onChange={(e) => {
                          const updated = [...localSchedules];
                          updated[dayIdx].uniformType = e.target.value;
                          setLocalSchedules(updated);
                        }}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Catatan Khusus Hari Ini</label>
                      <textarea
                        rows={2}
                        value={sch.note}
                        onChange={(e) => {
                          const updated = [...localSchedules];
                          updated[dayIdx].note = e.target.value;
                          setLocalSchedules(updated);
                        }}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                      />
                    </div>

                    {/* Accessories Tags */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                        Aksesoris & Kelengkapan Wajib:
                      </label>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {sch.accessories.map((acc, aIdx) => (
                          <span
                            key={aIdx}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 text-slate-800 text-[11px] font-medium rounded-lg shadow-xs"
                          >
                            <span>{acc}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveScheduleAccessory(dayIdx, aIdx)}
                              className="text-rose-500 hover:text-rose-700 cursor-pointer ml-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>

                      {/* Add accessory tag */}
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          placeholder="Tambah atribut..."
                          value={newScheduleAccInput[dayIdx] || ''}
                          onChange={(e) => setNewScheduleAccInput({ ...newScheduleAccInput, [dayIdx]: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddScheduleAccessory(dayIdx);
                            }
                          }}
                          className="flex-1 bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddScheduleAccessory(dayIdx)}
                          className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleSaveSchedules}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Seluruh Jadwal Pemakaian Seragam</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: PANDUAN UKURAN & ATURAN ================= */}
      {subTab === 'panduan' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Info className="w-5 h-5 text-emerald-600" />
                <span>Panduan Standar Ukuran Badan Siswa (Size Chart S - XXL)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Tabel acuan ukuran standar seragam sekolah untuk panduan orang tua / wali murid saat melakukan pemesanan.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 font-black border-b border-slate-200">
                    <th className="p-3">Ukuran (Size)</th>
                    <th className="p-3">Perkiraan Usia / Jenjang</th>
                    <th className="p-3">Lebar Dada (cm)</th>
                    <th className="p-3">Panjang Baju (cm)</th>
                    <th className="p-3">Panjang Celana/Rok (cm)</th>
                    <th className="p-3">Lingkar Pinggang (cm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">S (Small)</td>
                    <td className="p-3">Kelas 1 - 2 (Usia 6 - 7 Thn)</td>
                    <td className="p-3">38 cm</td>
                    <td className="p-3">50 cm</td>
                    <td className="p-3">68 cm</td>
                    <td className="p-3">52 - 64 cm</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">M (Medium)</td>
                    <td className="p-3">Kelas 2 - 3 (Usia 7 - 8 Thn)</td>
                    <td className="p-3">41 cm</td>
                    <td className="p-3">54 cm</td>
                    <td className="p-3">72 cm</td>
                    <td className="p-3">56 - 68 cm</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">L (Large)</td>
                    <td className="p-3">Kelas 4 - 5 (Usia 9 - 10 Thn)</td>
                    <td className="p-3">44 cm</td>
                    <td className="p-3">58 cm</td>
                    <td className="p-3">78 cm</td>
                    <td className="p-3">60 - 74 cm</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">XL (Extra Large)</td>
                    <td className="p-3">Kelas 5 - 6 (Usia 11 - 12 Thn)</td>
                    <td className="p-3">47 cm</td>
                    <td className="p-3">62 cm</td>
                    <td className="p-3">84 cm</td>
                    <td className="p-3">64 - 80 cm</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">XXL / Jumbo</td>
                    <td className="p-3">Kelas 6+ / Postur Tinggi</td>
                    <td className="p-3">50 cm</td>
                    <td className="p-3">66 cm</td>
                    <td className="p-3">90 cm</td>
                    <td className="p-3">68 - 86 cm</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950 space-y-2">
              <div className="font-extrabold flex items-center gap-1.5 text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Ketentuan Tata Tertib & Layanan Fitting Koperasi Sekolah</span>
              </div>
              <p className="leading-relaxed">
                Orang tua dapat membawa ananda untuk mencoba langsung sampel ukuran (fitting size) di ruang Tata Usaha / Koperasi Sekolah pada hari kerja (Senin s.d. Jumat pukul 07.30 - 15.00 WIB). Seragam yang telah dibeli dapat ditukar ukuran dalam jangka waktu 7 hari kerja selama label belum dilepas dan kondisi seragam belum dicuci.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= EDIT / ADD MODAL ================= */}
      {(editingUniform || isAddingNew) && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 sticky top-0 z-20">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-400 text-slate-950 rounded-xl font-black">
                  <Shirt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    {isAddingNew ? 'Tambah Model Seragam Baru' : `Edit Data: ${formData.name}`}
                  </h3>
                  <p className="text-xs text-slate-300">
                    Pengaturan data atribut, foto resolusi tinggi, harga estimasi, dan tata tertib pemakaian.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveForm} className="p-5 sm:p-6 space-y-5">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-xs text-rose-800 font-semibold animate-shake">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Seragam <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Seragam Merah Putih dan Rompi"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kategori / Identitas Seragam
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Contoh: Seragam Nasional & Upacara"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hari Pemakaian
                  </label>
                  <input
                    type="text"
                    value={formData.scheduleDay}
                    onChange={(e) => setFormData({ ...formData, scheduleDay: e.target.value })}
                    placeholder="Contoh: Senin / Setiap Hari Upacara"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Catatan Waktu / Sesi
                  </label>
                  <input
                    type="text"
                    value={formData.scheduleTimeNote || ''}
                    onChange={(e) => setFormData({ ...formData, scheduleTimeNote: e.target.value })}
                    placeholder="Pukul 06.45 - 14.30 WIB"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Badge Label
                  </label>
                  <input
                    type="text"
                    value={formData.badge || ''}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="Contoh: Senin • Upacara"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Estimasi Harga / Biaya Setel
                  </label>
                  <input
                    type="text"
                    value={formData.priceEstimate || ''}
                    onChange={(e) => setFormData({ ...formData, priceEstimate: e.target.value })}
                    placeholder="Contoh: Rp 380.000 / Setel"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tema Warna / Gradient Badge
                  </label>
                  <select
                    value={formData.colorTheme}
                    onChange={(e) => setFormData({ ...formData, colorTheme: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                  >
                    {COLOR_PRESETS.map((p) => (
                      <option key={p.id} value={p.value}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Photo Upload */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <MediaUploader
                  label="Upload Foto Seragam (Pilih Foto dari Komputer atau Tempel URL Foto)"
                  value={formData.imageUrl}
                  onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                  mediaType="photo"
                />

                {formData.imageUrl && (
                  <div className="mt-2 flex items-center gap-3">
                    <img
                      src={formData.imageUrl}
                      alt="Pratinjau Seragam"
                      className="w-20 h-20 object-cover rounded-xl border border-slate-300 shadow-xs"
                    />
                    <div className="text-xs text-slate-500">
                      <div className="font-bold text-slate-800">Pratinjau Foto Seragam Aktif</div>
                      <div>Foto akan tampil di banner katalog website publik.</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Deskripsi Lengkap & Bahan Seragam
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Jelaskan jenis kain, kenyamanan, dan makna filosofis seragam..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                />
              </div>

              {/* Components List */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <label className="block text-xs font-black text-slate-800">
                  Daftar Kelengkapan Komponen / Atribut ({formData.components.length})
                </label>
                
                <div className="space-y-1.5">
                  {formData.components.map((comp, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <input
                        type="text"
                        value={comp}
                        onChange={(e) => {
                          const updated = [...formData.components];
                          updated[idx] = e.target.value;
                          setFormData({ ...formData, components: updated });
                        }}
                        className="flex-1 bg-transparent text-xs font-medium text-slate-800 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.components.filter((_, i) => i !== idx);
                          setFormData({ ...formData, components: updated });
                        }}
                        className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Tambah komponen atribut (misal: Rompi Rajut, Dasi Bordir, Topi)..."
                    value={newComponentInput}
                    onChange={(e) => setNewComponentInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newComponentInput.trim()) {
                          setFormData({
                            ...formData,
                            components: [...formData.components, newComponentInput.trim()],
                          });
                          setNewComponentInput('');
                        }
                      }
                    }}
                    className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newComponentInput.trim()) {
                        setFormData({
                          ...formData,
                          components: [...formData.components, newComponentInput.trim()],
                        });
                        setNewComponentInput('');
                      }
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah</span>
                  </button>
                </div>
              </div>

              {/* Rules List */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <label className="block text-xs font-black text-slate-800">
                  Tata Tertib & Aturan Pemakaian ({formData.rules.length})
                </label>

                <div className="space-y-1.5">
                  {formData.rules.map((rule, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      <input
                        type="text"
                        value={rule}
                        onChange={(e) => {
                          const updated = [...formData.rules];
                          updated[idx] = e.target.value;
                          setFormData({ ...formData, rules: updated });
                        }}
                        className="flex-1 bg-transparent text-xs font-medium text-slate-800 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.rules.filter((_, i) => i !== idx);
                          setFormData({ ...formData, rules: updated });
                        }}
                        className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Tambah aturan (misal: Digunakan wajib rapi, sepatu hitam polos)..."
                    value={newRuleInput}
                    onChange={(e) => setNewRuleInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newRuleInput.trim()) {
                          setFormData({
                            ...formData,
                            rules: [...formData.rules, newRuleInput.trim()],
                          });
                          setNewRuleInput('');
                        }
                      }
                    }}
                    className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newRuleInput.trim()) {
                        setFormData({
                          ...formData,
                          rules: [...formData.rules, newRuleInput.trim()],
                        });
                        setNewRuleInput('');
                      }
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah</span>
                  </button>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3 sticky bottom-0 bg-white py-2">
                {!isAddingNew && editingUniform ? (
                  <button
                    type="button"
                    onClick={() => handleRequestDelete(editingUniform)}
                    className="px-4 py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Seragam Ini</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Data Seragam</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL KONFIRMASI HAPUS SERAGAM ================= */}
      {confirmDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center gap-3.5 text-rose-600">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h4 className="text-base font-black text-slate-900">Hapus Model Seragam?</h4>
                <p className="text-xs text-slate-500">Tindakan ini akan menghapus seragam dari website publik.</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs text-slate-700">
              <p className="font-bold text-slate-900 text-sm">
                {confirmDeleteModal.name}
              </p>
              <p className="text-slate-500">
                Kategori: <span className="font-semibold text-slate-800">{confirmDeleteModal.category}</span> ({confirmDeleteModal.scheduleDay})
              </p>
              {localUniforms.length <= 1 && (
                <div className="p-2.5 bg-amber-50 text-amber-900 rounded-xl border border-amber-200 flex items-start gap-2 text-[11px] font-semibold mt-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>Peringatan: Ini adalah satu-satunya seragam yang tersisa. Sistem membutuhkan minimal 1 model seragam.</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteModal(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={localUniforms.length <= 1}
                onClick={handleExecuteDelete}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL KONFIRMASI RESET STANDAR ================= */}
      {confirmResetModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center gap-3.5 text-amber-600">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
                <RotateCcw className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h4 className="text-base font-black text-slate-900">Reset ke 5 Seragam Standar?</h4>
                <p className="text-xs text-slate-500">Kembalikan daftar seragam dan jadwal ke default.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Tindakan ini akan mengembalikan 5 model seragam resmi sekolah (Merah Putih, Kotak Ungu, Batik Hijau, Pramuka, Kaos Olahraga) dan jadwal harian Senin - Sabtu ke pengaturan awal sekolah.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmResetModal(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleExecuteResetToDefault}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ya, Reset Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
