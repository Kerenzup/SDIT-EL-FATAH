import React, { useState } from 'react';
import { UserRole } from '../../types';
import { RoleAuthConfig, saveRoleAuthConfigs, INITIAL_ROLE_AUTH_CONFIGS } from '../../utils/roleAuth';
import { TabType } from '../Sidebar';
import {
  ShieldCheck,
  Lock,
  Key,
  Check,
  Save,
  RotateCcw,
  User,
  GraduationCap,
  School,
  Building,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sliders,
} from 'lucide-react';

interface RoleAccessManagementViewProps {
  roleConfigs: Record<UserRole, RoleAuthConfig>;
  currentRole: UserRole;
  onUpdateConfigs: (configs: Record<UserRole, RoleAuthConfig>) => void;
}

export const RoleAccessManagementView: React.FC<RoleAccessManagementViewProps> = ({
  roleConfigs,
  currentRole,
  onUpdateConfigs,
}) => {
  const [editingConfigs, setEditingConfigs] = useState<Record<UserRole, RoleAuthConfig>>(roleConfigs);
  const [showPasswordRole, setShowPasswordRole] = useState<Record<string, boolean>>({});
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');

  const handlePasswordChange = (role: UserRole, newPass: string) => {
    setEditingConfigs((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        password: newPass,
      },
    }));
  };

  const handleToggleTab = (role: UserRole, tab: TabType) => {
    setEditingConfigs((prev) => {
      const cfg = prev[role];
      const hasTab = cfg.allowedTabs.includes(tab);
      const updatedTabs = hasTab
        ? cfg.allowedTabs.filter((t) => t !== tab)
        : [...cfg.allowedTabs, tab];

      return {
        ...prev,
        [role]: {
          ...cfg,
          allowedTabs: updatedTabs,
        },
      };
    });
  };

  const handleTogglePermissionFlag = (role: UserRole, flagKey: keyof RoleAuthConfig) => {
    setEditingConfigs((prev) => {
      const cfg = prev[role];
      const val = Boolean(cfg[flagKey]);
      return {
        ...prev,
        [role]: {
          ...cfg,
          [flagKey]: !val,
        },
      };
    });
  };

  const handleSaveAll = () => {
    saveRoleAuthConfigs(editingConfigs);
    onUpdateConfigs(editingConfigs);
    setSaveSuccessMsg('Pengaturan password dan hak akses per peran berhasil diperbarui!');
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  const handleResetToDefault = () => {
    setEditingConfigs(INITIAL_ROLE_AUTH_CONFIGS);
    saveRoleAuthConfigs(INITIAL_ROLE_AUTH_CONFIGS);
    onUpdateConfigs(INITIAL_ROLE_AUTH_CONFIGS);
    setSaveSuccessMsg('Password dan hak akses di-reset ke nilai default awal!');
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  const toggleShowPass = (role: string) => {
    setShowPasswordRole((prev) => ({ ...prev, [role]: !prev[role] }));
  };

  const rolesOrder: UserRole[] = [
    'GURU',
    'BENDAHARA_SEKOLAH',
    'KEPALA_SEKOLAH',
    'BENDAHARA_YAYASAN',
    'KETUA_YAYASAN',
    'SUPERADMIN',
  ];

  const allAvailableTabs: { id: TabType; label: string }[] = [
    { id: 'website', label: 'Website Publik' },
    { id: 'dashboard', label: 'Dashboard ERP' },
    { id: 'siplah', label: 'Belanja SiPLah' },
    { id: 'academic', label: 'E-Raport & Jurnal' },
    { id: 'arkas', label: 'Anggaran ARKAS' },
    { id: 'reports', label: 'Laporan Keuangan' },
    { id: 'calk', label: 'CALK' },
    { id: 'transactions', label: 'POS SPP & BOS' },
    { id: 'coa', label: 'Buku Besar & COA' },
    { id: 'assets', label: 'Aset Tetap' },
    { id: 'master', label: 'Master Siswa & Guru' },
    { id: 'cms', label: 'CMS Website' },
    { id: 'pengaturan', label: 'Pengaturan' },
    { id: 'ai', label: 'Asisten AI' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Title Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-900 text-xs font-black rounded-full mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-700" /> Pengelolaan Hak Akses & Password ERP
          </div>
          <h2 className="text-2xl font-black text-slate-900">Manajemen Akses Peran & Keamanan</h2>
          <p className="text-xs text-slate-500">
            Atur password khusus dan izin akses modul ERP untuk Orang Tua, Guru, Bendahara, Kepala Sekolah, & Pengurus Yayasan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetToDefault}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Default</span>
          </button>
          <button
            onClick={handleSaveAll}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Access Control Summary Matrix Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-5 rounded-2xl space-y-2 border border-indigo-800 shadow-md">
          <div className="flex items-center gap-2 text-sky-300 font-extrabold text-xs">
            <User className="w-4 h-4" /> Hak Akses Orang Tua & Guru
          </div>
          <ul className="text-[11px] text-blue-100 space-y-1 list-disc pl-4">
            <li><strong className="text-white">Orang Tua:</strong> E-Raport & Status SPP</li>
            <li><strong className="text-white">Guru:</strong> E-Raport, Jurnal Rombel, Data Siswa & SPP Kelas</li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white p-5 rounded-2xl space-y-2 border border-blue-800 shadow-md">
          <div className="flex items-center gap-2 text-sky-300 font-extrabold text-xs">
            <ShieldCheck className="w-4 h-4" /> Hak Akses Bendahara & Kepsek
          </div>
          <ul className="text-[11px] text-blue-100 space-y-1 list-disc pl-4">
            <li><strong className="text-white">Bendahara:</strong> Laporan Keuangan, Gaji Guru, Input Pengeluaran ARKAS, SPP & BOS</li>
            <li><strong className="text-white">Kepala Sekolah:</strong> Jurnal Rombel, Laporan Keuangan, Procurement SiPLah, Data Siswa & Guru</li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-5 rounded-2xl space-y-2 border border-slate-700 shadow-md">
          <div className="flex items-center gap-2 text-sky-300 font-extrabold text-xs">
            <Building className="w-4 h-4" /> Hak Akses Yayasan & Superadmin
          </div>
          <ul className="text-[11px] text-blue-100 space-y-1 list-disc pl-4">
            <li><strong className="text-white">Ketua & Bendahara Umum:</strong> Seluruh Laporan Keuangan ISAK 35 & Approval Pembelian SiPLah</li>
            <li><strong className="text-white">Superadmin:</strong> Akses Penuh Seluruh Modul ERP & Pengelolaan Hak Akses</li>
          </ul>
        </div>
      </div>

      {/* Role Cards List */}
      <div className="space-y-6">
        {rolesOrder.map((roleKey) => {
          const cfg = editingConfigs[roleKey];
          if (!cfg) return null;

          const isVisiblePass = showPasswordRole[roleKey] || false;

          return (
            <div
              key={roleKey}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4 hover:border-blue-300 transition"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 font-black flex items-center justify-center text-sm shadow-inner">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 text-base">{cfg.title}</h3>
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full uppercase">
                        {roleKey}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{cfg.description}</p>
                  </div>
                </div>

                {/* Password Setting Input */}
                <div className="w-full md:w-auto flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200">
                  <Key className="w-4 h-4 text-blue-600 shrink-0 ml-1" />
                  <span className="text-xs font-bold text-slate-600 whitespace-nowrap">Password:</span>
                  <div className="relative flex-1 md:w-48">
                    <input
                      type={isVisiblePass ? 'text' : 'password'}
                      value={cfg.password}
                      onChange={(e) => handlePasswordChange(roleKey, e.target.value)}
                      placeholder="Masukkan password baru..."
                      className="w-full text-xs font-mono font-bold bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-blue-600"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowPass(roleKey)}
                      className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                    >
                      {isVisiblePass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Special Action Permissions Flags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer hover:bg-blue-50/50">
                  <input
                    type="checkbox"
                    checked={cfg.canApproveProcurement}
                    onChange={() => handleTogglePermissionFlag(roleKey, 'canApproveProcurement')}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="font-bold text-slate-800">Approve SiPLah</span>
                </label>

                <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer hover:bg-blue-50/50">
                  <input
                    type="checkbox"
                    checked={cfg.canApproveRaportAndJournal}
                    onChange={() => handleTogglePermissionFlag(roleKey, 'canApproveRaportAndJournal')}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="font-bold text-slate-800">Approve Raport & Jurnal</span>
                </label>

                <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer hover:bg-blue-50/50">
                  <input
                    type="checkbox"
                    checked={cfg.canEditFinancials}
                    onChange={() => handleTogglePermissionFlag(roleKey, 'canEditFinancials')}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="font-bold text-slate-800">Input ARKAS & Keuangan</span>
                </label>

                <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer hover:bg-blue-50/50">
                  <input
                    type="checkbox"
                    checked={cfg.canManageSalaries}
                    onChange={() => handleTogglePermissionFlag(roleKey, 'canManageSalaries')}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="font-bold text-slate-800">Akses Data Gaji Guru</span>
                </label>
              </div>

              {/* Allowed Modules Toggle Chips */}
              <div className="space-y-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                  Modul Terbuka Untuk {cfg.title}:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {allAvailableTabs.map((t) => {
                    const isAllowed = cfg.allowedTabs.includes(t.id);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleToggleTab(roleKey, t.id)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                          isAllowed
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {isAllowed && <Check className="w-3 h-3" />}
                        <span>{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
