import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Teacher, FoundationBoard, Supplier, Account, JournalEntry, FoundationProfile } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import { printDocument } from '../../utils/printHelper';
import { ReceiptModal } from '../common/ReceiptModal';
import {
  Users,
  DollarSign,
  FileSpreadsheet,
  Upload,
  Download,
  PlusCircle,
  Printer,
  CheckCircle2,
  Edit,
  Trash2,
  Building2,
  Briefcase,
  Search,
  Store,
  CreditCard,
  X,
  AlertCircle,
  Sparkles,
  Award,
  RefreshCw,
  Coins,
} from 'lucide-react';

interface PayrollSdmViewProps {
  teachers: Teacher[];
  boardMembers?: FoundationBoard[];
  suppliers?: Supplier[];
  accounts: Account[];
  foundationProfile?: FoundationProfile;
  onAddTeacher: (teacher: Teacher) => void;
  onUpdateTeacher: (teacher: Teacher) => void;
  onDeleteTeacher: (id: string) => void;
  onImportTeachers?: (teachers: Teacher[]) => void;
  onAddBoardMember?: (member: FoundationBoard) => void;
  onUpdateBoardMember?: (member: FoundationBoard) => void;
  onDeleteBoardMember?: (id: string) => void;
  onAddSupplier?: (supplier: Supplier) => void;
  onUpdateSupplier?: (supplier: Supplier) => void;
  onDeleteSupplier?: (id: string) => void;
  onAddJournalEntry: (entry: JournalEntry) => void;
  onSyncPayrollLiabilities?: () => void;
}

