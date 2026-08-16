import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FileSpreadsheet,
  Receipt,
  BookOpenCheck,
  Building,
  Users,
  Sparkles,
  FileText,
  DollarSign,
  TrendingUp,
  Landmark,
  FileCode,
  Settings,
  ShoppingBag,
  Globe,
  GraduationCap,
  FileSpreadsheet as ArkasIcon,
  Sliders,
  ShieldCheck,
  Lock,
  Key,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Archive,
} from 'lucide-react';
import { UserRole } from '../types';
import { RoleAuthConfig, isTabAllowed } from '../utils/roleAuth';

export type TabType =
  | 'website'
  | 'dashboard'
  | 'siswa'
  | 'e_raport'
  | 'arsip'
  | 'jurnal'
  | 'payroll'
  | 'siplah'
  | 'academic'
  | 'arkas'
  | 'reports'
  | 'calk'
  | 'transactions'
  | 'coa'
  | 'assets'
  | 'master'
  | 'cms'
  | 'pengaturan'
  | 'hak_akses'
  | 'ai';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  activeReportSubTab?: string;
  setActiveReportSubTab?: (subTab: string) => void;
  currentRole: UserRole;
  roleConfigs?: Record<UserRole, RoleAuthConfig>;
  onOpenPublicSite?: () => void;
  onOpenRoleLoginModal?: (targetRole?: UserRole) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  activeReportSubTab = 'neraca',
  setActiveReportSubTab,
  currentRole,
  roleConfigs,
  onOpenPublicSite,
  onOpenRoleLoginModal,
}) => {
  const currentCfg = roleConfigs ? roleConfigs[currentRole] : undefined;

  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('yayasan_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('yayasan_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  const rawNavItems = [
    {
      id: 'website' as TabType,
      label: 'Halaman Website Publik',
      icon: Globe,
      badge: 'Public',
    },
    {
      id: 'dashboard' as TabType,
      label: 'Dashboard ERP Keuangan',
      icon: LayoutDashboard,
      badge: 'Utama',
    },
    {
      id: 'siswa' as TabType,
      label: 'Data Siswa',
      icon: Users,
      badge: 'Siswa',
    },
    {
      id: 'e_raport' as TabType,
      label: 'E-Raport Rombel & Nilai',
      icon: GraduationCap,
      badge: 'Raport',
    },
    {
      id: 'arsip' as TabType,
      label: 'Arsip Kehidupan & Dokumen',
      icon: Archive,
      badge: 'Arsip',
    },
    {
      id: 'jurnal' as TabType,
      label: 'Jurnal Mengajar Guru Rombel',
      icon: BookOpenCheck,
      badge: 'Jurnal',
    },
    {
      id: 'payroll' as TabType,
      label: 'Payroll & SDM Yayasan',
      icon: DollarSign,
      badge: 'Gaji/SDM',
    },
    {
      id: 'siplah' as TabType,
      label: 'Belanja Barang SiPLah',
      icon: ShoppingBag,
      badge: 'SiPLah',
    },
    {
      id: 'arkas' as TabType,
      label: 'Anggaran 1 Tahun ARKAS',
      icon: ArkasIcon,
      badge: 'ARKAS',
    },
    {
      id: 'reports' as TabType,
      label: 'Laporan Keuangan (ISAK 35)',
      icon: FileSpreadsheet,
      badge: '5 Laporan',
    },
    {
      id: 'transactions' as TabType,
      label: 'Transaksi & POS SPP/BOS',
      icon: Receipt,
      badge: 'Kuitansi',
    },
    {
      id: 'coa' as TabType,
      label: 'Buku Besar, COA & Aset',
      icon: BookOpenCheck,
      badge: 'Buku Besar',
    },
    {
      id: 'hak_akses' as TabType,
      label: 'Pengelolaan Hak Akses & Password',
      icon: ShieldCheck,
      badge: 'Akses',
    },
    {
      id: 'cms' as TabType,
      label: 'Superadmin CMS Website',
      icon: Sliders,
      badge: 'Admin',
    },
    {
      id: 'pengaturan' as TabType,
      label: 'Pengaturan Yayasan',
      icon: Settings,
      badge: 'Profil',
    },
    {
      id: 'ai' as TabType,
      label: 'Asisten AI ISAK 35',
      icon: Sparkles,
      badge: 'AI',
    },
  ];

  // Filter allowed items for the current role
  const filteredNavItems = rawNavItems.filter((item) => {
    if (item.id === 'website') return true;
    if (currentRole === 'SUPERADMIN') return true;
    if (item.id === 'hak_akses') {
      return ['SUPERADMIN', 'KETUA_YAYASAN', 'BENDAHARA_YAYASAN'].includes(currentRole);
    }
    return isTabAllowed(currentRole, item.id, roleConfigs);
  });

  return (
    <aside
      className={`w-full bg-slate-900 text-slate-300 border-r border-slate-800 shrink-0 p-3 print:hidden flex flex-col justify-between transition-all duration-300 ${
        isCollapsed ? 'lg:w-16' : 'lg:w-64'
      }`}
    >
      <div>
        {/* Toggle & Header Box */}
        <div className="mb-3 flex items-center justify-between gap-1 border-b border-slate-800 pb-2">
          {!isCollapsed && (
            <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider px-1 truncate">
              ERP MENU
            </span>
          )}
          <button
            onClick={toggleCollapse}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer ml-auto"
            title={isCollapsed ? 'Perluas Menu Sidebar' : 'Minimalis / Ciutkan Menu'}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-sky-400" />
            ) : (
              <>
                <PanelLeftClose className="w-4 h-4 text-slate-300" />
                <span className="text-[10px] font-bold text-slate-300">Ciutkan</span>
              </>
            )}
          </button>
        </div>

        {/* Active Role Status Box */}
        {!isCollapsed ? (
          <div className="mb-4 p-3 bg-slate-800/90 rounded-2xl border border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">
                HAK AKSES
              </span>
              <span className="text-[9px] font-black px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full border border-blue-400/30">
                {currentRole}
              </span>
            </div>
            <p className="text-xs font-extrabold text-white truncate">
              {currentCfg?.title || currentRole}
            </p>
            <button
              onClick={() => onOpenRoleLoginModal && onOpenRoleLoginModal(currentRole)}
              className="w-full py-1.5 px-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] rounded-xl transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Ganti Peran / PIN</span>
            </button>
          </div>
        ) : (
          <div className="mb-3 flex flex-col items-center gap-1">
            <button
              onClick={() => onOpenRoleLoginModal && onOpenRoleLoginModal(currentRole)}
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow transition cursor-pointer"
              title={`Role: ${currentRole} - Klik untuk ganti peran`}
            >
              <Key className="w-4 h-4" />
            </button>
          </div>
        )}

        {!isCollapsed && (
          <div className="mb-2 px-1 py-0.5 flex items-center justify-between">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              MODUL YAYASAN
            </p>
            {onOpenPublicSite && (
              <button
                onClick={onOpenPublicSite}
                className="text-[10px] text-sky-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <Globe className="w-3 h-3" /> Site
              </button>
            )}
          </div>
        )}

        {/* Nav Items List */}
        <nav className="space-y-1">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => {
                    if (item.id === 'website' && onOpenPublicSite) {
                      onOpenPublicSite();
                    } else {
                      setActiveTab(item.id as TabType);
                    }
                  }}
                  title={isCollapsed ? `${item.label} (${item.badge || ''})` : undefined}
                  className={`w-full flex items-center justify-between rounded-xl transition cursor-pointer ${
                    isCollapsed ? 'p-2.5 justify-center' : 'px-3 py-2 text-xs font-semibold'
                  } ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/50 font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5'}`}>
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    {!isCollapsed && <span className="truncate text-left">{item.label}</span>}
                  </div>
                  {!isCollapsed && item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase shrink-0 ${
                        isActive
                          ? 'bg-blue-800 text-blue-100'
                          : 'bg-slate-800 text-sky-400 border border-sky-500/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>

                {/* Sub-menu for Laporan Keuangan (When expanded) */}
                {item.id === 'reports' && isActive && setActiveReportSubTab && !isCollapsed && (
                  <div className="ml-7 mt-1.5 mb-2 pl-3 border-l border-blue-500/30 space-y-1 text-[11px]">
                    <button
                      onClick={() => setActiveReportSubTab('neraca')}
                      className={`w-full text-left py-1 px-2 rounded-md transition ${
                        activeReportSubTab === 'neraca'
                          ? 'bg-blue-500/20 text-sky-300 font-bold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      1. Posisi Keuangan (Neraca)
                    </button>
                    <button
                      onClick={() => setActiveReportSubTab('aktivitas')}
                      className={`w-full text-left py-1 px-2 rounded-md transition ${
                        activeReportSubTab === 'aktivitas'
                          ? 'bg-blue-500/20 text-sky-300 font-bold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      2. Laporan Aktivitas
                    </button>
                    <button
                      onClick={() => setActiveReportSubTab('aruskas')}
                      className={`w-full text-left py-1 px-2 rounded-md transition ${
                        activeReportSubTab === 'aruskas'
                          ? 'bg-blue-500/20 text-sky-300 font-bold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      3. Laporan Arus Kas
                    </button>
                    <button
                      onClick={() => setActiveReportSubTab('perubahanaset')}
                      className={`w-full text-left py-1 px-2 rounded-md transition ${
                        activeReportSubTab === 'perubahanaset'
                          ? 'bg-blue-500/20 text-sky-300 font-bold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      4. Perubahan Aset Neto
                    </button>
                    <button
                      onClick={() => setActiveReportSubTab('calk')}
                      className={`w-full text-left py-1 px-2 rounded-md transition ${
                        activeReportSubTab === 'calk'
                          ? 'bg-blue-500/20 text-sky-300 font-bold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      5. Catatan Atas Laporan (CALK)
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Info Card ISAK 35 */}
      {!isCollapsed && (
        <div className="mt-6 p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 text-slate-300">
          <div className="flex items-center gap-2 mb-1">
            <Landmark className="w-4 h-4 text-sky-400" />
            <p className="text-xs font-bold text-slate-200">Standar ISAK 35</p>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Penyajikan Laporan Keuangan Nonlaba & Transparansi Akuntabilitas Publik.
          </p>
        </div>
      )}
    </aside>
  );
};
