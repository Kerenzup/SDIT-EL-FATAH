import React, { useState, useEffect } from 'react';
import { FoundationProfile } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  FileCheck,
  UserCheck,
  Save,
  RotateCcw,
  CheckCircle2,
  Sliders,
  ShieldCheck,
  Printer,
  Users,
  AlertTriangle,
  Send,
  Lock,
  Camera,
  Download,
  Upload,
  RefreshCw,
  Share2,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { MediaUploader } from '../common/MediaUploader';
import { safeSetLocalStorage } from '../../utils/safeStorage';
import { generateSharedUrl } from '../../utils/shareUrl';

interface FoundationSettingsViewProps {
  profile: FoundationProfile;
  onSaveProfile: (newProfile: FoundationProfile) => void;
  onResetDefaults?: () => void;
  onRestoreMasterData?: () => void;
  onExportBackup?: () => void;
  onImportBackup?: (importedData: any) => void;
}

export const FoundationSettingsView: React.FC<FoundationSettingsViewProps> = ({
  profile,
  onSaveProfile,
  onResetDefaults,
  onRestoreMasterData,
  onExportBackup,
  onImportBackup,
}) => {
  const [formData, setFormData] = useState<FoundationProfile>(profile);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Approval Coordination State
  const [profileApprovalStatus, setProfileApprovalStatus] = useState<'DISETUJUI' | 'MENUNGGU_PERSETUJUAN'>('DISETUJUI');
  const [approvalLog, setApprovalLog] = useState<string[]>([
    'System: Identitas Yayasan versi 1.0 telah disetujui Pengurus Utama.',
  ]);

  const sharedAppUrl = generateSharedUrl(formData);

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleChange = (field: keyof FoundationProfile, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(sharedAppUrl);
    setCopiedLink(true);
    triggerToast('Link Aplikasi Resmi Berhasil Disalin ke Clipboard!');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (onImportBackup) {
          onImportBackup(json);
          triggerToast('Data Backup Berhasil Diimpor & Disinkronkan Ke Seluruh Modul!');
        }
      } catch (err) {
        alert('Gagal membaca file JSON. Pastikan format file backup valid.');
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (onSaveProfile) {
      onSaveProfile(formData);
    }
    safeSetLocalStorage('yayasan_profile', formData);
    setProfileApprovalStatus('DISETUJUI');
    setApprovalLog((prev) => [
      `User (${new Date().toLocaleTimeString()}): Perubahan identitas & foto pengurus yayasan telah disimpan ke database.`,
      ...prev,
    ]);
    triggerToast('Pengaturan Profil & Foto Pengurus Yayasan Berhasil Disimpan!');
  };

  const handleRequestApproval = () => {
    setProfileApprovalStatus('MENUNGGU_PERSETUJUAN');
    setApprovalLog((prev) => [
      `Sistem (${new Date().toLocaleTimeString()}): Pengajuan koordinasi perubahan profil dikirim ke Ketua Yayasan.`,
      ...prev,
    ]);
    triggerToast('Pengajuan perubahan profil telah dikirim untuk koordinasi & persetujuan Ketua Yayasan!');
  };

  const handleApproveChanges = () => {
    if (onSaveProfile) {
      onSaveProfile(formData);
    }
    setProfileApprovalStatus('DISETUJUI');
    setApprovalLog((prev) => [
      `Ketua Yayasan (${new Date().toLocaleTimeString()}): Perubahan identitas yayasan disetujui resmi.`,
      ...prev,
    ]);
    triggerToast('Perubahan profil yayasan resmi DISETUJUI oleh Ketua Yayasan!');
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <div>
            <p className="font-bold text-xs">{toastMessage}</p>
            <p className="text-[11px] text-emerald-100">
              Perubahan tersinkronisasi otomatis di seluruh modul ERP & Website Resmi.
            </p>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full text-[10px] font-extrabold uppercase border border-emerald-500/30">
              Pengaturan Pusat ERP
            </span>
            <span className="text-slate-400 text-xs">&bull; Identitas, Legalitas & Foto Pengurus</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">
            Pengaturan Profil, Identitas & Foto Pengurus Yayasan
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Kelola profil resmi yayasan, logo, foto pimpinan & jajaran pengurus (Pembina, Ketua, Sekretaris, Bendahara, Kepala Sekolah) serta persetujuan perubahan identitas resmi.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={(e) => handleSubmit(e as any)}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg transition flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Pengaturan Yayasan</span>
          </button>

          {onResetDefaults && (
            <button
              type="button"
              onClick={() => {
                if (onResetDefaults) {
                  onResetDefaults();
                }
              }}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>Reset Default</span>
            </button>
          )}
        </div>
      </div>

      {/* BOX KHUSUS: TAUTAN PEMBAGIAN APLIKASI UNTUK STAF & SINKRONISASI MASTER DATA */}
      <div className="bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 p-6 sm:p-7 rounded-3xl text-white border border-blue-400/30 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg">
              <Share2 className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>Link Pembagian Resmi Aplikasi ERP & Public Website Staf</span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-full border border-emerald-500/30">
                  Siap Dibagikan
                </span>
              </h3>
              <p className="text-xs text-blue-200 mt-0.5">
                Gunakan tautan ini untuk dibagikan ke seluruh Staf, Guru, Pengurus Yayasan, dan Wali Murid.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md flex items-center gap-2 transition cursor-pointer"
            >
              <Copy className="w-4 h-4" />
              <span>{copiedLink ? 'Link Berhasil Disalin!' : 'Salin Link Staf'}</span>
            </button>
            <a
              href={sharedAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Buka Tautan Staf</span>
            </a>
          </div>
        </div>

        {/* Display Link & Action Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 bg-slate-950/80 p-4 rounded-2xl border border-blue-900/80 space-y-2">
            <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider block">
              Tautan Aplikasi Produksi (Shared App URL):
            </span>
            <div className="flex items-center justify-between gap-2 bg-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-800 font-mono text-xs text-amber-300 select-all overflow-x-auto">
              <span>{sharedAppUrl}</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed pt-1">
              💡 <strong>Petunjuk untuk Staf:</strong> Buka link di atas di browser mana saja. Staf dapat langsung masuk ke modul sesuai wewenang melalui tombol login role (Ketua, Bendahara, Kepsek, Guru Rombel, Wali Murid).
            </p>
          </div>

          <div className="lg:col-span-5 bg-blue-950/50 p-4 rounded-2xl border border-blue-800/50 space-y-3">
            <span className="text-xs font-black text-amber-300 flex items-center gap-1.5 uppercase tracking-wide">
              <RefreshCw className="w-4 h-4 text-amber-400" />
              <span>Sinkronisasi & Backup Data ERP</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  const confirmReset = window.confirm(
                    'Apakah Anda yakin ingin memulihkan seluruh data ke Master Data Produksi Selesai (Yayasan Pendidikan Daarul Habibah)? Seluruh data akan dikembalikan ke posisi lengkap.'
                  );
                  if (confirmReset && onRestoreMasterData) {
                    onRestoreMasterData();
                    triggerToast('Seluruh Data Berhasil Dipulihkan Ke Posisi Master Data Produksi Selesai!');
                  }
                }}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-xl shadow transition flex items-center justify-center gap-1.5 cursor-pointer text-center"
                title="Muat Ulang Seluruh Data Master Produksi LENGKAP"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Memulihkan Data Master</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onExportBackup) {
                    onExportBackup();
                    triggerToast('File Backup ERP Berhasil Diunduh!');
                  }
                }}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold rounded-xl shadow transition flex items-center justify-center gap-1.5 cursor-pointer text-center"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Ekspor Backup</span>
              </button>

              <label className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold rounded-xl shadow transition flex items-center justify-center gap-1.5 cursor-pointer text-center">
                <Upload className="w-3.5 h-3.5" />
                <span>Impor Backup</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* ================= FORMULIR PROFIL YAYASAN & PEJABAT ================= */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Columns: Form Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Coordination & Approval Box (Request 5) */}
            <div className="bg-amber-50/80 p-5 rounded-2xl border border-amber-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs uppercase">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Sistem Database & Persetujuan Perubahan Identitas Profil</span>
                </div>

                <span
                  className={`px-3 py-1 rounded-full font-black text-[10px] uppercase border ${
                    profileApprovalStatus === 'DISETUJUI'
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      : 'bg-amber-200 text-amber-900 border-amber-400'
                  }`}
                >
                  {profileApprovalStatus === 'DISETUJUI' ? '✓ Tersimpan & Disetujui' : '⏳ Menunggu Persetujuan Ketua'}
                </span>
              </div>

              <p className="text-xs text-amber-900 leading-relaxed">
                Profil & Identitas Organisasi Yayasan tersimpan permanen di database. Jika terdapat perubahan nama, alamat, atau legalitas, harap koordinasikan dan ajukan persetujuan Ketua Yayasan agar data resmi tersinkronisasi dengan aman.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleRequestApproval}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Koordinasi Persetujuan</span>
                </button>

                <button
                  type="button"
                  onClick={handleApproveChanges}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Setujui Perubahan Profil (Ketua Yayasan)</span>
                </button>
              </div>

              {/* Approval Log */}
              <div className="bg-white p-3 rounded-xl border border-amber-200 text-[11px] font-mono text-slate-600 space-y-1 max-h-24 overflow-y-auto">
                <p className="font-bold text-slate-800 font-sans">Audit Log Persetujuan Database:</p>
                {approvalLog.map((log, i) => (
                  <p key={i}>• {log}</p>
                ))}
              </div>
            </div>

            {/* Section 1: Profil & Identitas Yayasan */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Profil & Identitas Organisasi Yayasan</h3>
                  <p className="text-[11px] text-slate-500">Nama resmi entitas nonlaba, nomor legalitas, dan kontak</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Resmi Yayasan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                    placeholder="Contoh: Yayasan Pendidikan Daarul Habibah"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Alamat Lengkap Kantor & Sekolah <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    rows={2}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                    placeholder="Jl. Pendidikan No. 45, Kebayoran Baru, Jakarta Selatan 12150"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nomor Telepon / WhatsApp <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3.5 py-2 text-xs font-medium focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                        placeholder="021-7890123 / 0812-3344-5566"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Resmi</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3.5 py-2 text-xs font-medium focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                        placeholder="info@widyanusantara.or.id"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Website Resmi</label>
                    <div className="relative">
                      <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={formData.website}
                        onChange={(e) => handleChange('website', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3.5 py-2 text-xs font-medium focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                        placeholder="www.widyanusantara.or.id"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">No. SK Legalitas Kemenkumham</label>
                    <div className="relative">
                      <FileCheck className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={formData.legalNumber}
                        onChange={(e) => handleChange('legalNumber', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3.5 py-2 text-xs font-mono font-medium focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                        placeholder="AHU-0012894.AH.01.04 TAHUN 2018"
                      />
                    </div>
                  </div>
                </div>

                <MediaUploader
                  label="Upload Logo Resmi Yayasan / Sekolah (Lokal dari Komputer)"
                  value={(formData as any).logoUrl || ''}
                  onChange={(url) => setFormData({ ...formData, logoUrl: url } as any)}
                  mediaType="photo"
                />

                <MediaUploader
                  label="Upload Foto Gedung Utama Kampus / Sekolah"
                  value={formData.buildingPhotoUrl || ''}
                  onChange={(url) => setFormData({ ...formData, buildingPhotoUrl: url })}
                  mediaType="photo"
                />
              </div>
            </div>

            {/* Section 2: Pejabat & Penandatangan Laporan */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Pimpinan, Pengurus Yayasan & Pejabat Penandatangan Laporan</h3>
                  <p className="text-[11px] text-slate-500">
                    Upload foto resmi & sinkronkan nama Pembina, Ketua, Sekretaris, Bendahara, dan Kepala Sekolah
                  </p>
                </div>
              </div>

              {/* 1. Pembina Yayasan */}
              <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-amber-900 uppercase">
                    1. Pembina Yayasan
                  </span>
                  <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md font-bold">
                    Pembina
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Nama Lengkap & Gelar Pembina Yayasan
                    </label>
                    <input
                      type="text"
                      value={formData.pembinaName || ''}
                      onChange={(e) => handleChange('pembinaName', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                      placeholder="Drs. H. M. Syukri, M.M"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">NIPY / NIP</label>
                    <input
                      type="text"
                      value={formData.pembinaNip || ''}
                      onChange={(e) => handleChange('pembinaNip', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-amber-500"
                      placeholder="NIPY. 20100101"
                    />
                  </div>
                </div>

                <MediaUploader
                  label="Upload Foto Profil Pembina Yayasan"
                  value={formData.pembinaPhotoUrl || ''}
                  onChange={(url) => setFormData({ ...formData, pembinaPhotoUrl: url })}
                  mediaType="photo"
                />
              </div>

              {/* 2. Ketua Yayasan */}
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-emerald-900 uppercase">
                    2. Ketua Yayasan
                  </span>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-md font-bold">
                    Pimpinan Pengurus
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Nama Lengkap & Gelar Ketua Yayasan <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.leaderName}
                      onChange={(e) => handleChange('leaderName', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                      placeholder="H. Ahmad Dahlan, M.Ag"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">NIPY / NIP</label>
                    <input
                      type="text"
                      value={formData.leaderNip}
                      onChange={(e) => handleChange('leaderNip', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-emerald-500"
                      placeholder="NIPY. 20120502"
                    />
                  </div>
                </div>

                <MediaUploader
                  label="Upload Foto Profil Ketua Yayasan"
                  value={formData.leaderPhotoUrl || ''}
                  onChange={(url) => setFormData({ ...formData, leaderPhotoUrl: url })}
                  mediaType="photo"
                />

                <div className="pt-2 border-t border-emerald-200/80 space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-800 mb-1">
                      Judul Pidato & Amanat Strategis Pimpinan Yayasan
                    </label>
                    <input
                      type="text"
                      value={formData.leaderSpeechTitle || ''}
                      onChange={(e) => handleChange('leaderSpeechTitle', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                      placeholder="Pidato Amanat Pimpinan: Arah Kebijakan Pendidikan, Transformasi Digital & Pembentukan Karakter Rabbani"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-800 mb-1">
                      Teks Naskah Pidato Amanat Strategis (Halaman Tentang Kami)
                    </label>
                    <textarea
                      rows={6}
                      value={formData.leaderSpeechContent || ''}
                      onChange={(e) => handleChange('leaderSpeechContent', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs leading-relaxed text-slate-800 focus:outline-none focus:border-emerald-500"
                      placeholder="Bismillahirahmanirrahim. Assalamu'alaikum Warahmatullahi Wabarakatuh..."
                    />
                  </div>
                </div>
              </div>

              {/* 3. Sekretaris Yayasan */}
              <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-blue-900 uppercase">
                    3. Sekretaris Yayasan
                  </span>
                  <span className="text-[10px] bg-blue-200 text-blue-900 px-2 py-0.5 rounded-md font-bold">
                    Administrasi
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Nama Lengkap & Gelar Sekretaris Yayasan
                    </label>
                    <input
                      type="text"
                      value={formData.secretaryName || ''}
                      onChange={(e) => handleChange('secretaryName', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                      placeholder="H. Ahmad Subagja, S.H"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">NIPY / NIP</label>
                    <input
                      type="text"
                      value={formData.secretaryNip || ''}
                      onChange={(e) => handleChange('secretaryNip', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-blue-500"
                      placeholder="NIPY. 20150303"
                    />
                  </div>
                </div>

                <MediaUploader
                  label="Upload Foto Profil Sekretaris Yayasan"
                  value={formData.secretaryPhotoUrl || ''}
                  onChange={(url) => setFormData({ ...formData, secretaryPhotoUrl: url })}
                  mediaType="photo"
                />

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Pesan / Sambutan Ringkas Sekretaris</label>
                  <textarea
                    rows={2}
                    value={formData.secretarySpeech || ''}
                    onChange={(e) => setFormData({ ...formData, secretarySpeech: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                    placeholder="Menjamin ketertiban administrasi, legalitas Kemenkumham, serta pelayanan publik dan orang tua murid yang responsif."
                  />
                </div>
              </div>

              {/* 4. Bendahara Yayasan */}
              <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-emerald-900 uppercase">
                    4. Bendahara Yayasan (Pembuat Laporan & Kuitansi)
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold">
                    Keuangan
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Nama Lengkap & Gelar Bendahara <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.treasurerName}
                      onChange={(e) => handleChange('treasurerName', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                      placeholder="Hj. Nurul Aini, S.E., M.Ak"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">NIPY / NIP</label>
                    <input
                      type="text"
                      value={formData.treasurerNip}
                      onChange={(e) => handleChange('treasurerNip', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-emerald-500"
                      placeholder="NIPY. 20180209"
                    />
                  </div>
                </div>

                <MediaUploader
                  label="Upload Foto Profil Bendahara Yayasan"
                  value={formData.treasurerPhotoUrl || ''}
                  onChange={(url) => setFormData({ ...formData, treasurerPhotoUrl: url })}
                  mediaType="photo"
                />

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Pesan / Sambutan Ringkas Bendahara</label>
                  <textarea
                    rows={2}
                    value={formData.treasurerSpeech || ''}
                    onChange={(e) => setFormData({ ...formData, treasurerSpeech: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                    placeholder="Mengelola akuntabilitas keuangan berbasis ISAK 35, sistem kuitansi digital SPP, dan audit anggaran dana BOS."
                  />
                </div>
              </div>

              {/* 5. Kepala Sekolah */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <span className="text-xs font-extrabold text-slate-900 uppercase">
                  5. Kepala Sekolah / Unit Pendidikan
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Nama Lengkap & Gelar Kepala Sekolah
                    </label>
                    <input
                      type="text"
                      value={formData.headmasterName}
                      onChange={(e) => handleChange('headmasterName', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                      placeholder="Dr. H. Bambang Widjaja, M.Pd"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">NIP / NIPY</label>
                    <input
                      type="text"
                      value={formData.headmasterNip}
                      onChange={(e) => handleChange('headmasterNip', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-emerald-500"
                      placeholder="NIPY. 1985031201"
                    />
                  </div>
                </div>

                <MediaUploader
                  label="Upload Foto Profil Kepala Sekolah"
                  value={formData.headmasterPhotoUrl || ''}
                  onChange={(url) => setFormData({ ...formData, headmasterPhotoUrl: url })}
                  mediaType="photo"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Pengaturan Yayasan</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right 1 Column: Live Preview Kop & Signatures */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 sticky top-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Printer className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                    Preview Kop Surat & Lembar Cetak
                  </h3>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                  Live
                </span>
              </div>

              {/* Simulated Kop Header Box */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-center text-xs">
                <div className="pb-2 border-b-2 border-slate-900">
                  <h4 className="font-black text-slate-900 uppercase text-sm tracking-tight">
                    {formData.name || 'NAMA YAYASAN'}
                  </h4>
                  <p className="text-[10px] text-slate-600 font-medium">
                    {formData.address || 'Alamat Lengkap Yayasan'}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Telp: {formData.phone || '-'} | Email: {formData.email || '-'}
                  </p>
                  {formData.legalNumber && (
                    <p className="text-[9px] text-slate-400 font-mono">
                      SK Kemenkumham: {formData.legalNumber}
                    </p>
                  )}
                </div>

                <div className="py-2">
                  <p className="font-black text-slate-900 text-xs">LAPORAN KEUANGAN YAYASAN (ISAK 35)</p>
                  <p className="text-[10px] text-slate-500">PERIODE TAHUN 2026</p>
                </div>

                {/* Sample Content Table Lines */}
                <div className="space-y-1 text-left text-[10px] text-slate-400 py-1 border-t border-b border-slate-200 font-mono">
                  <div className="flex justify-between">
                    <span>Aset Lancar (Kas & Bank)</span>
                    <span>Rp 288.000.000</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-700">
                    <span>TOTAL ASET YAYASAN</span>
                    <span>Rp 3.103.000.000</span>
                  </div>
                </div>

                {/* Simulated Signatures */}
                <div className="pt-4 grid grid-cols-2 text-center text-[10px] text-slate-700 gap-2">
                  <div>
                    <p className="mb-8 text-[9px]">Disiapkan Oleh,<br /><strong>{formData.treasurerTitle || 'Bendahara'}</strong></p>
                    <p className="font-bold underline text-[10px] text-slate-900 truncate">
                      {formData.treasurerName || '(Nama Bendahara)'}
                    </p>
                    <p className="text-[8px] text-slate-500 font-mono">{formData.treasurerNip}</p>
                  </div>

                  <div>
                    <p className="mb-8 text-[9px]">Menyetujui,<br /><strong>{formData.leaderTitle || 'Ketua Yayasan'}</strong></p>
                    <p className="font-bold underline text-[10px] text-slate-900 truncate">
                      {formData.leaderName || '(Nama Ketua)'}
                    </p>
                    <p className="text-[8px] text-slate-500 font-mono">{formData.leaderNip}</p>
                  </div>
                </div>
              </div>

              {/* Info Card */}
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-[11px] text-emerald-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Otomatis Tersinkronisasi</span>
                </div>
                <p className="text-emerald-800 text-[10px] leading-relaxed">
                  Setiap kali Anda mengubah nama Bendahara atau pengurus di sini, nama tersebut akan secara otomatis ter-update di Master Data Yayasan, Laporan Keuangan ISAK 35, CALK, dan Kuitansi SPP/BOS.
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