// Helper to parse numbers safely from Excel
const parseExcelNumber = (val: any, fallback: number = 0): number => {
  if (val === undefined || val === null || val === '') return fallback;
  if (typeof val === 'number') return isNaN(val) ? fallback : val;

  let str = String(val).trim();
  if (!str) return fallback;

  str = str.replace(/^(Rp\.?|IDR)\s*/gi, '').trim();

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

// Fuzzy match for row keys
const getRowVal = (row: Record<string, any>, possibleKeys: string[]): any => {
  const rowKeys = Object.keys(row);
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
  return undefined;
};

export const PayrollSdmView: React.FC<PayrollSdmViewProps> = ({
  teachers,
  boardMembers = [],
  suppliers = [],
  accounts,
  foundationProfile,
  onAddTeacher,
  onUpdateTeacher,
  onDeleteTeacher,
  onImportTeachers,
  onAddBoardMember,
  onUpdateBoardMember,
  onDeleteBoardMember,
  onAddSupplier,
  onUpdateSupplier,
  onDeleteSupplier,
  onAddJournalEntry,
  onSyncPayrollLiabilities,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'sdm_list' | 'pengurus' | 'supplier' | 'proses_gaji' | 'slip_gaji'>('sdm_list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('ALL');

  // Excel File Input Ref
  const teacherFileInputRef = useRef<HTMLInputElement>(null);
  const [importSuccessMsg, setImportSuccessMsg] = useState<string>('');
  const [syncToast, setSyncToast] = useState(false);

  // Delete Confirmation State
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'guru' | 'pengurus' | 'supplier';
    id: string;
    name: string;
  } | null>(null);

  // Modal State for Add/Edit SDM (Guru)
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [teacherFormData, setTeacherFormData] = useState<Partial<Teacher>>({
    nip: '',
    nipy: '',
    name: '',
    role: 'Guru',
    assignedRombel: '',
    subjectTaught: '',
    baseSalary: 3000000,
    allowance: 0,
    committeeHonor: 0,
    bpjs: 0,
    pph21: 0,
    phone: '',
    address: '',
    notes: '',
  });

  // Modal State for Board Member (Pengurus)
  const [showBrdModal, setShowBrdModal] = useState(false);
  const [editingBoard, setEditingBoard] = useState<FoundationBoard | null>(null);
  const [brdFormData, setBrdFormData] = useState<Partial<FoundationBoard>>({
    name: '',
    position: 'Pembina Yayasan',
    phone: '',
    address: '',
    niy: '',
    nipy: '',
    baseSalary: 3500000,
    allowance: 1000000,
    committeeHonor: 300000,
    notes: '',
  });

  // Modal State for Supplier
  const [showSupModal, setShowSupModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [supFormData, setSupFormData] = useState<Partial<Supplier>>({
    name: '',
    category: 'Buku & Seragam',
    contact: '',
    phone: '',
  });

  // Payroll Processing State
  const [payrollMonth, setPayrollMonth] = useState('Agustus 2026');
  const [paymentAccountCode, setPaymentAccountCode] = useState('1-1101');
  const [expenseAccountCode, setExpenseAccountCode] = useState('5-5101');
  const [payrollPostingSuccess, setPayrollPostingSuccess] = useState('');

  // Slip Gaji Modal State
  const [selectedSlipTeacher, setSelectedSlipTeacher] = useState<Teacher | null>(null);
  const [showSlipModal, setShowSlipModal] = useState(false);

  // Totals calculations
  const totalSdmCount = teachers.length;
  const totalBaseSalary = teachers.reduce((sum, t) => sum + (t.baseSalary || 0), 0);
  const totalAllowance = teachers.reduce((sum, t) => sum + (t.allowance || 0) + (t.committeeHonor || 0), 0);
  const totalDeductions = teachers.reduce((sum, t) => sum + (t.bpjs || 0) + (t.pph21 || 0), 0);
  const totalPayrollBudget = teachers.reduce(
    (sum, t) => sum + ((t.baseSalary || 0) + (t.allowance || 0) + (t.committeeHonor || 0) - (t.bpjs || 0) - (t.pph21 || 0)),
    0
  );

  // Filtered teachers list
  const filteredTeachers = teachers.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.nip.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.nipy || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.role || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = selectedRoleFilter === 'ALL' || t.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  // Filtered board members list
  const filteredBoard = boardMembers.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.nipy || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filtered suppliers list
  const filteredSuppliers = suppliers.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.contact.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Manual Sync Handler
  const handleManualSync = () => {
    if (onSyncPayrollLiabilities) {
      onSyncPayrollLiabilities();
      setSyncToast(true);
      setTimeout(() => setSyncToast(false), 5000);
    }
  };

  // --- EXCEL HANDLERS FOR SDM / GURU ---
  const handleExportTeachersExcel = () => {
    if (teachers.length === 0) {
      alert('Belum ada data Guru & SDM untuk diunduh.');
      return;
    }
    const exportData = teachers.map((t) => ({
      'NIP': t.nip,
      'NIPY / NIY': t.nipy || t.niy || '',
      'Nama Lengkap SDM / Guru': t.name,
      'Jabatan / Role': t.role,
      'Wali Kelas / Rombel': t.assignedRombel || '',
      'Mata Pelajaran': t.subjectTaught || '',
      'Gaji Pokok (Rp)': t.baseSalary,
      'Tunjangan Jabatan (Rp)': t.allowance,
      'Honor Kepanitiaan (Rp)': t.committeeHonor || 0,
      'Potongan BPJS (Rp)': t.bpjs || 0,
      'Potongan PPh21 (Rp)': t.pph21 || 0,
      'Gaji Bersih / THP (Rp)': (t.baseSalary || 0) + (t.allowance || 0) + (t.committeeHonor || 0) - (t.bpjs || 0) - (t.pph21 || 0),
      'No. Telpon': t.phone || '',
      'Alamat': t.address || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data SDM & Payroll');
    XLSX.writeFile(workbook, `Data_Payroll_SDM_Yayasan_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const handleDownloadTeacherTemplate = () => {
    const templateData = [
      {
        'NIP': '198501012010011001',
        'NIPY': 'YYS-2026-001',
        'Nama Lengkap SDM / Guru': 'Drs. H. Ahmad Dahlan, M.Pd',
        'Jabatan / Role': 'Kepala Sekolah',
        'Wali Kelas / Rombel': '-',
        'Mata Pelajaran': 'Manajemen Pendidikan',
        'Gaji Pokok (Rp)': 4500000,
        'Tunjangan Jabatan (Rp)': 1200000,
        'Honor Kepanitiaan (Rp)': 300000,
        'Potongan BPJS (Rp)': 75000,
        'Potongan PPh21 (Rp)': 50000,
        'No. Telpon': '081234567890',
        'Alamat': 'Jl. Pendidikan No. 10',
      },
      {
        'NIP': '199002152015022002',
        'NIPY': 'YYS-2026-002',
        'Nama Lengkap SDM / Guru': 'Siti Nurhaliza, S.Pd',
        'Jabatan / Role': 'Guru',
        'Wali Kelas / Rombel': 'Kelas 1',
        'Mata Pelajaran': 'Tematik SD / MI',
        'Gaji Pokok (Rp)': 3000000,
        'Tunjangan Jabatan (Rp)': 600000,
        'Honor Kepanitiaan (Rp)': 200000,
        'Potongan BPJS (Rp)': 50000,
        'Potongan PPh21 (Rp)': 0,
        'No. Telpon': '081987654321',
        'Alamat': 'Jl. Melati No. 12',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template Import SDM');
    XLSX.writeFile(workbook, `Template_Import_Payroll_SDM.xlsx`);
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
          alert('File Excel kosong atau format kolom tidak dikenali.');
          return;
        }

        const importedTeachers: Teacher[] = json.map((row, idx) => {
          const nip = String(getRowVal(row, ['NIP', 'nip', 'Nomor Induk Pegawai']) || `19900000${idx + 1}`);
          const nipy = String(getRowVal(row, ['NIPY', 'nipy', 'NIY', 'niy', 'NIPY / NIY']) || `YYS-${202600 + idx + 1}`);
          const name = String(getRowVal(row, ['Nama Lengkap SDM / Guru', 'Nama Guru', 'Nama SDM', 'Nama', 'name']) || `Pegawai Impor ${idx + 1}`);
          const role = String(getRowVal(row, ['Jabatan / Role', 'Jabatan', 'Role', 'role']) || 'Guru');
          const assignedRombel = String(getRowVal(row, ['Wali Kelas / Rombel', 'Wali Kelas', 'Rombel', 'assignedRombel']) || '');
          const subjectTaught = String(getRowVal(row, ['Mata Pelajaran', 'Mapel', 'subjectTaught']) || '');

          const baseSalary = parseExcelNumber(getRowVal(row, ['Gaji Pokok (Rp)', 'Gaji Pokok', 'Gaji', 'baseSalary']), 2500000);
          const allowance = parseExcelNumber(getRowVal(row, ['Tunjangan Jabatan (Rp)', 'Tunjangan Jabatan', 'Tunjangan', 'allowance']), 500000);
          const committeeHonor = parseExcelNumber(getRowVal(row, ['Honor Kepanitiaan (Rp)', 'Honor Kepanitiaan', 'Honor', 'committeeHonor']), 0);
          const bpjs = parseExcelNumber(getRowVal(row, ['Potongan BPJS (Rp)', 'Potongan BPJS', 'BPJS', 'bpjs']), 50000);
          const pph21 = parseExcelNumber(getRowVal(row, ['Potongan PPh21 (Rp)', 'Potongan PPh21', 'PPh21', 'pph21']), 0);

          const phone = String(getRowVal(row, ['No. Telpon', 'No Telp', 'No HP', 'phone']) || '');
          const address = String(getRowVal(row, ['Alamat', 'address']) || '');

          const netSalary = baseSalary + allowance + committeeHonor - bpjs - pph21;

          return {
            id: `tch-imp-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
            nip,
            nipy,
            name,
            role,
            assignedRombel,
            subjectTaught,
            baseSalary,
            allowance,
            committeeHonor,
            bpjs,
            pph21,
            netSalary,
            phone,
            address,
          };
        });

        if (onImportTeachers) {
          onImportTeachers(importedTeachers);
        } else {
          importedTeachers.forEach((t) => onAddTeacher(t));
        }

        setImportSuccessMsg(`Berhasil mengimpor ${importedTeachers.length} data Guru & SDM dari file Excel!`);
        setTimeout(() => setImportSuccessMsg(''), 7000);
      } catch (err) {
        console.error('Error parsing teacher excel:', err);
        alert('Gagal membaca file Excel SDM. Pastikan format file .xlsx, .xls, atau .csv yang valid.');
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  // Handle Save Teacher
  const handleSaveTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherFormData.name || !teacherFormData.nip) {
      alert('Nama dan NIP wajib diisi.');
      return;
    }

    const base = Number(teacherFormData.baseSalary || 0);
    const allow = Number(teacherFormData.allowance || 0);
    const honor = Number(teacherFormData.committeeHonor || 0);
    const bpjsVal = Number(teacherFormData.bpjs || 0);
    const pphVal = Number(teacherFormData.pph21 || 0);
    const net = base + allow + honor - bpjsVal - pphVal;

    const teacherObj: Teacher = {
      id: editingTeacher ? editingTeacher.id : `tch-${Date.now()}`,
      nip: teacherFormData.nip || '',
      nipy: teacherFormData.nipy || '',
      name: teacherFormData.name || '',
      role: teacherFormData.role || 'Guru',
      assignedRombel: teacherFormData.assignedRombel || '',
      subjectTaught: teacherFormData.subjectTaught || '',
      baseSalary: base,
      allowance: allow,
      committeeHonor: honor,
      bpjs: bpjsVal,
      pph21: pphVal,
      netSalary: net,
      phone: teacherFormData.phone || '',
      address: teacherFormData.address || '',
      notes: teacherFormData.notes || '',
    };

    if (editingTeacher) {
      onUpdateTeacher(teacherObj);
    } else {
      onAddTeacher(teacherObj);
    }

    setShowTeacherModal(false);
    setEditingTeacher(null);
  };

  // Handle Save Board Member
  const handleSaveBoardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brdFormData.name) {
      alert('Nama pengurus wajib diisi.');
      return;
    }

    const boardObj: FoundationBoard = {
      id: editingBoard ? editingBoard.id : `brd-${Date.now()}`,
      name: brdFormData.name || '',
      position: brdFormData.position || 'Pembina Yayasan',
      phone: brdFormData.phone || '',
      address: brdFormData.address || '',
      niy: brdFormData.niy || '',
      nipy: brdFormData.nipy || '',
      baseSalary: Number(brdFormData.baseSalary || 0),
      allowance: Number(brdFormData.allowance || 0),
      committeeHonor: Number(brdFormData.committeeHonor || 0),
      notes: brdFormData.notes || '',
    };

    if (editingBoard) {
      if (onUpdateBoardMember) onUpdateBoardMember(boardObj);
    } else {
      if (onAddBoardMember) onAddBoardMember(boardObj);
    }

    setShowBrdModal(false);
    setEditingBoard(null);
  };

  // Handle Save Supplier
  const handleSaveSupplierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supFormData.name) {
      alert('Nama supplier wajib diisi.');
      return;
    }

    const supplierObj: Supplier = {
      id: editingSupplier ? editingSupplier.id : `sup-${Date.now()}`,
      name: supFormData.name || '',
      category: supFormData.category || 'Lainnya',
      contact: supFormData.contact || '',
      phone: supFormData.phone || '',
    };

    if (editingSupplier) {
      if (onUpdateSupplier) onUpdateSupplier(supplierObj);
    } else {
      if (onAddSupplier) onAddSupplier(supplierObj);
    }

    setShowSupModal(false);
    setEditingSupplier(null);
  };

  const openTeacherEditModal = (t: Teacher) => {
    setEditingTeacher(t);
    setTeacherFormData(t);
    setShowTeacherModal(true);
  };

  const openTeacherAddModal = () => {
    setEditingTeacher(null);
    setTeacherFormData({
      nip: '',
      nipy: `YYS-2026-${Math.floor(100 + Math.random() * 900)}`,
      name: '',
      role: 'Guru',
      assignedRombel: '',
      subjectTaught: '',
      baseSalary: 3000000,
      allowance: 0,
      committeeHonor: 0,
      bpjs: 0,
      pph21: 0,
      phone: '',
      address: '',
      notes: '',
    });
    setShowTeacherModal(true);
  };

  const openBoardAddModal = () => {
    setEditingBoard(null);
    setBrdFormData({
      name: '',
      position: 'Pembina Yayasan',
      phone: '',
      address: '',
      niy: `NIY.2026${Math.floor(10 + Math.random() * 80)}`,
      nipy: `NIPY.2026${Math.floor(10 + Math.random() * 80)}`,
      baseSalary: 3500000,
      allowance: 1000000,
      committeeHonor: 300000,
      notes: '',
    });
    setShowBrdModal(true);
  };

  const openBoardEditModal = (b: FoundationBoard) => {
    setEditingBoard(b);
    setBrdFormData(b);
    setShowBrdModal(true);
  };

  const openSupplierAddModal = () => {
    setEditingSupplier(null);
    setSupFormData({
      name: '',
      category: 'Buku & Seragam',
      contact: '',
      phone: '',
    });
    setShowSupModal(true);
  };

  const openSupplierEditModal = (s: Supplier) => {
    setEditingSupplier(s);
    setSupFormData(s);
    setShowSupModal(true);
  };

  // Handle Post Payroll to Journal
  const handlePostPayrollJournal = () => {
    if (teachers.length === 0) {
      alert('Tidak ada data Guru / SDM untuk diproses.');
      return;
    }

    const payAcc = accounts.find((a) => a.code === paymentAccountCode) || accounts[0];
    const expAcc = accounts.find((a) => a.code === expenseAccountCode) || accounts.find((a) => a.category === 'BEBAN') || accounts[0];

    const todayStr = new Date().toISOString().slice(0, 10);
    const voucherNo = `PAY-${Date.now().toString().slice(-6)}`;

    // Create Journal Entry
    const newEntry: JournalEntry = {
      id: `jrn-pay-${Date.now()}`,
      date: todayStr,
      voucherNo,
      description: `Pembayaran Gaji & Payroll SDM Yayasan / Guru Periode ${payrollMonth} (${teachers.length} Pegawai)`,
      categoryTag: 'GAJI',
      debitAccountCode: expAcc.code,
      debitAccountName: expAcc.name,
      creditAccountCode: payAcc.code,
      creditAccountName: payAcc.name,
      amount: totalPayrollBudget,
      notes: `Posting otomatis ERP Payroll SDM. Kas Keluar: ${payAcc.name}`,
    };

    onAddJournalEntry(newEntry);
    setPayrollPostingSuccess(
      `Berhasil memosting Jurnal Payroll Bulan ${payrollMonth} sebesar ${formatRupiah(
        totalPayrollBudget
      )} ke Jurnal Keuangan Umum (Voucher: ${voucherNo})!`
    );
    setTimeout(() => setPayrollPostingSuccess(''), 8000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notifikasi Success */}
      {importSuccessMsg && (
        <div className="bg-emerald-50 border-2 border-emerald-500/80 text-emerald-900 px-5 py-4 rounded-2xl shadow-lg flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div className="text-sm font-semibold">{importSuccessMsg}</div>
          </div>
          <button onClick={() => setImportSuccessMsg('')} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {payrollPostingSuccess && (
        <div className="bg-indigo-50 border-2 border-indigo-500/80 text-indigo-900 px-5 py-4 rounded-2xl shadow-lg flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-indigo-600 shrink-0" />
            <div className="text-sm font-semibold">{payrollPostingSuccess}</div>
          </div>
          <button onClick={() => setPayrollPostingSuccess('')} className="text-indigo-700 hover:text-indigo-900">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {syncToast && (
        <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-bold text-xs">Sinkronisasi Kewajiban Gaji Berhasil!</p>
              <p className="text-[11px] opacity-90">
                Saldo Akun 2101 (Hutang Gaji Guru), 2102 (Hutang Gaji Kepsek), 2103 (PPh 21), & 2104 (BPJS) telah diperbarui.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Title & Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-indigo-500/20 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-black uppercase tracking-wider border border-indigo-400/30">
              <DollarSign className="w-3.5 h-3.5" /> ERPSYSTEM PAYROLL, SDM & ENTITAS YAYASAN
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Payroll Gaji SDM, Pengurus Yayasan & Supplier
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200/90 leading-relaxed">
              Pusat kelola data Master Guru & Staf, Pengurus/Pembina Yayasan, Mitra Supplier, Struktur Gaji, Impor Excel,
              Serta Proses Jurnal & Slip Gaji Resmi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Hidden Input File Excel */}
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
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg hover:shadow-indigo-500/20 transition flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Excel SDM</span>
            </button>

            <button
              type="button"
              onClick={handleExportTeachersExcel}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export Excel</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadTeacherTemplate}
              className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition flex items-center gap-2 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-indigo-300" />
              <span>Template Excel</span>
            </button>

            {onSyncPayrollLiabilities && (
              <button
                type="button"
                onClick={handleManualSync}
                className="px-3.5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer"
                title="Sinkronkan data ke Akun Kewajiban 2101-2104"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Sinkron Kewajiban</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Key Metric Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Guru & SDM</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{totalSdmCount} Orang</h3>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Pendidik & Staf Operasional</p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pengurus Yayasan</p>
            <h3 className="text-2xl font-black text-emerald-700 mt-1">{boardMembers.length} Personel</h3>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Pembina, Pengurus & Pengawas</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Supplier & Mitra</p>
            <h3 className="text-2xl font-black text-amber-700 mt-1">{suppliers.length} Entitas</h3>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Vendor Barang & Jasa</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <Store className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-5 rounded-2xl shadow-md flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Total Anggaran Gaji (THP)</p>
            <h3 className="text-xl font-black text-emerald-400 mt-1">{formatRupiah(totalPayrollBudget)}</h3>
            <p className="text-[11px] text-slate-300 font-medium mt-0.5">Payroll Bulanan Guru/SDM</p>
          </div>
          <div className="p-3 bg-white/10 rounded-2xl text-emerald-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('sdm_list')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'sdm_list'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>1. Master Guru & SDM ({teachers.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('pengurus')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'pengurus'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>2. Pengurus Yayasan ({boardMembers.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('supplier')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'supplier'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>3. Supplier & Mitra ({suppliers.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('proses_gaji')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'proses_gaji'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>4. Proses & Posting Gaji</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('slip_gaji')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'slip_gaji'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Printer className="w-4 h-4" />
          <span>5. Cetak Slip Gaji</span>
        </button>
      </div>

      {/* TAB 1: DATA MASTER GURU & SDM */}
      {activeSubTab === 'sdm_list' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                Data Master Guru, Staf & Struktur Gaji
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Kelola NIPY, Jabatan, Gaji Pokok, Tunjangan Jabatan, Honor Kepanitiaan, BPJS, & PPh21.
              </p>
            </div>

            <button
              type="button"
              onClick={openTeacherAddModal}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Tambah SDM Baru</span>
            </button>
          </div>

          {/* Filter & Search Bar */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari NIP, Nama Guru/SDM, Jabatan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
              <span className="text-xs font-bold text-slate-500 shrink-0">Filter Jabatan:</span>
              <button
                type="button"
                onClick={() => setSelectedRoleFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 cursor-pointer ${
                  selectedRoleFilter === 'ALL'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Semua
              </button>
              {['Guru', 'Kepala Sekolah', 'Bendahara Sekolah', 'Staf Admin'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRoleFilter(role)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 cursor-pointer ${
                    selectedRoleFilter === role
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Table SDM List */}
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-slate-100/90 text-slate-700 text-[11px] uppercase font-black tracking-wider border-b border-slate-200">
                  <th className="py-3.5 px-4">No & Identitas SDM</th>
                  <th className="py-3.5 px-4">Jabatan / Rombel</th>
                  <th className="py-3.5 px-4 text-right">Gaji Pokok</th>
                  <th className="py-3.5 px-4 text-right">Tunjangan & Honor</th>
                  <th className="py-3.5 px-4 text-right">Potongan (BPJS/PPH)</th>
                  <th className="py-3.5 px-4 text-right">Gaji Bersih (THP)</th>
                  <th className="py-3.5 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredTeachers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p className="font-semibold text-sm">Belum ada data Guru / SDM terdaftar.</p>
                      <p className="text-xs mt-1">Gunakan tombol "+ Tambah SDM Baru" atau "Upload Excel SDM" di atas.</p>
                    </td>
                  </tr>
                ) : (
                  filteredTeachers.map((t, idx) => {
                    const base = t.baseSalary || 0;
                    const allow = (t.allowance || 0) + (t.committeeHonor || 0);
                    const ded = (t.bpjs || 0) + (t.pph21 || 0);
                    const thp = t.netSalary || base + allow - ded;

                    return (
                      <tr key={t.id} className="hover:bg-slate-50 transition">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-slate-400 w-5">{idx + 1}.</span>
                            <div>
                              <p className="font-extrabold text-slate-900">{t.name}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                  NIP: {t.nip}
                                </span>
                                {t.nipy && (
                                  <span className="font-mono text-[10px] text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                                    NIPY: {t.nipy}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg text-[11px] font-bold inline-block">
                            {t.role}
                          </span>
                          {t.assignedRombel && (
                            <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                              Wali: {t.assignedRombel}
                            </p>
                          )}
                          {t.subjectTaught && (
                            <p className="text-[10px] text-slate-500 mt-0.5">Mapel: {t.subjectTaught}</p>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-800">
                          {formatRupiah(base)}
                        </td>

                        <td className="py-3.5 px-4 text-right font-mono font-semibold text-amber-700">
                          {formatRupiah(allow)}
                        </td>

                        <td className="py-3.5 px-4 text-right font-mono text-rose-600">
                          -{formatRupiah(ded)}
                        </td>

                        <td className="py-3.5 px-4 text-right font-mono font-black text-emerald-700 text-sm">
                          {formatRupiah(thp)}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedSlipTeacher(t);
                                setShowSlipModal(true);
                              }}
                              className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition"
                              title="Lihat / Cetak Slip Gaji"
                            >
                              <Printer className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => openTeacherEditModal(t)}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                              title="Edit Data SDM & Gaji"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeleteConfirm({ type: 'guru', id: t.id, name: t.name })}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition cursor-pointer"
                              title="Hapus Pegawai"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
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
      )}

      {/* TAB 2: PENGURUS YAYASAN */}
      {activeSubTab === 'pengurus' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                Data Master Pengurus, Pembina & Pengawas Yayasan
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Daftar pimpinan dan pengurus penanggung jawab laporan keuangan dan dokumen resmi yayasan.
              </p>
            </div>

            <button
              type="button"
              onClick={openBoardAddModal}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Tambah Pengurus</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-100/90 text-slate-700 text-[11px] uppercase font-black tracking-wider border-b border-slate-200">
                  <th className="py-3.5 px-4">NIY / NIPY</th>
                  <th className="py-3.5 px-4">Nama Pengurus</th>
                  <th className="py-3.5 px-4">Jabatan Struktur</th>
                  <th className="py-3.5 px-4">Kontak & Alamat</th>
                  <th className="py-3.5 px-4 text-right">Honor / Gaji Pokok</th>
                  <th className="py-3.5 px-4 text-right">Tunjangan</th>
                  <th className="py-3.5 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredBoard.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <Building2 className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p className="font-semibold text-sm">Belum ada data Pengurus Yayasan.</p>
                      <p className="text-xs mt-1">Klik "+ Tambah Pengurus" di atas untuk menambahkan pimpinan yayasan.</p>
                    </td>
                  </tr>
                ) : (
                  filteredBoard.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {b.nipy || b.niy || '-'}
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-slate-900">{b.name}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-900 border border-indigo-200 rounded-lg text-[11px] font-black">
                          {b.position}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-mono text-slate-700">{b.phone || '-'}</p>
                        <p className="text-slate-500 text-[11px] truncate max-w-xs">{b.address || '-'}</p>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                        {formatRupiah(b.baseSalary || b.honorarium || 0)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-emerald-700">
                        +{formatRupiah(b.allowance || 0)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openBoardEditModal(b)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                            title="Edit Pengurus"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirm({ type: 'pengurus', id: b.id, name: b.name })}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition cursor-pointer"
                            title="Hapus Pengurus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SUPPLIER & MITRA */}
      {activeSubTab === 'supplier' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                <Store className="w-5 h-5 text-indigo-600" />
                Data Master Supplier, Vendor & Partner Kerjasama
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Penyedia buku, alat laboratorium, seragam, katering, dan mitra pengadaan sekolah.
              </p>
            </div>

            <button
              type="button"
              onClick={openSupplierAddModal}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Tambah Supplier</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-100/90 text-slate-700 text-[11px] uppercase font-black tracking-wider border-b border-slate-200">
                  <th className="py-3.5 px-4">Nama Supplier / Perusahaan</th>
                  <th className="py-3.5 px-4">Kategori Produk</th>
                  <th className="py-3.5 px-4">Contact Person</th>
                  <th className="py-3.5 px-4">Telepon / WhatsApp</th>
                  <th className="py-3.5 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredSuppliers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      <Store className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p className="font-semibold text-sm">Belum ada data Supplier terdaftar.</p>
                      <p className="text-xs mt-1">Klik "+ Tambah Supplier" di atas untuk mendaftarkan mitra vendor.</p>
                    </td>
                  </tr>
                ) : (
                  filteredSuppliers.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-extrabold text-slate-900">{s.name}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-[11px] font-bold">
                          {s.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">{s.contact}</td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">{s.phone}</td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openSupplierEditModal(s)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                            title="Edit Supplier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirm({ type: 'supplier', id: s.id, name: s.name })}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition cursor-pointer"
                            title="Hapus Supplier"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: PROSES & POSTING GAJI BULANAN */}
      {activeSubTab === 'proses_gaji' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-indigo-600" />
              Pemrosesan Payroll & Posting Jurnal Umum Keuangan
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Pilih akun sumber kas/bank yayasan untuk memosting transaksi gaji bulanan ke dalam Pembukuan Keuangan ISAK 35.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Periode Bulan Penggajian:</label>
              <input
                type="text"
                value={payrollMonth}
                onChange={(e) => setPayrollMonth(e.target.value)}
                placeholder="misal: Agustus 2026"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Akun Sumber Pembayaran (Kas/Bank):</label>
              <select
                value={paymentAccountCode}
                onChange={(e) => setPaymentAccountCode(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {accounts
                  .filter((a) => a.category === 'ASET_LANCAR')
                  .map((acc) => (
                    <option key={acc.code} value={acc.code}>
                      {acc.code} - {acc.name} (Saldo: {formatRupiah(acc.balance)})
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Akun Beban Gaji (Debit):</label>
              <select
                value={expenseAccountCode}
                onChange={(e) => setExpenseAccountCode(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {accounts
                  .filter((a) => a.category === 'BEBAN')
                  .map((acc) => (
                    <option key={acc.code} value={acc.code}>
                      {acc.code} - {acc.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="bg-indigo-50/70 p-5 rounded-2xl border border-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider">Ringkasan Posting Gaji</span>
              <p className="text-sm font-black text-indigo-950">
                Total Nominal Payroll ({teachers.length} SDM):{' '}
                <span className="text-emerald-700 font-mono text-base">{formatRupiah(totalPayrollBudget)}</span>
              </p>
            </div>

            <button
              type="button"
              onClick={handlePostPayrollJournal}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer shrink-0"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Posting Jurnal Payroll Gaji ({payrollMonth})</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: CETAK SLIP GAJI */}
      {activeSubTab === 'slip_gaji' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Printer className="w-5 h-5 text-indigo-600" />
              Pencetakan Slip Gaji Resmi Guru & SDM Yayasan
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Pilih nama pegawai di bawah untuk meninjau dan mencetak Slip Gaji resmi berstempel dan bertanda tangan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {teachers.map((t) => (
              <div
                key={t.id}
                className="bg-slate-50 hover:bg-indigo-50/50 p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition flex items-center justify-between gap-3 group"
              >
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-indigo-900 transition">
                    {t.name}
                  </h4>
                  <p className="text-xs font-medium text-slate-500">{t.role}</p>
                  <p className="text-xs font-mono font-bold text-emerald-700 mt-1">
                    THP: {formatRupiah(t.netSalary || t.baseSalary)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedSlipTeacher(t);
                    setShowSlipModal(true);
                  }}
                  className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Slip Gaji</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL TAMBAH / EDIT SDM GURU */}
      {showTeacherModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 space-y-6 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h3 className="text-lg font-black text-slate-900">
                {editingTeacher ? 'Edit Data SDM / Guru' : '+ Tambah Pegawai / Guru Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setShowTeacherModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTeacherSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">NIP (Nomor Induk Pegawai) *</label>
                  <input
                    type="text"
                    required
                    value={teacherFormData.nip || ''}
                    onChange={(e) => setTeacherFormData({ ...teacherFormData, nip: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="misal: 198501012010011001"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">NIPY (NIP Yayasan)</label>
                  <input
                    type="text"
                    value={teacherFormData.nipy || ''}
                    onChange={(e) => setTeacherFormData({ ...teacherFormData, nipy: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="misal: YYS-2026-001"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap & Gelar *</label>
                <input
                  type="text"
                  required
                  value={teacherFormData.name || ''}
                  onChange={(e) => setTeacherFormData({ ...teacherFormData, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="misal: Drs. Ahmad Dahlan, M.Pd"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jabatan / Role</label>
                  <select
                    value={teacherFormData.role || 'Guru'}
                    onChange={(e) => setTeacherFormData({ ...teacherFormData, role: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Guru">Guru</option>
                    <option value="Kepala Sekolah">Kepala Sekolah</option>
                    <option value="Bendahara Sekolah">Bendahara Sekolah</option>
                    <option value="Ketua Yayasan">Ketua Yayasan</option>
                    <option value="Pembina Yayasan">Pembina Yayasan</option>
                    <option value="Staf Admin">Staf Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Wali Kelas / Rombel</label>
                  <input
                    type="text"
                    value={teacherFormData.assignedRombel || ''}
                    onChange={(e) => setTeacherFormData({ ...teacherFormData, assignedRombel: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="misal: Kelas 1"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mata Pelajaran</label>
                  <input
                    type="text"
                    value={teacherFormData.subjectTaught || ''}
                    onChange={(e) => setTeacherFormData({ ...teacherFormData, subjectTaught: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="misal: Tematik SD"
                  />
                </div>
              </div>

              {/* Rincian Komponen Gaji */}
              <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-200 space-y-3">
                <p className="font-black text-indigo-900 uppercase text-[11px] tracking-wider">
                  Komponen Struktur Gaji (Rp)
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Gaji Pokok (Rp)</label>
                    <input
                      type="number"
                      value={teacherFormData.baseSalary || 0}
                      onChange={(e) => setTeacherFormData({ ...teacherFormData, baseSalary: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tunjangan Jabatan (Rp)</label>
                    <input
                      type="number"
                      value={teacherFormData.allowance || 0}
                      onChange={(e) => setTeacherFormData({ ...teacherFormData, allowance: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Honor Kepanitiaan (Rp)</label>
                    <input
                      type="number"
                      value={teacherFormData.committeeHonor || 0}
                      onChange={(e) => setTeacherFormData({ ...teacherFormData, committeeHonor: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Potongan BPJS (Rp)</label>
                    <input
                      type="number"
                      value={teacherFormData.bpjs || 0}
                      onChange={(e) => setTeacherFormData({ ...teacherFormData, bpjs: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowTeacherModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl shadow-md transition cursor-pointer"
                >
                  {editingTeacher ? 'Simpan Perubahan' : '+ Tambah Pegawai'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH / EDIT PENGURUS */}
      {showBrdModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 space-y-6 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h3 className="text-lg font-black text-slate-900">
                {editingBoard ? 'Edit Data Pengurus Yayasan' : '+ Tambah Pengurus Yayasan Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setShowBrdModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBoardSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">NIY Pengurus</label>
                  <input
                    type="text"
                    value={brdFormData.niy || ''}
                    onChange={(e) => setBrdFormData({ ...brdFormData, niy: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="NIY.202601"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">NIPY Pengurus</label>
                  <input
                    type="text"
                    value={brdFormData.nipy || ''}
                    onChange={(e) => setBrdFormData({ ...brdFormData, nipy: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="NIPY.202601"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap & Gelar *</label>
                <input
                  type="text"
                  required
                  value={brdFormData.name || ''}
                  onChange={(e) => setBrdFormData({ ...brdFormData, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Drs. H. M. Syukri, M.M"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Jabatan Struktur Yayasan</label>
                <select
                  value={brdFormData.position || 'Pembina Yayasan'}
                  onChange={(e) => setBrdFormData({ ...brdFormData, position: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">No. HP / WhatsApp</label>
                  <input
                    type="text"
                    value={brdFormData.phone || ''}
                    onChange={(e) => setBrdFormData({ ...brdFormData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="081234567890"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Honorarium / Gaji (Rp)</label>
                  <input
                    type="number"
                    value={brdFormData.baseSalary || 0}
                    onChange={(e) => setBrdFormData({ ...brdFormData, baseSalary: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Alamat Lengkap</label>
                <textarea
                  rows={2}
                  value={brdFormData.address || ''}
                  onChange={(e) => setBrdFormData({ ...brdFormData, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Jl. Yayasan No. 10..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowBrdModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl shadow-md transition cursor-pointer"
                >
                  {editingBoard ? 'Simpan Perubahan' : '+ Tambah Pengurus'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH / EDIT SUPPLIER */}
      {showSupModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 space-y-6 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h3 className="text-lg font-black text-slate-900">
                {editingSupplier ? 'Edit Data Supplier Mitra' : '+ Tambah Supplier Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setShowSupModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSupplierSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Perusahaan / Supplier *</label>
                <input
                  type="text"
                  required
                  value={supFormData.name || ''}
                  onChange={(e) => setSupFormData({ ...supFormData, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="PT Penerbit Erlangga"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kategori Produk / Layanan</label>
                <input
                  type="text"
                  value={supFormData.category || ''}
                  onChange={(e) => setSupFormData({ ...supFormData, category: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Buku Pelajaran & Alat Lab"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Contact Person</label>
                <input
                  type="text"
                  value={supFormData.contact || ''}
                  onChange={(e) => setSupFormData({ ...supFormData, contact: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Bpk. Hendra S."
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">No. HP / Telepon Vendor</label>
                <input
                  type="text"
                  value={supFormData.phone || ''}
                  onChange={(e) => setSupFormData({ ...supFormData, phone: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="081234567890"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowSupModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl shadow-md transition cursor-pointer"
                >
                  {editingSupplier ? 'Simpan Perubahan' : '+ Tambah Supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL SLIP GAJI */}
      {showSlipModal && selectedSlipTeacher && (
        <ReceiptModal
          isOpen={showSlipModal}
          onClose={() => setShowSlipModal(false)}
          voucherNo={`SLIP-${selectedSlipTeacher.nip.slice(-4)}-${Date.now().toString().slice(-4)}`}
          date={new Date().toISOString().slice(0, 10)}
          personName={selectedSlipTeacher.name}
          category="GAJI"
          description={`Pembayaran Gaji & Tunjangan ${selectedSlipTeacher.role} (${selectedSlipTeacher.nip}) Periode ${payrollMonth}`}
          amount={selectedSlipTeacher.netSalary || selectedSlipTeacher.baseSalary}
          foundationProfile={foundationProfile}
        />
      )}

      {/* MODAL KONFIRMASI HAPUS DATA */}
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
              Apakah Anda yakin ingin menghapus data <span className="font-extrabold text-slate-900 capitalize">{deleteConfirm.type}</span> yaitu <span className="font-extrabold text-rose-600">{deleteConfirm.name}</span> dari modul Payroll & SDM?
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
                  if (deleteConfirm.type === 'guru') {
                    onDeleteTeacher(deleteConfirm.id);
                  } else if (deleteConfirm.type === 'pengurus' && onDeleteBoardMember) {
                    onDeleteBoardMember(deleteConfirm.id);
                  } else if (deleteConfirm.type === 'supplier' && onDeleteSupplier) {
                    onDeleteSupplier(deleteConfirm.id);
                  }
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
    </div>
  );
};
