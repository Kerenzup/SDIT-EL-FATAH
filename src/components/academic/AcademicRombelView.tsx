import React, { useState } from 'react';
import {
  ERaport,
  TeacherJournalRombel,
  Student,
  Teacher,
  UserRole,
  SubjectGrade,
} from '../../types';
import {
  BookOpen,
  GraduationCap,
  CheckCircle2,
  Clock,
  UserCheck,
  PlusCircle,
  Printer,
  FileCheck2,
  XCircle,
  Search,
  Filter,
  Layers,
  Sparkles,
  CreditCard,
  Calendar,
  DollarSign,
  AlertCircle,
  ShieldCheck,
  Edit,
  Trash2,
  Table,
  LayoutGrid,
  FileSpreadsheet,
  User,
  Users,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { printDocument } from '../../utils/printHelper';

// Helper function to get standardized subjects according to grade level requirement
export const getSubjectsByClass = (gradeClass: string): string[] => {
  const num = gradeClass.replace(/[^0-9]/g, '') || '1';
  switch (num) {
    case '1':
      return ['Tahfidz', 'MTK 1', 'B.Indo 1', 'PPKn 1', 'Seni 1', 'B.Inggris 1'];
    case '2':
      return ['Tahfidz', 'MTK 2', 'B.Indo 2', 'PPKn 2', 'Seni 2', 'B.Inggris 2'];
    case '3':
      return ['Tahfidz', 'MTK 3', 'IPAS 3', 'B.Indo 3', 'PPKn 3', 'Seni 3', 'B.Inggris 3'];
    case '4':
      return ['Tahfidz', 'MTK 4', 'IPAS 4', 'B.Indo 4', 'PPKn 4', 'Seni 4', 'B.Inggris 4'];
    case '5':
      return ['Tahfidz', 'MTK 5', 'IPAS 5', 'B.Indo 5', 'PPKn 5', 'Seni 5', 'B.Inggris 5'];
    case '6':
      return ['Tahfidz', 'MTK 6', 'IPAS 6', 'B.Indo 6', 'PPKn 6', 'Seni 6', 'B.Inggris 6'];
    default:
      return ['Tahfidz', `MTK ${num}`, `B.Indo ${num}`, `PPKn ${num}`, `Seni ${num}`, `B.Inggris ${num}`];
  }
};

const calcLetterGrade = (score: number): 'A' | 'B' | 'C' | 'D' => {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  return 'D';
};

interface AcademicRombelViewProps {
  eRaports: ERaport[];
  teacherJournals: TeacherJournalRombel[];
  students: Student[];
  teachers: Teacher[];
  currentRole: UserRole;
  forcedSubTab?: 'raport' | 'jurnal' | 'spp_bulanan';
  onUpdateRaport: (raport: ERaport) => void;
  onAddRaport: (raport: Omit<ERaport, 'id'>) => void;
  onAddJournal: (journal: Omit<TeacherJournalRombel, 'id' | 'status'>) => void;
  onApproveJournal: (id: string, feedback?: string) => void;
  onApproveRaport: (id: string) => void;
}

export const AcademicRombelView: React.FC<AcademicRombelViewProps> = ({
  eRaports,
  teacherJournals,
  students,
  teachers,
  currentRole,
  forcedSubTab,
  onUpdateRaport,
  onAddRaport,
  onAddJournal,
  onApproveJournal,
  onApproveRaport,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'raport' | 'jurnal' | 'spp_bulanan'>(forcedSubTab || 'raport');

  React.useEffect(() => {
    if (forcedSubTab) {
      setActiveSubTab(forcedSubTab);
    }
  }, [forcedSubTab]);

  const [selectedRombel, setSelectedRombel] = useState<string>('SEMUA');
  const [raportDisplayMode, setRaportDisplayMode] = useState<'table' | 'cards'>('table');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected student for Parent role (Orang Tua)
  const [selectedParentStudentId, setSelectedParentStudentId] = useState<string>(() => {
    const loggedInNis = localStorage.getItem('loggedInParentNis');
    if (loggedInNis) {
      const found = students.find((s) => s.nis === loggedInNis || s.nisn === loggedInNis);
      if (found) return found.id;
    }
    return students[0]?.id || '';
  });

  // Form State for Journal Rombel
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [jurnalRombelClass, setJurnalRombelClass] = useState('Kelas 1');
  const [jurnalSubject, setJurnalSubject] = useState('Matematika');
  const [jurnalTopic, setJurnalTopic] = useState('');
  const [jurnalCompetency, setJurnalCompetency] = useState('');
  const [jurnalMaterial, setJurnalMaterial] = useState('');
  const [teacherNameInput, setTeacherNameInput] = useState('Hj. Fatimah Zahra, S.Pd');

  // Form State for Input/Edit E-Raport Modal
  const [showRaportModal, setShowRaportModal] = useState(false);
  const [editingRaportId, setEditingRaportId] = useState<string | null>(null);

  const [formNis, setFormNis] = useState('20240101');
  const [formAcademicYear, setFormAcademicYear] = useState('2026/2027 Semester Ganjil');
  const [formStudentName, setFormStudentName] = useState('');
  const [formGradeClass, setFormGradeClass] = useState('Kelas 1');
  const [formParentName, setFormParentName] = useState('');
  const [formTeacherName, setFormTeacherName] = useState('Hj. Fatimah Zahra, S.Pd');
  const [formGrades, setFormGrades] = useState<SubjectGrade[]>([]);
  const [formAttendance, setFormAttendance] = useState({ present: 80, sick: 1, permitted: 0, absent: 0 });
  const [formTeacherNotes, setFormTeacherNotes] = useState('Siswa aktif, santun, dan berprestasi tinggi.');
  const [selectedStudentPreset, setSelectedStudentPreset] = useState<string>('');

  // Delete Raport Confirmation
  const [deleteRaportConfirmation, setDeleteRaportConfirmation] = useState<{ id: string; studentName: string } | null>(null);

  // Sync all master data students to ensure complete E-Raport integration
  const integratedRaports: ERaport[] = students.map((std) => {
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
        teacherName: existingRap.teacherName || 'Hj. Fatimah Zahra, S.Pd',
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
      teacherName: 'Hj. Fatimah Zahra, S.Pd',
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

  // Filter Raports
  const filteredRaports = integratedRaports.filter((r) => {
    if (currentRole === 'ORANG_TUA') {
      const parentStudent = students.find((s) => s.id === selectedParentStudentId);
      if (parentStudent) {
        return (
          r.studentId === parentStudent.id ||
          r.nisn === parentStudent.nis ||
          r.studentName.toLowerCase().includes(parentStudent.name.toLowerCase())
        );
      }
    }

    const matchesRombel = selectedRombel === 'SEMUA' || r.gradeClass.includes(selectedRombel);
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      r.studentName.toLowerCase().includes(q) ||
      r.nisn.toLowerCase().includes(q) ||
      (r.parentName && r.parentName.toLowerCase().includes(q)) ||
      (r.teacherName && r.teacherName.toLowerCase().includes(q)) ||
      r.gradeClass.toLowerCase().includes(q);

    return matchesRombel && matchesSearch;
  });

  const filteredJournals = teacherJournals.filter((j) => {
    if (selectedRombel === 'SEMUA') return true;
    return j.rombonganBelajar.includes(selectedRombel);
  });

  // Initialize/Reset Raport Modal Form
  const openNewRaportModal = () => {
    setEditingRaportId(null);
    const firstStd = students[0];
    const initialClass = selectedRombel !== 'SEMUA' ? selectedRombel : firstStd?.gradeClass || 'Kelas 1';
    const initialSubjects = getSubjectsByClass(initialClass);

    setSelectedStudentPreset(firstStd?.id || '');
    setFormNis(firstStd?.nis || firstStd?.nisn || '20240101');
    setFormAcademicYear('2026/2027 Semester Ganjil');
    setFormStudentName(firstStd?.name || 'Nama Siswa Baru');
    setFormGradeClass(initialClass);
    setFormParentName(firstStd?.parentName || 'Bpk. / Ibu Wali Murid');
    setFormTeacherName('Hj. Fatimah Zahra, S.Pd');
    setFormGrades(
      initialSubjects.map((s) => ({
        subject: s,
        score: 88,
        letterGrade: 'B',
        notes: `Capaian pembelajaran ${s} sangat memuaskan.`,
      }))
    );
    setFormAttendance({ present: 80, sick: 1, permitted: 0, absent: 0 });
    setFormTeacherNotes('Siswa yang berakhlak mulia, tekun, dan menjadi teladan di kelas.');
    setShowRaportModal(true);
  };

  // Open Raport Modal for Editing
  const openEditRaportModal = (rap: ERaport) => {
    setEditingRaportId(rap.id);
    setSelectedStudentPreset(rap.studentId || '');
    setFormNis(rap.nisn);
    setFormAcademicYear(rap.academicYear);
    setFormStudentName(rap.studentName);
    setFormGradeClass(rap.gradeClass);
    setFormParentName(rap.parentName || 'Bpk. / Ibu Wali Murid');
    setFormTeacherName(rap.teacherName || 'Hj. Fatimah Zahra, S.Pd');
    setFormGrades(
      rap.grades && rap.grades.length > 0
        ? rap.grades
        : getSubjectsByClass(rap.gradeClass).map((s) => ({
            subject: s,
            score: 85,
            letterGrade: 'B',
            notes: 'Sangat baik.',
          }))
    );
    setFormAttendance(rap.attendance || { present: 80, sick: 0, permitted: 0, absent: 0 });
    setFormTeacherNotes(rap.teacherNotes || 'Tingkatkan motivasi belajar.');
    setShowRaportModal(true);
  };

  // Student preset picker handler inside Modal
  const handleSelectStudentPreset = (stdId: string) => {
    setSelectedStudentPreset(stdId);
    const std = students.find((s) => s.id === stdId);
    if (!std) return;

    setFormNis(std.nis || std.nisn || '20240101');
    setFormStudentName(std.name);
    setFormGradeClass(std.gradeClass);
    setFormParentName(std.parentName || `Bpk/Ibu ${std.name.split(' ')[0]}`);

    // Update subjects to match student's grade class
    const subs = getSubjectsByClass(std.gradeClass);
    setFormGrades(
      subs.map((s) => ({
        subject: s,
        score: 88,
        letterGrade: 'B',
        notes: `Capaian pembelajaran ${s} berkembang dengan sangat baik.`,
      }))
    );
  };

  // Grade Class selector handler inside Modal
  const handleGradeClassChange = (newClass: string) => {
    setFormGradeClass(newClass);
    const newSubs = getSubjectsByClass(newClass);
    setFormGrades(
      newSubs.map((s) => ({
        subject: s,
        score: 88,
        letterGrade: 'B',
        notes: `Capaian pembelajaran ${s} sangat baik.`,
      }))
    );
  };

  // Reset grades to exact grade class subject template
  const handleResetToStandardSubjects = () => {
    const stdSubs = getSubjectsByClass(formGradeClass);
    setFormGrades(
      stdSubs.map((s) => ({
        subject: s,
        score: 88,
        letterGrade: 'B',
        notes: `Capaian pembelajaran ${s} sangat baik.`,
      }))
    );
  };

  // Grade Input Change Handler
  const handleGradeScoreChange = (index: number, scoreVal: number) => {
    const clampedScore = Math.min(100, Math.max(0, scoreVal));
    setFormGrades((prev) =>
      prev.map((g, idx) => {
        if (idx === index) {
          return {
            ...g,
            score: clampedScore,
            letterGrade: calcLetterGrade(clampedScore),
          };
        }
        return g;
      })
    );
  };

  const handleGradeNotesChange = (index: number, notesVal: string) => {
    setFormGrades((prev) =>
      prev.map((g, idx) => (idx === index ? { ...g, notes: notesVal } : g))
    );
  };

  const handleGradeSubjectNameChange = (index: number, nameVal: string) => {
    setFormGrades((prev) =>
      prev.map((g, idx) => (idx === index ? { ...g, subject: nameVal } : g))
    );
  };

  const handleAddSubjectRow = () => {
    setFormGrades((prev) => [
      ...prev,
      {
        subject: 'Mata Pelajaran Tambahan',
        score: 85,
        letterGrade: 'B',
        notes: 'Mengikuti pembelajaran dengan tekun.',
      },
    ]);
  };

  const handleRemoveSubjectRow = (index: number) => {
    if (formGrades.length <= 1) return;
    setFormGrades((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Submit Raport Modal Form
  const handleSaveRaport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formStudentName || !formNis) return;

    if (editingRaportId) {
      const updatedRap: ERaport = {
        id: editingRaportId,
        studentId: selectedStudentPreset || `std-${Date.now()}`,
        studentName: formStudentName,
        nisn: formNis,
        gradeClass: formGradeClass,
        academicYear: formAcademicYear,
        parentName: formParentName,
        teacherName: formTeacherName,
        grades: formGrades,
        attendance: formAttendance,
        extracurriculars: [{ name: 'Pramuka & Tahfizh', grade: 'A', notes: 'Sangat Aktif' }],
        teacherNotes: formTeacherNotes,
        status: 'DITERBITKAN',
        issuedDate: new Date().toISOString().split('T')[0],
      };
      onUpdateRaport(updatedRap);
    } else {
      const newRap: Omit<ERaport, 'id'> = {
        studentId: selectedStudentPreset || `std-${Date.now()}`,
        studentName: formStudentName,
        nisn: formNis,
        gradeClass: formGradeClass,
        academicYear: formAcademicYear,
        parentName: formParentName,
        teacherName: formTeacherName,
        grades: formGrades,
        attendance: formAttendance,
        extracurriculars: [{ name: 'Pramuka & Tahfizh', grade: 'A', notes: 'Sangat Aktif' }],
        teacherNotes: formTeacherNotes,
        status: 'DIUSULKAN_GURU',
        issuedDate: new Date().toISOString().split('T')[0],
      };
      onAddRaport(newRap);
    }

    setShowRaportModal(false);
  };

  const handleCreateJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jurnalTopic) return;

    onAddJournal({
      teacherId: 'tch-2',
      teacherName: teacherNameInput,
      rombonganBelajar: jurnalRombelClass,
      subject: jurnalSubject,
      date: new Date().toISOString().split('T')[0],
      topic: jurnalTopic,
      competencySummary: jurnalCompetency,
      teachingMaterial: jurnalMaterial,
    });

    setJurnalTopic('');
    setJurnalCompetency('');
    setJurnalMaterial('');
    setShowJournalModal(false);
  };

  const isEraportMenu = forcedSubTab === 'raport' || activeSubTab === 'raport' || activeSubTab === 'spp_bulanan';

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 rounded-3xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-700">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-black rounded-full border border-emerald-500/30">
            <GraduationCap className="w-3.5 h-3.5" />
            {isEraportMenu ? 'Sistem E-Raport Kurikulum Merdeka' : 'Modul Jurnal Mengajar Guru Rombel'}
          </div>
          <h2 className="text-2xl font-black text-white">
            {isEraportMenu
              ? 'Tabel Data & Input E-Raport Siswa Rombel'
              : 'Jurnal Mengajar Guru & Verifikasi Kepala Sekolah'}
          </h2>
          <p className="text-xs text-slate-300">
            {isEraportMenu
              ? 'Input data NIS, Tahun Ajaran, Nama, Kelas, Wali Murid, Wali Kelas, serta Nilai Pelajaran sesuai tingkatan Kelas 1 - 6.'
              : 'Dokumentasi materi pembelajaran harian guru rombel dan lembar persetujuan Kepala Sekolah.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {forcedSubTab === 'jurnal' && currentRole !== 'ORANG_TUA' && (
            <button
              onClick={() => setShowJournalModal(true)}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Buat Jurnal Mengajar Rombel</span>
            </button>
          )}

          {forcedSubTab !== 'jurnal' && currentRole !== 'ORANG_TUA' && (
            <button
              onClick={openNewRaportModal}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-2xl shadow-lg flex items-center gap-2 cursor-pointer transition hover:scale-102"
            >
              <PlusCircle className="w-4.5 h-4.5" />
              <span>+ Input Data E-Raport Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* Special Parent Selector Banner */}
      {currentRole === 'ORANG_TUA' && (
        <div className="bg-amber-50 p-5 rounded-3xl border border-amber-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <UserCheck className="w-7 h-7 text-amber-700 shrink-0" />
            <div>
              <span className="text-[10px] font-black uppercase text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full border border-amber-300">
                Akses Khusus Orang Tua / Wali
              </span>
              <h4 className="font-extrabold text-amber-950 text-sm mt-0.5">Informasi Khusus Putra/Putri Anda</h4>
              <p className="text-xs text-amber-800">
                Melihat data E-Raport, nilai mata pelajaran, serta status SPP bulanan.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-2xl border border-amber-300 shadow-xs shrink-0">
            <label className="text-xs font-bold text-amber-950 shrink-0">Pilih Ananda:</label>
            <select
              value={selectedParentStudentId}
              onChange={(e) => setSelectedParentStudentId(e.target.value)}
              className="bg-amber-50 border border-amber-300 rounded-xl px-3 py-1.5 text-xs font-black text-slate-900 shadow-2xs focus:outline-none"
            >
              {students.map((std) => (
                <option key={std.id} value={std.id}>
                  {std.name} ({std.gradeClass} - NIS: {std.nis})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Filter Rombel Class Selector */}
      {currentRole !== 'ORANG_TUA' && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-extrabold text-slate-700">Pilih Rombongan Belajar (Rombel):</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {['SEMUA', 'Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'].map((rom) => (
              <button
                key={rom}
                onClick={() => setSelectedRombel(rom)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedRombel === rom
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {rom}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Sub Tabs (E-Raport vs SPP) */}
      {forcedSubTab !== 'jurnal' && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveSubTab('raport')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
                activeSubTab === 'raport'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Tabel Data E-Raport Siswa ({filteredRaports.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('spp_bulanan')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
                activeSubTab === 'spp_bulanan'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Informasi Status SPP Bulanan (Jan - Des)</span>
            </button>
          </div>

          {activeSubTab === 'raport' && (
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                onClick={() => setRaportDisplayMode('table')}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition ${
                  raportDisplayMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>Tabel Input</span>
              </button>

              <button
                onClick={() => setRaportDisplayMode('cards')}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition ${
                  raportDisplayMode === 'cards' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Kartu Cetak</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ================= E-RAPORT VIEW ================= */}
      {activeSubTab === 'raport' && (
        <div className="space-y-4">
          {/* Search & Actions Bar */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari NIS, Nama, Wali Murid, Wali Kelas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <span className="text-xs font-bold text-slate-500">
                Menampilkan <strong className="text-slate-900">{filteredRaports.length}</strong> E-Raport
              </span>

              {currentRole !== 'ORANG_TUA' && (
                <button
                  onClick={openNewRaportModal}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Input Data E-Raport</span>
                </button>
              )}
            </div>
          </div>

          {/* TABLE DISPLAY MODE */}
          {raportDisplayMode === 'table' ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[11px]">
                      <th className="p-3.5 border-b border-slate-800 text-center w-10">No</th>
                      <th className="p-3.5 border-b border-slate-800">NIS / NISN</th>
                      <th className="p-3.5 border-b border-slate-800">Tahun Ajaran</th>
                      <th className="p-3.5 border-b border-slate-800">Nama Siswa</th>
                      <th className="p-3.5 border-b border-slate-800">Kelas</th>
                      <th className="p-3.5 border-b border-slate-800">Wali Murid</th>
                      <th className="p-3.5 border-b border-slate-800">Wali Kelas</th>
                      <th className="p-3.5 border-b border-slate-800">Mata Pelajaran & Nilai</th>
                      <th className="p-3.5 border-b border-slate-800 text-center">Rata-Rata</th>
                      <th className="p-3.5 border-b border-slate-800 text-center">Status</th>
                      <th className="p-3.5 border-b border-slate-800 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRaports.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="p-8 text-center text-slate-500 italic">
                          Belum ada data E-Raport yang sesuai filter.
                        </td>
                      </tr>
                    ) : (
                      filteredRaports.map((rap, idx) => {
                        const avgScore =
                          rap.grades && rap.grades.length > 0
                            ? Math.round(
                                rap.grades.reduce((acc, g) => acc + g.score, 0) / rap.grades.length
                              )
                            : 0;

                        return (
                          <tr key={rap.id} className="hover:bg-slate-50/80 transition">
                            <td className="p-3.5 text-center font-bold text-slate-400">{idx + 1}</td>

                            <td className="p-3.5">
                              <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                                {rap.nisn}
                              </span>
                            </td>

                            <td className="p-3.5 font-semibold text-slate-700 whitespace-nowrap">
                              {rap.academicYear}
                            </td>

                            <td className="p-3.5">
                              <p className="font-extrabold text-slate-900">{rap.studentName}</p>
                            </td>

                            <td className="p-3.5">
                              <span className="font-extrabold text-[10px] px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                                {rap.gradeClass}
                              </span>
                            </td>

                            <td className="p-3.5 font-medium text-slate-800">
                              {rap.parentName || 'Bpk. / Ibu Wali'}
                            </td>

                            <td className="p-3.5 font-medium text-slate-700">
                              {rap.teacherName}
                            </td>

                            <td className="p-3.5 max-w-xs">
                              <div className="flex flex-wrap gap-1">
                                {rap.grades.map((g, gIdx) => (
                                  <span
                                    key={gIdx}
                                    className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md border border-slate-200"
                                    title={`${g.subject}: ${g.score} (${g.letterGrade})`}
                                  >
                                    {g.subject}: <strong className="text-slate-900">{g.score}</strong>
                                  </span>
                                ))}
                              </div>
                            </td>

                            <td className="p-3.5 text-center font-mono font-black text-slate-900 text-sm">
                              <span
                                className={`px-2 py-0.5 rounded-md ${
                                  avgScore >= 90
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : avgScore >= 80
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {avgScore}
                              </span>
                            </td>

                            <td className="p-3.5 text-center whitespace-nowrap">
                              <span
                                className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                                  rap.status === 'DITERBITKAN'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {rap.status}
                              </span>
                            </td>

                            <td className="p-3.5 text-center whitespace-nowrap">
                              <div className="flex items-center justify-center gap-1.5">
                                {currentRole !== 'ORANG_TUA' && (
                                  <button
                                    onClick={() => openEditRaportModal(rap)}
                                    className="p-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg transition cursor-pointer"
                                    title="Edit Data E-Raport"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                )}

                                <button
                                  onClick={() => printDocument(`raport-card-${rap.id}`, `E-Raport_${rap.studentName}`)}
                                  className="p-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition cursor-pointer"
                                  title="Cetak E-Raport PDF"
                                >
                                  <Printer className="w-3.5 h-3.5 text-emerald-400" />
                                </button>

                                {rap.status === 'DIUSULKAN_GURU' &&
                                  (currentRole === 'SUPERADMIN' || currentRole === 'KEPALA_SEKOLAH') && (
                                    <button
                                      onClick={() => onApproveRaport(rap.id)}
                                      className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition cursor-pointer"
                                      title="Setujui/Terbitkan E-Raport"
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* CARDS DISPLAY MODE */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRaports.map((rap) => (
                <div key={rap.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <span className="text-[10px] font-black px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full uppercase">
                        {rap.gradeClass}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                          rap.status === 'DITERBITKAN'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {rap.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base">{rap.studentName}</h3>
                      <p className="text-xs text-slate-500 font-mono">NIS/NISN: {rap.nisn} &bull; {rap.academicYear}</p>
                      <p className="text-xs text-slate-600 mt-0.5">Wali Murid: <strong>{rap.parentName || 'Orang Tua / Wali'}</strong></p>
                    </div>

                    {/* Subject Grade Highlights */}
                    <div className="space-y-1 bg-slate-50 p-3 rounded-2xl text-xs border border-slate-100">
                      <p className="font-extrabold text-slate-700 text-[11px] uppercase">Rincian Nilai Pelajaran:</p>
                      {rap.grades.map((g, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span className="text-slate-600 text-[11px] truncate max-w-[180px]">{g.subject}</span>
                          <span className="font-mono font-bold text-slate-900 text-[11px]">
                            {g.score} ({g.letterGrade})
                          </span>
                        </div>
                      ))}
                    </div>

                    <p className="text-xs text-slate-600 italic">"{rap.teacherNotes}"</p>
                    <p className="text-[11px] text-slate-400 font-medium">Wali Kelas: {rap.teacherName}</p>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                    {currentRole !== 'ORANG_TUA' && (
                      <button
                        onClick={() => openEditRaportModal(rap)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    )}

                    <button
                      onClick={() => printDocument(`raport-card-${rap.id}`, `E-Raport_${rap.studentName}`)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Cetak E-Raport</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Hidden Print Container for Printable E-Raports */}
          <div className="hidden">
            {filteredRaports.map((rap) => (
              <div key={`print-${rap.id}`} id={`raport-card-${rap.id}`} className="p-8 space-y-4">
                <div className="text-center border-b-2 border-slate-900 pb-3">
                  <h2 className="text-xl font-black">LEMBAR E-RAPORT DIGITAL PESERTA DIDIK</h2>
                  <p className="text-xs font-bold">YAYASAN PENDIDIKAN DAARUL HABIBAH</p>
                  <p className="text-xs text-slate-600">{rap.academicYear}</p>
                </div>

                <div className="grid grid-cols-2 text-xs font-bold gap-2 bg-slate-100 p-3 rounded">
                  <p>Nama Siswa: {rap.studentName}</p>
                  <p>NIS / NISN: {rap.nisn}</p>
                  <p>Rombel / Kelas: {rap.gradeClass}</p>
                  <p>Wali Murid: {rap.parentName || 'Orang Tua / Wali'}</p>
                  <p>Wali Kelas: {rap.teacherName}</p>
                  <p>Tahun Ajaran: {rap.academicYear}</p>
                </div>

                <table className="w-full text-left text-xs border-collapse border border-slate-300">
                  <thead>
                    <tr className="bg-slate-200">
                      <th className="border border-slate-300 p-2">Mata Pelajaran</th>
                      <th className="border border-slate-300 p-2 text-center">Nilai (0-100)</th>
                      <th className="border border-slate-300 p-2 text-center">Predikat</th>
                      <th className="border border-slate-300 p-2">Capaian Kompetensi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rap.grades.map((g, idx) => (
                      <tr key={idx}>
                        <td className="border border-slate-300 p-2 font-bold">{g.subject}</td>
                        <td className="border border-slate-300 p-2 text-center font-mono font-bold">{g.score}</td>
                        <td className="border border-slate-300 p-2 text-center font-bold">{g.letterGrade}</td>
                        <td className="border border-slate-300 p-2">{g.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="p-3 border border-slate-300 rounded text-xs space-y-1">
                  <p className="font-bold">Catatan Wali Kelas:</p>
                  <p className="italic">"{rap.teacherNotes}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= INFORMASI SPP BULANAN VIEW ================= */}
      {activeSubTab === 'spp_bulanan' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-black uppercase border border-emerald-200">
                  Portal Transparansi Orang Tua
                </span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <span>Informasi Pembayaran SPP Bulanan Siswa (Januari - Desember)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Riwayat dan status verifikasi Lunas / Belum Lunas pembayaran SPP bulanan peserta didik Rombel.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {students
              .filter((std) => {
                if (currentRole === 'ORANG_TUA') {
                  return std.id === selectedParentStudentId;
                }
                return selectedRombel === 'SEMUA' || std.gradeClass.toLowerCase().includes(selectedRombel.toLowerCase());
              })
              .map((std) => {
                const months = [
                  'Januari', 'Februari', 'Maret', 'April',
                  'Mei', 'Juni', 'Juli', 'Agustus',
                  'September', 'Oktober', 'November', 'Desember',
                ];

                const paidCount = std.sppStatus === 'LUNAS' ? 8 : std.sppStatus === 'TUNGGAKAN' ? 5 : 7;
                const totalPaidAmount = paidCount * std.sppAmount;
                const totalUnpaidAmount = (12 - paidCount) * std.sppAmount;

                return (
                  <div key={std.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-md">
                            {std.gradeClass}
                          </span>
                          <span className="text-xs font-bold text-slate-500 font-mono">NIS: {std.nis}</span>
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-base mt-1">{std.name}</h4>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-2xl">
                          <span className="block text-[10px] font-bold text-slate-500">Total Terbayar:</span>
                          <span className="font-black text-emerald-700">Rp {totalPaidAmount.toLocaleString('id-ID')} ({paidCount} Bulan)</span>
                        </div>
                        <div className="p-2.5 bg-rose-50 border border-rose-100 rounded-2xl">
                          <span className="block text-[10px] font-bold text-slate-500">Tunggakan Belum Lunas:</span>
                          <span className="font-black text-rose-700">Rp {totalUnpaidAmount.toLocaleString('id-ID')} ({12 - paidCount} Bulan)</span>
                        </div>
                      </div>
                    </div>

                    {/* 12 Months Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {months.map((monthName, idx) => {
                        const isPaid = idx < paidCount;
                        return (
                          <div
                            key={monthName}
                            className={`p-3 rounded-2xl border transition flex flex-col justify-between gap-2 ${
                              isPaid
                                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                                : 'bg-rose-50/60 border-rose-200 text-rose-950'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-extrabold">{monthName}</span>
                              {isPaid ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                              )}
                            </div>

                            <div>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase block w-fit ${
                                  isPaid ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
                                }`}
                              >
                                {isPaid ? 'LUNAS' : 'BELUM LUNAS'}
                              </span>
                              <p className="text-[11px] font-mono font-bold mt-1">
                                Rp {std.sppAmount.toLocaleString('id-ID')}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ================= TEACHER JOURNALS VIEW ================= */}
      {activeSubTab === 'jurnal' && (
        <div className="space-y-4">
          {filteredJournals.map((jrn) => (
            <div key={jrn.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
                      {jrn.rombonganBelajar}
                    </span>
                    <span className="text-xs font-bold text-slate-500">&bull; {jrn.subject}</span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base mt-1">{jrn.topic}</h3>
                </div>

                <div>
                  {jrn.status === 'DISETUJUI_KEPSEK' ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Disetujui Kepala Sekolah
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 font-extrabold text-xs rounded-full border border-amber-200">
                      <Clock className="w-4 h-4 text-amber-600" />
                      Pengusulan Guru (Menunggu Approve Kepsek)
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <p className="font-extrabold text-slate-700">Rangkuman Kompetensi Pembelajaran:</p>
                  <p className="text-slate-600 leading-relaxed">{jrn.competencySummary}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <p className="font-extrabold text-slate-700">Materi & Alat Peraga SiPLah:</p>
                  <p className="text-slate-600 leading-relaxed">{jrn.teachingMaterial}</p>
                </div>
              </div>

              {jrn.principalFeedback && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs space-y-0.5">
                  <p className="font-extrabold text-emerald-900">Catatan Persetujuan Kepala Sekolah:</p>
                  <p className="text-slate-700 italic">"{jrn.principalFeedback}"</p>
                </div>
              )}

              <div className="flex items-center justify-between text-xs pt-2">
                <p className="text-slate-500">
                  Guru Pengampu: <span className="font-bold text-slate-900">{jrn.teacherName}</span> &bull; Tanggal:{' '}
                  <span className="font-mono">{jrn.date}</span>
                </p>

                {jrn.status === 'DIUSULKAN_GURU' &&
                  (currentRole === 'SUPERADMIN' || currentRole === 'KEPALA_SEKOLAH') && (
                    <button
                      onClick={() =>
                        onApproveJournal(
                          jrn.id,
                          'Materi telah diverifikasi dan dapat diimplementasikan langsung ke Rombel.'
                        )
                      }
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Setujui Implementasi Rombel (Kepsek)</span>
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= MODAL INPUT / EDIT DATA E-RAPORT ================= */}
      {showRaportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900">
                <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
                <div>
                  <h3 className="font-black text-lg">
                    {editingRaportId ? 'Edit Data E-Raport Siswa' : 'Form Input Data Pembuatan E-Raport'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Isi data NIS, Tahun, Nama, Kelas, Wali Murid, Wali Kelas, dan Nilai Pelajaran.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowRaportModal(false)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRaport} className="space-y-6">
              {/* Preset Student Selector */}
              {!editingRaportId && (
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 space-y-2">
                  <label className="block text-xs font-black text-emerald-950">
                    Pilih Siswa dari Master Data (Opsional Auto-Fill):
                  </label>
                  <select
                    value={selectedStudentPreset}
                    onChange={(e) => handleSelectStudentPreset(e.target.value)}
                    className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">-- Manual Entry / Pilih Siswa --</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} (NIS: {s.nis}) &bull; {s.gradeClass} &bull; Wali: {s.parentName || 'Bpk/Ibu'}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Main Metadata Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1">
                    1. NIS / NISN <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formNis}
                    onChange={(e) => setFormNis(e.target.value)}
                    placeholder="Contoh: 20240101"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-blue-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1">
                    2. Tahun Ajaran <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formAcademicYear}
                    onChange={(e) => setFormAcademicYear(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                  >
                    <option value="2026/2027 Semester Ganjil">2026/2027 Semester Ganjil</option>
                    <option value="2026/2027 Semester Genap">2026/2027 Semester Genap</option>
                    <option value="2025/2026 Semester Ganjil">2025/2026 Semester Ganjil</option>
                    <option value="2025/2026 Semester Genap">2025/2026 Semester Genap</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1">
                    3. Nama Siswa <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formStudentName}
                    onChange={(e) => setFormStudentName(e.target.value)}
                    placeholder="Nama Lengkap Siswa"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-extrabold text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1">
                    4. Kelas / Rombel <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formGradeClass}
                    onChange={(e) => handleGradeClassChange(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-extrabold text-slate-900"
                  >
                    <option value="Kelas 1">Kelas 1</option>
                    <option value="Kelas 2">Kelas 2</option>
                    <option value="Kelas 3">Kelas 3</option>
                    <option value="Kelas 4">Kelas 4</option>
                    <option value="Kelas 5">Kelas 5</option>
                    <option value="Kelas 6">Kelas 6</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1">
                    5. Wali Murid (Orang Tua) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formParentName}
                    onChange={(e) => setFormParentName(e.target.value)}
                    placeholder="Nama Orang Tua / Wali Siswa"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1">
                    6. Wali Kelas <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formTeacherName}
                    onChange={(e) => setFormTeacherName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900"
                  >
                    {teachers.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name} ({t.assignedRombel || 'Guru Rombel'})
                      </option>
                    ))}
                    <option value="Hj. Fatimah Zahra, S.Pd">Hj. Fatimah Zahra, S.Pd</option>
                    <option value="Rina Kartika, S.Si">Rina Kartika, S.Si</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Subject Grades Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-emerald-600" />
                      <span>7. Input Nilai Mata Pelajaran ({formGradeClass})</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Mata pelajaran otomatis disesuaikan berdasarkan tingkatan {formGradeClass}.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleResetToStandardSubjects}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[11px] font-bold transition cursor-pointer flex items-center gap-1"
                      title="Reset sesuai template matpel kelas"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Muat Standard {formGradeClass}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleAddSubjectRow}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[11px] font-bold transition cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>+ Tambah Matpel</span>
                    </button>
                  </div>
                </div>

                {/* Subject Grade Table Input */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-800 font-bold uppercase tracking-wider text-[10px]">
                        <th className="p-2.5 border-b border-slate-200 text-center w-10">No</th>
                        <th className="p-2.5 border-b border-slate-200 w-48">Mata Pelajaran</th>
                        <th className="p-2.5 border-b border-slate-200 text-center w-28">Nilai (0-100)</th>
                        <th className="p-2.5 border-b border-slate-200 text-center w-20">Predikat</th>
                        <th className="p-2.5 border-b border-slate-200">Catatan Capaian Kompetensi</th>
                        <th className="p-2.5 border-b border-slate-200 text-center w-12">Hapus</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {formGrades.map((g, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/60">
                          <td className="p-2.5 text-center font-bold text-slate-400">{idx + 1}</td>

                          <td className="p-2.5">
                            <input
                              type="text"
                              value={g.subject}
                              onChange={(e) => handleGradeSubjectNameChange(idx, e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900"
                              required
                            />
                          </td>

                          <td className="p-2.5 text-center">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={g.score}
                              onChange={(e) => handleGradeScoreChange(idx, parseInt(e.target.value) || 0)}
                              className="w-20 text-center font-mono font-black text-blue-900 bg-blue-50 border border-blue-200 rounded-lg px-2 py-1 text-xs focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </td>

                          <td className="p-2.5 text-center">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                                g.letterGrade === 'A'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : g.letterGrade === 'B'
                                  ? 'bg-blue-100 text-blue-800'
                                  : g.letterGrade === 'C'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {g.letterGrade}
                            </span>
                          </td>

                          <td className="p-2.5">
                            <input
                              type="text"
                              value={g.notes}
                              onChange={(e) => handleGradeNotesChange(idx, e.target.value)}
                              placeholder="Deskripsi kemampuan siswa..."
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700"
                            />
                          </td>

                          <td className="p-2.5 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveSubjectRow(idx)}
                              disabled={formGrades.length <= 1}
                              className="p-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-md transition disabled:opacity-30 cursor-pointer"
                              title="Hapus baris"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Catatan Wali Kelas & Attendance */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="md:col-span-2">
                  <label className="block text-xs font-extrabold text-slate-800 mb-1">
                    8. Catatan Perkembangan Wali Kelas
                  </label>
                  <textarea
                    rows={2}
                    value={formTeacherNotes}
                    onChange={(e) => setFormTeacherNotes(e.target.value)}
                    placeholder="Siswa berprestasi dan berakhlak mulia..."
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1">
                    9. Kehadiran Siswa (Hari)
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold">Hadir:</span>
                      <input
                        type="number"
                        value={formAttendance.present}
                        onChange={(e) =>
                          setFormAttendance({ ...formAttendance, present: parseInt(e.target.value) || 0 })
                        }
                        className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold">Sakit:</span>
                      <input
                        type="number"
                        value={formAttendance.sick}
                        onChange={(e) =>
                          setFormAttendance({ ...formAttendance, sick: parseInt(e.target.value) || 0 })
                        }
                        className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowRaportModal(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-xl shadow-lg transition cursor-pointer flex items-center gap-2"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>{editingRaportId ? 'Simpan Perubahan E-Raport' : 'Terbitkan Data E-Raport Siswa'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Journal Rombel */}
      {showJournalModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">Buat Jurnal Mengajar & Usulan Rombel</h3>
              <button onClick={() => setShowJournalModal(false)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">
                Batal
              </button>
            </div>

            <form onSubmit={handleCreateJournal} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Rombongan Belajar</label>
                  <select
                    value={jurnalRombelClass}
                    onChange={(e) => setJurnalRombelClass(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    <option value="Kelas 1">Kelas 1</option>
                    <option value="Kelas 2">Kelas 2</option>
                    <option value="Kelas 3">Kelas 3</option>
                    <option value="Kelas 4">Kelas 4</option>
                    <option value="Kelas 5">Kelas 5</option>
                    <option value="Kelas 6">Kelas 6</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mata Pelajaran</label>
                  <input
                    type="text"
                    value={jurnalSubject}
                    onChange={(e) => setJurnalSubject(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Topik Pembelajaran</label>
                <input
                  type="text"
                  value={jurnalTopic}
                  onChange={(e) => setJurnalTopic(e.target.value)}
                  placeholder="Contoh: Operasi Hitung Campuran Desimal & Soal Cerita"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Capaian Kompetensi</label>
                <textarea
                  rows={2}
                  value={jurnalCompetency}
                  onChange={(e) => setJurnalCompetency(e.target.value)}
                  placeholder="Deskripsi singkat target siswa..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Materi & Alat Peraga SiPLah</label>
                <input
                  type="text"
                  value={jurnalMaterial}
                  onChange={(e) => setJurnalMaterial(e.target.value)}
                  placeholder="Contoh: Modul Digital SiPLah & Perangkat Komputer Lab"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowJournalModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow"
                >
                  Ajukan Ke Kepala Sekolah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
