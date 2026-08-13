import React, { useState } from 'react';
import { Account, JournalEntry } from '../../types';
import { formatRupiah, formatDateIndonesian } from '../../utils/formatters';
import { printDocument } from '../../utils/printHelper';
import {
  BookOpenCheck,
  Search,
  PlusCircle,
  Edit3,
  Trash2,
  Printer,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  CheckCircle2,
  X,
  FileSpreadsheet
} from 'lucide-react';

interface CoaAndLedgerViewProps {
  accounts: Account[];
  journalEntries: JournalEntry[];
  onAddAccount: (account: Account) => void;
  onUpdateAccount?: (code: string, updatedData: Partial<Account>) => void;
  onDeleteAccount?: (code: string) => void;
  onAddJournalEntry?: (entry: Omit<JournalEntry, 'id'>) => void;
  onUpdateJournalEntry?: (id: string, entry: Partial<JournalEntry>) => void;
  onDeleteJournalEntry?: (id: string) => void;
}

export const CoaAndLedgerView: React.FC<CoaAndLedgerViewProps> = ({
  accounts,
  journalEntries,
  onAddAccount,
  onUpdateAccount,
  onDeleteAccount,
  onAddJournalEntry,
  onUpdateJournalEntry,
  onDeleteJournalEntry,
}) => {
  const [activeTab, setActiveTab] = useState<'coa' | 'ledger'>('coa');
  const [selectedAccountCode, setSelectedAccountCode] = useState<string>(accounts[0]?.code || '1101');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal State Add Account
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newCode, setNewCode] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [newCategory, setNewCategory] = useState<Account['category']>('ASET_LANCAR');
  const [newSubCategory, setNewSubCategory] = useState<string>('Kas & Bank');
  const [newInitialBalance, setNewInitialBalance] = useState<number>(0);

  // Modal State Edit Account (Khusus Aset Lancar & COA)
  const [showEditAccountModal, setShowEditAccountModal] = useState<boolean>(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [editCategory, setEditCategory] = useState<Account['category']>('ASET_LANCAR');
  const [editSubCategory, setEditSubCategory] = useState<string>('');
  const [editBalance, setEditBalance] = useState<number>(0);

  // Modal State Direct Ledger Transaction Entry / Adjustment
  const [showAddLedgerEntryModal, setShowAddLedgerEntryModal] = useState<boolean>(false);
  const [ledgerTxType, setLedgerTxType] = useState<'DEBIT' | 'KREDIT'>('DEBIT');
  const [ledgerTxDate, setLedgerTxDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [ledgerTxVoucher, setLedgerTxVoucher] = useState<string>(`JV/AL/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`);
  const [ledgerTxDesc, setLedgerTxDesc] = useState<string>('');
  const [ledgerTxAmount, setLedgerTxAmount] = useState<number>(0);
  const [ledgerOppositeAccount, setLedgerOppositeAccount] = useState<string>('1101');

  // Modal State Edit Journal Entry
  const [showEditJournalModal, setShowEditJournalModal] = useState<boolean>(false);
  const [editingJournal, setEditingJournal] = useState<JournalEntry | null>(null);
  const [editJournalDate, setEditJournalDate] = useState<string>('');
  const [editJournalVoucher, setEditJournalVoucher] = useState<string>('');
  const [editJournalDesc, setEditJournalDesc] = useState<string>('');
  const [editJournalAmount, setEditJournalAmount] = useState<number>(0);

  // Modal State Delete Confirmation
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    type: 'ACCOUNT' | 'JOURNAL';
    idOrCode: string;
    title: string;
    subtitle: string;
  } | null>(null);

  // Filter COA
  const filteredAccounts = accounts.filter((a) => {
    const matchesCategory = filterCategory === 'ALL' || a.category === filterCategory;
    const matchesSearch =
      a.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Selected Account in Ledger
  const selectedAccount = accounts.find((a) => a.code === selectedAccountCode) || accounts[0];
  const ledgerTransactions = journalEntries.filter(
    (e) => e.debitAccountCode === selectedAccountCode || e.creditAccountCode === selectedAccountCode
  );

  // General Ledger Calculations (Saldo Awal, Mutasi Debet, Mutasi Kredit, Running Balance)
  const isDebitNormal = selectedAccount
    ? selectedAccount.category === 'ASET_LANCAR' ||
      selectedAccount.category === 'ASET_TETAP' ||
      selectedAccount.category === 'BEBAN'
    : true;

  const totalLedgerDebit = ledgerTransactions
    .filter((e) => e.debitAccountCode === selectedAccountCode)
    .reduce((sum, e) => sum + e.amount, 0);

  const totalLedgerCredit = ledgerTransactions
    .filter((e) => e.creditAccountCode === selectedAccountCode)
    .reduce((sum, e) => sum + e.amount, 0);

  const currentAccountBalance = selectedAccount?.balance || 0;
  const initialOpeningBalance = isDebitNormal
    ? currentAccountBalance - totalLedgerDebit + totalLedgerCredit
    : currentAccountBalance - totalLedgerCredit + totalLedgerDebit;

  // Handler Submit Add Account
  const handleAddAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newName) return;

    onAddAccount({
      code: newCode,
      name: newName,
      category: newCategory,
      subCategory: newSubCategory,
      balance: Number(newInitialBalance) || 0,
    });

    setShowAddModal(false);
    setNewCode('');
    setNewName('');
    setNewInitialBalance(0);
  };

  // Open Edit Account Modal
  const handleOpenEditAccount = (acc: Account) => {
    setEditingAccount(acc);
    setEditName(acc.name);
    setEditCategory(acc.category);
    setEditSubCategory(acc.subCategory || '');
    setEditBalance(acc.balance);
    setShowEditAccountModal(true);
  };

  // Submit Edit Account
  const handleEditAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAccount) return;

    if (onUpdateAccount) {
      onUpdateAccount(editingAccount.code, {
        name: editName,
        category: editCategory,
        subCategory: editSubCategory,
        balance: Number(editBalance),
      });
    }

    setShowEditAccountModal(false);
    setEditingAccount(null);
  };

  // Open Direct Ledger Transaction Modal
  const handleOpenAddLedgerEntry = () => {
    setLedgerTxVoucher(`JV/${selectedAccount?.code || '1101'}/${Math.floor(1000 + Math.random() * 9000)}`);
    setLedgerTxDesc(`Penyesuaian / Transaksi Buku Besar ${selectedAccount?.name || ''}`);
    setLedgerTxAmount(0);
    // Find default opposite account
    const defaultOpposite = accounts.find((a) => a.code !== selectedAccountCode)?.code || '3101';
    setLedgerOppositeAccount(defaultOpposite);
    setShowAddLedgerEntryModal(true);
  };

  // Submit Direct Ledger Transaction Entry
  const handleAddLedgerEntrySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccount || !ledgerTxAmount || ledgerTxAmount <= 0) {
      alert('Silakan masukkan nominal transaksi yang valid.');
      return;
    }

    if (!onAddJournalEntry) return;

    let debitCode = selectedAccountCode;
    let debitName = selectedAccount.name;
    let creditCode = ledgerOppositeAccount;
    let creditName = accounts.find((a) => a.code === ledgerOppositeAccount)?.name || 'Akun Lawan';

    if (ledgerTxType === 'KREDIT') {
      debitCode = ledgerOppositeAccount;
      debitName = accounts.find((a) => a.code === ledgerOppositeAccount)?.name || 'Akun Lawan';
      creditCode = selectedAccountCode;
      creditName = selectedAccount.name;
    }

    onAddJournalEntry({
      date: ledgerTxDate,
      voucherNo: ledgerTxVoucher,
      description: ledgerTxDesc,
      categoryTag: selectedAccount.category === 'ASET_LANCAR' ? 'ASET_LANCAR' : 'OPERASIONAL',
      debitAccountCode: debitCode,
      debitAccountName: debitName,
      creditAccountCode: creditCode,
      creditAccountName: creditName,
      amount: Number(ledgerTxAmount),
      notes: `Input langsung melalui Buku Besar per Akun ${selectedAccount.name}`,
    });

    setShowAddLedgerEntryModal(false);
  };

  // Open Edit Journal Entry Modal
  const handleOpenEditJournal = (entry: JournalEntry) => {
    setEditingJournal(entry);
    setEditJournalDate(entry.date);
    setEditJournalVoucher(entry.voucherNo);
    setEditJournalDesc(entry.description);
    setEditJournalAmount(entry.amount);
    setShowEditJournalModal(true);
  };

  // Submit Edit Journal Entry
  const handleEditJournalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJournal || !onUpdateJournalEntry) return;

    onUpdateJournalEntry(editingJournal.id, {
      date: editJournalDate,
      voucherNo: editJournalVoucher,
      description: editJournalDesc,
      amount: Number(editJournalAmount),
    });

    setShowEditJournalModal(false);
    setEditingJournal(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Mode Switcher */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('coa')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'coa'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpenCheck className="w-4 h-4" />
            <span>Chart of Accounts (Bagan Akun Standard COA)</span>
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'ledger'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Buku Besar (General Ledger per Akun)</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'coa' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow transition hover:bg-slate-800 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>Tambah Akun Baru</span>
            </button>
          )}
          <button
            onClick={() => printDocument('printable-report', 'Chart of Accounts & Buku Besar Yayasan')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold shadow transition hover:bg-slate-700 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Cetak PDF</span>
          </button>
        </div>
      </div>

      {/* TAB 1: CHART OF ACCOUNTS (COA) */}
      {activeTab === 'coa' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          
          {/* Info Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-900">
            <div className="flex items-center gap-2 font-semibold">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Seluruh Akun <strong>Aset Lancar</strong> (Kas, Bank, Piutang) & COA Lainnya dapat disunting secara instan melalui tombol <strong className="bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded">Sunting / Edit Saldo</strong>.
              </span>
            </div>
            <span className="text-[11px] font-mono font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full shrink-0">
              {accounts.filter((a) => a.category === 'ASET_LANCAR').length} Akun Aset Lancar
            </span>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Kategori:</span>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">Semua Kategori</option>
                <option value="ASET_LANCAR">1-Aset Lancar (Kas, Bank, Piutang)</option>
                <option value="ASET_TETAP">1-Aset Tetap</option>
                <option value="KEWAJIBAN">2-Kewajiban</option>
                <option value="ASET_NETO">3-Aset Neto</option>
                <option value="PENDAPATAN">4-Pendapatan</option>
                <option value="BEBAN">5-Beban Operasional</option>
              </select>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari kode / nama akun..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 w-64"
              />
            </div>
          </div>

          {/* Table COA */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 font-extrabold text-slate-800 uppercase tracking-wider">
                <tr>
                  <th className="p-3 border-b border-slate-200">Kode</th>
                  <th className="p-3 border-b border-slate-200">Nama Akun COA</th>
                  <th className="p-3 border-b border-slate-200">Klasifikasi ISAK 35</th>
                  <th className="p-3 border-b border-slate-200">Sub-Klasifikasi</th>
                  <th className="p-3 border-b border-slate-200 text-right">Saldo Saat Ini (Rp)</th>
                  <th className="p-3 border-b border-slate-200 text-center">Aksi / Sunting</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredAccounts.map((account) => {
                  const isAsetLancar = account.category === 'ASET_LANCAR';
                  return (
                    <tr
                      key={account.code}
                      className={`hover:bg-slate-50 transition ${isAsetLancar ? 'bg-emerald-50/20' : ''}`}
                    >
                      <td className="p-3 font-mono font-bold text-slate-900">{account.code}</td>
                      <td className="p-3 font-semibold text-slate-900">
                        <div className="flex items-center gap-1.5">
                          <span>{account.name}</span>
                          {isAsetLancar && (
                            <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] font-black rounded border border-emerald-300">
                              ASET LANCAR
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            account.category === 'ASET_LANCAR' || account.category === 'ASET_TETAP'
                              ? 'bg-emerald-100 text-emerald-800'
                              : account.category === 'KEWAJIBAN'
                              ? 'bg-rose-100 text-rose-800'
                              : account.category === 'ASET_NETO'
                              ? 'bg-blue-100 text-blue-800'
                              : account.category === 'PENDAPATAN'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {account.category.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500">{account.subCategory || account.restriction || '-'}</td>
                      <td className="p-3 text-right font-mono font-black text-slate-900">
                        {formatRupiah(account.balance)}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditAccount(account)}
                            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-white rounded-lg text-[11px] font-bold shadow flex items-center gap-1 transition cursor-pointer"
                            title="Edit Akun & Saldo"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit Saldo</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedAccountCode(account.code);
                              setActiveTab('ledger');
                            }}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[11px] font-bold transition cursor-pointer"
                          >
                            Buku Besar
                          </button>
                          {onDeleteAccount && (
                            <button
                              onClick={() =>
                                setDeleteConfirmation({
                                  type: 'ACCOUNT',
                                  idOrCode: account.code,
                                  title: `Hapus Akun ${account.code} - ${account.name}`,
                                  subtitle: `Penghapusan akun ini akan menghapus akun dari bagan standar COA dan Laporan Keuangan.`,
                                })
                              }
                              className="p-1 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg transition cursor-pointer"
                              title="Hapus Akun"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 2: GENERAL LEDGER (BUKU BESAR) */}
      {activeTab === 'ledger' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
          
          {/* Account Selector Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl shadow-md border border-slate-700">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">PILIH AKUN BUKU BESAR:</span>
                {selectedAccount?.category === 'ASET_LANCAR' && (
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black rounded-full">
                    ASET LANCAR (EDITABLE)
                  </span>
                )}
              </div>
              <select
                value={selectedAccountCode}
                onChange={(e) => setSelectedAccountCode(e.target.value)}
                className="bg-slate-800 text-white font-black text-base rounded-xl px-3 py-2 border border-slate-600 focus:outline-none focus:border-emerald-500 cursor-pointer min-w-[280px]"
              >
                {accounts.map((a) => (
                  <option key={a.code} value={a.code}>
                    {a.code} - {a.name} ({a.category.replace('_', ' ')})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-3 self-end sm:self-center">
              <div className="text-right">
                <p className="text-xs text-slate-400 font-bold">SALDO BUKU BESAR SAAT INI:</p>
                <p className="text-2xl font-mono font-black text-emerald-400">
                  {selectedAccount ? formatRupiah(selectedAccount.balance) : 'Rp 0'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {selectedAccount && (
                  <button
                    onClick={() => handleOpenEditAccount(selectedAccount)}
                    className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow flex items-center gap-1.5 cursor-pointer transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Saldo</span>
                  </button>
                )}

                {onAddJournalEntry && (
                  <button
                    onClick={handleOpenAddLedgerEntry}
                    className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow flex items-center gap-1.5 cursor-pointer transition"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>+ Tambah Transaksi / Penyesuaian</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Formula & Explanation Banner */}
          <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-slate-800 text-xs">
            <div className="space-y-1">
              <p className="font-extrabold text-emerald-900 flex items-center gap-1.5 text-sm">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Formula Rekonsiliasi Saldo Buku Besar ({selectedAccount?.code} - {selectedAccount?.name})</span>
              </p>
              <p className="text-slate-600 leading-relaxed">
                <strong>Saldo Akhir Saat Ini ({formatRupiah(currentAccountBalance)})</strong> = Saldo Awal ({formatRupiah(initialOpeningBalance)}) + Total Debet ({formatRupiah(totalLedgerDebit)}) - Total Kredit ({formatRupiah(totalLedgerCredit)}).
              </p>
              <p className="text-[11px] text-slate-500 italic">
                *Rincian Kredit/Debet di bawah adalah daftar mutasi transaksi. Kredit menunjukkan pengeluaran kas yang memotong saldo awal, bukan sisa akhir kas tersisa.
              </p>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 font-extrabold text-slate-800 uppercase tracking-wider">
                <tr>
                  <th className="p-3 border-b border-slate-200">Tanggal</th>
                  <th className="p-3 border-b border-slate-200">No. Voucher</th>
                  <th className="p-3 border-b border-slate-200">Deskripsi Transaksi</th>
                  <th className="p-3 border-b border-slate-200 text-right">Debet (Rp)</th>
                  <th className="p-3 border-b border-slate-200 text-right">Kredit (Rp)</th>
                  <th className="p-3 border-b border-slate-200 text-right bg-slate-200/60 font-black">Saldo Running (Rp)</th>
                  <th className="p-3 border-b border-slate-200 text-center">Aksi / Edit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {/* Row 0: Saldo Awal */}
                <tr className="bg-emerald-50/40 font-bold border-b border-emerald-100">
                  <td className="p-3 text-slate-500 font-mono">-</td>
                  <td className="p-3 font-mono text-emerald-800">BAL-OPENING</td>
                  <td className="p-3 text-slate-900">
                    <span className="font-black text-emerald-900">SALDO AWAL BUKU BESAR</span>
                    <span className="text-[10px] text-slate-500 block font-normal">Saldo pembukuan awal sebelum akumulasi mutasi transaksi</span>
                  </td>
                  <td className="p-3 text-right font-mono text-slate-400">-</td>
                  <td className="p-3 text-right font-mono text-slate-400">-</td>
                  <td className="p-3 text-right font-mono text-emerald-800 font-black bg-emerald-100/30">
                    {formatRupiah(initialOpeningBalance)}
                  </td>
                  <td className="p-3 text-center text-slate-400 text-[10px] italic">Master COA</td>
                </tr>

                {ledgerTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400 italic font-medium">
                      Belum ada transaksi jurnal terposting pada akun {selectedAccount?.name} ({selectedAccountCode}).
                      <br />
                      Klik tombol <strong>+ Tambah Transaksi / Penyesuaian</strong> untuk memasukkan transaksi atau penyesuaian secara langsung.
                    </td>
                  </tr>
                ) : (
                  (() => {
                    let running = initialOpeningBalance;
                    return ledgerTransactions.map((entry) => {
                      const isDebit = entry.debitAccountCode === selectedAccountCode;
                      const amount = entry.amount;

                      if (isDebit) {
                        running += isDebitNormal ? amount : -amount;
                      } else {
                        running += isDebitNormal ? -amount : amount;
                      }

                      return (
                        <tr key={entry.id} className="hover:bg-slate-50 transition">
                          <td className="p-3 text-slate-600 font-mono font-semibold">{formatDateIndonesian(entry.date)}</td>
                          <td className="p-3 font-mono font-bold text-slate-900">{entry.voucherNo}</td>
                          <td className="p-3 font-semibold text-slate-900">
                            <div>
                              <p>{entry.description}</p>
                              <p className="text-[10px] text-slate-400">
                                Lawan Akun: {isDebit ? `${entry.creditAccountCode} - ${entry.creditAccountName}` : `${entry.debitAccountCode} - ${entry.debitAccountName}`}
                              </p>
                            </div>
                          </td>
                          <td className="p-3 text-right font-mono text-emerald-700 font-extrabold">
                            {isDebit ? formatRupiah(entry.amount) : '-'}
                          </td>
                          <td className="p-3 text-right font-mono text-rose-700 font-bold">
                            {!isDebit ? formatRupiah(entry.amount) : '-'}
                          </td>
                          <td className="p-3 text-right font-mono font-black text-slate-900 bg-slate-50">
                            {formatRupiah(running)}
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => handleOpenEditJournal(entry)}
                                className="p-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg transition cursor-pointer"
                                title="Edit Transaksi Jurnal"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              {onDeleteJournalEntry && (
                                <button
                                  onClick={() =>
                                    setDeleteConfirmation({
                                      type: 'JOURNAL',
                                      idOrCode: entry.id,
                                      title: `Hapus Transaksi Jurnal ${entry.voucherNo}`,
                                      subtitle: `${entry.description} (${formatRupiah(entry.amount)}). Menghapus transaksi ini akan mengembalikan saldo akun terkait.`,
                                    })
                                  }
                                  className="p-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg transition cursor-pointer"
                                  title="Hapus Transaksi Jurnal"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    });
                  })()
                )}
              </tbody>
              <tfoot className="bg-slate-900 text-white font-black text-xs border-t-2 border-slate-700">
                <tr>
                  <td colSpan={3} className="p-3.5 text-right uppercase tracking-wider">
                    TOTAL MUTASI &amp; SALDO AKHIR
                  </td>
                  <td className="p-3.5 text-right font-mono text-emerald-400 font-black">
                    {formatRupiah(totalLedgerDebit)}
                  </td>
                  <td className="p-3.5 text-right font-mono text-rose-300 font-black">
                    {formatRupiah(totalLedgerCredit)}
                  </td>
                  <td className="p-3.5 text-right font-mono text-amber-300 font-black text-sm bg-slate-950">
                    {formatRupiah(currentAccountBalance)}
                  </td>
                  <td className="p-3.5 text-center text-[10px] text-slate-400">Match COA</td>
                </tr>
              </tfoot>
            </table>
          </div>

        </div>
      )}

      {/* MODAL 1: ADD ACCOUNT */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">Tambah Akun COA Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAccountSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kode Akun (cth: 1106)</label>
                <input
                  type="text"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Akun</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Akun</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="ASET_LANCAR">ASET LANCAR</option>
                    <option value="ASET_TETAP">ASET TETAP</option>
                    <option value="KEWAJIBAN">KEWAJIBAN</option>
                    <option value="ASET_NETO">ASET NETO</option>
                    <option value="PENDAPATAN">PENDAPATAN</option>
                    <option value="BEBAN">BEBAN</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sub Kategori</label>
                  <input
                    type="text"
                    value={newSubCategory}
                    onChange={(e) => setNewSubCategory(e.target.value)}
                    placeholder="Kas & Bank / Beban Operasional"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Saldo Awal (Rp)</label>
                <input
                  type="number"
                  value={newInitialBalance || ''}
                  onChange={(e) => setNewInitialBalance(Number(e.target.value))}
                  placeholder="0"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow"
                >
                  Simpan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT ACCOUNT (Aset Lancar & All COA) */}
      {showEditAccountModal && editingAccount && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-amber-700 uppercase bg-amber-100 px-2 py-0.5 rounded-full">
                  SUNTING SALDO & DETAIL AKUN
                </span>
                <h3 className="font-extrabold text-slate-900 text-base mt-1">
                  Akun: {editingAccount.code} - {editingAccount.name}
                </h3>
              </div>
              <button onClick={() => setShowEditAccountModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditAccountSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Akun</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-900 mb-1">
                  Saldo Akun Saat Ini (Rp)
                </label>
                <input
                  type="number"
                  value={editBalance}
                  onChange={(e) => setEditBalance(Number(e.target.value))}
                  className="w-full bg-amber-50 border border-amber-300 rounded-xl px-3 py-2 text-sm font-mono font-black text-amber-900 focus:outline-none focus:border-amber-500"
                  required
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Menyunting saldo secara langsung akan memperbarui saldo di Neraca dan Buku Besar secara sinkron.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Akun</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                  >
                    <option value="ASET_LANCAR">ASET LANCAR</option>
                    <option value="ASET_TETAP">ASET TETAP</option>
                    <option value="KEWAJIBAN">KEWAJIBAN</option>
                    <option value="ASET_NETO">ASET NETO</option>
                    <option value="PENDAPATAN">PENDAPATAN</option>
                    <option value="BEBAN">BEBAN</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sub Kategori</label>
                  <input
                    type="text"
                    value={editSubCategory}
                    onChange={(e) => setEditSubCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditAccountModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs shadow"
                >
                  Simpan Perubahan Saldo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: DIRECT LEDGER TRANSACTION ENTRY / ADJUSTMENT */}
      {showAddLedgerEntryModal && selectedAccount && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase bg-emerald-100 px-2 py-0.5 rounded-full">
                  INPUT TRANSAKSI BUKU BESAR
                </span>
                <h3 className="font-extrabold text-slate-900 text-base mt-1">
                  Akun Target: {selectedAccount.code} - {selectedAccount.name}
                </h3>
              </div>
              <button onClick={() => setShowAddLedgerEntryModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLedgerEntrySubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Posisi Mutasi Pada Akun Ini</label>
                  <select
                    value={ledgerTxType}
                    onChange={(e) => setLedgerTxType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-black text-emerald-800"
                  >
                    <option value="DEBIT">DEBIT (Penambahan Aset / Beban)</option>
                    <option value="KREDIT">KREDIT (Pengurangan Aset / Pendapatan)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Transaksi</label>
                  <input
                    type="date"
                    value={ledgerTxDate}
                    onChange={(e) => setLedgerTxDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nomor Voucher / Ref</label>
                  <input
                    type="text"
                    value={ledgerTxVoucher}
                    onChange={(e) => setLedgerTxVoucher(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nominal Transaksi (Rp)</label>
                  <input
                    type="number"
                    value={ledgerTxAmount || ''}
                    onChange={(e) => setLedgerTxAmount(Number(e.target.value))}
                    placeholder="1000000"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-black text-slate-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lawan Pasangan Akun (Double Entry)</label>
                <select
                  value={ledgerOppositeAccount}
                  onChange={(e) => setLedgerOppositeAccount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                >
                  {accounts
                    .filter((a) => a.code !== selectedAccountCode)
                    .map((a) => (
                      <option key={a.code} value={a.code}>
                        {a.code} - {a.name} ({a.category})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi / Uraian Transaksi</label>
                <textarea
                  value={ledgerTxDesc}
                  onChange={(e) => setLedgerTxDesc(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  required
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddLedgerEntryModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs shadow"
                >
                  Posting Ke Buku Besar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: EDIT JOURNAL ENTRY */}
      {showEditJournalModal && editingJournal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">Edit Transaksi Jurnal ({editingJournal.voucherNo})</h3>
              <button onClick={() => setShowEditJournalModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditJournalSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={editJournalDate}
                    onChange={(e) => setEditJournalDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">No Voucher</label>
                  <input
                    type="text"
                    value={editJournalVoucher}
                    onChange={(e) => setEditJournalVoucher(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Transaksi</label>
                <input
                  type="text"
                  value={editJournalDesc}
                  onChange={(e) => setEditJournalDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nominal Transaksi (Rp)</label>
                <input
                  type="number"
                  value={editJournalAmount}
                  onChange={(e) => setEditJournalAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-black text-slate-900"
                  required
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditJournalModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs shadow"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: DELETE CONFIRMATION */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600 border-b border-slate-100 pb-3">
              <div className="p-3 bg-rose-100 rounded-2xl">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Konfirmasi Hapus Data</h3>
                <p className="text-xs text-slate-500">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
              <p className="font-bold text-slate-900 text-sm">{deleteConfirmation.title}</p>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">{deleteConfirmation.subtitle}</p>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (deleteConfirmation.type === 'ACCOUNT' && onDeleteAccount) {
                    onDeleteAccount(deleteConfirmation.idOrCode);
                  } else if (deleteConfirmation.type === 'JOURNAL' && onDeleteJournalEntry) {
                    onDeleteJournalEntry(deleteConfirmation.idOrCode);
                  }
                  setDeleteConfirmation(null);
                }}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold rounded-xl text-xs shadow-lg transition cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Ya, Hapus Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
