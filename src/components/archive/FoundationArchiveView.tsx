import React, { useState, useMemo, useRef } from 'react';
import {
  FoundationArchiveDocument,
  ArchiveCategory,
  UserRole,
  ERaport,
  Student,
  Teacher,
} from '../../types';
import {
  Archive,
  FileText,
  GraduationCap,
  ShieldCheck,
  DollarSign,
  BookOpen,
  Landmark,
  Search,
  Filter,
  Plus,
  Printer,
  Download,
  Upload,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
  Clock,
  Eye,
  Trash2,
  Edit,
  Tag,
  Share2,
  FileSpreadsheet,
  Image,
  Award,
  RefreshCw,
  FolderArchive,
  UserCheck,
  Users,
  Building,
  Check,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Database,
  Lock,
} from 'lucide-react';
import { printDocument } from '../../utils/printHelper';
import { safeSetLocalStorage } from '../../utils/safeStorage';
import { setIDBItem } from '../../utils/indexedDBStorage';

interface FoundationArchiveViewProps {
  archives: FoundationArchiveDocument[];
  eRaports: ERaport[];
  students: Student[];
  teachers: Teacher[];
  currentRole: UserRole;
  onAddArchive: (doc: Omit<FoundationArchiveDocument, 'id' | 'archivedAt'>) => void;
  onUpdateArchive: (doc: FoundationArchiveDocument) => void;
  onDeleteArchive: (id: string) => void;
  onSyncRaportsToArchive?: () => void;
  onRestoreArchives?: (imported: FoundationArchiveDocument[]) => void;
}

