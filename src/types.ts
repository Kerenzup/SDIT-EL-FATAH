export type AccountType = 'ASET_LANCAR' | 'ASET_TETAP' | 'KEWAJIBAN' | 'ASET_NETO' | 'PENDAPATAN' | 'BEBAN';

export type UserRole =
  | 'SUPERADMIN'
  | 'KETUA_YAYASAN'
  | 'BENDAHARA_YAYASAN'
  | 'KEPALA_SEKOLAH'
  | 'BENDAHARA_SEKOLAH'
  | 'GURU'
  | 'ADMIN_CMS'
  | 'PUBLIC_GUEST';

export interface Account {
  code: string; // e.g. "1101"
  name: string; // e.g. "Kas"
  category: AccountType;
  subCategory?: string; // e.g. "SDM", "Pendidikan", "Operasional", "Administrasi", "Kewajiban Pendek"
  balance: number;
  restriction?: 'TANPA_PEMBATASAN' | 'DENGAN_PEMBATASAN';
}

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  voucherNo: string;
  description: string;
  categoryTag?: 'SPP' | 'BOS' | 'GAJI' | 'DONASI' | 'ASSET' | 'OPERASIONAL' | 'UMUM';
  debitAccountCode: string;
  debitAccountName: string;
  creditAccountCode: string;
  creditAccountName: string;
  amount: number;
  studentId?: string;
  teacherId?: string;
  referenceNo?: string;
  notes?: string;
}

export interface Student {
  id: string;
  nis: string;
  nisn?: string;
  name: string;
  birthPlace?: string;
  birthDate?: string;
  parentName?: string;
  address?: string;
  contactPhone: string;
  sppAmount: number;
  sppStatus: 'LUNAS' | 'MENUNGGU' | 'TUNGGAKAN';
  achievements?: string;
  gradeClass: string;
  gender?: 'L' | 'P';
  virtualAccount?: string;
}

export interface Teacher {
  id: string;
  nip: string;
  nipy?: string;
  niy?: string;
  name: string;
  address?: string;
  phone?: string;
  role: 'Guru' | 'Kepala Sekolah' | 'Bendahara Sekolah' | 'Ketua Yayasan' | 'Pembina Yayasan' | 'Bendahara Umum Yayasan' | 'Staf Admin' | string;
  assignedRombel?: string; // e.g., "Kelas 1", "Kelas 2", "Kelas 6" (walikelas)
  subjectTaught?: string; // mata pelajaran
  baseSalary: number; // gaji pokok
  allowance: number; // tunjangan jabatan
  committeeHonor?: number; // honor kepanitiaan
  pph21: number;
  bpjs: number;
  netSalary: number;
  notes?: string; // keterangan
}

export interface FixedAsset {
  id: string;
  code: string;
  name: string;
  category: string;
  purchaseDate: string;
  acquisitionCost: number;
  usefulLifeYears: number; // useful life in years
  accumulatedDepreciation: number;
  bookValue: number;
  annualDepreciation: number;
  condition: 'Baik' | 'Perlu Perbaikan' | 'Rusak';
}

export interface FoundationBoard {
  id: string;
  nipy?: string;
  niy?: string;
  name: string;
  address?: string;
  phone: string;
  assignedRombel?: string; // walikelas
  position: 'Ketua Pembina' | 'Pembina' | 'Ketua Yayasan' | 'Sekretaris' | 'Bendahara Umum' | string;
  subjectTaught?: string; // mata pelajaran
  baseSalary?: number; // gaji pokok
  allowance?: number; // tunjangan jabatan
  committeeHonor?: number; // honor kepanitiaan
  notes?: string; // keterangan
  email?: string;
  honorarium?: number;
}

export interface OrgStructureMember {
  id: string;
  name: string;
  position: string;
  category: 'YAYASAN' | 'SEKOLAH';
  nipOrNipy?: string;
  phone?: string;
  email?: string;
  photoUrl?: string;
  order: number;
}

export interface Supplier {
  id: string;
  name: string;
  category: string;
  contact: string;
  phone: string;
}

