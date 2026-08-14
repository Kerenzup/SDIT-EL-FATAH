import React, { useState, useEffect, useRef } from 'react';
import { safeGetLocalStorage, safeSetLocalStorage } from './utils/safeStorage';
import { getIDBItem } from './utils/indexedDBStorage';
import {
  Account,
  FixedAsset,
  FoundationBoard,
  FoundationProfile,
  JournalEntry,
  ReportFilter,
  Student,
  Supplier,
  Teacher,
  SiPLahProcurement,
  HeroBanner,
  SpeechesCMS,
  VisionMissionCMS,
  NewsArticle,
  GalleryItem,
  StudentAchievement,
  ERaport,
  TeacherJournalRombel,
  ArkasBudgetItem,
  UserRole,
  WebsiteLayoutConfig,
  PPDBConfig,
} from './types';
import { printDocument } from './utils/printHelper';
import {
  INITIAL_ACCOUNTS,
  INITIAL_BOARD_MEMBERS,
  INITIAL_FIXED_ASSETS,
  INITIAL_FOUNDATION_PROFILE,
  INITIAL_JOURNAL_ENTRIES,
  INITIAL_STUDENTS,
  INITIAL_SUPPLIERS,
  INITIAL_TEACHERS,
  INITIAL_SIPLAH_PROCUREMENTS,
  INITIAL_HERO_BANNERS,
  INITIAL_SPEECHES,
  INITIAL_VISION_MISSION,
  INITIAL_NEWS_ARTICLES,
  INITIAL_GALLERY_ITEMS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_E_RAPORTS,
  INITIAL_TEACHER_JOURNALS,
  INITIAL_ARKAS_BUDGET,
  INITIAL_WEBSITE_LAYOUT_CONFIG,
  INITIAL_PPDB_CONFIG,
} from './data/initialData';
import { Navbar } from './components/Navbar';
import { Sidebar, TabType } from './components/Sidebar';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { FinancialReportsView } from './components/reports/FinancialReportsView';
import { CALKView } from './components/reports/CALKView';
import { TransactionManagerView } from './components/transactions/TransactionManagerView';
import { CoaAndLedgerView } from './components/coa/CoaAndLedgerView';
import { FixedAssetView } from './components/assets/FixedAssetView';
import { MasterDataView } from './components/master/MasterDataView';
import { PayrollSdmView } from './components/payroll/PayrollSdmView';
import { FoundationSettingsView } from './components/settings/FoundationSettingsView';
import { AiFinancialAdvisor } from './components/ai/AiFinancialAdvisor';
import { AddTransactionModal } from './components/common/AddTransactionModal';
import { PublicWebsiteView } from './components/public/PublicWebsiteView';
import { SiPLahProcurementView } from './components/procurement/SiPLahProcurementView';
import { CmsAdminView } from './components/cms/CmsAdminView';
import { AcademicRombelView } from './components/academic/AcademicRombelView';
import { ArkasBudgetView } from './components/arkas/ArkasBudgetView';
import { RoleLoginModal } from './components/auth/RoleLoginModal';
import { RoleAccessManagementView } from './components/settings/RoleAccessManagementView';
import { getRoleAuthConfigs, RoleAuthConfig, isTabAllowed } from './utils/roleAuth';
import { parseProfileFromUrl } from './utils/shareUrl';

