import React, { useState, useEffect } from 'react';
import {
  ERaport,
  TeacherJournalRombel,
  Student,
  Teacher,
  UserRole,
  SubjectGrade,
  ParentTeacherConsultationMessage,
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
  Lock,
  Unlock,
  MessageSquare,
  Send,
  Award,
  CheckCircle,
  AlertTriangle,
  Receipt,
  Eye,
} from 'lucide-react';
import { printDocument } from '../../utils/printHelper';
import {
  getSubjectsByClass,
  getWaliKelasByGrade,
  getWaliKelasDetailByGrade,
  getWaliKelasList,
  isClassMatching,
  INITIAL_CONSULTATION_MESSAGES,
} from '../../data/initialData';

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
  forcedSubTab?: 'raport' | 'leger' | 'jurnal' | 'spp_bulanan' | 'konsultasi';
  onUpdateRaport: (raport: ERaport) => void;
  onAddRaport: (raport: Omit<ERaport, 'id'>) => void;
  onAddJournal: (journal: Omit<TeacherJournalRombel, 'id' | 'status'>) => void;
  onApproveJournal: (id: string, feedback?: string) => void;
  onApproveRaport: (id: string) => void;
  onUpdateStudentSppStatus?: (studentId: string, newStatus: 'LUNAS' | 'MENUNGGU' | 'TUNGGAKAN') => void;
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
  onUpdateStudentSppStatus,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'raport' | 'leger' | 'jurnal' | 'spp_bulanan' | 'konsultasi'>(
    forcedSubTab || 'raport'
  );

  useEffect(() => {
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

  // Interactive Consultation Messages State (persisted locally)
  const [consultationMessages, setConsultationMessages] = useState<ParentTeacherConsultationMessage[]>(() => {
    const saved = localStorage.getItem('yayasan_consultation_messages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_CONSULTATION_MESSAGES;
  });

  useEffect(() => {
    localStorage.setItem('yayasan_consultation_messages', JSON.stringify(consultationMessages));
  }, [consultationMessages]);

  // Consultation Composer State
  const [selectedConsultationStudentId, setSelectedConsultationStudentId] = useState<string>(() => {
    return students[0]?.id || '';
  });
  const [newMsgCategory, setNewMsgCategory] = useState<'PRESTASI' | 'KEWAJIBAN_SPP' | 'KONSULTASI_BELAJAR' | 'AKADEMIK'>('PRESTASI');
  const [newMsgTitle, setNewMsgTitle] = useState('');
  const [newMsgText, setNewMsgText] = useState('');
  const [newMsgAttachmentNote, setNewMsgAttachmentNote] = useState('');
  const [replyInputMap, setReplyInputMap] = useState<Record<string, string>>({});

  // Form State for Journal Rombel
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [jurnalRombelClass, setJurnalRombelClass] = useState('Kelas 1');
  const [jurnalSubject, setJurnalSubject] = useState('Matematika');
  const [jurnalTopic, setJurnalTopic] = useState('');
  const [jurnalCompetency, setJurnalCompetency] = useState('');
  const [jurnalMaterial, setJurnalMaterial] = useState('');
  const [teacherNameInput, setTeacherNameInput] = useState(() => getWaliKelasByGrade('Kelas 1', teachers));

  // Form State for Input/Edit E-Raport Modal
  const [showRaportModal, setShowRaportModal] = useState(false);
  const [editingRaportId, setEditingRaportId] = useState<string | null>(null);

  const [formNis, setFormNis] = useState('20240101');
  const [formAcademicYear, setFormAcademicYear] = useState('2026/2027 Semester Ganjil');
  const [formStudentName, setFormStudentName] = useState('');
  const [formGradeClass, setFormGradeClass] = useState('Kelas 1');
  const [formParentName, setFormParentName] = useState('');
  const [formTeacherName, setFormTeacherName] = useState(() => getWaliKelasByGrade('Kelas 1', teachers));
  const [formGrades, setFormGrades] = useState<SubjectGrade[]>([]);
  const [formAttendance, setFormAttendance] = useState({ present: 80, sick: 1, permitted: 0, absent: 0 });
  const [formTeacherNotes, setFormTeacherNotes] = useState('Siswa aktif, santun, dan berprestasi tinggi.');
  const [selectedStudentPreset, setSelectedStudentPreset] = useState<string>('');

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
        teacherName: getWaliKelasByGrade(std.gradeClass, teachers),
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
      extracurriculars: [{ name: 'Pramuka & Tahfidz', grade: 'A', notes: 'Sangat aktif.' }],
      teacherNotes: `Ananda ${std.name} menunjukkan perkembangan karakter yang positif dan rajin belajar.`,
      status: 'DITERBITKAN',
      issuedDate: new Date().toISOString().split('T')[0],
    };
  });

  // Filter Raports using isClassMatching for robust multi-format matching
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

    const matchesRombel = selectedRombel === 'SEMUA' || isClassMatching(r.gradeClass, selectedRombel);
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
    const matchesRombel = selectedRombel === 'SEMUA' || isClassMatching(j.rombonganBelajar, selectedRombel);
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      j.topic.toLowerCase().includes(q) ||
      j.teacherName.toLowerCase().includes(q) ||
      j.subject.toLowerCase().includes(q) ||
      j.competencySummary.toLowerCase().includes(q) ||
      j.rombonganBelajar.toLowerCase().includes(q);
    return matchesRombel && matchesSearch;
  });

  const filteredConsultationMessages = consultationMessages.filter((msg) => {
    if (currentRole === 'ORANG_TUA') {
      const parentStudent = students.find((s) => s.id === selectedParentStudentId);
      if (parentStudent) {
        return (
          msg.studentId === parentStudent.id ||
          msg.studentName.toLowerCase().includes(parentStudent.name.toLowerCase())
        );
      }
    }

    const matchesRombel = selectedRombel === 'SEMUA' || isClassMatching(msg.gradeClass, selectedRombel);
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      msg.studentName.toLowerCase().includes(q) ||
      msg.senderName.toLowerCase().includes(q) ||
      msg.title.toLowerCase().includes(q) ||
      msg.message.toLowerCase().includes(q) ||
      msg.gradeClass.toLowerCase().includes(q);

    return matchesRombel && matchesSearch;
  });

  // Sync selected consultation student when selected rombel changes
  useEffect(() => {
    if (selectedRombel !== 'SEMUA') {
      const firstInClass = students.find((s) => isClassMatching(s.gradeClass, selectedRombel));
      if (firstInClass) {
        setSelectedConsultationStudentId(firstInClass.id);
      }
    }
  }, [selectedRombel, students]);

  // Initialize/Reset Raport Modal Form
  const openNewRaportModal = () => {
    setEditingRaportId(null);
    const firstStd = selectedRombel !== 'SEMUA'
      ? students.find((s) => isClassMatching(s.gradeClass, selectedRombel)) || students[0]
      : students[0];
    const initialClass = selectedRombel !== 'SEMUA' ? selectedRombel : firstStd?.gradeClass || 'Kelas 1';
    const initialSubjects = getSubjectsByClass(initialClass);

    setSelectedStudentPreset(firstStd?.id || '');
    setFormNis(firstStd?.nis || firstStd?.nisn || '20240101');
    setFormAcademicYear('2026/2027 Semester Ganjil');
    setFormStudentName(firstStd?.name || 'Nama Siswa Baru');
    setFormGradeClass(initialClass);
    setFormParentName(firstStd?.parentName || 'Bpk. / Ibu Wali Murid');
    setFormTeacherName(getWaliKelasByGrade(initialClass, teachers));
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
    setFormTeacherName(getWaliKelasByGrade(rap.gradeClass, teachers));
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
    setFormTeacherName(getWaliKelasByGrade(std.gradeClass, teachers));

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
    setFormTeacherName(getWaliKelasByGrade(newClass, teachers));
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

  // Grade Input Change Handlers
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
      teacherId: 'tch-wali',
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

  // Consultation Send Message Handler
  const handleSendConsultationMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsgTitle || !newMsgText) return;

    const targetStudent = students.find((s) => s.id === selectedConsultationStudentId) || students[0];
    if (!targetStudent) return;

    const isParent = currentRole === 'ORANG_TUA';
    const waliKelasName = getWaliKelasByGrade(targetStudent.gradeClass, teachers);

    const newMsg: ParentTeacherConsultationMessage = {
      id: `msg-${Date.now()}`,
      studentId: targetStudent.id,
      studentName: targetStudent.name,
      gradeClass: targetStudent.gradeClass,
      senderType: isParent ? 'WALI_MURID' : 'GURU_WALIKELAS',
      senderName: isParent
        ? `${targetStudent.parentName || 'Wali Murid'} (Orang Tua)`
        : `${waliKelasName} (Wali ${targetStudent.gradeClass})`,
      category: newMsgCategory,
      title: newMsgTitle,
      message: newMsgText,
      timestamp: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
      status: 'TERKIRIM',
      attachmentNote: newMsgAttachmentNote || undefined,
    };

    setConsultationMessages((prev) => [newMsg, ...prev]);
    setNewMsgTitle('');
    setNewMsgText('');
    setNewMsgAttachmentNote('');
  };

  // Consultation Reply Handler
  const handleSendReply = (msgId: string) => {
    const replyText = replyInputMap[msgId]?.trim();
    if (!replyText) return;

    const originalMsg = consultationMessages.find((m) => m.id === msgId);
    if (!originalMsg) return;

    const isParent = currentRole === 'ORANG_TUA';
    const replierName = isParent
      ? `Wali Murid Ananda ${originalMsg.studentName}`
      : getWaliKelasByGrade(originalMsg.gradeClass, teachers);

    const replyMsg: ParentTeacherConsultationMessage = {
      id: `msg-${Date.now()}`,
      studentId: originalMsg.studentId,
      studentName: originalMsg.studentName,
      gradeClass: originalMsg.gradeClass,
      senderType: isParent ? 'WALI_MURID' : 'GURU_WALIKELAS',
      senderName: replierName,
      category: originalMsg.category,
      title: `Re: ${originalMsg.title}`,
      message: replyText,
      timestamp: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
      status: 'DITANGGAPI',
    };

    setConsultationMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, status: 'DITANGGAPI' } : m)).concat(replyMsg)
    );

    setReplyInputMap((prev) => ({ ...prev, [msgId]: '' }));
  };

  // Direct Toggle SPP status from Consultation / SPP tab
  const handleQuickSetSppStatus = (studentId: string, newStatus: 'LUNAS' | 'MENUNGGU' | 'TUNGGAKAN') => {
    if (onUpdateStudentSppStatus) {
      onUpdateStudentSppStatus(studentId, newStatus);
    }
  };

  const isEraportMenu = forcedSubTab === 'raport' || activeSubTab === 'raport' || activeSubTab === 'spp_bulanan' || activeSubTab === 'konsultasi';

  // Wali Kelas list exclusively containing authorized teachers with Wali Kelas status
  const authorizedWaliKelasList = getWaliKelasList(teachers);

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 rounded-3xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-700">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-black rounded-full border border-emerald-500/30">
            <GraduationCap className="w-3.5 h-3.5" />
            {isEraportMenu ? 'Sistem E-Raport & Interaksi Akademik Rombel' : 'Modul Jurnal Mengajar Guru Rombel'}
          </div>
          <h2 className="text-2xl font-black text-white">
            {isEraportMenu
              ? 'Tabel Data & Input E-Raport Siswa Rombel'
              : 'Jurnal Mengajar Guru & Verifikasi Kepala Sekolah'}
          </h2>
          <p className="text-xs text-slate-300">
            {isEraportMenu
              ? 'Input data NIS, Tahun Ajaran, Nama, Kelas, Wali Murid, Wali Kelas terdaftar, nilai pelajaran, dan interaksi prestasi & SPP.'
              : 'Dokumentasi materi pembelajaran harian guru rombel dan lembar persetujuan Kepala Sekolah.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {forcedSubTab === 'jurnal' && currentRole !== 'ORANG_TUA' && (
            <button
              onClick={() => {
                setTeacherNameInput(getWaliKelasByGrade(jurnalRombelClass, teachers));
                setShowJournalModal(true);
              }}
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
              <h4 className="font-extrabold text-amber-950 text-sm mt-0.5">Informasi Akademik & SPP Putra/Putri Anda</h4>
              <p className="text-xs text-amber-800">
                Melihat lembar E-Raport, status pelunasan SPP, serta berkomunikasi langsung dengan Wali Kelas.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-2xl border border-amber-300 shadow-xs shrink-0">
            <label className="text-xs font-bold text-amber-950 shrink-0">Pilih Ananda:</label>
            <select
              value={selectedParentStudentId}
              onChange={(e) => {
                setSelectedParentStudentId(e.target.value);
                setSelectedConsultationStudentId(e.target.value);
              }}
              className="bg-amber-50 border border-amber-300 rounded-xl px-3 py-1.5 text-xs font-black text-slate-900 shadow-2xs focus:outline-none"
            >
              {students.map((std) => (
                <option key={std.id} value={std.id}>
                  {std.name} ({std.gradeClass} - NIS: {std.nis}) - SPP: {std.sppStatus}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Filter Rombel Class Selector */}
      {currentRole !== 'ORANG_TUA' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-extrabold text-slate-700">Pilih Rombongan Belajar (Rombel):</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {['SEMUA', 'Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'].map((rom) => {
                const countInClass =
                  activeSubTab === 'jurnal'
                    ? (rom === 'SEMUA' ? teacherJournals.length : teacherJournals.filter((j) => isClassMatching(j.rombonganBelajar, rom)).length)
                    : activeSubTab === 'konsultasi'
                    ? (rom === 'SEMUA' ? consultationMessages.length : consultationMessages.filter((m) => isClassMatching(m.gradeClass, rom)).length)
                    : (rom === 'SEMUA' ? students.length : students.filter((s) => isClassMatching(s.gradeClass, rom)).length);
                
                const badgeSuffix =
                  activeSubTab === 'jurnal' ? 'Jurnal' : activeSubTab === 'konsultasi' ? 'Pesan' : 'Siswa';

                const waliDetail = rom !== 'SEMUA' ? getWaliKelasDetailByGrade(rom, teachers) : null;

                return (
                  <button
                    key={rom}
                    onClick={() => setSelectedRombel(rom)}
                    title={waliDetail ? `Wali Kelas: ${waliDetail.name}` : 'Semua Rombel'}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      selectedRombel === rom
                        ? 'bg-slate-900 text-white shadow-sm font-black'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>{rom}</span>
                    <span className={`px-1.5 py-0.2 text-[10px] rounded-full ${
                      selectedRombel === rom ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {countInClass} {badgeSuffix}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rombel & Wali Kelas Identity Card */}
          {selectedRombel !== 'SEMUA' ? (() => {
            const wali = getWaliKelasDetailByGrade(selectedRombel, teachers);
            const rombelStudents = students.filter((s) => isClassMatching(s.gradeClass, selectedRombel));
            const sppLunasCount = rombelStudents.filter((s) => s.sppStatus === 'LUNAS').length;

            return (
              <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white p-5 rounded-3xl border border-emerald-800/60 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-13 h-13 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 font-black text-xl shadow-inner shrink-0">
                    {wali.name.charAt(0)}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-amber-400 text-slate-950 font-black text-[10px] rounded-full uppercase">
                        Wali Kelas Resmi {selectedRombel}
                      </span>
                      <span className="text-[11px] text-emerald-300 font-mono font-bold">
                        NIPY: {wali.nipy}
                      </span>
                    </div>
                    <h3 className="text-base font-black text-white">{wali.name}</h3>
                    <p className="text-xs text-slate-300">
                      Penanggung Jawab Akademik, Jurnal, E-Raport & Koordinasi Wali Murid {selectedRombel}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto justify-end">
                  <div className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-right">
                    <p className="text-[10px] text-slate-400 uppercase font-extrabold">Siswa Asuhan</p>
                    <p className="text-xs font-black text-emerald-300">{rombelStudents.length} Siswa ({sppLunasCount} Lunas SPP)</p>
                  </div>
                  <button
                    onClick={() => setActiveSubTab('leger')}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow transition"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-300" />
                    <span>Leger Nilai Rombel</span>
                  </button>
                  <button
                    onClick={() => setActiveSubTab('konsultasi')}
                    className="px-3.5 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow transition"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-amber-300" />
                    <span>Koordinasi Siswa</span>
                  </button>
                </div>
              </div>
            );
          })() : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {['Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'].map((cls) => {
                const wali = getWaliKelasDetailByGrade(cls, teachers);
                const count = students.filter((s) => isClassMatching(s.gradeClass, cls)).length;
                return (
                  <div
                    key={cls}
                    onClick={() => setSelectedRombel(cls)}
                    className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-500 hover:shadow-md transition cursor-pointer space-y-1"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">{cls}</span>
                      <span className="text-[10px] text-slate-500 font-bold">{count} Siswa</span>
                    </div>
                    <p className="text-xs font-black text-slate-900 truncate" title={wali.name}>{wali.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono truncate">NIPY: {wali.nipy}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Main Sub Tabs (E-Raport vs Leger vs SPP vs Konsultasi) */}
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
              <span>1. Tabel E-Raport ({filteredRaports.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('leger')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
                activeSubTab === 'leger'
                  ? 'bg-slate-900 text-amber-300 shadow-md border border-slate-800'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>2. Buku Leger Nilai & Rekap Rombel (DKN)</span>
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
              <span>3. Status SPP Bulanan</span>
            </button>

            <button
              onClick={() => setActiveSubTab('konsultasi')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
                activeSubTab === 'konsultasi'
                  ? 'bg-blue-700 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>4. Konsultasi Prestasi & Administrasi SPP ({filteredConsultationMessages.length})</span>
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

      {/* ================= 1. E-RAPORT VIEW ================= */}
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

              {(currentRole === 'SUPERADMIN' || currentRole === 'KEPALA_SEKOLAH') && (
                <button
                  onClick={() => {
                    const pendingRaports = filteredRaports.filter((r) => r.status === 'DIUSULKAN_GURU');
                    if (pendingRaports.length === 0) {
                      alert('Seluruh E-Raport pada rombel ini telah disetujui / diterbitkan.');
                      return;
                    }
                    if (confirm(`Setujui dan terbitkan ${pendingRaports.length} E-Raport yang diusulkan guru?`)) {
                      pendingRaports.forEach((r) => onApproveRaport(r.id));
                    }
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow flex items-center gap-1.5 cursor-pointer transition hover:scale-102"
                  title="Persetujuan Kepala Sekolah untuk menerbitkan E-Raport Rombel"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>Approve E-Raport (Kepsek)</span>
                </button>
              )}

              {currentRole !== 'ORANG_TUA' && (
                <button
                  onClick={openNewRaportModal}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>Input Data E-Raport</span>
                </button>
              )}
            </div>
          </div>

          {/* PARENT SPP GATE NOTIFICATION BANNER (When parent has unpaid SPP) */}
          {currentRole === 'ORANG_TUA' && (() => {
            const currentStudent = students.find((s) => s.id === selectedParentStudentId);
            const isSppLunas = currentStudent?.sppStatus === 'LUNAS';

            if (!isSppLunas && currentStudent) {
              return (
                <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-6 sm:p-8 text-slate-900 space-y-4 shadow-md">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-rose-600 text-white rounded-2xl shrink-0 shadow-md">
                      <Lock className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-200/80 text-rose-950 font-black text-xs rounded-full border border-rose-300 uppercase">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-800" /> Akses E-Raport Terkunci (Belum Melunasi SPP)
                      </div>
                      <h3 className="text-xl font-black text-slate-950">
                        Lembar E-Raport Semester Ananda Belum Dapat Dibuka
                      </h3>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        Sesuai ketentuan Yayasan Pendidikan Daarul Habibah, akses Lembar E-Raport ananda <strong className="text-rose-900">{currentStudent.name}</strong> belum dapat diakses secara digital maupun dicetak karena status administrasi SPP masih berstatus <span className="font-black text-rose-700 uppercase">[{currentStudent.sppStatus}]</span>.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-4.5 rounded-2xl border border-rose-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-[11px] text-slate-500 font-bold uppercase">Virtual Account Resmi Pembayaran SPP (BSI):</p>
                      <p className="font-mono font-black text-blue-900 text-sm">8802020{currentStudent.nis || '26001'} a.n {currentStudent.name}</p>
                      <p className="text-[11px] text-slate-500">Nominal: Rp {currentStudent.sppAmount.toLocaleString('id-ID')} / bulan</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setActiveSubTab('spp_bulanan')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Cek Status SPP</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedConsultationStudentId(currentStudent.id);
                          setNewMsgCategory('KEWAJIBAN_SPP');
                          setNewMsgTitle(`Konfirmasi Pembayaran SPP Ananda ${currentStudent.name}`);
                          setActiveSubTab('konsultasi');
                        }}
                        className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white font-extrabold text-xs rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Kirim Bukti Bayar / Konsultasi Wali Kelas</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })()}

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
                      <th className="p-3.5 border-b border-slate-800">Status SPP</th>
                      <th className="p-3.5 border-b border-slate-800">Mata Pelajaran & Nilai</th>
                      <th className="p-3.5 border-b border-slate-800 text-center">Rata-Rata</th>
                      <th className="p-3.5 border-b border-slate-800 text-center">Status Raport</th>
                      <th className="p-3.5 border-b border-slate-800 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRaports.length === 0 ? (
                      <tr>
                        <td colSpan={12} className="p-8 text-center text-slate-500 italic">
                          Belum ada data E-Raport yang sesuai filter Rombel ({selectedRombel}).
                        </td>
                      </tr>
                    ) : (
                      filteredRaports.map((rap, idx) => {
                        const studentObj = students.find(
                          (s) => s.id === rap.studentId || s.nis === rap.nisn || s.name.toLowerCase() === rap.studentName.toLowerCase()
                        );
                        const isSppLunas = studentObj ? studentObj.sppStatus === 'LUNAS' : true;
                        const isParentLocked = currentRole === 'ORANG_TUA' && !isSppLunas;

                        const avgScore =
                          rap.grades && rap.grades.length > 0
                            ? Math.round(
                                rap.grades.reduce((acc, g) => acc + g.score, 0) / rap.grades.length
                              )
                            : 0;

                        return (
                          <tr key={rap.id} className={`hover:bg-slate-50/80 transition ${isParentLocked ? 'opacity-70 bg-rose-50/30' : ''}`}>
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
                              {studentObj && (
                                <p className="text-[10px] text-slate-500 font-mono">NIS: {studentObj.nis}</p>
                              )}
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
                              <span className="font-semibold text-slate-900">{rap.teacherName}</span>
                            </td>

                            {/* Status SPP column */}
                            <td className="p-3.5">
                              <span
                                className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase inline-flex items-center gap-1 ${
                                  studentObj?.sppStatus === 'LUNAS'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : studentObj?.sppStatus === 'MENUNGGU'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {studentObj?.sppStatus === 'LUNAS' ? (
                                  <Unlock className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Lock className="w-3 h-3 text-rose-600" />
                                )}
                                <span>{studentObj?.sppStatus || 'LUNAS'}</span>
                              </span>
                            </td>

                            {/* Mata Pelajaran / Grades */}
                            <td className="p-3.5 max-w-xs">
                              {isParentLocked ? (
                                <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg text-[11px] text-rose-800 font-bold flex items-center gap-1">
                                  <Lock className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                  <span>Nilai Terkunci (Menunggu Pelunasan SPP)</span>
                                </div>
                              ) : (
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
                              )}
                            </td>

                            <td className="p-3.5 text-center font-mono font-black text-slate-900 text-sm">
                              {isParentLocked ? (
                                <span className="text-slate-400 font-bold">-</span>
                              ) : (
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
                              )}
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

                                {isParentLocked ? (
                                  <button
                                    onClick={() => {
                                      alert(
                                        `Akses lembar E-Raport ananda ${rap.studentName} belum dapat dibuka/dicetak karena status SPP masih ${studentObj?.sppStatus}. Silakan lakukan konfirmasi di tab Konsultasi & SPP.`
                                      );
                                    }}
                                    className="p-1.5 bg-slate-200 text-slate-400 rounded-lg cursor-not-allowed"
                                    title="Terkunci - Belum Lunas SPP"
                                  >
                                    <Lock className="w-3.5 h-3.5" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => printDocument(`raport-card-${rap.id}`, `E-Raport_${rap.studentName}`)}
                                    className="p-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition cursor-pointer"
                                    title="Cetak E-Raport PDF"
                                  >
                                    <Printer className="w-3.5 h-3.5 text-emerald-400" />
                                  </button>
                                )}

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
              {filteredRaports.map((rap) => {
                const studentObj = students.find(
                  (s) => s.id === rap.studentId || s.nis === rap.nisn || s.name.toLowerCase() === rap.studentName.toLowerCase()
                );
                const isSppLunas = studentObj ? studentObj.sppStatus === 'LUNAS' : true;
                const isParentLocked = currentRole === 'ORANG_TUA' && !isSppLunas;

                return (
                  <div key={rap.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <span className="text-[10px] font-black px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full uppercase">
                          {rap.gradeClass}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                              studentObj?.sppStatus === 'LUNAS'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            SPP: {studentObj?.sppStatus || 'LUNAS'}
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
                      </div>

                      <div>
                        <h3 className="font-extrabold text-slate-900 text-base">{rap.studentName}</h3>
                        <p className="text-xs text-slate-500 font-mono">NIS/NISN: {rap.nisn} &bull; {rap.academicYear}</p>
                        <p className="text-xs text-slate-600 mt-0.5">Wali Murid: <strong>{rap.parentName || 'Orang Tua / Wali'}</strong></p>
                      </div>

                      {/* Subject Grade Highlights */}
                      {isParentLocked ? (
                        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-center space-y-2">
                          <Lock className="w-6 h-6 text-rose-600 mx-auto" />
                          <p className="text-xs font-black text-rose-950">Akses Nilai E-Raport Masih Terkunci</p>
                          <p className="text-[11px] text-rose-700">Silakan selesaikan pembayaran SPP atau konfirmasi di tab Konsultasi.</p>
                        </div>
                      ) : (
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
                      )}

                      <p className="text-xs text-slate-600 italic">"{rap.teacherNotes}"</p>
                      <p className="text-[11px] text-slate-500 font-bold">Wali Kelas: {rap.teacherName}</p>
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

                      {isParentLocked ? (
                        <button
                          onClick={() => setActiveSubTab('konsultasi')}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Konfirmasi SPP</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => printDocument(`raport-card-${rap.id}`, `E-Raport_${rap.studentName}`)}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Cetak E-Raport</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
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

                <div className="grid grid-cols-2 gap-3 text-xs border border-slate-300 p-3 rounded">
                  <div>
                    <p className="font-bold mb-1">Ketidakhadiran:</p>
                    <p>Hadir: {rap.attendance?.present || 80} hari</p>
                    <p>Sakit: {rap.attendance?.sick || 0} hari &bull; Izin: {rap.attendance?.permitted || 0} hari &bull; Alpa: {rap.attendance?.absent || 0} hari</p>
                  </div>
                  <div>
                    <p className="font-bold mb-1">Catatan Wali Kelas:</p>
                    <p className="italic">"{rap.teacherNotes}"</p>
                  </div>
                </div>

                {/* 3-Column Formal Signature Block */}
                <div className="grid grid-cols-3 gap-4 pt-6 text-center text-xs">
                  <div>
                    <p className="text-slate-600">Orang Tua / Wali Murid</p>
                    <div className="h-16"></div>
                    <p className="font-bold underline">{rap.parentName || '....................................'}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Wali Kelas {rap.gradeClass}</p>
                    <div className="h-16"></div>
                    <p className="font-bold underline">{rap.teacherName}</p>
                    <p className="text-[10px] text-slate-500 font-mono">NIPY Terdaftar</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Kepala Sekolah SDIT EL-FATAH</p>
                    <div className="h-16"></div>
                    <p className="font-bold underline">Masykur Rohana, S.Sos</p>
                    <p className="text-[10px] text-slate-500 font-mono">NIPY: 1985031201</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= 2. BUKU LEGER NILAI & REKAP ROMBEL VIEW (DKN) ================= */}
      {activeSubTab === 'leger' && (() => {
        const targetRombel = selectedRombel === 'SEMUA' ? 'Kelas 1' : selectedRombel;
        const targetWali = getWaliKelasDetailByGrade(targetRombel, teachers);
        const rombelRaports = filteredRaports.filter((r) => isClassMatching(r.gradeClass, targetRombel));
        
        // Calculate rankings based on total scores
        const scoredRaports = rombelRaports.map((r) => {
          const totalScore = r.grades.reduce((sum, g) => sum + (Number(g.score) || 0), 0);
          const avgScore = r.grades.length > 0 ? (totalScore / r.grades.length).toFixed(1) : '0.0';
          return {
            ...r,
            totalScore,
            avgScore: parseFloat(avgScore),
          };
        }).sort((a, b) => b.totalScore - a.totalScore);

        const standardSubjects = getSubjectsByClass(targetRombel);
        const classAvgTotal = scoredRaports.length > 0
          ? (scoredRaports.reduce((sum, r) => sum + r.avgScore, 0) / scoredRaports.length).toFixed(1)
          : '0.0';

        return (
          <div className="space-y-6">
            {/* Header & Controls Bar */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-black uppercase border border-amber-300">
                    Buku Leger Nilai & Daftar Kumpulan Nilai (DKN)
                  </span>
                  <span className="px-3 py-1 bg-slate-900 text-white rounded-full text-xs font-black">
                    {targetRombel}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  Rekapitulasi Nilai Akademik Peserta Didik Rombel {targetRombel}
                </h3>
                <p className="text-xs text-slate-500">
                  Tahun Ajaran 2026/2027 Semester Ganjil &bull; Wali Kelas: <strong>{targetWali.name}</strong> (NIPY: {targetWali.nipy})
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => printDocument('leger-table-print', `Leger_Nilai_${targetRombel.replace(/\s+/g, '_')}`)}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-black shadow-md flex items-center gap-2 cursor-pointer transition hover:scale-102"
                >
                  <Printer className="w-4 h-4 text-emerald-400" />
                  <span>Cetak Leger Rombel (PDF)</span>
                </button>
                <button
                  onClick={() => {
                    const firstRap = scoredRaports[0];
                    if (firstRap) {
                      printDocument(`raport-card-${firstRap.id}`, `E-Raport_${firstRap.studentName}`);
                    }
                  }}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-black shadow-md flex items-center gap-2 cursor-pointer transition"
                >
                  <FileCheck2 className="w-4 h-4 text-white" />
                  <span>Cetak Raport Rombel</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics of Rombel */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs">
                <p className="text-[11px] font-extrabold text-slate-500 uppercase">Jumlah Siswa Rombel</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{scoredRaports.length} Siswa</p>
                <p className="text-[10px] text-emerald-600 font-bold mt-0.5">100% Terdata di E-Raport</p>
              </div>
              <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs">
                <p className="text-[11px] font-extrabold text-slate-500 uppercase">Rata-Rata Nilai Rombel</p>
                <p className="text-2xl font-black text-emerald-600 mt-1">{classAvgTotal}</p>
                <p className="text-[10px] text-slate-500 font-bold mt-0.5">Skala Standar 0 - 100</p>
              </div>
              <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs">
                <p className="text-[11px] font-extrabold text-slate-500 uppercase">Ketuntasan Belajar</p>
                <p className="text-2xl font-black text-blue-600 mt-1">100%</p>
                <p className="text-[10px] text-blue-600 font-bold mt-0.5">Seluruh Siswa Tuntas KKM</p>
              </div>
              <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs">
                <p className="text-[11px] font-extrabold text-slate-500 uppercase">Wali Kelas Bertugas</p>
                <p className="text-xs font-black text-slate-900 mt-1.5 truncate">{targetWali.name}</p>
                <p className="text-[10px] text-slate-500 font-mono">NIPY: {targetWali.nipy}</p>
              </div>
            </div>

            {/* Comprehensive Leger Matrix Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Table className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-extrabold text-slate-800">
                    Matriks Nilai Rombongan Belajar {targetRombel} (Urut Peringkat Rombel)
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-500">
                  Standar Kurikulum Merdeka SDIT EL-FATAH
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white font-black text-[11px]">
                      <th className="p-3 text-center w-10">Rank</th>
                      <th className="p-3">NIS / NISN</th>
                      <th className="p-3">Nama Lengkap Siswa</th>
                      <th className="p-3 text-center">JK</th>
                      {standardSubjects.map((sub, idx) => (
                        <th key={idx} className="p-3 text-center whitespace-nowrap" title={sub}>
                          {sub.length > 10 ? sub.substring(0, 10) + '...' : sub}
                        </th>
                      ))}
                      <th className="p-3 text-center bg-slate-800 text-amber-300">Total</th>
                      <th className="p-3 text-center bg-slate-800 text-amber-300">Rerata</th>
                      <th className="p-3 text-center">Absensi (S/I/A)</th>
                      <th className="p-3 text-center">Ketuntasan</th>
                      <th className="p-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {scoredRaports.map((r, rankIdx) => {
                      const studentObj = students.find((s) => s.id === r.studentId || s.nis === r.nisn);
                      const isSppLunas = studentObj?.sppStatus === 'LUNAS';

                      return (
                        <tr key={r.id} className="hover:bg-slate-50 transition">
                          <td className="p-3 text-center font-black">
                            <span className={`inline-block w-6 h-6 rounded-full text-center leading-6 text-xs ${
                              rankIdx === 0 ? 'bg-amber-400 text-slate-950 font-black shadow-xs' :
                              rankIdx === 1 ? 'bg-slate-300 text-slate-950 font-black' :
                              rankIdx === 2 ? 'bg-amber-700 text-white font-black' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {rankIdx + 1}
                            </span>
                          </td>
                          <td className="p-3 font-mono font-bold text-blue-900">{r.nisn}</td>
                          <td className="p-3">
                            <p className="font-extrabold text-slate-900">{r.studentName}</p>
                            <p className="text-[10px] text-slate-500">Wali: {r.parentName}</p>
                          </td>
                          <td className="p-3 text-center font-bold text-slate-600">
                            {studentObj?.gender === 'L' ? 'L' : 'P'}
                          </td>
                          {standardSubjects.map((sub, sIdx) => {
                            const foundGrade = r.grades.find(
                              (g) => g.subject.toLowerCase() === sub.toLowerCase()
                            );
                            const score = foundGrade ? foundGrade.score : 85;
                            return (
                              <td key={sIdx} className="p-3 text-center font-mono font-bold">
                                <span className={score >= 90 ? 'text-emerald-700 font-black' : 'text-slate-800'}>
                                  {score}
                                </span>
                              </td>
                            );
                          })}
                          <td className="p-3 text-center font-mono font-black text-slate-950 bg-amber-50/60">
                            {r.totalScore}
                          </td>
                          <td className="p-3 text-center font-mono font-black text-emerald-700 bg-emerald-50/60">
                            {r.avgScore}
                          </td>
                          <td className="p-3 text-center text-[11px] font-mono text-slate-600">
                            {r.attendance?.sick || 0}/{r.attendance?.permitted || 0}/{r.attendance?.absent || 0}
                          </td>
                          <td className="p-3 text-center">
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] rounded-full uppercase">
                              TUNTAS
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => printDocument(`raport-card-${r.id}`, `E-Raport_${r.studentName}`)}
                              className="p-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition cursor-pointer"
                              title="Cetak E-Raport Siswa"
                            >
                              <Printer className="w-3.5 h-3.5 text-emerald-400" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-100 font-extrabold text-slate-900 border-t-2 border-slate-300">
                      <td colSpan={4} className="p-3 text-right uppercase text-[11px]">
                        Rata-Rata Rombel:
                      </td>
                      {standardSubjects.map((sub, sIdx) => {
                        const totalSubScore = scoredRaports.reduce((acc, r) => {
                          const g = r.grades.find((gr) => gr.subject.toLowerCase() === sub.toLowerCase());
                          return acc + (g ? Number(g.score) : 85);
                        }, 0);
                        const avgSubScore = scoredRaports.length > 0 ? (totalSubScore / scoredRaports.length).toFixed(1) : '85.0';
                        return (
                          <td key={sIdx} className="p-3 text-center font-mono text-emerald-800 font-black">
                            {avgSubScore}
                          </td>
                        );
                      })}
                      <td className="p-3 text-center font-mono font-black bg-slate-200">
                        {scoredRaports.length > 0
                          ? (scoredRaports.reduce((sum, r) => sum + r.totalScore, 0) / scoredRaports.length).toFixed(0)
                          : '0'}
                      </td>
                      <td className="p-3 text-center font-mono font-black text-emerald-800 bg-slate-200">
                        {classAvgTotal}
                      </td>
                      <td colSpan={3} className="p-3 text-center text-[10px] text-slate-500 font-normal">
                        Daftar Kumpulan Nilai Sah
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Validation & Signature Block */}
              <div className="p-6 bg-slate-50 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-8 text-center text-xs">
                <div className="space-y-1">
                  <p className="text-slate-600 font-medium">Mengetahui,</p>
                  <p className="font-extrabold text-slate-900">Kepala Sekolah SDIT EL-FATAH</p>
                  <div className="h-16 flex items-center justify-center">
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded border border-emerald-300">
                      [Tervalidasi Digital]
                    </span>
                  </div>
                  <p className="font-black text-slate-950 underline">Masykur Rohana, S.Sos</p>
                  <p className="text-[11px] text-slate-500 font-mono">NIPY: 1985031201</p>
                </div>

                <div className="space-y-1">
                  <p className="text-slate-600 font-medium">Kabupaten Tangerang, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p className="font-extrabold text-slate-900">Wali Kelas {targetRombel}</p>
                  <div className="h-16 flex items-center justify-center">
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded border border-emerald-300">
                      [Wali Kelas Resmi]
                    </span>
                  </div>
                  <p className="font-black text-slate-950 underline">{targetWali.name}</p>
                  <p className="text-[11px] text-slate-500 font-mono">NIPY: {targetWali.nipy}</p>
                </div>
              </div>
            </div>

            {/* Hidden Printable Leger Nilai Container */}
            <div className="hidden">
              <div id="leger-table-print" className="p-8 space-y-6">
                <div className="text-center border-b-2 border-slate-900 pb-3">
                  <h2 className="text-xl font-black">BUKU LEGER NILAI & DAFTAR KUMPULAN NILAI (DKN)</h2>
                  <p className="text-sm font-extrabold">SDIT EL-FATAH &bull; YAYASAN PENDIDIKAN DAARUL HABIBAH</p>
                  <p className="text-xs text-slate-600">
                    Rombongan Belajar: {targetRombel} &bull; Tahun Ajaran 2026/2027 Semester Ganjil
                  </p>
                </div>

                <div className="grid grid-cols-2 text-xs font-bold bg-slate-100 p-3 rounded">
                  <p>Rombongan Belajar: {targetRombel}</p>
                  <p>Wali Kelas: {targetWali.name} (NIPY: {targetWali.nipy})</p>
                  <p>Jumlah Siswa: {scoredRaports.length} Peserta Didik</p>
                  <p>Rata-Rata Nilai Rombel: {classAvgTotal}</p>
                </div>

                <table className="w-full text-left text-xs border-collapse border border-slate-400">
                  <thead>
                    <tr className="bg-slate-200 font-black">
                      <th className="border border-slate-400 p-2 text-center">Rank</th>
                      <th className="border border-slate-400 p-2">NISN</th>
                      <th className="border border-slate-400 p-2">Nama Siswa</th>
                      <th className="border border-slate-400 p-2 text-center">JK</th>
                      {standardSubjects.map((sub, idx) => (
                        <th key={idx} className="border border-slate-400 p-2 text-center">{sub}</th>
                      ))}
                      <th className="border border-slate-400 p-2 text-center">Total</th>
                      <th className="border border-slate-400 p-2 text-center">Rerata</th>
                      <th className="border border-slate-400 p-2 text-center">Ketuntasan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scoredRaports.map((r, rIdx) => {
                      const studentObj = students.find((s) => s.id === r.studentId || s.nis === r.nisn);
                      return (
                        <tr key={r.id}>
                          <td className="border border-slate-400 p-2 text-center font-bold">{rIdx + 1}</td>
                          <td className="border border-slate-400 p-2 font-mono">{r.nisn}</td>
                          <td className="border border-slate-400 p-2 font-bold">{r.studentName}</td>
                          <td className="border border-slate-400 p-2 text-center">{studentObj?.gender || 'L'}</td>
                          {standardSubjects.map((sub, sIdx) => {
                            const foundGrade = r.grades.find(
                              (g) => g.subject.toLowerCase() === sub.toLowerCase()
                            );
                            return (
                              <td key={sIdx} className="border border-slate-400 p-2 text-center font-mono">
                                {foundGrade ? foundGrade.score : 85}
                              </td>
                            );
                          })}
                          <td className="border border-slate-400 p-2 text-center font-mono font-bold">{r.totalScore}</td>
                          <td className="border border-slate-400 p-2 text-center font-mono font-bold">{r.avgScore}</td>
                          <td className="border border-slate-400 p-2 text-center font-bold">TUNTAS</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div className="grid grid-cols-2 gap-8 pt-8 text-center text-xs">
                  <div>
                    <p>Mengetahui,</p>
                    <p className="font-bold">Kepala Sekolah SDIT EL-FATAH</p>
                    <div className="h-16"></div>
                    <p className="font-bold underline">Masykur Rohana, S.Sos</p>
                    <p className="text-[10px] font-mono">NIPY: 1985031201</p>
                  </div>
                  <div>
                    <p>Kab. Tangerang, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p className="font-bold">Wali Kelas {targetRombel}</p>
                    <div className="h-16"></div>
                    <p className="font-bold underline">{targetWali.name}</p>
                    <p className="text-[10px] font-mono">NIPY: {targetWali.nipy}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ================= 2. INFORMASI SPP BULANAN VIEW ================= */}
      {activeSubTab === 'spp_bulanan' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-black uppercase border border-emerald-200">
                  Portal Transparansi SPP & Kewajiban Wali Murid
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

            {currentRole !== 'ORANG_TUA' && (
              <button
                onClick={() => setActiveSubTab('konsultasi')}
                className="px-4 py-2.5 bg-blue-700 hover:bg-blue-600 text-white font-extrabold text-xs rounded-xl shadow flex items-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Buka Pesan & Konfirmasi Pembayaran</span>
              </button>
            )}
          </div>

          <div className="space-y-6">
            {students
              .filter((std) => {
                if (currentRole === 'ORANG_TUA') {
                  return std.id === selectedParentStudentId;
                }
                return selectedRombel === 'SEMUA' || isClassMatching(std.gradeClass, selectedRombel);
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
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              std.sppStatus === 'LUNAS'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : std.sppStatus === 'MENUNGGU'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-rose-100 text-rose-800 border border-rose-300'
                            }`}
                          >
                            Status E-Raport: {std.sppStatus === 'LUNAS' ? 'TERBUKA (LUNAS)' : 'TERKUNCI (BELUM LUNAS)'}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-base mt-1">{std.name}</h4>
                        <p className="text-xs text-slate-600">Wali Murid: <strong>{std.parentName || 'Orang Tua Siswa'}</strong> &bull; Wali Kelas: <strong>{getWaliKelasByGrade(std.gradeClass, teachers)}</strong></p>
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

                        {currentRole !== 'ORANG_TUA' && (
                          <div className="flex items-center gap-1.5">
                            {std.sppStatus !== 'LUNAS' ? (
                              <button
                                onClick={() => handleQuickSetSppStatus(std.id, 'LUNAS')}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow flex items-center gap-1 cursor-pointer"
                                title="Verifikasi Lunas untuk membuka E-Raport"
                              >
                                <Unlock className="w-3.5 h-3.5" />
                                <span>Tandai LUNAS</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleQuickSetSppStatus(std.id, 'TUNGGAKAN')}
                                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1 cursor-pointer"
                                title="Kunci kembali E-Raport"
                              >
                                <Lock className="w-3.5 h-3.5" />
                                <span>Tandai Tunggakan</span>
                              </button>
                            )}
                          </div>
                        )}
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

      {/* ================= 3. KONSULTASI PRESTASI & SPP VIEW ================= */}
      {activeSubTab === 'konsultasi' && (
        <div className="space-y-6">
          {/* Wali Kelas Class Responsibility Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-5 rounded-3xl border border-blue-900/50 shadow-md space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-amber-400 shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    Konsultasi Prestasi Siswa & Konfirmasi Kewajiban SPP Per Kelas
                  </h3>
                  <p className="text-xs text-blue-200/90 mt-0.5 leading-relaxed">
                    Koordinasi capaian tahfidz, piagam lomba, dan konfirmasi kewajiban administrasi SPP dengan orang tua murid merupakan tanggung jawab resmi Wali Kelas masing-masing.
                  </p>
                </div>
              </div>

              {selectedRombel !== 'SEMUA' ? (
                <div className="p-3 bg-blue-900/60 rounded-2xl border border-blue-400/40 text-xs text-blue-100 font-medium shrink-0">
                  <p className="text-[11px] text-blue-300 font-bold uppercase">Wali Kelas Penanggung Jawab ({selectedRombel}):</p>
                  <p className="font-black text-amber-300 text-sm mt-0.5">
                    {getWaliKelasByGrade(selectedRombel, teachers)}
                  </p>
                </div>
              ) : (
                <div className="p-2.5 bg-blue-900/40 rounded-2xl border border-blue-500/30 text-xs text-blue-200 shrink-0">
                  <span className="font-bold text-amber-300">Menampilkan Semua Kelas</span> &bull; Pilih kelas untuk filter rombel
                </div>
              )}
            </div>

            {/* Class Switcher Pill Bar for Consultation */}
            {currentRole !== 'ORANG_TUA' && (
              <div className="pt-2 border-t border-blue-900/60 flex flex-wrap gap-2 items-center">
                <span className="text-[11px] font-extrabold text-blue-300 mr-1">Filter Rombel:</span>
                {['SEMUA', 'Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'].map((rom) => {
                  const countInClass = rom === 'SEMUA'
                    ? consultationMessages.length
                    : consultationMessages.filter((m) => isClassMatching(m.gradeClass, rom)).length;
                  const isSel = selectedRombel === rom;
                  return (
                    <button
                      key={rom}
                      onClick={() => setSelectedRombel(rom)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                        isSel
                          ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                          : 'bg-blue-950 text-blue-200 hover:bg-blue-900 hover:text-white border border-blue-800/60'
                      }`}
                    >
                      <span>{rom}</span>
                      <span className={`px-1.5 py-0.2 text-[10px] rounded-full ${
                        isSel ? 'bg-slate-950 text-amber-300 font-black' : 'bg-blue-900 text-blue-300'
                      }`}>
                        {countInClass} Pesan
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-900 text-xs font-black rounded-full border border-blue-200 uppercase mb-1">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-700" /> Komunikasi Interaktif Guru & Wali Murid
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  Formulir Kirim Pesan & Catatan Pembelajaran
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Gunakan formulir ini untuk mengirim apresiasi prestasi, hafalan Qur'an, maupun konfirmasi administrasi rekening & VA BSI.
                </p>
              </div>

              {currentRole === 'ORANG_TUA' && (
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 font-medium">
                  <p className="font-bold text-amber-900">Wali Kelas Ananda:</p>
                  <p className="font-black text-slate-900 text-sm">
                    {getWaliKelasByGrade(
                      students.find((s) => s.id === selectedParentStudentId)?.gradeClass || 'Kelas 1',
                      teachers
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* MESSAGE COMPOSER FORM */}
            <form onSubmit={handleSendConsultationMessage} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="text-xs font-black uppercase text-slate-800 flex items-center gap-1.5">
                <PlusCircle className="w-4 h-4 text-emerald-600" />
                <span>{currentRole === 'ORANG_TUA' ? 'Kirim Pesan / Konfirmasi Pembayaran ke Wali Kelas' : 'Kirim Catatan Prestasi / Pemberitahuan SPP ke Wali Murid'}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {/* Target Student (Filtered by selectedRombel) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Pilih Siswa / Ananda {selectedRombel !== 'SEMUA' ? `(${selectedRombel})` : ''}:
                  </label>
                  <select
                    value={selectedConsultationStudentId}
                    onChange={(e) => setSelectedConsultationStudentId(e.target.value)}
                    disabled={currentRole === 'ORANG_TUA'}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {students
                      .filter((std) => selectedRombel === 'SEMUA' || isClassMatching(std.gradeClass, selectedRombel))
                      .map((std) => (
                        <option key={std.id} value={std.id}>
                          {std.name} ({std.gradeClass}) - SPP: {std.sppStatus} &bull; Wali: {std.parentName || 'Bpk/Ibu'}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Kategori Pesan:</label>
                  <select
                    value={newMsgCategory}
                    onChange={(e) => setNewMsgCategory(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PRESTASI">🏆 Prestasi & Capaian Belajar / Tahfidz</option>
                    <option value="KEWAJIBAN_SPP">💳 Kewajiban SPP & Bukti Transfer</option>
                    <option value="KONSULTASI_BELAJAR">📖 Konsultasi Perkembangan Karakter</option>
                    <option value="AKADEMIK">📝 Akademik & Info Ujian / E-Raport</option>
                  </select>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Judul / Perihal:</label>
                  <input
                    type="text"
                    value={newMsgTitle}
                    onChange={(e) => setNewMsgTitle(e.target.value)}
                    placeholder="Contoh: Konfirmasi Transfer SPP / Apresiasi Tahfidz"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Target Student Info Helper */}
              {(() => {
                const targetStudent = students.find((s) => s.id === selectedConsultationStudentId);
                if (!targetStudent) return null;
                return (
                  <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 text-xs flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-blue-950">Wali Kelas Penanggung Jawab:</span>
                      <span className="font-black text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded-md border border-blue-300">
                        {getWaliKelasByGrade(targetStudent.gradeClass, teachers)} ({targetStudent.gradeClass})
                      </span>
                      <span className="text-slate-600">&bull; Wali Murid: <strong className="text-slate-900">{targetStudent.parentName || `Bpk/Ibu ${targetStudent.name.split(' ')[0]}`}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-600">Status SPP Siswa:</span>
                      <span className={`font-black px-2.5 py-0.5 rounded-md text-[11px] ${
                        targetStudent.sppStatus === 'LUNAS' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}>
                        {targetStudent.sppStatus}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Message Content */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Isi Pesan / Catatan:</label>
                <textarea
                  rows={3}
                  value={newMsgText}
                  onChange={(e) => setNewMsgText(e.target.value)}
                  placeholder="Tuliskan pesan konsultasi atau rincian catatan perkembangan siswa..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Attachment / Bank Info */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Catatan Tambahan / Nomor Referensi Transfer / Sertifikat (Opsional):</label>
                <input
                  type="text"
                  value={newMsgAttachmentNote}
                  onChange={(e) => setNewMsgAttachmentNote(e.target.value)}
                  placeholder="Contoh: No. Ref BSI 20260812999 Rp 350.000 / No. VA BSI: 88020203189410089"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-700 hover:bg-blue-600 text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Pesan Konsultasi</span>
                </button>
              </div>
            </form>
          </div>

          {/* LIST OF CONSULTATION THREADS (FILTERED BY ROMBEL) */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-700" />
                <span>
                  Riwayat Interaksi & Konsultasi {selectedRombel !== 'SEMUA' ? selectedRombel : 'Semua Kelas'} ({filteredConsultationMessages.length} Pesan)
                </span>
              </h4>

              {selectedRombel !== 'SEMUA' && (
                <span className="text-xs font-bold text-slate-600">
                  Tanggung Jawab: <strong className="text-blue-900">{getWaliKelasByGrade(selectedRombel, teachers)}</strong>
                </span>
              )}
            </div>

            {filteredConsultationMessages.length === 0 ? (
              <div className="bg-white p-10 rounded-3xl border border-slate-200 text-center space-y-3 shadow-sm">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <MessageSquare className="w-7 h-7" />
                </div>
                <h4 className="font-black text-slate-800 text-base">
                  Belum Ada Riwayat Pesan untuk {selectedRombel !== 'SEMUA' ? selectedRombel : 'Rombel Ini'}
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Silakan gunakan formulir di atas untuk mengirimkan catatan prestasi, apresiasi hafalan tahfidz, atau konfirmasi kewajiban administrasi SPP kepada orang tua murid.
                </p>
              </div>
            ) : (
              filteredConsultationMessages.map((msg) => {
                const studentObj = students.find((s) => s.id === msg.studentId);
                const isSenderParent = msg.senderType === 'WALI_MURID';

                return (
                  <div
                    key={msg.id}
                    className={`bg-white p-6 rounded-3xl border shadow-sm space-y-3 transition ${
                      msg.category === 'PRESTASI'
                        ? 'border-amber-200'
                        : msg.category === 'KEWAJIBAN_SPP'
                        ? 'border-rose-200'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-white shrink-0 ${
                            isSenderParent ? 'bg-amber-500' : 'bg-blue-800'
                          }`}
                        >
                          {isSenderParent ? <User className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900 text-xs">{msg.senderName}</span>
                            <span
                              className={`text-[10px] font-black px-2 py-0.2 rounded-full uppercase ${
                                msg.category === 'PRESTASI'
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                  : msg.category === 'KEWAJIBAN_SPP'
                                  ? 'bg-rose-100 text-rose-900 border border-rose-300'
                                  : 'bg-blue-100 text-blue-900 border border-blue-300'
                              }`}
                            >
                              {msg.category.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            Siswa: <strong className="text-slate-800">{msg.studentName}</strong> ({msg.gradeClass}) &bull; {msg.timestamp}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                            msg.status === 'DITANGGAPI'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {msg.status}
                        </span>

                        {/* Quick Unlocking Button for Teachers/Admins if message is about SPP */}
                        {currentRole !== 'ORANG_TUA' && studentObj && msg.category === 'KEWAJIBAN_SPP' && (
                          studentObj.sppStatus !== 'LUNAS' ? (
                            <button
                              onClick={() => handleQuickSetSppStatus(studentObj.id, 'LUNAS')}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow flex items-center gap-1 cursor-pointer"
                              title="Verifikasi Lunas untuk membuka E-Raport"
                            >
                              <Unlock className="w-3.5 h-3.5" />
                              <span>Verifikasi & Buka E-Raport (LUNAS)</span>
                            </button>
                          ) : (
                            <span className="text-[10px] font-black px-2.5 py-1 bg-emerald-100 text-emerald-900 rounded-full border border-emerald-300 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-700" /> E-Raport Terbuka
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-extrabold text-slate-900 text-sm">{msg.title}</h5>
                      <p className="text-xs text-slate-700 leading-relaxed mt-1 whitespace-pre-line">{msg.message}</p>
                    </div>

                    {msg.attachmentNote && (
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-2">
                        <Receipt className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Lampiran / Bukti: <strong className="text-slate-900">{msg.attachmentNote}</strong></span>
                      </div>
                    )}

                    {/* Inline Reply Form */}
                    <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={replyInputMap[msg.id] || ''}
                        onChange={(e) => setReplyInputMap({ ...replyInputMap, [msg.id]: e.target.value })}
                        placeholder={`Balas pesan ini sebagai ${currentRole === 'ORANG_TUA' ? 'Wali Murid' : 'Wali Kelas'}...`}
                        className="flex-1 px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => handleSendReply(msg.id)}
                        className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow transition cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                      >
                        <Send className="w-3.5 h-3.5 text-amber-400" />
                        <span>Kirim Balasan</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ================= TEACHER JOURNALS VIEW ================= */}
      {activeSubTab === 'jurnal' && (
        <div className="space-y-6">
          {/* Journal Rombel Header & Class Switcher */}
          <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white p-5 rounded-3xl border border-emerald-900/50 shadow-md space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    Jurnal Mengajar & Usulan Rombongan Belajar
                  </h3>
                  <p className="text-xs text-emerald-200/90 mt-0.5 leading-relaxed">
                    Dokumentasi ketercapaian materi ajar harian, alat peraga SiPLah, dan persetujuan Kepala Sekolah per kelas.
                  </p>
                </div>
              </div>

              {selectedRombel !== 'SEMUA' ? (
                <div className="p-3 bg-emerald-900/60 rounded-2xl border border-emerald-400/40 text-xs text-emerald-100 font-medium shrink-0">
                  <p className="text-[11px] text-emerald-300 font-bold uppercase">Guru Pengampu / Wali ({selectedRombel}):</p>
                  <p className="font-black text-amber-300 text-sm mt-0.5">
                    {getWaliKelasByGrade(selectedRombel, teachers)}
                  </p>
                </div>
              ) : (
                <div className="p-2.5 bg-emerald-900/40 rounded-2xl border border-emerald-500/30 text-xs text-emerald-200 shrink-0">
                  <span className="font-bold text-amber-300">Menampilkan Seluruh Jurnal Kelas</span>
                </div>
              )}
            </div>

            {/* Class Switcher Pill Bar for Journals */}
            {currentRole !== 'ORANG_TUA' && (
              <div className="pt-2 border-t border-emerald-900/60 flex flex-wrap gap-2 items-center">
                <span className="text-[11px] font-extrabold text-emerald-300 mr-1">Filter Rombel:</span>
                {['SEMUA', 'Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'].map((rom) => {
                  const countInClass = rom === 'SEMUA'
                    ? teacherJournals.length
                    : teacherJournals.filter((j) => isClassMatching(j.rombonganBelajar, rom)).length;
                  const isSel = selectedRombel === rom;
                  return (
                    <button
                      key={rom}
                      onClick={() => setSelectedRombel(rom)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                        isSel
                          ? 'bg-emerald-400 text-slate-950 font-black shadow-md'
                          : 'bg-emerald-950 text-emerald-200 hover:bg-emerald-900 hover:text-white border border-emerald-800/60'
                      }`}
                    >
                      <span>{rom}</span>
                      <span className={`px-1.5 py-0.2 text-[10px] rounded-full ${
                        isSel ? 'bg-slate-950 text-emerald-300 font-black' : 'bg-emerald-900 text-emerald-300'
                      }`}>
                        {countInClass} Jurnal
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-700" />
              <span>
                Daftar Jurnal Mengajar {selectedRombel !== 'SEMUA' ? selectedRombel : 'Semua Kelas'} ({filteredJournals.length} Catatan)
              </span>
            </h4>

            {currentRole !== 'ORANG_TUA' && (
              <button
                onClick={() => {
                  setJurnalRombelClass(selectedRombel !== 'SEMUA' ? selectedRombel : 'Kelas 1');
                  setTeacherNameInput(getWaliKelasByGrade(selectedRombel !== 'SEMUA' ? selectedRombel : 'Kelas 1', teachers));
                  setShowJournalModal(true);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Buat Jurnal Mengajar Rombel</span>
              </button>
            )}
          </div>

          {filteredJournals.length === 0 ? (
            <div className="bg-white p-10 rounded-3xl border border-slate-200 text-center space-y-3 shadow-sm">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <BookOpen className="w-7 h-7" />
              </div>
              <h4 className="font-black text-slate-800 text-base">
                Belum Ada Catatan Jurnal Mengajar untuk {selectedRombel !== 'SEMUA' ? selectedRombel : 'Rombel Ini'}
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Silakan buat catatan materi pembelajaran, ketercapaian kompetensi, dan usulan alat peraga SiPLah untuk diajukan ke Kepala Sekolah.
              </p>
            </div>
          ) : (
            filteredJournals.map((jrn) => (
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
                    Guru Pengampu / Wali: <span className="font-bold text-slate-900">{jrn.teacherName}</span> &bull; Tanggal:{' '}
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
            ))
          )}
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
                    Isi data NIS, Tahun, Nama, Kelas, Wali Murid, Wali Kelas terverifikasi, dan Nilai Pelajaran.
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
              {/* TOP SECTION: KELAS FILTER & STUDENT SELECTION */}
              {!editingRaportId && (
                <div className="bg-blue-50/80 p-4.5 rounded-2xl border border-blue-200 space-y-4 shadow-xs">
                  <div className="flex items-center gap-2 text-blue-900 border-b border-blue-200 pb-2">
                    <Filter className="w-4 h-4 text-blue-600" />
                    <h4 className="text-xs font-black uppercase tracking-wide">
                      1. Pilih Kelas & Filter Data Siswa (Di Tempatkan Di Bagian Atas)
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Kelas / Rombel Selector at the top */}
                    <div>
                      <label className="block text-xs font-black text-slate-800 mb-1">
                        A. Pilih Kelas / Rombel <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formGradeClass}
                        onChange={(e) => handleGradeClassChange(e.target.value)}
                        className="w-full bg-white border border-blue-300 rounded-xl px-3 py-2 text-xs font-black text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
                      >
                        <option value="Kelas 1">Kelas 1</option>
                        <option value="Kelas 2">Kelas 2</option>
                        <option value="Kelas 3">Kelas 3</option>
                        <option value="Kelas 4">Kelas 4</option>
                        <option value="Kelas 5">Kelas 5</option>
                        <option value="Kelas 6">Kelas 6</option>
                      </select>
                      <p className="text-[10px] text-blue-700 font-medium mt-1">
                        Memfilter daftar siswa di bawah berdasarkan kelas yang dipilih.
                      </p>
                    </div>

                    {/* Student Selector placed after Class Selector - uses isClassMatching */}
                    <div>
                      <label className="block text-xs font-black text-emerald-950 mb-1">
                        B. Pilih Siswa (Hasil Filter {formGradeClass}) <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={selectedStudentPreset}
                        onChange={(e) => handleSelectStudentPreset(e.target.value)}
                        className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-xs font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                      >
                        <option value="">-- Pilih Siswa di {formGradeClass} --</option>
                        {students
                          .filter((s) => !formGradeClass || isClassMatching(s.gradeClass, formGradeClass))
                          .map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name} (NIS: {s.nis}) &bull; Wali: {s.parentName || 'Bpk/Ibu'}
                            </option>
                          ))}
                      </select>
                      <p className="text-[10px] text-emerald-700 font-medium mt-1">
                        Memilih siswa akan mengisi otomatis Nama, NIS, dan data Wali Murid.
                      </p>
                    </div>
                  </div>
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

                {editingRaportId && (
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
                )}

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

                {/* Penandatangan E-Raport: strictly Wali Kelas list */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1">
                    6. Wali Kelas (Penandatangan E-Raport) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formTeacherName}
                    onChange={(e) => setFormTeacherName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                  >
                    {authorizedWaliKelasList.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name} (Wali {t.assignedRombel || 'Rombel'})
                      </option>
                    ))}
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
                    onChange={(e) => {
                      setJurnalRombelClass(e.target.value);
                      setTeacherNameInput(getWaliKelasByGrade(e.target.value, teachers));
                    }}
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Wali Kelas Pengampu</label>
                <select
                  value={teacherNameInput}
                  onChange={(e) => setTeacherNameInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                >
                  {authorizedWaliKelasList.map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name} (Wali {t.assignedRombel || 'Rombel'})
                    </option>
                  ))}
                </select>
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