export interface FoundationProfile {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  legalNumber: string;
  treasurerName: string;
  treasurerTitle: string;
  treasurerNip: string;
  leaderName: string;
  leaderTitle: string;
  leaderNip: string;
  pembinaName?: string;
  pembinaTitle?: string;
  pembinaNip?: string;
  secretaryName?: string;
  secretaryTitle?: string;
  secretaryNip?: string;
  headmasterName: string;
  headmasterTitle: string;
  headmasterNip: string;
  logoUrl?: string;
  buildingPhotoUrl?: string;
  pembinaPhotoUrl?: string;
  leaderPhotoUrl?: string;
  secretaryPhotoUrl?: string;
  treasurerPhotoUrl?: string;
  headmasterPhotoUrl?: string;
  welcomeMessage?: string;
  secretarySpeech?: string;
  treasurerSpeech?: string;
  leaderSpeechTitle?: string;
  leaderSpeechContent?: string;
  aboutTitle?: string;
  aboutSubtitle?: string;
  aboutHistory?: string;
  aboutDescription?: string;
  orgStructure?: OrgStructureMember[];
}

export interface LayoutSection {
  id:
    | 'hero'
    | 'speeches'
    | 'stats'
    | 'vision_mission'
    | 'news'
    | 'gallery'
    | 'achievements'
    | 'raport_spp'
    | 'foundation_profile'
    | 'contact'
    | 'guru_staf_org';
  title: string;
  visible: boolean;
  order: number;
}

export interface WebsiteLayoutConfig {
  sections: LayoutSection[];
  themePalette: 'indigo_royal' | 'emerald_islamic' | 'sapphire_modern' | 'slate_corporate' | 'amber_warm';
  headerStyle: 'gradient_dark' | 'clean_white' | 'glassmorphism';
  heroStyle: 'slider_overlay' | 'split_right' | 'minimal_card';
  photoStyle: {
    borderRadius: 'rounded-3xl' | 'rounded-2xl' | 'rounded-xl' | 'rounded-none';
    imageFit: 'cover' | 'contain';
    shadowStyle: 'shadow-lg' | 'shadow-xl' | 'shadow-md' | 'shadow-none';
    borderStyle: 'border border-blue-100' | 'border-2 border-blue-500/40' | 'border border-slate-200' | 'border-none';
    hoverEffect: 'zoom' | 'lift' | 'brightness' | 'none';
    filterOverlay: 'none' | 'subtle_dark' | 'blue_tint' | 'vibrant';
  };
  gridColumns: {
    galleryCols: 2 | 3 | 4;
    newsCols: 2 | 3 | 4;
    achievementCols: 2 | 3 | 4;
  };
}

export interface ReportFilter {
  periodType: 'TAHUNAN' | 'BULANAN' | 'TRIWULAN';
  year: number;
  month?: number;
  searchQuery?: string;
}

export type ProcurementStatus =
  | 'DIUSULKAN_KEPSEK'
  | 'DISETUJUI_BENDAHARA'
  | 'DIKETAHUI_KETUA'
  | 'DICAIRKAN'
  | 'DITOLAK';

export interface SiPLahProcurement {
  id: string;
  code: string; // e.g. SIPLAH/2026/001
  title: string; // e.g. Pengadaan 10 Unit Komputer i5 Lab SiPLah
  merchantName: string; // e.g. Tokopedia SiPLah / PT Gramedia
  category: 'ASET_TETAP' | 'PERLENGKAPAN_ATK' | 'JASA_OPERASIONAL' | 'BUKU_MODUL';
  amount: number;
  proposedBy: string; // "Dr. H. Bambang Widjaja, M.Pd (Kepala Sekolah)"
  proposedDate: string; // "2026-08-01"
  approvedByTreasurer?: string; // "Hj. Nurul Aini, S.E. (Bendahara Yayasan)"
  approvedTreasurerDate?: string;
  acknowledgedByChairman?: string; // "Drs. H. M. Syukri, M.M (Ketua Yayasan)"
  acknowledgedChairmanDate?: string;
  status: ProcurementStatus;
  fundingSource: 'DANA_BOS' | 'DANA_SPP' | 'HIBAH_YAYASAN';
  debitAccountCode: string;
  debitAccountName: string;
  notes?: string;
  isRegisteredToAssets?: boolean;
}

// --- CMS Public Website Interfaces ---
export interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText?: string;
}

