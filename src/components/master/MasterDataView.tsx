import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { FoundationBoard, FoundationProfile, Student, Supplier, Teacher } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import { printDocument } from '../../utils/printHelper';
import { MediaUploader } from '../common/MediaUploader';
import {
  Users,
  GraduationCap,
  Building2,
  Store,
  PlusCircle,
  Edit,
  Trash2,
  Printer,
  X,
  CheckCircle2,
  RefreshCw,
  Coins,
  Download,
  Upload,
  FileSpreadsheet,
  Image,
  Sparkles,
  DollarSign,
} from 'lucide-react';

interface MasterDataViewProps {
  initialTab?: 'siswa' | 'guru' | 'pengurus' | 'supplier';
  students: Student[];
  teachers: Teacher[];
  boardMembers: FoundationBoard[];
  suppliers: Supplier[];
  foundationProfile?: FoundationProfile;
  onNavigatePayroll?: () => void;
  onSyncPayrollLiabilities?: () => void;
  onAddStudent: (student: Student) => void;
  onImportStudents?: (students: Student[]) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onDeleteAllStudents?: () => void;
  onRestoreDefaultStudents?: () => void;

  onAddTeacher: (teacher: Teacher) => void;
  onImportTeachers?: (teachers: Teacher[]) => void;
  onUpdateTeacher: (teacher: Teacher) => void;
  onDeleteTeacher: (id: string) => void;

  onAddBoardMember: (board: FoundationBoard) => void;
  onUpdateBoardMember: (board: FoundationBoard) => void;
  onDeleteBoardMember: (id: string) => void;

  onAddSupplier: (supplier: Supplier) => void;
  onUpdateSupplier: (supplier: Supplier) => void;
  onDeleteSupplier: (id: string) => void;

  onUpdateFoundationProfile?: (profile: FoundationProfile) => void;
}

// Helper to parse numbers safely from Excel (handles string formatted with Rp, dots, commas, etc.)
const parseExcelNumber = (val: any, fallback: number = 0): number => {
  if (val === undefined || val === null || val === '') return fallback;
  if (typeof val === 'number') return isNaN(val) ? fallback : val;

  let str = String(val).trim();
  if (!str) return fallback;

  // Strip currency prefixes e.g. "Rp", "Rp.", "IDR"
  str = str.replace(/^(Rp\.?|IDR)\s*/gi, '').trim();

  // If format is like "3.500.000" (Indonesian dot thousand separator)
  if (/^\d{1,3}(\.\d{3})+$/.test(str)) {
    str = str.replace(/\./g, '');
  } else if (/^\d{1,3}(\.\d{3})+,\d+$/.test(str)) {
    str = str.replace(/\./g, '').replace(',', '.');
  } else if (/^\d{1,3}(,\d{3})+(\.\d+)?$/.test(str)) {
    str = str.replace(/,/g, '');
  } else if (str.includes(',') && !str.includes('.')) {
    str = str.replace(',', '.');
  }

  str = str.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(str);
  return isNaN(parsed) ? fallback : parsed;
};

// Helper for case-insensitive, fuzzy column matching on Excel row object
const getRowVal = (row: Record<string, any>, possibleKeys: string[]): any => {
  const rowKeys = Object.keys(row);

  // 1. Exact match (case-insensitive & trimmed)
  for (const key of possibleKeys) {
    const target = key.trim().toLowerCase();
    for (const rKey of rowKeys) {
      if (rKey.trim().toLowerCase() === target) {
        const val = row[rKey];
        if (val !== undefined && val !== null && String(val).trim() !== '') {
          return val;
        }
      }
    }
  }

  // 2. Contains/partial match
  for (const key of possibleKeys) {
    const target = key.trim().toLowerCase();
    for (const rKey of rowKeys) {
      const current = rKey.trim().toLowerCase();
      if (current.includes(target) || target.includes(current)) {
        const val = row[rKey];
        if (val !== undefined && val !== null && String(val).trim() !== '') {
          return val;
        }
      }
    }
  }

  return '';
};

