import React from 'react';
import { Building2, Printer, PlusCircle, RotateCcw, Sparkles, Search, Settings, Key, Globe, LogOut, ShieldCheck } from 'lucide-react';
import { FoundationProfile, ReportFilter, UserRole } from '../types';
import { RoleAuthConfig } from '../utils/roleAuth';

interface NavbarProps {
  foundationProfile?: FoundationProfile;
  filter: ReportFilter;
  setFilter: React.Dispatch<React.SetStateAction<ReportFilter>>;
  currentRole: UserRole;
  roleConfigs?: Record<UserRole, RoleAuthConfig>;
  onOpenNewTransaction: () => void;
  onOpenAiAssistant: () => void;
  onOpenSettings?: () => void;
  onOpenRoleLoginModal?: (role?: UserRole) => void;
  onReturnToPublicSite?: () => void;
  onResetData: () => void;
  onPrint: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  foundationProfile,
  filter,
  setFilter,
  currentRole,
  roleConfigs,
  onOpenNewTransaction,
  onOpenAiAssistant,
  onOpenSettings,
  onOpenRoleLoginModal,
  onReturnToPublicSite,
  onResetData,
  onPrint,
}) => {
  const currentCfg = roleConfigs ? roleConfigs[currentRole] : undefined;

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md print:hidden">
      <div className="w-full max-w-[1920px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand & Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div
              onClick={onOpenSettings}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-900/40 cursor-pointer hover:scale-105 transition overflow-hidden"
              title="Klik untuk Pengaturan Yayasan"
            >
              {foundationProfile?.logoUrl ? (
                <img
                  src={foundationProfile.logoUrl}
                  alt="Logo Yayasan"
                  className="w-full h-full object-contain p-0.5 bg-white rounded-xl"
                />
              ) : (
                <Building2 className="w-6 h-6" />
              )}
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-base leading-tight tracking-wide text-blue-400 truncate max-w-[200px] sm:max-w-xs">
                {foundationProfile?.name?.toUpperCase() || 'YAYASAN PENDIDIKAN WIDYA NUSANTARA'}
              </h1>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Sistem Keuangan & Modul ERP Non-Laba (ISAK 35)
              </p>
            </div>
          </div>

          {/* Role Status & Switcher in Header */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenRoleLoginModal && onOpenRoleLoginModal(currentRole)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-950/80 hover:bg-blue-900 border border-blue-500/40 rounded-xl text-xs font-bold text-sky-300 transition cursor-pointer"
              title="Klik untuk ganti hak akses peran dengan password PIN"
            >
              <Key className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden md:inline font-semibold text-slate-300">Akses:</span>
              <span className="font-extrabold text-white">{currentCfg?.title || currentRole}</span>
            </button>

            {onReturnToPublicSite && (
              <button
                onClick={onReturnToPublicSite}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer"
                title="Kembali ke tampilan Website Publik"
              >
                <Globe className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden sm:inline">Web Publik</span>
              </button>
            )}
          </div>

          {/* Quick Filter & Global Search */}
          <div className="hidden xl:flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari transaksi / akun..."
                value={filter.searchQuery || ''}
                onChange={(e) => setFilter((prev) => ({ ...prev, searchQuery: e.target.value }))}
                className="pl-9 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 w-48"
              />
            </div>

            <select
              value={filter.year}
              onChange={(e) => setFilter((prev) => ({ ...prev, year: parseInt(e.target.value) }))}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value={2026}>T.A. 2026</option>
              <option value={2025}>T.A. 2025</option>
              <option value={2024}>T.A. 2024</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAiAssistant}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-sky-400 hover:bg-blue-500/20 border border-blue-500/30 text-xs font-semibold transition"
              title="Konsultasi Keuangan ISAK 35 berbasis AI"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
              <span>AI Consult</span>
            </button>

            {/* Print Facility Button */}
            <button
              onClick={onPrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition cursor-pointer"
              title="Cetak Laporan / Dokumen PDF"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Cetak PDF</span>
            </button>

            <button
              onClick={onOpenSettings}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
              title="Pengaturan Profil Yayasan"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Reset Button: Strictly for SUPER_ADMIN only */}
            {currentRole === 'SUPER_ADMIN' && (
              <button
                onClick={onResetData}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                title="Reset Ke Data Default ISAK 35 (Khusus Superadmin)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