export interface SpeechesCMS {
  chairmanName: string;
  chairmanTitle: string;
  chairmanPhotoUrl: string;
  chairmanSpeech: string;
  secretaryName?: string;
  secretaryTitle?: string;
  secretaryPhotoUrl?: string;
  secretarySpeech?: string;
  treasurerName?: string;
  treasurerTitle?: string;
  treasurerPhotoUrl?: string;
  treasurerSpeech?: string;
  headmasterName: string;
  headmasterTitle: string;
  headmasterPhotoUrl: string;
  headmasterSpeech: string;
}

export interface VisionMissionCMS {
  vision: string;
  mission: string[];
}

export interface NewsArticle {
  id: string;
  title: string;
  category: 'BERITA' | 'PENGUMUMAN' | 'PRESTASI' | 'AGENDA';
  date: string;
  author: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  isFeatured?: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  type: 'photo' | 'video';
  url: string;
  description: string;
  date: string;
  category: 'Kegiatan Belajar' | 'Prestasi Siswa' | 'Fasilitas Kampus' | 'Acara Yayasan';
}

export interface StudentAchievement {
  id: string;
  studentName: string;
  gradeClass: string;
  competitionName: string;
  achievementTitle: string;
  level: 'KABUPATEN' | 'PROVINSI' | 'NASIONAL' | 'INTERNASIONAL';
  year: string;
  photoUrl?: string;
}

// --- PPDB Configuration Interfaces ---
export interface PPDBFeeItem {
  id: string;
  name: string;
  amountText: string;
  notes?: string;
}

export interface PPDBScholarshipItem {
  id: string;
  title: string;
  description: string;
}

export interface PPDBConfig {
  academicYear: string;
  fees: PPDBFeeItem[];
  scholarships: PPDBScholarshipItem[];
  contactWhatsapp?: string;
  infoNote?: string;
}

// --- e-Raport, Rombel Journal, and ARKAS Budget ---
export interface SubjectGrade {
  subject: string;
  score: number;
  letterGrade: 'A' | 'B' | 'C' | 'D';
  notes: string;
}

export interface ERaport {
  id: string;
  studentId: string;
  studentName: string;
  nisn: string;
  gradeClass: string; // e.g. "Kelas 1", "Kelas 2", "Kelas 3", "Kelas 4", "Kelas 5", "Kelas 6"
  academicYear: string; // e.g. "2025/2026 Semester Ganjil"
  parentName?: string; // Wali Murid
  teacherName: string; // Wali Kelas
  grades: SubjectGrade[];
  attendance: { present: number; sick: number; permitted: number; absent: number };
  extracurriculars: { name: string; grade: string; notes: string }[];
  teacherNotes: string;
  status: 'DIUSULKAN_GURU' | 'DISETUJUI_KEPSEK' | 'DITERBITKAN';
  issuedDate: string;
}

export interface TeacherJournalRombel {
  id: string;
  teacherId: string;
  teacherName: string;
  rombonganBelajar: string; // "Kelas 1", "Kelas 2", ..., "Kelas 6"
  subject: string;
  date: string;
  topic: string;
  competencySummary: string;
  teachingMaterial: string;
  status: 'DIUSULKAN_GURU' | 'DISETUJUI_KEPSEK' | 'DITOLAK';
  principalFeedback?: string;
  approvedDate?: string;
}

export interface ArkasBudgetItem {
  id: string;
  code: string;
  activityName: string;
  category: 'OPERASIONAL' | 'BELANJA_BARANG' | 'BELANJA_MODAL' | 'HONOR_SDM';
  plannedBudget: number;
  realizedAmount: number;
  fundingSource: 'DANA_BOS' | 'DANA_SPP' | 'HIBAH_YAYASAN';
  targetRombel?: string;
}

export interface ParentTeacherConsultationMessage {
  id: string;
  studentId: string;
  studentName: string;
  gradeClass: string;
  senderType: 'GURU_WALIKELAS' | 'WALI_MURID';
  senderName: string;
  category: 'PRESTASI' | 'KEWAJIBAN_SPP' | 'KONSULTASI_BELAJAR' | 'AKADEMIK';
  title: string;
  message: string;
  timestamp: string;
  status: 'TERKIRIM' | 'DIBACA' | 'DITANGGAPI';
  attachmentNote?: string;
  sppProofUrl?: string;
}