export const MasterDataView: React.FC<MasterDataViewProps> = ({
  initialTab,
  students,
  teachers,
  boardMembers,
  suppliers,
  foundationProfile,
  onNavigatePayroll,
  onSyncPayrollLiabilities,
  onAddStudent,
  onImportStudents,
  onUpdateStudent,
  onDeleteStudent,
  onDeleteAllStudents,
  onRestoreDefaultStudents,
  onAddTeacher,
  onImportTeachers,
  onUpdateTeacher,
  onDeleteTeacher,
  onAddBoardMember,
  onUpdateBoardMember,
  onDeleteBoardMember,
  onAddSupplier,
  onUpdateSupplier,
  onDeleteSupplier,
  onUpdateFoundationProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'siswa' | 'guru' | 'pengurus' | 'supplier'>(initialTab || 'siswa');
  const [syncToast, setSyncToast] = useState(false);
  const [importSuccessMsg, setImportSuccessMsg] = useState<string>('');
  const [showLogoModal, setShowLogoModal] = useState<boolean>(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'siswa' | 'guru' | 'pengurus' | 'supplier';
    id: string;
    name: string;
  } | null>(null);

  const studentFileInputRef = useRef<HTMLInputElement>(null);
  const teacherFileInputRef = useRef<HTMLInputElement>(null);

  // --- DOWNLOAD & TEMPLATE EXCEL DATA SISWA ---
  const handleExportStudents = () => {
    if (students.length === 0) {
      alert('Belum ada data siswa untuk diunduh.');
      return;
    }
    const exportData = students.map((s) => ({
      'NIS': s.nis,
      'NISN': s.nisn || '',
      'Nama Lengkap Siswa': s.name,
      'Kelas / Rombel': s.gradeClass,
      'Tarif SPP (Rp)': s.sppAmount,
      'Status SPP': s.sppStatus,
      'No. HP / Kontak': s.contactPhone || '',
      'Nama Orang Tua': s.parentName || '',
      'Jenis Kelamin': s.gender || 'L',
      'Tempat Lahir': s.birthPlace || '',
      'Tanggal Lahir': s.birthDate || '',
      'Alamat': s.address || '',
      'Virtual Account': s.virtualAccount || `88020${s.nis}`,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Master Siswa');
    XLSX.writeFile(workbook, `Data_Master_Siswa_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const handleDownloadStudentTemplate = () => {
    const templateData = [
      {
        'NIS': '2026101',
        'NISN': '0012345678',
        'Nama Lengkap Siswa': 'Ahmad Rizky Fauzi',
        'Kelas / Rombel': 'Kelas 1',
        'Tarif SPP (Rp)': 250000,
        'Status SPP': 'LUNAS',
        'No. HP / Kontak': '081234567890',
        'Nama Orang Tua': 'Budi Santoso',
        'Jenis Kelamin': 'L',
        'Tempat Lahir': 'Serang',
        'Tanggal Lahir': '2019-05-12',
        'Alamat': 'Jl. Pendidikan No. 12, Serang',
        'Virtual Account': '880202026101',
      },
      {
        'NIS': '2026102',
        'NISN': '0012345679',
        'Nama Lengkap Siswa': 'Siti Nurhaliza',
        'Kelas / Rombel': 'Kelas 2',
        'Tarif SPP (Rp)': 250000,
        'Status SPP': 'MENUNGGU',
        'No. HP / Kontak': '081987654321',
        'Nama Orang Tua': 'Hasan Basri',
        'Jenis Kelamin': 'P',
        'Tempat Lahir': 'Serang',
        'Tanggal Lahir': '2018-08-20',
        'Alamat': 'Jl. Merdeka No. 45, Serang',
        'Virtual Account': '880202026102',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template Import Siswa');
    XLSX.writeFile(workbook, `Template_Import_Siswa_Sekolah.xlsx`);
  };

  const handleStudentFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          alert('File Excel/CSV kosong atau format kolom tidak dikenali.');
          return;
        }

        const validRows = json.filter((row) => {
          const name = getRowVal(row, ['Nama Lengkap Siswa', 'Nama Siswa', 'Nama Lengkap', 'Nama', 'name', 'Siswa', 'NAMA']);
          const nis = getRowVal(row, ['NIS', 'nis', 'Nis', 'Nomor Induk Siswa', 'NO', 'No']);
          return Boolean((name && String(name).trim() !== '') || (nis && String(nis).trim() !== ''));
        });

        const rowsToProcess = validRows.length > 0 ? validRows : json;

        const importedStudents: Student[] = rowsToProcess.map((row, idx) => {
          const nis = String(getRowVal(row, ['NIS', 'nis', 'Nis', 'Nomor Induk Siswa', 'NO. INDUK']) || `2026${100 + idx}`).trim();
          const nisn = String(getRowVal(row, ['NISN', 'nisn', 'Nisn', 'Nomor Induk Siswa Nasional']) || '').trim();
          const name = String(getRowVal(row, ['Nama Lengkap Siswa', 'Nama Siswa', 'Nama Lengkap', 'Nama', 'name', 'Siswa', 'NAMA']) || `Siswa Impor ${idx + 1}`).trim();
          const gradeClass = String(getRowVal(row, ['Kelas / Rombel', 'Kelas', 'Rombel', 'gradeClass', 'Rombel Belajar', 'KELAS']) || 'Kelas 1').trim();

          const sppRaw = getRowVal(row, ['Tarif SPP (Rp)', 'Tarif SPP', 'SPP', 'Nominal SPP', 'sppAmount']);
          const sppAmount = parseExcelNumber(sppRaw, 250000);

          const rawStatus = String(getRowVal(row, ['Status SPP', 'Status', 'sppStatus', 'Status Pembayaran'])).toUpperCase();
          const sppStatus: 'LUNAS' | 'MENUNGGU' | 'TUNGGAKAN' =
            rawStatus.includes('LUNAS') ? 'LUNAS' : rawStatus.includes('TUNGGAK') ? 'TUNGGAKAN' : 'MENUNGGU';

          const contactPhone = String(getRowVal(row, ['No. HP / Kontak', 'No HP', 'No. HP', 'No Telepon', 'Kontak', 'contactPhone', 'HP', 'WhatsApp', 'NO HP']) || '081234567890').trim();
          const parentName = String(getRowVal(row, ['Nama Orang Tua', 'Orang Tua', 'Wali', 'Nama Wali', 'parentName', 'ORANG TUA']) || '').trim();
          const genderRaw = String(getRowVal(row, ['Jenis Kelamin', 'JK', 'Gender', 'gender', 'JNS KELAMIN'])).toUpperCase();
          const gender = genderRaw === 'P' || genderRaw.includes('PEREMPUAN') || genderRaw.includes('FEMALE') ? 'P' : 'L';
          const address = String(getRowVal(row, ['Alamat', 'Alamat Lengkap', 'Alamat Siswa', 'Alamat Rumah', 'address', 'ALAMAT', 'ALAMAT LENGKAP', 'Tempat Tinggal']) || '').trim();
          let birthPlace = String(getRowVal(row, ['Tempat Lahir', 'Tempat', 'birthPlace', 'TEMPAT LAHIR', 'Kota Lahir', 'TEMPAT', 'Kota']) || '').trim();
          let birthDate = String(getRowVal(row, ['Tanggal Lahir', 'Tgl Lahir', 'birthDate', 'TGL LAHIR', 'TANGGAL LAHIR', 'Tanggal', 'Tgl', 'Birth Date', 'TGL']) || '').trim();

          const ttlCombined = String(getRowVal(row, ['TTL', 'Tempat, Tanggal Lahir', 'Tempat Tanggal Lahir', 'Tempat/Tgl Lahir', 'Tempat & Tgl Lahir', 'TEMPAT TANGGAL LAHIR', 'TEMPAT, TANGGAL LAHIR']) || '').trim();
          if (ttlCombined && (!birthPlace || !birthDate)) {
            const parts = ttlCombined.split(/[,/|]/);
            if (parts.length >= 2) {
              if (!birthPlace) birthPlace = parts[0].trim();
              if (!birthDate) birthDate = parts.slice(1).join(',').trim();
            } else if (!birthPlace) {
              birthPlace = ttlCombined;
            }
          }

          const vaInput = String(getRowVal(row, ['Virtual Account', 'VA', 'No VA', 'Nomor Virtual Account', 'virtualAccount', 'VA SPP', 'NO VA']) || '').trim();
          const virtualAccount = vaInput || `88020${nis.replace(/\D/g, '') || Math.floor(100000 + Math.random() * 900000)}`;

          return {
            id: `std-imp-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 6)}`,
            nis,
            nisn,
            name,
            gradeClass,
            sppAmount,
            sppStatus,
            contactPhone,
            parentName,
            gender,
            address,
            birthPlace,
            birthDate,
            virtualAccount,
          };
        });

        if (onImportStudents) {
          onImportStudents(importedStudents);
        } else {
          importedStudents.forEach((s) => onAddStudent(s));
        }

        setImportSuccessMsg(`Berhasil mengimpor ${importedStudents.length} data siswa dari file Excel! Data terintegrasi otomatis dengan Portal Website & E-Raport.`);
        setTimeout(() => setImportSuccessMsg(''), 7000);
      } catch (err) {
        console.error('Error parsing excel:', err);
        alert('Gagal membaca file Excel. Pastikan format file .xlsx, .xls, atau .csv yang valid.');
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  // --- DOWNLOAD & TEMPLATE EXCEL DATA GURU ---
  const handleExportTeachers = () => {
    if (teachers.length === 0) {
      alert('Belum ada data guru untuk diunduh.');
      return;
    }
    const exportData = teachers.map((t) => ({
      'NIP': t.nip,
      'NIPY (Nomor Induk Pegawai Yayasan)': t.nipy || '',
      'NIY (Nomor Induk Yayasan)': t.niy || '',
      'Nama Guru / Staf': t.name,
      'Alamat': t.address || '',
      'NO. Telpon': t.phone || '',
      'Wali Kelas': t.assignedRombel || '',
      'Jabatan / Role': t.role,
      'Mata Pelajaran': t.subjectTaught || '',
      'Gaji Pokok (Rp)': t.baseSalary,
      'Tunjangan (Rp)': t.allowance,
      'Honor Kepanitiaan (Rp)': t.committeeHonor || 0,
      'PPh21 (Rp)': t.pph21,
      'BPJS (Rp)': t.bpjs,
      'Gaji Bersih (Rp)': t.netSalary,
      'Keterangan': t.notes || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Master Guru');
    XLSX.writeFile(workbook, `Data_Master_Guru_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const handleDownloadTeacherTemplate = () => {
    const templateData = [
      {
        'NIP': '202601',
        'NIPY (Nomor Induk Pegawai Yayasan)': 'NIPY.202601',
        'NIY (Nomor Induk Yayasan)': 'NIY.202601',
        'Nama Guru / Staf': 'Drs. Supriyadi, M.Pd.',
        'Alamat': 'Jl. Pendidikan No. 10',
        'NO. Telpon': '081234567890',
        'Wali Kelas': 'Kelas 6',
        'Jabatan / Role': 'Kepala Sekolah',
        'Mata Pelajaran': 'Pendidikan Pancasila & Keimanan',
        'Gaji Pokok (Rp)': 4500000,
        'Tunjangan (Rp)': 1500000,
        'Honor Kepanitiaan (Rp)': 250000,
        'PPh21 (Rp)': 200000,
        'BPJS (Rp)': 150000,
        'Gaji Bersih (Rp)': 5900000,
        'Keterangan': 'Pendidik Tetap',
      },
      {
        'NIP': '202602',
        'NIPY (Nomor Induk Pegawai Yayasan)': 'NIPY.202602',
        'NIY (Nomor Induk Yayasan)': 'NIY.202602',
        'Nama Guru / Staf': 'Anisa Rahmawati, S.Pd.',
        'Alamat': 'Jl. Merdeka No. 22',
        'NO. Telpon': '081987654321',
        'Wali Kelas': 'Kelas 1',
        'Jabatan / Role': 'Guru',
        'Mata Pelajaran': 'Tematik / Bahasa Indonesia',
        'Gaji Pokok (Rp)': 3500000,
        'Tunjangan (Rp)': 1000000,
        'Honor Kepanitiaan (Rp)': 0,
        'PPh21 (Rp)': 150000,
        'BPJS (Rp)': 100000,
        'Gaji Bersih (Rp)': 4250000,
        'Keterangan': 'Guru Kelas',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template Import Guru');
    XLSX.writeFile(workbook, `Template_Import_Guru_Sekolah.xlsx`);
  };

  const handleTeacherFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          alert('File Excel/CSV kosong atau format kolom tidak dikenali.');
          return;
        }

        const importedTeachers: Teacher[] = json.map((row, idx) => {
          const nipVal = String(getRowVal(row, ['NIP', 'Nomor Induk Pegawai', 'No NIP', 'NIP/NIPY', 'NIP / NIPY']) || '');
          const nipyVal = String(getRowVal(row, ['NIPY (Nomor Induk Pegawai Yayasan)', 'NIPY', 'Nomor Induk Pegawai Yayasan', 'NIPY/NIY', 'NIPY / NIY']) || '');
          const niyVal = String(getRowVal(row, ['NIY (Nomor Induk Yayasan)', 'NIY', 'Nomor Induk Yayasan']) || '');

          const nip = nipVal || (nipyVal ? nipyVal.replace(/[^0-9]/g, '') : `2026${Math.floor(10 + Math.random() * 90)}`);
          const nipy = nipyVal || (nipVal ? `NIPY.${nipVal}` : `NIPY.2026${Math.floor(10 + Math.random() * 90)}`);
          const niy = niyVal || (nipVal ? `NIY.${nipVal}` : `NIY.2026${Math.floor(10 + Math.random() * 90)}`);

          const name = String(getRowVal(row, ['Nama Guru / Staf', 'Nama Guru', 'Nama Staf', 'Nama Pegawai', 'Nama Lengkap Guru', 'Nama Lengkap', 'Nama', 'Name', 'Guru', 'Pegawai', 'Tenaga Pendidik']) || `Guru Impor ${idx + 1}`);

          const rawRole = String(getRowVal(row, ['Jabatan / Role', 'Jabatan', 'Role', 'Posisi', 'Status Pegawai', 'Tugas', 'Staf', 'role']) || 'Guru');
          const role: string =
            rawRole.toLowerCase().includes('kepala') || rawRole.toLowerCase().includes('kepsek') ? 'Kepala Sekolah' :
            rawRole.toLowerCase().includes('pembina') ? 'Pembina Yayasan' :
            rawRole.toLowerCase().includes('bendahara umum') ? 'Bendahara Umum Yayasan' :
            rawRole.toLowerCase().includes('bendahara sekolah') || rawRole.toLowerCase().includes('bendahara') ? 'Bendahara Sekolah' :
            rawRole.toLowerCase().includes('yayasan') || rawRole.toLowerCase().includes('ketua') ? 'Ketua Yayasan' :
            rawRole.toLowerCase().includes('admin') || rawRole.toLowerCase().includes('staf') || rawRole.toLowerCase().includes('tu') ? 'Staf Admin' : 'Guru';

          const assignedRombel = String(getRowVal(row, ['Rombel Diampu', 'Wali Kelas', 'Rombel', 'Kelas Diampu', 'Kelas', 'Rombel/Kelas', 'assignedRombel']) || 'Kelas 1');
          const subjectTaught = String(getRowVal(row, ['Mata Pelajaran', 'Mapel', 'Pelajaran', 'Mata Pelajaran Diampu', 'subjectTaught']) || '');
          const address = String(getRowVal(row, ['Alamat', 'Address', 'Alamat Lengkap', 'Alamat Rumah', 'address']) || '');
          const phone = String(getRowVal(row, ['No. HP / Kontak', 'No HP', 'No. HP', 'No Telepon', 'NO. Telpon', 'Telepon', 'Phone', 'HP', 'Kontak', 'WhatsApp', 'WA', 'phone']) || '');
          const notes = String(getRowVal(row, ['Keterangan', 'Notes', 'Ket', 'Catatan', 'notes']) || '');

          const baseSalaryRaw = getRowVal(row, ['Gaji Pokok (Rp)', 'Gaji Pokok', 'Gaji Utama', 'Gapok', 'Gaji', 'Basic Salary', 'baseSalary']);
          const allowanceRaw = getRowVal(row, ['Tunjangan Jabatan', 'Tunjangan (Rp)', 'Tunjangan', 'Allowance', 'Tunjangan Lain', 'allowance']);
          const committeeHonorRaw = getRowVal(row, ['Honor Kepanitiaan', 'Honor Kepanitiaan (Rp)', 'Honor Panitia', 'Honor', 'Committee Honor', 'committeeHonor']);
          const pph21Raw = getRowVal(row, ['PPh21 (Rp)', 'PPh21', 'PPh 21', 'Potongan PPh', 'Pph', 'Tax', 'pph21']);
          const bpjsRaw = getRowVal(row, ['BPJS (Rp)', 'BPJS', 'BPJS Kesehatan', 'Potongan BPJS', 'bpjs']);
          const netSalaryRaw = getRowVal(row, ['Gaji Bersih (Rp)', 'Gaji Bersih', 'Gaji Netto', 'THP', 'Take Home Pay', 'Net Salary', 'netSalary']);

          const baseSalary = parseExcelNumber(baseSalaryRaw, 0);
          const allowance = parseExcelNumber(allowanceRaw, 0);
          const committeeHonor = parseExcelNumber(committeeHonorRaw, 0);
          const pph21 = parseExcelNumber(pph21Raw, 0);
          const bpjs = parseExcelNumber(bpjsRaw, 0);

          let netSalary = parseExcelNumber(netSalaryRaw, 0);
          if (netSalary <= 0) {
            netSalary = baseSalary + allowance + committeeHonor - pph21 - bpjs;
          }
          if (netSalary < 0) netSalary = 0;

          return {
            id: `tch-imp-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
            nip,
            nipy,
            niy,
            name,
            address,
            phone,
            role,
            assignedRombel,
            subjectTaught,
            baseSalary,
            allowance,
            committeeHonor,
            pph21,
            bpjs,
            netSalary,
            notes,
          };
        });

        if (onImportTeachers) {
          onImportTeachers(importedTeachers);
        } else {
          importedTeachers.forEach((t) => onAddTeacher(t));
        }

        setImportSuccessMsg(`Berhasil mengimpor ${importedTeachers.length} data guru/staf (NIPY/NIY & komponen gaji tersimpan persis sesuai Excel)!`);
        setTimeout(() => setImportSuccessMsg(''), 7000);
      } catch (err) {
        console.error('Error parsing excel:', err);
        alert('Gagal membaca file Excel. Pastikan format file .xlsx, .xls, atau .csv yang valid.');
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  // Totals for Guru Payroll
  const totalBaseSalary = teachers.reduce((sum, t) => sum + (t.baseSalary || 0), 0);
  const totalAllowance = teachers.reduce((sum, t) => sum + (t.allowance || 0), 0);
  const totalPph21 = teachers.reduce((sum, t) => sum + (t.pph21 || 0), 0);
  const totalBpjs = teachers.reduce((sum, t) => sum + (t.bpjs || 0), 0);
  const totalNetSalary = teachers.reduce((sum, t) => sum + (t.netSalary || 0), 0);

  const totalGuruNet = teachers
    .filter((t) => t.role !== 'Kepala Sekolah')
    .reduce((sum, t) => sum + (t.netSalary || 0), 0);
  const totalKepsekNet = teachers
    .filter((t) => t.role === 'Kepala Sekolah')
    .reduce((sum, t) => sum + (t.netSalary || 0), 0);

  const handleManualSync = () => {
    if (onSyncPayrollLiabilities) {
      onSyncPayrollLiabilities();
    }
    setSyncToast(true);
    setTimeout(() => setSyncToast(false), 3500);
  };

  // --- STUDENT MODAL STATE ---
  const [showStdModal, setShowStdModal] = useState<boolean>(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [stdNis, setStdNis] = useState<string>('');
  const [stdNisn, setStdNisn] = useState<string>('');
  const [stdName, setStdName] = useState<string>('');
  const [stdBirthPlace, setStdBirthPlace] = useState<string>('');
  const [stdBirthDate, setStdBirthDate] = useState<string>('');
  const [stdGender, setStdGender] = useState<'L' | 'P'>('L');
  const [stdParentName, setStdParentName] = useState<string>('');
  const [stdAddress, setStdAddress] = useState<string>('');
  const [stdPhone, setStdPhone] = useState<string>('081230004000');
  const [stdSpp, setStdSpp] = useState<number>(250000);
  const [stdSppStatus, setStdSppStatus] = useState<'LUNAS' | 'MENUNGGU' | 'TUNGGAKAN'>('MENUNGGU');
  const [stdAchievements, setStdAchievements] = useState<string>('');
  const [stdGrade, setStdGrade] = useState<string>('Kelas 1');
  const [stdVa, setStdVa] = useState<string>('');

  // Open modal for adding/editing student
  const openStudentModal = (student?: Student) => {
    if (student) {
      setEditingStudent(student);
      setStdNis(student.nis || '');
      setStdNisn(student.nisn || '');
      setStdName(student.name || '');
      setStdBirthPlace(student.birthPlace || '');
      setStdBirthDate(student.birthDate || '');
      setStdGender(student.gender || 'L');
      setStdParentName(student.parentName || '');
      setStdAddress(student.address || '');
      setStdPhone(student.contactPhone || '081230004000');
      setStdSpp(student.sppAmount || 250000);
      setStdSppStatus(student.sppStatus || 'MENUNGGU');
      setStdAchievements(student.achievements || '');
      setStdGrade(student.gradeClass || 'Kelas 1');
      setStdVa(student.virtualAccount || `88020${student.nis || '2026101'}`);
    } else {
      const autoNis = `2026${Math.floor(100 + Math.random() * 900)}`;
      setEditingStudent(null);
      setStdNis(autoNis);
      setStdNisn(`001${Math.floor(1000000 + Math.random() * 9000000)}`);
      setStdName('');
      setStdBirthPlace('');
      setStdBirthDate('');
      setStdGender('L');
      setStdParentName('');
      setStdAddress('');
      setStdPhone('081230004000');
      setStdSpp(250000);
      setStdSppStatus('MENUNGGU');
      setStdAchievements('');
      setStdGrade('Kelas 1');
      setStdVa(`88020${autoNis}`);
    }
    setShowStdModal(true);
  };

  const handleStdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalVa = stdVa || `88020${stdNis}`;
    if (editingStudent) {
      onUpdateStudent({
        ...editingStudent,
        nis: stdNis,
        nisn: stdNisn,
        name: stdName,
        birthPlace: stdBirthPlace,
        birthDate: stdBirthDate,
        gender: stdGender,
        parentName: stdParentName,
        address: stdAddress,
        contactPhone: stdPhone,
        sppAmount: stdSpp,
        sppStatus: stdSppStatus,
        achievements: stdAchievements,
        gradeClass: stdGrade,
        virtualAccount: finalVa,
      });
    } else {
      onAddStudent({
        id: `std-${Date.now()}`,
        nis: stdNis,
        nisn: stdNisn,
        name: stdName,
        birthPlace: stdBirthPlace,
        birthDate: stdBirthDate,
        gender: stdGender,
        parentName: stdParentName,
        address: stdAddress,
        contactPhone: stdPhone,
        sppAmount: stdSpp,
        sppStatus: stdSppStatus,
        achievements: stdAchievements,
        gradeClass: stdGrade,
        virtualAccount: finalVa,
      });
    }
    setShowStdModal(false);
  };

  // --- TEACHER MODAL STATE ---
  const [showTchModal, setShowTchModal] = useState<boolean>(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [tchNip, setTchNip] = useState<string>('');
  const [tchNipy, setTchNipy] = useState<string>('');
  const [tchNiy, setTchNiy] = useState<string>('');
  const [tchName, setTchName] = useState<string>('');
  const [tchAddress, setTchAddress] = useState<string>('');
  const [tchPhone, setTchPhone] = useState<string>('');
  const [tchWalikelas, setTchWalikelas] = useState<string>('');
  const [tchRole, setTchRole] = useState<string>('Guru');
  const [tchSubject, setTchSubject] = useState<string>('');
  const [tchBaseSalary, setTchBaseSalary] = useState<number>(3500000);
  const [tchAllowance, setTchAllowance] = useState<number>(0);
  const [tchCommitteeHonor, setTchCommitteeHonor] = useState<number>(0);
  const [tchPph21, setTchPph21] = useState<number>(0);
  const [tchBpjs, setTchBpjs] = useState<number>(0);
  const [tchNotes, setTchNotes] = useState<string>('');

  const openTeacherModal = (teacher?: Teacher) => {
    if (teacher) {
      setEditingTeacher(teacher);
      setTchNip(teacher.nip || '');
      setTchNipy(teacher.nipy || '');
      setTchNiy(teacher.niy || '');
      setTchName(teacher.name || '');
      setTchAddress(teacher.address || '');
      setTchPhone(teacher.phone || '');
      setTchWalikelas(teacher.assignedRombel || '');
      setTchRole(teacher.role || 'Guru');
      setTchSubject(teacher.subjectTaught || '');
      setTchBaseSalary(teacher.baseSalary || 3500000);
      setTchAllowance(teacher.allowance ?? 0);
      setTchCommitteeHonor(teacher.committeeHonor ?? 0);
      setTchPph21(teacher.pph21 ?? 0);
      setTchBpjs(teacher.bpjs ?? 0);
      setTchNotes(teacher.notes || '');
    } else {
      setEditingTeacher(null);
      setTchNip(`2026${Math.floor(10 + Math.random() * 90)}`);
      setTchNipy(`NIPY.2026${Math.floor(10 + Math.random() * 90)}`);
      setTchNiy(`NIY.2026${Math.floor(10 + Math.random() * 90)}`);
      setTchName('');
      setTchAddress('');
      setTchPhone('');
      setTchWalikelas('Kelas 1');
      setTchRole('Guru');
      setTchSubject('');
      setTchBaseSalary(3500000);
      setTchAllowance(0);
      setTchCommitteeHonor(0);
      setTchPph21(0);
      setTchBpjs(0);
      setTchNotes('');
    }
    setShowTchModal(true);
  };

  const handleTchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const netSalary = tchBaseSalary + tchAllowance + tchCommitteeHonor - tchPph21 - tchBpjs;
    if (editingTeacher) {
      onUpdateTeacher({
        ...editingTeacher,
        nip: tchNip,
        nipy: tchNipy,
        niy: tchNiy,
        name: tchName,
        address: tchAddress,
        phone: tchPhone,
        assignedRombel: tchWalikelas,
        role: tchRole,
        subjectTaught: tchSubject,
        baseSalary: tchBaseSalary,
        allowance: tchAllowance,
        committeeHonor: tchCommitteeHonor,
        pph21: tchPph21,
        bpjs: tchBpjs,
        netSalary: netSalary > 0 ? netSalary : 0,
        notes: tchNotes,
      });
    } else {
      onAddTeacher({
        id: `tch-${Date.now()}`,
        nip: tchNip,
        nipy: tchNipy,
        niy: tchNiy,
        name: tchName,
        address: tchAddress,
        phone: tchPhone,
        assignedRombel: tchWalikelas,
        role: tchRole,
        subjectTaught: tchSubject,
        baseSalary: tchBaseSalary,
        allowance: tchAllowance,
        committeeHonor: tchCommitteeHonor,
        pph21: tchPph21,
        bpjs: tchBpjs,
        netSalary: netSalary > 0 ? netSalary : 0,
        notes: tchNotes,
      });
    }
    setShowTchModal(false);
  };

  // --- BOARD MEMBER MODAL STATE ---
  const [showBrdModal, setShowBrdModal] = useState<boolean>(false);
  const [editingBoard, setEditingBoard] = useState<FoundationBoard | null>(null);
  const [brdNiy, setBrdNiy] = useState<string>('NIY.202601');
  const [brdNipy, setBrdNipy] = useState<string>('NIPY.202601');
  const [brdName, setBrdName] = useState<string>('');
  const [brdAddress, setBrdAddress] = useState<string>('');
  const [brdPhone, setBrdPhone] = useState<string>('');
  const [brdWalikelas, setBrdWalikelas] = useState<string>('');
  const [brdPosition, setBrdPosition] = useState<string>('Ketua Yayasan');
  const [brdSubject, setBrdSubject] = useState<string>('');
  const [brdBaseSalary, setBrdBaseSalary] = useState<number>(4000000);
  const [brdAllowance, setBrdAllowance] = useState<number>(1000000);
  const [brdCommitteeHonor, setBrdCommitteeHonor] = useState<number>(0);
  const [brdNotes, setBrdNotes] = useState<string>('');

  const openBoardModal = (board?: FoundationBoard) => {
    if (board) {
      setEditingBoard(board);
      setBrdNiy(board.niy || '');
      setBrdNipy(board.nipy || '');
      setBrdName(board.name || '');
      setBrdAddress(board.address || '');
      setBrdPhone(board.phone || '');
      setBrdWalikelas(board.assignedRombel || '');
      setBrdPosition(board.position || 'Ketua Yayasan');
      setBrdSubject(board.subjectTaught || '');
      setBrdBaseSalary(board.baseSalary || board.honorarium || 4000000);
      setBrdAllowance(board.allowance || 0);
      setBrdCommitteeHonor(board.committeeHonor || 0);
      setBrdNotes(board.notes || '');
    } else {
      setEditingBoard(null);
      setBrdNiy(`NIY.2026${Math.floor(10 + Math.random() * 90)}`);
      setBrdNipy(`NIPY.2026${Math.floor(10 + Math.random() * 90)}`);
      setBrdName('');
      setBrdAddress('');
      setBrdPhone('081122334455');
      setBrdWalikelas('-');
      setBrdPosition('Ketua Yayasan');
      setBrdSubject('-');
      setBrdBaseSalary(4000000);
      setBrdAllowance(1000000);
      setBrdCommitteeHonor(0);
      setBrdNotes('');
    }
    setShowBrdModal(true);
  };

  const handleBrdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBoard) {
      onUpdateBoardMember({
        ...editingBoard,
        niy: brdNiy,
        nipy: brdNipy,
        name: brdName,
        address: brdAddress,
        phone: brdPhone,
        assignedRombel: brdWalikelas,
        position: brdPosition,
        subjectTaught: brdSubject,
        baseSalary: brdBaseSalary,
        allowance: brdAllowance,
        committeeHonor: brdCommitteeHonor,
        notes: brdNotes,
        honorarium: brdBaseSalary,
      });
    } else {
      onAddBoardMember({
        id: `brd-${Date.now()}`,
        niy: brdNiy,
        nipy: brdNipy,
        name: brdName,
        address: brdAddress,
        phone: brdPhone,
        assignedRombel: brdWalikelas,
        position: brdPosition,
        subjectTaught: brdSubject,
        baseSalary: brdBaseSalary,
        allowance: brdAllowance,
        committeeHonor: brdCommitteeHonor,
        notes: brdNotes,
        honorarium: brdBaseSalary,
      });
    }
    setShowBrdModal(false);
  };

  // --- SUPPLIER MODAL STATE ---
  const [showSupModal, setShowSupModal] = useState<boolean>(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [supName, setSupName] = useState<string>('');
  const [supCategory, setSupCategory] = useState<string>('Alat Tulis & Cetak');
  const [supContact, setSupContact] = useState<string>('');
  const [supPhone, setSupPhone] = useState<string>('081299887766');

  const openSupplierModal = (supplier?: Supplier) => {
    if (supplier) {
      setEditingSupplier(supplier);
      setSupName(supplier.name);
      setSupCategory(supplier.category);
      setSupContact(supplier.contact);
      setSupPhone(supplier.phone);
    } else {
      setEditingSupplier(null);
      setSupName('');
      setSupCategory('Alat Tulis & Cetak');
      setSupContact('');
      setSupPhone('081299887766');
    }
    setShowSupModal(true);
  };

  const handleSupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSupplier) {
      onUpdateSupplier({
        ...editingSupplier,
        name: supName,
        category: supCategory,
        contact: supContact,
        phone: supPhone,
      });
    } else {
      onAddSupplier({
        id: `sup-${Date.now()}`,
        name: supName,
        category: supCategory,
        contact: supContact,
        phone: supPhone,
      });
    }
    setShowSupModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Banner Identitas & Logo Yayasan */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-5 rounded-2xl shadow-md border border-indigo-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-4">
          {foundationProfile?.logoUrl ? (
            <img
              src={foundationProfile.logoUrl}
              alt="Logo Yayasan"
              className="w-14 h-14 object-contain bg-white/10 p-1 rounded-xl border border-white/20 shadow"
            />
          ) : (
            <div className="w-14 h-14 bg-amber-400 text-slate-950 font-black text-lg rounded-xl flex items-center justify-center shadow">
              SDIT
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-black rounded-md uppercase">
                Identitas Lembaga & Logo Yayasan
              </span>
              <span className="text-xs text-emerald-300 font-bold flex items-center gap-1 hidden sm:flex">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Terintegrasi Website & E-Raport
              </span>
            </div>
            <h2 className="text-base font-extrabold text-white mt-1">
              {foundationProfile?.name || 'Yayasan Pendidikan Daarul Habibah'}
            </h2>
            <p className="text-xs text-slate-300">{foundationProfile?.address || 'Master Data Terintegrasi Database Sekolah'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowLogoModal(true)}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <Image className="w-4 h-4" />
            <span>Upload Logo Yayasan</span>
          </button>
        </div>
      </div>

      {/* Sub-tabs Navigation Header */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('siswa')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'siswa' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Master Siswa ({students.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('guru')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'guru' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Master Guru & Kepsek ({teachers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pengurus')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'pengurus' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Pengurus Yayasan ({boardMembers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('supplier')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'supplier' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Supplier & Partner ({suppliers.length})</span>
          </button>
        </div>

        <button
          onClick={() => printDocument('printable-report', 'Master Data Yayasan Daarul Habibah')}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow hover:bg-slate-800 transition"
        >
          <Printer className="w-4 h-4 text-emerald-400" />
          <span>Cetak Master Data</span>
        </button>
      </div>

      {/* Main Printable Container */}
      <div id="printable-report" className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
        
        {/* Kop Surat Resmi Cetak */}
        <div className="hidden print:block text-center pb-6 mb-6 border-b-2 border-slate-900">
          <h2 className="text-xl font-black text-slate-900 uppercase">
            {foundationProfile?.name?.toUpperCase() || 'YAYASAN PENDIDIKAN WIDYA NUSANTARA'}
          </h2>
          <p className="text-xs text-slate-600 uppercase font-semibold">
            Daftar Data Master Entitas & Sumber Daya Manusia Sekolah
          </p>
          <h3 className="text-sm font-bold text-emerald-700 uppercase mt-1">
            {activeTab === 'siswa' && '1. DATA MASTER SISWA & TARIF SPP'}
            {activeTab === 'guru' && '2. DATA MASTER GURU, TENAGA PENDIDIK & STRUKTUR GAJI'}
            {activeTab === 'pengurus' && '3. DATA MASTER PEMBINA & PENGURUS YAYASAN'}
            {activeTab === 'supplier' && '4. DATA MASTER SUPPLIER & MITRA KERJA SAMA'}
          </h3>
        </div>

        {/* 1. SISWA TAB */}
        {activeTab === 'siswa' && (
          <div className="space-y-4">
            {/* Info Banner Redirect to Payroll */}
            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs print:hidden">
              <div className="flex items-center gap-3">
                <Coins className="w-5 h-5 text-indigo-600 shrink-0" />
                <div>
                  <p className="font-extrabold text-indigo-950">
                    Data Guru, Pengurus Yayasan & Supplier dialihkan ke Halaman Payroll & SDM
                  </p>
                  <p className="text-indigo-800 text-[11px]">
                    Pengelolaan struktur gaji guru, pengurus, vendor supplier, serta posting jurnal & cetak slip gaji terpusat di menu Payroll.
                  </p>
                </div>
              </div>
              {onNavigatePayroll && (
                <button
                  type="button"
                  onClick={onNavigatePayroll}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Buka Payroll & SDM Yayasan</span>
                </button>
              )}
            </div>

            <div className="space-y-3 border-b border-slate-100 pb-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <span>Data Siswa Terdaftar & Tarif SPP</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-mono font-bold text-xs rounded-full">
                      {students.length} Siswa
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Kelola NIS, Nama, Kelas, Tarif SPP Bulanan, dan status tunggakan. Terintegrasi langsung dengan Portal Website & E-Raport.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 print:hidden">
                  {/* Hidden File Input Siswa */}
                  <input
                    type="file"
                    ref={studentFileInputRef}
                    onChange={handleStudentFileUpload}
                    accept=".xlsx,.xls,.csv"
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => studentFileInputRef.current?.click()}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black shadow-md transition flex items-center gap-2 cursor-pointer"
                    title="Unggah File Excel/CSV Data Siswa dari Komputer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Excel Siswa</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportStudents}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5 cursor-pointer"
                    title="Unduh Seluruh Data Siswa ke File Excel"
                  >
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>Download Excel</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadStudentTemplate}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                    title="Unduh Format Template Excel Import"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
                    <span>Template</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openStudentModal()}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>+ Tambah Siswa</span>
                  </button>

                  {onRestoreDefaultStudents && (
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Apakah Anda ingin memulihkan 18 data siswa sampel default? Data siswa yang ada akan direfresh ke data standar.')) {
                          onRestoreDefaultStudents();
                          setImportSuccessMsg('18 Data siswa sampel default berhasil dipulihkan!');
                        }
                      }}
                      className="px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                      title="Pulihkan 18 Data Siswa Sampel Default"
                    >
                      <RefreshCw className="w-4 h-4 text-amber-700" />
                      <span>Pulihkan Data Default</span>
                    </button>
                  )}

                  {onDeleteAllStudents && students.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm({ type: 'semua_siswa', id: 'ALL', name: `SELURUH DATA SISWA (${students.length} Siswa)` })}
                      className="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5 cursor-pointer"
                      title="Hapus Seluruh Data Siswa untuk Upload Ulang"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Hapus Semua Siswa</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Toast Notifikasi Import */}
              {importSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center justify-between gap-2 shadow-sm animate-fade-in">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{importSuccessMsg}</span>
                  </div>
                  <button onClick={() => setImportSuccessMsg('')} className="text-emerald-700 hover:text-emerald-900">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Banner Kosong jika Data Siswa Kosong */}
              {students.length === 0 && (
                <div className="p-8 bg-amber-50 border-2 border-dashed border-amber-300 rounded-2xl text-center space-y-4 my-4 print:hidden">
                  <GraduationCap className="w-12 h-12 text-amber-600 mx-auto" />
                  <div>
                    <h4 className="font-extrabold text-amber-950 text-base">Data Siswa Saat Ini Kosong</h4>
                    <p className="text-xs text-amber-800 max-w-md mx-auto mt-1">
                      Data siswa belum tersedia di browser Anda. Klik tombol di bawah untuk memulihkan 18 data siswa sampel default atau unggah file Excel baru.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    {onRestoreDefaultStudents && (
                      <button
                        type="button"
                        onClick={() => {
                          onRestoreDefaultStudents();
                          setImportSuccessMsg('18 Data siswa sampel berhasil dipulihkan!');
                        }}
                        className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-extrabold rounded-xl text-xs shadow transition flex items-center gap-2 cursor-pointer"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Pulihkan Data Siswa Sampel (18 Siswa)</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => studentFileInputRef.current?.click()}
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl text-xs shadow transition flex items-center gap-2 cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload File Excel Siswa (.xlsx)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 font-extrabold text-slate-800 uppercase">
                  <tr>
                    <th className="p-3 border-b border-slate-200">NISN</th>
                    <th className="p-3 border-b border-slate-200">Nama</th>
                    <th className="p-3 border-b border-slate-200">Tempat Lahir</th>
                    <th className="p-3 border-b border-slate-200">Tgl Lahir</th>
                    <th className="p-3 border-b border-slate-200 text-center">Jenis Kelamin</th>
                    <th className="p-3 border-b border-slate-200">Nama Orang Tua</th>
                    <th className="p-3 border-b border-slate-200">Alamat</th>
                    <th className="p-3 border-b border-slate-200">NO. Telpon</th>
                    <th className="p-3 border-b border-slate-200">Virtual Account (VA)</th>
                    <th className="p-3 border-b border-slate-200 text-right">Tarif SPP</th>
                    <th className="p-3 border-b border-slate-200 text-center">Status</th>
                    <th className="p-3 border-b border-slate-200">Prestasi</th>
                    <th className="p-3 border-b border-slate-200 text-center print:hidden">Aksi Edit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {students.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-900">
                        <div>{s.nisn || '-'}</div>
                        {s.nis && <span className="block text-[10px] text-slate-400 font-normal">NIS: {s.nis}</span>}
                      </td>
                      <td className="p-3 font-semibold text-slate-900">
                        <div>{s.name}</div>
                        {s.gradeClass && (
                          <span className="inline-block mt-0.5 px-1.5 py-0.2 bg-blue-50 text-blue-700 text-[10px] font-bold rounded">
                            {s.gradeClass}
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-slate-700">{s.birthPlace || '-'}</td>
                      <td className="p-3 font-mono text-slate-600">{s.birthDate || '-'}</td>
                      <td className="p-3 text-center font-bold">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] ${
                            s.gender === 'P' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {s.gender === 'P' ? 'Perempuan (P)' : 'Laki-laki (L)'}
                        </span>
                      </td>
                      <td className="p-3 text-slate-800 font-medium">{s.parentName || '-'}</td>
                      <td className="p-3 text-slate-600 max-w-xs truncate" title={s.address}>
                        {s.address || '-'}
                      </td>
                      <td className="p-3 font-mono text-slate-700">{s.contactPhone || '-'}</td>
                      <td className="p-3 font-mono font-bold text-indigo-700">
                        <span className="bg-indigo-50 px-2 py-1 rounded border border-indigo-100">
                          {s.virtualAccount || `88020${s.nis}`}
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">{formatRupiah(s.sppAmount)}</td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            s.sppStatus === 'LUNAS'
                              ? 'bg-emerald-100 text-emerald-800'
                              : s.sppStatus === 'TUNGGAKAN'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {s.sppStatus}
                        </span>
                      </td>
                      <td className="p-3 text-slate-700 text-xs max-w-xs truncate" title={s.achievements}>
                        {s.achievements || '-'}
                      </td>
                      <td className="p-3 text-center print:hidden">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openStudentModal(s)}
                            className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-semibold transition"
                            title="Edit Data Siswa"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ type: 'siswa', id: s.id, name: s.name })}
                            className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-semibold transition cursor-pointer"
                            title="Hapus Siswa"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. GURU TAB */}
        {activeTab === 'guru' && (
          <div className="space-y-4">
            {syncToast && (
              <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-lg flex items-center justify-between gap-3 animate-fade-in print:hidden">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <div>
                    <p className="font-bold text-xs">Singkronisasi Kewajiban Gaji Berhasil!</p>
                    <p className="text-[11px] opacity-90">
                      Saldo Akun 2101 (Hutang Gaji Guru), 2102 (Hutang Gaji Kepsek), 2103 (PPh 21), & 2104 (BPJS) telah diperbarui sesuai Data Master Guru.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Summary Widget & Sync Button */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-md space-y-3 print:hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">
                      Ringkasan Kewajiban Beban Gaji & Potongan SDM
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Terhubung Otomatis dengan Akun Kewajiban Jangka Pendek (Akun 2101 - 2104)
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleManualSync}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow transition flex items-center gap-2 cursor-pointer"
                  title="Sinkronkan Data Guru ke COA Kewajiban Jangka Pendek"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Sinkronkan ke Kewajiban (2101-2104)</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 font-medium block">Total Gaji Pokok</span>
                  <span className="font-mono font-bold text-white text-xs">{formatRupiah(totalBaseSalary)}</span>
                </div>
                <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 font-medium block">Total Tunjangan</span>
                  <span className="font-mono font-bold text-emerald-400 text-xs">+{formatRupiah(totalAllowance)}</span>
                </div>
                <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 font-medium block">Hutang PPh 21 (2103)</span>
                  <span className="font-mono font-bold text-amber-400 text-xs">{formatRupiah(totalPph21)}</span>
                </div>
                <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 font-medium block">Hutang BPJS (2104)</span>
                  <span className="font-mono font-bold text-amber-400 text-xs">{formatRupiah(totalBpjs)}</span>
                </div>
                <div className="bg-emerald-950/80 p-2.5 rounded-xl border border-emerald-600/50 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-emerald-300 font-medium block">Total Gaji Bersih (Net)</span>
                  <span className="font-mono font-black text-emerald-400 text-xs">{formatRupiah(totalNetSalary)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 border-b border-slate-100 pb-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <span>Data Guru, Staf & Penyesuaian Gaji / Payroll</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-mono font-bold text-xs rounded-full">
                      {teachers.length} Guru
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Sesuaikan NIPY, Jabatan, Gaji Pokok, Tunjangan, PPh21 & BPJS. Otomatis menyinkronkan kewajiban payroll sekolah.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 print:hidden">
                  {/* Hidden File Input Guru */}
                  <input
                    type="file"
                    ref={teacherFileInputRef}
                    onChange={handleTeacherFileUpload}
                    accept=".xlsx,.xls,.csv"
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => teacherFileInputRef.current?.click()}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5 cursor-pointer"
                    title="Unggah File Excel/CSV Data Guru dari Komputer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Excel Guru</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportTeachers}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5 cursor-pointer"
                    title="Unduh Seluruh Data Guru ke File Excel"
                  >
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>Download Excel</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadTeacherTemplate}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                    title="Unduh Format Template Excel Import Guru"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
                    <span>Template</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openTeacherModal()}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>+ Tambah Guru</span>
                  </button>
                </div>
              </div>

              {/* Toast Notifikasi Import */}
              {importSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center justify-between gap-2 shadow-sm animate-fade-in">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{importSuccessMsg}</span>
                  </div>
                  <button onClick={() => setImportSuccessMsg('')} className="text-emerald-700 hover:text-emerald-900">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 font-extrabold text-slate-800 uppercase">
                  <tr>
                    <th className="p-3 border-b border-slate-200">NIPY</th>
                    <th className="p-3 border-b border-slate-200">Nama</th>
                    <th className="p-3 border-b border-slate-200">Alamat</th>
                    <th className="p-3 border-b border-slate-200">NO. Telpon</th>
                    <th className="p-3 border-b border-slate-200">Wali Kelas</th>
                    <th className="p-3 border-b border-slate-200">Jabatan</th>
                    <th className="p-3 border-b border-slate-200">Mata Pelajaran</th>
                    <th className="p-3 border-b border-slate-200 text-right">Gaji Pokok</th>
                    <th className="p-3 border-b border-slate-200 text-right">Honor Kepanitiaan</th>
                    <th className="p-3 border-b border-slate-200">Keterangan</th>
                    <th className="p-3 border-b border-slate-200 text-center print:hidden">Aksi Edit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {teachers.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-900">
                        <div>{t.nipy || t.nip || '-'}</div>
                        {t.niy && <span className="block text-[10px] text-slate-400 font-normal">NIY: {t.niy}</span>}
                      </td>
                      <td className="p-3 font-semibold text-slate-900">{t.name}</td>
                      <td className="p-3 text-slate-600 max-w-xs truncate" title={t.address}>
                        {t.address || '-'}
                      </td>
                      <td className="p-3 font-mono text-slate-700">{t.phone || '-'}</td>
                      <td className="p-3 text-indigo-700 font-bold">{t.assignedRombel || '-'}</td>
                      <td className="p-3 font-bold text-slate-800">{t.role}</td>
                      <td className="p-3 text-slate-700">{t.subjectTaught || '-'}</td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">{formatRupiah(t.baseSalary)}</td>
                      <td className="p-3 text-right font-mono text-emerald-700">+{formatRupiah(t.allowance)}</td>
                      <td className="p-3 text-right font-mono text-sky-700">+{formatRupiah(t.committeeHonor || 0)}</td>
                      <td className="p-3 text-slate-600 max-w-xs truncate" title={t.notes}>
                        {t.notes || '-'}
                      </td>
                      <td className="p-3 text-center print:hidden">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openTeacherModal(t)}
                            className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold transition flex items-center gap-1"
                            title="Edit Data Guru"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ type: 'guru', id: t.id, name: t.name })}
                            className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-semibold transition cursor-pointer"
                            title="Hapus Guru"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. PENGURUS TAB */}
        {activeTab === 'pengurus' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Pengurus, Pembina & Pengawas Yayasan Pendidikan</h3>
                <p className="text-xs text-slate-500">
                  Daftar nama penanggung jawab dan penandatangan dokumen laporan keuangan resmi.
                </p>
              </div>
              <button
                onClick={() => openBoardModal()}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow transition print:hidden"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Tambah Pengurus Baru</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 font-extrabold text-slate-800 uppercase">
                  <tr>
                    <th className="p-3 border-b border-slate-200">NIY</th>
                    <th className="p-3 border-b border-slate-200">Nama</th>
                    <th className="p-3 border-b border-slate-200">Alamat</th>
                    <th className="p-3 border-b border-slate-200">NO. Telpon</th>
                    <th className="p-3 border-b border-slate-200">Wali Kelas</th>
                    <th className="p-3 border-b border-slate-200">Jabatan</th>
                    <th className="p-3 border-b border-slate-200">Mata Pelajaran</th>
                    <th className="p-3 border-b border-slate-200 text-right">Gaji Pokok</th>
                    <th className="p-3 border-b border-slate-200 text-right">Honor Kepanitiaan</th>
                    <th className="p-3 border-b border-slate-200">Keterangan</th>
                    <th className="p-3 border-b border-slate-200 text-center print:hidden">Aksi Edit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {boardMembers.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-900">
                        <div>{b.niy || b.nipy || '-'}</div>
                      </td>
                      <td className="p-3 font-semibold text-slate-900">{b.name}</td>
                      <td className="p-3 text-slate-600 max-w-xs truncate" title={b.address}>
                        {b.address || '-'}
                      </td>
                      <td className="p-3 font-mono text-slate-700">{b.phone || '-'}</td>
                      <td className="p-3 text-slate-600">{b.assignedRombel || '-'}</td>
                      <td className="p-3 text-emerald-800 font-extrabold">{b.position}</td>
                      <td className="p-3 text-slate-700">{b.subjectTaught || '-'}</td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">
                        {formatRupiah(b.baseSalary || b.honorarium || 0)}
                      </td>
                      <td className="p-3 text-right font-mono text-sky-700">+{formatRupiah(b.committeeHonor || 0)}</td>
                      <td className="p-3 text-slate-600 max-w-xs truncate" title={b.notes}>
                        {b.notes || '-'}
                      </td>
                      <td className="p-3 text-center print:hidden">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openBoardModal(b)}
                            className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold transition"
                            title="Edit Pengurus"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ type: 'pengurus', id: b.id, name: b.name })}
                            className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-semibold transition cursor-pointer"
                            title="Hapus Pengurus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. SUPPLIER TAB */}
        {activeTab === 'supplier' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Daftar Supplier, Vendor & Partner Yayasan</h3>
                <p className="text-xs text-slate-500">
                  Daftar penyedia buku, ATK, peralatan lab, katering, dan kontraktor sarana sekolah.
                </p>
              </div>
              <button
                onClick={() => openSupplierModal()}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow transition print:hidden"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Tambah Supplier Baru</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 font-extrabold text-slate-800 uppercase">
                  <tr>
                    <th className="p-3 border-b border-slate-200">Nama Supplier / Perusahaan</th>
                    <th className="p-3 border-b border-slate-200">Kategori Produk</th>
                    <th className="p-3 border-b border-slate-200">Contact Person</th>
                    <th className="p-3 border-b border-slate-200">Telepon / Whatsapp</th>
                    <th className="p-3 border-b border-slate-200 text-center print:hidden">Aksi Edit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {suppliers.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-900">{s.name}</td>
                      <td className="p-3 text-slate-600">{s.category}</td>
                      <td className="p-3 text-slate-800">{s.contact}</td>
                      <td className="p-3 font-mono text-slate-600">{s.phone}</td>
                      <td className="p-3 text-center print:hidden">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openSupplierModal(s)}
                            className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-semibold transition"
                            title="Edit Supplier"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ type: 'supplier', id: s.id, name: s.name })}
                            className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-semibold transition cursor-pointer"
                            title="Hapus Supplier"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tanda Tangan Laporan Resmi Cetak */}
        <div className="mt-12 pt-8 border-t border-slate-300 hidden print:grid grid-cols-2 text-center text-xs text-slate-700">
          <div>
            <p className="mb-12 font-medium">Disiapkan Oleh,<br /><strong>{foundationProfile?.treasurerTitle || 'Kepala Bagian Keuangan / Master Data'}</strong></p>
            <p className="font-bold underline">{foundationProfile?.treasurerName || 'Hj. Nurul Aini, S.E., M.Ak'}</p>
            <p className="text-[10px] text-slate-500">{foundationProfile?.treasurerNip || 'NIPY. 20180209'}</p>
          </div>
          <div>
            <p className="mb-12 font-medium">Mengetahui & Menyetujui,<br /><strong>{foundationProfile?.leaderTitle || 'Ketua Pembina Yayasan'}</strong></p>
            <p className="font-bold underline">{foundationProfile?.leaderName || 'Drs. H. M. Syukri, M.M'}</p>
            <p className="text-[10px] text-slate-500">{foundationProfile?.leaderNip || 'NIPY. 20100101'}</p>
          </div>
        </div>

      </div>

      {/* --- MODAL 1: ADD/EDIT STUDENT --- */}
      {showStdModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 text-base">
                {editingStudent ? 'Edit Master Data Siswa' : 'Tambah Siswa Baru'}
              </h3>
              <button onClick={() => setShowStdModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStdSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">NIS (Nomor Induk Siswa)</label>
                  <input
                    type="text"
                    value={stdNis}
                    onChange={(e) => setStdNis(e.target.value)}
                    placeholder="2026101"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">NISN (Nasional)</label>
                  <input
                    type="text"
                    value={stdNisn}
                    onChange={(e) => setStdNisn(e.target.value)}
                    placeholder="0012345678"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap Siswa</label>
                <input
                  type="text"
                  value={stdName}
                  onChange={(e) => setStdName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tempat Lahir</label>
                  <input
                    type="text"
                    value={stdBirthPlace}
                    onChange={(e) => setStdBirthPlace(e.target.value)}
                    placeholder="Jakarta"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={stdBirthDate}
                    onChange={(e) => setStdBirthDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={stdGender}
                    onChange={(e) => setStdGender(e.target.value as 'L' | 'P')}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-bold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Orang Tua / Wali</label>
                  <input
                    type="text"
                    value={stdParentName}
                    onChange={(e) => setStdParentName(e.target.value)}
                    placeholder="Nama Ayah / Ibu"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Telepon Orang Tua / Wali</label>
                  <input
                    type="text"
                    value={stdPhone}
                    onChange={(e) => setStdPhone(e.target.value)}
                    placeholder="08123456789"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Lengkap</label>
                <textarea
                  rows={2}
                  value={stdAddress}
                  onChange={(e) => setStdAddress(e.target.value)}
                  placeholder="Jl. Pendidikan No. 12..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kelas</label>
                  <input
                    type="text"
                    value={stdGrade}
                    onChange={(e) => setStdGrade(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tarif SPP (Rp)</label>
                  <input
                    type="number"
                    value={stdSpp}
                    onChange={(e) => setStdSpp(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status SPP</label>
                  <select
                    value={stdSppStatus}
                    onChange={(e) => setStdSppStatus(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="LUNAS">LUNAS</option>
                    <option value="MENUNGGU">MENUNGGU</option>
                    <option value="TUNGGAKAN">TUNGGAKAN</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Prestasi / Catatan Khusus</label>
                <input
                  type="text"
                  value={stdAchievements}
                  onChange={(e) => setStdAchievements(e.target.value)}
                  placeholder="Juara 1 Lomba OSN / Prestasi Akademik"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowStdModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow"
                >
                  {editingStudent ? 'Simpan Perubahan' : 'Tambah Siswa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: ADD/EDIT TEACHER (GAJI GURU) --- */}
      {showTchModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {editingTeacher ? 'Edit Data & Struktur Gaji Guru' : 'Tambah Guru / Staf Baru'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Sesuaikan gaji pokok, tunjangan, dan potongan pph21/bpjs sekolah Anda.
                </p>
              </div>
              <button onClick={() => setShowTchModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTchSubmit} className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">NIP (Sekolah)</label>
                  <input
                    type="text"
                    value={tchNip}
                    onChange={(e) => setTchNip(e.target.value)}
                    placeholder="202601"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">NIPY (Pegawai)</label>
                  <input
                    type="text"
                    value={tchNipy}
                    onChange={(e) => setTchNipy(e.target.value)}
                    placeholder="NIPY.202601"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">NIY (Yayasan)</label>
                  <input
                    type="text"
                    value={tchNiy}
                    onChange={(e) => setTchNiy(e.target.value)}
                    placeholder="NIY.202601"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap & Gelar</label>
                  <input
                    type="text"
                    value={tchName}
                    onChange={(e) => setTchName(e.target.value)}
                    placeholder="Contoh: Drs. H. Ahmad Dahlan, M.Pd"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jabatan Guru / Staf / Pengurus</label>
                  <select
                    value={tchRole}
                    onChange={(e) => setTchRole(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Guru">Guru Pengajar</option>
                    <option value="Kepala Sekolah">Kepala Sekolah</option>
                    <option value="Bendahara Sekolah">Bendahara Sekolah</option>
                    <option value="Ketua Yayasan">Ketua Yayasan</option>
                    <option value="Pembina Yayasan">Pembina Yayasan</option>
                    <option value="Bendahara Umum Yayasan">Bendahara Umum Yayasan</option>
                    <option value="Staf Admin">Staf Administrasi & TU</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">NO. Telpon / WhatsApp</label>
                  <input
                    type="text"
                    value={tchPhone}
                    onChange={(e) => setTchPhone(e.target.value)}
                    placeholder="08123456789"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Wali Kelas (Jika ada)</label>
                  <input
                    type="text"
                    value={tchWalikelas}
                    onChange={(e) => setTchWalikelas(e.target.value)}
                    placeholder="Contoh: Kelas X-A"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mata Pelajaran</label>
                  <input
                    type="text"
                    value={tchSubject}
                    onChange={(e) => setTchSubject(e.target.value)}
                    placeholder="Contoh: Matematika / IPA"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Honor Kepanitiaan (Rp)</label>
                  <input
                    type="number"
                    value={tchCommitteeHonor}
                    onChange={(e) => setTchCommitteeHonor(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Lengkap</label>
                <textarea
                  rows={2}
                  value={tchAddress}
                  onChange={(e) => setTchAddress(e.target.value)}
                  placeholder="Jl. Merdeka No. 45..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gaji Pokok (Rp)</label>
                  <input
                    type="number"
                    value={tchBaseSalary}
                    onChange={(e) => setTchBaseSalary(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tunjangan Jabatan (Rp)</label>
                  <input
                    type="number"
                    value={tchAllowance}
                    onChange={(e) => setTchAllowance(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Potongan PPh 21 (Rp)</label>
                  <input
                    type="number"
                    value={tchPph21}
                    onChange={(e) => setTchPph21(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-rose-600 font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Potongan BPJS (Rp)</label>
                  <input
                    type="number"
                    value={tchBpjs}
                    onChange={(e) => setTchBpjs(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-rose-600 font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Keterangan / Catatan</label>
                <input
                  type="text"
                  value={tchNotes}
                  onChange={(e) => setTchNotes(e.target.value)}
                  placeholder="Keterangan tambahan..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Realtime THP Display */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-900">Gaji Bersih Diterima (Take Home Pay):</span>
                <span className="font-mono font-black text-emerald-700 text-sm">
                  {formatRupiah(Math.max(0, tchBaseSalary + tchAllowance - tchPph21 - tchBpjs))}
                </span>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowTchModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow"
                >
                  {editingTeacher ? 'Simpan Gaji Guru' : 'Tambah Guru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 3: ADD/EDIT BOARD MEMBER --- */}
      {showBrdModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 text-base">
                {editingBoard ? 'Edit Pengurus Yayasan' : 'Tambah Pengurus Baru'}
              </h3>
              <button onClick={() => setShowBrdModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBrdSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">NIPY Pengurus</label>
                  <input
                    type="text"
                    value={brdNipy}
                    onChange={(e) => setBrdNipy(e.target.value)}
                    placeholder="NIPY.202601"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">NIY Pengurus</label>
                  <input
                    type="text"
                    value={brdNiy}
                    onChange={(e) => setBrdNiy(e.target.value)}
                    placeholder="NIY.202601"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Jabatan Struktur Yayasan</label>
                <select
                  value={brdPosition}
                  onChange={(e) => setBrdPosition(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-emerald-500"
                >
                  <option value="Pembina Yayasan">Pembina Yayasan</option>
                  <option value="Ketua Yayasan">Ketua Yayasan</option>
                  <option value="Sekretaris Yayasan">Sekretaris Yayasan</option>
                  <option value="Bendahara Yayasan">Bendahara Yayasan</option>
                  <option value="Ketua Pembina Yayasan">Ketua Pembina Yayasan</option>
                  <option value="Bendahara Umum Yayasan">Bendahara Umum Yayasan</option>
                  <option value="Pengawas Yayasan">Pengawas Yayasan</option>
                  <option value="Anggota Pengurus">Anggota Pengurus</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  value={brdName}
                  onChange={(e) => setBrdName(e.target.value)}
                  placeholder="Contoh: Drs. H. M. Syukri, M.M"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Lengkap</label>
                <textarea
                  rows={2}
                  value={brdAddress}
                  onChange={(e) => setBrdAddress(e.target.value)}
                  placeholder="Jl. Yayasan No. 1..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">No. HP / WhatsApp Kontak</label>
                  <input
                    type="text"
                    value={brdPhone}
                    onChange={(e) => setBrdPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Wali Kelas (Jika ada)</label>
                  <input
                    type="text"
                    value={brdWalikelas}
                    onChange={(e) => setBrdWalikelas(e.target.value)}
                    placeholder="Contoh: -"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mata Pelajaran (Jika mengajar)</label>
                  <input
                    type="text"
                    value={brdSubject}
                    onChange={(e) => setBrdSubject(e.target.value)}
                    placeholder="Contoh: Agama / -"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gaji Pokok / Honorarium (Rp)</label>
                  <input
                    type="number"
                    value={brdBaseSalary}
                    onChange={(e) => setBrdBaseSalary(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tunjangan Jabatan (Rp)</label>
                  <input
                    type="number"
                    value={brdAllowance}
                    onChange={(e) => setBrdAllowance(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Honor Kepanitiaan (Rp)</label>
                  <input
                    type="number"
                    value={brdCommitteeHonor}
                    onChange={(e) => setBrdCommitteeHonor(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Keterangan / Catatan</label>
                <input
                  type="text"
                  value={brdNotes}
                  onChange={(e) => setBrdNotes(e.target.value)}
                  placeholder="Keterangan pengurus..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowBrdModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow"
                >
                  {editingBoard ? 'Simpan Perubahan' : 'Tambah Pengurus'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 4: ADD/EDIT SUPPLIER --- */}
      {showSupModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 text-base">
                {editingSupplier ? 'Edit Data Supplier Mitra' : 'Tambah Supplier / Vendor Baru'}
              </h3>
              <button onClick={() => setShowSupModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSupSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Perusahaan / Supplier</label>
                <input
                  type="text"
                  value={supName}
                  onChange={(e) => setSupName(e.target.value)}
                  placeholder="Contoh: PT Penerbit Erlangga"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Produk / Layanan</label>
                <input
                  type="text"
                  value={supCategory}
                  onChange={(e) => setSupCategory(e.target.value)}
                  placeholder="Contoh: Buku Pelajaran & Lab"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Contact Person</label>
                <input
                  type="text"
                  value={supContact}
                  onChange={(e) => setSupContact(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">No. HP / Telepon Vendor</label>
                <input
                  type="text"
                  value={supPhone}
                  onChange={(e) => setSupPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSupModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow"
                >
                  {editingSupplier ? 'Simpan Supplier' : 'Tambah Supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 5: DELETE CONFIRMATION --- */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-fade-in">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-rose-600">
                <Trash2 className="w-5 h-5" />
                <h3 className="font-extrabold text-slate-900 text-base">Konfirmasi Hapus Data</h3>
              </div>
              <button onClick={() => setDeleteConfirm(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              Apakah Anda yakin ingin menghapus data <span className="font-extrabold text-slate-900 capitalize">{deleteConfirm.type}</span> yaitu <span className="font-extrabold text-rose-600">{deleteConfirm.name}</span> dari Master Data Sekolah?
            </p>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-800">
              Perhatian: Tindakan ini akan menghapus data tersebut secara permanen.
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (deleteConfirm.type === 'semua_siswa') {
                    if (onDeleteAllStudents) onDeleteAllStudents();
                    setImportSuccessMsg('Seluruh data siswa berhasil dihapus. Anda dapat mengunggah file Excel siswa yang baru sekarang.');
                  } else if (deleteConfirm.type === 'siswa') onDeleteStudent(deleteConfirm.id);
                  else if (deleteConfirm.type === 'guru') onDeleteTeacher(deleteConfirm.id);
                  else if (deleteConfirm.type === 'pengurus') onDeleteBoardMember(deleteConfirm.id);
                  else if (deleteConfirm.type === 'supplier') onDeleteSupplier(deleteConfirm.id);
                  setDeleteConfirm(null);
                }}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Ya, Hapus Data</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 6: UPLOAD LOGO YAYASAN --- */}
      {showLogoModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-fade-in">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-indigo-900">
                <Image className="w-5 h-5 text-amber-500" />
                <h3 className="font-extrabold text-slate-900 text-base">Kelola / Upload Logo Yayasan</h3>
              </div>
              <button onClick={() => setShowLogoModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Upload logo resmi sekolah/yayasan dari komputer (PNG, JPG, WebP, SVG). Logo ini akan ditampilkan otomatis pada Header Navbar, Kop Surat E-Raport, Kuitansi SPP, dan Portal Website Publik.
            </p>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <label className="block text-xs font-bold text-slate-800">Pratinjau Logo Saat Ini:</label>
              <div className="flex items-center gap-4">
                {foundationProfile?.logoUrl ? (
                  <img
                    src={foundationProfile.logoUrl}
                    alt="Preview Logo"
                    className="w-20 h-20 object-contain bg-white p-2 border border-slate-300 rounded-xl shadow-sm"
                  />
                ) : (
                  <div className="w-20 h-20 bg-slate-200 text-slate-600 font-bold text-xs rounded-xl flex items-center justify-center border border-slate-300">
                    Belum ada
                  </div>
                )}
                <div className="text-xs text-slate-600 space-y-1">
                  <p className="font-extrabold text-slate-900">{foundationProfile?.name}</p>
                  <p className="text-[11px] text-slate-500">Format disarankan: PNG transparan atau SVG</p>
                </div>
              </div>

              <MediaUploader
                value={foundationProfile?.logoUrl || ''}
                onChange={(newUrl) => {
                  if (foundationProfile && onUpdateFoundationProfile) {
                    onUpdateFoundationProfile({
                      ...foundationProfile,
                      logoUrl: newUrl,
                    });
                  }
                }}
                label="Pilih / Upload File Logo Baru:"
                placeholder="Pilih file logo dari komputer..."
                helperText="Mendukung file gambar dari penyimpanan lokal komputer Anda."
              />
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowLogoModal(false)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                Selesai & Simpan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
