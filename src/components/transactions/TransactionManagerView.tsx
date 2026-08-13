import React, { useState, useEffect } from 'react';
import { Account, FoundationProfile, JournalEntry, Student, Teacher } from '../../types';
import { formatRupiah, numberToWordsID, formatDateIndonesian } from '../../utils/formatters';
import {
  Receipt,
  GraduationCap,
  Users,
  Coins,
  FileCheck2,
  PlusCircle,
  Printer,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { ReceiptModal } from '../common/ReceiptModal';

interface TransactionManagerViewProps {
  accounts: Account[];
  journalEntries: JournalEntry[];
  students: Student[];
  teachers: Teacher[];
  onAddJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  onDeleteJournalEntry?: (id: string) => void;
  onUpdateStudentSpp: (studentId: string, status: 'LUNAS' | 'MENUNGGU' | 'TUNGGAKAN') => void;
  onSyncPayrollLiabilities?: () => void;
  foundationProfile?: FoundationProfile;
}

export const TransactionManagerView: React.FC<TransactionManagerViewProps> = ({
  accounts,
  journalEntries,
  students,
  teachers,
  onAddJournalEntry,
  onDeleteJournalEntry,
  onUpdateStudentSpp,
  onSyncPayrollLiabilities,
  foundationProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'spp' | 'bos' | 'payroll' | 'operasional' | 'jurnal'>('spp');

  // Receipt Modal State
  const [receiptData, setReceiptData] = useState<{
    receiptNo: string;
    receivedFrom: string;
    amount: number;
    forPayment: string;
    date: string;
    category: string;
  } | null>(null);

  // Form State SPP
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [sppMonth, setSppMonth] = useState<string>('Juli 2026');
  const [sppAmountInput, setSppAmountInput] = useState<number>(450000);
  const [sppClassFilter, setSppClassFilter] = useState<string>('SEMUA');
  const [sppSearchQuery, setSppSearchQuery] = useState<string>('');

  // Form State BOS
  const [bosType, setBosType] = useState<'penerimaan' | 'pengeluaran'>('penerimaan');
  const [bosAmount, setBosAmount] = useState<number>(150000000);
  const [bosDesc, setBosDesc] = useState<string>('Pencairan Dana BOS Tahap II');
  const [bosAccountCredit, setBosAccountCredit] = useState<string>('5104'); // Beban Belanja BOS / Account
  const [bosCashOrBankCode, setBosCashOrBankCode] = useState<string>('1102'); // Bank Syariah Yayasan

  // Form State Payroll
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(teachers[0]?.id || '');
  const [payrollMonth, setPayrollMonth] = useState<string>('Juli 2026');
  const [payrollPostingMode, setPayrollPostingMode] = useState<'pelunasan' | 'beban_langsung'>('pelunasan');

  // Form State Operasional
  const [opAccount, setOpAccount] = useState<string>('5107'); // Listrik
  const [opAmount, setOpAmount] = useState<number>(3500000);
  const [opDesc, setOpDesc] = useState<string>('Pembayaran Tagihan Listrik PLN Bulan Juli 2026');

  // Form State Manual Jurnal
  const [jrnDate, setJrnDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [jrnVoucher, setJrnVoucher] = useState<string>(`JV/${new Date().getFullYear()}/${(new Date().getMonth()+1).toString().padStart(2, '0')}/${Math.floor(100 + Math.random() * 900)}`);
  const [jrnDesc, setJrnDesc] = useState<string>('');
  const [jrnDebit, setJrnDebit] = useState<string>('1101');
  const [jrnCredit, setJrnCredit] = useState<string>('4102');
  const [jrnAmount, setJrnAmount] = useState<number>(0);

  // Success Alert State
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Delete Confirmation BOS State
  const [deleteBosConfirmation, setDeleteBosConfirmation] = useState<{
    id: string;
    voucherNo: string;
  } | null>(null);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  // Auto-sync selectedStudentId and selectedTeacherId if empty
  useEffect(() => {
    if ((!selectedStudentId || !students.some((s) => s.id === selectedStudentId)) && students.length > 0) {
      setSelectedStudentId(students[0].id);
      setSppAmountInput(students[0].sppAmount || 450000);
    }
  }, [students, selectedStudentId]);

  useEffect(() => {
    if ((!selectedTeacherId || !teachers.some((t) => t.id === selectedTeacherId)) && teachers.length > 0) {
      setSelectedTeacherId(teachers[0].id);
    }
  }, [teachers, selectedTeacherId]);

  // Submit SPP Payment
  const handlePaySpp = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.id === selectedStudentId) || students[0];
    if (!student) {
      alert('Silakan tambahkan data siswa terlebih dahulu.');
      return;
    }

    if (!sppAmountInput || sppAmountInput <= 0) {
      alert('Silakan masukkan nominal pembayaran SPP yang valid (lebih dari 0).');
      return;
    }

    const vNo = `KWT/SPP/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date().toISOString().split('T')[0];

    onAddJournalEntry({
      date: today,
      voucherNo: vNo,
      description: `Pembayaran SPP ${sppMonth} - ${student.name} (${student.gradeClass})`,
      categoryTag: 'SPP',
      debitAccountCode: '1101', // Kas Operasional
      debitAccountName: 'Kas Operasional',
      creditAccountCode: '4102', // Pendapatan SPP Bulanan
      creditAccountName: 'Pendapatan SPP Bulanan',
      amount: Number(sppAmountInput),
      studentId: student.id,
      notes: `Kuitansi Resmi SPP Siswa NIS: ${student.nis}`,
    });

    onUpdateStudentSpp(student.id, 'LUNAS');

    setReceiptData({
      receiptNo: vNo,
      receivedFrom: student.name,
      amount: Number(sppAmountInput),
      forPayment: `Pembayaran SPP Bulan ${sppMonth} (Kelas ${student.gradeClass} - NIS ${student.nis})`,
      date: today,
      category: 'SPP SISWA',
    });

    showSuccess(`Pembayaran SPP ${student.name} sebesar ${formatRupiah(Number(sppAmountInput))} berhasil dicatat & kuitansi terbit!`);
  };

  // Submit BOS Transaction
  const handleBosSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bosAmount || bosAmount <= 0) {
      alert('Silakan masukkan nominal transaksi BOS yang valid (lebih besar dari 0).');
      return;
    }

    if (!bosDesc || !bosDesc.trim()) {
      alert('Silakan isi uraian/keterangan transaksi Dana BOS.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const vNo = `JV/BOS/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`;
    const selectedCashAcc = accounts.find((a) => a.code === bosCashOrBankCode);

    if (bosType === 'penerimaan') {
      onAddJournalEntry({
        date: today,
        voucherNo: vNo,
        description: bosDesc,
        categoryTag: 'BOS',
        debitAccountCode: bosCashOrBankCode,
        debitAccountName: selectedCashAcc?.name || 'Bank Syariah Yayasan',
        creditAccountCode: '4101', // Pendapatan BOS
        creditAccountName: 'Pendapatan Dana BOS',
        amount: Number(bosAmount),
        notes: 'Penerimaan Alokasi Dana BOS Kementerian Pendidikan',
      });

      setReceiptData({
        receiptNo: vNo,
        receivedFrom: 'Kementerian Pendidikan / Kas Negara',
        amount: Number(bosAmount),
        forPayment: `Pencairan ${bosDesc}`,
        date: today,
        category: 'DANA BOS - PENERIMAAN',
      });
    } else {
      const expenseAcc = accounts.find((a) => a.code === bosAccountCredit);
      onAddJournalEntry({
        date: today,
        voucherNo: vNo,
        description: bosDesc,
        categoryTag: 'BOS',
        debitAccountCode: bosAccountCredit,
        debitAccountName: expenseAcc?.name || 'Beban Operasional BOS',
        creditAccountCode: bosCashOrBankCode,
        creditAccountName: selectedCashAcc?.name || 'Bank Syariah Yayasan',
        amount: Number(bosAmount),
        notes: 'Pengeluaran Alokasi Dana BOS (Dengan Pembatasan)',
      });

      setReceiptData({
        receiptNo: vNo,
        receivedFrom: 'Bendahara BOS',
        amount: Number(bosAmount),
        forPayment: `Pengeluaran ${bosDesc}`,
        date: today,
        category: 'DANA BOS - BELANJA',
      });
    }

    showSuccess(`Transaksi Dana BOS "${bosDesc}" sejumlah ${formatRupiah(Number(bosAmount))} berhasil dicatat & disimpan!`);
  };

  // Submit Payroll
  const handlePayrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const teacher = teachers.find((t) => t.id === selectedTeacherId);
    if (!teacher) return;

    const today = new Date().toISOString().split('T')[0];
    const vNo = `PAY/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`;

    let debitCode = '2101';
    let debitName = 'Hutang Gaji Guru';

    if (payrollPostingMode === 'pelunasan') {
      if (teacher.role === 'Kepala Sekolah') {
        debitCode = '2102';
        debitName = 'Hutang Gaji Kepala Sekolah';
      } else {
        debitCode = '2101';
        debitName = 'Hutang Gaji Guru';
      }
    } else {
      if (teacher.role === 'Kepala Sekolah') {
        debitCode = '5102';
        debitName = 'Beban Gaji Kepala Sekolah';
      } else if (teacher.role === 'Ketua Yayasan') {
        debitCode = '5103';
        debitName = 'Beban Honorarium Pengurus Yayasan';
      } else {
        debitCode = '5101';
        debitName = 'Beban Gaji Guru';
      }
    }

    onAddJournalEntry({
      date: today,
      voucherNo: vNo,
      description: `Pembayaran ${payrollPostingMode === 'pelunasan' ? 'Pelunasan Hutang' : 'Beban'} Gaji ${teacher.role} - ${teacher.name} (${payrollMonth})`,
      categoryTag: 'GAJI',
      debitAccountCode: debitCode,
      debitAccountName: debitName,
      creditAccountCode: '1102', // Bank Syariah
      creditAccountName: 'Bank Syariah Yayasan',
      amount: teacher.netSalary,
      teacherId: teacher.id,
      notes: `Potongan PPh 21: ${formatRupiah(teacher.pph21)}, BPJS: ${formatRupiah(teacher.bpjs)}`,
    });

    setReceiptData({
      receiptNo: vNo,
      receivedFrom: teacher.name,
      amount: teacher.netSalary,
      forPayment: `Slip Gaji & Honorarium ${teacher.role} Bulan ${payrollMonth} (NIPY: ${teacher.nip})`,
      date: today,
      category: 'SLIP GAJI GURU & STAF',
    });

    showSuccess(
      `Penggajian ${teacher.name} sebesar ${formatRupiah(teacher.netSalary)} telah diposting (${
        payrollPostingMode === 'pelunasan' ? 'Mengurangi ' + debitName + ' [' + debitCode + ']' : 'Posting ' + debitName
      })!`
    );
  };

  // Submit Operasional Expense
  const handleOpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    const vNo = `EXP/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`;

    const acc = accounts.find((a) => a.code === opAccount);

    onAddJournalEntry({
      date: today,
      voucherNo: vNo,
      description: opDesc,
      categoryTag: 'OPERASIONAL',
      debitAccountCode: opAccount,
      debitAccountName: acc?.name || 'Beban Operasional',
      creditAccountCode: '1101', // Kas Operasional
      creditAccountName: 'Kas Operasional',
      amount: opAmount,
    });

    showSuccess(`Pengeluaran "${opDesc}" sebesar ${formatRupiah(opAmount)} berhasil dicatat!`);
  };

  // Submit Manual Journal
  const handleManualJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (jrnAmount <= 0) return;

    const debitAcc = accounts.find((a) => a.code === jrnDebit);
    const creditAcc = accounts.find((a) => a.code === jrnCredit);

    onAddJournalEntry({
      date: jrnDate,
      voucherNo: jrnVoucher,
      description: jrnDesc,
      categoryTag: 'UMUM',
      debitAccountCode: jrnDebit,
      debitAccountName: debitAcc?.name || '',
      creditAccountCode: jrnCredit,
      creditAccountName: creditAcc?.name || '',
      amount: jrnAmount,
    });

    showSuccess(`Jurnal Umum ${jrnVoucher} berhasil diposting!`);
    setJrnDesc('');
    setJrnAmount(0);
  };

  return (
    <div className="space-y-6">
      
      {/* Alert Notification */}
      {successMsg && (
        <div className="p-4 bg-emerald-600 text-white rounded-xl shadow-lg flex items-center justify-between transition">
          <div className="flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 className="w-5 h-5" />
            <span>{successMsg}</span>
          </div>
          <button
            onClick={() => setSuccessMsg(null)}
            className="text-xs font-semibold px-2 py-1 bg-emerald-700 hover:bg-emerald-800 rounded-md"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Mode Navigation Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('spp')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'spp'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>POS Pembayaran SPP Siswa</span>
        </button>

        <button
          onClick={() => setActiveTab('bos')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'bos'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>Pencairan / Penggunaan Dana BOS</span>
        </button>

        <button
          onClick={() => setActiveTab('payroll')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'payroll'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Penggajian (Payroll) Guru & Staf</span>
        </button>

        <button
          onClick={() => setActiveTab('operasional')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'operasional'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Beban Operasional & Tagihan</span>
        </button>

        <button
          onClick={() => setActiveTab('jurnal')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'jurnal'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Jurnal Umum Manual</span>
        </button>
      </div>

      {/* TAB 1: POS SPP SISWA */}
      {activeTab === 'spp' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Receipt className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="font-bold text-slate-900 text-base">Kasir POS Pembayaran SPP & Uang Pangkal</h3>
                <p className="text-xs text-slate-500">Pilih siswa, masukan nominal, dan cetak kuitansi resmi yayasan</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-black text-slate-700">Filter Per Kelas:</span>
                <div className="flex flex-wrap gap-1.5">
                  {['SEMUA', 'Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'].map((cls) => (
                    <button
                      type="button"
                      key={cls}
                      onClick={() => setSppClassFilter(cls)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold transition cursor-pointer ${
                        sppClassFilter === cls
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari berdasarkan nama siswa, NIS, atau NISN..."
                  value={sppSearchQuery}
                  onChange={(e) => setSppSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500 shadow-2xs"
                />
              </div>
            </div>

            <form onSubmit={handlePaySpp} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pilih Siswa ({sppClassFilter === 'SEMUA' ? 'Semua Kelas' : sppClassFilter})
                  </label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => {
                      setSelectedStudentId(e.target.value);
                      const std = students.find((s) => s.id === e.target.value);
                      if (std) setSppAmountInput(std.sppAmount);
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-emerald-500"
                  >
                    {students
                      .filter((s) => {
                        const matchesClass = sppClassFilter === 'SEMUA' || s.gradeClass.toLowerCase().includes(sppClassFilter.toLowerCase());
                        const q = sppSearchQuery.toLowerCase().trim();
                        const matchesSearch = !q || s.name.toLowerCase().includes(q) || s.nis.includes(q) || (s.nisn && s.nisn.includes(q));
                        return matchesClass && matchesSearch;
                      })
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.gradeClass}) - NIS: {s.nis} [{s.sppStatus}]
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bulan SPP</label>
                  <input
                    type="text"
                    value={sppMonth}
                    onChange={(e) => setSppMonth(e.target.value)}
                    placeholder="Contoh: Juli 2026"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nominal Pembayaran (Rp)</label>
                  <input
                    type="number"
                    value={sppAmountInput}
                    onChange={(e) => setSppAmountInput(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Terbilang Rupiah</label>
                  <div className="p-2 bg-slate-100 rounded-xl text-xs text-slate-600 font-medium italic truncate">
                    {numberToWordsID(sppAmountInput)}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 text-xs text-emerald-900">
                <div className="flex justify-between font-bold">
                  <span>Posting Jurnal Otomatis:</span>
                  <span className="font-mono">DEBIT: 1101 (Kas) | KREDIT: 4102 (Pendapatan SPP)</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs shadow-lg transition flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Bayar & Cetak Kuitansi Resmi</span>
              </button>
            </form>
          </div>

          {/* List Status SPP Siswa */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="font-bold text-slate-900 text-sm">
                Status SPP Siswa (T.A. 2026)
              </h4>
              <span className="text-[10px] text-slate-400 font-medium">Klik icon printer untuk cetak</span>
            </div>

            <div className="space-y-3 divide-y divide-slate-100 max-h-96 overflow-y-auto pr-1">
              {students.map((s) => (
                <div key={s.id} className="pt-2.5 flex items-center justify-between text-xs gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900 truncate">{s.name}</p>
                    <p className="text-[11px] text-slate-500">{s.gradeClass} &bull; {formatRupiah(s.sppAmount)}/bln</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        s.sppStatus === 'LUNAS'
                          ? 'bg-emerald-100 text-emerald-800'
                          : s.sppStatus === 'TUNGGAKAN'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {s.sppStatus}
                    </span>
                    <button
                      onClick={() => {
                        setReceiptData({
                          receiptNo: `KWT/SPP/2026/${Math.floor(1000 + Math.random() * 9000)}`,
                          receivedFrom: s.name,
                          amount: s.sppAmount,
                          forPayment: `Pembayaran SPP Bulan Juli 2026 (Kelas ${s.gradeClass} - NIS: ${s.nis})`,
                          date: new Date().toISOString().split('T')[0],
                          category: 'SPP SISWA',
                        });
                      }}
                      className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold transition flex items-center gap-1"
                      title={`Cetak Kuitansi SPP ${s.name}`}
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Cetak</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DANA BOS */}
      {activeTab === 'bos' && (
        <div className="space-y-6">
          {/* Summary Stat Cards BOS */}
          {(() => {
            const bosEntries = journalEntries.filter(
              (j) =>
                j.categoryTag === 'BOS' ||
                j.debitAccountCode === '4101' ||
                j.creditAccountCode === '4101' ||
                (j.notes && j.notes.toLowerCase().includes('bos')) ||
                (j.description && j.description.toLowerCase().includes('bos'))
            );

            const totalIn = bosEntries
              .filter((j) => j.creditAccountCode === '4101' || j.description.toLowerCase().includes('pencairan'))
              .reduce((sum, j) => sum + j.amount, 0);

            const totalOut = bosEntries
              .filter((j) => j.debitAccountCode !== '4101' && !j.description.toLowerCase().includes('pencairan'))
              .reduce((sum, j) => sum + j.amount, 0);

            const sisaBos = totalIn - totalOut;

            return (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                    <p className="text-xs font-bold text-slate-500">Total Pencairan Dana BOS</p>
                    <p className="text-xl font-black text-slate-900">{formatRupiah(totalIn)}</p>
                    <p className="text-[11px] text-emerald-600 font-bold">Terposting ke Laporan Aktivitas</p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                    <p className="text-xs font-bold text-slate-500">Total Pengeluaran Belanja BOS</p>
                    <p className="text-xl font-black text-rose-600">{formatRupiah(totalOut)}</p>
                    <p className="text-[11px] text-rose-700 font-bold">Realisasi Operasional & ARKAS</p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                    <p className="text-xs font-bold text-slate-500">Sisa Kas / Bank BOS Tersedia</p>
                    <p className="text-xl font-black text-emerald-600">{formatRupiah(sisaBos)}</p>
                    <p className="text-[11px] text-slate-500 font-mono">Saldo Kas / Bank Syariah</p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                    <p className="text-xs font-bold text-slate-500">Status Sinkronisasi Laporan</p>
                    <div className="flex items-center gap-1.5 pt-1 text-emerald-600 font-black text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>100% Terintegrasi ISAK 35</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Otomatis update Neraca & CALK</p>
                  </div>
                </div>

                {/* Form Input Transaksi BOS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                      <Coins className="w-5 h-5 text-emerald-600" />
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">Input Transaksi Dana BOS</h3>
                        <p className="text-xs text-slate-500">Pencairan & Belanja Dana BOS Kemdikbud</p>
                      </div>
                    </div>

                    <form onSubmit={handleBosSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Jenis Transaksi BOS</label>
                        <select
                          value={bosType}
                          onChange={(e) => setBosType(e.target.value as any)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                        >
                          <option value="penerimaan">Penerimaan Pencairan Dana BOS (Pendapatan)</option>
                          <option value="pengeluaran">Pengeluaran Operasional / Belanja BOS</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Rekening Kas / Bank BOS</label>
                        <select
                          value={bosCashOrBankCode}
                          onChange={(e) => setBosCashOrBankCode(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                        >
                          {accounts
                            .filter((a) => a.category === 'ASET_LANCAR')
                            .map((a) => (
                              <option key={a.code} value={a.code}>
                                {a.code} - {a.name} ({formatRupiah(a.balance)})
                              </option>
                            ))}
                        </select>
                      </div>

                      {bosType === 'pengeluaran' && (
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Pos Beban Belanja BOS</label>
                          <select
                            value={bosAccountCredit}
                            onChange={(e) => setBosAccountCredit(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                          >
                            {accounts
                              .filter((a) => a.category === 'BEBAN')
                              .map((a) => (
                                <option key={a.code} value={a.code}>
                                  {a.code} - {a.name}
                                </option>
                              ))}
                          </select>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Keterangan Transaksi</label>
                        <input
                          type="text"
                          value={bosDesc}
                          onChange={(e) => setBosDesc(e.target.value)}
                          placeholder="Contoh: Pencairan Dana BOS Tahap II / Pembelian Buku Pelajaran"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 font-medium"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Nominal Transaksi (Rp)</label>
                        <input
                          type="number"
                          value={bosAmount || ''}
                          onChange={(e) => setBosAmount(Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-black text-slate-900 focus:outline-none focus:border-emerald-500"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs shadow-lg transition cursor-pointer"
                      >
                        Simpan Transaksi Dana BOS
                      </button>
                    </form>
                  </div>

                  {/* Table Riwayat Transaksi BOS */}
                  <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-base">Riwayat Transaksi Dana BOS & Laporan</h3>
                        <p className="text-xs text-slate-500">Tercatat {bosEntries.length} transaksi pencairan & pengeluaran BOS</p>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full">
                        ISAK 35 Real-Time
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                        <thead className="bg-slate-100 font-extrabold text-slate-800 uppercase tracking-wider">
                          <tr>
                            <th className="p-3 border-b border-slate-200">Tanggal</th>
                            <th className="p-3 border-b border-slate-200">No. Voucher</th>
                            <th className="p-3 border-b border-slate-200">Uraian Transaksi</th>
                            <th className="p-3 border-b border-slate-200 text-right">Nominal (Rp)</th>
                            <th className="p-3 border-b border-slate-200 text-center">Aksi / Kuitansi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {bosEntries.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="p-8 text-center text-slate-400 italic">
                                Belum ada riwayat transaksi Dana BOS terposting.
                              </td>
                            </tr>
                          ) : (
                            bosEntries.map((entry) => {
                              const isIn = entry.creditAccountCode === '4101' || entry.description.toLowerCase().includes('pencairan');
                              return (
                                <tr key={entry.id} className="hover:bg-slate-50 transition">
                                  <td className="p-3 text-slate-600 font-mono font-bold">{formatDateIndonesian(entry.date)}</td>
                                  <td className="p-3 font-mono font-extrabold text-slate-900">{entry.voucherNo}</td>
                                  <td className="p-3 font-semibold text-slate-900">
                                    <p>{entry.description}</p>
                                    <span
                                      className={`inline-block mt-0.5 px-2 py-0.2 text-[9px] font-extrabold rounded-full ${
                                        isIn ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                      }`}
                                    >
                                      {isIn ? 'PENERIMAAN / PENCAIRAN' : 'PENGELUARAN / BELANJA'}
                                    </span>
                                  </td>
                                  <td className={`p-3 text-right font-mono font-black ${isIn ? 'text-emerald-700' : 'text-rose-700'}`}>
                                    {formatRupiah(entry.amount)}
                                  </td>
                                  <td className="p-3 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                      <button
                                        onClick={() =>
                                          setReceiptData({
                                            receiptNo: entry.voucherNo,
                                            receivedFrom: isIn ? 'Kementerian Pendidikan / Kas Negara' : 'Bendahara BOS',
                                            amount: entry.amount,
                                            forPayment: entry.description,
                                            date: entry.date,
                                            category: isIn ? 'DANA BOS - PENERIMAAN' : 'DANA BOS - BELANJA',
                                          })
                                        }
                                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition"
                                      >
                                        <Printer className="w-3 h-3 text-emerald-400" />
                                        <span>Kuitansi</span>
                                      </button>
                                      {onDeleteJournalEntry && (
                                        <button
                                          onClick={() => setDeleteBosConfirmation({ id: entry.id, voucherNo: entry.voucherNo })}
                                          className="p-1 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg transition cursor-pointer"
                                          title="Hapus Transaksi BOS"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
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
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 3: PAYROLL GURU */}
      {activeTab === 'payroll' && (
        <div className="space-y-6">
          {/* Panel Sinkronisasi Kewajiban Hutang Gaji (ISAK 35) */}
          {(() => {
            const totalGuruNet = teachers
              .filter((t) => t.role !== 'Kepala Sekolah')
              .reduce((sum, t) => sum + (t.netSalary || 0), 0);
            const totalKepsekNet = teachers
              .filter((t) => t.role === 'Kepala Sekolah')
              .reduce((sum, t) => sum + (t.netSalary || 0), 0);
            const totalPph21 = teachers.reduce((sum, t) => sum + (t.pph21 || 0), 0);
            const totalBpjs = teachers.reduce((sum, t) => sum + (t.bpjs || 0), 0);

            const acc2101 = accounts.find((a) => a.code === '2101');
            const acc2102 = accounts.find((a) => a.code === '2102');
            const acc2103 = accounts.find((a) => a.code === '2103');
            const acc2104 = accounts.find((a) => a.code === '2104');

            const isSynced =
              acc2101?.balance === totalGuruNet &&
              acc2102?.balance === totalKepsekNet &&
              acc2103?.balance === totalPph21 &&
              acc2104?.balance === totalBpjs;

            return (
              <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-md space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <Coins className="w-5 h-5 text-emerald-400" />
                    <div>
                      <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                        <span>Sinkronisasi Kewajiban Hutang Gaji Jangka Pendek (ISAK 35)</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            isSynced
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {isSynced ? '✓ SINKRON 100%' : '⚠ BELUM SINKRON'}
                        </span>
                      </h4>
                      <p className="text-xs text-slate-400">
                        Memastikan saldo akun Kewajiban Jangka Pendek (2101-2104) di Posisi Keuangan persis sama dengan total gaji & potongan di Data Master Guru.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (onSyncPayrollLiabilities) onSyncPayrollLiabilities();
                      showSuccess('Kewajiban Hutang Gaji & Potongan PPh/BPJS telah disinkronkan ke Neraca!');
                    }}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow transition flex items-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Sinkronkan Kewajiban Sekarang</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">
                      2101 - Hutang Gaji Guru
                    </span>
                    <div className="flex justify-between items-baseline font-mono">
                      <span className="text-slate-400 text-[11px]">Neraca:</span>
                      <span className="font-bold text-white">{formatRupiah(acc2101?.balance || 0)}</span>
                    </div>
                    <div className="flex justify-between items-baseline font-mono text-[11px] border-t border-slate-700/50 pt-1 text-emerald-400">
                      <span>Target Master:</span>
                      <span>{formatRupiah(totalGuruNet)}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">
                      2102 - Hutang Gaji Kepsek
                    </span>
                    <div className="flex justify-between items-baseline font-mono">
                      <span className="text-slate-400 text-[11px]">Neraca:</span>
                      <span className="font-bold text-white">{formatRupiah(acc2102?.balance || 0)}</span>
                    </div>
                    <div className="flex justify-between items-baseline font-mono text-[11px] border-t border-slate-700/50 pt-1 text-emerald-400">
                      <span>Target Master:</span>
                      <span>{formatRupiah(totalKepsekNet)}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">
                      2103 - Hutang Pajak PPh 21
                    </span>
                    <div className="flex justify-between items-baseline font-mono">
                      <span className="text-slate-400 text-[11px]">Neraca:</span>
                      <span className="font-bold text-white">{formatRupiah(acc2103?.balance || 0)}</span>
                    </div>
                    <div className="flex justify-between items-baseline font-mono text-[11px] border-t border-slate-700/50 pt-1 text-amber-400">
                      <span>Target Master:</span>
                      <span>{formatRupiah(totalPph21)}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">
                      2104 - Hutang BPJS
                    </span>
                    <div className="flex justify-between items-baseline font-mono">
                      <span className="text-slate-400 text-[11px]">Neraca:</span>
                      <span className="font-bold text-white">{formatRupiah(acc2104?.balance || 0)}</span>
                    </div>
                    <div className="flex justify-between items-baseline font-mono text-[11px] border-t border-slate-700/50 pt-1 text-amber-400">
                      <span>Target Master:</span>
                      <span>{formatRupiah(totalBpjs)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Users className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Penggajian (Payroll) Guru & Kepala Sekolah</h3>
                  <p className="text-xs text-slate-500">Hitung Gaji Pokok, Tunjangan, PPh 21, dan BPJS Ketenagakerjaan</p>
                </div>
              </div>

              <form onSubmit={handlePayrollSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Pilih Guru / Pengurus</label>
                    <select
                      value={selectedTeacherId}
                      onChange={(e) => setSelectedTeacherId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-500"
                    >
                      {teachers.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.role})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Periode Bulan Gaji</label>
                    <input
                      type="text"
                      value={payrollMonth}
                      onChange={(e) => setPayrollMonth(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mode Posting Jurnal Keuangan</label>
                  <select
                    value={payrollPostingMode}
                    onChange={(e) => setPayrollPostingMode(e.target.value as 'pelunasan' | 'beban_langsung')}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="pelunasan">
                      Pelunasan Kewajiban Hutang Gaji (DEBIT: 2101 / 2102 - Hutang Gaji, KREDIT: 1102 - Bank Syariah) [ISAK 35]
                    </option>
                    <option value="beban_langsung">
                      Pengakuan Beban Gaji Langsung (DEBIT: 5101 / 5102 - Beban SDM, KREDIT: 1102 - Bank Syariah)
                    </option>
                  </select>
                </div>

                {/* Detail Component Payroll */}
                {(() => {
                  const teacher = teachers.find((t) => t.id === selectedTeacherId);
                  if (!teacher) return null;
                  return (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                      <div className="flex justify-between text-slate-700">
                        <span>Gaji Pokok:</span>
                        <span className="font-mono">{formatRupiah(teacher.baseSalary)}</span>
                      </div>
                      <div className="flex justify-between text-slate-700">
                        <span>Tunjangan Jabatan:</span>
                        <span className="font-mono">{formatRupiah(teacher.allowance)}</span>
                      </div>
                      <div className="flex justify-between text-rose-600">
                        <span>Potongan Pajak PPh 21:</span>
                        <span className="font-mono">({formatRupiah(teacher.pph21)})</span>
                      </div>
                      <div className="flex justify-between text-rose-600">
                        <span>Potongan BPJS Ketenagakerjaan:</span>
                        <span className="font-mono">({formatRupiah(teacher.bpjs)})</span>
                      </div>
                      <div className="flex justify-between font-black text-sm pt-2 border-t border-slate-300 text-slate-900">
                        <span>Gaji Bersih (Take Home Pay):</span>
                        <span className="font-mono text-emerald-700">{formatRupiah(teacher.netSalary)}</span>
                      </div>
                    </div>
                  );
                })()}

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Posting Payroll & Cetak Slip Gaji</span>
                </button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <h4 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
                Daftar Gaji Pendidik
              </h4>
              <div className="space-y-3 divide-y divide-slate-100">
                {teachers.map((t) => (
                  <div key={t.id} className="pt-2 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{t.name}</p>
                      <p className="text-[11px] text-slate-500">{t.role}</p>
                    </div>
                    <span className="font-mono font-bold text-slate-900">{formatRupiah(t.netSalary)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: OPERASIONAL */}
      {activeTab === 'operasional' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5 max-w-2xl">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="font-bold text-slate-900 text-base">Pengeluaran Operasional & Tagihan</h3>
              <p className="text-xs text-slate-500">Bayar Listrik PLN, Air PDAM, Internet, Keamanan, & ATK</p>
            </div>
          </div>

          <form onSubmit={handleOpSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Pilih Akun Beban</label>
              <select
                value={opAccount}
                onChange={(e) => setOpAccount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
              >
                {accounts
                  .filter((a) => a.category === 'BEBAN')
                  .map((a) => (
                    <option key={a.code} value={a.code}>
                      {a.code} - {a.name} ({a.subCategory})
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Keterangan / Deskripsi</label>
              <input
                type="text"
                value={opDesc}
                onChange={(e) => setOpDesc(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Jumlah Pengeluaran (Rp)</label>
              <input
                type="number"
                value={opAmount}
                onChange={(e) => setOpAmount(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs shadow-lg transition"
            >
              Catat Pengeluaran Operasional
            </button>
          </form>
        </div>
      )}

      {/* TAB 5: JURNAL UMUM MANUAL */}
      {activeTab === 'jurnal' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5 max-w-3xl">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileText className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="font-bold text-slate-900 text-base">Entry Jurnal Umum Manual (Double Entry)</h3>
              <p className="text-xs text-slate-500">Post debit & credit balance directly to Chart of Accounts</p>
            </div>
          </div>

          <form onSubmit={handleManualJournal} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Jurnal</label>
                <input
                  type="date"
                  value={jrnDate}
                  onChange={(e) => setJrnDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">No. Voucher Jurnal</label>
                <input
                  type="text"
                  value={jrnVoucher}
                  onChange={(e) => setJrnVoucher(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Keterangan Transaksi</label>
              <input
                type="text"
                value={jrnDesc}
                onChange={(e) => setJrnDesc(e.target.value)}
                placeholder="Contoh: Penerimaan Donasi Alumni untuk Renovasi Lab"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Akun DEBET</label>
                <select
                  value={jrnDebit}
                  onChange={(e) => setJrnDebit(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-500"
                >
                  {accounts.map((a) => (
                    <option key={a.code} value={a.code}>
                      [Debet] {a.code} - {a.name} ({a.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Akun KREDIT</label>
                <select
                  value={jrnCredit}
                  onChange={(e) => setJrnCredit(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-500"
                >
                  {accounts.map((a) => (
                    <option key={a.code} value={a.code}>
                      [Kredit] {a.code} - {a.name} ({a.category})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nominal Transaksi (Rp)</label>
              <input
                type="number"
                value={jrnAmount}
                onChange={(e) => setJrnAmount(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs shadow-lg transition"
            >
              Posting Jurnal Ke BKU & Ledger
            </button>
          </form>
        </div>
      )}

      {/* Modal Kuitansi / Proof of Payment */}
      {receiptData && (
        <ReceiptModal
          receiptNo={receiptData.receiptNo}
          receivedFrom={receiptData.receivedFrom}
          amount={receiptData.amount}
          forPayment={receiptData.forPayment}
          date={receiptData.date}
          category={receiptData.category}
          foundationProfile={foundationProfile}
          onClose={() => setReceiptData(null)}
        />
      )}

      {/* Modal Delete Confirmation BOS */}
      {deleteBosConfirmation && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600 border-b border-slate-100 pb-3">
              <div className="p-3 bg-rose-100 rounded-2xl">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Hapus Transaksi BOS</h3>
                <p className="text-xs text-slate-500">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
              <p className="font-bold text-slate-900 text-sm">Yakin hapus transaksi {deleteBosConfirmation.voucherNo}?</p>
              <p className="text-xs text-slate-600 font-medium">Transaksi akan dihapus dari BKU & Buku Besar BOS serta saldo kas/bank akan dikembalikan.</p>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteBosConfirmation(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeleteJournalEntry) {
                    onDeleteJournalEntry(deleteBosConfirmation.id);
                  }
                  setDeleteBosConfirmation(null);
                }}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold rounded-xl text-xs shadow-lg transition cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Ya, Hapus Transaksi</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
