import React, { useState, useEffect } from 'react';
import {
  HeroBanner,
  SpeechesCMS,
  VisionMissionCMS,
  NewsArticle,
  GalleryItem,
  StudentAchievement,
  WebsiteLayoutConfig,
  FoundationProfile,
  OrgStructureMember,
  Teacher,
  PPDBConfig,
  PPDBFeeItem,
  PPDBScholarshipItem,
  UserRole,
} from '../../types';
import { INITIAL_PPDB_CONFIG } from '../../data/initialData';
import {
  Settings,
  Image as ImageIcon,
  FileText,
  Video,
  Award,
  Trash2,
  Save,
  CheckCircle2,
  Layers,
  Plus,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Layout,
  Palette,
  SlidersHorizontal,
  Grid,
  Building2,
  Sparkles,
  GripVertical,
  Users,
  Info,
  GraduationCap,
  Edit2,
  Pencil,
  X,
  UserPlus,
} from 'lucide-react';
import { MediaUploader } from '../common/MediaUploader';
import { safeSetLocalStorage } from '../../utils/safeStorage';
import { isYouTubeUrl, isMediaVideo, getYoutubeEmbedUrl } from '../../utils/formatters';

interface CmsAdminViewProps {
  userRole?: UserRole;
  heroBanners: HeroBanner[];
  speeches: SpeechesCMS;
  visionMission: VisionMissionCMS;
  newsArticles: NewsArticle[];
  galleryItems: GalleryItem[];
  achievements: StudentAchievement[];
  layoutConfig: WebsiteLayoutConfig;
  foundationProfile: FoundationProfile;
  teachers?: Teacher[];
  ppdbConfig?: PPDBConfig;
  onUpdatePpdbConfig?: (config: PPDBConfig) => void;
  onUpdateHeroBanners: (banners: HeroBanner[]) => void;
  onUpdateSpeeches: (speeches: SpeechesCMS) => void;
  onUpdateVisionMission: (vm: VisionMissionCMS) => void;
  onUpdateNewsArticles: (news: NewsArticle[]) => void;
  onUpdateGalleryItems: (gallery: GalleryItem[]) => void;
  onUpdateAchievements: (achievements: StudentAchievement[]) => void;
  onUpdateLayoutConfig: (config: WebsiteLayoutConfig) => void;
  onSaveProfile: (profile: FoundationProfile) => void;
  onUpdateTeacher?: (teacher: Teacher) => void;
  onDeleteTeacher?: (id: string) => void;
  onAddTeacher?: (teacher: Teacher) => void;
}

