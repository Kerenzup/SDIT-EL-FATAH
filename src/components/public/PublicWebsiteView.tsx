import React, { useState } from 'react';
import {
  FoundationProfile,
  HeroBanner,
  SpeechesCMS,
  VisionMissionCMS,
  NewsArticle,
  GalleryItem,
  StudentAchievement,
  ERaport,
  Student,
  Teacher,
  UserRole,
  WebsiteLayoutConfig,
  PPDBConfig,
} from '../../types';
import { INITIAL_WEBSITE_LAYOUT_CONFIG, INITIAL_TEACHERS, INITIAL_PPDB_CONFIG, getWaliKelasByGrade, isClassMatching } from '../../data/initialData';
import { getLocalPhotoUrl } from '../../utils/localImages';
import {
  School,
  BookOpen,
  Award,
  Newspaper,
  Image as ImageIcon,
  Phone,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  ShieldCheck,
  ChevronRight,
  Video,
  Printer,
  Calendar,
  Lock,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Building,
  Heart,
  FileText,
  MapPin,
  Navigation,
  Mail,
  X,
  Eye,
  SlidersHorizontal,
  ArrowUp,
  ArrowDown,
  EyeOff,
  Palette,
  Save,
  Grid,
  GripVertical,
  Move,
  Copy,
  Check,
  Network,
  Users,
  Layers,
  Quote,
  PlayCircle,
  Play,
} from 'lucide-react';
import { formatRupiah, formatDateIndonesian, isMediaVideo, isYouTubeUrl, getYoutubeEmbedUrl, isGoogleDriveUrl, getGoogleDriveEmbedUrl, isVimeoUrl, getVimeoEmbedUrl } from '../../utils/formatters';
import { printDocument } from '../../utils/printHelper';
import { getSubjectsByClass } from '../../data/initialData';

interface PublicWebsiteViewProps {
  foundationProfile: FoundationProfile;
  heroBanners: HeroBanner[];
  speeches: SpeechesCMS;
  visionMission: VisionMissionCMS;
  newsArticles: NewsArticle[];
  galleryItems: GalleryItem[];
  achievements: StudentAchievement[];
  eRaports: ERaport[];
  students: Student[];
  teachers?: Teacher[];
  layoutConfig?: WebsiteLayoutConfig;
  ppdbConfig?: PPDBConfig;
  onUpdateLayoutConfig?: (config: WebsiteLayoutConfig) => void;
  onOpenInternalPortal: (role: UserRole) => void;
  onOpenRoleLoginModal?: (role?: UserRole) => void;
}