export const FoundationArchiveView: React.FC<FoundationArchiveViewProps> = ({
  archives,
  eRaports,
  students,
  teachers,
  currentRole,
  onAddArchive,
  onUpdateArchive,
  onDeleteArchive,
  onSyncRaportsToArchive,
  onRestoreArchives,
}) => {
  // Active Tab: Category Filter or Student Dossier
  const [activeCategory, setActiveCategory] = useState<ArchiveCategory | 'ALL' | 'STUDENT_DOSSIER'>('ALL');
  
  // Year and Rombel Filters
  const [selectedCalendarYear, setSelectedCalendarYear] = useState<string>('ALL');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>('ALL');
  const [selectedGradeClass, setSelectedGradeClass] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Student Dossier Search
  const [selectedDossierStudentId, setSelectedDossierStudentId] = useState<string>(() => students[0]?.id || '');
  
  // Modals and Previews
  const [selectedDocPreview, setSelectedDocPreview] = useState<FoundationArchiveDocument | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [showBackupModal, setShowBackupModal] = useState<boolean>(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  // Form State for Add/Edit
  const [formNumber, setFormNumber] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<ArchiveCategory>('RAPORT_DAN_AKADEMIK');
  const [formAcademicYear, setFormAcademicYear] = useState('2026/2027');
  const [formCalendarYear, setFormCalendarYear] = useState(2026);
  const [formSemester, setFormSemester] = useState<'Ganjil' | 'Genap' | 'Tahunan' | 'Semua'>('Ganjil');
  const [formGradeClass, setFormGradeClass] = useState('Semua Rombel');
  const [formIssuerName, setFormIssuerName] = useState('SDIT EL-FATAH Yayasan Daarul Habibah');
  const [formIssuedDate, setFormIssuedDate] = useState(new Date().toISOString().split('T')[0]);
  const [formFileType, setFormFileType] = useState<'PDF' | 'EXCEL' | 'IMAGE' | 'DIGITAL_RECORD' | 'DOC'>('PDF');
  const [formFileName, setFormFileName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formTags, setFormTags] = useState('Arsip Resmi, Kurikulum Merdeka');
  const [formConfidentiality, setFormConfidentiality] = useState<'PUBLIK' | 'INTERNAL_YAYASAN' | 'RAHASIA_SISWA'>('INTERNAL_YAYASAN');
  const [formAttachedData, setFormAttachedData] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const backupImportInputRef = useRef<HTMLInputElement>(null);

  // Available unique years in database
  const availableCalendarYears = useMemo(() => {
    const years = new Set<number>();
    archives.forEach((a) => {
      if (a.calendarYear) years.add(a.calendarYear);
    });
    // Add standard historical years
    [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027].forEach(y => years.add(y));
    return Array.from(years).sort((a, b) => b - a);
  }, [archives]);

  const availableAcademicYears = useMemo(() => {
    const list = new Set<string>();
    archives.forEach((a) => {
      if (a.academicYear) list.add(a.academicYear);
    });
    eRaports.forEach((r) => {
      if (r.academicYear) {
        const base = r.academicYear.split(' ')[0];
        list.add(base);
      }
    });
    ['2026/2027', '2025/2026', '2024/2025', '2023/2024', '2022/2023'].forEach(ay => list.add(ay));
    return Array.from(list).sort().reverse();
  }, [archives, eRaports]);

  // Filtered Archives
  const filteredArchives = useMemo(() => {
    return archives.filter((doc) => {
      if (activeCategory !== 'ALL' && activeCategory !== 'STUDENT_DOSSIER' && doc.category !== activeCategory) {
        return false;
      }
      if (selectedCalendarYear !== 'ALL' && doc.calendarYear !== Number(selectedCalendarYear)) {
        return false;
      }
      if (selectedAcademicYear !== 'ALL' && doc.academicYear && !doc.academicYear.includes(selectedAcademicYear)) {
        return false;
      }
      if (selectedGradeClass !== 'ALL' && doc.gradeClass && doc.gradeClass !== selectedGradeClass && doc.gradeClass !== 'Semua Rombel') {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = doc.title.toLowerCase().includes(q);
        const matchNum = doc.documentNumber.toLowerCase().includes(q);
        const matchDesc = doc.description.toLowerCase().includes(q);
        const matchIssuer = doc.issuerName.toLowerCase().includes(q);
        const matchTags = doc.tags?.some((t) => t.toLowerCase().includes(q));
        const matchStudent = doc.studentName?.toLowerCase().includes(q) || doc.nisn?.includes(q);
        if (!matchTitle && !matchNum && !matchDesc && !matchIssuer && !matchTags && !matchStudent) {
          return false;
        }
      }
      return true;
    });
  }, [archives, activeCategory, selectedCalendarYear, selectedAcademicYear, selectedGradeClass, searchQuery]);

  // Statistics Summary
  const stats = useMemo(() => {
    const total = archives.length;
    const academicCount = archives.filter(a => a.category === 'RAPORT_DAN_AKADEMIK').length;
    const legalCount = archives.filter(a => a.category === 'LEGALITAS_DAN_SK').length;
    const financialCount = archives.filter(a => a.category === 'KEUANGAN_DAN_AUDIT').length;
    const curriculumCount = archives.filter(a => a.category === 'KELEMBAGAAN_DAN_KURIKULUM').length;
    const historyCount = archives.filter(a => a.category === 'SEJARAH_DAN_PRESTASI').length;
    const verifiedCount = archives.filter(a => a.verificationStatus === 'TERVERIFIKASI_RESMI').length;
    return { total, academicCount, legalCount, financialCount, curriculumCount, historyCount, verifiedCount };
  }, [archives]);

  // Selected Student for Dossier
  const currentDossierStudent = useMemo(() => {
    return students.find(s => s.id === selectedDossierStudentId) || students[0];
  }, [students, selectedDossierStudentId]);

  // Student specific multi-year e-raports
  const studentMultiYearRaports = useMemo(() => {
    if (!currentDossierStudent) return [];
    return eRaports.filter(r => 
      r.studentId === currentDossierStudent.id || 
      r.nisn === currentDossierStudent.nis || 
      r.nisn === currentDossierStudent.nisn ||
      r.studentName.toLowerCase() === currentDossierStudent.name.toLowerCase()
    ).sort((a, b) => b.academicYear.localeCompare(a.academicYear));
  }, [eRaports, currentDossierStudent]);

  // Student specific archive documents (certificates, SKL, awards)
  const studentSpecificArchives = useMemo(() => {
    if (!currentDossierStudent) return [];
    return archives.filter(a => 
      a.studentId === currentDossierStudent.id || 
      a.nisn === currentDossierStudent.nis ||
      a.studentName?.toLowerCase() === currentDossierStudent.name.toLowerCase() ||
      a.tags?.some(t => t.toLowerCase().includes(currentDossierStudent.name.toLowerCase()))
    );
  }, [archives, currentDossierStudent]);

  // Auto-Sync E-Raports into Archives
  const handleTriggerAutoSync = () => {
    if (onSyncRaportsToArchive) {
      onSyncRaportsToArchive();
      setSyncNotice('Seluruh e-raport semester ganjil dan genap berhasil disinkronkan ke dalam Arsip Kehidupan Yayasan.');
      setTimeout(() => setSyncNotice(null), 4000);
      return;
    }

    // Default internal syncer if not provided
    const newDocs: FoundationArchiveDocument[] = [];
    const groupedYears: string[] = Array.from(new Set(eRaports.map((r): string => r.academicYear || '2026/2027 Semester Ganjil')));

    groupedYears.forEach((ay: string) => {
      const yearDocs = eRaports.filter(r => r.academicYear === ay);
      const isAlreadyArchived = archives.some(a => a.academicYear === ay && a.category === 'RAPORT_DAN_AKADEMIK');
      
      if (!isAlreadyArchived && yearDocs.length > 0) {
        const calYear = parseInt(ay.split('/')[0]) || 2026;
        const sem = ay.includes('Genap') ? 'Genap' : 'Ganjil';
        newDocs.push({
          id: `arc-auto-rap-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          documentNumber: `ARSIP/RAP/${ay.replace(/\//g, '-')}/${sem.toUpperCase()}`,
          title: `Kumpulan E-Raport Siswa Lengkap (${ay})`,
          category: 'RAPORT_DAN_AKADEMIK',
          academicYear: ay.split(' ')[0],
          calendarYear: calYear,
          semester: sem,
          gradeClass: 'Semua Rombel',
          issuerName: 'SDIT EL-FATAH Yayasan Pendidikan Daarul Habibah',
          issuedDate: new Date().toISOString().split('T')[0],
          fileType: 'DIGITAL_RECORD',
          fileName: `Kumpulan_Raport_${ay.replace(/[\/\s]/g, '_')}.pdf`,
          fileSizeBytes: yearDocs.length * 280000,
          description: `Master arsip digital nilai raport ${yearDocs.length} siswa SDIT EL-FATAH untuk periode ${ay} dengan verifikasi resmi kepala sekolah dan wali kelas.`,
          tags: ['E-Raport', 'Sinkronisasi Otomatis', 'Arsip Digital', 'Kurikulum Merdeka'],
          verifiedBy: 'Masykur Rohana, S.Sos (Kepala Sekolah)',
          verificationStatus: 'TERVERIFIKASI_RESMI',
          archivedAt: new Date().toISOString(),
          confidentialityLevel: 'RAHASIA_SISWA',
          metadata: { totalSiswa: yearDocs.length, tahunAjaran: ay },
        });
      }
    });

    if (newDocs.length > 0) {
      newDocs.forEach(d => onAddArchive(d));
      setSyncNotice(`Berhasil menambahkan ${newDocs.length} arsip e-raport digital baru ke sistem.`);
    } else {
      setSyncNotice('Semua data E-Raport sudah tersinkronisasi lengkap dengan Arsip Digital Yayasan.');
    }
    setTimeout(() => setSyncNotice(null), 4000);
  };

  // Handle File Upload Conversion
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormFileName(file.name);
    const ext = file.name.split('.').pop()?.toUpperCase();
    if (ext === 'PDF') setFormFileType('PDF');
    else if (ext === 'XLSX' || ext === 'XLS') setFormFileType('EXCEL');
    else if (['JPG', 'JPEG', 'PNG', 'WEBP'].includes(ext || '')) setFormFileType('IMAGE');
    else if (['DOC', 'DOCX'].includes(ext || '')) setFormFileType('DOC');

    // Convert file to Base64 data URL for local persistence
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFormAttachedData(result);
    };
    reader.readAsDataURL(file);
  };

  // Submit Add or Edit Document
  const handleSubmitDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formNumber.trim()) return;

    const tagsArray = formTags.split(',').map(t => t.trim()).filter(Boolean);

    if (editingDocId) {
      const existing = archives.find(a => a.id === editingDocId);
      if (existing) {
        const updated: FoundationArchiveDocument = {
          ...existing,
          documentNumber: formNumber,
          title: formTitle,
          category: formCategory,
          academicYear: formAcademicYear,
          calendarYear: formCalendarYear,
          semester: formSemester,
          gradeClass: formGradeClass,
          issuerName: formIssuerName,
          issuedDate: formIssuedDate,
          fileType: formFileType,
          fileName: formFileName || existing.fileName || `${formTitle}.pdf`,
          fileUrl: formAttachedData || existing.fileUrl,
          description: formDescription,
          tags: tagsArray,
          confidentialityLevel: formConfidentiality,
        };
        onUpdateArchive(updated);
      }
    } else {
      const newDoc: Omit<FoundationArchiveDocument, 'id' | 'archivedAt'> = {
        documentNumber: formNumber,
        title: formTitle,
        category: formCategory,
        academicYear: formAcademicYear,
        calendarYear: formCalendarYear,
        semester: formSemester,
        gradeClass: formGradeClass,
        issuerName: formIssuerName,
        issuedDate: formIssuedDate,
        fileType: formFileType,
        fileName: formFileName || `${formTitle.replace(/\s+/g, '_')}.${formFileType.toLowerCase()}`,
        fileUrl: formAttachedData,
        fileSizeBytes: formAttachedData ? Math.round(formAttachedData.length * 0.75) : 1500000,
        description: formDescription,
        tags: tagsArray,
        verifiedBy: `${currentRole.replace('_', ' ')} (Pencatat Arsip)`,
        verificationStatus: 'TERVERIFIKASI_RESMI',
        confidentialityLevel: formConfidentiality,
      };
      onAddArchive(newDoc);
    }

    setShowAddModal(false);
    setEditingDocId(null);
    resetForm();
  };

  const resetForm = () => {
    setFormNumber(`ARSIP/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`);
    setFormTitle('');
    setFormCategory('RAPORT_DAN_AKADEMIK');
    setFormAcademicYear('2026/2027');
    setFormCalendarYear(2026);
    setFormSemester('Ganjil');
    setFormGradeClass('Semua Rombel');
    setFormIssuerName('SDIT EL-FATAH Yayasan Daarul Habibah');
    setFormIssuedDate(new Date().toISOString().split('T')[0]);
    setFormFileType('PDF');
    setFormFileName('');
    setFormDescription('');
    setFormTags('Arsip Resmi, Kurikulum Merdeka');
    setFormConfidentiality('INTERNAL_YAYASAN');
    setFormAttachedData('');
  };

  const handleOpenEdit = (doc: FoundationArchiveDocument) => {
    setEditingDocId(doc.id);
    setFormNumber(doc.documentNumber);
    setFormTitle(doc.title);
    setFormCategory(doc.category);
    setFormAcademicYear(doc.academicYear || '2026/2027');
    setFormCalendarYear(doc.calendarYear);
    setFormSemester(doc.semester || 'Ganjil');
    setFormGradeClass(doc.gradeClass || 'Semua Rombel');
    setFormIssuerName(doc.issuerName);
    setFormIssuedDate(doc.issuedDate);
    setFormFileType(doc.fileType);
    setFormFileName(doc.fileName || '');
    setFormDescription(doc.description);
    setFormTags(doc.tags?.join(', ') || '');
    setFormConfidentiality(doc.confidentialityLevel || 'INTERNAL_YAYASAN');
    setFormAttachedData(doc.fileUrl || '');
    setShowAddModal(true);
  };

  // Full Database Backup Export (.JSON)
  const handleExportBackupJSON = () => {
    const backupPayload = {
      appName: 'Yayasan Pendidikan Daarul Habibah ERP & Archive Hub',
      exportDate: new Date().toISOString(),
      version: '2.5.0',
      totalRecords: archives.length,
      archives: archives,
      eRaports: eRaports,
      students: students,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `BACKUP_ARSIP_YAYASAN_DAARUL_HABIBAH_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // CSV / Excel Export
  const handleExportCSV = () => {
    const headers = ['No', 'Nomor Dokumen', 'Judul Dokumen', 'Kategori', 'Tahun Kalender', 'Tahun Ajaran', 'Semester', 'Penerbit', 'Tanggal Terbit', 'Tipe File', 'Status Verifikasi', 'Keterangan'];
    const rows = filteredArchives.map((doc, idx) => [
      idx + 1,
      `"${doc.documentNumber}"`,
      `"${doc.title.replace(/"/g, '""')}"`,
      `"${doc.category}"`,
      doc.calendarYear,
      `"${doc.academicYear || '-'}"`,
      `"${doc.semester || '-'}"`,
      `"${doc.issuerName}"`,
      doc.issuedDate,
      doc.fileType,
      doc.verificationStatus,
      `"${doc.description.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DAFTAR_ARSIP_DOKUMEN_YAYASAN_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Import / Restore Backup File (.JSON)
  const handleImportBackupFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed.archives && Array.isArray(parsed.archives)) {
          if (window.confirm(`Konfirmasi pemulihan backup? Ditemukan ${parsed.archives.length} dokumen arsip. Data akan diperbarui.`)) {
            if (onRestoreArchives) {
              onRestoreArchives(parsed.archives);
            } else {
              parsed.archives.forEach((doc: FoundationArchiveDocument) => {
                onAddArchive(doc);
              });
            }
            setSyncNotice(`Pemulihan berhasil! ${parsed.archives.length} dokumen arsip telah dimuat ke dalam memori permanen.`);
            setTimeout(() => setSyncNotice(null), 4000);
            setShowBackupModal(false);
          }
        } else {
          alert('Format file backup tidak valid. Pastikan file berformat JSON backup resmi Yayasan.');
        }
      } catch (err) {
        alert('Gagal membaca file backup JSON: ' + (err as any)?.message);
      }
    };
    reader.readAsText(file);
  };

  // Print Official Document Sheet
  const handlePrintDocumentSheet = (doc: FoundationArchiveDocument) => {
    const printContent = `
      <div style="font-family: 'Times New Roman', serif; padding: 25px; color: #111; line-height: 1.5;">
        <!-- KOP SURAT RESMI YAYASAN -->
        <div style="text-align: center; border-bottom: 3px double #0f172a; padding-bottom: 12px; margin-bottom: 20px;">
          <h3 style="margin: 0; font-size: 14pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">YAYASAN PENDIDIKAN DAARUL HABIBAH</h3>
          <h2 style="margin: 4px 0; font-size: 17pt; font-weight: 800; color: #0284c7; text-transform: uppercase;">SDIT EL-FATAH</h2>
          <p style="margin: 2px 0; font-size: 9.5pt; color: #334155;">NPSN: 69981240 | Akreditasi "A" BAN-S/M | SK Kemenkumham: AHU-0012948.AH.01.04.Tahun 2018</p>
          <p style="margin: 2px 0; font-size: 8.5pt; color: #475569;">Alamat: Jl. Raya Munjul, Desa Munjul, Kec. Solear, Kab. Tangerang, Banten 15730 | Telp: (021) 5978-2234</p>
        </div>

        <!-- LEMBAR ARSIP RESMI -->
        <div style="text-align: center; margin-bottom: 25px;">
          <h3 style="margin: 0; font-size: 13pt; font-weight: bold; text-decoration: underline; text-transform: uppercase;">LEMBAR ARSIP DOKUMEN RESMI KEHIDUPAN YAYASAN</h3>
          <p style="margin: 4px 0 0 0; font-size: 10pt; font-weight: 600; color: #334155;">Nomor Registrasi Arsip: ${doc.documentNumber}</p>
        </div>

        <!-- METADATA DOKUMEN -->
        <table style="width: 100%; font-size: 10.5pt; margin-bottom: 20px; border-collapse: collapse;">
          <tr>
            <td style="width: 28%; padding: 6px 0; font-weight: bold;">Judul Dokumen</td>
            <td style="width: 2%;">:</td>
            <td style="padding: 6px 0; font-weight: bold; color: #0f172a;">${doc.title}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">Klasifikasi / Kategori</td>
            <td>:</td>
            <td style="padding: 6px 0;">${doc.category.replace(/_/g, ' ')}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">Tahun Kalender / Ajaran</td>
            <td>:</td>
            <td style="padding: 6px 0;">Tahun ${doc.calendarYear} ${doc.academicYear ? `(Tahun Ajaran ${doc.academicYear} ${doc.semester ? `Semester ${doc.semester}` : ''})` : ''}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">Instansi / Pejabat Penerbit</td>
            <td>:</td>
            <td style="padding: 6px 0;">${doc.issuerName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">Tanggal Terbit Resmi</td>
            <td>:</td>
            <td style="padding: 6px 0;">${new Date(doc.issuedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">Status Keaslian & Verifikasi</td>
            <td>:</td>
            <td style="padding: 6px 0; color: #059669; font-weight: bold;">TERVERIFIKASI RESMI DI DALAM DATABASE YAYASAN</td>
          </tr>
          ${doc.studentName ? `
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">Nama Siswa Terkait</td>
            <td>:</td>
            <td style="padding: 6px 0; font-weight: bold;">${doc.studentName} (NISN: ${doc.nisn || '-'}) - ${doc.gradeClass || '-'}</td>
          </tr>
          ` : ''}
        </table>

        <!-- DESKRIPSI DAN RINGKASAN ARSIP -->
        <div style="border: 1px solid #cbd5e1; background-color: #f8fafc; padding: 15px; border-radius: 6px; margin-bottom: 25px;">
          <h4 style="margin: 0 0 8px 0; font-size: 10.5pt; font-weight: bold; color: #1e293b; text-transform: uppercase;">Ringkasan dan Uraian Dokumen:</h4>
          <p style="margin: 0; font-size: 10pt; line-height: 1.6; color: #334155; text-align: justify;">${doc.description}</p>
        </div>

        <!-- CAP DIGITAL & TANDA TANGAN -->
        <div style="margin-top: 40px; display: flex; justify-content: space-between; page-break-inside: avoid;">
          <div style="width: 45%; text-align: center;">
            <p style="margin: 0; font-size: 9.5pt; color: #64748b;">Petugas Verifikator Arsip,</p>
            <div style="height: 65px; display: flex; align-items: center; justify-content: center;">
              <div style="border: 2px solid #0284c7; padding: 4px 10px; border-radius: 4px; color: #0284c7; font-size: 8pt; font-weight: bold; transform: rotate(-3deg);">
                ✓ DIGITAL ARCHIVE VERIFIED<br>YPDH REPOSITORY
              </div>
            </div>
            <p style="margin: 0; font-weight: bold; font-size: 10pt;">${doc.verifiedBy || 'Tim Arsip Digital Yayasan'}</p>
            <p style="margin: 2px 0 0 0; font-size: 8.5pt; color: #64748b;">Divisi Tata Kelola & Dokumen</p>
          </div>

          <div style="width: 45%; text-align: center;">
            <p style="margin: 0; font-size: 9.5pt; color: #64748b;">Tangerang, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p style="margin: 2px 0 0 0; font-size: 9.5pt; font-weight: bold;">Kepala Sekolah SDIT EL-FATAH</p>
            <div style="height: 65px; display: flex; align-items: center; justify-content: center;">
              <div style="border: 2px dashed #059669; padding: 4px 12px; border-radius: 4px; color: #059669; font-size: 8.5pt; font-weight: bold;">
                [ TERCATAT DALAM BUKU INDUK ARSIP ]
              </div>
            </div>
            <p style="margin: 0; font-weight: bold; font-size: 10pt; text-decoration: underline;">Masykur Rohana, S.Sos</p>
            <p style="margin: 2px 0 0 0; font-size: 8.5pt; color: #64748b;">NIPY. 20190701 | Kepala Sekolah</p>
          </div>
        </div>

        <div style="margin-top: 30px; font-size: 7.5pt; color: #94a3b8; text-align: center; border-top: 1px dashed #cbd5e1; padding-top: 8px;">
          Dokumen ini diterbitkan secara sah melalui Sistem Manajemen Arsip Digital Yayasan Pendidikan Daarul Habibah & SDIT EL-FATAH.
        </div>
      </div>
    `;

    printDocument(printContent, `Arsip_${doc.documentNumber.replace(/[\/\s]/g, '_')}`);
  };

  const getCategoryBadge = (cat: ArchiveCategory) => {
    switch (cat) {
      case 'RAPORT_DAN_AKADEMIK':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200"><GraduationCap className="w-3.5 h-3.5" /> Raport & Akademik</span>;
      case 'LEGALITAS_DAN_SK':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200"><ShieldCheck className="w-3.5 h-3.5" /> Legalitas & SK</span>;
      case 'KEUANGAN_DAN_AUDIT':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"><DollarSign className="w-3.5 h-3.5" /> Keuangan & Audit</span>;
      case 'KELEMBAGAAN_DAN_KURIKULUM':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200"><BookOpen className="w-3.5 h-3.5" /> Kurikulum & Akreditasi</span>;
      case 'SEJARAH_DAN_PRESTASI':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200"><Landmark className="w-3.5 h-3.5" /> Sejarah & Prestasi</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200"><FileText className="w-3.5 h-3.5" /> Dokumen</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER & CALL TO ACTION */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                <Database className="w-3.5 h-3.5" /> Multi-Year Digital Archive Hub
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <ShieldCheck className="w-3.5 h-3.5" /> Arsip Seumur Hidup
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <FolderArchive className="w-8 h-8 text-blue-400" />
              Arsip Kehidupan Yayasan & Dokumen Siswa
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
              Pusat repositori arsip permanen seluruh dokumen kehidupan Yayasan Pendidikan Daarul Habibah & SDIT EL-FATAH: E-Raport digital multi-tahun, Leger Nilai, Buku Induk Siswa, SK Kemenkumham, Akta Notaris, Laporan Keuangan Tahunan ISAK 35, LPJ BOS, dan Akreditasi Sekolah.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleTriggerAutoSync}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-all shadow-md active:scale-95"
              title="Sinkronkan data E-Raport semester aktif dan historis ke repositori arsip"
            >
              <RefreshCw className="w-4 h-4" /> Sinkronkan E-Raport
            </button>
            <button
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-medium transition-all shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4" /> Tambah Dokumen Arsip
            </button>
            <button
              onClick={() => setShowBackupModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-sm font-medium transition-all shadow-md active:scale-95"
            >
              <Database className="w-4 h-4" /> Backup & Restore
            </button>
          </div>
        </div>

        {/* Sync Notification Banner */}
        {syncNotice && (
          <div className="mt-4 p-3.5 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-200 text-sm flex items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{syncNotice}</span>
            </div>
            <button onClick={() => setSyncNotice(null)} className="text-emerald-400 hover:text-white font-bold text-xs">TUTUP</button>
          </div>
        )}
      </div>

      {/* STATISTICAL SUMMARY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div 
          onClick={() => setActiveCategory('ALL')}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${activeCategory === 'ALL' ? 'bg-blue-50 border-blue-400 shadow-md' : 'bg-white border-slate-200 hover:border-slate-300'}`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Semua Arsip</span>
            <Archive className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
          <span className="text-[11px] text-blue-600 font-medium">Seluruh Kategori</span>
        </div>

        <div 
          onClick={() => setActiveCategory('RAPORT_DAN_AKADEMIK')}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${activeCategory === 'RAPORT_DAN_AKADEMIK' ? 'bg-blue-50 border-blue-400 shadow-md' : 'bg-white border-slate-200 hover:border-slate-300'}`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Raport & Akademik</span>
            <GraduationCap className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.academicCount}</div>
          <span className="text-[11px] text-blue-600 font-medium">Multi-Tahun Siswa</span>
        </div>

        <div 
          onClick={() => setActiveCategory('LEGALITAS_DAN_SK')}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${activeCategory === 'LEGALITAS_DAN_SK' ? 'bg-purple-50 border-purple-400 shadow-md' : 'bg-white border-slate-200 hover:border-slate-300'}`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Legalitas & SK</span>
            <ShieldCheck className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.legalCount}</div>
          <span className="text-[11px] text-purple-600 font-medium">Akta & SK Kemenkumham</span>
        </div>

        <div 
          onClick={() => setActiveCategory('KEUANGAN_DAN_AUDIT')}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${activeCategory === 'KEUANGAN_DAN_AUDIT' ? 'bg-emerald-50 border-emerald-400 shadow-md' : 'bg-white border-slate-200 hover:border-slate-300'}`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Keuangan ISAK 35</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.financialCount}</div>
          <span className="text-[11px] text-emerald-600 font-medium">LPJ BOS & Laporan Tahunan</span>
        </div>

        <div 
          onClick={() => setActiveCategory('KELEMBAGAAN_DAN_KURIKULUM')}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${activeCategory === 'KELEMBAGAAN_DAN_KURIKULUM' ? 'bg-amber-50 border-amber-400 shadow-md' : 'bg-white border-slate-200 hover:border-slate-300'}`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Kurikulum & Akreditasi</span>
            <BookOpen className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.curriculumCount}</div>
          <span className="text-[11px] text-amber-600 font-medium">KOSP & BAN-S/M "A"</span>
        </div>

        <div 
          onClick={() => setActiveCategory('STUDENT_DOSSIER')}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${activeCategory === 'STUDENT_DOSSIER' ? 'bg-rose-50 border-rose-400 shadow-md' : 'bg-white border-slate-200 hover:border-slate-300'}`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Dossier Siswa</span>
            <Users className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{students.length}</div>
          <span className="text-[11px] text-rose-600 font-medium">Rekam Jejak Seumur Hidup</span>
        </div>
      </div>

      {/* CATEGORY TABS NAVIGATION */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveCategory('ALL')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${activeCategory === 'ALL' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
        >
          <Archive className="w-4 h-4" /> Semua Dokumen ({stats.total})
        </button>
        <button
          onClick={() => setActiveCategory('RAPORT_DAN_AKADEMIK')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${activeCategory === 'RAPORT_DAN_AKADEMIK' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
        >
          <GraduationCap className="w-4 h-4" /> E-Raport & Nilai Multi-Tahun
        </button>
        <button
          onClick={() => setActiveCategory('LEGALITAS_DAN_SK')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${activeCategory === 'LEGALITAS_DAN_SK' ? 'bg-purple-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
        >
          <ShieldCheck className="w-4 h-4" /> Legalitas, SK & Tata Kelola
        </button>
        <button
          onClick={() => setActiveCategory('KEUANGAN_DAN_AUDIT')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${activeCategory === 'KEUANGAN_DAN_AUDIT' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
        >
          <DollarSign className="w-4 h-4" /> Keuangan, LPJ & Audit
        </button>
        <button
          onClick={() => setActiveCategory('KELEMBAGAAN_DAN_KURIKULUM')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${activeCategory === 'KELEMBAGAAN_DAN_KURIKULUM' ? 'bg-amber-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
        >
          <BookOpen className="w-4 h-4" /> Kurikulum & Akreditasi
        </button>
        <button
          onClick={() => setActiveCategory('SEJARAH_DAN_PRESTASI')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${activeCategory === 'SEJARAH_DAN_PRESTASI' ? 'bg-rose-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
        >
          <Landmark className="w-4 h-4" /> Sejarah & Prestasi
        </button>
        <button
          onClick={() => setActiveCategory('STUDENT_DOSSIER')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${activeCategory === 'STUDENT_DOSSIER' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
        >
          <Users className="w-4 h-4" /> Dossier & Buku Induk Siswa
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      {activeCategory === 'STUDENT_DOSSIER' ? (
        /* ==================== DOSSIER REKAM JEJAK SISWA SEUMUR HIDUP ==================== */
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-6 h-6 text-indigo-600" />
                  Buku Induk Digital & Rekam Jejak Kehidupan Siswa
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Transkrip historis multi-tahun dari pendaftaran, riwayat seluruh semester E-Raport (Kelas 1 - Kelas 6), absensi, dan piagam prestasi.
                </p>
              </div>

              {/* Selector Siswa */}
              <div className="w-full md:w-72">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Pilih Peserta Didik:</label>
                <select
                  value={selectedDossierStudentId}
                  onChange={(e) => setSelectedDossierStudentId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-medium bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.gradeClass} - NIS: {s.nis})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Profile Bio Card */}
            {currentDossierStudent && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6 p-5 bg-gradient-to-br from-indigo-50/50 via-slate-50 to-blue-50/40 rounded-xl border border-indigo-100">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Identitas Siswa</span>
                  <div className="text-base font-bold text-slate-900">{currentDossierStudent.name}</div>
                  <div className="text-xs text-slate-600">NIS: {currentDossierStudent.nis} | NISN: {currentDossierStudent.nisn || '-'}</div>
                  <div className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
                    {currentDossierStudent.gradeClass}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Data Orang Tua & Kontak</span>
                  <div className="text-sm font-medium text-slate-800">Wali: {currentDossierStudent.parentName || '-'}</div>
                  <div className="text-xs text-slate-600">Telp: {currentDossierStudent.contactPhone}</div>
                  <div className="text-xs text-slate-600 truncate">Alamat: {currentDossierStudent.address || 'Kabupaten Tangerang'}</div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status Keuangan & SPP</span>
                  <div className="text-sm font-bold text-slate-800">SPP: Rp {currentDossierStudent.sppAmount?.toLocaleString('id-ID')} / bln</div>
                  <div className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-3 h-3" /> Status: {currentDossierStudent.sppStatus}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Arsip Tersimpan</span>
                  <div className="text-2xl font-bold text-indigo-600">{studentMultiYearRaports.length + studentSpecificArchives.length} Berkas</div>
                  <div className="text-xs text-slate-500">{studentMultiYearRaports.length} Raport Semester • {studentSpecificArchives.length} Sertifikat/Dokumen</div>
                </div>
              </div>
            )}
          </div>

          {/* Chronological Timeline of E-Raports across all academic years */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              Riwayat E-Raport Multi-Tahun Siswa (Kelas 1 s/d Kelas 6)
            </h3>

            {studentMultiYearRaports.length > 0 ? (
              <div className="space-y-4">
                {studentMultiYearRaports.map((raport, idx) => {
                  const avg = Math.round(raport.grades.reduce((a, b) => a + b.score, 0) / (raport.grades.length || 1));
                  return (
                    <div key={raport.id} className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-sm bg-slate-50/50 transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/70">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                            #{idx + 1}
                          </span>
                          <div>
                            <div className="font-bold text-slate-900 text-base">{raport.academicYear} — {raport.gradeClass}</div>
                            <div className="text-xs text-slate-500">Wali Kelas: {raport.teacherName} • Diterbitkan: {raport.issuedDate}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="text-xs text-slate-500">Rerata Nilai:</span>
                            <div className="text-base font-bold text-blue-700">{avg} / 100</div>
                          </div>
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                            {raport.status}
                          </span>
                        </div>
                      </div>

                      {/* Subject Scores Preview */}
                      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                        {raport.grades.slice(0, 6).map((g, gIdx) => (
                          <div key={gIdx} className="p-2 rounded-lg bg-white border border-slate-200 text-center">
                            <div className="text-[11px] font-semibold text-slate-600 truncate" title={g.subject}>{g.subject}</div>
                            <div className="text-sm font-bold text-slate-900 mt-0.5">{g.score} <span className="text-xs text-blue-600">({g.letterGrade})</span></div>
                          </div>
                        ))}
                      </div>

                      {/* Notes & Actions */}
                      <div className="mt-3 pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
                        <p className="italic max-w-xl truncate">"{raport.teacherNotes}"</p>
                        <button
                          onClick={() => {
                            // Find matching archive or print
                            handlePrintDocumentSheet({
                              id: raport.id,
                              documentNumber: `RAP/${raport.academicYear.replace(/[\/\s]/g, '-')}/${raport.nisn}`,
                              title: `E-Raport Digital Resmi: ${raport.studentName} (${raport.academicYear})`,
                              category: 'RAPORT_DAN_AKADEMIK',
                              calendarYear: parseInt(raport.academicYear.split('/')[0]) || 2026,
                              academicYear: raport.academicYear,
                              gradeClass: raport.gradeClass,
                              studentId: raport.studentId,
                              studentName: raport.studentName,
                              nisn: raport.nisn,
                              issuerName: `SDIT EL-FATAH (Wali Kelas: ${raport.teacherName})`,
                              issuedDate: raport.issuedDate,
                              fileType: 'PDF',
                              description: `Lembar hasil belajar siswa ${raport.studentName} pada ${raport.academicYear} ${raport.gradeClass}. Rata-rata nilai: ${avg}/100. Catatan Wali Kelas: ${raport.teacherNotes}`,
                              tags: ['Raport', 'Kurikulum Merdeka', raport.gradeClass],
                              verifiedBy: 'Masykur Rohana, S.Sos (Kepala Sekolah)',
                              verificationStatus: 'TERVERIFIKASI_RESMI',
                              archivedAt: raport.issuedDate,
                            });
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-semibold transition-all shrink-0"
                        >
                          <Printer className="w-3.5 h-3.5" /> Cetak Raport Semester Ini
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-500">
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="font-medium text-slate-700">Belum ada rekam jejak e-raport multi-tahun untuk siswa ini.</p>
                <p className="text-xs text-slate-500 mt-1">Gunakan tombol "Sinkronkan E-Raport" di bagian atas untuk mengisi seluruh arsip semester otomatis.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ==================== GENERAL ARCHIVE TABLE & FILTERS ==================== */
        <div className="space-y-4">
          {/* SEARCH & FILTER BAR */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:w-80 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari no. SK, judul arsip, nama siswa, kata kunci..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 focus:bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              {/* Year Filter */}
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-medium text-slate-600">Tahun:</span>
                <select
                  value={selectedCalendarYear}
                  onChange={(e) => setSelectedCalendarYear(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none"
                >
                  <option value="ALL">Semua Tahun</option>
                  {availableCalendarYears.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              {/* Academic Year Filter */}
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <GraduationCap className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-medium text-slate-600">T.A:</span>
                <select
                  value={selectedAcademicYear}
                  onChange={(e) => setSelectedAcademicYear(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none"
                >
                  <option value="ALL">Semua T.A</option>
                  {availableAcademicYears.map(ay => (
                    <option key={ay} value={ay}>{ay}</option>
                  ))}
                </select>
              </div>

              {/* Class Filter */}
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <Layers className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-medium text-slate-600">Rombel:</span>
                <select
                  value={selectedGradeClass}
                  onChange={(e) => setSelectedGradeClass(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none"
                >
                  <option value="ALL">Semua Rombel</option>
                  <option value="Kelas 1">Kelas 1</option>
                  <option value="Kelas 2">Kelas 2</option>
                  <option value="Kelas 3">Kelas 3</option>
                  <option value="Kelas 4">Kelas 4</option>
                  <option value="Kelas 5">Kelas 5</option>
                  <option value="Kelas 6">Kelas 6</option>
                </select>
              </div>

              {/* Export CSV Button */}
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
                title="Ekspor daftar arsip ke file Excel / CSV"
              >
                <Download className="w-3.5 h-3.5" /> Ekspor CSV
              </button>
            </div>
          </div>

          {/* ARCHIVE DOCUMENT CARDS / TABLE */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-600" />
                  Daftar Master Arsip Kehidupan Yayasan & Dokumen Siswa
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Menampilkan {filteredArchives.length} dari total {archives.length} dokumen terarsip permanen.
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredArchives.length > 0 ? (
                filteredArchives.map((doc) => (
                  <div key={doc.id} className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1.5 max-w-3xl">
                      <div className="flex flex-wrap items-center gap-2">
                        {getCategoryBadge(doc.category)}
                        <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {doc.documentNumber}
                        </span>
                        <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          Tahun {doc.calendarYear} {doc.academicYear ? `• T.A ${doc.academicYear}` : ''}
                        </span>
                        {doc.gradeClass && doc.gradeClass !== 'Semua Rombel' && (
                          <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                            {doc.gradeClass}
                          </span>
                        )}
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                          <Check className="w-3 h-3" /> {doc.verificationStatus}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900 leading-snug">
                        {doc.title}
                      </h4>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {doc.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                        <span>Penerbit: <strong className="text-slate-700">{doc.issuerName}</strong></span>
                        <span>•</span>
                        <span>Tanggal: <strong className="text-slate-700">{doc.issuedDate}</strong></span>
                        <span>•</span>
                        <span>Tipe File: <strong className="text-blue-700">{doc.fileType} ({doc.fileName || 'dokumen.pdf'})</strong></span>
                      </div>

                      {/* Tags */}
                      {doc.tags && doc.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {doc.tags.map((t, idx) => (
                            <span key={idx} className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                      <button
                        onClick={() => setSelectedDocPreview(doc)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
                        title="Lihat Pratinjau Detail Dokumen"
                      >
                        <Eye className="w-3.5 h-3.5" /> Pratinjau
                      </button>

                      <button
                        onClick={() => handlePrintDocumentSheet(doc)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold transition-all"
                        title="Cetak Lembar Dokumen Resmi / Ekspor PDF"
                      >
                        <Printer className="w-3.5 h-3.5" /> Cetak Lembar Resmi
                      </button>

                      {['SUPERADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH'].includes(currentRole) && (
                        <>
                          <button
                            onClick={() => handleOpenEdit(doc)}
                            className="p-2 hover:bg-amber-50 text-slate-500 hover:text-amber-600 rounded-lg transition-colors"
                            title="Edit Dokumen"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Hapus dokumen arsip "${doc.title}" dari database permanen?`)) {
                                onDeleteArchive(doc.id);
                              }
                            }}
                            className="p-2 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-lg transition-colors"
                            title="Hapus Dokumen"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-slate-500">
                  <Archive className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="font-semibold text-slate-700 text-base">Tidak ada dokumen arsip yang sesuai dengan filter.</p>
                  <p className="text-xs text-slate-500 mt-1">Coba ubah filter kategori, tahun ajaran, atau kata kunci pencarian Anda.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL: ADD / EDIT ARCHIVE DOCUMENT ==================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FolderArchive className="w-6 h-6 text-blue-600" />
                {editingDocId ? 'Edit Dokumen Arsip Yayasan' : 'Pencatatan Dokumen Arsip Baru'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingDocId(null);
                }}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitDocument} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nomor Registrasi Dokumen / SK *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: SK/YPDH/2026/001 atau ARSIP/2026/04"
                    value={formNumber}
                    onChange={(e) => setFormNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Klasifikasi Arsip *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ArchiveCategory)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="RAPORT_DAN_AKADEMIK">🎓 E-Raport & Akademik Siswa Multi-Tahun</option>
                    <option value="LEGALITAS_DAN_SK">📜 Legalitas, SK & Tata Kelola Yayasan</option>
                    <option value="KEUANGAN_DAN_AUDIT">💰 Keuangan, LPJ BOS & Audit Tahunan</option>
                    <option value="KELEMBAGAAN_DAN_KURIKULUM">📚 Kelembagaan, Kurikulum KOSP & Akreditasi</option>
                    <option value="SEJARAH_DAN_PRESTASI">🏛️ Sejarah, Kilas Balik & Prestasi Yayasan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul Dokumen Resmi *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Laporan Keuangan Tahunan ISAK 35 Tahun 2025"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tahun Kalender *</label>
                  <input
                    type="number"
                    required
                    min={2015}
                    max={2035}
                    value={formCalendarYear}
                    onChange={(e) => setFormCalendarYear(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tahun Ajaran (Jika Ada)</label>
                  <select
                    value={formAcademicYear}
                    onChange={(e) => setFormAcademicYear(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="2026/2027">2026/2027</option>
                    <option value="2025/2026">2025/2026</option>
                    <option value="2024/2025">2024/2025</option>
                    <option value="2023/2024">2023/2024</option>
                    <option value="2022/2023">2022/2023</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Semester / Periode</label>
                  <select
                    value={formSemester}
                    onChange={(e) => setFormSemester(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Ganjil">Semester Ganjil</option>
                    <option value="Genap">Semester Genap</option>
                    <option value="Tahunan">Tahunan (1 Tahun Penuh)</option>
                    <option value="Semua">Semua Periode</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Instansi / Pejabat Penerbit *</label>
                  <input
                    type="text"
                    required
                    value={formIssuerName}
                    onChange={(e) => setFormIssuerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Terbit Resmi *</label>
                  <input
                    type="date"
                    required
                    value={formIssuedDate}
                    onChange={(e) => setFormIssuedDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Uraian & Ringkasan Dokumen *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Jelaskan isi pokok, maksud, dan ringkasan dokumen untuk keperluan penelusuran sejarah masa depan..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Unggah Lampiran File (PDF/Excel/Gambar)</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".pdf,.xlsx,.xls,.doc,.docx,.jpg,.jpeg,.png"
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />
                  {formFileName && (
                    <p className="text-xs text-emerald-600 font-medium mt-1">✓ Berkas terpilih: {formFileName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kata Kunci / Tag (Pisahkan dengan koma)</label>
                  <input
                    type="text"
                    placeholder="Contoh: ISAK 35, Neraca, BOS 2026, SK Guru"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingDocId(null);
                  }}
                  className="px-5 py-2.5 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-sm font-medium transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold shadow-md transition-all active:scale-95"
                >
                  {editingDocId ? 'Simpan Perubahan' : 'Simpan ke Arsip Digital'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL: PREVIEW DOCUMENT DETAILS ==================== */}
      {selectedDocPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FolderArchive className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">Pratinjau Dokumen Arsip Resmi</h3>
              </div>
              <button
                onClick={() => setSelectedDocPreview(null)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {selectedDocPreview.documentNumber}
                  </span>
                  {getCategoryBadge(selectedDocPreview.category)}
                </div>
                <h2 className="text-xl font-bold text-slate-900">{selectedDocPreview.title}</h2>
                <p className="text-xs text-slate-500">
                  Diterbitkan oleh <strong>{selectedDocPreview.issuerName}</strong> pada {selectedDocPreview.issuedDate}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 font-medium">Tahun Kalender:</span>
                  <div className="font-bold text-slate-800 text-sm mt-0.5">{selectedDocPreview.calendarYear}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 font-medium">Tahun Ajaran:</span>
                  <div className="font-bold text-slate-800 text-sm mt-0.5">{selectedDocPreview.academicYear || '-'}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 font-medium">Format File:</span>
                  <div className="font-bold text-blue-700 text-sm mt-0.5">{selectedDocPreview.fileType}</div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Uraian & Ringkasan:</span>
                <p className="text-sm text-slate-800 leading-relaxed">{selectedDocPreview.description}</p>
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                  <div>
                    <div className="text-sm font-bold text-emerald-900">Arsip Terverifikasi Resmi</div>
                    <div className="text-xs text-emerald-700">Diverifikasi oleh: {selectedDocPreview.verifiedBy || 'Ketua & Kepala Sekolah'}</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  TERSIMPAN
                </span>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedDocPreview(null)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  handlePrintDocumentSheet(selectedDocPreview);
                  setSelectedDocPreview(null);
                }}
                className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md transition-all"
              >
                <Printer className="w-4 h-4" /> Cetak Lembar Dokumen Resmi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL: BACKUP & RESTORE HUB ==================== */}
      {showBackupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Database className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">Pusat Backup & Pemulihan Arsip</h3>
              </div>
              <button
                onClick={() => setShowBackupModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Backup Card */}
              <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-xl border border-blue-100 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-600 text-white rounded-xl">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Unduh Backup Master Database (.JSON)</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Simpan seluruh {archives.length} dokumen arsip dan e-raport ke dalam file aman untuk pencadangan offline di komputer/flashdisk pengurus.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleExportBackupJSON}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95"
                >
                  <Download className="w-4 h-4" /> Unduh File Backup Lengkap (.JSON)
                </button>
              </div>

              {/* Restore Card */}
              <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-xl border border-amber-200 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-600 text-white rounded-xl">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Pulihkan Arsip dari File Backup</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Unggah file backup (.JSON) untuk memulihkan seluruh data riwayat arsip yayasan di masa lalu.
                    </p>
                  </div>
                </div>

                <input
                  type="file"
                  ref={backupImportInputRef}
                  onChange={handleImportBackupFile}
                  accept=".json"
                  className="hidden"
                />

                <button
                  onClick={() => backupImportInputRef.current?.click()}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95"
                >
                  <Upload className="w-4 h-4" /> Pilih File Backup untuk Dipulihkan
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowBackupModal(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
