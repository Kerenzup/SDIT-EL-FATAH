import React, { useState } from 'react';
import { Account, JournalEntry } from '../../types';
import { X, PlusCircle } from 'lucide-react';

interface AddTransactionModalProps {
  accounts: Account[];
  onClose: () => void;
  onAddJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  accounts,
  onClose,
  onAddJournalEntry,
}) => {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [voucherNo, setVoucherNo] = useState<string>(
    `JV/${new Date().getFullYear()}/${(new Date().getMonth() + 1).toString().padStart(2, '0')}/${Math.floor(
      100 + Math.random() * 900
    )}`
  );
  const [description, setDescription] = useState<string>('');
  const [debitAccountCode, setDebitAccountCode] = useState<string>('1101');
  const [creditAccountCode, setCreditAccountCode] = useState<string>('4102');
  const [amount, setAmount] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || !description) return;

    const debitAcc = accounts.find((a) => a.code === debitAccountCode);
    const creditAcc = accounts.find((a) => a.code === creditAccountCode);

    onAddJournalEntry({
      date,
      voucherNo,
      description,
      categoryTag: 'UMUM',
      debitAccountCode,
      debitAccountName: debitAcc?.name || '',
      creditAccountCode,
      creditAccountName: creditAcc?.name || '',
      amount,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-emerald-600" />
            <span>Tambah Transaksi / Jurnal Baru</span>
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">No. Voucher</label>
              <input
                type="text"
                value={voucherNo}
                onChange={(e) => setVoucherNo(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Keterangan Transaksi</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Penerimaan Donasi Orang Tua Siswa"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Akun DEBET</label>
              <select
                value={debitAccountCode}
                onChange={(e) => setDebitAccountCode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-500"
              >
                {accounts.map((a) => (
                  <option key={a.code} value={a.code}>
                    {a.code} - {a.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Akun KREDIT</label>
              <select
                value={creditAccountCode}
                onChange={(e) => setCreditAccountCode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-500"
              >
                {accounts.map((a) => (
                  <option key={a.code} value={a.code}>
                    {a.code} - {a.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nominal (Rp)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow"
            >
              Simpan & Post Transaksi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
