import React, { useState, useEffect } from 'react';
import { UserRole } from '../../types';
import { RoleAuthConfig, validateRolePassword } from '../../utils/roleAuth';
import {
  Lock,
  Key,
  Eye,
  EyeOff,
  ShieldCheck,
  User,
  GraduationCap,
  Building,
  School,
  Sparkles,
  X,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface RoleLoginModalProps {
  isOpen: boolean;
  targetRole?: UserRole;
  roleConfigs: Record<UserRole, RoleAuthConfig>;
  onSuccessLogin: (role: UserRole) => void;
  onClose: () => void;
}

export const RoleLoginModal: React.FC<RoleLoginModalProps> = ({
  isOpen,
  targetRole = 'KEPALA_SEKOLAH',
  roleConfigs,
  onSuccessLogin,
  onClose,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(targetRole);
  const [usernameInput, setUsernameInput] = useState<string>('sdit');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    setSelectedRole(targetRole);
    if (targetRole === 'ORANG_TUA') {
      setUsernameInput('sdit');
    } else {
      setUsernameInput('');
    }
    setPasswordInput('');
    setErrorMessage('');
  }, [targetRole, isOpen]);

  if (!isOpen) return null;

  const currentCfg = roleConfigs[selectedRole] || roleConfigs['KEPALA_SEKOLAH'];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (selectedRole === 'ORANG_TUA') {
      if (usernameInput.trim().toLowerCase() !== 'sdit') {
        setErrorMessage('Username untuk Orang Tua / Wali Murid harus "sdit".');
        return;
      }

      // Valid passwords for Orang Tua: any valid NIS (like 20240101 - 20240106), ortu123, sdit
      const trimmedPass = passwordInput.trim();
      const isValidNisOrPass =
        trimmedPass === 'ortu123' ||
        trimmedPass === 'sdit' ||
        validateRolePassword(selectedRole, trimmedPass, roleConfigs) ||
        /^\d{6,12}$/.test(trimmedPass);

      if (isValidNisOrPass) {
        if (/^\d+$/.test(trimmedPass)) {
          localStorage.setItem('loggedInParentNis', trimmedPass);
        }
        onSuccessLogin(selectedRole);
        setPasswordInput('');
      } else {
        setErrorMessage('Password untuk Orang Tua harus berupa NIS Siswa (Contoh: 20240101, 20240102) atau "ortu123".');
      }
      return;
    }

    if (validateRolePassword(selectedRole, passwordInput, roleConfigs)) {
      onSuccessLogin(selectedRole);
      setPasswordInput('');
    } else {
      setErrorMessage(`Password untuk peran "${currentCfg.title}" tidak sesuai. Gunakan password default: ${currentCfg.defaultPasswordHint}`);
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'SUPERADMIN':
        return Sparkles;
      case 'KETUA_YAYASAN':
        return Building;
      case 'BENDAHARA_YAYASAN':
      case 'BENDAHARA_SEKOLAH':
        return ShieldCheck;
      case 'KEPALA_SEKOLAH':
        return School;
      case 'GURU':
        return GraduationCap;
      default:
        return Lock;
    }
  };

  const roleList: UserRole[] = [
    'GURU',
    'BENDAHARA_SEKOLAH',
    'KEPALA_SEKOLAH',
    'BENDAHARA_YAYASAN',
    'KETUA_YAYASAN',
    'SUPERADMIN',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-950 via-blue-900 to-indigo-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-indigo-200 hover:text-white p-1 rounded-full hover:bg-indigo-800/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/30 border border-blue-400/40 flex items-center justify-center text-sky-300 shadow-inner">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-lg text-white">Otentikasi Password Hak Akses ERP</h3>
              <p className="text-xs text-sky-200">
                Pilih Peran Pengguna & Masukkan Password Terdaftar
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleLoginSubmit} className="p-6 space-y-5">
          {/* Role Selection Grid */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500">
              Pilih Hak Akses ERP
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {roleList.map((r) => {
                const cfg = roleConfigs[r];
                const Icon = getRoleIcon(r);
                const isSelected = selectedRole === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setSelectedRole(r);
                      setPasswordInput('');
                      setErrorMessage('');
                    }}
                    className={`p-2.5 rounded-2xl text-left border text-xs font-bold transition flex flex-col justify-between gap-1 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                        : 'bg-slate-50 hover:bg-blue-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-blue-600'}`} />
                      {isSelected && <ShieldCheck className="w-3.5 h-3.5 text-sky-200" />}
                    </div>
                    <span className="font-extrabold text-[11px] leading-tight line-clamp-1">{cfg?.title || r}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Role Description Box */}
          <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-100 space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              <h4 className="font-extrabold text-xs text-blue-900">{currentCfg.title}</h4>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">{currentCfg.description}</p>
          </div>

          {/* Username Input for ORANG_TUA */}
          {selectedRole === 'ORANG_TUA' && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span>Username Orang Tua / Wali</span>
                </label>
                <span className="text-[10px] bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full font-extrabold">
                  Wajib: <span className="font-mono">sdit</span>
                </span>
              </div>
              <input
                type="text"
                required
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Masukkan username: sdit"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition"
              />
            </div>
          )}

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-blue-600" />
                <span>{selectedRole === 'ORANG_TUA' ? 'Password (NIS Siswa / ortu123)' : `Password / PIN Hak Akses (${currentCfg.title})`}</span>
              </label>

              {/* Quick Demo Hint */}
              <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-extrabold flex items-center gap-1">
                <HelpCircle className="w-3 h-3 text-amber-600" />
                Hint: <span className="font-mono">{selectedRole === 'ORANG_TUA' ? 'NIS Siswa (e.g. 20240101) / ortu123' : currentCfg.defaultPasswordHint}</span>
              </span>
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder={selectedRole === 'ORANG_TUA' ? 'Masukkan NIS Siswa Anda (Contoh: 20240101)...' : `Masukkan password ${currentCfg.title}...`}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition pr-10"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer text-center"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Masuk Modul ERP</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