export const PublicWebsiteView: React.FC<PublicWebsiteViewProps> = ({
  foundationProfile,
  heroBanners,
  speeches,
  visionMission,
  newsArticles,
  galleryItems,
  achievements,
  eRaports,
  students,
  teachers = [],
  layoutConfig,
  ppdbConfig,
  onUpdateLayoutConfig,
  onOpenInternalPortal,
  onOpenRoleLoginModal,
}) => {
  const activePpdbConfig = ppdbConfig || INITIAL_PPDB_CONFIG;
  const [activeTab, setActiveTab] = useState<'home' | 'tentang' | 'ppdb' | 'prestasi' | 'galeri' | 'berita' | 'kontak'>('home');
  const [activeBannerIdx, setActiveBannerIdx] = useState<number>(0);

  // Prestasi States
  const [achievementFilterLevel, setAchievementFilterLevel] = useState<string>('SEMUA');
  const [achievementSearchQuery, setAchievementSearchQuery] = useState<string>('');

  // PPDB States
  const [ppdbSubTab, setPpdbSubTab] = useState<'pendaftaran' | 'status' | 'biaya'>('pendaftaran');
  const [ppdbFormData, setPpdbFormData] = useState({
    namaLengkap: '',
    nisnAsal: '',
    sekolahAsal: '',
    pilihanJurusanKelas: 'SDIT - Kelas 1 (Tahfidz & Coding)',
    namaOrangTua: '',
    noHpOrangTua: '',
    email: '',
    berkas: {
      ijazah: true,
      kk: true,
      akta: true,
      pasFoto: true,
    },
  });
  const [submittedRegNo, setSubmittedRegNo] = useState<string | null>(null);

  const [ppdbList, setPpdbList] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('yayasan_ppdb_list');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'ppdb-1',
        nomorRegistrasi: 'PPDB2026001',
        namaLengkap: 'Ahmad Rizky Pratama',
        nisnAsal: '0012345678',
        sekolahAsal: 'TK Islam Terpadu El-Fatah',
        pilihanJurusanKelas: 'SDIT - Kelas 1 (Tahfidz & Coding)',
        namaOrangTua: 'Bpk. Hendra Pratama',
        noHpOrangTua: '081234567890',
        email: 'hendra.pratama@gmail.com',
        tanggalDaftar: '2026-08-01',
        status: 'Lulus Seleksi',
        berkas: { ijazah: true, kk: true, akta: true, pasFoto: true },
      },
      {
        id: 'ppdb-2',
        nomorRegistrasi: 'PPDB2026002',
        namaLengkap: 'Siti Fatimah Azzahra',
        nisnAsal: '0012345679',
        sekolahAsal: 'RA Daarul Habibah',
        pilihanJurusanKelas: 'SDIT - Kelas 1 (Tahfidz & Coding)',
        namaOrangTua: 'Ibu Maryam',
        noHpOrangTua: '081298765432',
        email: 'maryam@gmail.com',
        tanggalDaftar: '2026-08-05',
        status: 'Berkas Lengkap',
        berkas: { ijazah: true, kk: true, akta: true, pasFoto: true },
      },
    ];
  });

  const [searchRegNo, setSearchRegNo] = useState('PPDB2026001');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searchError, setSearchError] = useState('');

  const handlePPDBSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ppdbFormData.namaLengkap || !ppdbFormData.namaOrangTua || !ppdbFormData.noHpOrangTua) {
      alert('Harap lengkapi nama siswa, nama orang tua, dan nomor HP/WhatsApp.');
      return;
    }

    const newRegNo = `PPDB2026${String(ppdbList.length + 1).padStart(3, '0')}`;
    const newEntry = {
      id: `ppdb-${Date.now()}`,
      nomorRegistrasi: newRegNo,
      namaLengkap: ppdbFormData.namaLengkap,
      nisnAsal: ppdbFormData.nisnAsal || '0000000000',
      sekolahAsal: ppdbFormData.sekolahAsal || 'TK/PAUD Asal',
      pilihanJurusanKelas: ppdbFormData.pilihanJurusanKelas,
      namaOrangTua: ppdbFormData.namaOrangTua,
      noHpOrangTua: ppdbFormData.noHpOrangTua,
      email: ppdbFormData.email || 'ortu@gmail.com',
      tanggalDaftar: new Date().toISOString().slice(0, 10),
      status: 'Berkas Lengkap',
      berkas: ppdbFormData.berkas,
    };

    const updated = [newEntry, ...ppdbList];
    setPpdbList(updated);
    try {
      localStorage.setItem('yayasan_ppdb_list', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    setSubmittedRegNo(newRegNo);
  };

  const handleSearchPPDBStatus = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    const query = searchRegNo.trim().toLowerCase();
    const found = ppdbList.find(
      (p) =>
        p.nomorRegistrasi.toLowerCase() === query ||
        p.namaLengkap.toLowerCase().includes(query)
    );

    if (found) {
      setSearchResult(found);
    } else {
      setSearchResult(null);
      setSearchError('Nomor Pendaftaran tidak ditemukan. Pastikan format benar (contoh: PPDB2026001).');
    }
  };

  // States for Dynamic Org Structure on Home
  const [orgFilterCategory, setOrgFilterCategory] = useState<'ALL' | 'PIMPINAN' | 'ROMBEL' | 'MAPEL' | 'STAF'>('ALL');
  const [orgViewMode, setOrgViewMode] = useState<'TREE' | 'GRID'>('TREE');
  const [orgSearchQuery, setOrgSearchQuery] = useState('');
  
  // State for Leader Speech Copy
  const [speechCopied, setSpeechCopied] = useState(false);

  const cfg = layoutConfig || INITIAL_WEBSITE_LAYOUT_CONFIG;
  const activeSections = [...cfg.sections].sort((a, b) => a.order - b.order).filter((s) => s.visible);

  const getPhotoClasses = () => {
    const ps = cfg.photoStyle || INITIAL_WEBSITE_LAYOUT_CONFIG.photoStyle;
    const fitClass = ps.imageFit === 'contain' ? 'object-contain bg-slate-50' : 'object-cover object-top';
    const radiusClass = ps.borderRadius || 'rounded-2xl';
    const shadowClass = ps.shadow || 'shadow-md';
    const borderClass = ps.border || 'border border-blue-100';
    const hoverClass =
      ps.hoverEffect === 'zoom'
        ? 'hover:scale-105 transition duration-300'
        : ps.hoverEffect === 'lift'
        ? 'hover:-translate-y-1 transition duration-300'
        : ps.hoverEffect === 'brightness'
        ? 'hover:brightness-110 transition duration-300'
        : '';

    return `${fitClass} ${radiusClass} ${shadowClass} ${borderClass} ${hoverClass}`;
  };

  const getThemeNavbarClass = () => {
    if (cfg.headerStyle === 'clean_white') return 'bg-white text-slate-900 border-b border-slate-200';
    if (cfg.headerStyle === 'glassmorphism') return 'bg-indigo-950/80 backdrop-blur-md text-white border-b border-indigo-800/60';
    return 'bg-indigo-950 text-white border-b border-indigo-900';
  };

  // Parent Portal Search State (Nama & Kelas)
  const [searchStudentName, setSearchStudentName] = useState<string>('');
  const [searchStudentClass, setSearchStudentClass] = useState<string>('SEMUA');
  const [parentSearchQuery, setParentSearchQuery] = useState<string>('');
  const [searchedStudent, setSearchedStudent] = useState<Student | null>(null);
  const [searchedRaport, setSearchedRaport] = useState<ERaport | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [portalTab, setPortalTab] = useState<'raport' | 'spp' | 'prestasi'>('raport');
  const [selectedNews, setSelectedNews] = useState<NewsArticle | null>(null);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryItem | null>(null);
  const [galleryCategory, setGalleryCategory] = useState<string>('SEMUA');

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  // Construct 100% integrated E-Raports list synced with ERP Master Data
  const allSynchronizedRaports: ERaport[] = students.map((std) => {
    const existingRap = eRaports.find(
      (r) =>
        r.studentId === std.id ||
        r.nisn === std.nis ||
        r.nisn === std.nisn ||
        r.studentName.toLowerCase() === std.name.toLowerCase()
    );

    const stdClassSubjects = getSubjectsByClass(std.gradeClass);

    if (existingRap) {
      return {
        ...existingRap,
        studentName: std.name,
        gradeClass: std.gradeClass,
        nisn: existingRap.nisn || std.nisn || std.nis,
        parentName: existingRap.parentName || std.parentName || `Bpk/Ibu ${std.name.split(' ')[0]}`,
        teacherName: existingRap.teacherName || getWaliKelasByGrade(std.gradeClass, teachers),
        academicYear: existingRap.academicYear || '2026/2027 Semester Ganjil',
      };
    }

    return {
      id: `rap-integrated-${std.id}`,
      studentId: std.id,
      studentName: std.name,
      nisn: std.nis || std.nisn || '20240101',
      gradeClass: std.gradeClass,
      academicYear: '2026/2027 Semester Ganjil',
      parentName: std.parentName || `Bpk/Ibu ${std.name.split(' ')[0]}`,
      teacherName: getWaliKelasByGrade(std.gradeClass, teachers),
      grades: stdClassSubjects.map((sub, idx) => ({
        subject: sub,
        score: idx === 0 ? 95 : 85 + (idx % 8),
        letterGrade: idx === 0 ? 'A' : 'B',
        notes: `Menguasai materi ${sub} dengan sangat baik.`,
      })),
      attendance: { present: 80, sick: 1, permitted: 0, absent: 0 },
      extracurriculars: [{ name: 'Pramuka', grade: 'A', notes: 'Sangat aktif.' }],
      teacherNotes: `Ananda ${std.name} menunjukkan perkembangan karakter yang positif dan rajin belajar.`,
      status: 'DITERBITKAN',
      issuedDate: new Date().toISOString().split('T')[0],
    };
  });

  const handleSelectRaportDirectly = (rap: ERaport) => {
    setHasSearched(true);
    setSearchedRaport(rap);
    const std = students.find((s) => s.id === rap.studentId || s.name.toLowerCase() === rap.studentName.toLowerCase());
    setSearchedStudent(std || null);
    setSearchStudentName(rap.studentName);
    setSearchStudentClass(rap.gradeClass);
    setPortalTab('raport');
  };

  const handleParentSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const qName = searchStudentName.trim().toLowerCase();
    const qClass = searchStudentClass;
    const qGeneral = parentSearchQuery.trim().toLowerCase();

    const matchesClass = (itemClass: string) => {
      if (qClass === 'SEMUA') return true;
      return isClassMatching(itemClass, qClass);
    };

    const foundRap = allSynchronizedRaports.find((r) => {
      const matchName = qName ? r.studentName.toLowerCase().includes(qName) : true;
      const matchGeneral = qGeneral
        ? r.nisn.toLowerCase().includes(qGeneral) ||
          r.studentName.toLowerCase().includes(qGeneral) ||
          (r.parentName && r.parentName.toLowerCase().includes(qGeneral))
        : true;
      const matchCls = matchesClass(r.gradeClass);
      return matchName && matchGeneral && matchCls;
    });

    const foundStd = students.find((s) => {
      if (foundRap) return s.id === foundRap.studentId || s.name.toLowerCase() === foundRap.studentName.toLowerCase();
      const matchName = qName ? s.name.toLowerCase().includes(qName) : true;
      const matchGeneral = qGeneral
        ? s.nis.toLowerCase().includes(qGeneral) ||
          (s.nisn && s.nisn.toLowerCase().includes(qGeneral)) ||
          s.name.toLowerCase().includes(qGeneral)
        : true;
      const matchCls = matchesClass(s.gradeClass);
      return matchName && matchGeneral && matchCls;
    });

    setSearchedStudent(foundStd || null);
    setSearchedRaport(foundRap || null);
  };

  const filteredGallery = galleryItems.filter((item) => {
    if (galleryCategory === 'SEMUA') return true;
    return item.category === galleryCategory;
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSuccess(true);
    setContactName('');
    setContactPhone('');
    setContactMessage('');
    setTimeout(() => setContactSuccess(false), 5000);
  };

  // Move active section by index offset
  const handleMoveActiveSection = (index: number, direction: 'up' | 'down') => {
    if (!onUpdateLayoutConfig) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= activeSections.length) return;

    const currentOrder = [...activeSections];
    const temp = currentOrder[index];
    currentOrder[index] = currentOrder[newIndex];
    currentOrder[newIndex] = temp;

    const reorderedActive = currentOrder.map((sec, idx) => ({ ...sec, order: idx + 1 }));
    const hiddenSections = cfg.sections.filter((s) => !s.visible);
    const newSections = [
      ...reorderedActive,
      ...hiddenSections.map((sec, idx) => ({ ...sec, order: reorderedActive.length + idx + 1 })),
    ];

    onUpdateLayoutConfig({ ...cfg, sections: newSections });
  };

  const renderDraggableSection = (sec: any, _secIdx: number, content: React.ReactNode) => {
    return (
      <div key={sec.id}>
        {content}
      </div>
    );
  };

  const handleToggleSection = (id: string) => {
    if (!onUpdateLayoutConfig) return;
    const updatedSections = cfg.sections.map((sec) =>
      sec.id === id ? { ...sec, visible: !sec.visible } : sec
    );
    onUpdateLayoutConfig({ ...cfg, sections: updatedSections });
  };

  const galleryCols = cfg.gridColumns?.galleryCols || 3;
  const galleryGridClass =
    galleryCols === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : galleryCols === 4
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  const newsCols = cfg.gridColumns?.newsCols || 3;
  const newsGridClass =
    newsCols === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : newsCols === 4
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  const achievementCols = cfg.gridColumns?.achievementCols || 3;
  const achievementGridClass =
    achievementCols === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : achievementCols === 4
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <div className="min-h-screen bg-[#00BFFF] text-slate-800 flex flex-col font-sans relative selection:bg-sky-200 selection:text-sky-900">
      {/* Top Soft Blue & Sky Accent Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-sky-500 via-blue-400 via-sky-300 to-sky-500 shadow-xs" />

      {/* Top Header & Navbar - Brand Cyan Blue #0095D9 */}
      <header className="bg-[#0095D9] sticky top-0 z-40 border-b border-sky-300/40 text-white shadow-md">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          {/* Logo & School Name */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('home')}>
            {foundationProfile.logoUrl ? (
              <div className="p-0.5 rounded-2xl bg-gradient-to-tr from-sky-300 via-blue-200 to-amber-300 shadow-md group-hover:scale-105 transition duration-300">
                <img
                  src={foundationProfile.logoUrl}
                  alt={foundationProfile.name}
                  className="w-11 h-11 rounded-xl object-cover bg-slate-900 p-0.5"
                />
              </div>
            ) : (
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-300 via-blue-200 to-amber-300 flex items-center justify-center text-slate-950 shadow-md font-black">
                <GraduationCap className="w-6 h-6" />
              </div>
            )}
            <div>
              <h1 className="font-black text-base sm:text-lg tracking-tight leading-tight text-white group-hover:text-amber-300 transition">
                {foundationProfile.name}
              </h1>
              <p className="text-[10px] text-sky-100 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" /> Akreditasi A Unggul & Standardisasi Global
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex items-center gap-1 sm:gap-2 bg-black/20 p-1.5 rounded-2xl border border-white/20 backdrop-blur-md">
            {[
              { id: 'home', label: 'Home', icon: School },
              { id: 'tentang', label: 'Tentang Kami', icon: Building },
              { id: 'ppdb', label: 'PPDB 2026', icon: FileText },
              { id: 'prestasi', label: 'Prestasi Sekolah', icon: Award },
              { id: 'galeri', label: 'Galeri & Aktivitas', icon: ImageIcon },
              { id: 'berita', label: 'Berita & E-Raport', icon: Newspaper },
              { id: 'kontak', label: 'Kontak', icon: Phone },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-slate-950 shadow-md font-black'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Actions: Internal Access */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (onOpenRoleLoginModal) {
                  onOpenRoleLoginModal('KEPALA_SEKOLAH');
                } else {
                  onOpenInternalPortal('KEPALA_SEKOLAH');
                }
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:brightness-105 text-slate-950 font-black text-xs rounded-xl shadow-md transition cursor-pointer hover:scale-105"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Akses Internal Pengurus</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1">
        {/* ==================== HOME PAGE (DYNAMIC LAYOUT REORDERED SECTIONS) ==================== */}
        {activeTab === 'home' && (
          <div className="space-y-12 pb-12">
            {activeSections.map((sec, secIdx) => {
              // 1. HERO SLIDER SECTION
              if (sec.id === 'hero') {
                return renderDraggableSection(
                  sec,
                  secIdx,
                  <div key={sec.id} className="relative bg-[#4169E1] text-white overflow-hidden min-h-[480px] flex items-center rounded-3xl border border-blue-300/50 shadow-md">
                    {heroBanners.length > 0 && (
                      <div className="absolute inset-0 z-0 opacity-30">
                        {(() => {
                          const currentUrl = heroBanners[activeBannerIdx]?.imageUrl || heroBanners[0]?.imageUrl || '';
                          if (currentUrl.includes('youtube.com') || currentUrl.includes('youtu.be')) {
                            return (
                              <iframe
                                src={getYoutubeEmbedUrl(currentUrl)}
                                title="Banner Video"
                                className="w-full h-full border-0 pointer-events-none scale-125"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              />
                            );
                          } else if (isMediaVideo(currentUrl)) {
                            return (
                              <video
                                src={currentUrl}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                              />
                            );
                          } else {
                            return (
                              <img
                                src={currentUrl}
                                alt="Hero Banner"
                                className="w-full h-full object-cover transition-all duration-700"
                              />
                            );
                          }
                        })()}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#4169E1] via-[#4169E1]/90 to-transparent" />
                      </div>
                    )}

                    <div className="relative z-10 max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                      <div className="md:col-span-8 space-y-5">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 text-slate-950 text-xs font-black rounded-full backdrop-blur-md uppercase tracking-wider shadow-sm">
                          <Sparkles className="w-4 h-4 text-slate-950" /> INTERNATIONAL STANDARD FOUNDATION • AKREDITASI A (UNGGUL)
                        </div>
                        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
                          {heroBanners[activeBannerIdx]?.title || 'Pendidikan Berkarakter & Transparan World-Class'}
                        </h2>
                        <p className="text-blue-100 text-sm sm:text-base max-w-2xl leading-relaxed font-normal">
                          {heroBanners[activeBannerIdx]?.subtitle ||
                            'Membentuk generasi pembelajar Rombel Kelas 1 - 6 yang unggul berstandar global, berakhlak mulia, serta didukung transparansi anggaran berbasis ISAK 35.'}
                        </p>
                        <div className="pt-3 flex flex-wrap gap-3">
                          <button
                            onClick={() => setActiveTab('tentang')}
                            className="px-6 py-3 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:brightness-105 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer hover:scale-105"
                          >
                            <span>Jelajahi Profil Yayasan Internasional</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setActiveTab('berita')}
                            className="px-6 py-3 bg-blue-900/80 hover:bg-blue-900 text-amber-300 font-bold text-xs rounded-xl border border-blue-300/50 transition flex items-center gap-2 cursor-pointer backdrop-blur-md"
                          >
                            <Search className="w-4 h-4 text-amber-300" />
                            <span>Cek E-Raport / Status SPP Online</span>
                          </button>
                        </div>
                      </div>

                      {/* Banner Selector Dots */}
                      <div className="md:col-span-4 flex md:justify-end gap-2">
                        {heroBanners.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveBannerIdx(idx)}
                            className={`h-3 rounded-full transition-all cursor-pointer ${
                              activeBannerIdx === idx ? 'w-8 bg-amber-400 shadow-sm' : 'w-3 bg-white/40 hover:bg-white/60'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              // 2. QUICK STATS SECTION
              if (sec.id === 'stats') {
                return renderDraggableSection(
                  sec,
                  secIdx,
                  <div key={sec.id} className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-[#0000FF] p-5 rounded-2xl border border-blue-400/60 hover:border-white shadow-md flex items-center gap-4 transition group">
                        <div className="p-3 bg-white/20 text-white rounded-2xl shrink-0 group-hover:scale-105 transition">
                          <GraduationCap className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-2xl font-black text-white">{students.length} Siswa</p>
                          <p className="text-xs text-blue-100 font-medium">Rombel Kelas 1 - 6</p>
                        </div>
                      </div>

                      <div className="bg-[#0000FF] p-5 rounded-2xl border border-blue-400/60 hover:border-white shadow-md flex items-center gap-4 transition group">
                        <div className="p-3 bg-white/20 text-white rounded-2xl shrink-0 group-hover:scale-105 transition">
                          <User className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-2xl font-black text-white">
                            {(teachers && teachers.length > 0 ? teachers.length : INITIAL_TEACHERS.length)} Guru & Staf
                          </p>
                          <p className="text-xs text-blue-100 font-medium">Pendidik S1/S2 Global</p>
                        </div>
                      </div>

                      <div className="bg-[#0000FF] p-5 rounded-2xl border border-blue-400/60 hover:border-white shadow-md flex items-center gap-4 transition group">
                        <div className="p-3 bg-white/20 text-white rounded-2xl shrink-0 group-hover:scale-105 transition">
                          <Award className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-2xl font-black text-white">{achievements.length} Prestasi</p>
                          <p className="text-xs text-blue-100 font-medium">Nasional & Internasional</p>
                        </div>
                      </div>

                      <div className="bg-[#0000FF] p-5 rounded-2xl border border-blue-400/60 hover:border-white shadow-md flex items-center gap-4 transition group">
                        <div className="p-3 bg-white/20 text-white rounded-2xl shrink-0 group-hover:scale-105 transition">
                          <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-2xl font-black text-white">SiPLah & ISAK 35</p>
                          <p className="text-xs text-blue-100 font-medium">Audited & Transparan</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              // 3. SPEECHES SECTION (JAJARAN PENGURUS YAYASAN: Pembina, Ketua, Sekretaris, Bendahara)
              if (sec.id === 'speeches') {
                return renderDraggableSection(
                  sec,
                  secIdx,
                  <div key={sec.id} className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    <div className="text-center space-y-2">
                      <span className="px-4 py-1 bg-white/20 text-white border border-white/40 text-xs font-black rounded-full uppercase shadow-xs">
                        PIMPINAN & JAJARAN PENGURUS YAYASAN
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black text-white">{sec.title}</h3>
                      <p className="text-xs text-blue-100 max-w-2xl mx-auto">
                        Komitmen Pembina Yayasan, Ketua Yayasan, Sekretaris Yayasan, Bendahara Yayasan, dan Kepala Sekolah terhadap mutu akademik, pembentukan karakter, dan transparansi keuangan ISAK 35.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {/* 1. Pembina Yayasan */}
                      <div className="bg-[#87CEFA] p-5 rounded-3xl border-2 border-sky-300 shadow-lg flex flex-col justify-between items-center text-center space-y-3 relative overflow-hidden group hover:border-slate-800 transition text-slate-950">
                        <div className="p-1 bg-white/80 rounded-2xl shadow-md w-36 sm:w-44 lg:w-48 aspect-[4/5] mx-auto overflow-hidden shrink-0 ring-2 ring-slate-800/20 relative">
                          <img
                            src={getLocalPhotoUrl(foundationProfile.pembinaPhotoUrl || foundationProfile.orgStructure?.find(m => m.position.includes('Pembina'))?.photoUrl, 'Pembina Yayasan')}
                            alt="Pembina Yayasan"
                            className="w-full h-full object-cover object-top bg-sky-100 rounded-xl"
                          />
                          <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-slate-900/85 text-white text-[9px] font-extrabold rounded-full border border-white/40 whitespace-nowrap shadow-xs">
                            Pasfoto Resmi 4x5 cm
                          </span>
                        </div>
                        <div className="space-y-1 w-full">
                          <span className="inline-block px-3 py-0.5 bg-slate-900 text-white text-[10px] font-black rounded-full uppercase shadow-xs">
                            Pembina Yayasan
                          </span>
                          <h4 className="font-extrabold text-slate-950 text-base mt-1">{foundationProfile.pembinaName || 'Abdul Muhyi S.Pd'}</h4>
                          <p className="text-[11px] text-sky-900 font-bold">{foundationProfile.pembinaTitle || 'Pembina Yayasan'}</p>
                        </div>
                        <p className="text-xs text-slate-900 italic font-serif leading-relaxed bg-white/80 p-3 rounded-2xl border border-sky-300 w-full mt-auto shadow-xs">
                          "{speeches.chairmanSpeech || 'Mengarahkan seluruh unit sekolah agar senantiasa berpedoman pada standar keunggulan global dan akhlak karimah.'}"
                        </p>
                      </div>

                      {/* 2. Ketua Yayasan */}
                      <div className="bg-[#87CEFA] p-5 rounded-3xl border-2 border-sky-300 shadow-lg flex flex-col justify-between items-center text-center space-y-3 relative overflow-hidden group hover:border-slate-800 transition text-slate-950">
                        <div className="p-1 bg-white/80 rounded-2xl shadow-md w-36 sm:w-44 lg:w-48 aspect-[4/5] mx-auto overflow-hidden shrink-0 ring-2 ring-slate-800/20 relative">
                          <img
                            src={getLocalPhotoUrl(foundationProfile.leaderPhotoUrl || foundationProfile.orgStructure?.find(m => m.position.includes('Ketua'))?.photoUrl, 'Ketua Yayasan')}
                            alt="Ketua Yayasan"
                            className="w-full h-full object-cover object-top bg-sky-100 rounded-xl"
                          />
                          <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-slate-900/85 text-white text-[9px] font-extrabold rounded-full border border-white/40 whitespace-nowrap shadow-xs">
                            Pasfoto Resmi 4x5 cm
                          </span>
                        </div>
                        <div className="space-y-1 w-full">
                          <span className="inline-block px-3 py-0.5 bg-slate-900 text-white text-[10px] font-black rounded-full uppercase shadow-xs">
                            Ketua Yayasan
                          </span>
                          <h4 className="font-extrabold text-slate-950 text-base mt-1">{foundationProfile.leaderName || 'H. Ahmad Dahlan, M.Ag'}</h4>
                          <p className="text-[11px] text-sky-900 font-bold">{foundationProfile.leaderTitle || 'Ketua Yayasan'}</p>
                        </div>
                        <p className="text-xs text-slate-900 italic font-serif leading-relaxed bg-white/80 p-3 rounded-2xl border border-sky-300 w-full mt-auto shadow-xs">
                          "{foundationProfile.welcomeMessage || 'Selamat datang di Portal Resmi Yayasan. Kami berkomitmen menyajikan pendidikan unggul berkarakter islami dan transparan.'}"
                        </p>
                      </div>

                      {/* 3. Sekretaris Yayasan */}
                      <div className="bg-[#87CEFA] p-5 rounded-3xl border-2 border-sky-300 shadow-lg flex flex-col justify-between items-center text-center space-y-3 relative overflow-hidden group hover:border-slate-800 transition text-slate-950">
                        <div className="p-1 bg-white/80 rounded-2xl shadow-md w-36 sm:w-44 lg:w-48 aspect-[4/5] mx-auto overflow-hidden shrink-0 ring-2 ring-slate-800/20 relative">
                          <img
                            src={getLocalPhotoUrl(foundationProfile.secretaryPhotoUrl || speeches.secretaryPhotoUrl || foundationProfile.orgStructure?.find(m => m.position.includes('Sekretaris'))?.photoUrl, 'Sekretaris Yayasan')}
                            alt="Sekretaris Yayasan"
                            className="w-full h-full object-cover object-top bg-sky-100 rounded-xl"
                          />
                          <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-slate-900/85 text-white text-[9px] font-extrabold rounded-full border border-white/40 whitespace-nowrap shadow-xs">
                            Pasfoto Resmi 4x5 cm
                          </span>
                        </div>
                        <div className="space-y-1 w-full">
                          <span className="inline-block px-3 py-0.5 bg-slate-900 text-white text-[10px] font-black rounded-full uppercase shadow-xs">
                            Sekretaris Yayasan
                          </span>
                          <h4 className="font-extrabold text-slate-950 text-base mt-1">{foundationProfile.secretaryName || speeches.secretaryName || 'H. Ahmad Subagja, S.H'}</h4>
                          <p className="text-[11px] text-sky-900 font-bold">{foundationProfile.secretaryTitle || speeches.secretaryTitle || 'Sekretaris Yayasan'}</p>
                        </div>
                        <p className="text-xs text-slate-900 italic font-serif leading-relaxed bg-white/80 p-3 rounded-2xl border border-sky-300 w-full mt-auto shadow-xs">
                          "{foundationProfile.secretarySpeech || speeches.secretarySpeech || 'Menjamin ketertiban administrasi, legalitas Kemenkumham, serta pelayanan publik dan orang tua murid yang responsif.'}"
                        </p>
                      </div>

                      {/* 4. Bendahara Yayasan */}
                      <div className="bg-[#87CEFA] p-5 rounded-3xl border-2 border-sky-300 shadow-lg flex flex-col justify-between items-center text-center space-y-3 relative overflow-hidden group hover:border-slate-800 transition text-slate-950">
                        <div className="p-1 bg-white/80 rounded-2xl shadow-md w-36 sm:w-44 lg:w-48 aspect-[4/5] mx-auto overflow-hidden shrink-0 ring-2 ring-slate-800/20 relative">
                          <img
                            src={getLocalPhotoUrl(foundationProfile.treasurerPhotoUrl || speeches.treasurerPhotoUrl || foundationProfile.orgStructure?.find(m => m.position.includes('Bendahara'))?.photoUrl, 'Bendahara Yayasan')}
                            alt="Bendahara Yayasan"
                            className="w-full h-full object-cover object-top bg-sky-100 rounded-xl"
                          />
                          <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-slate-900/85 text-white text-[9px] font-extrabold rounded-full border border-white/40 whitespace-nowrap shadow-xs">
                            Pasfoto Resmi 4x5 cm
                          </span>
                        </div>
                        <div className="space-y-1 w-full">
                          <span className="inline-block px-3 py-0.5 bg-slate-900 text-white text-[10px] font-black rounded-full uppercase shadow-xs">
                            Bendahara Yayasan
                          </span>
                          <h4 className="font-extrabold text-slate-950 text-base mt-1">{foundationProfile.treasurerName || speeches.treasurerName || 'Hj. Nurul Aini, S.E., M.Ak'}</h4>
                          <p className="text-[11px] text-sky-900 font-bold">{foundationProfile.treasurerTitle || speeches.treasurerTitle || 'Bendahara Yayasan'}</p>
                        </div>
                        <p className="text-xs text-slate-900 italic font-serif leading-relaxed bg-white/80 p-3 rounded-2xl border border-sky-300 w-full mt-auto shadow-xs">
                          "{foundationProfile.treasurerSpeech || speeches.treasurerSpeech || 'Mengelola akuntabilitas keuangan berbasis ISAK 35, sistem kuitansi digital SPP, dan audit anggaran dana BOS.'}"
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }

              // 3.5 DYNAMIC TEACHER & STAFF ORG STRUCTURE
              if (sec.id === 'guru_staf_org') {
                const rawTeachers = teachers.length > 0 ? teachers : INITIAL_TEACHERS;
                const activeTeachers = rawTeachers.filter((t) => {
                  const role = (t.role || '').toLowerCase();
                  const notes = (t.notes || '').toLowerCase();
                  const rombel = (t.assignedRombel || '').toLowerCase();
                  return (
                    !role.includes('pembina') &&
                    !role.includes('ketua yayasan') &&
                    !role.includes('sekretaris yayasan') &&
                    !role.includes('bendahara yayasan') &&
                    !notes.includes('pengurus yayasan') &&
                    !rombel.includes('pengurus yayasan')
                  );
                });
                const filteredTeachers = activeTeachers.filter((t) => {
                  const matchesSearch =
                    t.name.toLowerCase().includes(orgSearchQuery.toLowerCase()) ||
                    (t.role && t.role.toLowerCase().includes(orgSearchQuery.toLowerCase())) ||
                    (t.subject && t.subject.toLowerCase().includes(orgSearchQuery.toLowerCase())) ||
                    (t.classAssigned && t.classAssigned.toLowerCase().includes(orgSearchQuery.toLowerCase()));

                  if (!matchesSearch) return false;

                  if (orgFilterCategory === 'PIMPINAN') {
                    return t.role.toLowerCase().includes('kepala') || t.role.toLowerCase().includes('wakasek') || t.role.toLowerCase().includes('pimpinan');
                  }
                  if (orgFilterCategory === 'ROMBEL') {
                    const role = (t.role || '').toLowerCase();
                    const rombel = `${t.assignedRombel || ''} ${t.classAssigned || ''}`.toLowerCase();
                    return role.includes('wali kelas') || rombel.includes('kelas') || rombel.includes('rombel');
                  }
                  if (orgFilterCategory === 'MAPEL') {
                    return t.subject && !t.role.toLowerCase().includes('wali kelas') && !t.role.toLowerCase().includes('kepala');
                  }
                  if (orgFilterCategory === 'STAF') {
                    return t.role.toLowerCase().includes('staf') || t.role.toLowerCase().includes('tata usaha') || t.role.toLowerCase().includes('it');
                  }
                  return true;
                });

                const headmaster = activeTeachers.find((t) => t.role.toLowerCase().includes('kepala sekolah')) || activeTeachers[0];
                const viceHead = activeTeachers.find((t) => t.role.toLowerCase().includes('wakasek') || t.role.toLowerCase().includes('wakil kepala')) || activeTeachers[1];
                
                const getRombelNum = (t: Teacher) => {
                  const text = `${t.assignedRombel || ''} ${t.role || ''} ${t.subjectTaught || ''}`.toLowerCase();
                  const match = text.match(/kelas\s*(\d+)/i) || text.match(/rombel\s*(\d+)/i) || text.match(/(\d+)/);
                  return match ? parseInt(match[1], 10) : 99;
                };

                const isRombelTeacher = (t: Teacher) => {
                  const role = (t.role || '').toLowerCase();
                  const rombel = `${t.assignedRombel || ''}`.toLowerCase();
                  return role.includes('wali kelas') || rombel.includes('kelas') || rombel.includes('rombel');
                };

                const rombelTeachers = activeTeachers
                  .filter(isRombelTeacher)
                  .sort((a, b) => getRombelNum(a) - getRombelNum(b));

                const otherStaff = activeTeachers.filter((t) => t.id !== headmaster?.id && t.id !== viceHead?.id && !rombelTeachers.some((rt) => rt.id === t.id));
                const subjectTeachers = otherStaff.filter((t) => {
                  const role = (t.role || '').toLowerCase();
                  return !role.includes('staf') && !role.includes('tata usaha') && !role.includes('tu') && !role.includes('admin') && !role.includes('operasional');
                });
                const tuStaff = otherStaff.filter((t) => {
                  const role = (t.role || '').toLowerCase();
                  return role.includes('staf') || role.includes('tata usaha') || role.includes('tu') || role.includes('admin') || role.includes('operasional');
                });

                return renderDraggableSection(
                  sec,
                  secIdx,
                  <div key={sec.id} className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-[#87CEFA] p-6 sm:p-8 rounded-3xl border border-sky-300 shadow-md space-y-8 text-slate-950">
                      {/* Section Header */}
                      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-sky-400/60 pb-6">
                        <div className="space-y-2">
                          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-slate-900 text-white text-xs font-black rounded-full uppercase shadow-xs">
                            <Network className="w-3.5 h-3.5 text-sky-200" /> STRUKTUR ORGANISASI GURU & STAF (DINAMIS)
                          </div>
                          <h3 className="text-2xl sm:text-3xl font-black text-slate-950">{sec.title}</h3>
                          <p className="text-xs text-slate-800 font-medium">
                            Susunan struktural tenaga pendidik, wali kelas Rombel 1-6, guru mata pelajaran, dan staf tata usaha sekolah.
                          </p>
                        </div>

                        {/* Controls: Search & View Mode */}
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="relative">
                            <Search className="w-4 h-4 text-slate-600 absolute left-3 top-2.5" />
                            <input
                              type="text"
                              value={orgSearchQuery}
                              onChange={(e) => setOrgSearchQuery(e.target.value)}
                              placeholder="Cari guru / mapel..."
                              className="pl-9 pr-3 py-2 bg-white border border-sky-300 rounded-xl text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:border-slate-900 w-44 sm:w-56 font-semibold"
                            />
                          </div>

                          <div className="flex items-center bg-white/60 p-1 rounded-xl border border-sky-300">
                            <button
                              onClick={() => setOrgViewMode('TREE')}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                                orgViewMode === 'TREE' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-800 hover:text-slate-950'
                              }`}
                            >
                              <Network className="w-3.5 h-3.5" />
                              <span>Struktur Pohon</span>
                            </button>
                            <button
                              onClick={() => setOrgViewMode('GRID')}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                                orgViewMode === 'GRID' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-800 hover:text-slate-950'
                              }`}
                            >
                              <Grid className="w-3.5 h-3.5" />
                              <span>Kartu Grid</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Filter Category Tabs */}
                      <div className="flex flex-wrap items-center gap-2">
                        {[
                          { id: 'ALL', label: 'Semua Guru & Staf', count: activeTeachers.length },
                          { id: 'PIMPINAN', label: 'Pimpinan Sekolah', count: activeTeachers.filter(t => t.role.toLowerCase().includes('kepala') || t.role.toLowerCase().includes('wakasek')).length },
                          { id: 'ROMBEL', label: 'Wali Kelas Rombel', count: rombelTeachers.length },
                          { id: 'MAPEL', label: 'Guru Mata Pelajaran', count: activeTeachers.filter(t => t.subject && !t.role.toLowerCase().includes('wali kelas') && !t.role.toLowerCase().includes('kepala')).length },
                          { id: 'STAF', label: 'Staf Administrasi', count: activeTeachers.filter(t => t.role.toLowerCase().includes('staf') || t.role.toLowerCase().includes('tata usaha')).length },
                        ].map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => setOrgFilterCategory(cat.id as any)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                              orgFilterCategory === cat.id
                                ? 'bg-slate-900 text-white shadow-xs font-extrabold'
                                : 'bg-white/70 text-slate-800 hover:bg-white border border-sky-300'
                            }`}
                          >
                            <span>{cat.label}</span>
                            <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-black ${
                              orgFilterCategory === cat.id ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-800'
                            }`}>
                              {cat.count}
                            </span>
                          </button>
                        ))}
                      </div>

                      {/* DISPLAY MODE 1: TREE HIERARCHY VIEW */}
                      {orgViewMode === 'TREE' && (
                        <div className="space-y-8 pt-4 overflow-x-auto pb-4">
                          {/* LEVEL 1: KEPALA SEKOLAH */}
                          {headmaster && (
                            <div className="flex flex-col items-center">
                              <div className="bg-[#87CEFA] p-3 rounded-2xl border-2 border-slate-900 shadow-md text-center max-w-[260px] w-full space-y-2 relative group hover:scale-105 transition flex flex-col justify-between items-center text-slate-950">
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-slate-900 text-white text-[10px] font-black rounded-full uppercase shadow-xs whitespace-nowrap z-10">
                                  Kepala Sekolah
                                </span>
                                <div className="p-1 bg-white/80 rounded-xl w-36 sm:w-44 aspect-[4/5] mx-auto shadow-sm overflow-hidden mt-1 relative">
                                  <img
                                    src={getLocalPhotoUrl(headmaster.photoUrl, headmaster.role || headmaster.name)}
                                    alt={headmaster.name}
                                    className="w-full h-full object-cover object-top rounded-lg bg-sky-100 shadow-inner"
                                  />
                                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.2 bg-slate-900/80 text-white text-[8px] font-bold rounded-full whitespace-nowrap">
                                    Pasfoto 4x5 cm
                                  </span>
                                </div>
                                <div className="flex flex-col items-center justify-center space-y-0.5 w-full">
                                  <span className="px-1.5 py-0.5 bg-slate-900 text-white text-[9px] sm:text-[10px] font-black rounded-full inline-block whitespace-nowrap">
                                    Top Leader
                                  </span>
                                  <h5 className="font-extrabold text-slate-950 text-xs sm:text-sm leading-tight group-hover:text-sky-900 transition line-clamp-2 mt-0.5">{headmaster.name}</h5>
                                  <p className="text-[9px] sm:text-[10px] text-slate-800 font-bold truncate max-w-full">{headmaster.role}</p>
                                  {headmaster.nipOrNipy && <p className="text-[9px] text-slate-700 font-mono">{headmaster.nipOrNipy}</p>}
                                </div>
                              </div>
                              <div className="w-0.5 h-8 bg-slate-800 my-1"></div>
                            </div>
                          )}

                          {/* LEVEL 2: WAKASEK & MANAGEMENT */}
                          {viceHead && (
                            <div className="flex flex-col items-center">
                              <div className="bg-[#87CEFA] p-3 rounded-2xl border border-slate-800 shadow-md text-center max-w-[260px] w-full space-y-2 relative group hover:border-slate-950 transition flex flex-col justify-between items-center text-slate-950">
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-slate-900 text-white text-[9px] font-black rounded-full uppercase shadow-xs whitespace-nowrap z-10">
                                  Wakasek & Kurikulum
                                </span>
                                <div className="p-1 bg-white/80 rounded-xl w-36 sm:w-44 aspect-[4/5] mx-auto shadow-sm overflow-hidden mt-1 relative">
                                  <img
                                    src={getLocalPhotoUrl(viceHead.photoUrl, viceHead.role || viceHead.name)}
                                    alt={viceHead.name}
                                    className="w-full h-full object-cover object-top rounded-lg bg-sky-100 shadow-inner"
                                  />
                                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.2 bg-slate-900/80 text-white text-[8px] font-bold rounded-full whitespace-nowrap">
                                    Pasfoto 4x5 cm
                                  </span>
                                </div>
                                <div className="flex flex-col items-center justify-center space-y-0.5 w-full">
                                  <span className="px-1.5 py-0.5 bg-slate-900 text-white text-[9px] sm:text-[10px] font-black rounded-full inline-block whitespace-nowrap">
                                    Wakil Kepala
                                  </span>
                                  <h5 className="font-extrabold text-slate-950 text-xs sm:text-sm leading-tight group-hover:text-sky-900 transition line-clamp-2 mt-0.5">{viceHead.name}</h5>
                                  <p className="text-[9px] sm:text-[10px] text-slate-800 font-bold truncate max-w-full">{viceHead.role}</p>
                                  {viceHead.nipOrNipy && <p className="text-[9px] text-slate-700 font-mono">{viceHead.nipOrNipy}</p>}
                                </div>
                              </div>
                              <div className="w-0.5 h-8 bg-slate-800 my-1"></div>
                            </div>
                          )}

                          {/* LEVEL 3: WALI KELAS ROMBEL 1-6 */}
                          <div className="space-y-3">
                            <div className="text-center space-y-1">
                              <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-black rounded-full uppercase shadow-xs">
                                JAJARAN WALI KELAS ROMBEL (KELAS 1 - 6)
                              </span>
                            </div>
                            <div className="grid grid-cols-6 gap-2 sm:gap-3 w-full">
                              {rombelTeachers.map((t) => (
                                <div
                                  key={t.id}
                                  className="bg-[#87CEFA] p-2 sm:p-2.5 rounded-2xl border border-sky-400/80 hover:border-slate-900 transition text-center space-y-1.5 group shadow-md flex flex-col justify-between text-slate-950"
                                >
                                  <div className="p-0.5 bg-white/60 rounded-xl w-full aspect-[4/5] mx-auto shadow-xs overflow-hidden">
                                    <img
                                      src={getLocalPhotoUrl(t.photoUrl, t.role || t.name)}
                                      alt={t.name}
                                      className="w-full h-full object-cover object-top rounded-lg bg-sky-100 shadow-inner"
                                    />
                                  </div>
                                  <div className="flex flex-col items-center justify-center space-y-0.5">
                                    <span className="px-1.5 py-0.5 bg-slate-900 text-white text-[9px] sm:text-[10px] font-black rounded-full inline-block whitespace-nowrap">
                                      {t.assignedRombel || t.classAssigned || 'Rombel'}
                                    </span>
                                    <h5 className="font-extrabold text-slate-950 text-[10px] sm:text-[11px] leading-tight group-hover:text-sky-900 transition line-clamp-2 mt-0.5">{t.name}</h5>
                                    <p className="text-[8px] sm:text-[9px] text-slate-800 font-medium truncate max-w-full">{t.role || t.subject || t.subjectTaught}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* LEVEL 4: GURU MATA PELAJARAN */}
                          {subjectTeachers.length > 0 && (
                            <div className="space-y-3 pt-4 border-t border-sky-400/60">
                              <div className="text-center">
                                <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-black rounded-full uppercase shadow-xs">
                                  GURU MATA PELAJARAN
                                </span>
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3 w-full">
                                {subjectTeachers.map((t) => (
                                  <div
                                    key={t.id}
                                    className="bg-[#87CEFA] p-2 sm:p-2.5 rounded-2xl border border-sky-400/80 hover:border-slate-900 transition text-center space-y-1.5 group shadow-md flex flex-col justify-between text-slate-950"
                                  >
                                    <div className="p-0.5 bg-white/60 rounded-xl w-full aspect-[4/5] mx-auto shadow-xs overflow-hidden">
                                      <img
                                        src={getLocalPhotoUrl(t.photoUrl, t.role || t.name)}
                                        alt={t.name}
                                        className="w-full h-full object-cover object-top rounded-lg bg-sky-100 shadow-inner"
                                      />
                                    </div>
                                    <div className="flex flex-col items-center justify-center space-y-0.5">
                                      <span className="px-1.5 py-0.5 bg-slate-900 text-white text-[9px] sm:text-[10px] font-black rounded-full inline-block whitespace-nowrap">
                                        {t.subject || t.subjectTaught || 'Guru Mapel'}
                                      </span>
                                      <h5 className="font-extrabold text-slate-950 text-[10px] sm:text-[11px] leading-tight group-hover:text-sky-900 transition line-clamp-2 mt-0.5">{t.name}</h5>
                                      <p className="text-[8px] sm:text-[9px] text-slate-800 font-medium truncate max-w-full">{t.role}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* LEVEL 5: STAF TATA USAHA & OPERASIONAL (BAGIAN BAWAH) */}
                          {tuStaff.length > 0 && (
                            <div className="space-y-3 pt-4 border-t-2 border-slate-900">
                              <div className="text-center">
                                <span className="px-3.5 py-1 bg-amber-400 text-slate-950 text-[10px] font-black rounded-full uppercase shadow-xs">
                                  STAF TATA USAHA & OPERASIONAL SEKOLAH (BAGIAN BAWAH)
                                </span>
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3 w-full">
                                {tuStaff.map((t) => (
                                  <div
                                    key={t.id}
                                    className="bg-[#87CEFA] p-2 sm:p-2.5 rounded-2xl border border-sky-400/80 hover:border-slate-900 transition text-center space-y-1.5 group shadow-md flex flex-col justify-between text-slate-950"
                                  >
                                    <div className="p-0.5 bg-white/60 rounded-xl w-full aspect-[4/5] mx-auto shadow-xs overflow-hidden">
                                      <img
                                        src={getLocalPhotoUrl(t.photoUrl, t.role || t.name)}
                                        alt={t.name}
                                        className="w-full h-full object-cover object-top rounded-lg bg-sky-100 shadow-inner"
                                      />
                                    </div>
                                    <div className="flex flex-col items-center justify-center space-y-0.5">
                                      <span className="px-1.5 py-0.5 bg-slate-900 text-white text-[9px] sm:text-[10px] font-black rounded-full inline-block whitespace-nowrap">
                                        {t.role || 'Staf TU'}
                                      </span>
                                      <h5 className="font-extrabold text-slate-950 text-[10px] sm:text-[11px] leading-tight group-hover:text-sky-900 transition line-clamp-2 mt-0.5">{t.name}</h5>
                                      <p className="text-[8px] sm:text-[9px] text-slate-800 font-medium truncate max-w-full">Staf Tata Usaha</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* DISPLAY MODE 2: INTERACTIVE GRID CARD VIEW */}
                      {orgViewMode === 'GRID' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          {filteredTeachers.map((t) => (
                            <div
                              key={t.id}
                              className="bg-[#87CEFA] p-5 rounded-2xl border border-sky-400/80 shadow-md hover:border-slate-900 transition flex flex-col justify-between space-y-3 group text-slate-950"
                            >
                              <div className="space-y-3 text-center">
                                <div className="p-0.5 bg-white/60 rounded-2xl w-32 aspect-[4/5] mx-auto shadow-xs overflow-hidden">
                                  <img
                                    src={getLocalPhotoUrl(t.photoUrl, t.role || t.name)}
                                    alt={t.name}
                                    className="w-full h-full object-cover object-top rounded-xl bg-sky-100 shadow-inner"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <span className="px-2.5 py-0.5 bg-slate-900 text-white text-[9px] font-black rounded-full uppercase shadow-xs">
                                    {(t.assignedRombel || t.classAssigned) ? `Wali ${t.assignedRombel || t.classAssigned}` : t.role}
                                  </span>
                                  <h4 className="font-extrabold text-slate-950 text-xs group-hover:text-sky-900 transition">{t.name}</h4>
                                  <p className="text-[11px] text-slate-800 font-semibold">{t.subject || t.role}</p>
                                  <p className="text-[10px] text-slate-700 font-mono">{t.nipOrNipy}</p>
                                </div>
                              </div>

                              <div className="pt-3 border-t border-sky-400/60 space-y-1 text-[10px]">
                                <div className="flex items-center justify-between text-slate-800">
                                  <span className="text-slate-700 font-semibold">Pendidikan:</span>
                                  <span className="font-bold text-slate-950">{t.education || 'S1 Pendidikan'}</span>
                                </div>
                                {t.phone && (
                                  <div className="flex items-center justify-between text-slate-800">
                                    <span className="text-slate-700 font-semibold">No. Kontak:</span>
                                    <span className="font-mono text-slate-950">{t.phone}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              // 4. VISION & MISSION SECTION
              if (sec.id === 'vision_mission') {
                return renderDraggableSection(
                  sec,
                  secIdx,
                  <div key={sec.id} className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-[#00A3DA] text-white rounded-3xl p-8 shadow-md grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-sky-300/60">
                      <div className="lg:col-span-5 space-y-4">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/20 text-white text-xs font-black rounded-full uppercase tracking-wider shadow-xs border border-white/30">
                          <Building className="w-3.5 h-3.5 text-white" /> VISI UTAMA YAYASAN
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black text-white">{sec.title}</h3>
                        <p className="text-sm sm:text-base text-white leading-relaxed bg-cyan-950/60 p-5 rounded-2xl border border-sky-200/40 italic font-serif">
                          "{visionMission?.vision || 'Menjadi lembaga pendidikan terkemuka berakhlak mulia.'}"
                        </p>
                      </div>

                      <div className="lg:col-span-7 space-y-4">
                        <h4 className="text-xs font-black uppercase text-sky-100 tracking-widest border-b border-sky-300/50 pb-2">
                          MISI STRATEGIS SEKOLAH INTERNASIONAL
                        </h4>
                        <div className="space-y-2.5">
                          {(visionMission?.mission || []).map((m, idx) => (
                            <div key={idx} className="flex items-start gap-3 bg-cyan-950/60 p-3.5 rounded-2xl border border-sky-200/40 hover:border-white transition">
                              <div className="w-7 h-7 rounded-xl bg-white text-cyan-950 font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                                {idx + 1}
                              </div>
                              <p className="text-sm text-white leading-relaxed pt-0.5">{m}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              // 5. PARENT E-RAPORT QUICK SEARCH
              if (sec.id === 'e_raport') {
                return renderDraggableSection(
                  sec,
                  secIdx,
                  <div key={sec.id} className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-[#0000FF] p-6 sm:p-8 rounded-3xl border border-blue-400/60 shadow-md space-y-5 text-white">
                      <div className="flex items-center gap-3 border-b border-blue-400/50 pb-4">
                        <div className="p-3 bg-white/20 text-white rounded-2xl shrink-0 shadow-xs">
                          <Search className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-white text-lg">{sec.title}</h3>
                          <p className="text-xs text-blue-100">
                            Cek Hasil E-Raport Digital & Status Pembayaran SPP Bulanan berdasarkan Nama Siswa atau NISN Rombel.
                          </p>
                        </div>
                      </div>

                      <form onSubmit={handleParentSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-blue-900/80 p-3.5 rounded-2xl border border-blue-400/50">
                        <div className="sm:col-span-5">
                          <input
                            type="text"
                            value={searchStudentName}
                            onChange={(e) => setSearchStudentName(e.target.value)}
                            placeholder="Ketik Nama Siswa (Contoh: Ahmad Rizky)..."
                            className="w-full bg-white border border-blue-300 text-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-white placeholder-slate-400"
                          />
                        </div>
                        <div className="sm:col-span-4">
                          <select
                            value={searchStudentClass}
                            onChange={(e) => setSearchStudentClass(e.target.value)}
                            className="w-full bg-white border border-blue-300 text-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-white"
                          >
                            <option value="SEMUA">-- Semua Kelas / Rombel --</option>
                            <option value="Kelas 1">Kelas 1</option>
                            <option value="Kelas 2">Kelas 2</option>
                            <option value="Kelas 3">Kelas 3</option>
                            <option value="Kelas 4">Kelas 4</option>
                            <option value="Kelas 5">Kelas 5</option>
                            <option value="Kelas 6">Kelas 6</option>
                          </select>
                        </div>
                        <div className="sm:col-span-3">
                          <button
                            type="submit"
                            className="w-full py-2.5 bg-white text-blue-900 hover:bg-blue-100 rounded-xl text-xs font-black shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0 transition"
                          >
                            <Search className="w-4 h-4" />
                            <span>Cari Data Siswa</span>
                          </button>
                        </div>
                      </form>

                      {/* Parent Search Results */}
                      {hasSearched && (
                        <div className="pt-2">
                          {!searchedStudent && !searchedRaport ? (
                            <div className="p-4 bg-amber-100 border border-amber-300 rounded-2xl text-amber-950 text-xs flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-700" />
                              <span>Data NISN / Nama siswa tidak ditemukan. Silakan hubungi Wali Kelas Rombel.</span>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Student SPP Card */}
                              {searchedStudent && (
                                <div className="p-5 bg-blue-900/90 border border-blue-400/60 rounded-2xl space-y-2 text-white">
                                  <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-blue-200 uppercase">Status SPP Siswa</span>
                                    <span
                                      className={`text-[10px] font-bold px-3 py-0.5 rounded-full ${
                                        searchedStudent.sppStatus === 'LUNAS'
                                          ? 'bg-white/20 text-white border border-white/40'
                                          : 'bg-amber-400 text-slate-900 font-extrabold'
                                      }`}
                                    >
                                      {searchedStudent.sppStatus}
                                    </span>
                                  </div>
                                  <h4 className="font-extrabold text-white text-sm">{searchedStudent.name}</h4>
                                  <p className="text-xs text-blue-100">
                                    NISN: <span className="font-mono font-bold text-white">{searchedStudent.nis}</span> &bull; {searchedStudent.gradeClass}
                                  </p>
                                  <p className="text-xs font-bold text-white">
                                    Nominal SPP: {formatRupiah(searchedStudent.sppAmount)} / bulan
                                  </p>
                                </div>
                              )}

                              {/* Student E-Raport Summary */}
                              {searchedRaport && (
                                <div className="p-5 bg-blue-900/90 border border-blue-400/60 rounded-2xl space-y-2 text-white">
                                  <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-blue-200 uppercase">E-Raport Semester</span>
                                    <span className="text-[10px] font-bold px-3 py-0.5 bg-white/20 text-white rounded-full border border-white/40">
                                      {searchedRaport.status}
                                    </span>
                                  </div>
                                  <h4 className="font-extrabold text-white text-sm">{searchedRaport.studentName}</h4>
                                  <p className="text-xs text-blue-100">T.A: {searchedRaport.academicYear}</p>
                                  <p className="text-xs text-blue-100 font-medium italic">"{searchedRaport.teacherNotes}"</p>
                                  <button
                                    onClick={() => printDocument('printable-raport', `E-Raport ${searchedRaport.studentName}`)}
                                    className="mt-2 w-full py-2 bg-white text-blue-900 hover:bg-blue-100 rounded-xl text-xs font-black shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition"
                                  >
                                    <Printer className="w-3.5 h-3.5" />
                                    <span>Cetak E-Raport Lembar Hasil Belajar</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              // 6. NEWS SECTION
              if (sec.id === 'news') {
                return renderDraggableSection(
                  sec,
                  secIdx,
                  <div key={sec.id} className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    <div className="flex justify-between items-end border-b border-blue-400/50 pb-4">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-100">PUBLIKASI RESMI</span>
                        <h3 className="text-2xl sm:text-3xl font-black text-white">{sec.title}</h3>
                        <p className="text-xs text-blue-100">Kabar agenda internasional, prestasi, dan pengumuman yayasan.</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('berita')}
                        className="text-xs font-bold text-white hover:text-blue-200 flex items-center gap-1 cursor-pointer transition"
                      >
                        <span>Lihat Berita Selengkapnya</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className={`grid ${newsGridClass} gap-6`}>
                      {newsArticles.slice(0, 3).map((item) => (
                        <div key={item.id} className="bg-[#0000FF] rounded-3xl border border-blue-400/60 hover:border-white shadow-md overflow-hidden flex flex-col justify-between transition group text-white">
                          <div>
                            <div className="w-full h-56 overflow-hidden relative rounded-t-3xl">
                              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                            </div>
                            <div className="p-5 space-y-2.5">
                              <span className="text-[10px] font-black px-2.5 py-0.5 bg-white/20 text-white rounded-md border border-white/30 uppercase">
                                {item.category}
                              </span>
                              <h4 className="font-extrabold text-white text-sm line-clamp-2 leading-snug group-hover:text-blue-200 transition">{item.title}</h4>
                              <p className="text-xs text-blue-100 line-clamp-2 leading-relaxed">{item.excerpt}</p>
                            </div>
                          </div>
                          <div className="p-5 pt-0 text-[10px] text-blue-200 font-mono flex items-center justify-between border-t border-blue-400/40 mt-2">
                            <span>{formatDateIndonesian(item.date)}</span>
                            <span className="text-white font-bold group-hover:translate-x-1 transition flex items-center gap-1">
                              Baca <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              // 7. GALLERY SECTION
              if (sec.id === 'gallery') {
                return renderDraggableSection(
                  sec,
                  secIdx,
                  <div key={sec.id} className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    <div className="flex justify-between items-end border-b border-blue-400/50 pb-4">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-100">DOKUMENTASI DIPLOMASI & KEGIATAN</span>
                        <h3 className="text-2xl sm:text-3xl font-black text-white">{sec.title}</h3>
                        <p className="text-xs text-blue-100">Aktivitas belajar Rombel, sarana kampus modern, dan ajang internasional.</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('galeri')}
                        className="text-xs font-bold text-white hover:text-blue-200 flex items-center gap-1 cursor-pointer transition"
                      >
                        <span>Buka Galeri Utama</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className={`grid ${galleryGridClass} gap-4`}>
                      {galleryItems.slice(0, 6).map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setSelectedGalleryItem(item)}
                          className="relative group overflow-hidden bg-[#0000FF] rounded-2xl shadow-md border border-blue-400/60 hover:border-white cursor-pointer transition flex flex-col justify-between"
                        >
                          {isYouTubeUrl(item.url) ? (
                            <div className="w-full h-52 bg-slate-900 relative overflow-hidden flex items-center justify-center group/vid">
                              <iframe
                                src={getYoutubeEmbedUrl(item.url)}
                                title={item.title}
                                className="w-full h-full border-0 pointer-events-none opacity-80"
                              />
                              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center group-hover/vid:bg-black/20 transition">
                                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md group-hover/vid:scale-110 transition">
                                  <PlayCircle className="w-7 h-7 fill-white text-blue-600" />
                                </div>
                                <span className="text-[10px] font-extrabold text-amber-300 mt-1 uppercase tracking-wider">Putar YouTube</span>
                              </div>
                            </div>
                          ) : isGoogleDriveUrl(item.url) ? (
                            <div className="w-full h-52 bg-slate-900 relative overflow-hidden flex items-center justify-center group/vid">
                              <iframe
                                src={getGoogleDriveEmbedUrl(item.url)}
                                title={item.title}
                                className="w-full h-full border-0 pointer-events-none opacity-80"
                              />
                              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center group-hover/vid:bg-black/20 transition">
                                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md group-hover/vid:scale-110 transition">
                                  <PlayCircle className="w-7 h-7 fill-white text-blue-600" />
                                </div>
                                <span className="text-[10px] font-extrabold text-amber-300 mt-1 uppercase tracking-wider">Putar Google Drive</span>
                              </div>
                            </div>
                          ) : (item.type === 'video' || isMediaVideo(item.url) || (item as any).mediaType === 'video') ? (
                            <div className="w-full h-52 bg-slate-900 relative overflow-hidden flex items-center justify-center group/vid cursor-pointer" onClick={() => setSelectedGalleryItem(item)}>
                              <video
                                src={item.url}
                                muted
                                playsInline
                                preload="metadata"
                                className="w-full h-full object-cover opacity-85"
                              />
                              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center group-hover/vid:bg-black/20 transition">
                                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md group-hover/vid:scale-110 transition">
                                  <PlayCircle className="w-7 h-7 fill-white text-blue-600" />
                                </div>
                                <span className="text-[10px] font-extrabold text-amber-300 mt-1 uppercase tracking-wider">Putar Video</span>
                              </div>
                            </div>
                          ) : (
                            <div className="w-full h-56 overflow-hidden relative">
                              <img
                                src={item.url}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 p-4 flex flex-col justify-end text-white">
                            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wide">{item.category}</span>
                            <h4 className="font-extrabold text-xs line-clamp-1 text-white">{item.title}</h4>
                            <p className="text-[10px] text-blue-200 line-clamp-1">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              // 8. ACHIEVEMENTS SECTION
              if (sec.id === 'achievements') {
                return renderDraggableSection(
                  sec,
                  secIdx,
                  <div key={sec.id} className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    <div className="text-center space-y-2">
                      <span className="px-3.5 py-1 bg-white/20 text-white border border-white/40 text-xs font-black rounded-full uppercase">
                        REKAM JEJAK KEJUARAAN GLOBAL
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black text-white">{sec.title}</h3>
                      <p className="text-xs text-blue-100 max-w-xl mx-auto">Kebanggaan sekolah atas medali dan gelar juara internasional & nasional yang diraih para siswa Rombel.</p>
                    </div>

                    <div className={`grid ${achievementGridClass} gap-6`}>
                      {achievements.map((ach) => (
                        <div key={ach.id} className="bg-[#0000FF] rounded-3xl border border-blue-400/60 hover:border-white shadow-md overflow-hidden flex flex-col justify-between transition-all duration-300 group hover:-translate-y-0.5 text-white">
                          <div
                            className="w-full h-56 sm:h-64 bg-blue-900 overflow-hidden relative cursor-pointer group/img"
                            onClick={() => {
                              setSelectedGalleryItem({
                                id: ach.id,
                                title: `${ach.achievementTitle} - ${ach.competitionName}`,
                                description: `Siswa: ${ach.studentName} (${ach.gradeClass}) - Tingkat ${ach.level}`,
                                url: ach.photoUrl || 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=1200&q=80',
                                category: 'Prestasi Siswa',
                              });
                            }}
                          >
                            <img
                              src={ach.photoUrl || 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=1200&q=80'}
                              alt={ach.studentName}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60"></div>
                            <div className="absolute top-3 right-3 px-3 py-1.5 bg-white/90 text-slate-800 rounded-xl text-[11px] font-bold opacity-0 group-hover/img:opacity-100 transition flex items-center gap-1.5 shadow-xs border border-blue-200">
                              <Eye className="w-3.5 h-3.5 text-blue-700" />
                              <span>Lihat Foto Full</span>
                            </div>
                          </div>

                          <div className="p-5 space-y-2.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-black px-2.5 py-0.5 bg-white/20 text-white rounded-md uppercase border border-white/30">
                                Tingkat {ach.level}
                              </span>
                              <button
                                onClick={() => {
                                  setSelectedGalleryItem({
                                    id: ach.id,
                                    title: `${ach.achievementTitle} - ${ach.competitionName}`,
                                    description: `Siswa: ${ach.studentName} (${ach.gradeClass}) - Tingkat ${ach.level}`,
                                    url: ach.photoUrl || 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=1200&q=80',
                                    category: 'Prestasi Siswa',
                                  });
                                }}
                                className="text-[11px] font-bold text-white hover:text-blue-200 flex items-center gap-1 cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Foto Full</span>
                              </button>
                            </div>
                            <h4 className="font-extrabold text-white text-sm leading-snug">{ach.achievementTitle}</h4>
                            <p className="text-xs font-bold text-blue-100">{ach.competitionName}</p>
                            <p className="text-xs text-blue-100">
                              Siswa: <span className="font-bold text-white">{ach.studentName}</span> ({ach.gradeClass})
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-center pt-2">
                      <button
                        onClick={() => setActiveTab('prestasi')}
                        className="px-6 py-3 bg-white text-blue-900 hover:bg-blue-100 font-black text-xs rounded-2xl shadow-xs transition cursor-pointer hover:scale-105 inline-flex items-center gap-2"
                      >
                        <Award className="w-4 h-4 text-blue-900" />
                        <span>Buka Halaman Prestasi Sekolah & Medali Lengkap</span>
                        <ChevronRight className="w-4 h-4 text-blue-900" />
                      </button>
                    </div>
                  </div>
                );
              }

              // 9. FOUNDATION PROFILE SECTION
              if (sec.id === 'foundation_profile') {
                return renderDraggableSection(
                  sec,
                  secIdx,
                  <div key={sec.id} className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-[#0000FF] p-8 rounded-3xl border border-blue-400/60 shadow-md grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-white">
                      <div className="p-0.5 bg-blue-300/40 rounded-2xl shadow-xs">
                        <img
                          src={foundationProfile.buildingPhotoUrl || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1000&q=80'}
                          alt="Gedung Kampus"
                          className={`w-full h-72 ${getPhotoClasses()} rounded-xl`}
                        />
                      </div>
                      <div className="space-y-4">
                        <span className="px-3.5 py-1 bg-white/20 text-white text-xs font-black rounded-full uppercase border border-white/30">
                          {sec.title}
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-black text-white">{foundationProfile.name}</h3>
                        <p className="text-xs text-blue-100 leading-relaxed font-normal">
                          Menyelenggarakan pendidikan formal berstandar internasional dari jenjang Sekolah Dasar hingga menengah, dilengkapi akreditasi unggul, fasilitas sarana modern, serta tata kelola keuangan ISAK 35 terpercaya.
                        </p>
                        <button
                          onClick={() => setActiveTab('tentang')}
                          className="px-6 py-3 bg-white text-blue-900 hover:bg-blue-100 font-black text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition"
                        >
                          <span>Selengkapnya Tentang Sekolah</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              // 10. CONTACT SECTION
              if (sec.id === 'contact') {
                return renderDraggableSection(
                  sec,
                  secIdx,
                  <div key={sec.id} className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-[#0000FF] text-white p-8 rounded-3xl shadow-md flex flex-col md:flex-row items-center justify-between gap-6 border border-blue-400/60">
                      <div className="space-y-2">
                        <span className="px-3 py-0.5 bg-white/20 text-white text-[10px] font-black rounded-full border border-white/30 uppercase tracking-widest">LAYANAN INFORMASI PPDB & AKADEMIK</span>
                        <h3 className="text-2xl sm:text-3xl font-black text-white">{sec.title}</h3>
                        <p className="text-xs text-blue-100">
                          Hubungi Layanan Pendaftaran Siswa Baru (PPDB), Informasi E-Raport, atau Keuangan SPP.
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTab('kontak')}
                        className="px-6 py-3 bg-white text-blue-900 hover:bg-blue-100 font-black text-xs rounded-2xl shadow-xs flex items-center gap-2 cursor-pointer shrink-0 transition"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Kirim Pesan / Hubungi Kami</span>
                      </button>
                    </div>
                  </div>
                );
              }

              return null;
            })}
          </div>
        )}

        {/* ==================== TENTANG KAMI PAGE ==================== */}
        {activeTab === 'tentang' && (
          <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
            <div className="text-center space-y-3">
              <span className="px-4 py-1.5 bg-emerald-100 text-emerald-900 text-xs font-black rounded-full uppercase border border-emerald-300 tracking-wider">
                PROFIL YAYASAN PENDIDIKAN INTERNASIONAL
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-emerald-950">{foundationProfile.aboutTitle || foundationProfile.name}</h2>
              {foundationProfile.aboutSubtitle && (
                <p className="text-sm font-bold text-emerald-800 max-w-2xl mx-auto">
                  {foundationProfile.aboutSubtitle}
                </p>
              )}
              <p className="text-xs text-slate-500 max-w-2xl mx-auto font-mono">
                Pengesahan Kemenkumham: {foundationProfile.legalNumber}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-[#0000FF] p-8 rounded-3xl border border-blue-400/60 shadow-md text-white">
              <div className="p-0.5 bg-blue-300/40 rounded-2xl shadow-xs">
                <img
                  src={foundationProfile.buildingPhotoUrl || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1000&q=80'}
                  alt="Gedung Sekolah"
                  className={`w-full h-80 ${getPhotoClasses()} rounded-xl`}
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-black text-white">Sejarah & Filosofi Pendirian</h3>
                <p className="text-xs text-blue-100 leading-relaxed whitespace-pre-line">
                  {foundationProfile.aboutHistory ||
                    'Yayasan Pendidikan Daarul Habibah didirikan untuk memberikan pendidikan berkualitas tinggi berstandar internasional berbasis nilai-nilai keislaman dan kebudayaan nasional. Sekolah mengelola Rombongan Belajar (Rombel) dari Kelas 1 hingga Kelas 6 dengan ruang kelas modern ber-AC, perpustakaan digital, serta laboratorium sains & komputer.'}
                </p>
                {foundationProfile.aboutDescription && (
                  <p className="text-xs text-white font-medium bg-blue-900/80 p-4 rounded-2xl border border-blue-400/50 leading-relaxed italic">
                    {foundationProfile.aboutDescription}
                  </p>
                )}
                <div className="p-4 bg-blue-900/80 rounded-2xl border border-blue-400/50 shadow-inner space-y-2 text-xs text-white">
                  <div className="flex items-center gap-2 text-blue-100">
                    <MapPin className="w-4 h-4 text-blue-300 shrink-0" />
                    <span>{foundationProfile.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-100">
                    <Phone className="w-4 h-4 text-blue-300 shrink-0" />
                    <span>{foundationProfile.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-100">
                    <Mail className="w-4 h-4 text-blue-300 shrink-0" />
                    <span>{foundationProfile.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Visi & Misi Ringkas di Halaman Tentang */}
            <div className="bg-[#00A3DA] text-white rounded-3xl p-8 shadow-md grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-sky-300/60">
              <div className="lg:col-span-5 space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/20 text-white text-xs font-black rounded-full border border-white/30">
                  <Building className="w-3.5 h-3.5 text-sky-100" /> VISI UTAMA YAYASAN
                </div>
                <h3 className="text-2xl font-black text-white">Visi Strategis</h3>
                <p className="text-sm sm:text-base text-sky-50 leading-relaxed bg-cyan-950/60 p-4 rounded-2xl border border-sky-200/40 italic font-serif">
                  "{visionMission?.vision || 'Menjadi lembaga pendidikan terkemuka berakhlak mulia.'}"
                </p>
              </div>

              <div className="lg:col-span-7 space-y-3">
                <h4 className="text-xs font-black uppercase text-sky-100 tracking-widest border-b border-sky-300/40 pb-2">
                  MISI STRATEGIS SEKOLAH
                </h4>
                <div className="space-y-2">
                  {(visionMission?.mission || []).map((m, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-cyan-950/60 p-3.5 rounded-2xl border border-sky-200/40">
                      <div className="w-6 h-6 rounded-lg bg-white text-cyan-950 font-black text-xs flex items-center justify-center shrink-0 font-bold">
                        {idx + 1}
                      </div>
                      <p className="text-sm text-sky-50 leading-relaxed">{m}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* PIDATO & FOTO PIMPINAN YAYASAN */}
            <div className="bg-[#0000FF] p-8 sm:p-10 rounded-3xl border border-blue-400/60 shadow-md space-y-6 text-white">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-blue-400/40 pb-4">
                <div className="space-y-1">
                  <span className="px-3.5 py-1 bg-white/20 text-white text-xs font-black rounded-full uppercase border border-white/30">
                    PIDATO & AMANAT STRATEGIS PIMPINAN YAYASAN
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {foundationProfile.leaderSpeechTitle || 'Pidato Amanat Pimpinan: Arah Kebijakan Pendidikan, Transformasi Digital & Pembentukan Karakter Rabbani'}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    const speechText = `${foundationProfile.leaderSpeechTitle || 'Pidato Amanat Pimpinan'}\n\n${foundationProfile.leaderSpeechContent || ''}`;
                    navigator.clipboard.writeText(speechText);
                    setSpeechCopied(true);
                    setTimeout(() => setSpeechCopied(false), 3000);
                  }}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-xl border border-white/40 flex items-center gap-2 transition shrink-0 cursor-pointer"
                >
                  {speechCopied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4 text-white" />}
                  <span>{speechCopied ? 'Tersalin ke Clipboard!' : 'Salin Teks Pidato'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Foto Pimpinan Card */}
                <div className="lg:col-span-4 bg-blue-900/80 p-6 rounded-2xl border border-blue-400/50 shadow-md text-center space-y-4">
                  <div className="p-1 bg-white/90 rounded-2xl w-48 sm:w-56 lg:w-60 aspect-[4/5] mx-auto shadow-xl ring-2 ring-blue-300/80 overflow-hidden relative">
                    <img
                      src={getLocalPhotoUrl(foundationProfile.leaderPhotoUrl || foundationProfile.orgStructure?.find(m => m.position.includes('Ketua'))?.photoUrl, 'Ketua Yayasan')}
                      alt="Ketua Yayasan"
                      className="w-full h-full object-cover object-top rounded-xl bg-white shadow-inner"
                    />
                    <span className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-slate-900/90 text-white text-[10px] font-extrabold rounded-full border border-white/40 whitespace-nowrap shadow-md">
                      Pasfoto Resmi 4x5 cm
                    </span>
                  </div>
                  <div>
                    <span className="px-3 py-0.5 bg-white/20 text-white text-[10px] font-black rounded-full uppercase border border-white/30">
                      Ketua Yayasan
                    </span>
                    <h4 className="font-extrabold text-white text-base mt-1.5">{foundationProfile.leaderName || 'H. Ahmad Dahlan, M.Ag'}</h4>
                    <p className="text-xs text-blue-200 font-bold">{foundationProfile.leaderTitle || 'Ketua Yayasan'}</p>
                    <p className="text-[10px] text-blue-200 font-mono mt-1">{foundationProfile.leaderNip || 'NIPY. 20120502'}</p>
                  </div>
                  <div className="pt-3 border-t border-blue-400/40 text-left space-y-2 text-[11px] text-blue-100">
                    <div className="flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-blue-300 shrink-0" />
                      <span>Akreditasi Unggul Yayasan</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-blue-300 shrink-0" />
                      <span>Pendidikan Karakter & ISAK 35</span>
                    </div>
                  </div>
                </div>

                {/* Teks Isi Pidato Amanat Pimpinan */}
                <div className="lg:col-span-8 space-y-4 text-sm sm:text-base text-white leading-relaxed bg-blue-900/80 p-6 rounded-2xl border border-blue-400/50 shadow-inner">
                  <div className="flex items-center gap-2 text-white font-serif text-base font-bold border-b border-blue-400/40 pb-2">
                    <Quote className="w-5 h-5 text-blue-300 shrink-0" />
                    <span>Naskah Pidato Amanat & Arahan Strategis Pimpinan:</span>
                  </div>

                  <div className="space-y-3.5 font-serif leading-loose text-blue-100 text-sm sm:text-base whitespace-pre-line">
                    {foundationProfile.leaderSpeechContent || (
                      <>
                        <p>Bismillahirahmanirrahim. Assalamu'alaikum Warahmatullahi Wabarakatuh.</p>
                        <p>
                          Puji dan syukur senantiasa kita panjatkan ke hadirat Allah SWT atas limpahan rahmat dan hidayah-Nya. Shalawat serta salam semoga tercurahkan kepada Uswah Hasanah kita, Nabi Muhammad SAW.
                        </p>
                        <p>
                          Lembaga pendidikan bukan sekadar tempat mentransfer ilmu pengetahuan, melainkan kawah candradimuka dalam membentuk watak, adab, dan integritas kepemimpinan masa depan. Di tengah pesatnya perkembangan arus digitalisasi dan kecerdasan buatan (AI), Yayasan Pendidikan Daarul Habibah berdiri kokoh memadukan kurikulum nasional yang adaptif dengan pondasi tauhid yang tangguh.
                        </p>
                        <p className="font-semibold text-white">
                          Dalam mewujudkan visi strategis ini, yayasan menerapkan 4 Pilar Keunggulan Utama:
                        </p>
                        <ol className="list-decimal list-inside space-y-2 text-blue-100 text-sm sm:text-base pl-2">
                          <li><strong className="text-white">Penguatan Aqidah dan Akhlakul Karimah:</strong> Menjadikan Al-Qur'an dan Sunnah sebagai kompas moral peserta didik melalui program Tahfidz dan Budaya 5S.</li>
                          <li><strong className="text-white">Keunggulan Akademik & Digital Literacy:</strong> Menyelenggarakan pembelajaran Rombel berbasis ruang kelas digital dan E-Raport real-time.</li>
                          <li><strong className="text-white">Tata Kelola Keuangan ISAK 35:</strong> Mengelola seluruh dana SPP dan Dana BOS dengan transparansi publik terintegrasi.</li>
                          <li><strong className="text-white">Sinergi Sekolah & Wali Murid:</strong> Membuka portal interaktif demi perkembangan holistik anak.</li>
                        </ol>
                        <p>
                          Kami mengajak seluruh bapak/ibu orang tua murid dan pemangku kepentingan untuk terus bergandengan tangan, mendukung putra-putri kita agar tumbuh menjadi pribadi yang berilmu, berakhlak mulia, dan siap memimpin peradaban.
                        </p>
                        <p>Wassalamu'alaikum Warahmatullahi Wabarakatuh.</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Struktur Organisasi Section */}
            {foundationProfile.orgStructure && foundationProfile.orgStructure.length > 0 && (
              <div className="pt-8 border-t border-blue-400/40 space-y-6">
                <div className="text-center space-y-2">
                  <span className="px-4 py-1.5 bg-white/20 text-white text-xs font-black rounded-full uppercase border border-white/30">
                    JAJARAN PENGURUS & PIMPINAN
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">Struktur Organisasi Yayasan</h3>
                  <p className="text-xs text-blue-100 max-w-xl mx-auto">
                    Susunan kepengurusan Pengurus Pembina Yayasan dan Pimpinan Kepala Sekolah / Rombel secara transparan dan terakreditasi.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
                  {foundationProfile.orgStructure.map((member) => (
                    <div
                      key={member.id}
                      className="bg-[#87CEFA] p-4 sm:p-6 rounded-3xl border border-sky-300 hover:border-slate-800 shadow-md transition flex flex-col items-center text-center space-y-3 group text-slate-950"
                    >
                      <div className="p-1 bg-white/80 rounded-2xl shadow-md w-36 sm:w-44 md:w-48 aspect-[4/5] overflow-hidden ring-2 ring-slate-800/20 relative">
                        <img
                          src={getLocalPhotoUrl(member.photoUrl, member.position || member.name)}
                          alt={member.name}
                          className={`w-full h-full object-cover object-top ${getPhotoClasses()} rounded-xl bg-sky-100 shadow-inner`}
                        />
                        <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-slate-900/85 text-white text-[9px] font-extrabold rounded-full border border-white/40 whitespace-nowrap shadow-xs">
                          Pasfoto 4x5 cm
                        </span>
                      </div>
                      <div className="space-y-1 w-full">
                        <span className={`px-3 py-0.5 text-[10px] font-black rounded-full uppercase shadow-xs ${
                          member.category === 'YAYASAN' ? 'bg-slate-900 text-white' : 'bg-slate-800 text-sky-100'
                        }`}>
                          {member.category === 'YAYASAN' ? 'Pengurus Yayasan' : 'Pimpinan Sekolah'}
                        </span>
                        <h4 className="font-extrabold text-slate-950 text-xs sm:text-sm mt-1.5 group-hover:text-sky-900 transition line-clamp-2">{member.name}</h4>
                        <p className="text-[11px] sm:text-xs font-bold text-sky-900">{member.position}</p>
                        {member.nipOrNipy && <p className="text-[10px] sm:text-[11px] text-slate-700 font-mono">{member.nipOrNipy}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== PPDB PAGE ==================== */}
        {activeTab === 'ppdb' && (
          <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
            {/* Header Banner */}
            <div className="bg-[#0095D9] rounded-3xl text-white p-8 sm:p-10 shadow-md border border-sky-300/50 relative overflow-hidden">
              <div className="max-w-3xl space-y-3 relative z-10">
                <span className="bg-amber-400 text-slate-950 font-black text-xs px-3.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                  Penerimaan Peserta Didik Baru (PPDB) T.A 2026/2027
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-white">
                  Pendaftaran Online Terpadu Sekolah & Rombel
                </h1>
                <p className="text-xs sm:text-sm text-sky-100 leading-relaxed">
                  Selamat datang calon peserta didik dan santri baru! Mari bergabung bersama {foundationProfile.name} untuk mewujudkan generasi Rabbani, berilmu luas, dan unggul dalam teknologi.
                </p>
              </div>
            </div>

            {/* PPDB Subtabs Navigation */}
            <div className="flex flex-wrap items-center gap-2 border-b border-white/30 pb-4">
              <button
                type="button"
                onClick={() => setPpdbSubTab('pendaftaran')}
                className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition cursor-pointer flex items-center gap-2 ${
                  ppdbSubTab === 'pendaftaran'
                    ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                    : 'bg-[#0095D9] text-white hover:bg-sky-600 border border-sky-300/40'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>1. Form Pendaftaran Online</span>
              </button>

              <button
                type="button"
                onClick={() => setPpdbSubTab('status')}
                className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition cursor-pointer flex items-center gap-2 ${
                  ppdbSubTab === 'status'
                    ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                    : 'bg-[#0095D9] text-white hover:bg-sky-600 border border-sky-300/40'
                }`}
              >
                <Search className="w-4 h-4" />
                <span>2. Cek Status Pendaftaran</span>
              </button>

              <button
                type="button"
                onClick={() => setPpdbSubTab('biaya')}
                className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition cursor-pointer flex items-center gap-2 ${
                  ppdbSubTab === 'biaya'
                    ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                    : 'bg-[#0095D9] text-white hover:bg-sky-600 border border-sky-300/40'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>3. Rincian Biaya & Beasiswa</span>
              </button>
            </div>

            {/* SUBTAB 1: FORM PENDAFTARAN */}
            {ppdbSubTab === 'pendaftaran' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                {submittedRegNo ? (
                  <div className="bg-[#0095D9] border border-sky-300/50 rounded-3xl p-8 text-center space-y-4 shadow-md max-w-2xl mx-auto text-white">
                    <div className="w-16 h-16 bg-amber-400 text-slate-950 rounded-full mx-auto flex items-center justify-center font-black text-3xl shadow-xs">
                      ✓
                    </div>
                    <h2 className="text-2xl font-black text-white">Pendaftaran Berhasil Dikirim!</h2>
                    <p className="text-xs sm:text-sm text-sky-100">
                      Nomor Registrasi Resmi Pendaftaran Anda:
                    </p>
                    <div className="inline-block bg-white text-blue-900 text-2xl font-mono font-black px-6 py-2.5 rounded-2xl tracking-widest border border-white shadow-inner">
                      {submittedRegNo}
                    </div>
                    <p className="text-xs text-sky-100 max-w-lg mx-auto leading-relaxed">
                      Simpan nomor pendaftaran ini untuk melakukan verifikasi status berkas, informasi jadwal tes, dan penerbitan bukti kelulusan pada menu Cek Status.
                    </p>
                    <div className="pt-4 flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setSubmittedRegNo(null);
                          setSearchRegNo(submittedRegNo);
                          setPpdbSubTab('status');
                        }}
                        className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-6 py-3 rounded-xl text-xs transition cursor-pointer shadow-md"
                      >
                        Buka Cek Status Pendaftaran
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handlePPDBSubmit} className="bg-[#0095D9] rounded-3xl border border-sky-300/50 p-8 shadow-md space-y-6 text-white">
                    <div className="border-b border-white/30 pb-4">
                      <h2 className="text-xl font-black text-white">Formulir Isian Calon Peserta Didik Baru</h2>
                      <p className="text-xs text-sky-100">
                        Isi data calon siswa secara benar dan lengkap. Field bertanda (*) wajib diisi.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-sky-100 mb-1.5">
                          Nama Lengkap Calon Siswa *
                        </label>
                        <input
                          type="text"
                          required
                          value={ppdbFormData.namaLengkap}
                          onChange={(e) => setPpdbFormData({ ...ppdbFormData, namaLengkap: e.target.value })}
                          placeholder="Nama lengkap sesuai Akta / Ijazah"
                          className="w-full px-4 py-2.5 bg-white border border-sky-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-sky-100 mb-1.5">
                          NISN / NIK Calon Siswa
                        </label>
                        <input
                          type="text"
                          value={ppdbFormData.nisnAsal}
                          onChange={(e) => setPpdbFormData({ ...ppdbFormData, nisnAsal: e.target.value })}
                          placeholder="Contoh: 0012345678"
                          className="w-full px-4 py-2.5 bg-white border border-sky-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-sky-100 mb-1.5">
                          Sekolah Asal (TK/PAUD/SD/SMP)
                        </label>
                        <input
                          type="text"
                          value={ppdbFormData.sekolahAsal}
                          onChange={(e) => setPpdbFormData({ ...ppdbFormData, sekolahAsal: e.target.value })}
                          placeholder="Contoh: TK IT El-Fatah / PAUD Melati"
                          className="w-full px-4 py-2.5 bg-white border border-sky-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-sky-100 mb-1.5">
                          Pilihan Rombel Kelas Target *
                        </label>
                        <select
                          value={ppdbFormData.pilihanJurusanKelas}
                          onChange={(e) => setPpdbFormData({ ...ppdbFormData, pilihanJurusanKelas: e.target.value })}
                          className="w-full px-4 py-2.5 bg-white border border-sky-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-amber-400"
                        >
                          <option value="SDIT - Kelas 1 (Tahfidz & Coding)">SDIT - Kelas 1 (Program Tahfidz & Coding)</option>
                          <option value="SDIT - Kelas 2 s.d 6 (Siswa Pindahan)">SDIT - Kelas 2-6 (Pindahan Rombel)</option>
                          <option value="SMPIT - Kelas 7 (Sains & Tahfidz)">SMPIT - Kelas 7 (Sains & Tahfidz)</option>
                          <option value="SMAIT - Kelas 10 (Peminatan Digital)">SMAIT - Kelas 10 (Peminatan Digital)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-sky-100 mb-1.5">
                          Nama Orang Tua / Wali Murid *
                        </label>
                        <input
                          type="text"
                          required
                          value={ppdbFormData.namaOrangTua}
                          onChange={(e) => setPpdbFormData({ ...ppdbFormData, namaOrangTua: e.target.value })}
                          placeholder="Nama Ayah/Ibu/Wali"
                          className="w-full px-4 py-2.5 bg-white border border-sky-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-sky-100 mb-1.5">
                          No. WhatsApp / HP Aktif *
                        </label>
                        <input
                          type="text"
                          required
                          value={ppdbFormData.noHpOrangTua}
                          onChange={(e) => setPpdbFormData({ ...ppdbFormData, noHpOrangTua: e.target.value })}
                          placeholder="Contoh: 081234567890"
                          className="w-full px-4 py-2.5 bg-white border border-sky-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    {/* Checkbox Berkas */}
                    <div className="pt-4 border-t border-white/30 space-y-2">
                      <label className="block text-xs font-bold text-amber-300">
                        Kelengkapan Berkas Administrasi Fisik / Digital:
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <label className="flex items-center gap-2 p-3 bg-black/20 rounded-xl border border-white/20 text-white cursor-pointer hover:border-white">
                          <input
                            type="checkbox"
                            checked={ppdbFormData.berkas.ijazah}
                            onChange={(e) => setPpdbFormData({ ...ppdbFormData, berkas: { ...ppdbFormData.berkas, ijazah: e.target.checked } })}
                            className="accent-amber-400"
                          />
                          <span>Ijazah / SKL TK</span>
                        </label>
                        <label className="flex items-center gap-2 p-3 bg-black/20 rounded-xl border border-white/20 text-white cursor-pointer hover:border-white">
                          <input
                            type="checkbox"
                            checked={ppdbFormData.berkas.kk}
                            onChange={(e) => setPpdbFormData({ ...ppdbFormData, berkas: { ...ppdbFormData.berkas, kk: e.target.checked } })}
                            className="accent-amber-400"
                          />
                          <span>Kartu Keluarga</span>
                        </label>
                        <label className="flex items-center gap-2 p-3 bg-black/20 rounded-xl border border-white/20 text-white cursor-pointer hover:border-white">
                          <input
                            type="checkbox"
                            checked={ppdbFormData.berkas.akta}
                            onChange={(e) => setPpdbFormData({ ...ppdbFormData, berkas: { ...ppdbFormData.berkas, akta: e.target.checked } })}
                            className="accent-amber-400"
                          />
                          <span>Akta Kelahiran</span>
                        </label>
                        <label className="flex items-center gap-2 p-3 bg-black/20 rounded-xl border border-white/20 text-white cursor-pointer hover:border-white">
                          <input
                            type="checkbox"
                            checked={ppdbFormData.berkas.pasFoto}
                            onChange={(e) => setPpdbFormData({ ...ppdbFormData, berkas: { ...ppdbFormData.berkas, pasFoto: e.target.checked } })}
                            className="accent-amber-400"
                          />
                          <span>Pas Foto 3x4</span>
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-3.5 rounded-2xl text-xs sm:text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Kirim Formulir Pendaftaran PPDB</span>
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* SUBTAB 2: CEK STATUS PENDAFTARAN */}
            {ppdbSubTab === 'status' && (
              <div className="space-y-6 animate-in fade-in duration-300 text-white">
                <div className="bg-[#0095D9] rounded-3xl border border-sky-300/50 p-6 shadow-md space-y-4">
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Search className="w-5 h-5 text-amber-300" />
                    <span>Pencarian Status Verifikasi PPDB</span>
                  </h3>

                  <form onSubmit={handleSearchPPDBStatus} className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={searchRegNo}
                      onChange={(e) => setSearchRegNo(e.target.value)}
                      placeholder="Masukkan Nomor Registrasi (Contoh: PPDB2026001)"
                      className="flex-1 px-4 py-2.5 bg-white border border-sky-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="submit"
                      className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs sm:text-sm cursor-pointer transition shrink-0 shadow-md"
                    >
                      Cari Data Pendaftaran
                    </button>
                  </form>

                  {searchError && (
                    <div className="p-3 bg-rose-500/20 text-rose-100 rounded-xl border border-rose-400/40 text-xs font-semibold">
                      {searchError}
                    </div>
                  )}
                </div>

                {/* Status Card Result */}
                {searchResult && (
                  <div className="bg-[#0095D9] rounded-3xl border border-sky-300/50 p-8 shadow-md space-y-6 text-white">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/30 pb-4">
                      <div>
                        <span className="text-xs text-sky-100 font-medium">Nomor Registrasi Resmi:</span>
                        <h3 className="text-2xl font-black text-amber-300 font-mono">{searchResult.nomorRegistrasi}</h3>
                      </div>

                      <span
                        className={`px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-wider ${
                          searchResult.status === 'Lulus Seleksi'
                            ? 'bg-amber-400 text-slate-950 border border-amber-300'
                            : searchResult.status === 'Berkas Lengkap'
                            ? 'bg-white text-blue-900 font-black'
                            : 'bg-white/20 text-white border border-white/30'
                        }`}
                      >
                        {searchResult.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                      <div className="bg-black/20 p-4 rounded-2xl border border-white/20">
                        <span className="text-sky-100 block mb-1">Nama Calon Siswa:</span>
                        <span className="font-extrabold text-white text-sm">{searchResult.namaLengkap}</span>
                      </div>
                      <div className="bg-black/20 p-4 rounded-2xl border border-white/20">
                        <span className="text-sky-100 block mb-1">Sekolah Asal:</span>
                        <span className="font-bold text-white">{searchResult.sekolahAsal}</span>
                      </div>
                      <div className="bg-black/20 p-4 rounded-2xl border border-white/20">
                        <span className="text-sky-100 block mb-1">Pilihan Rombel Kelas:</span>
                        <span className="font-bold text-amber-300">{searchResult.pilihanJurusanKelas}</span>
                      </div>
                      <div className="bg-black/20 p-4 rounded-2xl border border-white/20">
                        <span className="text-sky-100 block mb-1">Orang Tua / Wali:</span>
                        <span className="font-bold text-white">{searchResult.namaOrangTua}</span>
                      </div>
                      <div className="bg-black/20 p-4 rounded-2xl border border-white/20">
                        <span className="text-sky-100 block mb-1">No. WhatsApp / Kontak:</span>
                        <span className="font-mono text-amber-300 font-bold">{searchResult.noHpOrangTua}</span>
                      </div>
                      <div className="bg-black/20 p-4 rounded-2xl border border-white/20">
                        <span className="text-sky-100 block mb-1">Tanggal Pendaftaran:</span>
                        <span className="font-mono text-white">{searchResult.tanggalDaftar}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUBTAB 3: BIAYA & BEASISWA */}
            {ppdbSubTab === 'biaya' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-300 text-white">
                <div className="bg-[#0095D9] rounded-3xl border border-sky-300/50 p-8 shadow-md space-y-4">
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-300" />
                    <span>Komponen Biaya Pendidikan {activePpdbConfig.academicYear}</span>
                  </h3>

                  <div className="space-y-3 text-xs text-white">
                    {activePpdbConfig.fees.map((fee) => (
                      <div key={fee.id} className="flex items-center justify-between p-3.5 bg-black/20 rounded-xl border border-white/20">
                        <div>
                          <span className="font-bold text-white block">{fee.name}</span>
                          {fee.notes && <span className="text-[10px] text-sky-100 block mt-0.5">{fee.notes}</span>}
                        </div>
                        <span className="font-black text-amber-300 shrink-0 ml-2">{fee.amountText}</span>
                      </div>
                    ))}
                  </div>

                  {activePpdbConfig.infoNote && (
                    <div className="p-3 bg-black/20 border border-white/20 rounded-xl text-[11px] text-sky-100 mt-4">
                      <strong className="text-amber-300">Info Pembayaran:</strong> {activePpdbConfig.infoNote}
                    </div>
                  )}
                </div>

                <div className="bg-[#0095D9] text-white rounded-3xl p-8 border border-sky-300/50 shadow-md space-y-4">
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-amber-300" />
                    <span>Program Beasiswa Unggulan Yayasan</span>
                  </h3>

                  <ul className="space-y-3 text-xs text-white leading-relaxed">
                    {activePpdbConfig.scholarships.map((sch) => (
                      <li key={sch.id} className="flex items-start gap-2.5 bg-black/20 p-3 rounded-xl border border-white/20">
                        <ShieldCheck className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                        <span><strong className="text-amber-300">{sch.title}:</strong> {sch.description}</span>
                      </li>
                    ))}
                  </ul>

                  {activePpdbConfig.contactWhatsapp && (
                    <div className="p-3 bg-black/20 border border-white/20 rounded-xl text-xs text-white mt-4 flex items-center justify-between">
                      <span>Konsultasi Biaya / Beasiswa:</span>
                      <a
                        href={`https://wa.me/${activePpdbConfig.contactWhatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono font-bold text-amber-300 underline hover:text-amber-200"
                      >
                        {activePpdbConfig.contactWhatsapp}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== PRESTASI PAGE ==================== */}
        {activeTab === 'prestasi' && (
          <div className="space-y-12 pb-16">
            {/* Hero Banner Section */}
            <div className="bg-[#0095D9] text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b border-sky-300/50 shadow-md">
              <div className="max-w-[1536px] mx-auto space-y-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto space-y-3">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-amber-400 text-slate-950 text-xs font-black rounded-full uppercase shadow-xs">
                    <Award className="w-4 h-4 text-slate-950" /> ETALASE KEJUARAAN & MEDALI UNGGUL
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                    Prestasi & Rekam Jejak Medali Siswa
                  </h2>
                  <p className="text-sm text-sky-100 leading-relaxed">
                    Apresiasi setinggi-tingginya atas perjuangan para siswa Rombel dalam meraih medali emas, perak, perunggu, serta tropi kejuaraan di tingkat Kabupaten/Kota, Provinsi, Nasional, hingga Internasional.
                  </p>
                </div>

                {/* Stat Counter Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                  <div className="bg-black/20 p-4 rounded-2xl border border-white/20 text-center shadow-xs">
                    <p className="text-3xl font-black text-amber-300">{achievements.length}</p>
                    <p className="text-[11px] font-extrabold text-white uppercase mt-1">Total Prestasi & Medali</p>
                  </div>
                  <div className="bg-black/20 p-4 rounded-2xl border border-white/20 text-center shadow-xs">
                    <p className="text-3xl font-black text-white">
                      {achievements.filter((a) => a.level === 'INTERNASIONAL' || a.level === 'NASIONAL').length}
                    </p>
                    <p className="text-[11px] font-extrabold text-white uppercase mt-1">Tingkat Nasional / Intl</p>
                  </div>
                  <div className="bg-black/20 p-4 rounded-2xl border border-white/20 text-center shadow-xs">
                    <p className="text-3xl font-black text-sky-100">
                      {achievements.filter((a) => a.level === 'PROVINSI').length}
                    </p>
                    <p className="text-[11px] font-extrabold text-white uppercase mt-1">Tingkat Provinsi</p>
                  </div>
                  <div className="bg-black/20 p-4 rounded-2xl border border-white/20 text-center shadow-xs">
                    <p className="text-3xl font-black text-sky-200">
                      {achievements.filter((a) => a.level === 'KABUPATEN').length}
                    </p>
                    <p className="text-[11px] font-extrabold text-white uppercase mt-1">Tingkat Kabupaten/Kota</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter & Content Section */}
            <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              {/* Search & Level Filter Header */}
              <div className="bg-[#0095D9] p-6 rounded-3xl border border-sky-300/50 shadow-md space-y-4 text-white">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-white text-lg flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-300" />
                      <span>Daftar Juara & Medali Terakreditasi</span>
                    </h3>
                    <p className="text-xs text-sky-100">
                      Diinput langsung secara terverifikasi oleh Admin Sekolah & Tim Kesiswaan melalui Portal CMS Internal.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-72">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={achievementSearchQuery}
                        onChange={(e) => setAchievementSearchQuery(e.target.value)}
                        placeholder="Cari nama siswa, ajang, atau medali..."
                        className="w-full pl-9 pr-3 py-2 bg-white text-slate-800 border border-sky-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-400"
                      />
                      {achievementSearchQuery && (
                        <button
                          onClick={() => setAchievementSearchQuery('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        if (onOpenRoleLoginModal) {
                          onOpenRoleLoginModal('KEPALA_SEKOLAH');
                        } else {
                          onOpenInternalPortal('KEPALA_SEKOLAH');
                        }
                      }}
                      className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl shadow-md flex items-center gap-1.5 shrink-0 transition cursor-pointer"
                      title="Akses Admin Sekolah untuk input data prestasi baru"
                    >
                      <Lock className="w-3.5 h-3.5 text-slate-950" />
                      <span className="hidden sm:inline">Input Prestasi (Admin Sekolah)</span>
                    </button>
                  </div>
                </div>

                {/* Level Tabs */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-white/20">
                  {['SEMUA', 'INTERNASIONAL', 'NASIONAL', 'PROVINSI', 'KABUPATEN'].map((lvl) => {
                    const count = lvl === 'SEMUA' ? achievements.length : achievements.filter((a) => a.level === lvl).length;
                    const isActive = achievementFilterLevel === lvl;
                    return (
                      <button
                        key={lvl}
                        onClick={() => setAchievementFilterLevel(lvl)}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
                          isActive
                            ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                            : 'bg-black/20 text-white hover:bg-white/20 border border-white/20'
                        }`}
                      >
                        <span>{lvl === 'SEMUA' ? 'Semua Level' : `Tingkat ${lvl}`}</span>
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-slate-950 text-amber-300 font-black' : 'bg-white/20 text-white'}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Grid of Achievements */}
              {(() => {
                const filtered = achievements.filter((ach) => {
                  const matchLevel = achievementFilterLevel === 'SEMUA' || ach.level === achievementFilterLevel;
                  const q = achievementSearchQuery.trim().toLowerCase();
                  const matchQuery =
                    !q ||
                    ach.studentName.toLowerCase().includes(q) ||
                    ach.competitionName.toLowerCase().includes(q) ||
                    ach.achievementTitle.toLowerCase().includes(q) ||
                    ach.gradeClass.toLowerCase().includes(q);
                  return matchLevel && matchQuery;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="p-12 text-center bg-[#0095D9] text-white border border-sky-300/50 rounded-3xl shadow-md space-y-3 max-w-lg mx-auto">
                      <div className="w-16 h-16 bg-amber-400 text-slate-950 rounded-2xl flex items-center justify-center mx-auto">
                        <Award className="w-8 h-8" />
                      </div>
                      <h4 className="font-extrabold text-white text-base">Tidak Ada Data Prestasi Ditemukan</h4>
                      <p className="text-xs text-sky-100 leading-relaxed">
                        Coba ubah kata kunci pencarian atau pilih filter tingkat kejuaraan yang lain.
                      </p>
                      {(achievementFilterLevel !== 'SEMUA' || achievementSearchQuery) && (
                        <button
                          onClick={() => {
                            setAchievementFilterLevel('SEMUA');
                            setAchievementSearchQuery('');
                          }}
                          className="px-4 py-2 bg-amber-400 text-slate-950 text-xs font-black rounded-xl hover:bg-amber-300 transition shadow-md"
                        >
                          Reset Filter & Pencarian
                        </button>
                      )}
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((ach) => {
                      const defaultImg = 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=1200&q=80';
                      const photo = ach.photoUrl || defaultImg;
                      const isGold = ach.achievementTitle.toLowerCase().includes('emas') || ach.achievementTitle.toLowerCase().includes('juara 1');
                      const isSilver = ach.achievementTitle.toLowerCase().includes('perak') || ach.achievementTitle.toLowerCase().includes('juara 2');
                      const isBronze = ach.achievementTitle.toLowerCase().includes('perunggu') || ach.achievementTitle.toLowerCase().includes('juara 3');

                      return (
                        <div
                          key={ach.id}
                          className="bg-[#0095D9] rounded-3xl border border-sky-300/50 hover:border-white shadow-md overflow-hidden flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1 text-white"
                        >
                          <div>
                            {/* Image Box */}
                            <div
                              className="w-full h-64 sm:h-72 overflow-hidden relative cursor-pointer group/img"
                              onClick={() => {
                                setSelectedGalleryItem({
                                  id: ach.id,
                                  title: `${ach.achievementTitle} - ${ach.competitionName}`,
                                  description: `Siswa: ${ach.studentName} (${ach.gradeClass}) - Tingkat ${ach.level} (${ach.year})`,
                                  url: photo,
                                  category: 'Prestasi Siswa',
                                  type: 'photo',
                                  date: ach.year,
                                });
                              }}
                            >
                              <img
                                src={photo}
                                alt={ach.studentName}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80"></div>

                              {/* Medal / Trophy Badge Overlay */}
                              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-slate-950 rounded-xl text-xs font-black shadow-md border border-amber-300">
                                <Award className={`w-4 h-4 ${isGold ? 'text-slate-950 animate-pulse' : isSilver ? 'text-slate-800' : isBronze ? 'text-amber-900' : 'text-slate-950'}`} />
                                <span>Tingkat {ach.level}</span>
                              </div>

                              <div className="absolute top-3 right-3 px-3 py-1 bg-black/60 text-amber-300 border border-white/20 rounded-xl text-[10px] font-black uppercase shadow-xs">
                                {ach.year}
                              </div>

                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition bg-slate-950/40">
                                <span className="px-3 py-1.5 bg-amber-400 text-slate-950 rounded-xl text-xs font-black shadow-md flex items-center gap-1">
                                  <Eye className="w-4 h-4" /> Lihat Foto Utuh
                                </span>
                              </div>
                            </div>

                            {/* Content Box */}
                            <div className="p-5 space-y-3">
                              <div>
                                <span className="text-[10px] font-black px-2.5 py-0.5 bg-amber-400 text-slate-950 rounded-full uppercase shadow-xs">
                                  {ach.achievementTitle}
                                </span>
                                <h4 className="font-extrabold text-white text-base mt-2 leading-snug group-hover:text-amber-300 transition">
                                  {ach.competitionName}
                                </h4>
                              </div>

                              <div className="pt-2 border-t border-white/20 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center font-black text-sm shrink-0 border border-white/30">
                                  <User className="w-5 h-5 text-amber-300" />
                                </div>
                                <div>
                                  <p className="text-xs font-extrabold text-white">{ach.studentName}</p>
                                  <p className="text-[11px] text-amber-300 font-semibold">{ach.gradeClass}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Card Footer Button */}
                          <div className="p-5 pt-0">
                            <button
                              onClick={() => {
                                setSelectedGalleryItem({
                                  id: ach.id,
                                  title: `${ach.achievementTitle} - ${ach.competitionName}`,
                                  description: `Pemenang: ${ach.studentName} (${ach.gradeClass}) | Ajang Kejuaraan Tingkat ${ach.level} Tahun ${ach.year}`,
                                  url: photo,
                                  category: 'Prestasi Siswa',
                                  type: 'photo',
                                  date: ach.year,
                                });
                              }}
                              className="w-full py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                              <span>Buka Sertifikat / Foto Dokumentasi</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* ==================== GALERI PAGE ==================== */}
        {activeTab === 'galeri' && (
          <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black text-emerald-950">Galeri Foto & Aktivitas Video</h2>
              <p className="text-xs text-slate-500">Dokumentasi nyata suasana belajar mengajar dan fasilitas kampus.</p>

              <div className="pt-4 flex flex-wrap justify-center gap-2">
                {['SEMUA', 'Kegiatan Belajar', 'Prestasi Siswa', 'Fasilitas Kampus', 'Acara Yayasan'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setGalleryCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      galleryCategory === cat
                        ? 'bg-emerald-700 text-white shadow-2xs'
                        : 'bg-white text-slate-700 hover:bg-emerald-50 border border-emerald-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className={`grid ${galleryGridClass} gap-6`}>
              {filteredGallery.map((item) => (
                <div key={item.id} className="bg-white rounded-3xl border border-emerald-200/90 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition group">
                  <div>
                    {isYouTubeUrl(item.url) ? (
                      <div
                        className="w-full h-64 sm:h-72 bg-slate-900 rounded-t-3xl overflow-hidden relative cursor-pointer group/vid shadow-inner flex items-center justify-center"
                        onClick={() => setSelectedGalleryItem(item)}
                      >
                        <iframe
                          src={getYoutubeEmbedUrl(item.url)}
                          title={item.title}
                          className="w-full h-full border-0 pointer-events-none opacity-80"
                        />
                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center group-hover/vid:bg-black/20 transition">
                          <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xl group-hover/vid:scale-110 transition">
                            <PlayCircle className="w-8 h-8 fill-white text-emerald-600" />
                          </div>
                          <span className="text-xs font-black text-emerald-200 mt-2 uppercase tracking-wider">Putar Video YouTube</span>
                        </div>
                      </div>
                    ) : isGoogleDriveUrl(item.url) ? (
                      <div
                        className="w-full h-64 sm:h-72 bg-slate-900 rounded-t-3xl overflow-hidden relative cursor-pointer group/vid shadow-inner flex items-center justify-center"
                        onClick={() => setSelectedGalleryItem(item)}
                      >
                        <iframe
                          src={getGoogleDriveEmbedUrl(item.url)}
                          title={item.title}
                          className="w-full h-full border-0 pointer-events-none opacity-80"
                        />
                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center group-hover/vid:bg-black/20 transition">
                          <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xl group-hover/vid:scale-110 transition">
                            <PlayCircle className="w-8 h-8 fill-white text-emerald-600" />
                          </div>
                          <span className="text-xs font-black text-emerald-200 mt-2 uppercase tracking-wider">Putar Google Drive</span>
                        </div>
                      </div>
                    ) : (item.type === 'video' || isMediaVideo(item.url) || (item as any).mediaType === 'video') ? (
                      <div
                        className="w-full h-64 sm:h-72 bg-slate-900 rounded-t-3xl overflow-hidden relative group/vid shadow-inner flex items-center justify-center"
                      >
                        <video
                          src={item.url}
                          controls
                          playsInline
                          preload="metadata"
                          className="w-full h-full object-contain bg-black"
                        />
                        <button
                          onClick={() => setSelectedGalleryItem(item)}
                          className="absolute top-3 right-3 px-3 py-1.5 bg-slate-900/90 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg border border-slate-700 hover:bg-slate-800 cursor-pointer z-10"
                        >
                          <Eye className="w-4 h-4 text-emerald-300" />
                          <span>Layar Penuh</span>
                        </button>
                      </div>
                    ) : (
                      <div
                        className="w-full h-64 sm:h-72 rounded-t-3xl overflow-hidden relative cursor-pointer group/img"
                        onClick={() => setSelectedGalleryItem(item)}
                      >
                        <img
                          src={item.url}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                        />
                        <div className="absolute top-3 right-3 px-3 py-1.5 bg-slate-900/80 backdrop-blur-sm text-white rounded-xl text-xs font-bold opacity-0 group-hover/img:opacity-100 transition flex items-center gap-1.5 shadow-lg border border-slate-700">
                          <Eye className="w-4 h-4 text-emerald-300" />
                          <span>Lihat Foto Full</span>
                        </div>
                      </div>
                    )}
                    <div className="p-5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-md uppercase">
                          {item.category}
                        </span>
                        <button
                          onClick={() => setSelectedGalleryItem(item)}
                          className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Zoom Full</span>
                        </button>
                      </div>
                      <h4 className="font-extrabold text-emerald-950 text-sm">{item.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== BERITA & E-RAPORT PAGE ==================== */}
        {activeTab === 'berita' && (
          <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
            
            {/* TOP LAYOUT: E-RAPORT DIGITAL & HASIL BELAJAR SISWA */}
            <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-indigo-800 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-800/80 pb-5">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-amber-300 text-xs font-black rounded-full border border-amber-400/30 uppercase mb-2">
                    <GraduationCap className="w-4 h-4 text-amber-400" /> E-Raport Digital & Transparansi Akademik
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    Pusat Layanan E-Raport Digital Siswa
                  </h2>
                  <p className="text-xs text-indigo-200 mt-1 max-w-2xl">
                    Masukkan Nama Siswa dan Kelas untuk memeriksa Lembar Hasil Belajar (E-Raport) Semester Ganjil/Genap Rombel Kelas 1 - 6 secara langsung.
                  </p>
                </div>
              </div>

              {/* Search Form for Pusat Layanan E-Raport Digital Siswa */}
              <form onSubmit={handleParentSearch} className="bg-indigo-900/70 p-5 rounded-2xl border border-indigo-700/80 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
                  {/* Kolom Nama Siswa */}
                  <div className="lg:col-span-5">
                    <label className="block text-[11px] font-extrabold text-amber-300 mb-1 flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      <span>Kolom Nama Lengkap Siswa</span>
                    </label>
                    <input
                      type="text"
                      value={searchStudentName}
                      onChange={(e) => setSearchStudentName(e.target.value)}
                      placeholder="Masukkan Nama Siswa (Contoh: Ahmad Rizky)..."
                      className="w-full px-3.5 py-2 bg-indigo-950/90 border border-indigo-600 rounded-xl text-xs text-white placeholder-indigo-300 focus:outline-none focus:border-amber-400 font-semibold"
                    />
                  </div>

                  {/* Kolom Pilih Kelas / Rombel */}
                  <div className="lg:col-span-4">
                    <label className="block text-[11px] font-extrabold text-amber-300 mb-1 flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>Kolom Pilih Kelas / Rombel</span>
                    </label>
                    <select
                      value={searchStudentClass}
                      onChange={(e) => setSearchStudentClass(e.target.value)}
                      className="w-full px-3.5 py-2 bg-indigo-950/90 border border-indigo-600 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
                    >
                      <option value="SEMUA">-- Semua Rombel / Kelas --</option>
                      <option value="Kelas 1">Kelas 1</option>
                      <option value="Kelas 2">Kelas 2</option>
                      <option value="Kelas 3">Kelas 3</option>
                      <option value="Kelas 4">Kelas 4</option>
                      <option value="Kelas 5">Kelas 5</option>
                      <option value="Kelas 6">Kelas 6</option>
                    </select>
                  </div>

                  {/* Tombol Cari Data */}
                  <div className="lg:col-span-3 flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer h-[38px]"
                    >
                      <Search className="w-4 h-4" />
                      <span>Cari Data Siswa</span>
                    </button>
                  </div>
                </div>
              </form>

              {/* Search Result: Integrated Student Portal (E-Raport, SPP & Prestasi) */}
              <div className="space-y-4 pt-2">
                {hasSearched ? (
                  searchedRaport || searchedStudent ? (
                    <div className="bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                      {/* Top Header & Tab Selector */}
                      <div className="bg-slate-900 text-white p-5 border-b border-slate-800 space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <div>
                            <span className="text-[10px] font-black px-2.5 py-0.5 bg-amber-400 text-slate-950 rounded-full uppercase tracking-wider">
                              Portal Layanan Siswa Terpadu
                            </span>
                            <h3 className="text-xl font-black text-white mt-1">
                              {searchedRaport?.studentName || searchedStudent?.name}
                            </h3>
                            <p className="text-xs text-slate-300 font-medium">
                              NISN/NIS: <span className="font-mono font-bold text-amber-300">{searchedRaport?.nisn || searchedStudent?.nis || '20240101'}</span> &bull; {searchedRaport?.gradeClass || searchedStudent?.gradeClass}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-bold text-xs rounded-full border border-emerald-500/30">
                              Status Aktif
                            </span>
                          </div>
                        </div>

                        {/* Navigation Tabs for 3 Data Dimensions */}
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
                          <button
                            type="button"
                            onClick={() => setPortalTab('raport')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                              portalTab === 'raport'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            <FileText className="w-4 h-4" />
                            <span>1. Lembar E-Raport</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setPortalTab('spp')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                              portalTab === 'spp'
                                ? 'bg-emerald-600 text-white shadow-md'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            <ShieldCheck className="w-4 h-4" />
                            <span>2. Status Pembayaran SPP</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setPortalTab('prestasi')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                              portalTab === 'prestasi'
                                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            <Award className="w-4 h-4" />
                            <span>3. Prestasi & Penghargaan</span>
                          </button>
                        </div>
                      </div>

                      {/* TAB CONTENT 1: E-RAPORT */}
                      {portalTab === 'raport' && (
                        <div id="printable-raport" className="p-6 sm:p-8 space-y-6">
                          {searchedStudent && searchedStudent.sppStatus !== 'LUNAS' ? (
                            <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-6 sm:p-8 text-slate-900 space-y-5 shadow-md">
                              <div className="flex items-start gap-4">
                                <div className="p-3 bg-rose-500 text-white rounded-2xl shrink-0 shadow-md">
                                  <Lock className="w-8 h-8" />
                                </div>
                                <div className="space-y-1">
                                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-200/80 text-rose-950 font-black text-xs rounded-full border border-rose-300 uppercase">
                                    <AlertTriangle className="w-3.5 h-3.5 text-rose-800" /> Akses E-Raport Belum Terbuka
                                  </div>
                                  <h3 className="text-xl font-black text-slate-950">
                                    Lembar E-Raport Semester Ananda Belum Dapat Dilihat
                                  </h3>
                                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                    Sesuai dengan ketentuan administrasi Yayasan Pendidikan Daarul Habibah, Lembar Hasil Belajar Siswa (E-Raport) Ananda <strong className="text-rose-900">{searchedRaport?.studentName || searchedStudent.name}</strong> belum dapat diakses secara digital maupun dicetak karena status administrasi SPP masih berstatus <span className="font-bold text-rose-700 uppercase">[{searchedStudent.sppStatus}]</span>.
                                  </p>
                                </div>
                              </div>

                              <div className="bg-white p-4.5 rounded-2xl border border-rose-200 shadow-xs space-y-3">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-100 pb-3">
                                  <div>
                                    <p className="text-[11px] text-slate-500 font-bold uppercase">Nama Siswa / NIS</p>
                                    <p className="font-black text-slate-900 text-sm">{searchedStudent.name} (NIS: {searchedStudent.nis})</p>
                                  </div>
                                  <div>
                                    <p className="text-[11px] text-slate-500 font-bold uppercase">Status Pembayaran SPP</p>
                                    <span className="px-3 py-1 bg-rose-100 text-rose-800 font-black text-xs rounded-full border border-rose-300 uppercase">
                                      {searchedStudent.sppStatus}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                  <div>
                                    <p className="text-slate-600 font-medium">Nomor Rekening / Virtual Account Resmi:</p>
                                    <p className="font-mono font-black text-blue-900 text-sm">BSI 8802020{searchedStudent.nis || '26001'}</p>
                                    <p className="text-[11px] text-slate-500">a.n SPP Yayasan Pendidikan Daarul Habibah</p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setPortalTab('spp')}
                                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
                                  >
                                    <ShieldCheck className="w-4 h-4" />
                                    <span>Lihat Rincian Tagihan & Status SPP</span>
                                  </button>
                                </div>
                              </div>

                              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                                <span>Setelah melakukan pelunasan dan diverifikasi Bendahara/Wali Kelas, lembar E-Raport digital dan cetak PDF akan langsung terbuka secara otomatis.</span>
                              </div>
                            </div>
                          ) : searchedRaport ? (
                            <>
                              {/* Kop Surat E-Raport */}
                              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
                                <div className="flex items-center gap-3">
                                  {foundationProfile.logoUrl ? (
                                    <img
                                      src={foundationProfile.logoUrl}
                                      alt="Logo Sekolah"
                                      className="w-16 h-16 object-contain"
                                    />
                                  ) : (
                                    <div className="w-16 h-16 bg-blue-900 text-white font-black text-xl rounded-xl flex items-center justify-center">
                                      SDIT
                                    </div>
                                  )}
                                  <div>
                                    <h3 className="font-black text-lg text-slate-900 uppercase leading-tight">
                                      {foundationProfile.name}
                                    </h3>
                                    <p className="text-xs text-slate-600 font-medium">{foundationProfile.address}</p>
                                    <p className="text-[11px] text-blue-800 font-bold">
                                      E-RAPORT DIGITAL ROMBONGAN BELAJAR TERAKREDITASI
                                    </p>
                                  </div>
                                </div>

                                <div className="text-right">
                                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-black text-xs rounded-full uppercase border border-emerald-300">
                                    {searchedRaport.status}
                                  </span>
                                  <p className="text-xs font-bold text-slate-700 mt-2">T.A. {searchedRaport.academicYear}</p>
                                </div>
                              </div>

                              {/* Identitas Siswa */}
                              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-4 bg-slate-50 rounded-xl text-xs border border-slate-200">
                                <div>
                                  <p className="text-slate-500 font-medium">Nama Siswa:</p>
                                  <p className="font-extrabold text-slate-900 text-sm">{searchedRaport.studentName}</p>
                                </div>
                                <div>
                                  <p className="text-slate-500 font-medium">NIS / NISN:</p>
                                  <p className="font-mono font-bold text-blue-800">{searchedRaport.nisn}</p>
                                </div>
                                <div>
                                  <p className="text-slate-500 font-medium">Kelas / Rombel:</p>
                                  <p className="font-bold text-slate-900">{searchedRaport.gradeClass}</p>
                                </div>
                                <div>
                                  <p className="text-slate-500 font-medium">Wali Murid:</p>
                                  <p className="font-bold text-slate-800">{searchedRaport.parentName || searchedStudent?.parentName || 'Orang Tua / Wali'}</p>
                                </div>
                                <div>
                                  <p className="text-slate-500 font-medium">Wali Kelas:</p>
                                  <p className="font-bold text-slate-800">{searchedRaport.teacherName}</p>
                                </div>
                              </div>

                              {/* Tabel Nilai Mata Pelajaran */}
                              <div className="overflow-x-auto">
                                <table className="w-full text-xs border-collapse">
                                  <thead>
                                    <tr className="bg-blue-900 text-white text-left font-bold">
                                      <th className="p-2.5 border border-blue-900">Mata Pelajaran</th>
                                      <th className="p-2.5 border border-blue-900 text-center w-20">Nilai (0-100)</th>
                                      <th className="p-2.5 border border-blue-900 text-center w-20">Predikat</th>
                                      <th className="p-2.5 border border-blue-900">Capaian Kompetensi & Deskripsi</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {searchedRaport.grades.map((g, idx) => (
                                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                        <td className="p-2.5 border border-slate-200 font-bold text-slate-800">{g.subject}</td>
                                        <td className="p-2.5 border border-slate-200 text-center font-mono font-bold text-blue-900">
                                          {g.score}
                                        </td>
                                        <td className="p-2.5 border border-slate-200 text-center">
                                          <span className="px-2 py-0.5 bg-blue-100 text-blue-900 font-black rounded-md">
                                            {g.letterGrade}
                                          </span>
                                        </td>
                                        <td className="p-2.5 border border-slate-200 text-slate-700 leading-snug">{g.notes}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>

                              {/* Kehadiran & Catatan */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                                  <h4 className="font-bold text-slate-900 border-b pb-1">Rekapitulasi Kehadiran</h4>
                                  <div className="grid grid-cols-4 gap-2 text-center font-bold">
                                    <div className="p-2 bg-emerald-100 text-emerald-900 rounded-lg">
                                      Hadir: {searchedRaport.attendance.present} hari
                                    </div>
                                    <div className="p-2 bg-amber-100 text-amber-900 rounded-lg">
                                      Sakit: {searchedRaport.attendance.sick} hari
                                    </div>
                                    <div className="p-2 bg-blue-100 text-blue-900 rounded-lg">
                                      Izin: {searchedRaport.attendance.permitted} hari
                                    </div>
                                    <div className="p-2 bg-rose-100 text-rose-900 rounded-lg">
                                      Alpa: {searchedRaport.attendance.absent} hari
                                    </div>
                                  </div>
                                </div>

                                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
                                  <h4 className="font-bold text-amber-900 border-b border-amber-200 pb-1">Catatan Wali Kelas</h4>
                                  <p className="text-slate-700 italic pt-1">"{searchedRaport.teacherNotes}"</p>
                                </div>
                              </div>

                              {/* Print Button */}
                              <div className="flex justify-end pt-2">
                                <button
                                  type="button"
                                  onClick={() => printDocument('printable-raport', `E-Raport_${searchedRaport.studentName}`)}
                                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition"
                                >
                                  <Printer className="w-4 h-4" />
                                  <span>Cetak Lembar E-Raport (PDF)</span>
                                </button>
                              </div>
                            </>
                          ) : (
                            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                              <FileText className="w-10 h-10 text-slate-400 mx-auto" />
                              <h4 className="font-bold text-slate-900">E-Raport Belum Diterbitkan</h4>
                              <p className="text-xs text-slate-500">Lembar E-Raport Digital semester ini sedang disiapkan oleh Wali Kelas.</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* TAB CONTENT 2: STATUS SPP & KEUANGAN */}
                      {portalTab === 'spp' && (
                        <div id="printable-spp-receipt" className="p-6 sm:p-8 space-y-6">
                          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-200/60 px-2.5 py-0.5 rounded-md">
                                Status Keuangan Bulanan SPP
                              </span>
                              <h4 className="text-lg font-black text-slate-900 mt-1">
                                Pembayaran SPP T.A 2024/2025
                              </h4>
                              <p className="text-xs text-slate-600">
                                Wali Murid: <span className="font-bold text-slate-800">{searchedStudent?.parentName || 'Orang Tua Siswa'}</span> &bull; Telp: <span className="font-mono">{searchedStudent?.contactPhone || '081234567890'}</span>
                              </p>
                            </div>

                            <div className="text-left md:text-right">
                              <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase shadow-sm inline-block ${
                                searchedStudent?.sppStatus === 'LUNAS' || !searchedStudent
                                  ? 'bg-emerald-600 text-white'
                                  : searchedStudent.sppStatus === 'MENUNGGU'
                                  ? 'bg-amber-500 text-slate-950'
                                  : 'bg-rose-600 text-white'
                              }`}>
                                Status: {searchedStudent?.sppStatus || 'LUNAS'}
                              </span>
                              <p className="text-xs font-extrabold text-slate-900 mt-1">
                                Nominal: {formatRupiah(searchedStudent?.sppAmount || 250000)} / bulan
                              </p>
                            </div>
                          </div>

                          {/* Matrix 12 Bulan SPP */}
                          <div className="space-y-3">
                            <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wide border-b pb-2">
                              Rincian Status Matriks SPP (12 Bulan Pembelajaran)
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
                              {['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'].map((month, idx) => {
                                const isPaid = searchedStudent?.sppStatus === 'LUNAS' || idx < 6;
                                return (
                                  <div
                                    key={month}
                                    className={`p-3 rounded-xl border flex justify-between items-center ${
                                      isPaid
                                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                                        : 'bg-slate-50 border-slate-200 text-slate-500'
                                    }`}
                                  >
                                    <div>
                                      <p className="font-bold">{month}</p>
                                      <p className="text-[10px] font-mono">{formatRupiah(searchedStudent?.sppAmount || 250000)}</p>
                                    </div>
                                    {isPaid ? (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    ) : (
                                      <Clock className="w-4 h-4 text-amber-500" />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Print Kuitansi Button */}
                          <div className="flex justify-end pt-2">
                            <button
                              type="button"
                              onClick={() => printDocument('printable-spp-receipt', `Kuitansi_SPP_${searchedRaport?.studentName || searchedStudent?.name}`)}
                              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition"
                            >
                              <Printer className="w-4 h-4" />
                              <span>Cetak Kuitansi SPP Digital (PDF)</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* TAB CONTENT 3: PRESTASI SISWA */}
                      {portalTab === 'prestasi' && (
                        <div className="p-6 sm:p-8 space-y-6">
                          <div className="flex justify-between items-center border-b pb-3">
                            <div>
                              <h4 className="font-extrabold text-slate-900 text-sm">
                                Rekam Jejak Prestasi & Penghargaan Siswa
                              </h4>
                              <p className="text-xs text-slate-500">
                                Daftar kejuaraan akademik, olahraga, sains, dan keagamaan yang diraih siswa.
                              </p>
                            </div>
                          </div>

                          {achievements.filter(a =>
                            (searchedRaport?.studentName || searchedStudent?.name || '').toLowerCase().includes(a.studentName.toLowerCase()) ||
                            a.studentName.toLowerCase().includes((searchedRaport?.studentName || searchedStudent?.name || '').toLowerCase())
                          ).length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {achievements.filter(a =>
                                (searchedRaport?.studentName || searchedStudent?.name || '').toLowerCase().includes(a.studentName.toLowerCase()) ||
                                a.studentName.toLowerCase().includes((searchedRaport?.studentName || searchedStudent?.name || '').toLowerCase())
                              ).map((ach) => (
                                <div key={ach.id} className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl flex gap-4 items-center">
                                  {ach.photoUrl ? (
                                    <div
                                      className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden cursor-pointer group/ach"
                                      onClick={() => {
                                        setSelectedGalleryItem({
                                          id: ach.id,
                                          title: `${ach.achievementTitle} - ${ach.competitionName}`,
                                          description: `Siswa: ${ach.studentName} (${ach.gradeClass}) - Tingkat ${ach.level}`,
                                          url: ach.photoUrl,
                                          category: 'Prestasi Siswa',
                                        });
                                      }}
                                    >
                                      <img src={ach.photoUrl} alt={ach.achievementTitle} className="w-full h-full object-cover transition-transform group-hover/ach:scale-105" />
                                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/ach:opacity-100 transition flex items-center justify-center text-white text-[10px] font-bold">
                                        <Eye className="w-4 h-4 text-amber-300" />
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="w-20 h-20 bg-amber-200 text-amber-900 rounded-xl flex items-center justify-center shrink-0">
                                      <Award className="w-8 h-8 text-amber-700" />
                                    </div>
                                  )}
                                  <div>
                                    <span className="text-[10px] font-black px-2 py-0.5 bg-amber-200 text-amber-900 rounded-md uppercase">
                                      Tingkat {ach.level}
                                    </span>
                                    <h5 className="font-extrabold text-slate-900 text-xs mt-1">{ach.achievementTitle}</h5>
                                    <p className="text-xs font-bold text-amber-800">{ach.competitionName}</p>
                                    <p className="text-[11px] text-slate-500 mt-1">Tahun Ajang: {ach.year}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                              <Award className="w-10 h-10 text-amber-500 mx-auto" />
                              <h4 className="font-extrabold text-slate-900 text-sm">Siswa Berprestasi Aktif</h4>
                              <p className="text-xs text-slate-600 max-w-md mx-auto">
                                Siswa aktif mengikuti kegiatan intrakurikuler dan ektrakurikuler sekolah. Catatan penghargaan khusus akan diperbarui secara periodik.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-6 bg-indigo-900/40 border border-indigo-700 rounded-2xl text-center space-y-2">
                      <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
                      <p className="font-bold text-white text-sm">Data Siswa Tidak Ditemukan</p>
                      <p className="text-xs text-indigo-200 max-w-md mx-auto">
                        Silakan periksa kembali Kolom Nama Siswa dan Kolom Pilihan Kelas / Rombel di atas.
                      </p>
                    </div>
                  )
                ) : null}
              </div>
            </div>

            {/* BOTTOM LAYOUT: KONTEN BERITA & PENGUMUMAN SEKOLAH */}
            <div className="space-y-6 pt-4 border-t border-slate-200">
              <div className="text-center space-y-2">
                <span className="px-3.5 py-1 bg-blue-100 text-blue-900 text-xs font-black rounded-full uppercase border border-blue-200">
                  Pengumuman & Agenda
                </span>
                <h2 className="text-3xl font-black text-slate-900">Kabar Berita & Informasi Sekolah</h2>
                <p className="text-xs text-slate-500 max-w-xl mx-auto">
                  Informasi terdepan seputar agenda Rombel, prestasi siswa, pengadaan SiPLah, dan berita yayasan.
                </p>
              </div>

              <div className={`grid ${newsGridClass} gap-6`}>
                {newsArticles.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition">
                    <div>
                      <div className="w-full h-64 overflow-hidden relative rounded-t-2xl">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover transition duration-500 hover:scale-105"
                        />
                      </div>
                      <div className="p-5 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md uppercase">
                            {item.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{formatDateIndonesian(item.date)}</span>
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-base leading-snug">{item.title}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{item.excerpt}</p>
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <button
                        onClick={() => setSelectedNews(item)}
                        className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Baca Artikel Selengkapnya</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ==================== KONTAK PAGE ==================== */}
        {activeTab === 'kontak' && (
          <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black text-slate-900">Hubungi Kami</h2>
              <p className="text-xs text-slate-500">Layanan Informasi Pendaftaran, Keuangan, & Akademik Sekolah.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-blue-100 shadow-sm space-y-4">
                <h3 className="font-black text-slate-900 text-base border-b border-slate-100 pb-2">Kantor & Layanan</h3>
                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-800">Alamat Lengkap</p>
                      <p className="text-slate-600">{foundationProfile.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-blue-600 shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800">Telepon / WhatsApp</p>
                      <p className="text-slate-600">{foundationProfile.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-blue-600 shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800">Email Resmi</p>
                      <p className="text-slate-600">{foundationProfile.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-blue-100 shadow-sm space-y-4">
                <h3 className="font-black text-slate-900 text-base border-b border-slate-100 pb-2">Formulir Kirim Pesan</h3>
                {contactSuccess && (
                  <div className="p-3 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Pesan Anda berhasil terkirim! Tim admin sekolah akan segera menghubungi Anda.</span>
                  </div>
                )}
                <form onSubmit={handleContactSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap Anda</label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Masukkan nama lengkap..."
                      className="w-full bg-blue-50/50 border border-blue-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nomor Telepon / WhatsApp</label>
                    <input
                      type="text"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="Contoh: 081234567890"
                      className="w-full bg-blue-50/50 border border-blue-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Pesan / Pertanyaan</label>
                    <textarea
                      rows={4}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Tuliskan pertanyaan Anda mengenai pendaftaran, E-Raport, atau SPP..."
                      className="w-full bg-blue-50/50 border border-blue-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition"
                  >
                    Kirim Pesan Sekarang
                  </button>
                </form>
              </div>
            </div>

            {/* SEKSI PETA GOOGLE MAPS & PANDUAN PENJEMPUTAN/ANTAR SISWA */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-blue-100 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-md">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      Peta Lokasi Kampus & Navigasi Pengantar Siswa
                    </h3>
                    <p className="text-xs text-slate-500">
                      Peta Google Maps interaktif untuk memandu orang tua murid saat mengantar & menjemput siswa.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(foundationProfile.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition cursor-pointer"
                  >
                    <Navigation className="w-4 h-4 text-amber-300" />
                    <span>Petunjuk Arah (Google Maps)</span>
                  </a>
                  <a
                    href={`https://waze.com/ul?q=${encodeURIComponent(foundationProfile.address)}&navigate=yes`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2.5 bg-sky-100 hover:bg-sky-200 text-sky-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <span>Navigasi Waze</span>
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Embed Google Maps Iframe */}
                <div className="lg:col-span-8 bg-slate-950 rounded-2xl overflow-hidden shadow-inner border border-slate-200 min-h-[320px] flex flex-col relative">
                  <iframe
                    title="Peta Lokasi Google Maps Sekolah"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(foundationProfile.address)}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                    className="w-full h-full min-h-[340px] border-0"
                    loading="lazy"
                    allowFullScreen
                  />
                  <div className="bg-slate-900 text-slate-200 text-[11px] p-2.5 px-4 flex justify-between items-center border-t border-slate-800">
                    <span className="font-semibold truncate">📍 {foundationProfile.address}</span>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(foundationProfile.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 font-bold hover:underline shrink-0 ml-2"
                    >
                      Perbesar Peta ↗
                    </a>
                  </div>
                </div>

                {/* Info Zona Drop-off & Parkir Orang Tua */}
                <div className="lg:col-span-4 bg-gradient-to-br from-blue-50/80 via-slate-50 to-indigo-50/50 p-5 rounded-2xl border border-blue-100 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-blue-900 font-extrabold text-sm border-b border-blue-200/60 pb-2">
                      <ShieldCheck className="w-5 h-5 text-blue-600" />
                      <span>Panduan Antar / Jemput Siswa</span>
                    </div>

                    <ul className="space-y-2.5 text-xs text-slate-700">
                      <li className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-blue-100 shadow-2xs">
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                        <div>
                          <strong className="text-slate-900 block">Gerbang Utama Kampus</strong>
                          <span className="text-[11px] text-slate-500">Khusus alur drop-off pagi (06:30 - 07:15 WIB) tanpa memicu penumpukan lalu lintas.</span>
                        </div>
                      </li>

                      <li className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-blue-100 shadow-2xs">
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                        <div>
                          <strong className="text-slate-900 block">Area Parkir Orang Tua</strong>
                          <span className="text-[11px] text-slate-500">Tersedia kantong parkir motor & mobil di pelataran depan untuk jam penjemputan.</span>
                        </div>
                      </li>

                      <li className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-blue-100 shadow-2xs">
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                        <div>
                          <strong className="text-slate-900 block">Pos Keamanan & Satpam</strong>
                          <span className="text-[11px] text-slate-500">Petugas siaga membantu penyeberangan siswa dan ketertiban area drop-off.</span>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-2">
                    <a
                      href={`https://wa.me/${foundationProfile.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm cursor-pointer transition"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Hubungi Pos Keamanan / Hubmas</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal Lightbox Foto Full Galeri */}
      {selectedGalleryItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl relative">
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-blue-600/30 text-sky-300 text-xs font-bold rounded-md uppercase border border-blue-500/40">
                  {selectedGalleryItem.category}
                </span>
                <h3 className="font-black text-sm text-white line-clamp-1">{selectedGalleryItem.title}</h3>
              </div>
              <button
                onClick={() => setSelectedGalleryItem(null)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 bg-black p-4 flex items-center justify-center overflow-auto min-h-[320px]">
              {isYouTubeUrl(selectedGalleryItem.url) ? (
                <iframe
                  src={getYoutubeEmbedUrl(selectedGalleryItem.url)}
                  title={selectedGalleryItem.title}
                  className="w-full h-80 sm:h-[480px] rounded-2xl border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : isGoogleDriveUrl(selectedGalleryItem.url) ? (
                <iframe
                  src={getGoogleDriveEmbedUrl(selectedGalleryItem.url)}
                  title={selectedGalleryItem.title}
                  className="w-full h-80 sm:h-[480px] rounded-2xl border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : isVimeoUrl(selectedGalleryItem.url) ? (
                <iframe
                  src={getVimeoEmbedUrl(selectedGalleryItem.url)}
                  title={selectedGalleryItem.title}
                  className="w-full h-80 sm:h-[480px] rounded-2xl border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (selectedGalleryItem.type === 'video' || isMediaVideo(selectedGalleryItem.url) || (selectedGalleryItem as any).mediaType === 'video') ? (
                <video
                  src={selectedGalleryItem.url}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[72vh] w-full object-contain rounded-xl shadow-2xl bg-black"
                />
              ) : (
                <img
                  src={selectedGalleryItem.url}
                  alt={selectedGalleryItem.title}
                  className="max-h-[70vh] max-w-full w-auto h-auto object-contain rounded-xl shadow-2xl"
                />
              )}
            </div>

            <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-1 shrink-0">
              <h4 className="font-extrabold text-white text-sm">{selectedGalleryItem.title}</h4>
              <p className="text-xs text-slate-300">{selectedGalleryItem.description || 'Dokumentasi foto aktivitas sekolah / yayasan.'}</p>
              <div className="pt-2 flex justify-between items-center text-[11px] text-slate-400">
                <span>Tampilan Foto Utuh (Full Aspect Ratio)</span>
                <a
                  href={selectedGalleryItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Buka Gambar HD Tab Baru</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Baca Artikel Berita Selengkapnya */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
          <div className="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 text-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-amber-400/40">
            <div className="p-5 border-b border-amber-500/20 flex items-center justify-between shrink-0 bg-slate-950/50">
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-black rounded-full uppercase border border-amber-400/30">
                {selectedNews.category}
              </span>
              <button
                onClick={() => setSelectedNews(null)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="relative w-full h-72 sm:h-80 bg-slate-900 rounded-2xl overflow-hidden border border-amber-400/20 shadow-md">
                <img
                  src={selectedNews.imageUrl}
                  alt={selectedNews.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-3">
                <p className="text-xs text-amber-300 font-mono">{formatDateIndonesian(selectedNews.date)}</p>
                <h3 className="text-xl sm:text-2xl font-black text-white">{selectedNews.title}</h3>
                <p className="text-xs font-bold text-amber-200 bg-slate-900 p-4 rounded-xl border border-amber-400/20 italic">
                  {selectedNews.excerpt}
                </p>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line pt-2">
                  {selectedNews.content || selectedNews.excerpt}
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border-t border-amber-500/20 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedNews(null)}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:brightness-110 text-slate-950 text-xs font-black rounded-xl transition cursor-pointer shadow-lg"
              >
                Tutup Artikel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Public Footer - Brand Cyan Blue #0095D9 */}
      <footer className="bg-[#0095D9] text-white py-12 px-6 border-t border-sky-300/40 text-xs relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-sky-200 via-white to-sky-200"></div>
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-amber-300" />
              <h4 className="font-black text-white text-base tracking-wide">{foundationProfile.name}</h4>
            </div>
            <p className="text-sky-100 text-xs leading-relaxed">{foundationProfile.address}</p>
            <p className="mt-2 text-[11px] text-amber-300 font-mono">Pengesahan Kemenkumham: {foundationProfile.legalNumber}</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-extrabold text-amber-300 text-xs uppercase tracking-widest border-b border-white/30 pb-2">Navigasi Halaman Utama</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-amber-300 text-sky-100 transition cursor-pointer flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-300"></span> Home Utama Yayasan
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('tentang')} className="hover:text-amber-300 text-sky-100 transition cursor-pointer flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-300"></span> Profil & Jajaran Pengurus
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('galeri')} className="hover:text-amber-300 text-sky-100 transition cursor-pointer flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-300"></span> Galeri & Prestasi Kejuaraan
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-extrabold text-amber-300 text-xs uppercase tracking-widest border-b border-white/30 pb-2">Sistem Informasi & Tata Kelola</h4>
            <p className="text-[11px] text-sky-100 leading-relaxed">
              Sistem Informasi Keuangan ISAK 35, SiPLah Procurements, Rombel Akademik E-Raport & Portal Web Publik Terpadu.
            </p>
            <p className="text-[10px] text-amber-200 pt-2 font-mono">
              &copy; {new Date().getFullYear()} {foundationProfile.name}. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
