import React, { useState } from 'react';
import { SchoolUniformItem, UniformScheduleDay, FoundationProfile } from '../../types';
import {
  Shirt,
  Calendar,
  Clock,
  CheckCircle2,
  Phone,
  MessageSquare,
  ShoppingBag,
  Eye,
  X,
  Info,
  ShieldCheck,
  Send,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Award,
  BookOpen,
} from 'lucide-react';

interface UniformSectionViewProps {
  foundationProfile: FoundationProfile;
  uniforms: SchoolUniformItem[];
  schedules: UniformScheduleDay[];
  onOpenPPDB?: () => void;
}

export const UniformSectionView: React.FC<UniformSectionViewProps> = ({
  foundationProfile,
  uniforms,
  schedules,
  onOpenPPDB,
}) => {
  const [activeTab, setActiveTab] = useState<'katalog' | 'jadwal' | 'sizechart' | 'orderform'>('katalog');
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('SEMUA');
  const [selectedUniformDetail, setSelectedUniformDetail] = useState<SchoolUniformItem | null>(null);

  // Quick Order Form State
  const [orderForm, setOrderForm] = useState({
    uniformName: uniforms[0]?.name || 'Seragam Merah Putih dan Rompi',
    studentName: '',
    studentClass: 'Kelas 1 A',
    parentName: '',
    parentPhone: '',
    size: 'M',
    gender: 'Putra',
    quantity: 1,
    hijabOption: 'Lengkap dengan Jilbab',
    notes: '',
  });

  // Calculate clean WhatsApp phone number
  const cleanPhone = foundationProfile.phone.replace(/[^0-9]/g, '') || '6281233445566';
  const whatsappNumber = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;

  // Generator for custom WhatsApp order links
  const createWhatsAppOrderUrl = (uniformName: string, customSize?: string) => {
    const text = `Halo Admin Koperasi/Seragam ${foundationProfile.name},\n` +
      `Saya orang tua/wali murid ingin menanyakan dan memesan:\n\n` +
      `• *Jenis Seragam*: ${uniformName}\n` +
      `${customSize ? `• *Ukuran*: ${customSize}\n` : ''}` +
      `Mohon informasi ketersediaan stok, harga paket, dan cara pengambilannya. Terima kasih.`;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isPutri = orderForm.gender === 'Putri';
    const hijabLine = isPutri ? `🧕 *Kelengkapan Jilbab*: ${orderForm.hijabOption}\n` : '';

    const text = `*FORMULIR PEMESANAN SERAGAM SEKOLAH*\n` +
      `*${foundationProfile.name}*\n` +
      `====================================\n` +
      `👤 *Nama Calon/Siswa*: ${orderForm.studentName || '-'}\n` +
      `🏫 *Rombel / Kelas*: ${orderForm.studentClass}\n` +
      `👔 *Pilihan Seragam*: ${orderForm.uniformName}\n` +
      `📏 *Ukuran (Size)*: ${orderForm.size} (${orderForm.gender === 'Putra' ? 'Kategori Putra / Celana' : 'Kategori Putri / Rok'})\n` +
      `📦 *Jumlah Set*: ${orderForm.quantity} Setel\n` +
      hijabLine +
      `------------------------------------\n` +
      `👨‍👩‍👧 *Nama Orang Tua/Wali*: ${orderForm.parentName || '-'}\n` +
      `📱 *No. WhatsApp Ortu*: ${orderForm.parentPhone || '-'}\n` +
      `📝 *Catatan Khusus*: ${orderForm.notes || '-'}\n` +
      `====================================\n` +
      `Mohon konfirmasi ketersediaan nomor pesanan dan total tagihannya. Terima kasih!`;

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const filteredUniforms = uniforms.filter((u) => {
    if (selectedDayFilter === 'SEMUA') return true;
    return u.scheduleDay.toLowerCase().includes(selectedDayFilter.toLowerCase());
  });

  return (
    <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* 1. HERO BANNER & HEADER */}
      <div className="relative bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-emerald-500/30 overflow-hidden">
        {/* Background Subtle Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-slate-950 text-xs font-black rounded-full shadow-md uppercase tracking-wider">
              <Shirt className="w-4 h-4 text-slate-950" /> ATRIBUT & SERAGAM RESMI SEKOLAH
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Katalog & Jadwal Penggunaan Seragam Sekolah
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-2xl">
              Panduan resmi 5 model seragam siswa {foundationProfile.name} beserta jadwal pemakaian harian (Senin s.d. Sabtu), standar kerapian atribut, dan tautan pemesanan langsung melalui WhatsApp Koperasi Sekolah.
            </p>

            {/* Quick Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="px-3 py-1 bg-white/10 text-emerald-200 rounded-xl text-xs font-semibold backdrop-blur-xs border border-white/10 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 5 Jenis Seragam Resmi
              </span>
              <span className="px-3 py-1 bg-white/10 text-emerald-200 rounded-xl text-xs font-semibold backdrop-blur-xs border border-white/10 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-300" /> Jadwal Pemakaian Senin - Sabtu
              </span>
              <span className="px-3 py-1 bg-white/10 text-emerald-200 rounded-xl text-xs font-semibold backdrop-blur-xs border border-white/10 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" /> Order Cepat via WhatsApp Koperasi
              </span>
            </div>
          </div>

          {/* Direct WhatsApp Callout Card */}
          <div className="lg:col-span-4 bg-emerald-950/80 p-5 sm:p-6 rounded-2xl border border-emerald-400/30 backdrop-blur-md shadow-lg space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
                <MessageSquare className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-emerald-300 block">Layanan WhatsApp Koperasi</span>
                <p className="font-extrabold text-white text-sm">Konsultasi & Pesan Seragam</p>
              </div>
            </div>
            
            <p className="text-xs text-emerald-200/90 leading-relaxed">
              Butuh bantuan ukuran, pembelian seragam tambahan, rompi cadangan, atau atribut topi/dasi?
            </p>

            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Halo Admin Koperasi Sekolah ${foundationProfile.name}, saya ingin konsultasi pemesanan seragam siswa.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Phone className="w-4 h-4 text-slate-950" />
              <span>Chat WhatsApp Koperasi Sekarang</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. SUB-NAVIGATION TABS */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('katalog')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'katalog'
                ? 'bg-emerald-700 text-white shadow-md font-black'
                : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
            }`}
          >
            <Shirt className="w-4 h-4" />
            <span>1. Foto & Rincian 5 Seragam</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('jadwal')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'jadwal'
                ? 'bg-emerald-700 text-white shadow-md font-black'
                : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>2. Tabel Jadwal Pemakaian (Senin-Sabtu)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sizechart')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'sizechart'
                ? 'bg-emerald-700 text-white shadow-md font-black'
                : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>3. Panduan Ukuran & Tata Tertib</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orderform')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'orderform'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 shadow-md font-black'
                : 'bg-white text-slate-700 hover:bg-amber-50 border border-amber-300'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-slate-950" />
            <span>4. Formulir Order Cepat via WA</span>
          </button>
        </div>

        {/* Quick Hotline Indicator */}
        <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-100 px-3.5 py-1.5 rounded-xl">
          <Phone className="w-3.5 h-3.5 text-emerald-600" />
          <span>Hotline Order: <strong className="text-slate-900 font-mono">{foundationProfile.phone}</strong></span>
        </div>
      </div>

      {/* 3. TAB CONTENT 1: KATALOG 5 SERAGAM RESMI */}
      {activeTab === 'katalog' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Day Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Filter Berdasarkan Hari:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['SEMUA', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'].map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDayFilter(day)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedDayFilter === day
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
                  }`}
                >
                  {day === 'SEMUA' ? 'Semua Seragam (5)' : `Hari ${day}`}
                </button>
              ))}
            </div>
          </div>

          {/* 5 Uniforms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredUniforms.map((uniform, idx) => {
              const waUrl = createWhatsAppOrderUrl(uniform.name);

              return (
                <div
                  key={uniform.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1"
                >
                  <div>
                    {/* Uniform Photo Container with Interactive Zoom */}
                    <div
                      className="w-full h-64 sm:h-72 overflow-hidden relative cursor-pointer group/img bg-slate-950"
                      onClick={() => setSelectedUniformDetail(uniform)}
                    >
                      <img
                        src={uniform.imageUrl}
                        alt={uniform.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105"
                      />
                      
                      {/* Gradient Bottom Shadow */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />

                      {/* Top Badge: Schedule Day */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-slate-950 rounded-xl text-xs font-black shadow-md border border-amber-300">
                        <Calendar className="w-3.5 h-3.5 text-slate-950" />
                        <span>{uniform.badge || uniform.scheduleDay}</span>
                      </div>

                      {/* Number Tag */}
                      <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/70 text-white border border-white/20 font-mono font-black text-xs flex items-center justify-center shadow-md">
                        {idx + 1}
                      </div>

                      {/* Zoom Overlay Hover */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition bg-slate-950/40 backdrop-blur-2xs">
                        <span className="px-3.5 py-2 bg-white text-slate-950 rounded-xl text-xs font-black shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover/img:translate-y-0 transition">
                          <Eye className="w-4 h-4 text-emerald-600" /> Lihat Detail & Foto Full
                        </span>
                      </div>

                      {/* Category Label at bottom of image */}
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-emerald-700 text-white rounded-md">
                          {uniform.category}
                        </span>
                      </div>
                    </div>

                    {/* Card Content Body */}
                    <div className="p-5 space-y-4">
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-lg leading-snug group-hover:text-emerald-800 transition">
                          {uniform.name}
                        </h3>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-3">
                          {uniform.description}
                        </p>
                      </div>

                      {/* Component list preview */}
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                        <span className="text-[11px] font-extrabold text-slate-800 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Komponen & Atribut:
                        </span>
                        <ul className="text-[11px] text-slate-600 space-y-1">
                          {uniform.components.slice(0, 3).map((comp, cIdx) => (
                            <li key={cIdx} className="flex items-start gap-1.5">
                              <span className="text-emerald-600 font-bold">•</span>
                              <span className="line-clamp-1">{comp}</span>
                            </li>
                          ))}
                          {uniform.components.length > 3 && (
                            <li className="text-[10px] text-emerald-700 font-bold pt-0.5">
                              + {uniform.components.length - 3} atribut lainnya...
                            </li>
                          )}
                        </ul>
                      </div>

                      {/* Available Sizes Badge */}
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                        <span className="text-slate-500 font-semibold">Ukuran Tersedia:</span>
                        <div className="flex gap-1">
                          {uniform.availableSizes.map((sz) => (
                            <span key={sz} className="px-1.5 py-0.5 bg-slate-100 text-slate-700 font-bold rounded text-[10px]">
                              {sz}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: WhatsApp Order Buttons */}
                  <div className="p-5 pt-0 space-y-2">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Phone className="w-4 h-4 text-emerald-200" />
                      <span>Order via WhatsApp</span>
                    </a>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedUniformDetail(uniform)}
                        className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Rincian</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setOrderForm((prev) => ({ ...prev, uniformName: uniform.name }));
                          setActiveTab('orderform');
                        }}
                        className="w-full py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-amber-800" />
                        <span>Form Pesan</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. TAB CONTENT 2: TABEL JADWAL PEMAKAIAN HARIAN */}
      {activeTab === 'jadwal' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full uppercase">
                  Ketentuan Resmi Kalender Akademik
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">
                  Jadwal Pemakaian Seragam Harian (Senin - Sabtu)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Seluruh siswa/siswi diwajibkan mengenakan seragam sesuai jadwal dan tata tertib yang telah ditetapkan.
                </p>
              </div>

              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Halo Koperasi ${foundationProfile.name}, saya ingin menanyakan jadwal seragam dan perlengkapan siswa.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Konsultasi Seragam</span>
              </a>
            </div>

            {/* Schedule Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schedules.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border ${item.colorTheme} shadow-2xs flex flex-col justify-between space-y-4`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider ${item.badgeClass}`}>
                        HARI {item.day.toUpperCase()}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500">
                        {idx === 0 ? '06.45 WIB' : '07.00 WIB'}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-black text-base leading-tight">{item.uniformName}</h4>
                      <p className="text-xs opacity-85 mt-1 font-medium">{item.uniformType}</p>
                    </div>

                    {/* Accessories */}
                    <div className="pt-2 border-t border-black/10 space-y-1.5">
                      <span className="text-[11px] font-black uppercase tracking-wider block opacity-75">
                        Kelengkapan & Atribut:
                      </span>
                      <ul className="text-xs space-y-1">
                        {item.accessories.map((acc, aIdx) => (
                          <li key={aIdx} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{acc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Note */}
                  <div className="pt-3 border-t border-black/10 text-[11px] font-semibold italic opacity-90 flex items-start gap-1.5">
                    <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{item.note}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Table View for Easy Printing & Reading */}
            <div className="mt-8 border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
              <div className="bg-slate-900 text-white p-4 font-black text-sm flex items-center justify-between">
                <span>Ringkasan Tabel Penggunaan Seragam</span>
                <span className="text-xs text-amber-300 font-semibold">T.A 2026/2027</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-black border-b border-slate-200">
                      <th className="p-3">Hari</th>
                      <th className="p-3">Jenis Seragam</th>
                      <th className="p-3">Bawahan / Jilbab</th>
                      <th className="p-3">Kaos Kaki & Sepatu</th>
                      <th className="p-3">Kegiatan Khusus</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-rose-700">Senin</td>
                      <td className="p-3 font-semibold">Seragam Merah Putih + Rompi Merah</td>
                      <td className="p-3">Celana/Rok Merah Marun & Jilbab Putih</td>
                      <td className="p-3">Kaos kaki putih & Sepatu hitam</td>
                      <td className="p-3 font-semibold text-slate-800">Upacara Bendera</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-purple-700">Selasa</td>
                      <td className="p-3 font-semibold">Seragam Kotak Ungu + Rompi Violet</td>
                      <td className="p-3">Celana/Rok Ungu/Navy & Jilbab Ungu</td>
                      <td className="p-3">Kaos kaki putih & Sepatu hitam</td>
                      <td className="p-3 text-slate-800">Belajar Reguler</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-emerald-700">Rabu</td>
                      <td className="p-3 font-semibold">Seragam Batik Hijau Yayasan</td>
                      <td className="p-3">Bawahan Putih/Hijau & Jilbab Hijau</td>
                      <td className="p-3">Kaos kaki putih & Sepatu hitam</td>
                      <td className="p-3 text-slate-800">Budaya & Adab Islami</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-sky-700">Kamis</td>
                      <td className="p-3 font-semibold">Seragam Kaos Olahraga Dry-Fit</td>
                      <td className="p-3">Celana Training Panjang & Jilbab Olahraga</td>
                      <td className="p-3">Kaos kaki putih & Sepatu kets/sneakers</td>
                      <td className="p-3 font-semibold text-slate-800">PJOK & Senam Jasmani</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-amber-800">Jumat</td>
                      <td className="p-3 font-semibold">Seragam Pramuka Lengkap (Hasduk/Kacu)</td>
                      <td className="p-3">Celana/Rok Cokelat Tua & Jilbab Cokelat</td>
                      <td className="p-3">Kaos kaki hitam bertuliskan pramuka</td>
                      <td className="p-3 text-slate-800">Shalat Dhuha & Kepanduan</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-amber-700">Sabtu</td>
                      <td className="p-3 font-semibold">Seragam Pramuka / Kaos Ekskul</td>
                      <td className="p-3">Bawahan Cokelat / Training Ekskul</td>
                      <td className="p-3">Kaos kaki hitam / Sepatu olahraga</td>
                      <td className="p-3 font-semibold text-slate-800">Ekstrakurikuler Minat Bakat</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB CONTENT 3: PANDUAN UKURAN (SIZE CHART) & TATA TERTIB */}
      {activeTab === 'sizechart' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Size Chart Table */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-black rounded-full uppercase">
                  Panduan Ukuran (Size Chart)
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">
                  Tabel Standar Ukuran Baju & Celana/Rok
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Gunakan meteran kain untuk mengukur lebar dada dan panjang badan calon siswa agar seragam pas dan nyaman.
                </p>
              </div>

              {/* Table Atasan */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="bg-emerald-800 text-white p-3 font-bold text-xs flex justify-between">
                  <span>Tabel Ukuran Atasan (Kemeja, Rompi, Batik, Kaos Olahraga)</span>
                  <span className="text-emerald-200">Satuan: Centimeter (cm)</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 font-bold border-b border-slate-200 text-slate-700">
                        <th className="p-2.5">Ukuran</th>
                        <th className="p-2.5">Estimasi Kelas</th>
                        <th className="p-2.5">Lebar Dada (LD)</th>
                        <th className="p-2.5">Panjang Baju (PB)</th>
                        <th className="p-2.5">Panjang Lengan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700">
                      <tr>
                        <td className="p-2.5 font-black text-emerald-800">S (Kecil)</td>
                        <td className="p-2.5">Kelas 1 (Postur Mungil)</td>
                        <td className="p-2.5 font-mono">38 cm</td>
                        <td className="p-2.5 font-mono">52 cm</td>
                        <td className="p-2.5 font-mono">40 cm</td>
                      </tr>
                      <tr className="bg-emerald-50/50">
                        <td className="p-2.5 font-black text-emerald-800">M (Standar)</td>
                        <td className="p-2.5">Kelas 1 - 2</td>
                        <td className="p-2.5 font-mono font-bold">40 cm</td>
                        <td className="p-2.5 font-mono font-bold">55 cm</td>
                        <td className="p-2.5 font-mono font-bold">42 cm</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-black text-emerald-800">L (Besar)</td>
                        <td className="p-2.5">Kelas 3 - 4</td>
                        <td className="p-2.5 font-mono">43 cm</td>
                        <td className="p-2.5 font-mono">58 cm</td>
                        <td className="p-2.5 font-mono">45 cm</td>
                      </tr>
                      <tr className="bg-emerald-50/50">
                        <td className="p-2.5 font-black text-emerald-800">XL (Ekstra)</td>
                        <td className="p-2.5">Kelas 5 - 6</td>
                        <td className="p-2.5 font-mono">46 cm</td>
                        <td className="p-2.5 font-mono">62 cm</td>
                        <td className="p-2.5 font-mono">48 cm</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-black text-emerald-800">XXL (Jumbo)</td>
                        <td className="p-2.5">Kelas 6+ / Postur Tinggi</td>
                        <td className="p-2.5 font-mono">50 cm</td>
                        <td className="p-2.5 font-mono">66 cm</td>
                        <td className="p-2.5 font-mono">51 cm</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Table Bawahan */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="bg-indigo-900 text-white p-3 font-bold text-xs flex justify-between">
                  <span>Tabel Ukuran Bawahan (Celana Panjang / Rok Rempel Panjang)</span>
                  <span className="text-indigo-200">Satuan: Centimeter (cm)</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 font-bold border-b border-slate-200 text-slate-700">
                        <th className="p-2.5">Ukuran</th>
                        <th className="p-2.5">Lingkar Pinggang (Karet)</th>
                        <th className="p-2.5">Panjang Celana</th>
                        <th className="p-2.5">Panjang Rok Putri</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700">
                      <tr>
                        <td className="p-2.5 font-black text-indigo-900">S</td>
                        <td className="p-2.5 font-mono">50 - 64 cm</td>
                        <td className="p-2.5 font-mono">68 cm</td>
                        <td className="p-2.5 font-mono">65 cm</td>
                      </tr>
                      <tr className="bg-indigo-50/50">
                        <td className="p-2.5 font-black text-indigo-900">M</td>
                        <td className="p-2.5 font-mono font-bold">54 - 70 cm</td>
                        <td className="p-2.5 font-mono font-bold">72 cm</td>
                        <td className="p-2.5 font-mono font-bold">70 cm</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-black text-indigo-900">L</td>
                        <td className="p-2.5 font-mono">58 - 76 cm</td>
                        <td className="p-2.5 font-mono">78 cm</td>
                        <td className="p-2.5 font-mono">75 cm</td>
                      </tr>
                      <tr className="bg-indigo-50/50">
                        <td className="p-2.5 font-black text-indigo-900">XL</td>
                        <td className="p-2.5 font-mono">62 - 82 cm</td>
                        <td className="p-2.5 font-mono">84 cm</td>
                        <td className="p-2.5 font-mono">80 cm</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-black text-indigo-900">XXL</td>
                        <td className="p-2.5 font-mono">66 - 90 cm</td>
                        <td className="p-2.5 font-mono">90 cm</td>
                        <td className="p-2.5 font-mono">86 cm</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Rules & Requirements Sidebar */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm border-b border-slate-100 pb-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>Tata Tertib & Kerapian Berbusana</span>
                </div>

                <ul className="space-y-3 text-xs text-slate-700">
                  <li className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <div>
                      <strong className="text-slate-900 block">Kerapian Kemeja & Rompi</strong>
                      <span className="text-slate-600">Kemeja wajib dimasukkan rapi. Rompi dikancingkan dengan atribut nama terpasang di dada sebelah kanan.</span>
                    </div>
                  </li>

                  <li className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <div>
                      <strong className="text-slate-900 block">Standar Kaos Kaki & Sepatu</strong>
                      <span className="text-slate-600">Senin - Kamis: Kaos kaki putih polos minimal 10 cm di atas mata kaki. Jumat: Kaos kaki hitam pramuka. Sepatu wajib dominan hitam.</span>
                    </div>
                  </li>

                  <li className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <div>
                      <strong className="text-slate-900 block">Ketentuan Jilbab Siswi Muslimah</strong>
                      <span className="text-slate-600">Jilbab menutup dada dengan warna serasi sesuai jadwal hari (Putih, Ungu, Hijau Zamrud, Cokelat Pramuka).</span>
                    </div>
                  </li>

                  <li className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">4</span>
                    <div>
                      <strong className="text-slate-900 block">Ikat Pinggang Berlogo Sekolah</strong>
                      <span className="text-slate-600">Seluruh siswa putra/putri wajib mengenakan ikat pinggang resmi berlogo sekolah.</span>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Consultation Hotline */}
              <div className="bg-gradient-to-br from-emerald-800 to-teal-900 text-white p-6 rounded-3xl border border-emerald-600 shadow-md space-y-3">
                <h4 className="font-extrabold text-sm flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-300" />
                  <span>Butuh Panduan Pengukuran Langsung?</span>
                </h4>
                <p className="text-xs text-emerald-100 leading-relaxed">
                  Orang tua dapat membawa putra-putri ke Kantor Koperasi Sekolah pada hari kerja (Senin - Jumat pukul 08.00 - 15.00 WIB) untuk pengukuran sampel seragam secara langsung.
                </p>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Halo Koperasi ${foundationProfile.name}, saya ingin membuat janji temu untuk pengukuran sampel seragam anak.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow transition cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Buat Janji Pengukuran via WA</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB CONTENT 4: FORMULIR ORDER CEPAT VIA WHATSAPP */}
      {activeTab === 'orderform' && (
        <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-lg space-y-6">
            <div className="border-b border-slate-100 pb-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-full mb-2">
                <ShoppingBag className="w-3.5 h-3.5 text-amber-800" /> FORMULIR PEMESANAN PRAKTIS
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                Pesan Seragam Sekolah Melalui WhatsApp
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Lengkapi rincian pemesanan di bawah ini. Ketika tombol ditekan, pesan WhatsApp akan otomatis terisi rapi untuk dikirimkan ke Admin Koperasi Sekolah.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Pilihan Jenis Seragam */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Pilih Jenis Seragam *
                  </label>
                  <select
                    value={orderForm.uniformName}
                    onChange={(e) => setOrderForm({ ...orderForm, uniformName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600"
                    required
                  >
                    {uniforms.map((u) => (
                      <option key={u.id} value={u.name}>
                        {u.name} ({u.scheduleDay})
                      </option>
                    ))}
                    <option value="Paket Lengkap 5 Jenis Seragam (Semua)">
                      ⭐ Paket Lengkap 5 Jenis Seragam (Semua Senin - Sabtu)
                    </option>
                    <option value="Atribut Tambahan (Topi, Dasi, Rompi, Kacu, Ikat Pinggang)">
                      Atribut Tambahan (Topi, Dasi, Rompi, Kacu, Ikat Pinggang)
                    </option>
                  </select>
                </div>

                {/* Ukuran (Size) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Pilihan Ukuran (Size) *
                  </label>
                  <select
                    value={orderForm.size}
                    onChange={(e) => setOrderForm({ ...orderForm, size: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600"
                    required
                  >
                    <option value="S">Ukuran S (Kecil - Rekomendasi Kelas 1 Postur Mungil)</option>
                    <option value="M">Ukuran M (Standar - Rekomendasi Kelas 1-2)</option>
                    <option value="L">Ukuran L (Besar - Rekomendasi Kelas 3-4)</option>
                    <option value="XL">Ukuran XL (Ekstra - Rekomendasi Kelas 5-6)</option>
                    <option value="XXL">Ukuran XXL (Jumbo)</option>
                    <option value="Custom / Pengukuran Khusus">Ukuran Khusus (Custom di Koperasi)</option>
                  </select>
                </div>

                {/* Jenis Kelamin Siswa */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Kategori Putra / Putri *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition ${
                      orderForm.gender === 'Putra' ? 'bg-emerald-50 border-emerald-600 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}>
                      <input
                        type="radio"
                        name="gender"
                        value="Putra"
                        checked={orderForm.gender === 'Putra'}
                        onChange={(e) => setOrderForm({ ...orderForm, gender: e.target.value })}
                        className="accent-emerald-600"
                      />
                      <span>Putra (Celana)</span>
                    </label>

                    <label className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition ${
                      orderForm.gender === 'Putri' ? 'bg-emerald-50 border-emerald-600 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}>
                      <input
                        type="radio"
                        name="gender"
                        value="Putri"
                        checked={orderForm.gender === 'Putri'}
                        onChange={(e) => setOrderForm({ ...orderForm, gender: e.target.value })}
                        className="accent-emerald-600"
                      />
                      <span>Putri (Rok Rempel)</span>
                    </label>
                  </div>
                </div>

                {/* Pilihan Jilbab (Hanya Muncul Jika Kategori Putri) */}
                {orderForm.gender === 'Putri' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                      <span>Kelengkapan Jilbab Siswi *</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Khusus Putri</span>
                    </label>
                    <select
                      value={orderForm.hijabOption}
                      onChange={(e) => setOrderForm({ ...orderForm, hijabOption: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600"
                    >
                      <option value="Lengkap dengan Jilbab Resmi Sekolah">Lengkap dengan Jilbab Resmi Sekolah</option>
                      <option value="Tanpa Jilbab (Sudah Memiliki Sendiri)">Tanpa Jilbab (Hanya Atasan & Rok)</option>
                      <option value="Tambah Jilbab Cadangan (+1 Pcs)">Tambah Jilbab Cadangan (+1 Pcs)</option>
                    </select>
                  </div>
                )}

                {/* Jumlah Setel */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Jumlah Pemesanan *
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setOrderForm((prev) => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}
                      className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 font-black text-slate-800 text-sm flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-mono font-black text-sm text-slate-900 w-12 text-center">
                      {orderForm.quantity} Set
                    </span>
                    <button
                      type="button"
                      onClick={() => setOrderForm((prev) => ({ ...prev, quantity: prev.quantity + 1 }))}
                      className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 font-black text-slate-800 text-sm flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                    <span className="text-[11px] text-slate-500">Setel Lengkap</span>
                  </div>
                </div>

                {/* Nama Calon / Siswa */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nama Calon Siswa / Siswa *
                  </label>
                  <input
                    type="text"
                    required
                    value={orderForm.studentName}
                    onChange={(e) => setOrderForm({ ...orderForm, studentName: e.target.value })}
                    placeholder="Contoh: Muhammad Rayhan"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                {/* Kelas / Rombel */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Rombel / Kelas Target *
                  </label>
                  <select
                    value={orderForm.studentClass}
                    onChange={(e) => setOrderForm({ ...orderForm, studentClass: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600"
                  >
                    <option value="Calon Siswa Baru Kelas 1 (PPDB 2026/2027)">Calon Siswa Baru Kelas 1 (PPDB 2026/2027)</option>
                    <option value="Kelas 1 A">Kelas 1 A</option>
                    <option value="Kelas 1 B">Kelas 1 B</option>
                    <option value="Kelas 2">Kelas 2</option>
                    <option value="Kelas 3">Kelas 3</option>
                    <option value="Kelas 4">Kelas 4</option>
                    <option value="Kelas 5">Kelas 5</option>
                    <option value="Kelas 6">Kelas 6</option>
                    <option value="Siswa Pindahan Rombel">Siswa Pindahan Rombel</option>
                  </select>
                </div>

                {/* Nama Orang Tua */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nama Orang Tua / Wali Murid *
                  </label>
                  <input
                    type="text"
                    required
                    value={orderForm.parentName}
                    onChange={(e) => setOrderForm({ ...orderForm, parentName: e.target.value })}
                    placeholder="Nama Ayah / Ibu"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                {/* Nomor HP / WhatsApp */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nomor WhatsApp Orang Tua *
                  </label>
                  <input
                    type="text"
                    required
                    value={orderForm.parentPhone}
                    onChange={(e) => setOrderForm({ ...orderForm, parentPhone: e.target.value })}
                    placeholder="Contoh: 081234567890"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Catatan Khusus */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Catatan Tambahan / Alamat Pengiriman (Opsional)
                </label>
                <textarea
                  rows={3}
                  value={orderForm.notes}
                  onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                  placeholder="Contoh: Tambah 1 rompi cadangan, diambil hari Kamis di koperasi sekolah..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 hover:from-emerald-500 hover:to-green-500 text-white font-black text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition cursor-pointer hover:scale-[1.01]"
                >
                  <Send className="w-4 h-4 text-emerald-200" />
                  <span>Kirim Format Order ke WhatsApp Koperasi Sekolah</span>
                </button>
                <p className="text-[11px] text-center text-slate-500 mt-2">
                  *Tautan akan langsung membuka aplikasi WhatsApp dan terhubung dengan staf admin Koperasi {foundationProfile.name}.
                </p>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. MODAL DETAIL & ZOOM FOTO SERAGAM */}
      {selectedUniformDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 relative my-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedUniformDetail(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-900/80 text-white hover:bg-slate-950 flex items-center justify-center shadow-md transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Photo Box */}
              <div className="h-72 sm:h-96 md:h-full relative bg-slate-950">
                <img
                  src={selectedUniformDetail.imageUrl}
                  alt={selectedUniformDetail.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                  <span className="px-3 py-1 bg-amber-400 text-slate-950 rounded-xl text-xs font-black shadow">
                    {selectedUniformDetail.badge || selectedUniformDetail.scheduleDay}
                  </span>
                  <p className="text-xs text-slate-200 font-mono mt-1">{selectedUniformDetail.scheduleTimeNote}</p>
                </div>
              </div>

              {/* Info Box */}
              <div className="p-6 sm:p-7 space-y-4 flex flex-col justify-between max-h-[80vh] overflow-y-auto">
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
                      {selectedUniformDetail.category}
                    </span>
                    <h3 className="text-xl font-black text-slate-900 mt-1">
                      {selectedUniformDetail.name}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {selectedUniformDetail.description}
                  </p>

                  {/* Components */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Rincian Komponen & Atribut:</span>
                    </h4>
                    <ul className="text-xs text-slate-600 space-y-1">
                      {selectedUniformDetail.components.map((c, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Rules */}
                  {selectedUniformDetail.rules && selectedUniformDetail.rules.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                        <Info className="w-4 h-4 text-amber-600" />
                        <span>Ketentuan Pemakaian:</span>
                      </h4>
                      <ul className="text-xs text-slate-600 space-y-1">
                        {selectedUniformDetail.rules.map((r, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-amber-600 font-bold">•</span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Size info */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-semibold">Ukuran Tersedia:</span>
                    <span className="font-bold text-slate-800">{selectedUniformDetail.availableSizes.join(', ')}</span>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <a
                    href={createWhatsAppOrderUrl(selectedUniformDetail.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Phone className="w-4 h-4 text-emerald-200" />
                    <span>Pesan {selectedUniformDetail.name} via WA</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setOrderForm((prev) => ({ ...prev, uniformName: selectedUniformDetail.name }));
                      setSelectedUniformDetail(null);
                      setActiveTab('orderform');
                    }}
                    className="w-full py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Buka Form Pemesanan Lengkap</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
