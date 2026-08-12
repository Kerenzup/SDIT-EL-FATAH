import { UserRole } from '../types';
import { TabType } from '../components/Sidebar';

export interface RoleAuthConfig {
  role: UserRole;
  title: string;
  description: string;
  password: string; // Plain password for simple demo ERP access management
  defaultPasswordHint: string;
  allowedTabs: TabType[];
  canApproveProcurement: boolean;
  canApproveRaportAndJournal: boolean;
  canEditFinancials: boolean;
  canManageSalaries: boolean;
  canManageRoleAccess: boolean;
}

export const INITIAL_ROLE_AUTH_CONFIGS: Record<UserRole, RoleAuthConfig> = {
  SUPERADMIN: {
    role: 'SUPERADMIN',
    title: 'Superadmin ERP Yayasan',
    description: 'Akses penuh tanpa batas ke seluruh modul ERP, Laporan Keuangan, Pengaturan, & Hak Akses Password.',
    password: 'superadmin123',
    defaultPasswordHint: 'superadmin123',
    allowedTabs: [
      'website',
      'dashboard',
      'siplah',
      'e_raport',
      'jurnal',
      'academic',
      'arkas',
      'reports',
      'calk',
      'transactions',
      'coa',
      'assets',
      'master',
      'cms',
      'pengaturan',
      'ai',
    ],
    canApproveProcurement: true,
    canApproveRaportAndJournal: true,
    canEditFinancials: true,
    canManageSalaries: true,
    canManageRoleAccess: true,
  },
  KETUA_YAYASAN: {
    role: 'KETUA_YAYASAN',
    title: 'Ketua Pembina Yayasan',
    description: 'Mengakses seluruh Laporan Keuangan ISAK 35, CALK, Overview Dashboard, dan Menyetujui/Menolak Pembelian SiPLah.',
    password: 'ketua123',
    defaultPasswordHint: 'ketua123',
    allowedTabs: [
      'website',
      'dashboard',
      'siplah',
      'reports',
      'calk',
      'assets',
      'master',
      'pengaturan',
      'ai',
    ],
    canApproveProcurement: true,
    canApproveRaportAndJournal: true,
    canEditFinancials: false,
    canManageSalaries: false,
    canManageRoleAccess: true,
  },
  BENDAHARA_YAYASAN: {
    role: 'BENDAHARA_YAYASAN',
    title: 'Bendahara Umum Yayasan',
    description: 'Mengakses Seluruh Laporan Keuangan, Data Gaji Guru, Input Pengeluaran ARKAS, SPP & BOS, serta Menyetujui Pembelian SiPLah.',
    password: 'bendahara123',
    defaultPasswordHint: 'bendahara123',
    allowedTabs: [
      'website',
      'dashboard',
      'siplah',
      'reports',
      'calk',
      'transactions',
      'arkas',
      'coa',
      'assets',
      'master',
      'pengaturan',
      'ai',
    ],
    canApproveProcurement: true,
    canApproveRaportAndJournal: false,
    canEditFinancials: true,
    canManageSalaries: true,
    canManageRoleAccess: true,
  },
  BENDAHARA_SEKOLAH: {
    role: 'BENDAHARA_SEKOLAH',
    title: 'Bendahara Sekolah',
    description: 'Mengakses Laporan Keuangan Sekolah, Data Gaji Guru, Input Pengeluaran ARKAS, dan Transaksi Penerimaan SPP & BOS.',
    password: 'bendahara123',
    defaultPasswordHint: 'bendahara123',
    allowedTabs: [
      'website',
      'dashboard',
      'reports',
      'transactions',
      'arkas',
      'master',
      'ai',
    ],
    canApproveProcurement: false,
    canApproveRaportAndJournal: false,
    canEditFinancials: true,
    canManageSalaries: true,
    canManageRoleAccess: false,
  },
  KEPALA_SEKOLAH: {
    role: 'KEPALA_SEKOLAH',
    title: 'Kepala Sekolah',
    description: 'Mengakses Jurnal Guru Rombel, Laporan Keuangan, Usulan Belanja SiPLah, Data Siswa, & Data Guru.',
    password: 'kepsek123',
    defaultPasswordHint: 'kepsek123',
    allowedTabs: [
      'website',
      'dashboard',
      'e_raport',
      'jurnal',
      'academic',
      'siplah',
      'reports',
      'master',
      'ai',
    ],
    canApproveProcurement: false,
    canApproveRaportAndJournal: true,
    canEditFinancials: false,
    canManageSalaries: false,
    canManageRoleAccess: false,
  },
  GURU: {
    role: 'GURU',
    title: 'Guru Kelas / Rombel',
    description: 'Mengakses E-Raport Rombel, Jurnal Mengajar Rombel, Data Siswa Rombel, dan Informasi SPP Kelas.',
    password: 'guru123',
    defaultPasswordHint: 'guru123',
    allowedTabs: [
      'website',
      'e_raport',
      'jurnal',
      'academic',
      'master',
      'transactions',
    ],
    canApproveProcurement: false,
    canApproveRaportAndJournal: false,
    canEditFinancials: false,
    canManageSalaries: false,
    canManageRoleAccess: false,
  },
  PUBLIC_GUEST: {
    role: 'PUBLIC_GUEST',
    title: 'Pengunjung Publik',
    description: 'Akses membaca informasi profil yayasan, pengumuman, galeri, dan pencarian E-Raport publik.',
    password: '',
    defaultPasswordHint: '(Tanpa Password)',
    allowedTabs: ['website'],
    canApproveProcurement: false,
    canApproveRaportAndJournal: false,
    canEditFinancials: false,
    canManageSalaries: false,
    canManageRoleAccess: false,
  },
};

export function getRoleAuthConfigs(): Record<UserRole, RoleAuthConfig> {
  const saved = localStorage.getItem('yayasan_role_auth_configs');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return { ...INITIAL_ROLE_AUTH_CONFIGS, ...parsed };
    } catch {
      return INITIAL_ROLE_AUTH_CONFIGS;
    }
  }
  return INITIAL_ROLE_AUTH_CONFIGS;
}

export function saveRoleAuthConfigs(configs: Record<UserRole, RoleAuthConfig>): void {
  localStorage.setItem('yayasan_role_auth_configs', JSON.stringify(configs));
}

export function validateRolePassword(role: UserRole, inputPass: string, configs?: Record<UserRole, RoleAuthConfig>): boolean {
  const allConfigs = configs || getRoleAuthConfigs();
  const cfg = allConfigs[role];
  if (!cfg) return false;
  if (!cfg.password) return true; // if empty string, no password needed
  return cfg.password.trim() === inputPass.trim();
}

export function isTabAllowed(role: UserRole, tab: TabType, configs?: Record<UserRole, RoleAuthConfig>): boolean {
  if (role === 'SUPERADMIN') return true;
  const allConfigs = configs || getRoleAuthConfigs();
  const cfg = allConfigs[role];
  if (!cfg) return false;
  return cfg.allowedTabs.includes(tab);
}