export default function App() {
  // Public vs Internal view toggle
  const [isPublicView, setIsPublicView] = useState<boolean>(true);
  const [currentRole, setCurrentRole] = useState<UserRole>('PUBLIC_GUEST');

  // Role authentication configuration & Modal state
  const [roleConfigs, setRoleConfigs] = useState<Record<UserRole, RoleAuthConfig>>(() => getRoleAuthConfigs());
  const [isRoleLoginModalOpen, setIsRoleLoginModalOpen] = useState<boolean>(false);
  const [loginTargetRole, setLoginTargetRole] = useState<UserRole>('KEPALA_SEKOLAH');

  // LocalStorage state initialization
  const [foundationProfile, setFoundationProfile] = useState<FoundationProfile>(() => {
    const fromUrl = parseProfileFromUrl(INITIAL_FOUNDATION_PROFILE);
    if (fromUrl) {
      safeSetLocalStorage('yayasan_profile', fromUrl);
      return fromUrl;
    }
    let saved = safeGetLocalStorage<FoundationProfile>('yayasan_profile', INITIAL_FOUNDATION_PROFILE);
    if (!saved || !saved.name || saved.name.includes('Widya') || saved.email?.includes('widyanusantara')) {
      saved = {
        ...INITIAL_FOUNDATION_PROFILE,
        ...saved,
        name: INITIAL_FOUNDATION_PROFILE.name,
        email: INITIAL_FOUNDATION_PROFILE.email,
        website: INITIAL_FOUNDATION_PROFILE.website,
        welcomeMessage: INITIAL_FOUNDATION_PROFILE.welcomeMessage,
        leaderSpeechContent: INITIAL_FOUNDATION_PROFILE.leaderSpeechContent,
        aboutTitle: INITIAL_FOUNDATION_PROFILE.aboutTitle,
        aboutHistory: INITIAL_FOUNDATION_PROFILE.aboutHistory,
      };
      safeSetLocalStorage('yayasan_profile', saved);
    }
    return { ...INITIAL_FOUNDATION_PROFILE, ...saved };
  });

  const [accounts, setAccounts] = useState<Account[]>(() =>
    safeGetLocalStorage('yayasan_accounts', INITIAL_ACCOUNTS)
  );

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() =>
    safeGetLocalStorage('yayasan_journals', INITIAL_JOURNAL_ENTRIES)
  );

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = safeGetLocalStorage<Student[]>('yayasan_students', INITIAL_STUDENTS);
    return Array.isArray(saved) && saved.length > 0 ? saved : INITIAL_STUDENTS;
  });

  const [teachers, setTeachers] = useState<Teacher[]>(() =>
    safeGetLocalStorage('yayasan_teachers', INITIAL_TEACHERS)
  );

  const [fixedAssets, setFixedAssets] = useState<FixedAsset[]>(() =>
    safeGetLocalStorage('yayasan_assets', INITIAL_FIXED_ASSETS)
  );

  const [boardMembers, setBoardMembers] = useState<FoundationBoard[]>(() => {
    const saved = safeGetLocalStorage<FoundationBoard[]>('yayasan_board_members', INITIAL_BOARD_MEMBERS);
    if (!Array.isArray(saved) || saved.some(b => b.email?.includes('widyanusantara') || b.position?.includes('Widya'))) {
      safeSetLocalStorage('yayasan_board_members', INITIAL_BOARD_MEMBERS);
      return INITIAL_BOARD_MEMBERS;
    }
    return saved;
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() =>
    safeGetLocalStorage('yayasan_suppliers', INITIAL_SUPPLIERS)
  );

  // --- SIPLAH & CMS & ACADEMIC DATA STATE ---
  const [siplahProcurements, setSiplahProcurements] = useState<SiPLahProcurement[]>(() =>
    safeGetLocalStorage('yayasan_siplah_procurements', INITIAL_SIPLAH_PROCUREMENTS)
  );

  const [heroBanners, setHeroBanners] = useState<HeroBanner[]>(() =>
    safeGetLocalStorage('yayasan_hero_banners', INITIAL_HERO_BANNERS)
  );

  const [speeches, setSpeeches] = useState<SpeechesCMS>(() => {
    const saved = safeGetLocalStorage<SpeechesCMS>('yayasan_speeches', INITIAL_SPEECHES);
    if (!saved || saved.chairmanTitle?.includes('Widya') || saved.headmasterTitle?.includes('Widya') || saved.chairmanSpeech?.includes('Widya')) {
      safeSetLocalStorage('yayasan_speeches', INITIAL_SPEECHES);
      return INITIAL_SPEECHES;
    }
    return saved;
  });

  const [visionMission, setVisionMission] = useState<VisionMissionCMS>(() =>
    safeGetLocalStorage('yayasan_vision_mission', INITIAL_VISION_MISSION)
  );

  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>(() => {
    const saved = safeGetLocalStorage<NewsArticle[]>('yayasan_news_articles', INITIAL_NEWS_ARTICLES);
    if (!Array.isArray(saved) || saved.some(n => n.title?.includes('Widya') || n.content?.includes('Widya'))) {
      safeSetLocalStorage('yayasan_news_articles', INITIAL_NEWS_ARTICLES);
      return INITIAL_NEWS_ARTICLES;
    }
    return saved;
  });

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() =>
    safeGetLocalStorage('yayasan_gallery_items', INITIAL_GALLERY_ITEMS)
  );

  const [achievements, setAchievements] = useState<StudentAchievement[]>(() =>
    safeGetLocalStorage('yayasan_achievements', INITIAL_ACHIEVEMENTS)
  );

  const [eRaports, setERaports] = useState<ERaport[]>(() => {
    const saved = safeGetLocalStorage<ERaport[]>('yayasan_e_raports', INITIAL_E_RAPORTS);
    if (!Array.isArray(saved) || saved.length < INITIAL_E_RAPORTS.length) {
      const existingStudentIds = new Set((Array.isArray(saved) ? saved : []).map((r) => r.studentId));
      const missing = INITIAL_E_RAPORTS.filter((r) => !existingStudentIds.has(r.studentId));
      const merged = [...(Array.isArray(saved) ? saved : []), ...missing];
      safeSetLocalStorage('yayasan_e_raports', merged);
      return merged;
    }
    return saved;
  });

  const [teacherJournals, setTeacherJournals] = useState<TeacherJournalRombel[]>(() =>
    safeGetLocalStorage('yayasan_teacher_journals', INITIAL_TEACHER_JOURNALS)
  );

  const [arkasBudget, setArkasBudget] = useState<ArkasBudgetItem[]>(() =>
    safeGetLocalStorage('yayasan_arkas_budget', INITIAL_ARKAS_BUDGET)
  );

  const [ppdbConfig, setPpdbConfig] = useState<PPDBConfig>(() =>
    safeGetLocalStorage('yayasan_ppdb_config', INITIAL_PPDB_CONFIG)
  );

  useEffect(() => {
    safeSetLocalStorage('yayasan_ppdb_config', ppdbConfig);
  }, [ppdbConfig]);

  const [layoutConfig, setLayoutConfig] = useState<WebsiteLayoutConfig>(() => {
    const saved = safeGetLocalStorage<WebsiteLayoutConfig>('yayasan_website_layout_config', INITIAL_WEBSITE_LAYOUT_CONFIG);
    if (!saved || !saved.sections) return INITIAL_WEBSITE_LAYOUT_CONFIG;
    const savedIds = new Set(saved.sections.map((s) => s.id));
    const missingSections = INITIAL_WEBSITE_LAYOUT_CONFIG.sections.filter((s) => !savedIds.has(s.id));
    if (missingSections.length > 0) {
      return {
        ...saved,
        sections: [...saved.sections, ...missingSections],
      };
    }
    return saved;
  });

  useEffect(() => {
    safeSetLocalStorage('yayasan_website_layout_config', layoutConfig);
  }, [layoutConfig]);

  // Active runtime migration to purge any residual 'Widya' reference from browser storage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith('yayasan_')) {
            const val = localStorage.getItem(key);
            if (val && (val.includes('Widya') || val.includes('widyanusantara'))) {
              const cleaned = val
                .replace(/Yayasan Pendidikan Widya Nusantara/g, 'Yayasan Pendidikan Daarul Habibah')
                .replace(/Widya Nusantara/g, 'Daarul Habibah')
                .replace(/widyanusantara/g, 'daarulhabibah');
              localStorage.setItem(key, cleaned);
            }
          }
        });
      }
    } catch (e) {
      console.warn('LocalStorage migration error:', e);
    }
  }, []);

  // Hydration state reference to prevent overwriting IndexedDB with initial state before hydration finishes
  const isHydratedRef = useRef<boolean>(false);

  // Hydrate heavy media & gallery assets from permanent IndexedDB database on mount
  useEffect(() => {
    Promise.all([
      getIDBItem<GalleryItem[]>('yayasan_gallery_items', []),
      getIDBItem<FoundationProfile>('yayasan_profile', foundationProfile),
      getIDBItem<WebsiteLayoutConfig>('yayasan_website_layout_config', layoutConfig),
      getIDBItem<NewsArticle[]>('yayasan_news_articles', []),
      getIDBItem<HeroBanner[]>('yayasan_hero_banners', []),
      getIDBItem<StudentAchievement[]>('yayasan_achievements', []),
      getIDBItem<ERaport[]>('yayasan_e_raports', []),
      getIDBItem<TeacherJournalRombel[]>('yayasan_teacher_journals', []),
    ]).then(([items, prof, cfg, news, banners, achs, raports, journals]) => {
      if (items && Array.isArray(items) && items.length > 0) {
        setGalleryItems(items);
      }
      if (prof && prof.name) {
        setFoundationProfile(prof);
      }
      if (cfg && cfg.sections) {
        setLayoutConfig(cfg);
      }
      if (news && Array.isArray(news) && news.length > 0) {
        setNewsArticles(news);
      }
      if (banners && Array.isArray(banners) && banners.length > 0) {
        setHeroBanners(banners);
      }
      if (achs && Array.isArray(achs) && achs.length > 0) {
        setAchievements(achs);
      }
      if (raports && Array.isArray(raports) && raports.length > 0) {
        setERaports(raports);
      }
      if (journals && Array.isArray(journals) && journals.length > 0) {
        setTeacherJournals(journals);
      }
      // Set hydration flag so subsequent user changes are saved reliably
      isHydratedRef.current = true;
    }).catch((err) => {
      console.warn('IndexedDB initial hydration warning:', err);
      isHydratedRef.current = true;
    });
  }, []);

  // Active view states
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [activeReportSubTab, setActiveReportSubTab] = useState<string>('neraca');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Filter
  const [filter, setFilter] = useState<ReportFilter>({
    periodType: 'TAHUNAN',
    year: 2026,
    searchQuery: '',
  });

  // Save to LocalStorage & IndexedDB (Guarded by isHydratedRef)
  useEffect(() => {
    if (!isHydratedRef.current) return;
    safeSetLocalStorage('yayasan_profile', foundationProfile);
    if (foundationProfile && foundationProfile.name) {
      document.title = `${foundationProfile.name} - Portal Resmi & ERP Keuangan ISAK 35`;
    }
  }, [foundationProfile]);

  useEffect(() => {
    if (!isHydratedRef.current) return;
    safeSetLocalStorage('yayasan_accounts', accounts);
  }, [accounts]);

  useEffect(() => {
    if (!isHydratedRef.current) return;
    safeSetLocalStorage('yayasan_journals', journalEntries);
  }, [journalEntries]);

  useEffect(() => {
    if (!isHydratedRef.current) return;
    safeSetLocalStorage('yayasan_students', students);
  }, [students]);

  useEffect(() => {
    if (!isHydratedRef.current) return;
    safeSetLocalStorage('yayasan_teachers', teachers);
  }, [teachers]);

  useEffect(() => {
    if (!isHydratedRef.current) return;
    safeSetLocalStorage('yayasan_assets', fixedAssets);
  }, [fixedAssets]);

  useEffect(() => {
    if (!isHydratedRef.current) return;
    safeSetLocalStorage('yayasan_board_members', boardMembers);
  }, [boardMembers]);

  useEffect(() => {
    if (!isHydratedRef.current) return;
    safeSetLocalStorage('yayasan_suppliers', suppliers);
  }, [suppliers]);

  useEffect(() => {
    if (!isHydratedRef.current) return;
    safeSetLocalStorage('yayasan_siplah_procurements', siplahProcurements);
  }, [siplahProcurements]);

  useEffect(() => {
    if (!isHydratedRef.current) return;
    safeSetLocalStorage('yayasan_hero_banners', heroBanners);
  }, [heroBanners]);

  useEffect(() => {
    if (!isHydratedRef.current) return;
    safeSetLocalStorage('yayasan_speeches', speeches);
  }, [speeches]);

  useEffect(() => {
    if (!isHydratedRef.current) return;
    safeSetLocalStorage('yayasan_vision_mission', visionMission);
  }, [visionMission]);

  useEffect(() => {
    if (!isHydratedRef.current) return;
    safeSetLocalStorage('yayasan_news_articles', newsArticles);
  }, [newsArticles]);

  useEffect(() => {
    if (!isHydratedRef.current) return;
    safeSetLocalStorage('yayasan_gallery_items', galleryItems);
  }, [galleryItems]);

  useEffect(() => {
    if (!isHydratedRef.current) return;
    safeSetLocalStorage('yayasan_achievements', achievements);
  }, [achievements]);

  useEffect(() => {
    if (!isHydratedRef.current) return;
    safeSetLocalStorage('yayasan_e_raports', eRaports);
  }, [eRaports]);

  useEffect(() => {
    if (!isHydratedRef.current) return;
    safeSetLocalStorage('yayasan_teacher_journals', teacherJournals);
  }, [teacherJournals]);

  useEffect(() => {
    if (!isHydratedRef.current) return;
    safeSetLocalStorage('yayasan_arkas_budget', arkasBudget);
  }, [arkasBudget]);

  // Fixed Asset & Depreciation Sync to COA Accounts
  const handleSyncFixedAssetsToAccounts = (currentAssets: FixedAsset[] = fixedAssets) => {
    const tanahCost = currentAssets
      .filter((a) => a.category.toLowerCase().includes('tanah'))
      .reduce((sum, a) => sum + a.acquisitionCost, 0);

    const gedungCost = currentAssets
      .filter((a) => a.category.toLowerCase().includes('bangunan') || a.category.toLowerCase().includes('gedung'))
      .reduce((sum, a) => sum + a.acquisitionCost, 0);

    const peralatanCost = currentAssets
      .filter((a) => a.category.toLowerCase().includes('peralatan') || a.category.toLowerCase().includes('lab'))
      .reduce((sum, a) => sum + a.acquisitionCost, 0);

    const komputerCost = currentAssets
      .filter((a) => a.category.toLowerCase().includes('komputer') || a.category.toLowerCase().includes('laptop'))
      .reduce((sum, a) => sum + a.acquisitionCost, 0);

    const kendaraanCost = currentAssets
      .filter((a) => a.category.toLowerCase().includes('kendaraan'))
      .reduce((sum, a) => sum + a.acquisitionCost, 0);

    const totalAccumulatedDep = currentAssets.reduce((sum, a) => sum + a.accumulatedDepreciation, 0);
    const totalAnnualDep = currentAssets.reduce((sum, a) => sum + a.annualDepreciation, 0);

    setAccounts((prevAccounts) =>
      prevAccounts.map((acc) => {
        if (acc.code === '1201' && tanahCost > 0) return { ...acc, balance: tanahCost };
        if (acc.code === '1202' && gedungCost > 0) return { ...acc, balance: gedungCost };
        if (acc.code === '1203' && peralatanCost > 0) return { ...acc, balance: peralatanCost };
        if (acc.code === '1204' && komputerCost > 0) return { ...acc, balance: komputerCost };
        if (acc.code === '1205' && kendaraanCost > 0) return { ...acc, balance: kendaraanCost };
        if (acc.code === '1299') return { ...acc, balance: -totalAccumulatedDep };
        if (acc.code === '5114') return { ...acc, balance: totalAnnualDep };
        return acc;
      })
    );
  };

  useEffect(() => {
    handleSyncFixedAssetsToAccounts(fixedAssets);
  }, [fixedAssets]);

  // Handler Add Journal & Update COA
  const handleAddJournalEntry = (newEntry: Omit<JournalEntry, 'id'>) => {
    const entry: JournalEntry = {
      ...newEntry,
      id: `jrn-${Date.now()}`,
    };

    setJournalEntries((prev) => [entry, ...prev]);

    // Real-time double-entry posting to accounts balance
    setAccounts((prevAccounts) =>
      prevAccounts.map((acc) => {
        let newBalance = acc.balance;

        // Debit Account
        if (acc.code === entry.debitAccountCode) {
          if (acc.category === 'ASET_LANCAR' || acc.category === 'ASET_TETAP' || acc.category === 'BEBAN') {
            newBalance += entry.amount;
          } else {
            newBalance -= entry.amount;
          }
        }

        // Credit Account
        if (acc.code === entry.creditAccountCode) {
          if (acc.category === 'KEWAJIBAN' || acc.category === 'ASET_NETO' || acc.category === 'PENDAPATAN') {
            newBalance += entry.amount;
          } else {
            newBalance -= entry.amount;
          }
        }

        return { ...acc, balance: newBalance };
      })
    );
  };

  // Delete Journal Entry Handler
  const handleDeleteJournalEntry = (id: string) => {
    const entryToDelete = journalEntries.find((j) => j.id === id);
    if (!entryToDelete) return;

    // Revert balance impact
    setAccounts((prevAccounts) =>
      prevAccounts.map((acc) => {
        let newBalance = acc.balance;

        if (acc.code === entryToDelete.debitAccountCode) {
          if (acc.category === 'ASET_LANCAR' || acc.category === 'ASET_TETAP' || acc.category === 'BEBAN') {
            newBalance -= entryToDelete.amount;
          } else {
            newBalance += entryToDelete.amount;
          }
        }

        if (acc.code === entryToDelete.creditAccountCode) {
          if (acc.category === 'KEWAJIBAN' || acc.category === 'ASET_NETO' || acc.category === 'PENDAPATAN') {
            newBalance -= entryToDelete.amount;
          } else {
            newBalance += entryToDelete.amount;
          }
        }

        return { ...acc, balance: newBalance };
      })
    );

    setJournalEntries((prev) => prev.filter((j) => j.id !== id));
  };

  // Update Journal Entry Handler
  const handleUpdateJournalEntry = (id: string, updatedData: Partial<JournalEntry>) => {
    const oldEntry = journalEntries.find((j) => j.id === id);
    if (!oldEntry) return;

    const newEntry: JournalEntry = { ...oldEntry, ...updatedData };

    setAccounts((prevAccounts) =>
      prevAccounts.map((acc) => {
        let newBalance = acc.balance;

        // Revert old Debit
        if (acc.code === oldEntry.debitAccountCode) {
          if (acc.category === 'ASET_LANCAR' || acc.category === 'ASET_TETAP' || acc.category === 'BEBAN') {
            newBalance -= oldEntry.amount;
          } else {
            newBalance += oldEntry.amount;
          }
        }
        // Revert old Credit
        if (acc.code === oldEntry.creditAccountCode) {
          if (acc.category === 'KEWAJIBAN' || acc.category === 'ASET_NETO' || acc.category === 'PENDAPATAN') {
            newBalance -= oldEntry.amount;
          } else {
            newBalance += oldEntry.amount;
          }
        }

        // Apply new Debit
        if (acc.code === newEntry.debitAccountCode) {
          if (acc.category === 'ASET_LANCAR' || acc.category === 'ASET_TETAP' || acc.category === 'BEBAN') {
            newBalance += newEntry.amount;
          } else {
            newBalance -= newEntry.amount;
          }
        }
        // Apply new Credit
        if (acc.code === newEntry.creditAccountCode) {
          if (acc.category === 'KEWAJIBAN' || acc.category === 'ASET_NETO' || acc.category === 'PENDAPATAN') {
            newBalance += newEntry.amount;
          } else {
            newBalance -= newEntry.amount;
          }
        }

        return { ...acc, balance: newBalance };
      })
    );

    setJournalEntries((prev) => prev.map((j) => (j.id === id ? newEntry : j)));
  };

  // --- SIPLAH PROCUREMENT HANDLERS ---
  const handleProposeProcurement = (procData: Omit<SiPLahProcurement, 'id' | 'code' | 'status'>) => {
    const newProc: SiPLahProcurement = {
      ...procData,
      id: `sip-${Date.now()}`,
      code: `SIPLAH/2026/08/${String(siplahProcurements.length + 1).padStart(3, '0')}`,
      status: 'DIUSULKAN_KEPSEK',
    };
    setSiplahProcurements((prev) => [newProc, ...prev]);
  };

  const handleApproveTreasurer = (id: string, treasurerName: string) => {
    setSiplahProcurements((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: 'DISETUJUI_BENDAHARA',
              approvedByTreasurer: treasurerName,
              approvedTreasurerDate: new Date().toISOString().split('T')[0],
            }
          : p
      )
    );
  };

  const handleAcknowledgeChairman = (id: string, chairmanName: string) => {
    setSiplahProcurements((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: 'DIKETAHUI_KETUA',
              acknowledgedByChairman: chairmanName,
              acknowledgedChairmanDate: new Date().toISOString().split('T')[0],
            }
          : p
      )
    );
  };

  // Disburse Procurement Handler: Posts Journal & Registers Asset to synchronize Balance Sheet
  const handleDisburseProcurement = (id: string) => {
    const proc = siplahProcurements.find((p) => p.id === id);
    if (!proc) return;

    // 1. Update status to DICAIRKAN
    setSiplahProcurements((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'DICAIRKAN', isRegisteredToAssets: true } : p))
    );

    // 2. Post Journal Entry (Debits DebitAccount, Credits Bank Syariah Yayasan 1102)
    const journal: Omit<JournalEntry, 'id'> = {
      date: new Date().toISOString().split('T')[0],
      voucherNo: `JV/SIPLAH/${Date.now().toString().slice(-4)}`,
      description: `Pencairan SiPLah: ${proc.title} (${proc.merchantName})`,
      categoryTag: proc.fundingSource === 'DANA_BOS' ? 'BOS' : proc.category === 'ASET_TETAP' ? 'ASSET' : 'OPERASIONAL',
      debitAccountCode: proc.debitAccountCode,
      debitAccountName: proc.debitAccountName,
      creditAccountCode: '1102',
      creditAccountName: 'Bank Syariah Yayasan',
      amount: proc.amount,
      referenceNo: proc.code,
      notes: `Pengeluaran disetujui berjenjang oleh Kepsek, Bendahara Yayasan & Ketua Yayasan.`,
    };
    handleAddJournalEntry(journal);

    // 3. If Fixed Asset category, register to FixedAsset list to synchronize with Balance Sheet!
    if (proc.category === 'ASET_TETAP') {
      const newAsset: FixedAsset = {
        id: `ast-sip-${Date.now()}`,
        code: `AST-SIPLAH-${Date.now().toString().slice(-4)}`,
        name: proc.title,
        category: 'Peralatan & Komputer',
        purchaseDate: new Date().toISOString().split('T')[0],
        acquisitionCost: proc.amount,
        usefulLifeYears: 5,
        accumulatedDepreciation: 0,
        bookValue: proc.amount,
        annualDepreciation: Math.round(proc.amount / 5),
        condition: 'Baik',
      };
      setFixedAssets((prev) => [newAsset, ...prev]);
    }

    // 4. Update realization in ARKAS budget matching source
    setArkasBudget((prev) =>
      prev.map((b) =>
        b.fundingSource === proc.fundingSource
          ? { ...b, realizedAmount: b.realizedAmount + proc.amount }
          : b
      )
    );
  };

  // --- ACADEMIC & RAPORT HANDLERS ---
  const handleAddJournalRombel = (journal: Omit<TeacherJournalRombel, 'id' | 'status'>) => {
    const newJrn: TeacherJournalRombel = {
      ...journal,
      id: `jrn-rom-${Date.now()}`,
      status: 'DIUSULKAN_GURU',
    };
    setTeacherJournals((prev) => [newJrn, ...prev]);
  };

  const handleApproveJournalRombel = (id: string, feedback?: string) => {
    setTeacherJournals((prev) =>
      prev.map((j) =>
        j.id === id
          ? {
              ...j,
              status: 'DISETUJUI_KEPSEK',
              principalFeedback: feedback || 'Disetujui Kepala Sekolah untuk Rombel.',
              approvedDate: new Date().toISOString().split('T')[0],
            }
          : j
      )
    );
  };

  const handleAddERaport = (raport: Omit<ERaport, 'id'>) => {
    const newRap: ERaport = {
      ...raport,
      id: `rap-${Date.now()}`,
    };
    setERaports((prev) => [newRap, ...prev]);
  };

  const handleUpdateERaport = (raport: ERaport) => {
    setERaports((prev) => {
      const idx = prev.findIndex(
        (item) =>
          item.id === raport.id ||
          (raport.studentId && item.studentId === raport.studentId) ||
          (raport.nisn && (item.nisn === raport.nisn || item.studentName.toLowerCase() === raport.studentName.toLowerCase()))
      );
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], ...raport };
        return updated;
      }
      return [raport, ...prev];
    });
  };

  const handleApproveERaport = (id: string) => {
    setERaports((prev) => {
      const exists = prev.some((r) => r.id === id);
      if (exists) {
        return prev.map((r) => (r.id === id ? { ...r, status: 'DITERBITKAN' } : r));
      }
      return prev.map((r) => (r.id === id ? { ...r, status: 'DITERBITKAN' } : r));
    });
  };

  const handleAddArkasBudgetItem = (item: Omit<ArkasBudgetItem, 'id' | 'code'>) => {
    const newItem: ArkasBudgetItem = {
      ...item,
      id: `ark-${Date.now()}`,
      code: `ARK-2026-${String(arkasBudget.length + 1).padStart(2, '0')}`,
    };
    setArkasBudget((prev) => [...prev, newItem]);
  };

  // Handler Account CRUD
  const handleAddAccount = (acc: Account) => {
    setAccounts((prev) => [...prev, acc]);
  };

  const handleUpdateAccount = (code: string, updatedData: Partial<Account>) => {
    setAccounts((prev) =>
      prev.map((acc) => (acc.code === code ? { ...acc, ...updatedData } : acc))
    );
  };

  const handleDeleteAccount = (code: string) => {
    setAccounts((prev) => prev.filter((acc) => acc.code !== code));
  };

  // --- HANDLERS FOR MASTER DATA ---
  const handleAddStudent = (std: Student) => setStudents((prev) => [...prev, std]);
  const handleImportStudents = (newStudents: Student[]) => {
    setStudents((prev) => {
      const map = new Map<string, Student>();
      // Preserve existing students by unique key
      prev.forEach((s) => {
        const key = s.id || (s.nis ? `nis-${s.nis.trim().toLowerCase()}` : `std-${s.name.trim().toLowerCase()}`);
        map.set(key, s);
      });
      // Replace/add imported students ensuring no valid imported student is dropped
      newStudents.forEach((s) => {
        const key = s.id || (s.nis ? `nis-${s.nis.trim().toLowerCase()}` : `std-imp-${Math.random()}`);
        map.set(key, s);
      });
      return Array.from(map.values());
    });
  };
  const handleUpdateStudent = (std: Student) => setStudents((prev) => prev.map((s) => (s.id === std.id ? std : s)));
  const handleDeleteStudent = (id: string) => setStudents((prev) => prev.filter((s) => s.id !== id));
  const handleDeleteAllStudents = () => {
    setStudents([]);
    safeSetLocalStorage('yayasan_students', []);
  };
  const handleRestoreDefaultStudents = () => {
    setStudents(INITIAL_STUDENTS);
    safeSetLocalStorage('yayasan_students', INITIAL_STUDENTS);
  };
  const handleUpdateStudentSpp = (studentId: string, status: 'LUNAS' | 'MENUNGGU' | 'TUNGGAKAN') => {
    setStudents((prev) => prev.map((s) => (s.id === studentId ? { ...s, sppStatus: status } : s)));
  };

  const handleImportTeachers = (newTeachers: Teacher[]) => {
    setTeachers((prev) => {
      const map = new Map<string, Teacher>();
      // Preserve existing teachers
      prev.forEach((t) => {
        const key = (t.nip || t.nipy || t.name).trim().toLowerCase();
        map.set(key, t);
      });
      // Replace/add imported teachers
      newTeachers.forEach((t) => {
        const key = (t.nip || t.nipy || t.name).trim().toLowerCase();
        map.set(key, t);
      });

      const next = Array.from(map.values());
      handleSyncPayrollToLiabilities(next);
      return next;
    });
  };

  // Payroll Sync Handler
  const handleSyncPayrollToLiabilities = (currentTeachers: Teacher[] = teachers) => {
    const totalGuruNet = currentTeachers
      .filter((t) => t.role !== 'Kepala Sekolah')
      .reduce((sum, t) => sum + (t.netSalary || 0), 0);

    const totalKepsekNet = currentTeachers
      .filter((t) => t.role === 'Kepala Sekolah')
      .reduce((sum, t) => sum + (t.netSalary || 0), 0);

    const totalPph = currentTeachers.reduce((sum, t) => sum + (t.pph21 || 0), 0);
    const totalBpjs = currentTeachers.reduce((sum, t) => sum + (t.bpjs || 0), 0);

    setAccounts((prevAccounts) =>
      prevAccounts.map((acc) => {
        if (acc.code === '2101') return { ...acc, balance: totalGuruNet };
        if (acc.code === '2102') return { ...acc, balance: totalKepsekNet };
        if (acc.code === '2103') return { ...acc, balance: totalPph };
        if (acc.code === '2104') return { ...acc, balance: totalBpjs };
        return acc;
      })
    );
  };

  const handleAddTeacher = (tch: Teacher) => {
    setTeachers((prev) => {
      const next = [...prev, tch];
      handleSyncPayrollToLiabilities(next);
      return next;
    });
  };

  const handleUpdateTeacher = (tch: Teacher) => {
    setTeachers((prev) => {
      const next = prev.map((t) => (t.id === tch.id ? tch : t));
      handleSyncPayrollToLiabilities(next);
      return next;
    });
  };

  const handleDeleteTeacher = (id: string) => {
    setTeachers((prev) => {
      const next = prev.filter((t) => t.id !== id);
      handleSyncPayrollToLiabilities(next);
      return next;
    });
  };

  const handleAddBoardMember = (brd: FoundationBoard) => setBoardMembers((prev) => [...prev, brd]);
  const handleUpdateBoardMember = (brd: FoundationBoard) => setBoardMembers((prev) => prev.map((b) => (b.id === brd.id ? brd : b)));
  const handleDeleteBoardMember = (id: string) => setBoardMembers((prev) => prev.filter((b) => b.id !== id));

  const handleAddSupplier = (sup: Supplier) => setSuppliers((prev) => [...prev, sup]);
  const handleUpdateSupplier = (sup: Supplier) => setSuppliers((prev) => prev.map((s) => (s.id === sup.id ? sup : s)));
  const handleDeleteSupplier = (id: string) => setSuppliers((prev) => prev.filter((s) => s.id !== id));

  const handleAddAsset = (ast: FixedAsset) => setFixedAssets((prev) => [...prev, ast]);
  const handleUpdateAsset = (ast: FixedAsset) => setFixedAssets((prev) => prev.map((a) => (a.id === ast.id ? ast : a)));
  const handleDeleteAsset = (id: string) => setFixedAssets((prev) => prev.filter((a) => a.id !== id));

  const handleUpdateStudentSppStatus = (studentId: string, newStatus: 'LUNAS' | 'MENUNGGU' | 'TUNGGAKAN') => {
    setStudents((prev) => {
      const next = prev.map((s) => (s.id === studentId ? { ...s, sppStatus: newStatus } : s));
      safeSetLocalStorage('yayasan_students', next);
      return next;
    });
  };

  // Handler Reset Data to initial dataset
  const handleResetData = () => {
    localStorage.clear();
    setFoundationProfile(INITIAL_FOUNDATION_PROFILE);
    setAccounts(INITIAL_ACCOUNTS);
    setJournalEntries(INITIAL_JOURNAL_ENTRIES);
    setStudents(INITIAL_STUDENTS);
    setTeachers(INITIAL_TEACHERS);
    setFixedAssets(INITIAL_FIXED_ASSETS);
    setBoardMembers(INITIAL_BOARD_MEMBERS);
    setSuppliers(INITIAL_SUPPLIERS);
    setSiplahProcurements(INITIAL_SIPLAH_PROCUREMENTS);
    setHeroBanners(INITIAL_HERO_BANNERS);
    setSpeeches(INITIAL_SPEECHES);
    setVisionMission(INITIAL_VISION_MISSION);
    setNewsArticles(INITIAL_NEWS_ARTICLES);
    setGalleryItems(INITIAL_GALLERY_ITEMS);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setERaports(INITIAL_E_RAPORTS);
    setTeacherJournals(INITIAL_TEACHER_JOURNALS);
    setArkasBudget(INITIAL_ARKAS_BUDGET);
    setPpdbConfig(INITIAL_PPDB_CONFIG);
    setLayoutConfig(INITIAL_WEBSITE_LAYOUT_CONFIG);

    safeSetLocalStorage('yayasan_profile', INITIAL_FOUNDATION_PROFILE);
    safeSetLocalStorage('yayasan_accounts', INITIAL_ACCOUNTS);
    safeSetLocalStorage('yayasan_journals', INITIAL_JOURNAL_ENTRIES);
    safeSetLocalStorage('yayasan_students', INITIAL_STUDENTS);
    safeSetLocalStorage('yayasan_teachers', INITIAL_TEACHERS);
    safeSetLocalStorage('yayasan_assets', INITIAL_FIXED_ASSETS);
    safeSetLocalStorage('yayasan_board_members', INITIAL_BOARD_MEMBERS);
    safeSetLocalStorage('yayasan_suppliers', INITIAL_SUPPLIERS);
    safeSetLocalStorage('yayasan_siplah_procurements', INITIAL_SIPLAH_PROCUREMENTS);
    safeSetLocalStorage('yayasan_hero_banners', INITIAL_HERO_BANNERS);
    safeSetLocalStorage('yayasan_speeches', INITIAL_SPEECHES);
    safeSetLocalStorage('yayasan_vision_mission', INITIAL_VISION_MISSION);
    safeSetLocalStorage('yayasan_news_articles', INITIAL_NEWS_ARTICLES);
    safeSetLocalStorage('yayasan_gallery_items', INITIAL_GALLERY_ITEMS);
    safeSetLocalStorage('yayasan_achievements', INITIAL_ACHIEVEMENTS);
    safeSetLocalStorage('yayasan_e_raports', INITIAL_E_RAPORTS);
    safeSetLocalStorage('yayasan_teacher_journals', INITIAL_TEACHER_JOURNALS);
    safeSetLocalStorage('yayasan_arkas_budget', INITIAL_ARKAS_BUDGET);
    safeSetLocalStorage('yayasan_ppdb_config', INITIAL_PPDB_CONFIG);
    safeSetLocalStorage('yayasan_website_layout_config', INITIAL_WEBSITE_LAYOUT_CONFIG);
  };

  const handleExportFullBackup = () => {
    const fullBackup = {
      yayasan_profile: foundationProfile,
      yayasan_accounts: accounts,
      yayasan_journals: journalEntries,
      yayasan_students: students,
      yayasan_teachers: teachers,
      yayasan_assets: fixedAssets,
      yayasan_board_members: boardMembers,
      yayasan_suppliers: suppliers,
      yayasan_siplah_procurements: siplahProcurements,
      yayasan_hero_banners: heroBanners,
      yayasan_speeches: speeches,
      yayasan_vision_mission: visionMission,
      yayasan_news_articles: newsArticles,
      yayasan_gallery_items: galleryItems,
      yayasan_achievements: achievements,
      yayasan_e_raports: eRaports,
      yayasan_teacher_journals: teacherJournals,
      yayasan_arkas_budget: arkasBudget,
      yayasan_ppdb_config: ppdbConfig,
      yayasan_website_layout_config: layoutConfig,
      exportedAt: new Date().toISOString(),
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `backup_yayasan_daarul_habibah_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportFullBackup = (importedData: any) => {
    if (!importedData) return;
    if (importedData.yayasan_profile) setFoundationProfile(importedData.yayasan_profile);
    if (importedData.yayasan_accounts) setAccounts(importedData.yayasan_accounts);
    if (importedData.yayasan_journals) setJournalEntries(importedData.yayasan_journals);
    if (importedData.yayasan_students) setStudents(importedData.yayasan_students);
    if (importedData.yayasan_teachers) setTeachers(importedData.yayasan_teachers);
    if (importedData.yayasan_assets) setFixedAssets(importedData.yayasan_assets);
    if (importedData.yayasan_board_members) setBoardMembers(importedData.yayasan_board_members);
    if (importedData.yayasan_suppliers) setSuppliers(importedData.yayasan_suppliers);
    if (importedData.yayasan_siplah_procurements) setSiplahProcurements(importedData.yayasan_siplah_procurements);
    if (importedData.yayasan_hero_banners) setHeroBanners(importedData.yayasan_hero_banners);
    if (importedData.yayasan_speeches) setSpeeches(importedData.yayasan_speeches);
    if (importedData.yayasan_vision_mission) setVisionMission(importedData.yayasan_vision_mission);
    if (importedData.yayasan_news_articles) setNewsArticles(importedData.yayasan_news_articles);
    if (importedData.yayasan_gallery_items) setGalleryItems(importedData.yayasan_gallery_items);
    if (importedData.yayasan_achievements) setAchievements(importedData.yayasan_achievements);
    if (importedData.yayasan_e_raports) setERaports(importedData.yayasan_e_raports);
    if (importedData.yayasan_teacher_journals) setTeacherJournals(importedData.yayasan_teacher_journals);
    if (importedData.yayasan_arkas_budget) setArkasBudget(importedData.yayasan_arkas_budget);
    if (importedData.yayasan_ppdb_config) setPpdbConfig(importedData.yayasan_ppdb_config);
    if (importedData.yayasan_website_layout_config) setLayoutConfig(importedData.yayasan_website_layout_config);

    Object.keys(importedData).forEach((key) => {
      if (key.startsWith('yayasan_')) {
        safeSetLocalStorage(key, importedData[key]);
      }
    });
  };

  const handleOpenRoleLoginModal = (targetRole?: UserRole) => {
    setLoginTargetRole(targetRole || 'KEPALA_SEKOLAH');
    setIsRoleLoginModalOpen(true);
  };

  const handleSuccessRoleLogin = (role: UserRole) => {
    setCurrentRole(role);
    setIsRoleLoginModalOpen(false);
    setIsPublicView(false);

    const cfg = roleConfigs[role];
    if (cfg && cfg.allowedTabs && !cfg.allowedTabs.includes(activeTab)) {
      setActiveTab(cfg.allowedTabs[0] || 'dashboard');
    }
  };

  // Public Website view
  if (isPublicView) {
    return (
      <>
        <PublicWebsiteView
          foundationProfile={foundationProfile}
          heroBanners={heroBanners}
          speeches={speeches}
          visionMission={visionMission}
          newsArticles={newsArticles}
          galleryItems={galleryItems}
          achievements={achievements}
          eRaports={eRaports}
          students={students}
          teachers={teachers}
          layoutConfig={layoutConfig}
          ppdbConfig={ppdbConfig}
          onUpdateLayoutConfig={setLayoutConfig}
          onOpenInternalPortal={(role) => {
            handleOpenRoleLoginModal(role);
          }}
          onOpenRoleLoginModal={handleOpenRoleLoginModal}
        />
        <RoleLoginModal
          isOpen={isRoleLoginModalOpen}
          targetRole={loginTargetRole}
          roleConfigs={roleConfigs}
          onSuccessLogin={handleSuccessRoleLogin}
          onClose={() => setIsRoleLoginModalOpen(false)}
        />
      </>
    );
  }

  // Internal ERP View
  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 flex flex-col print:bg-white print:min-h-0">
      
      {/* Top Header Navbar */}
      <Navbar
        foundationProfile={foundationProfile}
        filter={filter}
        setFilter={setFilter}
        currentRole={currentRole}
        roleConfigs={roleConfigs}
        onOpenNewTransaction={() => setShowAddModal(true)}
        onOpenAiAssistant={() => setActiveTab('ai')}
        onOpenSettings={() => setActiveTab('pengaturan')}
        onOpenRoleLoginModal={handleOpenRoleLoginModal}
        onReturnToPublicSite={() => setIsPublicView(true)}
        onResetData={handleResetData}
        onPrint={() => printDocument('printable-report', `Laporan Keuangan ${foundationProfile.name}`)}
      />

      {/* Main Body */}
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-[1920px] mx-auto px-1 sm:px-3 lg:px-4">
        
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeReportSubTab={activeReportSubTab}
          setActiveReportSubTab={setActiveReportSubTab}
          currentRole={currentRole}
          roleConfigs={roleConfigs}
          onOpenPublicSite={() => setIsPublicView(true)}
          onOpenRoleLoginModal={handleOpenRoleLoginModal}
        />

        {/* Content View */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6 overflow-y-auto min-w-0">
          
          {activeTab === 'siswa' && (
            <MasterDataView
              initialTab="siswa"
              students={students}
              teachers={teachers}
              boardMembers={boardMembers}
              suppliers={suppliers}
              foundationProfile={foundationProfile}
              onNavigatePayroll={() => setActiveTab('payroll')}
              onSyncPayrollLiabilities={handleSyncPayrollToLiabilities}
              onAddStudent={handleAddStudent}
              onImportStudents={handleImportStudents}
              onUpdateStudent={handleUpdateStudent}
              onDeleteStudent={handleDeleteStudent}
              onDeleteAllStudents={handleDeleteAllStudents}
              onRestoreDefaultStudents={handleRestoreDefaultStudents}
              onAddTeacher={handleAddTeacher}
              onImportTeachers={handleImportTeachers}
              onUpdateTeacher={handleUpdateTeacher}
              onDeleteTeacher={handleDeleteTeacher}
              onAddBoardMember={handleAddBoardMember}
              onUpdateBoardMember={handleUpdateBoardMember}
              onDeleteBoardMember={handleDeleteBoardMember}
              onAddSupplier={handleAddSupplier}
              onUpdateSupplier={handleUpdateSupplier}
              onDeleteSupplier={handleDeleteSupplier}
              onUpdateFoundationProfile={setFoundationProfile}
            />
          )}

          {activeTab === 'payroll' && (
            <PayrollSdmView
              teachers={teachers}
              boardMembers={boardMembers}
              suppliers={suppliers}
              accounts={accounts}
              foundationProfile={foundationProfile}
              onAddTeacher={handleAddTeacher}
              onUpdateTeacher={handleUpdateTeacher}
              onDeleteTeacher={handleDeleteTeacher}
              onImportTeachers={handleImportTeachers}
              onAddBoardMember={handleAddBoardMember}
              onUpdateBoardMember={handleUpdateBoardMember}
              onDeleteBoardMember={handleDeleteBoardMember}
              onAddSupplier={handleAddSupplier}
              onUpdateSupplier={handleUpdateSupplier}
              onDeleteSupplier={handleDeleteSupplier}
              onAddJournalEntry={handleAddJournalEntry}
              onSyncPayrollLiabilities={handleSyncPayrollToLiabilities}
            />
          )}

          {activeTab === 'dashboard' && (
            <OverviewDashboard
              accounts={accounts}
              journalEntries={journalEntries}
              students={students}
              teachers={teachers}
              fixedAssets={fixedAssets}
              onOpenNewTransaction={() => setShowAddModal(true)}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'siplah' && (
            <SiPLahProcurementView
              procurements={siplahProcurements}
              accounts={accounts}
              currentRole={currentRole}
              onProposeProcurement={handleProposeProcurement}
              onApproveByTreasurer={handleApproveTreasurer}
              onAcknowledgeByChairman={handleAcknowledgeChairman}
              onDisburseProcurement={handleDisburseProcurement}
            />
          )}

          {(activeTab === 'e_raport' || activeTab === 'academic') && (
            <AcademicRombelView
              eRaports={eRaports}
              teacherJournals={teacherJournals}
              students={students}
              teachers={teachers}
              currentRole={currentRole}
              forcedSubTab="raport"
              onUpdateRaport={handleUpdateERaport}
              onAddRaport={handleAddERaport}
              onAddJournal={handleAddJournalRombel}
              onApproveJournal={handleApproveJournalRombel}
              onApproveRaport={handleApproveERaport}
              onUpdateStudentSppStatus={handleUpdateStudentSppStatus}
            />
          )}

          {activeTab === 'jurnal' && (
            <AcademicRombelView
              eRaports={eRaports}
              teacherJournals={teacherJournals}
              students={students}
              teachers={teachers}
              currentRole={currentRole}
              forcedSubTab="jurnal"
              onUpdateRaport={handleUpdateERaport}
              onAddRaport={handleAddERaport}
              onAddJournal={handleAddJournalRombel}
              onApproveJournal={handleApproveJournalRombel}
              onApproveRaport={handleApproveERaport}
              onUpdateStudentSppStatus={handleUpdateStudentSppStatus}
            />
          )}

          {activeTab === 'arkas' && (
            <ArkasBudgetView
              arkasBudget={arkasBudget}
              onAddBudgetItem={handleAddArkasBudgetItem}
            />
          )}

          {activeTab === 'cms' && (
            <CmsAdminView
              userRole={currentRole}
              heroBanners={heroBanners}
              speeches={speeches}
              visionMission={visionMission}
              newsArticles={newsArticles}
              galleryItems={galleryItems}
              achievements={achievements}
              layoutConfig={layoutConfig}
              foundationProfile={foundationProfile}
              teachers={teachers}
              ppdbConfig={ppdbConfig}
              onUpdatePpdbConfig={setPpdbConfig}
              onUpdateHeroBanners={setHeroBanners}
              onUpdateSpeeches={setSpeeches}
              onUpdateVisionMission={setVisionMission}
              onUpdateNewsArticles={setNewsArticles}
              onUpdateGalleryItems={setGalleryItems}
              onUpdateAchievements={setAchievements}
              onUpdateLayoutConfig={setLayoutConfig}
              onSaveProfile={setFoundationProfile}
              onUpdateTeacher={handleUpdateTeacher}
              onDeleteTeacher={handleDeleteTeacher}
              onAddTeacher={handleAddTeacher}
            />
          )}

          {activeTab === 'reports' && (
            <FinancialReportsView
              accounts={accounts}
              journalEntries={journalEntries}
              fixedAssets={fixedAssets}
              activeSubTab={activeReportSubTab}
              setActiveSubTab={setActiveReportSubTab}
              year={filter.year}
              foundationProfile={foundationProfile}
            />
          )}

          {activeTab === 'calk' && (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <CALKView accounts={accounts} fixedAssets={fixedAssets} year={filter.year} foundationProfile={foundationProfile} />
            </div>
          )}

          {activeTab === 'transactions' && (
            <TransactionManagerView
              accounts={accounts}
              journalEntries={journalEntries}
              students={students}
              teachers={teachers}
              onAddJournalEntry={handleAddJournalEntry}
              onDeleteJournalEntry={handleDeleteJournalEntry}
              onUpdateStudentSpp={handleUpdateStudentSpp}
              onSyncPayrollLiabilities={handleSyncPayrollToLiabilities}
              foundationProfile={foundationProfile}
            />
          )}

          {activeTab === 'coa' && (
            <CoaAndLedgerView
              accounts={accounts}
              journalEntries={journalEntries}
              onAddAccount={handleAddAccount}
              onUpdateAccount={handleUpdateAccount}
              onDeleteAccount={handleDeleteAccount}
              onAddJournalEntry={handleAddJournalEntry}
              onUpdateJournalEntry={handleUpdateJournalEntry}
              onDeleteJournalEntry={handleDeleteJournalEntry}
            />
          )}

          {activeTab === 'assets' && (
            <FixedAssetView
              assets={fixedAssets}
              onAddAsset={handleAddAsset}
              onUpdateAsset={handleUpdateAsset}
              onDeleteAsset={handleDeleteAsset}
            />
          )}

          {activeTab === 'master' && (
            <MasterDataView
              students={students}
              teachers={teachers}
              boardMembers={boardMembers}
              suppliers={suppliers}
              foundationProfile={foundationProfile}
              onSyncPayrollLiabilities={handleSyncPayrollToLiabilities}
              onAddStudent={handleAddStudent}
              onImportStudents={handleImportStudents}
              onUpdateStudent={handleUpdateStudent}
              onDeleteStudent={handleDeleteStudent}
              onDeleteAllStudents={handleDeleteAllStudents}
              onRestoreDefaultStudents={handleRestoreDefaultStudents}
              onAddTeacher={handleAddTeacher}
              onImportTeachers={handleImportTeachers}
              onUpdateTeacher={handleUpdateTeacher}
              onDeleteTeacher={handleDeleteTeacher}
              onAddBoardMember={handleAddBoardMember}
              onUpdateBoardMember={handleUpdateBoardMember}
              onDeleteBoardMember={handleDeleteBoardMember}
              onAddSupplier={handleAddSupplier}
              onUpdateSupplier={handleUpdateSupplier}
              onDeleteSupplier={handleDeleteSupplier}
              onUpdateFoundationProfile={setFoundationProfile}
            />
          )}

          {activeTab === 'pengaturan' && (
            <FoundationSettingsView
              profile={foundationProfile}
              onSaveProfile={setFoundationProfile}
              onResetDefaults={() => setFoundationProfile(INITIAL_FOUNDATION_PROFILE)}
              onRestoreMasterData={handleResetData}
              onExportBackup={handleExportFullBackup}
              onImportBackup={handleImportFullBackup}
            />
          )}

          {activeTab === 'hak_akses' && (
            <RoleAccessManagementView
              roleConfigs={roleConfigs}
              currentRole={currentRole}
              onUpdateConfigs={setRoleConfigs}
            />
          )}

          {activeTab === 'ai' && (
            <AiFinancialAdvisor
              accounts={accounts}
              journalEntries={journalEntries}
              fixedAssets={fixedAssets}
            />
          )}

        </main>

      </div>

      {/* Role Login Modal in Internal View */}
      <RoleLoginModal
        isOpen={isRoleLoginModalOpen}
        targetRole={loginTargetRole}
        roleConfigs={roleConfigs}
        onSuccessLogin={handleSuccessRoleLogin}
        onClose={() => setIsRoleLoginModalOpen(false)}
      />

      {/* Global Add Transaction Modal */}
      {showAddModal && (
        <AddTransactionModal
          accounts={accounts}
          onClose={() => setShowAddModal(false)}
          onAddJournalEntry={handleAddJournalEntry}
        />
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-4 px-6 border-t border-slate-800 text-center text-xs print:hidden">
        <p>
          &copy; {new Date().getFullYear()} Yayasan Pendidikan Daarul Habibah &bull; Sistem Informasi Keuangan & ERP Non-Laba sesuai Standar <strong>ISAK 35 (IAI)</strong>
        </p>
      </footer>

    </div>
  );
}

