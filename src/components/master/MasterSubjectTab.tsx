import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { SubjectItem, Teacher } from '../../types';
import { printDocument } from '../../utils/printHelper';
import {
  BookOpen,
  PlusCircle,
  Edit,
  Trash2,
  Printer,
  Download,
  Upload,
  Check,
  X,
  Search,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Layers,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

interface MasterSubjectTabProps {
  subjects: SubjectItem[];
  teachers: Teacher[];
  onAddSubject: (subject: SubjectItem) => void;
  onUpdateSubject: (subject: SubjectItem) => void;
  onDeleteSubject: (id: string) => void;
  onImportSubjects?: (subjects: SubjectItem[]) => void;
}

export const MasterSubjectTab: React.FC<MasterSubjectTabProps> = ({
  subjects,
  teachers,
  onAddSubject,
  onUpdateSubject,
  onDeleteSubject,
  onImportSubjects,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('ALL');
  const [waliFilter, setWaliFilter] = useState('ALL');

  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [inlineForm, setInlineForm] = useState<Partial<SubjectItem>>({});

  // Modal Add / Edit state
  const [showModal, setShowModal] = useState(false);
  const [modalSubject, setModalSubject] = useState<SubjectItem | null>(null);
  const [formNipy, setFormNipy] = useState('');
  const [formTeacherName, setFormTeacherName] = useState('');
  const [formWaliKelas, setFormWaliKelas] = useState('-');
  const [formSubjectName, setFormSubjectName] = useState('');
  const [formGradeClass, setFormGradeClass] = useState('Kelas 1 - 6');
  const [formKkm, setFormKkm] = useState<number>(75);
  const [formSemester, setFormSemester] = useState('Semester 1 (Ganjil)');
  const [formAcademicYear, setFormAcademicYear] = useState('2026/2027');
  const [formNotes, setFormNotes] = useState('');

  // Delete confirm state
  const [deleteConfirmSubject, setDeleteConfirmSubject] = useState<SubjectItem | null>(null);

  // Success message toast
  const [successToast, setSuccessToast] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quick Inline Edit Handlers
  const handleStartInlineEdit = (sub: SubjectItem) => {
    setEditingId(sub.id);
    setInlineForm({ ...sub });
  };

  const handleCancelInlineEdit = () => {
    setEditingId(null);
    setInlineForm({});
  };

  const handleSaveInlineEdit = (id: string) => {
    if (!inlineForm.subjectName || !inlineForm.teacherName) {
      alert('Nama Mata Pelajaran dan Nama Guru wajib diisi.');
      return;
    }

    const original = subjects.find((s) => s.id === id);
    if (!original) return;

    const updated: SubjectItem = {
      ...original,
      nipy: inlineForm.nipy || original.nipy,
      teacherName: inlineForm.teacherName || original.teacherName,
      waliKelas: inlineForm.waliKelas || original.waliKelas,
      subjectName: inlineForm.subjectName || original.subjectName,
      gradeClass: inlineForm.gradeClass || original.gradeClass,
      kkm: Number(inlineForm.kkm) || original.kkm,
      semester: inlineForm.semester || original.semester,
      academicYear: inlineForm.academicYear || original.academicYear,
      notes: inlineForm.notes !== undefined ? inlineForm.notes : original.notes,
    };

    onUpdateSubject(updated);
    setEditingId(null);
    setInlineForm({});
    setSuccessToast(`Mata Pelajaran "${updated.subjectName}" berhasil diperbarui & disimpan!`);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  // Modal Open Handlers
  const handleOpenAddModal = () => {
    setModalSubject(null);
    setFormNipy(teachers[0]?.nipy || '1988110504');
    setFormTeacherName(teachers[0]?.name || 'Ojah Nasiah Ulfah, S.Ag');
    setFormWaliKelas(teachers[0]?.assignedRombel || '-');
    setFormSubjectName('');
    setFormGradeClass('Kelas 1 - 6');
    setFormKkm(75);
    setFormSemester('Semester 1 (Ganjil)');
    setFormAcademicYear('2026/2027');
    setFormNotes('');
    setShowModal(true);
  };

  const handleOpenEditModal = (sub: SubjectItem) => {
    setModalSubject(sub);
    setFormNipy(sub.nipy);
    setFormTeacherName(sub.teacherName);
    setFormWaliKelas(sub.waliKelas || '-');
    setFormSubjectName(sub.subjectName);
    setFormGradeClass(sub.gradeClass || 'Kelas 1 - 6');
    setFormKkm(sub.kkm || 75);
    setFormSemester(sub.semester || 'Semester 1 (Ganjil)');
    setFormAcademicYear(sub.academicYear || '2026/2027');
    setFormNotes(sub.notes || '');
    setShowModal(true);
  };

  const handleTeacherSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    setFormTeacherName(selectedName);
    const teacherObj = teachers.find((t) => t.name === selectedName);
    if (teacherObj) {
      if (teacherObj.nipy) setFormNipy(teacherObj.nipy);
      if (teacherObj.assignedRombel) setFormWaliKelas(teacherObj.assignedRombel);
    }
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSubjectName.trim() || !formTeacherName.trim()) {
      alert('Mohon isi nama mata pelajaran dan nama guru dengan benar.');
      return;
    }

    if (modalSubject) {
      const updated: SubjectItem = {
        ...modalSubject,
        nipy: formNipy.trim(),
        teacherName: formTeacherName.trim(),
        waliKelas: formWaliKelas.trim(),
        subjectName: formSubjectName.trim(),
        gradeClass: formGradeClass.trim(),
        kkm: Number(formKkm) || 75,
        semester: formSemester,
        academicYear: formAcademicYear,
        notes: formNotes.trim(),
      };
      onUpdateSubject(updated);
      setSuccessToast(`Mata Pelajaran "${updated.subjectName}" berhasil diperbarui!`);
    } else {
      const newSubject: SubjectItem = {
        id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        nipy: formNipy.trim() || `199${Math.floor(1000000 + Math.random() * 9000000)}`,
        teacherName: formTeacherName.trim(),
        waliKelas: formWaliKelas.trim() || '-',
        subjectName: formSubjectName.trim(),
        gradeClass: formGradeClass.trim() || 'Kelas 1 - 6',
        kkm: Number(formKkm) || 75,
        semester: formSemester,
        academicYear: formAcademicYear,
        notes: formNotes.trim(),
      };
      onAddSubject(newSubject);
      setSuccessToast(`Mata Pelajaran "${newSubject.subjectName}" berhasil ditambahkan ke Master Data!`);
    }

    setShowModal(false);
    setModalSubject(null);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmSubject) {
      onDeleteSubject(deleteConfirmSubject.id);
      setSuccessToast(`Mata Pelajaran "${deleteConfirmSubject.subjectName}" berhasil dihapus.`);
      setDeleteConfirmSubject(null);
      setTimeout(() => setSuccessToast(''), 4000);
    }
  };

  // --- EXCEL EXPORT & IMPORT ---
  const handleExportExcel = () => {
    if (subjects.length === 0) {
      alert('Belum ada data mata pelajaran untuk diunduh.');
      return;
    }

    const exportData = subjects.map((s, idx) => ({
      'No': idx + 1,
      'NIPY (Nomor Induk Pegawai)': s.nipy,
      'Nama Guru Pengampu': s.teacherName,
      'Wali Kelas': s.waliKelas || '-',
      'Mata Pelajaran': s.subjectName,
      'Target Rombel / Tingkat': s.gradeClass || 'Kelas 1 - 6',
      'KKM / Kriteria Ketuntasan': s.kkm || 75,
      'Semester': s.semester || 'Semester 1 (Ganjil)',
      'Tahun Ajaran': s.academicYear || '2026/2027',
      'Keterangan / Ruang Lingkup': s.notes || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Master Mata Pelajaran');
    XLSX.writeFile(workbook, `Data_Master_Mata_Pelajaran_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const handleDownloadTemplate = () => {
    const templateData = [
      {
        'NIPY (Nomor Induk Pegawai)': '1988110504',
        'Nama Guru Pengampu': 'Ojah Nasiah Ulfah, S.Ag',
        'Wali Kelas': 'Kelas 3',
        'Mata Pelajaran': 'Pendidikan Agama Islam & Budi Pekerti',
        'Target Rombel / Tingkat': 'Kelas 1 - 6',
        'KKM / Kriteria Ketuntasan': 78,
        'Semester': 'Semester 1 (Ganjil)',
        'Tahun Ajaran': '2026/2027',
        'Keterangan / Ruang Lingkup': 'Akidah Akhlak, Fiqih Ibadah & Tarikh',
      },
      {
        'NIPY (Nomor Induk Pegawai)': '1992041802',
        'Nama Guru Pengampu': 'Siti Rahmawati, S.Pd',
        'Wali Kelas': 'Kelas 1',
        'Mata Pelajaran': 'Bahasa Indonesia (Literasi & Membaca)',
        'Target Rombel / Tingkat': 'Kelas 1',
        'KKM / Kriteria Ketuntasan': 75,
        'Semester': 'Semester 1 (Ganjil)',
        'Tahun Ajaran': '2026/2027',
        'Keterangan / Ruang Lingkup': 'Fonik, kosakata, kalimat sederhana',
      },
      {
        'NIPY (Nomor Induk Pegawai)': '1995011007',
        'Nama Guru Pengampu': 'Nurul Hidayah, S.Pd.I',
        'Wali Kelas': '-',
        'Mata Pelajaran': 'Tahsin & Tahfidz Al-Qur\'an',
        'Target Rombel / Tingkat': 'Kelas 1 - 6',
        'KKM / Kriteria Ketuntasan': 80,
        'Semester': 'Semester 1 (Ganjil)',
        'Tahun Ajaran': '2026/2027',
        'Keterangan / Ruang Lingkup': 'Metode Ummi, Tajwid, Juz 30',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template Import Mapel');
    XLSX.writeFile(workbook, `Template_Import_Mata_Pelajaran.xlsx`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json: any[] = XLSX.utils.sheet_to_json(worksheet);

        if (!json || json.length === 0) {
          alert('File Excel kosong atau format tidak dikenali.');
          return;
        }

        const imported: SubjectItem[] = json.map((row, idx) => {
          const nipy = String(
            row['NIPY (Nomor Induk Pegawai)'] ||
              row['NIPY'] ||
              row['NIP'] ||
              row['Nomor Induk'] ||
              `199${Math.floor(1000000 + Math.random() * 9000000)}`
          ).trim();

          const teacherName = String(
            row['Nama Guru Pengampu'] ||
              row['Nama Guru'] ||
              row['Guru'] ||
              row['Pendidik'] ||
              `Guru Mapel ${idx + 1}`
          ).trim();

          const waliKelas = String(
            row['Wali Kelas'] || row['Walikelas'] || row['Wali'] || '-'
          ).trim();

          const subjectName = String(
            row['Mata Pelajaran'] ||
              row['Mapel'] ||
              row['Nama Pelajaran'] ||
              `Mata Pelajaran ${idx + 1}`
          ).trim();

          const gradeClass = String(
            row['Target Rombel / Tingkat'] || row['Target Rombel'] || row['Kelas'] || 'Kelas 1 - 6'
          ).trim();

          const kkmRaw = row['KKM / Kriteria Ketuntasan'] || row['KKM'] || row['Kkm'] || 75;
          const kkm = Number(kkmRaw) || 75;

          const semester = String(row['Semester'] || 'Semester 1 (Ganjil)').trim();
          const academicYear = String(row['Tahun Ajaran'] || '2026/2027').trim();
          const notes = String(row['Keterangan / Ruang Lingkup'] || row['Keterangan'] || row['Catatan'] || '').trim();

          return {
            id: `sub-imp-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
            nipy,
            teacherName,
            waliKelas,
            subjectName,
            gradeClass,
            kkm,
            semester,
            academicYear,
            notes,
          };
        });

        if (onImportSubjects) {
          onImportSubjects(imported);
        } else {
          imported.forEach((item) => onAddSubject(item));
        }

        setSuccessToast(`Berhasil mengimpor ${imported.length} data Mata Pelajaran dari Excel!`);
        setTimeout(() => setSuccessToast(''), 5000);
      } catch (err) {
        console.error('Error parsing excel:', err);
        alert('Gagal membaca file Excel. Pastikan format .xlsx/.csv valid.');
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  const handlePrintSubjects = () => {
    printDocument('master-subjects-print', `Daftar_Mata_Pelajaran_SDIT_El_Fatah_${new Date().getFullYear()}`, {
      orientation: 'portrait',
    });
  };

  // Filtered List
  const filteredSubjects = subjects.filter((s) => {
    const matchesSearch =
      searchTerm === '' ||
      s.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nipy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.waliKelas && s.waliKelas.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesGrade =
      gradeFilter === 'ALL' ||
      (s.gradeClass && s.gradeClass.toLowerCase().includes(gradeFilter.toLowerCase())) ||
      s.gradeClass === 'Kelas 1 - 6';

    const matchesWali =
      waliFilter === 'ALL' ||
      (waliFilter === 'WALIKELAS' && s.waliKelas && s.waliKelas !== '-') ||
      (waliFilter === 'NON_WALIKELAS' && (!s.waliKelas || s.waliKelas === '-'));

    return matchesSearch && matchesGrade && matchesWali;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-3 text-xs text-emerald-950 font-bold shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Integration Notice Box */}
      <div className="p-4.5 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl shadow-md border border-emerald-700/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 bg-emerald-500/20 text-emerald-300 rounded-xl border border-emerald-500/30 shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-black rounded-md uppercase">
                Kurikulum Merdeka & Keislaman
              </span>
              <span className="text-[11px] text-emerald-300 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Single Source of Truth
              </span>
            </div>
            <h3 className="font-extrabold text-white text-sm mt-0.5">
              Master Mata Pelajaran, NIPY Guru & Penugasan Wali Kelas
            </h3>
            <p className="text-xs text-emerald-100/90 leading-relaxed">
              Tabel ini digunakan sebagai data acuan utama pembuatan <strong>Jurnal Mengajar Guru Rombel</strong> dan pengisian nilai pada <strong>E-Raport Siswa</strong>.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handlePrintSubjects}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl shadow border border-slate-600 flex items-center gap-1.5 cursor-pointer transition"
            title="Cetak Dokumen Daftar Mata Pelajaran & Distribusi Guru"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Cetak PDF</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow flex items-center gap-1.5 cursor-pointer transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Mata Pelajaran</span>
          </button>
        </div>
      </div>

      {/* Main Table Controls & Filters */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <span>Daftar Mata Pelajaran & Guru Pengampu</span>
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-mono font-bold text-xs rounded-full">
                {subjects.length} Mapel
              </span>
            </h4>
            <p className="text-xs text-slate-500">
              Menampilkan kolom NIPY, Nama Guru, Walikelas, Mata Pelajaran, serta tombol Edit dan Simpan langsung.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".xlsx,.xls,.csv"
              className="hidden"
            />

            <button
              onClick={handleDownloadTemplate}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              title="Download format Excel untuk impor data mata pelajaran"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Format Excel</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200 transition flex items-center gap-1.5 cursor-pointer"
              title="Upload file Excel data mata pelajaran"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-600" />
              <span>Upload Excel</span>
            </button>

            <button
              onClick={handleExportExcel}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Ekspor seluruh data mata pelajaran ke file Excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export Excel</span>
            </button>
          </div>
        </div>

        {/* Search & Select Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari mata pelajaran, guru pengampu, NIPY, walikelas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
            >
              <option value="ALL">Semua Tingkat Rombel</option>
              <option value="Kelas 1">Kelas 1</option>
              <option value="Kelas 2">Kelas 2</option>
              <option value="Kelas 3">Kelas 3</option>
              <option value="Kelas 4">Kelas 4</option>
              <option value="Kelas 5">Kelas 5</option>
              <option value="Kelas 6">Kelas 6</option>
            </select>

            <select
              value={waliFilter}
              onChange={(e) => setWaliFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
            >
              <option value="ALL">Semua Guru (Wali & Non-Wali)</option>
              <option value="WALIKELAS">Hanya Wali Kelas</option>
              <option value="NON_WALIKELAS">Guru Mata Pelajaran Non-Wali</option>
            </select>
          </div>
        </div>

        {/* The Master Subject Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-bold border-b border-slate-800">
                <th className="p-3 w-12 text-center">No</th>
                <th className="p-3 w-36">NIPY</th>
                <th className="p-3 min-w-[200px]">Nama Guru</th>
                <th className="p-3 w-36 text-center">Walikelas</th>
                <th className="p-3 min-w-[240px]">Mata Pelajaran</th>
                <th className="p-3 w-36 text-center">Target Rombel & KKM</th>
                <th className="p-3 w-40 text-center">Aksi (Edit / Simpan)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSubjects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 font-semibold">
                    Tidak ada data mata pelajaran yang cocok dengan filter atau kata kunci.
                  </td>
                </tr>
              ) : (
                filteredSubjects.map((sub, idx) => {
                  const isEditing = editingId === sub.id;

                  return (
                    <tr
                      key={sub.id}
                      className={isEditing ? 'bg-amber-50/70 transition' : 'hover:bg-slate-50/80 transition'}
                    >
                      {/* No */}
                      <td className="p-3 text-center font-bold text-slate-500">{idx + 1}</td>

                      {/* NIPY */}
                      <td className="p-3">
                        {isEditing ? (
                          <input
                            type="text"
                            value={inlineForm.nipy || ''}
                            onChange={(e) => setInlineForm({ ...inlineForm, nipy: e.target.value })}
                            className="w-full px-2 py-1 bg-white border border-amber-400 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-none"
                            placeholder="1988110504"
                          />
                        ) : (
                          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 text-[11px]">
                            {sub.nipy || '-'}
                          </span>
                        )}
                      </td>

                      {/* Nama Guru */}
                      <td className="p-3">
                        {isEditing ? (
                          <input
                            type="text"
                            value={inlineForm.teacherName || ''}
                            onChange={(e) => setInlineForm({ ...inlineForm, teacherName: e.target.value })}
                            className="w-full px-2 py-1 bg-white border border-amber-400 rounded-lg text-xs font-bold text-slate-900 focus:outline-none"
                            placeholder="Nama Lengkap Guru"
                          />
                        ) : (
                          <div>
                            <p className="font-extrabold text-slate-900">{sub.teacherName}</p>
                            {sub.notes && (
                              <p className="text-[10px] text-slate-500 truncate max-w-xs">{sub.notes}</p>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Walikelas */}
                      <td className="p-3 text-center">
                        {isEditing ? (
                          <select
                            value={inlineForm.waliKelas || '-'}
                            onChange={(e) => setInlineForm({ ...inlineForm, waliKelas: e.target.value })}
                            className="px-2 py-1 bg-white border border-amber-400 rounded-lg text-xs font-bold text-slate-900 focus:outline-none"
                          >
                            <option value="-">- Bukan Wali -</option>
                            <option value="Kelas 1">Kelas 1</option>
                            <option value="Kelas 2">Kelas 2</option>
                            <option value="Kelas 3">Kelas 3</option>
                            <option value="Kelas 4">Kelas 4</option>
                            <option value="Kelas 5">Kelas 5</option>
                            <option value="Kelas 6">Kelas 6</option>
                          </select>
                        ) : (
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              sub.waliKelas && sub.waliKelas !== '-'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {sub.waliKelas && sub.waliKelas !== '-' ? `Wali ${sub.waliKelas}` : '-'}
                          </span>
                        )}
                      </td>

                      {/* Mata Pelajaran */}
                      <td className="p-3">
                        {isEditing ? (
                          <input
                            type="text"
                            value={inlineForm.subjectName || ''}
                            onChange={(e) => setInlineForm({ ...inlineForm, subjectName: e.target.value })}
                            className="w-full px-2 py-1 bg-white border border-amber-400 rounded-lg text-xs font-black text-emerald-900 focus:outline-none"
                            placeholder="Nama Mata Pelajaran"
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-black text-emerald-950">{sub.subjectName}</span>
                          </div>
                        )}
                      </td>

                      {/* Target Rombel & KKM */}
                      <td className="p-3 text-center">
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={inlineForm.gradeClass || ''}
                              onChange={(e) => setInlineForm({ ...inlineForm, gradeClass: e.target.value })}
                              placeholder="Kelas 1 - 6"
                              className="w-20 px-1.5 py-1 bg-white border border-amber-400 rounded-lg text-[11px] font-bold"
                            />
                            <input
                              type="number"
                              value={inlineForm.kkm || 75}
                              onChange={(e) => setInlineForm({ ...inlineForm, kkm: Number(e.target.value) })}
                              placeholder="75"
                              className="w-12 px-1.5 py-1 bg-white border border-amber-400 rounded-lg text-[11px] font-mono font-black text-center"
                            />
                          </div>
                        ) : (
                          <div className="space-y-0.5">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-800 text-[10px] font-bold rounded-md">
                              {sub.gradeClass || 'Kelas 1 - 6'}
                            </span>
                            <span className="block text-[10px] font-mono font-bold text-slate-500">
                              KKM: <strong className="text-emerald-700">{sub.kkm || 75}</strong>
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Aksi: Edit & Simpan */}
                      <td className="p-3 text-center">
                        {isEditing ? (
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Tombol Simpan */}
                            <button
                              onClick={() => handleSaveInlineEdit(sub.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-black shadow flex items-center gap-1 cursor-pointer transition"
                              title="Simpan Perubahan Langsung"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Simpan</span>
                            </button>

                            {/* Tombol Batal */}
                            <button
                              onClick={handleCancelInlineEdit}
                              className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-[11px] font-bold cursor-pointer transition"
                              title="Batal Edit"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Tombol Edit Langsung / Modal */}
                            <button
                              onClick={() => handleStartInlineEdit(sub)}
                              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg text-[11px] transition cursor-pointer flex items-center gap-1 border border-blue-200"
                              title="Edit Data Baris Ini (Edit & Simpan)"
                            >
                              <Edit className="w-3 h-3" />
                              <span>Edit</span>
                            </button>

                            {/* Tombol Edit Modal Lengkap */}
                            <button
                              onClick={() => handleOpenEditModal(sub)}
                              className="p-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition cursor-pointer"
                              title="Edit Format Formulir Lengkap"
                            >
                              <Layers className="w-3.5 h-3.5" />
                            </button>

                            {/* Tombol Hapus */}
                            <button
                              onClick={() => setDeleteConfirmSubject(sub)}
                              className="p-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition cursor-pointer"
                              title="Hapus Mata Pelajaran"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL ADD / EDIT SUBJECT --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-emerald-800">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-slate-900 text-base">
                  {modalSubject ? 'Edit Data Mata Pelajaran' : 'Tambah Mata Pelajaran Baru'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  setModalSubject(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-3">
              {/* Mata Pelajaran Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Mata Pelajaran <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formSubjectName}
                  onChange={(e) => setFormSubjectName(e.target.value)}
                  placeholder="Contoh: Pendidikan Agama Islam & Budi Pekerti"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-black text-slate-900 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              {/* Guru & NIPY Selection */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Guru Pengampu <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formTeacherName}
                    onChange={handleTeacherSelectionChange}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none"
                  >
                    {teachers.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name} ({t.assignedRombel || 'Non-Wali'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    NIPY (Nomor Induk Yayasan) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formNipy}
                    onChange={(e) => setFormNipy(e.target.value)}
                    placeholder="1988110504"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Walikelas & Target Rombel */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Penugasan Walikelas</label>
                  <select
                    value={formWaliKelas}
                    onChange={(e) => setFormWaliKelas(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none"
                  >
                    <option value="-">- Bukan Wali Kelas -</option>
                    <option value="Kelas 1">Wali Kelas 1</option>
                    <option value="Kelas 2">Wali Kelas 2</option>
                    <option value="Kelas 3">Wali Kelas 3</option>
                    <option value="Kelas 4">Wali Kelas 4</option>
                    <option value="Kelas 5">Wali Kelas 5</option>
                    <option value="Kelas 6">Wali Kelas 6</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Rombel / Tingkat</label>
                  <input
                    type="text"
                    value={formGradeClass}
                    onChange={(e) => setFormGradeClass(e.target.value)}
                    placeholder="Kelas 1 - 6 atau Kelas 3"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* KKM & Semester */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">KKM (Kriteria Ketuntasan Minimal)</label>
                  <input
                    type="number"
                    value={formKkm}
                    onChange={(e) => setFormKkm(Number(e.target.value))}
                    min={50}
                    max={100}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-black text-slate-900 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Semester & Tahun Ajaran</label>
                  <input
                    type="text"
                    value={`${formSemester} - ${formAcademicYear}`}
                    disabled
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-500"
                  />
                </div>
              </div>

              {/* Scope / Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ruang Lingkup Materi / Keterangan Silabus
                </label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Contoh: Akidah Akhlak, Fiqih Ibadah Praktis, Tarikh Islam, Penguatan Adab"
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setModalSubject(null);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{modalSubject ? 'Simpan Perubahan' : 'Simpan Mata Pelajaran'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL DELETE CONFIRMATION --- */}
      {deleteConfirmSubject && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-3 bg-rose-100 rounded-2xl">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Hapus Mata Pelajaran?</h3>
                <p className="text-xs text-slate-500 font-mono">NIPY: {deleteConfirmSubject.nipy}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Apakah Anda yakin ingin menghapus mata pelajaran <strong>"{deleteConfirmSubject.subjectName}"</strong> yang diampu oleh{' '}
              <strong>{deleteConfirmSubject.teacherName}</strong>?
            </p>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteConfirmSubject(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow transition cursor-pointer"
              >
                Ya, Hapus Mata Pelajaran
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= HIDDEN PRINTABLE ELEMENT ================= */}
      <div className="hidden" aria-hidden="true">
        <div id="master-subjects-print" className="p-8 space-y-6 bg-white text-slate-900 font-sans">
          <div className="text-center border-b-2 border-slate-900 pb-4">
            <h2 className="text-lg font-black uppercase">
              MATRIKS DISTRIBUSI MATA PELAJARAN & TENAGA PENDIDIK
            </h2>
            <p className="text-sm font-extrabold">SDIT EL-FATAH &bull; YAYASAN PENDIDIKAN DAARUL HABIBAH</p>
            <p className="text-xs text-slate-600">
              Tahun Ajaran 2026/2027 &bull; Kurikulum Merdeka & Muatan Kekhasan Islami
            </p>
          </div>

          <table className="w-full text-left text-xs border-collapse border border-slate-400">
            <thead>
              <tr className="bg-slate-200 font-black">
                <th className="border border-slate-400 p-2 text-center w-8">No</th>
                <th className="border border-slate-400 p-2 w-28">NIPY</th>
                <th className="border border-slate-400 p-2">Nama Guru Pengampu</th>
                <th className="border border-slate-400 p-2 text-center w-28">Wali Kelas</th>
                <th className="border border-slate-400 p-2">Mata Pelajaran</th>
                <th className="border border-slate-400 p-2 text-center">Tingkat Rombel</th>
                <th className="border border-slate-400 p-2 text-center w-16">KKM</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((sub, idx) => (
                <tr key={`prt-sub-${sub.id}`}>
                  <td className="border border-slate-400 p-2 text-center">{idx + 1}</td>
                  <td className="border border-slate-400 p-2 font-mono font-bold">{sub.nipy}</td>
                  <td className="border border-slate-400 p-2 font-bold">{sub.teacherName}</td>
                  <td className="border border-slate-400 p-2 text-center font-semibold">
                    {sub.waliKelas && sub.waliKelas !== '-' ? sub.waliKelas : '-'}
                  </td>
                  <td className="border border-slate-400 p-2 font-bold">{sub.subjectName}</td>
                  <td className="border border-slate-400 p-2 text-center">{sub.gradeClass || 'Kelas 1 - 6'}</td>
                  <td className="border border-slate-400 p-2 text-center font-mono font-bold">{sub.kkm || 75}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="grid grid-cols-2 gap-8 pt-8 text-center text-xs">
            <div>
              <p>Mengetahui,</p>
              <p className="font-bold">Ketua Yayasan Pendidikan Daarul Habibah</p>
              <div className="h-16"></div>
              <p className="font-bold underline">Ubaidillah, M.Pd</p>
              <p className="text-[10px] text-slate-500 font-mono">NIY: 1980010101</p>
            </div>
            <div>
              <p>
                Kabupaten Tangerang,{' '}
                {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <p className="font-bold">Kepala Sekolah SDIT EL-FATAH</p>
              <div className="h-16"></div>
              <p className="font-bold underline">Masykur Rohana, S.Sos</p>
              <p className="text-[10px] text-slate-500 font-mono">NIPY: 1985031201</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