export const CmsAdminView: React.FC<CmsAdminViewProps> = ({
  userRole = 'SUPERADMIN',
  heroBanners,
  speeches,
  visionMission,
  newsArticles,
  galleryItems,
  achievements,
  layoutConfig,
  foundationProfile,
  teachers = [],
  ppdbConfig,
  onUpdatePpdbConfig,
  onUpdateHeroBanners,
  onUpdateSpeeches,
  onUpdateVisionMission,
  onUpdateNewsArticles,
  onUpdateGalleryItems,
  onUpdateAchievements,
  onUpdateLayoutConfig,
  onSaveProfile,
  onUpdateTeacher,
  onDeleteTeacher,
  onAddTeacher,
}) => {
  const [activeTab, setActiveTab] = useState<
    'layout' | 'branding_photos' | 'about_page' | 'org_structure' | 'banners' | 'speeches' | 'news' | 'gallery' | 'achievements' | 'ppdb'
  >('layout');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Local state copies
  const [localBanners, setLocalBanners] = useState<HeroBanner[]>(heroBanners);
  const [localSpeeches, setLocalSpeeches] = useState<SpeechesCMS>(speeches);
  const [localNews, setLocalNews] = useState<NewsArticle[]>(newsArticles);
  const [localGallery, setLocalGallery] = useState<GalleryItem[]>(galleryItems);
  const [localAchievements, setLocalAchievements] = useState<StudentAchievement[]>(achievements);
  const [localLayout, setLocalLayout] = useState<WebsiteLayoutConfig>(layoutConfig);
  const [localProfile, setLocalProfile] = useState<FoundationProfile>(foundationProfile);
  const [localVisionMission, setLocalVisionMission] = useState<VisionMissionCMS>(visionMission);
  const [localPpdbConfig, setLocalPpdbConfig] = useState<PPDBConfig>(ppdbConfig || INITIAL_PPDB_CONFIG);

  // New Org Structure Member state
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgPosition, setNewOrgPosition] = useState('');
  const [newOrgCategory, setNewOrgCategory] = useState<'YAYASAN' | 'SEKOLAH'>('SEKOLAH');
  const [newOrgNip, setNewOrgNip] = useState('');
  const [newOrgPhone, setNewOrgPhone] = useState('');
  const [newOrgEmail, setNewOrgEmail] = useState('');
  const [newOrgPhoto, setNewOrgPhoto] = useState('');

  // Editing Org Structure Member state
  const [editingOrgId, setEditingOrgId] = useState<string | null>(null);
  const [editOrgName, setEditOrgName] = useState('');
  const [editOrgPosition, setEditOrgPosition] = useState('');
  const [editOrgCategory, setEditOrgCategory] = useState<'YAYASAN' | 'SEKOLAH'>('YAYASAN');
  const [editOrgNip, setEditOrgNip] = useState('');
  const [editOrgPhone, setEditOrgPhone] = useState('');
  const [editOrgEmail, setEditOrgEmail] = useState('');

  // Editing Teacher / Staff state
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
  const [editTeacherName, setEditTeacherName] = useState('');
  const [editTeacherRole, setEditTeacherRole] = useState('');
  const [editTeacherSubject, setEditTeacherSubject] = useState('');
  const [editTeacherNipy, setEditTeacherNipy] = useState('');
  const [editTeacherPhotoUrl, setEditTeacherPhotoUrl] = useState('');

  // Synchronize with parent props when they change
  useEffect(() => { setLocalBanners(heroBanners); }, [heroBanners]);
  useEffect(() => { setLocalSpeeches(speeches); }, [speeches]);
  useEffect(() => { setLocalNews(newsArticles); }, [newsArticles]);
  useEffect(() => { setLocalGallery(galleryItems); }, [galleryItems]);
  useEffect(() => { setLocalAchievements(achievements); }, [achievements]);
  useEffect(() => { setLocalLayout(layoutConfig); }, [layoutConfig]);
  useEffect(() => { setLocalProfile(foundationProfile); }, [foundationProfile]);
  useEffect(() => { setLocalVisionMission(visionMission); }, [visionMission]);
  useEffect(() => { if (ppdbConfig) setLocalPpdbConfig(ppdbConfig); }, [ppdbConfig]);

  // New News Modal state
  const [newNewsTitle, setNewNewsTitle] = useState('');
  const [newNewsCategory, setNewNewsCategory] = useState<'BERITA' | 'PENGUMUMAN' | 'PRESTASI' | 'AGENDA'>('BERITA');
  const [newNewsExcerpt, setNewNewsExcerpt] = useState('');
  const [newNewsContent, setNewNewsContent] = useState('');
  const [newNewsImage, setNewNewsImage] = useState('');

  // New Gallery Item state
  const [newGalTitle, setNewGalTitle] = useState('');
  const [newGalType, setNewGalType] = useState<'photo' | 'video'>('photo');
  const [newGalUrl, setNewGalUrl] = useState('');
  const [newGalDesc, setNewGalDesc] = useState('');
  const [newGalCategory, setNewGalCategory] = useState<'Kegiatan Belajar' | 'Prestasi Siswa' | 'Fasilitas Kampus' | 'Acara Yayasan'>('Kegiatan Belajar');

  // New Achievement state
  const [newAchStudent, setNewAchStudent] = useState('');
  const [newAchGrade, setNewAchGrade] = useState('Kelas 5');
  const [newAchComp, setNewAchComp] = useState('');
  const [newAchTitle, setNewAchTitle] = useState('');
  const [newAchLevel, setNewAchLevel] = useState<'KABUPATEN' | 'PROVINSI' | 'NASIONAL' | 'INTERNASIONAL'>('PROVINSI');
  const [newAchPhoto, setNewAchPhoto] = useState('');

  const triggerSuccess = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Layout handlers
  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= localLayout.sections.length) return;

    const updatedSections = [...localLayout.sections];
    const temp = updatedSections[index];
    updatedSections[index] = updatedSections[newIndex];
    updatedSections[newIndex] = temp;

    // Re-assign order index
    const reordered = updatedSections.map((sec, idx) => ({ ...sec, order: idx + 1 }));
    const updatedConfig = { ...localLayout, sections: reordered };
    setLocalLayout(updatedConfig);
    onUpdateLayoutConfig(updatedConfig);
    triggerSuccess();
  };

  const handleToggleSection = (id: string) => {
    const updatedSections = localLayout.sections.map((sec) =>
      sec.id === id ? { ...sec, visible: !sec.visible } : sec
    );
    const updatedConfig = { ...localLayout, sections: updatedSections };
    setLocalLayout(updatedConfig);
    onUpdateLayoutConfig(updatedConfig);
    triggerSuccess();
  };

  const handleUpdateSectionTitle = (id: string, title: string) => {
    const updatedSections = localLayout.sections.map((sec) =>
      sec.id === id ? { ...sec, title } : sec
    );
    const updatedConfig = { ...localLayout, sections: updatedSections };
    setLocalLayout(updatedConfig);
    onUpdateLayoutConfig(updatedConfig);
  };

  const handleSaveLayout = () => {
    onUpdateLayoutConfig(localLayout);
    safeSetLocalStorage('yayasan_layout_config', localLayout);
    triggerSuccess();
  };

  const handleSaveProfilePhotos = () => {
    onSaveProfile(localProfile);
    safeSetLocalStorage('yayasan_profile', localProfile);
    triggerSuccess();
  };

  const handleSaveBanners = () => {
    onUpdateHeroBanners(localBanners);
    safeSetLocalStorage('yayasan_hero_banners', localBanners);
    triggerSuccess();
  };

  const handleAddBanner = () => {
    const newBanner: HeroBanner = {
      id: `banner-${Date.now()}`,
      title: 'Judul Banner Baru',
      subtitle: 'Deskripsi banner singkat untuk pengunjung website...',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    };
    const updated = [...localBanners, newBanner];
    setLocalBanners(updated);
    onUpdateHeroBanners(updated);
    safeSetLocalStorage('yayasan_hero_banners', updated);
    triggerSuccess();
  };

  const handleDeleteBanner = (id: string) => {
    if (localBanners.length <= 1) {
      alert('Minimal harus ada 1 banner slide!');
      return;
    }
    const updated = localBanners.filter((b) => b.id !== id);
    setLocalBanners(updated);
    onUpdateHeroBanners(updated);
    safeSetLocalStorage('yayasan_hero_banners', updated);
    triggerSuccess();
  };

  const handleSaveSpeeches = () => {
    onUpdateSpeeches(localSpeeches);
    safeSetLocalStorage('yayasan_speeches', localSpeeches);
    onSaveProfile(localProfile);
    safeSetLocalStorage('yayasan_profile', localProfile);
    triggerSuccess();
  };

  const handleSaveNewsList = () => {
    onUpdateNewsArticles(localNews);
    safeSetLocalStorage('yayasan_news_articles', localNews);
    triggerSuccess();
  };

  const handleSaveGalleryList = () => {
    onUpdateGalleryItems(localGallery);
    safeSetLocalStorage('yayasan_gallery_items', localGallery);
    triggerSuccess();
  };

  const handleSaveAchievementsList = () => {
    onUpdateAchievements(localAchievements);
    safeSetLocalStorage('yayasan_achievements', localAchievements);
    triggerSuccess();
  };

  const handleSaveOrgStructure = () => {
    onSaveProfile(localProfile);
    safeSetLocalStorage('yayasan_profile', localProfile);
    triggerSuccess();
  };

  const handleAddOrgMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName || !newOrgPosition) return;

    const currentMembers = localProfile.orgStructure || [];
    const newMember: OrgStructureMember = {
      id: `org-${Date.now()}`,
      name: newOrgName,
      position: newOrgPosition,
      category: newOrgCategory,
      nipOrNipy: newOrgNip,
      phone: newOrgPhone,
      email: newOrgEmail,
      photoUrl: newOrgPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      order: currentMembers.length + 1,
    };

    const updated = [...currentMembers, newMember];
    const updatedProfile = { ...localProfile, orgStructure: updated };
    setLocalProfile(updatedProfile);
    onSaveProfile(updatedProfile);

    setNewOrgName('');
    setNewOrgPosition('');
    setNewOrgNip('');
    setNewOrgPhone('');
    setNewOrgEmail('');
    setNewOrgPhoto('');
    triggerSuccess();
  };

  const handleDeleteOrgMember = (id: string) => {
    const currentMembers = localProfile.orgStructure || [];
    const updated = currentMembers.filter((m) => m.id !== id);
    const updatedProfile = { ...localProfile, orgStructure: updated };
    setLocalProfile(updatedProfile);
    onSaveProfile(updatedProfile);
    triggerSuccess();
  };

  const handleMoveOrgMember = (index: number, direction: 'up' | 'down') => {
    const currentMembers = [...(localProfile.orgStructure || [])];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= currentMembers.length) return;

    const [moved] = currentMembers.splice(index, 1);
    currentMembers.splice(newIndex, 0, moved);

    const reordered = currentMembers.map((m, idx) => ({ ...m, order: idx + 1 }));
    const updatedProfile = { ...localProfile, orgStructure: reordered };
    setLocalProfile(updatedProfile);
    onSaveProfile(updatedProfile);
    triggerSuccess();
  };

  const handleAddNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNewsTitle || !newNewsExcerpt) return;

    const item: NewsArticle = {
      id: `news-${Date.now()}`,
      title: newNewsTitle,
      category: newNewsCategory,
      date: new Date().toISOString().split('T')[0],
      author: 'Humas Yayasan',
      excerpt: newNewsExcerpt,
      content: newNewsContent || newNewsExcerpt,
      imageUrl: newNewsImage || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
      isFeatured: false,
    };

    const updated = [item, ...localNews];
    setLocalNews(updated);
    onUpdateNewsArticles(updated);

    setNewNewsTitle('');
    setNewNewsExcerpt('');
    setNewNewsContent('');
    setNewNewsImage('');
    triggerSuccess();
  };

  const handleDeleteNews = (id: string) => {
    const updated = localNews.filter((n) => n.id !== id);
    setLocalNews(updated);
    onUpdateNewsArticles(updated);
  };

  const handleAddGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalTitle || !newGalUrl) return;

    const item: GalleryItem = {
      id: `gal-${Date.now()}`,
      title: newGalTitle,
      type: newGalType,
      url: newGalUrl,
      description: newGalDesc,
      date: new Date().toISOString().split('T')[0],
      category: newGalCategory,
    };

    const updated = [item, ...localGallery];
    setLocalGallery(updated);
    onUpdateGalleryItems(updated);

    setNewGalTitle('');
    setNewGalUrl('');
    setNewGalDesc('');
    triggerSuccess();
  };

  const handleDeleteGallery = (id: string) => {
    const updated = localGallery.filter((g) => g.id !== id);
    setLocalGallery(updated);
    onUpdateGalleryItems(updated);
  };

  const handleAddAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAchStudent || !newAchComp) return;

    const item: StudentAchievement = {
      id: `ach-${Date.now()}`,
      studentName: newAchStudent,
      gradeClass: newAchGrade,
      competitionName: newAchComp,
      achievementTitle: newAchTitle,
      level: newAchLevel,
      year: new Date().getFullYear().toString(),
      photoUrl: newAchPhoto || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=400&q=80',
    };

    const updated = [item, ...localAchievements];
    setLocalAchievements(updated);
    onUpdateAchievements(updated);

    setNewAchStudent('');
    setNewAchComp('');
    setNewAchTitle('');
    setNewAchPhoto('');
    triggerSuccess();
  };

  const handleDeleteAchievement = (id: string) => {
    const updated = localAchievements.filter((a) => a.id !== id);
    setLocalAchievements(updated);
    onUpdateAchievements(updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 rounded-3xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-700">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-black rounded-full border border-emerald-500/30">
            <Settings className="w-3.5 h-3.5" /> Akses Khusus CMS & Penataan Layout
          </div>
          <h2 className="text-2xl font-black text-white">Penataan Layout Website & Pengaturan Foto Profesional</h2>
          <p className="text-xs text-slate-300">
            Atur urutan seksi web, gaya bingkai foto, warna tema, serta upload foto logo, gedung, banner, berita, galeri, dan prestasi siswa secara instan.
          </p>
        </div>

        {saveSuccess && (
          <div className="px-4 py-2 bg-emerald-500 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            <span>Perubahan Berhasil Disimpan & Tampil Live!</span>
          </div>
        )}
      </div>

      {/* Otorisasi Admin Sekolah Banner */}
      <div className="p-4 bg-gradient-to-r from-indigo-950 via-slate-900 to-blue-950 text-white rounded-2xl border border-indigo-500/40 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-yellow-400 text-slate-950 rounded-xl font-black text-xs shrink-0 shadow-md">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 bg-yellow-400/20 text-yellow-300 rounded-md border border-yellow-400/30 tracking-wider">
                Otorisasi Input Admin Sekolah
              </span>
              <span className="text-xs font-extrabold text-sky-200">
                {userRole === 'KEPALA_SEKOLAH' ? 'Akses Kepala Sekolah / Admin Sekolah' : userRole === 'BENDAHARA_SEKOLAH' ? 'Akses Bendahara Sekolah' : 'Akses Modul CMS Admin'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 font-medium">
              Admin Sekolah berwenang penuh menginput <strong className="text-yellow-300">Berita & Pengumuman</strong>, <strong className="text-yellow-300">Galeri Foto/Video Aktivitas</strong>, serta <strong className="text-yellow-300">Medali & Prestasi Sekolah</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => setActiveTab('news')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${activeTab === 'news' ? 'bg-yellow-400 text-slate-950 shadow' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'}`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Input Berita</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('gallery')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${activeTab === 'gallery' ? 'bg-yellow-400 text-slate-950 shadow' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'}`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Upload Galeri</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('achievements')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${activeTab === 'achievements' ? 'bg-yellow-400 text-slate-950 shadow' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'}`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Input Prestasi</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-2">
        {[
          { id: 'layout', label: 'Penataan Layout & Desain Foto', icon: Layout },
          { id: 'branding_photos', label: 'Foto Logo & Gedung', icon: Building2 },
          { id: 'about_page', label: 'Pengaturan Halaman Tentang', icon: Info },
          { id: 'org_structure', label: 'Struktur Organisasi Yayasan & Sekolah', icon: Users },
          { id: 'banners', label: 'Slide Hero Banner', icon: ImageIcon },
          { id: 'speeches', label: 'Pidato & Foto Pimpinan', icon: FileText },
          { id: 'news', label: 'Foto & Berita Sekolah', icon: Layers },
          { id: 'gallery', label: 'Upload Galeri Foto/Video', icon: Video },
          { id: 'achievements', label: 'Foto Prestasi Siswa', icon: Award },
          { id: 'ppdb', label: 'Pengaturan PPDB & Biaya', icon: GraduationCap },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: PENATAAN LAYOUT & DESAIN FOTO ================= */}
      {activeTab === 'layout' && (
        <div className="space-y-6">
          {/* Layout Section Ordering */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-blue-600" />
                  <span>Atur Urutan & Tampilan Seksi Website</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Gunakan tombol panah ke atas/bawah untuk mengubah urutan seksi, ubah judul seksi, atau sembunyikan seksi yang tidak aktif.
                </p>
              </div>
              <button
                onClick={handleSaveLayout}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Penataan Layout</span>
              </button>
            </div>

            <div className="space-y-3">
              {localLayout.sections.map((sec, idx) => {
                return (
                  <div
                    key={sec.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      sec.visible
                        ? 'bg-slate-50 border-slate-200 hover:border-blue-300'
                        : 'bg-slate-100/60 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 font-mono font-black text-xs flex items-center justify-center shrink-0">
                        #{idx + 1}
                      </span>
                      <input
                        type="text"
                        value={sec.title}
                        onChange={(e) => handleUpdateSectionTitle(sec.id, e.target.value)}
                        className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-auto">
                      {/* Up button */}
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveSection(idx, 'up')}
                        className="p-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-blue-50 disabled:opacity-30 cursor-pointer"
                        title="Geser Ke Atas"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>

                      {/* Down button */}
                      <button
                        type="button"
                        disabled={idx === localLayout.sections.length - 1}
                        onClick={() => handleMoveSection(idx, 'down')}
                        className="p-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-blue-50 disabled:opacity-30 cursor-pointer"
                        title="Geser Ke Bawah"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>

                      {/* Toggle show/hide */}
                      <button
                        type="button"
                        onClick={() => handleToggleSection(sec.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                          sec.visible
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                      >
                        {sec.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        <span>{sec.visible ? 'Tampil' : 'Sembunyi'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Theme Palette & Photo Formatting Rules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tema Warna & Header Style */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Palette className="w-4 h-4 text-emerald-600" />
                  <span>Pilihan Tema Warna & Navbar Header</span>
                </h3>
                <p className="text-[11px] text-slate-500">Sesuaikan warna dominan website sekolah Anda.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Skema Warna Website:</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'indigo_royal', name: 'Indigo Royal Navy', bg: 'bg-indigo-900 text-white' },
                    { id: 'emerald_islamic', name: 'Emerald Islamic Modern', bg: 'bg-emerald-800 text-white' },
                    { id: 'sapphire_modern', name: 'Sapphire Ocean Blue', bg: 'bg-blue-700 text-white' },
                    { id: 'slate_corporate', name: 'Slate Dark Corporate', bg: 'bg-slate-800 text-white' },
                    { id: 'amber_warm', name: 'Warm Amber Gold', bg: 'bg-amber-800 text-white' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        const updated = { ...localLayout, themePalette: p.id as any };
                        setLocalLayout(updated);
                        onUpdateLayoutConfig(updated);
                        triggerSuccess();
                      }}
                      className={`p-3 rounded-2xl font-bold text-xs text-left transition border-2 flex items-center justify-between cursor-pointer ${p.bg} ${
                        localLayout.themePalette === p.id ? 'border-amber-400 ring-2 ring-amber-300' : 'border-transparent'
                      }`}
                    >
                      <span>{p.name}</span>
                      {localLayout.themePalette === p.id && <Sparkles className="w-4 h-4 text-amber-300" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Desain Header Navbar:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'gradient_dark', name: 'Dark Gradient' },
                    { id: 'clean_white', name: 'Clean White' },
                    { id: 'glassmorphism', name: 'Glassmorphism' },
                  ].map((h) => (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => {
                        const updated = { ...localLayout, headerStyle: h.id as any };
                        setLocalLayout(updated);
                        onUpdateLayoutConfig(updated);
                        triggerSuccess();
                      }}
                      className={`p-2.5 rounded-xl font-bold text-xs border text-center transition cursor-pointer ${
                        localLayout.headerStyle === h.id
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {h.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Tampilan Slide Hero Banner:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'slider_overlay', name: 'Full Slider Overlay' },
                    { id: 'split_right', name: 'Split Text & Media' },
                    { id: 'minimal_card', name: 'Minimal Card Floating' },
                  ].map((hero) => (
                    <button
                      key={hero.id}
                      type="button"
                      onClick={() => {
                        const updated = { ...localLayout, heroStyle: hero.id as any };
                        setLocalLayout(updated);
                        onUpdateLayoutConfig(updated);
                        triggerSuccess();
                      }}
                      className={`p-2.5 rounded-xl font-bold text-xs border text-center transition cursor-pointer ${
                        localLayout.heroStyle === hero.id
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {hero.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Styling Foto & Grid Layout */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Grid className="w-4 h-4 text-blue-600" />
                  <span>Pengaturan Tampilan Foto & Jumlah Kolom Grid</span>
                </h3>
                <p className="text-[11px] text-slate-500">Agar semua foto terlihat seragam dan profesional.</p>
              </div>

              {/* Border radius foto */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Bentuk Lengkung Sudut Foto (Border Radius):</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'rounded-3xl', name: 'Besar (24px)' },
                    { id: 'rounded-2xl', name: 'Sedang (16px)' },
                    { id: 'rounded-xl', name: 'Kecil (12px)' },
                    { id: 'rounded-none', name: 'Siku (0px)' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        const updated = {
                          ...localLayout,
                          photoStyle: { ...localLayout.photoStyle, borderRadius: r.id as any },
                        };
                        setLocalLayout(updated);
                        onUpdateLayoutConfig(updated);
                        triggerSuccess();
                      }}
                      className={`p-2 rounded-xl text-[11px] font-bold border transition text-center cursor-pointer ${
                        localLayout.photoStyle.borderRadius === r.id
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {r.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fit mode */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Mode Penyesuaian Foto (Image Fit):</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'cover', name: 'Cover (Isi Penuh & Crop Rapi)' },
                    { id: 'contain', name: 'Contain (Tampak Utuh)' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => {
                        const updated = {
                          ...localLayout,
                          photoStyle: { ...localLayout.photoStyle, imageFit: f.id as any },
                        };
                        setLocalLayout(updated);
                        onUpdateLayoutConfig(updated);
                        triggerSuccess();
                      }}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition text-center cursor-pointer ${
                        localLayout.photoStyle.imageFit === f.id
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Jumlah Kolom Grid */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Jumlah Kolom Grid Galeri & Berita:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[2, 3, 4].map((cols) => (
                    <button
                      key={cols}
                      type="button"
                      onClick={() => {
                        const updated = {
                          ...localLayout,
                          gridColumns: {
                            galleryCols: cols as any,
                            newsCols: cols as any,
                            achievementCols: cols as any,
                          },
                        };
                        setLocalLayout(updated);
                        onUpdateLayoutConfig(updated);
                        triggerSuccess();
                      }}
                      className={`p-2 rounded-xl text-xs font-bold border transition text-center cursor-pointer ${
                        localLayout.gridColumns.galleryCols === cols
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cols} Kolom
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: FOTO LOGO & GEDUNG YAYASAN ================= */}
      {activeTab === 'branding_photos' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Edit Foto Logo Resmi & Foto Gedung Sekolah</h3>
              <p className="text-xs text-slate-500">
                Ganti logo yayasan/sekolah & foto gedung utama yang tampil di header & footer website.
              </p>
            </div>
            <button
              onClick={handleSaveProfilePhotos}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Foto Logo & Gedung</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <span className="text-xs font-black text-slate-700 uppercase">1. Logo Resmi Sekolah / Yayasan</span>
              <MediaUploader
                label="Upload Logo Baru (atau pilih preset HD)"
                value={localProfile.logoUrl || ''}
                onChange={(url) => {
                  const updated = { ...localProfile, logoUrl: url };
                  setLocalProfile(updated);
                  onSaveProfile(updated);
                }}
                mediaType="photo"
              />
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <span className="text-xs font-black text-slate-700 uppercase">2. Foto Gedung Utama Kampus Sekolah</span>
              <MediaUploader
                label="Upload Foto Gedung / Lingkungan Sekolah"
                value={localProfile.buildingPhotoUrl || ''}
                onChange={(url) => {
                  const updated = { ...localProfile, buildingPhotoUrl: url };
                  setLocalProfile(updated);
                  onSaveProfile(updated);
                }}
                mediaType="photo"
              />
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB: PENGATURAN HALAMAN TENTANG ================= */}
      {activeTab === 'about_page' && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-[10px] font-extrabold uppercase border border-blue-200">
                  Fasilitas Edit Website
                </span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                <span>Pengaturan Konten Halaman Tentang Sekolah</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Ubah judul profil, sejarah & filosofi pendirian, foto gedung sekolah, visi & misi, serta informasi kontak & legalitas.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onSaveProfile(localProfile);
                onUpdateVisionMission(localVisionMission);
                triggerSuccess();
              }}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan Halaman Tentang</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Column 1: Judul, Subtitle & Sejarah */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h4 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>1. Judul Profil & Sejarah Pendirian</span>
              </h4>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul Utama Halaman Tentang</label>
                <input
                  type="text"
                  value={localProfile.aboutTitle || ''}
                  onChange={(e) => setLocalProfile({ ...localProfile, aboutTitle: e.target.value })}
                  placeholder="Profil & Sejarah Yayasan Pendidikan Daarul Habibah"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sub-Judul / Slogan Sekolah</label>
                <input
                  type="text"
                  value={localProfile.aboutSubtitle || ''}
                  onChange={(e) => setLocalProfile({ ...localProfile, aboutSubtitle: e.target.value })}
                  placeholder="Menciptakan Generasi Rabbani Berprestasi & Berkarakter"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ringkasan Singkat Profil</label>
                <textarea
                  rows={2}
                  value={localProfile.aboutDescription || ''}
                  onChange={(e) => setLocalProfile({ ...localProfile, aboutDescription: e.target.value })}
                  placeholder="Ringkasan singkat yang tampil di beranda dan halaman profil..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sejarah & Filosofi Pendirian (Teks Lengkap)</label>
                <textarea
                  rows={6}
                  value={localProfile.aboutHistory || ''}
                  onChange={(e) => setLocalProfile({ ...localProfile, aboutHistory: e.target.value })}
                  placeholder="Tuliskan latar belakang, sejarah pendirian, filosofi pendidikan, dan perkembangan sekolah..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 leading-relaxed"
                />
              </div>
            </div>

            {/* Column 2: Foto Gedung & Visi Misi */}
            <div className="space-y-6">
              {/* Foto Gedung */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h4 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>2. Foto Gedung Utama Kampus</span>
                </h4>
                <MediaUploader
                  label="Upload / Pilih Foto Gedung Utama Sekolah"
                  value={localProfile.buildingPhotoUrl || ''}
                  onChange={(url) => {
                    const updated = { ...localProfile, buildingPhotoUrl: url };
                    setLocalProfile(updated);
                  }}
                  mediaType="photo"
                />
              </div>

              {/* Visi & Misi Editor */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h4 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>3. Visi & Misi Strategis Sekolah</span>
                </h4>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Visi Utama Yayasan / Sekolah</label>
                  <textarea
                    rows={2}
                    value={localVisionMission.vision}
                    onChange={(e) => setLocalVisionMission({ ...localVisionMission, vision: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-bold text-slate-700">Misi Strategis Sekolah</label>
                    <button
                      type="button"
                      onClick={() => {
                        const newMissions = [...localVisionMission.mission, 'Misi baru sekolah...'];
                        setLocalVisionMission({ ...localVisionMission, mission: newMissions });
                      }}
                      className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-lg text-[11px] font-bold hover:bg-blue-200 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Misi</span>
                    </button>
                  </div>

                  {localVisionMission.mission.map((m, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={m}
                        onChange={(e) => {
                          const updatedMissions = [...localVisionMission.mission];
                          updatedMissions[idx] = e.target.value;
                          setLocalVisionMission({ ...localVisionMission, mission: updatedMissions });
                        }}
                        className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updatedMissions = localVisionMission.mission.filter((_, i) => i !== idx);
                          setLocalVisionMission({ ...localVisionMission, mission: updatedMissions });
                        }}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                        title="Hapus Misi"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Legalitas & Kontak Section */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>4. Legalitas Kemenkumham & Kontak Resmi</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Resmi Yayasan / Sekolah</label>
                <input
                  type="text"
                  value={localProfile.name}
                  onChange={(e) => setLocalProfile({ ...localProfile, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nomor Pengesahan Kemenkumham</label>
                <input
                  type="text"
                  value={localProfile.legalNumber}
                  onChange={(e) => setLocalProfile({ ...localProfile, legalNumber: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nomor Telepon / Hotline</label>
                <input
                  type="text"
                  value={localProfile.phone}
                  onChange={(e) => setLocalProfile({ ...localProfile, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Resmi</label>
                <input
                  type="email"
                  value={localProfile.email}
                  onChange={(e) => setLocalProfile({ ...localProfile, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Website Domain</label>
                <input
                  type="text"
                  value={localProfile.website}
                  onChange={(e) => setLocalProfile({ ...localProfile, website: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Lengkap Gedung</label>
                <input
                  type="text"
                  value={localProfile.address}
                  onChange={(e) => setLocalProfile({ ...localProfile, address: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  onSaveProfile(localProfile);
                  onUpdateVisionMission(localVisionMission);
                  triggerSuccess();
                }}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Seluruh Pengaturan Halaman Tentang</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB: STRUKTUR ORGANISASI YAYASAN & SEKOLAH ================= */}
      {activeTab === 'org_structure' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-[10px] font-extrabold uppercase border border-blue-200">
                  Data Pengaturan CMS
                </span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>Struktur Organisasi Yayasan & Sekolah</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Kelola jajaran pengurus Yayasan (Pembina, Ketua, Sekretaris, Bendahara) dan pimpinan Sekolah (Kepala Sekolah, Wakasek, Guru Rombel) yang akan ditampilkan secara resmi pada halaman publik.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSaveOrgStructure}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Struktur Organisasi</span>
            </button>
          </div>

          {/* Form Tambah Anggota Struktur Baru */}
          <form onSubmit={handleAddOrgMember} className="bg-white p-6 rounded-3xl border border-blue-200 shadow-md space-y-4">
            <h4 className="font-extrabold text-slate-900 text-sm border-b border-blue-50 pb-2 flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-600" />
              <span>Tambah Pejabat / Anggota Struktur Baru</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Organisasi</label>
                <select
                  value={newOrgCategory}
                  onChange={(e) => setNewOrgCategory(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                >
                  <option value="YAYASAN">Pengurus Yayasan</option>
                  <option value="SEKOLAH">Pimpinan / Guru Sekolah</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Jabatan / Posisi</label>
                <input
                  type="text"
                  required
                  value={newOrgPosition}
                  onChange={(e) => setNewOrgPosition(e.target.value)}
                  placeholder="Contoh: Ketua Pembina / Wakasek Kurikulum..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  required
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  placeholder="Contoh: Drs. H. M. Syukri, M.M"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">NIP / NIPY (Opsional)</label>
                <input
                  type="text"
                  value={newOrgNip}
                  onChange={(e) => setNewOrgNip(e.target.value)}
                  placeholder="Contoh: NIPY. 20100101"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nomor HP / WhatsApp</label>
                <input
                  type="text"
                  value={newOrgPhone}
                  onChange={(e) => setNewOrgPhone(e.target.value)}
                  placeholder="Contoh: 0812-3456-7890"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Resmi</label>
                <input
                  type="email"
                  value={newOrgEmail}
                  onChange={(e) => setNewOrgEmail(e.target.value)}
                  placeholder="Contoh: nama@daarulhabibah.or.id"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>
            </div>

            <MediaUploader
              label="Upload Foto Profil Pejabat (atau Pilih Preset HD)"
              value={newOrgPhoto}
              onChange={(url) => setNewOrgPhoto(url)}
              mediaType="photo"
            />

            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Simpan Anggota Struktur</span>
            </button>
          </form>

          {/* List of Org Members */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Daftar Anggota Struktur Terdaftar ({localProfile.orgStructure?.length || 0})</span>
            </h4>

            {(!localProfile.orgStructure || localProfile.orgStructure.length === 0) ? (
              <p className="text-xs text-slate-500 italic py-4 text-center">Belum ada data anggota struktur organisasi.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {localProfile.orgStructure.map((member, idx) => {
                  const isEditingThisOrg = editingOrgId === member.id;
                  return (
                    <div
                      key={member.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between gap-3 shadow-sm"
                    >
                      {isEditingThisOrg ? (
                        <div className="space-y-3 bg-white p-3 rounded-xl border border-blue-200">
                          <div className="flex justify-between items-center border-b pb-2">
                            <span className="text-xs font-black text-blue-900">Edit Data Anggota Struktur</span>
                            <button
                              type="button"
                              onClick={() => setEditingOrgId(null)}
                              className="text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Nama Lengkap & Gelar</label>
                            <input
                              type="text"
                              value={editOrgName}
                              onChange={(e) => setEditOrgName(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Jabatan / Posisi</label>
                            <input
                              type="text"
                              value={editOrgPosition}
                              onChange={(e) => setEditOrgPosition(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Kategori</label>
                              <select
                                value={editOrgCategory}
                                onChange={(e) => setEditOrgCategory(e.target.value as any)}
                                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 text-xs font-bold"
                              >
                                <option value="YAYASAN">Pengurus Yayasan</option>
                                <option value="SEKOLAH">Pimpinan Sekolah</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 mb-0.5">NIP / NIPY</label>
                              <input
                                type="text"
                                value={editOrgNip}
                                onChange={(e) => setEditOrgNip(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 text-xs"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setEditingOrgId(null)}
                              className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
                            >
                              Batal
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = (localProfile.orgStructure || []).map((m) =>
                                  m.id === member.id
                                    ? {
                                        ...m,
                                        name: editOrgName,
                                        position: editOrgPosition,
                                        category: editOrgCategory,
                                        nipOrNipy: editOrgNip,
                                        phone: editOrgPhone,
                                        email: editOrgEmail,
                                      }
                                    : m
                                );
                                const updatedProfile = { ...localProfile, orgStructure: updated };
                                setLocalProfile(updatedProfile);
                                onSaveProfile(updatedProfile);
                                setEditingOrgId(null);
                                triggerSuccess();
                              }}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>Simpan</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-3 justify-between">
                          <div className="flex items-start gap-3">
                            <div className="relative shrink-0">
                              <img
                                src={member.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                                alt={member.name}
                                className="w-24 sm:w-28 aspect-[4/5] rounded-xl object-cover object-top border-2 border-slate-300 shadow-sm"
                              />
                              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.2 bg-slate-900/80 text-white text-[8px] font-bold rounded-full whitespace-nowrap">
                                4x5 cm
                              </span>
                            </div>
                            <div className="space-y-1">
                              <span className={`px-2 py-0.5 text-[10px] font-black rounded-md uppercase ${
                                member.category === 'YAYASAN' ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-900'
                              }`}>
                                {member.category === 'YAYASAN' ? 'Pengurus Yayasan' : 'Pimpinan Sekolah'}
                              </span>
                              <h5 className="font-extrabold text-slate-900 text-xs">{member.name}</h5>
                              <p className="text-xs font-bold text-blue-700">{member.position}</p>
                              {member.nipOrNipy && <p className="text-[11px] text-slate-500">{member.nipOrNipy}</p>}
                              {member.phone && <p className="text-[11px] text-slate-500">{member.phone}</p>}
                            </div>
                          </div>

                          <div className="flex flex-col gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingOrgId(member.id);
                                setEditOrgName(member.name);
                                setEditOrgPosition(member.position);
                                setEditOrgCategory(member.category);
                                setEditOrgNip(member.nipOrNipy || '');
                                setEditOrgPhone(member.phone || '');
                                setEditOrgEmail(member.email || '');
                              }}
                              className="p-1.5 bg-blue-100 text-blue-800 hover:bg-blue-200 rounded-lg text-xs font-bold cursor-pointer flex items-center justify-center"
                              title="Edit Data Anggota"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMoveOrgMember(idx, 'up')}
                              className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-blue-50 disabled:opacity-30 cursor-pointer"
                              title="Geser Ke Atas"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === (localProfile.orgStructure?.length || 0) - 1}
                              onClick={() => handleMoveOrgMember(idx, 'down')}
                              className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-blue-50 disabled:opacity-30 cursor-pointer"
                              title="Geser Ke Bawah"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteOrgMember(member.id)}
                              className="p-1.5 bg-rose-100 text-rose-700 hover:bg-rose-200 rounded-lg text-xs font-bold cursor-pointer"
                              title="Hapus"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Inline Photo Editor */}
                      <div className="pt-2 border-t border-slate-200/80">
                        <MediaUploader
                          label={`Ubah Foto "${member.name}"`}
                          value={member.photoUrl || ''}
                          onChange={(newUrl) => {
                            const updated = (localProfile.orgStructure || []).map((m) =>
                              m.id === member.id ? { ...m, photoUrl: newUrl } : m
                            );
                            const updatedProfile = { ...localProfile, orgStructure: updated };
                            setLocalProfile(updatedProfile);
                            onSaveProfile(updatedProfile);
                            triggerSuccess();
                          }}
                          mediaType="photo"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Master Data Teacher Photo & Operational Management (Filter foundation out) */}
          {(() => {
            const operationalTeachers = teachers.filter((t) => {
              const role = (t.role || '').toLowerCase();
              const notes = (t.notes || '').toLowerCase();
              const rombel = (t.assignedRombel || '').toLowerCase();
              return (
                !role.includes('pembina') &&
                !role.includes('ketua yayasan') &&
                !role.includes('sekretaris yayasan') &&
                !role.includes('bendahara yayasan') &&
                !notes.includes('pengurus yayasan') &&
                !rombel.includes('pengurus yayasan')
              );
            });

            return (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-emerald-600" />
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base">
                        Pengaturan Foto Guru & Staf Operasional Sekolah ({operationalTeachers.length} Orang)
                      </h4>
                      <p className="text-xs text-slate-500">
                        Hanya menampilkan 11 staf operasional sekolah (tanpa pengurus yayasan). Disediakan tombol Edit & Hapus untuk tiap personil.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {operationalTeachers.map((teacher) => {
                    const isEditingThisTeacher = editingTeacherId === teacher.id;

                    return (
                      <div
                        key={teacher.id}
                        className="p-4 rounded-2xl border border-slate-200 bg-slate-50/80 space-y-3 relative group"
                      >
                        {isEditingThisTeacher ? (
                          <div className="space-y-3 bg-white p-3 rounded-xl border border-emerald-300 shadow-sm">
                            <div className="flex justify-between items-center border-b pb-2">
                              <span className="text-xs font-black text-emerald-900">Edit Data Guru / Staf Operasional</span>
                              <button
                                type="button"
                                onClick={() => setEditingTeacherId(null)}
                                className="text-slate-400 hover:text-slate-600 cursor-pointer"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Nama Lengkap & Gelar</label>
                              <input
                                type="text"
                                value={editTeacherName}
                                onChange={(e) => setEditTeacherName(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Jabatan / Role</label>
                                <input
                                  type="text"
                                  value={editTeacherRole}
                                  onChange={(e) => setEditTeacherRole(e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 text-xs font-semibold"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Mata Pelajaran / Tugas</label>
                                <input
                                  type="text"
                                  value={editTeacherSubject}
                                  onChange={(e) => setEditTeacherSubject(e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 text-xs font-semibold"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 mb-0.5">NIPY / NIP</label>
                              <input
                                type="text"
                                value={editTeacherNipy}
                                onChange={(e) => setEditTeacherNipy(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 text-xs"
                              />
                            </div>
                            <div className="flex justify-end gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => setEditingTeacherId(null)}
                                className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
                              >
                                Batal
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (onUpdateTeacher) {
                                    onUpdateTeacher({
                                      ...teacher,
                                      name: editTeacherName,
                                      role: editTeacherRole,
                                      subject: editTeacherSubject,
                                      nipy: editTeacherNipy,
                                      photoUrl: editTeacherPhotoUrl || teacher.photoUrl,
                                    });
                                    setEditingTeacherId(null);
                                    triggerSuccess();
                                  }
                                }}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                              >
                                <Save className="w-3.5 h-3.5" />
                                <span>Simpan Perubahan</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={teacher.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                                  alt={teacher.name}
                                  className="w-18 h-24 rounded-xl object-cover object-top shrink-0 border border-slate-300 shadow-sm"
                                />
                                <div>
                                  <h5 className="font-extrabold text-slate-900 text-xs">{teacher.name}</h5>
                                  <p className="text-[11px] font-bold text-emerald-700">{teacher.role || teacher.subject}</p>
                                  <p className="text-[10px] text-slate-500">
                                    {teacher.subject && teacher.subject !== teacher.role ? `${teacher.subject} • ` : ''}NIPY: {teacher.nipy || teacher.nip || '-'}
                                  </p>
                                </div>
                              </div>

                              {/* Action Buttons: Edit & Delete */}
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingTeacherId(teacher.id);
                                    setEditTeacherName(teacher.name);
                                    setEditTeacherRole(teacher.role || '');
                                    setEditTeacherSubject(teacher.subject || '');
                                    setEditTeacherNipy(teacher.nipy || teacher.nip || '');
                                    setEditTeacherPhotoUrl(teacher.photoUrl || '');
                                  }}
                                  className="px-2.5 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                                  title="Edit Data Guru"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                  <span>Edit</span>
                                </button>
                                {onDeleteTeacher && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (confirm(`Apakah Anda yakin ingin menghapus data "${teacher.name}" dari daftar guru?`)) {
                                        onDeleteTeacher(teacher.id);
                                        triggerSuccess();
                                      }
                                    }}
                                    className="px-2.5 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                                    title="Hapus Guru"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Hapus</span>
                                  </button>
                                )}
                              </div>
                            </div>

                            <MediaUploader
                              label={`Foto Profil: ${teacher.name}`}
                              value={teacher.photoUrl || ''}
                              onChange={(url) => {
                                if (onUpdateTeacher) {
                                  onUpdateTeacher({ ...teacher, photoUrl: url });
                                  triggerSuccess();
                                }
                              }}
                              mediaType="photo"
                            />
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ================= TAB 3: BANNER EDITOR ================= */}
      {activeTab === 'banners' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Edit Slide Hero Banner Home</h3>
              <p className="text-xs text-slate-500">
                Setiap perubahan foto, video, atau teks banner akan otomatis tersimpan & tampil di halaman utama web.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddBanner}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Slide Banner</span>
              </button>
              <button
                onClick={handleSaveBanners}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan Banner</span>
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {localBanners.map((banner, idx) => (
              <div key={banner.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="text-xs font-black text-slate-700 uppercase">Slide Banner #{idx + 1}</span>
                  {localBanners.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteBanner(banner.id)}
                      className="px-2.5 py-1 bg-rose-100 text-rose-700 hover:bg-rose-200 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus Slide</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Judul Utama Banner</label>
                      <input
                        type="text"
                        value={banner.title}
                        onChange={(e) => {
                          const updated = [...localBanners];
                          updated[idx].title = e.target.value;
                          setLocalBanners(updated);
                          onUpdateHeroBanners(updated);
                        }}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Sub-judul / Deskripsi Banner</label>
                      <textarea
                        rows={3}
                        value={banner.subtitle}
                        onChange={(e) => {
                          const updated = [...localBanners];
                          updated[idx].subtitle = e.target.value;
                          setLocalBanners(updated);
                          onUpdateHeroBanners(updated);
                        }}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <MediaUploader
                      label="Upload Foto/Video Banner dari Komputer (atau preset HD)"
                      value={banner.imageUrl}
                      onChange={(url) => {
                        const updated = [...localBanners];
                        updated[idx].imageUrl = url;
                        setLocalBanners(updated);
                        onUpdateHeroBanners(updated);
                      }}
                      mediaType="any"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 4: SPEECHES EDITOR ================= */}
      {activeTab === 'speeches' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Edit Teks Pidato / Sambutan Pengurus Yayasan & Kepala Sekolah</h3>
              <p className="text-xs text-slate-500">
                Upload foto pimpinan & edit teks sambutan pidato resmi Pembina, Ketua, Sekretaris, Bendahara Yayasan & Kepala Sekolah.
              </p>
            </div>
            <button
              onClick={handleSaveSpeeches}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Pidato Pimpinan</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {/* 1. Ketua Pembina */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-black text-slate-700 uppercase">1. Sambutan Ketua Pembina Yayasan</span>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap & Gelar</label>
                  <input
                    type="text"
                    value={localSpeeches.chairmanName}
                    onChange={(e) => {
                      const updated = { ...localSpeeches, chairmanName: e.target.value };
                      setLocalSpeeches(updated);
                      onUpdateSpeeches(updated);
                    }}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>

                <MediaUploader
                  label="Upload Foto Profil Ketua Pembina"
                  value={localSpeeches.chairmanPhotoUrl}
                  onChange={(url) => {
                    const updated = { ...localSpeeches, chairmanPhotoUrl: url };
                    setLocalSpeeches(updated);
                    onUpdateSpeeches(updated);
                  }}
                  mediaType="photo"
                />

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Teks Naskah Pidato Sambutan</label>
                  <textarea
                    rows={8}
                    value={localSpeeches.chairmanSpeech}
                    onChange={(e) => {
                      const updated = { ...localSpeeches, chairmanSpeech: e.target.value };
                      setLocalSpeeches(updated);
                      onUpdateSpeeches(updated);
                    }}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* 2. Pidato Amanat Strategis Pimpinan Yayasan */}
            <div className="p-5 bg-amber-50/70 rounded-2xl border border-amber-300 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                  <span className="text-xs font-black text-amber-900 uppercase">
                    2. Pidato Amanat Strategis Pimpinan / Ketua
                  </span>
                  <span className="px-2 py-0.5 bg-amber-200 text-amber-900 text-[10px] font-extrabold rounded-md">
                    Ketua Yayasan
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Nama Lengkap Pimpinan / Ketua</label>
                  <input
                    type="text"
                    value={localProfile.leaderName || ''}
                    onChange={(e) => {
                      const updated = { ...localProfile, leaderName: e.target.value };
                      setLocalProfile(updated);
                      onSaveProfile(updated);
                    }}
                    placeholder="H. Ahmad Dahlan, M.Ag"
                    className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Jabatan Pimpinan</label>
                    <input
                      type="text"
                      value={localProfile.leaderTitle || ''}
                      onChange={(e) => {
                        const updated = { ...localProfile, leaderTitle: e.target.value };
                        setLocalProfile(updated);
                        onSaveProfile(updated);
                      }}
                      placeholder="Ketua Yayasan"
                      className="w-full bg-white border border-amber-300 rounded-xl px-2.5 py-1.5 text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">NIP / NIPY Pimpinan</label>
                    <input
                      type="text"
                      value={localProfile.leaderNip || ''}
                      onChange={(e) => {
                        const updated = { ...localProfile, leaderNip: e.target.value };
                        setLocalProfile(updated);
                        onSaveProfile(updated);
                      }}
                      placeholder="NIPY. 20120502"
                      className="w-full bg-white border border-amber-300 rounded-xl px-2.5 py-1.5 text-xs font-medium"
                    />
                  </div>
                </div>

                <MediaUploader
                  label="Upload / Ubah Foto Resmi Pimpinan Yayasan"
                  value={localProfile.leaderPhotoUrl || ''}
                  onChange={(url) => {
                    const updated = { ...localProfile, leaderPhotoUrl: url };
                    setLocalProfile(updated);
                    onSaveProfile(updated);
                  }}
                  mediaType="photo"
                />

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Judul Pidato Amanat Strategis</label>
                  <input
                    type="text"
                    value={localProfile.leaderSpeechTitle || ''}
                    onChange={(e) => {
                      const updated = { ...localProfile, leaderSpeechTitle: e.target.value };
                      setLocalProfile(updated);
                      onSaveProfile(updated);
                    }}
                    placeholder="Pidato Amanat Pimpinan: Arah Kebijakan Pendidikan..."
                    className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-bold text-amber-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Teks Naskah Pidato Amanat Strategis</label>
                  <textarea
                    rows={8}
                    value={localProfile.leaderSpeechContent || ''}
                    onChange={(e) => {
                      const updated = { ...localProfile, leaderSpeechContent: e.target.value };
                      setLocalProfile(updated);
                      onSaveProfile(updated);
                    }}
                    placeholder="Bismillahirahmanirrahim. Assalamu'alaikum Warahmatullahi Wabarakatuh..."
                    className="w-full bg-white border border-amber-300 rounded-xl p-3 text-xs leading-relaxed text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* 3. Sambutan Sekretaris Yayasan */}
            <div className="p-5 bg-blue-50/60 rounded-2xl border border-blue-200 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-blue-200 pb-2">
                  <span className="text-xs font-black text-blue-900 uppercase">
                    3. Sambutan Sekretaris Yayasan
                  </span>
                  <span className="px-2 py-0.5 bg-blue-200 text-blue-900 text-[10px] font-extrabold rounded-md">
                    Administrasi
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Nama Lengkap & Gelar Sekretaris</label>
                  <input
                    type="text"
                    value={localProfile.secretaryName || localSpeeches.secretaryName || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      const updatedProf = { ...localProfile, secretaryName: val };
                      const updatedSp = { ...localSpeeches, secretaryName: val };
                      setLocalProfile(updatedProf);
                      setLocalSpeeches(updatedSp);
                      onSaveProfile(updatedProf);
                      onUpdateSpeeches(updatedSp);
                    }}
                    placeholder="H. Ahmad Subagja, S.H"
                    className="w-full bg-white border border-blue-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>

                <MediaUploader
                  label="Upload / Ubah Foto Sekretaris Yayasan"
                  value={localProfile.secretaryPhotoUrl || localSpeeches.secretaryPhotoUrl || ''}
                  onChange={(url) => {
                    const updatedProf = { ...localProfile, secretaryPhotoUrl: url };
                    const updatedSp = { ...localSpeeches, secretaryPhotoUrl: url };
                    setLocalProfile(updatedProf);
                    setLocalSpeeches(updatedSp);
                    onSaveProfile(updatedProf);
                    onUpdateSpeeches(updatedSp);
                  }}
                  mediaType="photo"
                />

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Teks Sambutan / Pesan Sekretaris</label>
                  <textarea
                    rows={8}
                    value={localProfile.secretarySpeech || localSpeeches.secretarySpeech || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      const updatedProf = { ...localProfile, secretarySpeech: val };
                      const updatedSp = { ...localSpeeches, secretarySpeech: val };
                      setLocalProfile(updatedProf);
                      setLocalSpeeches(updatedSp);
                      onSaveProfile(updatedProf);
                      onUpdateSpeeches(updatedSp);
                    }}
                    placeholder="Menjamin ketertiban administrasi, legalitas Kemenkumham..."
                    className="w-full bg-white border border-blue-300 rounded-xl p-3 text-xs leading-relaxed text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* 4. Sambutan Bendahara Yayasan */}
            <div className="p-5 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                  <span className="text-xs font-black text-emerald-900 uppercase">
                    4. Sambutan Bendahara Yayasan
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 text-[10px] font-extrabold rounded-md">
                    Keuangan
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Nama Lengkap & Gelar Bendahara</label>
                  <input
                    type="text"
                    value={localProfile.treasurerName || localSpeeches.treasurerName || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      const updatedProf = { ...localProfile, treasurerName: val };
                      const updatedSp = { ...localSpeeches, treasurerName: val };
                      setLocalProfile(updatedProf);
                      setLocalSpeeches(updatedSp);
                      onSaveProfile(updatedProf);
                      onUpdateSpeeches(updatedSp);
                    }}
                    placeholder="Hj. Nurul Aini, S.E., M.Ak"
                    className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>

                <MediaUploader
                  label="Upload / Ubah Foto Bendahara Yayasan"
                  value={localProfile.treasurerPhotoUrl || localSpeeches.treasurerPhotoUrl || ''}
                  onChange={(url) => {
                    const updatedProf = { ...localProfile, treasurerPhotoUrl: url };
                    const updatedSp = { ...localSpeeches, treasurerPhotoUrl: url };
                    setLocalProfile(updatedProf);
                    setLocalSpeeches(updatedSp);
                    onSaveProfile(updatedProf);
                    onUpdateSpeeches(updatedSp);
                  }}
                  mediaType="photo"
                />

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Teks Sambutan / Pesan Bendahara</label>
                  <textarea
                    rows={8}
                    value={localProfile.treasurerSpeech || localSpeeches.treasurerSpeech || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      const updatedProf = { ...localProfile, treasurerSpeech: val };
                      const updatedSp = { ...localSpeeches, treasurerSpeech: val };
                      setLocalProfile(updatedProf);
                      setLocalSpeeches(updatedSp);
                      onSaveProfile(updatedProf);
                      onUpdateSpeeches(updatedSp);
                    }}
                    placeholder="Mengelola akuntabilitas keuangan berbasis ISAK 35..."
                    className="w-full bg-white border border-emerald-300 rounded-xl p-3 text-xs leading-relaxed text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* 5. Sambutan Kepala Sekolah */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-black text-slate-700 uppercase">5. Sambutan Kepala Sekolah</span>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap & Gelar</label>
                  <input
                    type="text"
                    value={localSpeeches.headmasterName}
                    onChange={(e) => {
                      const updated = { ...localSpeeches, headmasterName: e.target.value };
                      setLocalSpeeches(updated);
                      onUpdateSpeeches(updated);
                    }}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>

                <MediaUploader
                  label="Upload Foto Profil Kepsek"
                  value={localSpeeches.headmasterPhotoUrl}
                  onChange={(url) => {
                    const updated = { ...localSpeeches, headmasterPhotoUrl: url };
                    setLocalSpeeches(updated);
                    onUpdateSpeeches(updated);
                  }}
                  mediaType="photo"
                />

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Teks Naskah Pidato Sambutan</label>
                  <textarea
                    rows={8}
                    value={localSpeeches.headmasterSpeech}
                    onChange={(e) => {
                      const updated = { ...localSpeeches, headmasterSpeech: e.target.value };
                      setLocalSpeeches(updated);
                      onUpdateSpeeches(updated);
                    }}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs leading-relaxed"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 5: NEWS EDITOR ================= */}
      {activeTab === 'news' && (
        <div className="space-y-6">
          {/* Add News Form */}
          <form onSubmit={handleAddNews} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>Tambah Berita / Pengumuman Baru</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul Berita</label>
                <input
                  type="text"
                  required
                  value={newNewsTitle}
                  onChange={(e) => setNewNewsTitle(e.target.value)}
                  placeholder="Contoh: SD Daarul Habibah Raih Medali Emas..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Artikel</label>
                <select
                  value={newNewsCategory}
                  onChange={(e) => setNewNewsCategory(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                >
                  <option value="BERITA">BERITA</option>
                  <option value="PENGUMUMAN">PENGUMUMAN</option>
                  <option value="PRESTASI">PRESTASI</option>
                  <option value="AGENDA">AGENDA</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Ringkasan Singkat (Excerpt)</label>
              <input
                type="text"
                required
                value={newNewsExcerpt}
                onChange={(e) => setNewNewsExcerpt(e.target.value)}
                placeholder="Ringkasan 1-2 kalimat untuk kartu berita di beranda web..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <MediaUploader
              label="Upload Foto Sampul Berita dari Komputer / Preset HD"
              value={newNewsImage}
              onChange={(url) => setNewNewsImage(url)}
              mediaType="photo"
            />

            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Terbitkan Berita Baru</span>
            </button>
          </form>

          {/* Existing News List */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">
                Daftar Berita & Pengumuman Aktif
              </h3>
              <button
                type="button"
                onClick={handleSaveNewsList}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan Berita</span>
              </button>
            </div>

            <div className="space-y-4">
              {localNews.map((item) => (
                <div key={item.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex gap-3 items-center">
                    <img src={item.imageUrl} alt={item.title} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md">
                          {item.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{item.date}</span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-xs mt-1">{item.title}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{item.excerpt}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteNews(item.id)}
                    className="p-2 bg-rose-100 text-rose-700 hover:bg-rose-200 rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Hapus</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 6: GALLERY EDITOR ================= */}
      {activeTab === 'gallery' && (
        <div className="space-y-6">
          {/* Add Gallery Item Form */}
          <form onSubmit={handleAddGallery} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>Tambah Foto / Video Galeri Kegiatan Baru</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul Foto / Video</label>
                <input
                  type="text"
                  required
                  value={newGalTitle}
                  onChange={(e) => setNewGalTitle(e.target.value)}
                  placeholder="Contoh: Upacara Bendera & Penyerahan Hadiah..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Galeri</label>
                <select
                  value={newGalCategory}
                  onChange={(e) => setNewGalCategory(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                >
                  <option value="Kegiatan Belajar">Kegiatan Belajar</option>
                  <option value="Prestasi Siswa">Prestasi Siswa</option>
                  <option value="Fasilitas Kampus">Fasilitas Kampus</option>
                  <option value="Acara Yayasan">Acara Yayasan</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Singkat</label>
              <input
                type="text"
                value={newGalDesc}
                onChange={(e) => setNewGalDesc(e.target.value)}
                placeholder="Penjelasan singkat aktivitas di dalam foto/video..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <MediaUploader
              label="Upload Foto / Video Galeri dari Komputer / Preset"
              value={newGalUrl}
              onChange={(url, mType) => {
                setNewGalUrl(url);
                if (mType) setNewGalType(mType);
              }}
              mediaType="any"
            />

            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Simpan ke Galeri Web</span>
            </button>
          </form>

          {/* Existing Gallery List */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">
                Koleksi Galeri Media Aktif
              </h3>
              <button
                type="button"
                onClick={handleSaveGalleryList}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan Galeri</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {localGallery.map((item) => (
                <div key={item.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 flex flex-col justify-between">
                  <div>
                    {item.type === 'video' || isMediaVideo(item.url) ? (
                      isYouTubeUrl(item.url) ? (
                        <iframe
                          src={getYoutubeEmbedUrl(item.url)}
                          title={item.title}
                          className="w-full h-40 rounded-xl border-0"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          src={item.url}
                          controls
                          playsInline
                          className="w-full h-40 object-contain bg-slate-950 rounded-xl"
                        />
                      )
                    ) : (
                      <div className="w-full h-44 rounded-xl overflow-hidden relative">
                        <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <span className="text-[10px] font-black px-2 py-0.5 bg-slate-200 text-slate-800 rounded-md mt-2 inline-block">
                      {item.category}
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-xs mt-1">{item.title}</h4>
                    <p className="text-[11px] text-slate-500">{item.description}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteGallery(item.id)}
                    className="w-full py-1.5 bg-rose-100 text-rose-700 hover:bg-rose-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Item</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 7: ACHIEVEMENTS EDITOR ================= */}
      {activeTab === 'achievements' && (
        <div className="space-y-6">
          {/* Add Achievement Form */}
          <form onSubmit={handleAddAchievement} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>Tambah Data & Foto Prestasi Siswa</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Siswa</label>
                <input
                  type="text"
                  required
                  value={newAchStudent}
                  onChange={(e) => setNewAchStudent(e.target.value)}
                  placeholder="Contoh: Ahmad Rizky Pratama"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Rombel / Kelas</label>
                <input
                  type="text"
                  value={newAchGrade}
                  onChange={(e) => setNewAchGrade(e.target.value)}
                  placeholder="Kelas 5"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tingkat Lomba</label>
                <select
                  value={newAchLevel}
                  onChange={(e) => setNewAchLevel(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                >
                  <option value="KABUPATEN">KABUPATEN</option>
                  <option value="PROVINSI">PROVINSI</option>
                  <option value="NASIONAL">NASIONAL</option>
                  <option value="INTERNASIONAL">INTERNASIONAL</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Kejuaraan / Ajang Lomba</label>
                <input
                  type="text"
                  required
                  value={newAchComp}
                  onChange={(e) => setNewAchComp(e.target.value)}
                  placeholder="Contoh: Olimpiade Sains Nasional (OSN)..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Gelar Juara / Perolehan Medali</label>
                <input
                  type="text"
                  value={newAchTitle}
                  onChange={(e) => setNewAchTitle(e.target.value)}
                  placeholder="Contoh: Juara 1 / Medali Emas"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>
            </div>

            <MediaUploader
              label="Upload Foto Siswa / Penyerahan Medali dari Komputer"
              value={newAchPhoto}
              onChange={(url) => setNewAchPhoto(url)}
              mediaType="photo"
            />

            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Simpan Prestasi Siswa</span>
            </button>
          </form>

          {/* Existing Achievements List */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">
                Daftar Unjuk Prestasi Siswa
              </h3>
              <button
                type="button"
                onClick={handleSaveAchievementsList}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan Prestasi</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {localAchievements.map((ach) => (
                <div key={ach.id} className="p-4 bg-sky-50 border border-sky-100 rounded-2xl space-y-2 flex flex-col justify-between">
                  <div>
                    {ach.photoUrl && (
                      <img src={ach.photoUrl} alt={ach.studentName} className="w-full h-32 object-cover rounded-xl mb-2" />
                    )}
                    <span className="text-[10px] font-black px-2 py-0.5 bg-sky-200 text-sky-900 rounded-full uppercase">
                      Tingkat {ach.level}
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-xs mt-1">{ach.achievementTitle}</h4>
                    <p className="text-xs text-slate-700 font-bold">{ach.competitionName}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Oleh: <span className="font-bold text-slate-900">{ach.studentName}</span> ({ach.gradeClass})
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteAchievement(ach.id)}
                    className="w-full py-1 bg-rose-100 text-rose-700 hover:bg-rose-200 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 10: PENGATURAN PPDB & BIAYA ================= */}
      {activeTab === 'ppdb' && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-amber-500" />
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Pengaturan Umum PPDB & Kontak Informasi
                  </h3>
                  <p className="text-xs text-slate-500">
                    Atur tahun akademik penerimaan murid baru, kontak WhatsApp admin PPDB, dan rincian komponen biaya pendaftaran.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (onUpdatePpdbConfig) {
                    onUpdatePpdbConfig(localPpdbConfig);
                  }
                  safeSetLocalStorage('yayasan_ppdb_config', localPpdbConfig);
                  setSaveSuccess(true);
                  setTimeout(() => setSaveSuccess(false), 3000);
                }}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Pengaturan PPDB</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tahun Akademik PPDB
                </label>
                <input
                  type="text"
                  value={localPpdbConfig.academicYear}
                  onChange={(e) => setLocalPpdbConfig({ ...localPpdbConfig, academicYear: e.target.value })}
                  placeholder="Contoh: 2026/2027"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  No. WhatsApp / Kontak Helpdesk PPDB
                </label>
                <input
                  type="text"
                  value={localPpdbConfig.contactWhatsapp || ''}
                  onChange={(e) => setLocalPpdbConfig({ ...localPpdbConfig, contactWhatsapp: e.target.value })}
                  placeholder="Contoh: 0812-3344-5566"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Informasi Rekening / Pembayaran PPDB
                </label>
                <textarea
                  rows={2}
                  value={localPpdbConfig.infoNote || ''}
                  onChange={(e) => setLocalPpdbConfig({ ...localPpdbConfig, infoNote: e.target.value })}
                  placeholder="Instruksi pembayaran untuk pendaftar..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Section: Edit Komponen Biaya Pendidikan */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span>Kelola Komponen Biaya Pendidikan PPDB</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Ubah nama biaya, besaran nominal (misal: Rp 250.000 / Rp 600.000 per Bulan), serta penjelasan catatan biaya.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newFee: PPDBFeeItem = {
                    id: `fee-${Date.now()}`,
                    name: 'Biaya Komponen Baru',
                    amountText: 'Rp 500.000',
                    notes: 'Keterangan rincian pembayaran...',
                  };
                  setLocalPpdbConfig({
                    ...localPpdbConfig,
                    fees: [...localPpdbConfig.fees, newFee],
                  });
                }}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Item Biaya</span>
              </button>
            </div>

            <div className="space-y-3">
              {localPpdbConfig.fees.map((fee, idx) => (
                <div key={fee.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 pb-2">
                    <span className="text-xs font-black text-slate-700">Komponen Biaya #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = localPpdbConfig.fees.filter((f) => f.id !== fee.id);
                        setLocalPpdbConfig({ ...localPpdbConfig, fees: updated });
                      }}
                      className="text-rose-600 hover:text-rose-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Nama Komponen Biaya</label>
                      <input
                        type="text"
                        value={fee.name}
                        onChange={(e) => {
                          const updated = localPpdbConfig.fees.map((f) =>
                            f.id === fee.id ? { ...f, name: e.target.value } : f
                          );
                          setLocalPpdbConfig({ ...localPpdbConfig, fees: updated });
                        }}
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Besaran Nominal / Keterangan Teks</label>
                      <input
                        type="text"
                        value={fee.amountText}
                        onChange={(e) => {
                          const updated = localPpdbConfig.fees.map((f) =>
                            f.id === fee.id ? { ...f, amountText: e.target.value } : f
                          );
                          setLocalPpdbConfig({ ...localPpdbConfig, fees: updated });
                        }}
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-black text-amber-700"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Catatan / Rincian Singkat</label>
                      <input
                        type="text"
                        value={fee.notes || ''}
                        onChange={(e) => {
                          const updated = localPpdbConfig.fees.map((f) =>
                            f.id === fee.id ? { ...f, notes: e.target.value } : f
                          );
                          setLocalPpdbConfig({ ...localPpdbConfig, fees: updated });
                        }}
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Edit Program Beasiswa */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  <span>Kelola Program Beasiswa Unggulan</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Tambahkan atau sunting syarat dan deskripsi program beasiswa yang ditawarkan di website PPDB.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newSch: PPDBScholarshipItem = {
                    id: `sch-${Date.now()}`,
                    title: 'Nama Program Beasiswa Baru',
                    description: 'Deskripsi kriteria dan keringanan biaya bagi pendaftar...',
                  };
                  setLocalPpdbConfig({
                    ...localPpdbConfig,
                    scholarships: [...localPpdbConfig.scholarships, newSch],
                  });
                }}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Beasiswa</span>
              </button>
            </div>

            <div className="space-y-3">
              {localPpdbConfig.scholarships.map((sch, idx) => (
                <div key={sch.id} className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between gap-2 border-b border-emerald-200/60 pb-2">
                    <span className="text-xs font-black text-emerald-900">Program Beasiswa #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = localPpdbConfig.scholarships.filter((s) => s.id !== sch.id);
                        setLocalPpdbConfig({ ...localPpdbConfig, scholarships: updated });
                      }}
                      className="text-rose-600 hover:text-rose-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Judul Program Beasiswa</label>
                      <input
                        type="text"
                        value={sch.title}
                        onChange={(e) => {
                          const updated = localPpdbConfig.scholarships.map((s) =>
                            s.id === sch.id ? { ...s, title: e.target.value } : s
                          );
                          setLocalPpdbConfig({ ...localPpdbConfig, scholarships: updated });
                        }}
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Deskripsi Ketentuan Beasiswa</label>
                      <textarea
                        rows={2}
                        value={sch.description}
                        onChange={(e) => {
                          const updated = localPpdbConfig.scholarships.map((s) =>
                            s.id === sch.id ? { ...s, description: e.target.value } : s
                          );
                          setLocalPpdbConfig({ ...localPpdbConfig, scholarships: updated });
                        }}
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (onUpdatePpdbConfig) {
                    onUpdatePpdbConfig(localPpdbConfig);
                  }
                  safeSetLocalStorage('yayasan_ppdb_config', localPpdbConfig);
                  setSaveSuccess(true);
                  setTimeout(() => setSaveSuccess(false), 3000);
                }}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Semua Pengaturan PPDB & Biaya</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
