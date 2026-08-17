import { Account, FixedAsset, FoundationBoard, FoundationProfile, JournalEntry, OrgStructureMember, PPDBConfig, SchoolUniformItem, Student, Supplier, Teacher, UniformScheduleDay, WebsiteLayoutConfig, FoundationArchiveDocument, SubjectItem } from '../types';
import { LOCAL_IMAGES } from '../utils/localImages';

export const INITIAL_ORG_STRUCTURE: OrgStructureMember[] = [
  {
    id: 'org-1',
    name: 'Drs. H. M. Syukri, M.M',
    position: 'Pembina Yayasan',
    category: 'YAYASAN',
    nipOrNipy: 'NIPY. 20100101',
    phone: '0812-1111-2222',
    email: 'syukri@daarulhabibah.or.id',
    photoUrl: LOCAL_IMAGES.pembina,
    order: 1,
  },
  {
    id: 'org-2',
    name: 'H. Ahmad Dahlan, M.Ag',
    position: 'Ketua Yayasan',
    category: 'YAYASAN',
    nipOrNipy: 'NIPY. 20120502',
    phone: '0812-2222-3333',
    email: 'ahmad.dahlan@daarulhabibah.or.id',
    photoUrl: LOCAL_IMAGES.ketua,
    order: 2,
  },
  {
    id: 'org-3',
    name: 'H. Ahmad Subagja, S.H',
    position: 'Sekretaris Yayasan',
    category: 'YAYASAN',
    nipOrNipy: 'NIPY. 20150303',
    phone: '0812-5555-6666',
    email: 'ahmad.subagja@daarulhabibah.or.id',
    photoUrl: LOCAL_IMAGES.sekretaris,
    order: 3,
  },
  {
    id: 'org-4',
    name: 'Hj. Nurul Aini, S.E., M.Ak',
    position: 'Bendahara Yayasan',
    category: 'YAYASAN',
    nipOrNipy: 'NIPY. 20180209',
    phone: '0812-3333-4444',
    email: 'nurul.aini@daarulhabibah.or.id',
    photoUrl: LOCAL_IMAGES.bendahara,
    order: 4,
  },
  {
    id: 'org-5',
    name: 'Masykur Rohana, S.Sos',
    position: 'Kepala Sekolah',
    category: 'SEKOLAH',
    nipOrNipy: 'NIPY. 1985031201',
    phone: '0812-8899-0011',
    email: 'masykur.rohana@daarulhabibah.sch.id',
    photoUrl: LOCAL_IMAGES.kepalaSekolah,
    order: 5,
  },
  {
    id: 'org-6',
    name: 'Iis Rohmayanti, S.Pd',
    position: 'Wakasek Kurikulum & Wali Kelas 4',
    category: 'SEKOLAH',
    nipOrNipy: 'NIPY. 1990041502',
    phone: '0813-9999-0000',
    email: 'iis.rohmayanti@daarulhabibah.sch.id',
    photoUrl: LOCAL_IMAGES.guruWanita,
    order: 6,
  },
  {
    id: 'org-7',
    name: 'Mega Andini Putri, S.Pd',
    position: 'Kesiswaan & Wali Kelas 6',
    category: 'SEKOLAH',
    nipOrNipy: 'NIPY. 1992082003',
    phone: '0814-1234-5678',
    email: 'mega.andini@daarulhabibah.sch.id',
    photoUrl: LOCAL_IMAGES.guruWanita,
    order: 7,
  },
];

export const INITIAL_FOUNDATION_PROFILE: FoundationProfile = {
  name: 'Yayasan Pendidikan Daarul Habibah',
  address: 'Jl. Pendidikan No. 45, Kebayoran Baru, Jakarta Selatan 12150',
  phone: '021-7890123 / 0812-3344-5566',
  email: 'info@daarulhabibah.or.id',
  website: 'www.daarulhabibah.or.id',
  legalNumber: 'AHU-0012894.AH.01.04 TAHUN 2018',
  pembinaName: 'Drs. H. M. Syukri, M.M',
  pembinaTitle: 'Pembina Yayasan',
  pembinaNip: 'NIPY. 20100101',
  pembinaPhotoUrl: LOCAL_IMAGES.pembina,
  leaderName: 'H. Ahmad Dahlan, M.Ag',
  leaderTitle: 'Ketua Yayasan',
  leaderNip: 'NIPY. 20120502',
  leaderPhotoUrl: LOCAL_IMAGES.ketua,
  secretaryName: 'H. Ahmad Subagja, S.H',
  secretaryTitle: 'Sekretaris Yayasan',
  secretaryNip: 'NIPY. 20150303',
  secretaryPhotoUrl: LOCAL_IMAGES.sekretaris,
  treasurerName: 'Hj. Nurul Aini, S.E., M.Ak',
  treasurerTitle: 'Bendahara Yayasan',
  treasurerNip: 'NIPY. 20180209',
  treasurerPhotoUrl: LOCAL_IMAGES.bendahara,
  headmasterName: 'Masykur Rohana, S.Sos',
  headmasterTitle: 'Kepala Sekolah',
  headmasterNip: 'NIPY. 1985031201',
  headmasterPhotoUrl: LOCAL_IMAGES.kepalaSekolah,
  buildingPhotoUrl: LOCAL_IMAGES.building,
  welcomeMessage: "Assalamu'alaikum Warahmatullahi Wabarakatuh. Selamat datang di portal resmi Yayasan Pendidikan Daarul Habibah. Kami bertekad mewujudkan ekosistem pendidikan Islam berakreditasi unggul yang mengintegrasikan penguatan karakter tauhid, keunggulan sains & teknologi, serta akuntabilitas keuangan ISAK 35. Semoga portal ini memberikan kemudahan informasi bagi seluruh wali murid dan masyarakat.",
  leaderSpeechTitle: 'Pidato Amanat Pimpinan: Arah Kebijakan Pendidikan, Transformasi Digital & Pembentukan Karakter Rabbani',
  leaderSpeechContent: `Bismillahirahmanirrahim. Assalamu'alaikum Warahmatullahi Wabarakatuh.

Puji dan syukur senantiasa kita panjatkan ke hadirat Allah SWT atas limpahan rahmat dan hidayah-Nya. Shalawat serta salam semoga tercurahkan kepada Uswah Hasanah kita, Nabi Muhammad SAW.

Hadirin, para orang tua murid, para pendidik, dan seluruh insan pendidikan yang kami hormati.

Lembaga pendidikan bukan sekadar tempat mentransfer ilmu pengetahuan, melainkan kawah candradimuka dalam membentuk watak, adab, dan integritas kepemimpinan masa depan. Di tengah pesatnya perkembangan arus digitalisasi dan kecerdasan buatan (AI), Yayasan Pendidikan Daarul Habibah berdiri kokoh memadukan kurikulum nasional yang adaptif dengan pondasi tauhid yang tangguh.

Dalam mewujudkan visi strategis ini, yayasan menerapkan 4 Pilar Keunggulan Utama:
1. Penguatan Aqidah dan Akhlakul Karimah: Menjadikan Al-Qur'an dan Sunnah sebagai kompas moral peserta didik melalui program Tahfidz, Pembiasaan Salat Dhuha, dan Budaya 5S.
2. Keunggulan Akademik & Digital Literacy: Menyelenggarakan pembelajaran Rombel berbasis ruang kelas digital, laboratorium komputer terpadu, serta aplikasi E-Raport real-time.
3. Tata Kelola Keuangan ISAK 35 & Transparansi Public: Mengelola seluruh dana masyarakat, SPP, dan Dana BOS dengan prinsip akuntabilitas publik berbasis sistem kuitansi digital terintegrasi.
4. Sinergi Unggul Sekolah dan Wali Murid: Membuka saluran komunikasi interaktif antara pihak sekolah dan orang tua murid demi perkembangan holistik anak.

Kami mengajak seluruh bapak/ibu orang tua murid dan pemangku kepentingan untuk terus bergandengan tangan, mendukung putra-putri kita agar tumbuh menjadi pribadi yang berilmu, berakhlak mulia, dan siap memimpin peradaban.

Wassalamu'alaikum Warahmatullahi Wabarakatuh.`,
  aboutTitle: 'Profil & Sejarah Yayasan Pendidikan Daarul Habibah',
  aboutSubtitle: 'Menciptakan Generasi Rabbani Berprestasi, Berkarakter & Menguasai Teknologi',
  aboutHistory: 'Yayasan Pendidikan Daarul Habibah didirikan untuk memberikan pendidikan berkualitas tinggi berbasis nilai-nilai keislaman dan kebudayaan nasional. Sekolah mengelola Rombongan Belajar (Rombel) dari Kelas 1 hingga Kelas 6 dengan ruang kelas modern ber-AC, perpustakaan digital, serta laboratorium sains & komputer.',
  aboutDescription: 'Menyelenggarakan pendidikan formal dari jenjang Sekolah Dasar hingga menengah, dilengkapi akreditasi unggul, fasilitas olahraga, serta tata kelola keuangan ISAK 35 terpercaya.',
  orgStructure: INITIAL_ORG_STRUCTURE,
};

export const INITIAL_ACCOUNTS: Account[] = [
  // Aset Lancar
  { code: '1101', name: 'Kas Operasional', category: 'ASET_LANCAR', balance: 75000000 },
  { code: '1102', name: 'Bank Syariah Yayasan', category: 'ASET_LANCAR', balance: 185000000 },
  { code: '1103', name: 'Piutang SPP Siswa', category: 'ASET_LANCAR', balance: 28000000 },
  { code: '1104', name: 'Piutang Dana BOS', category: 'ASET_LANCAR', balance: 15000000 },
  { code: '1105', name: 'Persediaan ATK', category: 'ASET_LANCAR', balance: 8000000 },

  // Aset Tetap
  { code: '1201', name: 'Tanpa Pembatasan - Tanah', category: 'ASET_TETAP', balance: 500000000 },
  { code: '1202', name: 'Bangunan Gedung Sekolah', category: 'ASET_TETAP', balance: 2000000000 },
  { code: '1203', name: 'Peralatan Mengajar & Lab', category: 'ASET_TETAP', balance: 250000000 },
  { code: '1204', name: 'Komputer & Laptop Pembelajaran', category: 'ASET_TETAP', balance: 180000000 },
  { code: '1205', name: 'Kendaraan Operasional', category: 'ASET_TETAP', balance: 150000000 },
  { code: '1299', name: 'Akumulasi Penyusutan Aset Tetap', category: 'ASET_TETAP', balance: -420000000 },

  // Kewajiban
  { code: '2101', name: 'Hutang Gaji Guru', category: 'KEWAJIBAN', subCategory: 'Kewajiban Jangka Pendek', balance: 19545000 },
  { code: '2102', name: 'Hutang Gaji Kepala Sekolah', category: 'KEWAJIBAN', subCategory: 'Kewajiban Jangka Pendek', balance: 9300000 },
  { code: '2103', name: 'Hutang Pajak PPh Pasal 21', category: 'KEWAJIBAN', subCategory: 'Kewajiban Jangka Pendek', balance: 0 },
  { code: '2104', name: 'Hutang BPJS Ketenagakerjaan', category: 'KEWAJIBAN', subCategory: 'Kewajiban Jangka Pendek', balance: 585000 },
  { code: '2105', name: 'Hutang Supplier ATK & Buku', category: 'KEWAJIBAN', subCategory: 'Kewajiban Jangka Pendek', balance: 15000000 },

  // Aset Neto
  { code: '3101', name: 'Aset Neto Tanpa Pembatasan', category: 'ASET_NETO', restriction: 'TANPA_PEMBATASAN', balance: 2192500000 },
  { code: '3102', name: 'Aset Neto Dengan Pembatasan (Dana BOS)', category: 'ASET_NETO', restriction: 'DENGAN_PEMBATASAN', balance: 700000000 },

  // Pendapatan
  { code: '4101', name: 'Pendapatan Dana BOS', category: 'PENDAPATAN', balance: 700000000 },
  { code: '4102', name: 'Pendapatan SPP Bulanan', category: 'PENDAPATAN', balance: 540000000 },
  { code: '4103', name: 'Pendapatan Uang Pangkal', category: 'PENDAPATAN', balance: 120000000 },
  { code: '4104', name: 'Pendapatan Penjualan Seragam', category: 'PENDAPATAN', balance: 45000000 },
  { code: '4105', name: 'Pendapatan Donasi & Hibah Yayasan', category: 'PENDAPATAN', balance: 80000000 },

  // Beban SDM
  { code: '5101', name: 'Beban Gaji Guru', category: 'BEBAN', subCategory: 'Beban SDM', balance: 480000000 },
  { code: '5102', name: 'Beban Gaji Kepala Sekolah', category: 'BEBAN', subCategory: 'Beban SDM', balance: 120000000 },
  { code: '5103', name: 'Beban Honorarium Pengurus Yayasan', category: 'BEBAN', subCategory: 'Beban SDM', balance: 60000000 },
  { code: '5117', name: 'Beban BPJS Ketenagakerjaan', category: 'BEBAN', subCategory: 'Beban SDM', balance: 18000000 },

  // Beban Pendidikan
  { code: '5104', name: 'Beban Buku Pelajaran', category: 'BEBAN', subCategory: 'Beban Pendidikan', balance: 45000000 },
  { code: '5105', name: 'Beban Alat Peraga & Media Pembelajaran', category: 'BEBAN', subCategory: 'Beban Pendidikan', balance: 30000000 },
  { code: '5106', name: 'Beban Operasional Laboratorium', category: 'BEBAN', subCategory: 'Beban Pendidikan', balance: 25000000 },
  { code: '5118', name: 'Beban Pengembangan Perpustakaan', category: 'BEBAN', subCategory: 'Beban Pendidikan', balance: 15000000 },

  // Beban Operasional
  { code: '5107', name: 'Beban Tagihan Listrik PLN', category: 'BEBAN', subCategory: 'Beban Operasional', balance: 36000000 },
  { code: '5108', name: 'Beban Tagihan Air PDAM', category: 'BEBAN', subCategory: 'Beban Operasional', balance: 12000000 },
  { code: '5109', name: 'Beban Tagihan Internet & Telkom', category: 'BEBAN', subCategory: 'Beban Operasional', balance: 18000000 },
  { code: '5110', name: 'Beban Kebersihan & Sanitasi', category: 'BEBAN', subCategory: 'Beban Operasional', balance: 30000000 },
  { code: '5111', name: 'Beban Keamanan & Satpam', category: 'BEBAN', subCategory: 'Beban Operasional', balance: 24000000 },
  { code: '5112', name: 'Beban ATK & Cetak Materi', category: 'BEBAN', subCategory: 'Beban Operasional', balance: 28000000 },

  // Beban Administrasi
  { code: '5115', name: 'Beban Pajak PPh & Retribusi', category: 'BEBAN', subCategory: 'Beban Administrasi', balance: 35000000 },
  { code: '5113', name: 'Beban Penyusutan Bangunan Gedung', category: 'BEBAN', subCategory: 'Beban Administrasi', balance: 80000000 },
  { code: '5114', name: 'Beban Penyusutan Peralatan & Komputer', category: 'BEBAN', subCategory: 'Beban Administrasi', balance: 35000000 },
  { code: '5116', name: 'Beban Pemeliharaan & Perbaikan Gedung', category: 'BEBAN', subCategory: 'Beban Administrasi', balance: 55000000 },
];

export const INITIAL_STUDENTS: Student[] = [
  { id: 'std-1', nis: '2026101', nisn: '0012345601', name: 'Ahmad Rizky Pratama', gradeClass: 'Kelas 6', sppAmount: 250000, sppStatus: 'LUNAS', contactPhone: '081234567801', parentName: 'Rahmat Hidayat', gender: 'L', address: 'Jl. Ahmad Yani No. 12, Serang', birthPlace: 'Serang', birthDate: '2014-03-15', virtualAccount: '880202026101' },
  { id: 'std-2', nis: '2026102', nisn: '0012345602', name: 'Siti Nurhaliza', gradeClass: 'Kelas 6', sppAmount: 250000, sppStatus: 'LUNAS', contactPhone: '081234567802', parentName: 'Hasan Basri', gender: 'P', address: 'Jl. Sudirman No. 45, Serang', birthPlace: 'Serang', birthDate: '2014-06-20', virtualAccount: '880202026102' },
  { id: 'std-3', nis: '2026103', nisn: '0012345603', name: 'Muhammad Al-Fatih', gradeClass: 'Kelas 5', sppAmount: 250000, sppStatus: 'LUNAS', contactPhone: '081234567803', parentName: 'Abdullah', gender: 'L', address: 'Jl. Veteran No. 8, Serang', birthPlace: 'Serang', birthDate: '2015-01-10', virtualAccount: '880202026103' },
  { id: 'std-4', nis: '2026104', nisn: '0012345604', name: 'Aisyah Humaira', gradeClass: 'Kelas 5', sppAmount: 250000, sppStatus: 'MENUNGGU', contactPhone: '081234567804', parentName: 'Umar Khalid', gender: 'P', address: 'Jl. Mawar No. 3, Serang', birthPlace: 'Serang', birthDate: '2015-04-25', virtualAccount: '880202026104' },
  { id: 'std-5', nis: '2026105', nisn: '0012345605', name: 'Bilal Ramadan', gradeClass: 'Kelas 4', sppAmount: 250000, sppStatus: 'LUNAS', contactPhone: '081234567805', parentName: 'Zubair', gender: 'L', address: 'Jl. Melati No. 19, Serang', birthPlace: 'Serang', birthDate: '2016-08-17', virtualAccount: '880202026105' },
  { id: 'std-6', nis: '2026106', nisn: '0012345606', name: 'Khadijah Az-Zahra', gradeClass: 'Kelas 4', sppAmount: 250000, sppStatus: 'LUNAS', contactPhone: '081234567806', parentName: 'Ali bin Abi', gender: 'P', address: 'Jl. Anggrek No. 2, Serang', birthPlace: 'Serang', birthDate: '2016-11-05', virtualAccount: '880202026106' },
  { id: 'std-7', nis: '2026107', nisn: '0012345607', name: 'Fatimah Zahra', gradeClass: 'Kelas 3', sppAmount: 250000, sppStatus: 'MENUNGGU', contactPhone: '081234567807', parentName: 'Usman', gender: 'P', address: 'Jl. Dahlia No. 14, Serang', birthPlace: 'Serang', birthDate: '2017-02-14', virtualAccount: '880202026107' },
  { id: 'std-8', nis: '2026108', nisn: '0012345608', name: 'Zaid bin Haritsah', gradeClass: 'Kelas 3', sppAmount: 250000, sppStatus: 'LUNAS', contactPhone: '081234567808', parentName: 'Haritsah', gender: 'L', address: 'Jl. Kenanga No. 27, Serang', birthPlace: 'Serang', birthDate: '2017-07-09', virtualAccount: '880202026108' },
  { id: 'std-9', nis: '2026109', nisn: '0012345609', name: 'Maryam Qonita', gradeClass: 'Kelas 2', sppAmount: 250000, sppStatus: 'LUNAS', contactPhone: '081234567809', parentName: 'Imran', gender: 'P', address: 'Jl. Kamboja No. 11, Serang', birthPlace: 'Serang', birthDate: '2018-05-01', virtualAccount: '880202026109' },
  { id: 'std-10', nis: '2026110', nisn: '0012345610', name: 'Yusuf Habibi', gradeClass: 'Kelas 2', sppAmount: 250000, sppStatus: 'TUNGGAKAN', contactPhone: '081234567810', parentName: 'Ya\'qub', gender: 'L', address: 'Jl. Flamboyan No. 33, Serang', birthPlace: 'Serang', birthDate: '2018-09-12', virtualAccount: '880202026110' },
  { id: 'std-11', nis: '2026111', nisn: '0012345611', name: 'Ibrahim Al-Khalil', gradeClass: 'Kelas 1', sppAmount: 250000, sppStatus: 'LUNAS', contactPhone: '081234567811', parentName: 'Azar', gender: 'L', address: 'Jl. Teratai No. 5, Serang', birthPlace: 'Serang', birthDate: '2019-01-20', virtualAccount: '880202026111' },
  { id: 'std-12', nis: '2026112', nisn: '0012345612', name: 'Anisa Rahmawati', gradeClass: 'Kelas 1', sppAmount: 250000, sppStatus: 'LUNAS', contactPhone: '081234567812', parentName: 'Bambang', gender: 'P', address: 'Jl. Cempaka No. 88, Serang', birthPlace: 'Serang', birthDate: '2019-04-18', virtualAccount: '880202026112' },
  { id: 'std-13', nis: '2026113', nisn: '0012345613', name: 'Naufal Farisi', gradeClass: 'Kelas 6', sppAmount: 250000, sppStatus: 'LUNAS', contactPhone: '081234567813', parentName: 'Salman', gender: 'L', address: 'Jl. Siliwangi No. 100, Serang', birthPlace: 'Serang', birthDate: '2014-08-30', virtualAccount: '880202026113' },
  { id: 'std-14', nis: '2026114', nisn: '0012345614', name: 'Syifa Fauziah', gradeClass: 'Kelas 5', sppAmount: 250000, sppStatus: 'LUNAS', contactPhone: '081234567814', parentName: 'Achmad', gender: 'P', address: 'Jl. Diponegoro No. 15, Serang', birthPlace: 'Serang', birthDate: '2015-10-14', virtualAccount: '880202026114' },
  { id: 'std-15', nis: '2026115', nisn: '0012345615', name: 'Tariq bin Ziyad', gradeClass: 'Kelas 4', sppAmount: 250000, sppStatus: 'LUNAS', contactPhone: '081234567815', parentName: 'Ziyad', gender: 'L', address: 'Jl. Gajah Mada No. 22, Serang', birthPlace: 'Serang', birthDate: '2016-03-08', virtualAccount: '880202026115' },
  { id: 'std-16', nis: '2026116', nisn: '0012345616', name: 'Zahra Amalia', gradeClass: 'Kelas 3', sppAmount: 250000, sppStatus: 'LUNAS', contactPhone: '081234567816', parentName: 'Supriyadi', gender: 'P', address: 'Jl. Hayam Wuruk No. 7, Serang', birthPlace: 'Serang', birthDate: '2017-06-22', virtualAccount: '880202026116' },
  { id: 'std-17', nis: '2026117', nisn: '0012345617', name: 'Hamzah Asadullah', gradeClass: 'Kelas 2', sppAmount: 250000, sppStatus: 'LUNAS', contactPhone: '081234567817', parentName: 'Abdul Muttalib', gender: 'L', address: 'Jl. Raden Fatah No. 3, Serang', birthPlace: 'Serang', birthDate: '2018-12-01', virtualAccount: '880202026117' },
  { id: 'std-18', nis: '2026118', nisn: '0012345618', name: 'Ruqayyah Jamilah', gradeClass: 'Kelas 1', sppAmount: 250000, sppStatus: 'LUNAS', contactPhone: '081234567818', parentName: 'Masykur', gender: 'P', address: 'Jl. Sunan Kalijaga No. 16, Serang', birthPlace: 'Serang', birthDate: '2019-07-11', virtualAccount: '880202026118' },
];

export const INITIAL_TEACHERS: Teacher[] = [
  { id: 'tch-1', nip: '1985031201', nipy: 'NIPY. 1985031201', niy: 'NIY. 20100101', name: 'Masykur Rohana, S.Sos', address: 'Serang, Banten', phone: '081288990011', role: 'Kepala Sekolah', assignedRombel: 'Kepala Sekolah', subjectTaught: 'Kepemimpinan & Kepengawasan Sekolah', baseSalary: 8000000, allowance: 2000000, committeeHonor: 500000, pph21: 0, bpjs: 200000, netSalary: 10300000, notes: 'Kepala Sekolah SDIT EL-FATAH' },
  { id: 'tch-2', nip: '1990041502', nipy: 'NIPY. 1990041502', niy: 'NIY. 20120202', name: 'Iis Rohmayanti, S.Pd', address: 'Serang, Banten', phone: '081399990000', role: 'Wakasek Kurikulum & Wali Kelas 4', assignedRombel: 'Kelas 4', subjectTaught: 'Kurikulum & Wali Kelas 4', baseSalary: 4800000, allowance: 1000000, committeeHonor: 350000, pph21: 0, bpjs: 100000, netSalary: 6050000, notes: 'Wakil Kepala Sekolah Bidang Kurikulum' },
  { id: 'tch-3', nip: '1992082003', nipy: 'NIPY. 1992082003', niy: 'NIY. 20150303', name: 'Mega Andini Putri, S.Pd', address: 'Serang, Banten', phone: '081412345678', role: 'Kesiswaan & Wali Kelas 6', assignedRombel: 'Kelas 6', subjectTaught: 'Kesiswaan & Wali Kelas 6', baseSalary: 4500000, allowance: 900000, committeeHonor: 300000, pph21: 0, bpjs: 95000, netSalary: 5605000, notes: 'Koordinator Bidang Kesiswaan' },
  { id: 'tch-4', nip: '1988110504', nipy: 'NIPY. 1988110504', niy: 'NIY. 20160404', name: 'Ojah Nasiah Ulfah, S.Ag', address: 'Serang, Banten', phone: '081577889900', role: 'Koor. Qur\'an & Wali Kelas 3', assignedRombel: 'Kelas 3', subjectTaught: 'Al-Qur\'an & Wali Kelas 3', baseSalary: 4400000, allowance: 900000, committeeHonor: 300000, pph21: 0, bpjs: 95000, netSalary: 5505000, notes: 'Koordinator Program Al-Qur\'an' },
  { id: 'tch-5', nip: '1991051005', nipy: 'NIPY. 1991051005', niy: 'NIY. 20170505', name: 'Uyat Sukriyati, S.Pd', address: 'Serang, Banten', phone: '081233445566', role: 'Wali Kelas 1', assignedRombel: 'Kelas 1', subjectTaught: 'Tematik & Wali Kelas 1', baseSalary: 4200000, allowance: 800000, committeeHonor: 250000, pph21: 0, bpjs: 90000, netSalary: 5160000, notes: 'Wali Kelas 1' },
  { id: 'tch-6', nip: '1993071206', nipy: 'NIPY. 1993071206', niy: 'NIY. 20180606', name: 'Setia Widi Mawaddah, S.Pd', address: 'Serang, Banten', phone: '081277889900', role: 'Wali Kelas 2', assignedRombel: 'Kelas 2', subjectTaught: 'Tematik & Wali Kelas 2', baseSalary: 4200000, allowance: 800000, committeeHonor: 250000, pph21: 0, bpjs: 90000, netSalary: 5160000, notes: 'Wali Kelas 2' },
  { id: 'tch-7', nip: '1994011507', nipy: 'NIPY. 1994011507', niy: 'NIY. 20190707', name: 'Nurbibiyatillah', address: 'Serang, Banten', phone: '081311223344', role: 'Wali Kelas 5', assignedRombel: 'Kelas 5', subjectTaught: 'Tematik & Wali Kelas 5', baseSalary: 4200000, allowance: 800000, committeeHonor: 250000, pph21: 0, bpjs: 90000, netSalary: 5160000, notes: 'Wali Kelas 5' },
  { id: 'tch-8', nip: '1989022008', nipy: 'NIPY. 1989022008', niy: 'NIY. 20150808', name: 'Alvi Maulidi, S.Pd', address: 'Serang, Banten', phone: '081299887766', role: 'Tenaga Administrasi', assignedRombel: 'Tata Usaha', subjectTaught: 'Administrasi Sekolah', baseSalary: 4000000, allowance: 750000, committeeHonor: 200000, pph21: 0, bpjs: 80000, netSalary: 4870000, notes: 'Tenaga Administrasi Sekolah' },
  { id: 'tch-9', nip: '1990033009', nipy: 'NIPY. 1990033009', niy: 'NIY. 20160909', name: 'Velayati Zuraida, S.Pd', address: 'Serang, Banten', phone: '081344556677', role: 'Bendahara Sekolah', assignedRombel: 'Keuangan Sekolah', subjectTaught: 'Keuangan & SPP', baseSalary: 4200000, allowance: 850000, committeeHonor: 250000, pph21: 0, bpjs: 85000, netSalary: 5215000, notes: 'Bendahara Operasional Sekolah' },
  { id: 'tch-10', nip: '1987041210', nipy: 'NIPY. 1987041210', niy: 'NIY. 20141010', name: 'Mas\'ah', address: 'Serang, Banten', phone: '081566778899', role: 'Humas', assignedRombel: 'Humas & Publikasi', subjectTaught: 'Hubungan Masyarakat', baseSalary: 4000000, allowance: 700000, committeeHonor: 200000, pph21: 0, bpjs: 80000, netSalary: 4820000, notes: 'Bidang Hubungan Masyarakat' },
  { id: 'tch-11', nip: '1986080811', nipy: 'NIPY. 1986080811', niy: 'NIY. 20131111', name: 'Muhi, S.Pd', address: 'Serang, Banten', phone: '081788990011', role: 'Sarpras', assignedRombel: 'Sarana Prasarana', subjectTaught: 'Sarana & Prasarana', baseSalary: 4100000, allowance: 750000, committeeHonor: 200000, pph21: 0, bpjs: 80000, netSalary: 4970000, notes: 'Bidang Sarana & Prasarana' },
  { id: 'tch-12', nip: '1992090912', nipy: 'NIPY. 1992090912', niy: 'NIY. 20171212', name: 'Subihat, S.Pd', address: 'Serang, Banten', phone: '081900112233', role: 'Koor. BPI', assignedRombel: 'Bina Pribadi Islam', subjectTaught: 'Bina Pribadi Islam (BPI)', baseSalary: 4100000, allowance: 750000, committeeHonor: 200000, pph21: 0, bpjs: 80000, netSalary: 4970000, notes: 'Koordinator Bina Pribadi Islam' },
  { id: 'tch-13', nip: '1980010113', nipy: 'NIPY. 1980010113', niy: 'NIY. 20101313', name: 'Siti Nur\'aeni', address: 'Serang, Banten', phone: '081233221100', role: 'Ketua Komite Sekolah', assignedRombel: 'Komite Sekolah', subjectTaught: 'Komite Sekolah', baseSalary: 3500000, allowance: 500000, committeeHonor: 500000, pph21: 0, bpjs: 50000, netSalary: 4450000, notes: 'Ketua Komite SDIT EL-FATAH' },
];

export const INITIAL_FIXED_ASSETS: FixedAsset[] = [
  { id: 'ast-1', code: 'AST-1201-01', name: 'Tanah Wakaf & Pembangunan Sekolah (2.500 m2)', category: 'Tanah', purchaseDate: '2015-05-10', acquisitionCost: 500000000, usefulLifeYears: 0, accumulatedDepreciation: 0, bookValue: 500000000, annualDepreciation: 0, condition: 'Baik' },
  { id: 'ast-2', code: 'AST-1202-01', name: 'Gedung Sekolah 3 Lantai (30 Ruang Kelas)', category: 'Bangunan', purchaseDate: '2017-01-15', acquisitionCost: 2000000000, usefulLifeYears: 25, accumulatedDepreciation: 280000000, bookValue: 1720000000, annualDepreciation: 80000000, condition: 'Baik' },
  { id: 'ast-3', code: 'AST-1203-01', name: 'Set Alat Peraga Fisika, Kimia, & Meja Laboratorium', category: 'Peralatan Mengajar', purchaseDate: '2019-03-20', acquisitionCost: 250000000, usefulLifeYears: 10, accumulatedDepreciation: 75000000, bookValue: 175000000, annualDepreciation: 25000000, condition: 'Baik' },
  { id: 'ast-4', code: 'AST-1204-01', name: '30 Unit Komputer i5 & Server Lab Komputer', category: 'Komputer & Laptop', purchaseDate: '2021-08-10', acquisitionCost: 180000000, usefulLifeYears: 4, accumulatedDepreciation: 45000000, bookValue: 135000000, annualDepreciation: 35000000, condition: 'Baik' },
  { id: 'ast-5', code: 'AST-1205-01', name: 'Mobil Minibus Operasional Yayasan', category: 'Kendaraan', purchaseDate: '2020-11-01', acquisitionCost: 150000000, usefulLifeYears: 8, accumulatedDepreciation: 20000000, bookValue: 130000000, annualDepreciation: 15000000, condition: 'Baik' },
];

export const INITIAL_BOARD_MEMBERS: FoundationBoard[] = [
  { id: 'brd-1', niy: 'NIY. 20100101', nipy: 'NIPY. 20100101', name: 'Drs. H. M. Syukri, M.M', address: 'Jl. Fatmawati No. 100, Jakarta', phone: '081122334455', assignedRombel: 'Pengurus Yayasan', position: 'Ketua Pembina Yayasan', subjectTaught: 'Manajemen Strategis Yayasan', baseSalary: 6000000, allowance: 0, committeeHonor: 750000, notes: 'Penandatangan Laporan Keuangan ISAK 35', email: 'syukri@daarulhabibah.sch.id', honorarium: 6000000 },
  { id: 'brd-2', niy: 'NIY. 20120302', nipy: 'NIPY. 20120302', name: 'Prof. Dr. Ir. Herman Susanto', address: 'Jl. Kemang Raya No. 45, Jakarta', phone: '081344556677', assignedRombel: 'Pengurus Yayasan', position: 'Pembina Yayasan', subjectTaught: 'Pengembangan Mutu Akademik', baseSalary: 4500000, allowance: 0, committeeHonor: 500000, notes: 'Dewan Pakar Kurikulum', email: 'herman@daarulhabibah.sch.id', honorarium: 4500000 },
  { id: 'brd-3', niy: 'NIY. 20150503', nipy: 'NIPY. 20150503', name: 'H. Ahmad Dahlan, M.Ag', address: 'Jl. Gandaria No. 12, Jakarta', phone: '081566778899', assignedRombel: 'Pengurus Yayasan', position: 'Ketua Yayasan', subjectTaught: 'Pendidikan Karakter & Keislaman', baseSalary: 5000000, allowance: 0, committeeHonor: 600000, notes: 'Penanggung Jawab Operasional Sekolah', email: 'dahlan@daarulhabibah.sch.id', honorarium: 5000000 },
  { id: 'brd-4', niy: 'NIY. 20160704', nipy: 'NIPY. 20160704', name: 'Drs. Budi Setiawan, M.Pd', address: 'Jl. Tebet Raya No. 33, Jakarta', phone: '081788990011', assignedRombel: 'Pengurus Yayasan', position: 'Sekretaris Yayasan', subjectTaught: 'Tata Kelola Administrasi', baseSalary: 4000000, allowance: 0, committeeHonor: 400000, notes: 'Sekretaris Eksekutif Yayasan', email: 'budi@daarulhabibah.sch.id', honorarium: 4000000 },
  { id: 'brd-5', niy: 'NIY. 20180209', nipy: 'NIPY. 20180209', name: 'Hj. Nurul Aini, S.E., M.Ak', address: 'Jl. Kebayoran Baru No. 22, Jakarta', phone: '081233445566', assignedRombel: 'Pengurus Yayasan', position: 'Bendahara Umum Yayasan', subjectTaught: 'Manajemen Keuangan & Akuntansi ISAK 35', baseSalary: 4500000, allowance: 0, committeeHonor: 500000, notes: 'Bendahara Umum & Keuangan', email: 'nurul.aini@daarulhabibah.sch.id', honorarium: 4500000 },
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  { id: 'sup-1', name: 'CV Penerbit Erlangga Education', category: 'Buku Pelajaran & Modul', contact: 'Bpk. Hendra', phone: '021-7654321' },
  { id: 'sup-2', name: 'PT Gramedia Asri Media', category: 'ATK & Peralatan Kantor', contact: 'Ibu Ratna', phone: '021-5365011' },
  { id: 'sup-3', name: 'CV IndoLab Nusantara', category: 'Peralatan Laboratorium', contact: 'Bpk. Sigit', phone: '022-4231122' },
];

export const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'jrn-101',
    date: '2026-07-02',
    voucherNo: 'JV/2026/07/001',
    description: 'Penerimaan Dana BOS Tahap I T.A. 2026/2027',
    categoryTag: 'BOS',
    debitAccountCode: '1102',
    debitAccountName: 'Bank Syariah Yayasan',
    creditAccountCode: '4101',
    creditAccountName: 'Pendapatan Dana BOS',
    amount: 350000000,
    referenceNo: 'BOS-2026-T1',
    notes: 'Pencairan resmi dari Dinas Pendidikan',
  },
  {
    id: 'jrn-102',
    date: '2026-07-05',
    voucherNo: 'JV/2026/07/002',
    description: 'Pembayaran SPP Juli 2026 Siswa Ahmad Rizky Pratama',
    categoryTag: 'SPP',
    debitAccountCode: '1101',
    debitAccountName: 'Kas Operasional',
    creditAccountCode: '4102',
    creditAccountName: 'Pendapatan SPP Bulanan',
    amount: 450000,
    studentId: 'std-1',
    referenceNo: 'SPP-202607-001',
    notes: 'Kuitansi No. 1021',
  },
  {
    id: 'jrn-103',
    date: '2026-07-10',
    voucherNo: 'JV/2026/07/003',
    description: 'Pembayaran Gaji Guru & Kepala Sekolah Bulan Juli 2026',
    categoryTag: 'GAJI',
    debitAccountCode: '5101',
    debitAccountName: 'Beban Gaji Guru',
    creditAccountCode: '1102',
    creditAccountName: 'Bank Syariah Yayasan',
    amount: 40000000,
    referenceNo: 'PAYROLL-2026-07',
    notes: 'Transfer via Bank Syariah',
  },
  {
    id: 'jrn-104',
    date: '2026-07-15',
    voucherNo: 'JV/2026/07/004',
    description: 'Pembelian 5 Unit Komputer i5 untuk Lab Komputer',
    categoryTag: 'ASSET',
    debitAccountCode: '1204',
    debitAccountName: 'Komputer & Laptop Pembelajaran',
    creditAccountCode: '1102',
    creditAccountName: 'Bank Syariah Yayasan',
    amount: 45000000,
    referenceNo: 'INV-COMP-099',
    notes: 'Pengadaan Aset Laboratorium',
  },
  {
    id: 'jrn-105',
    date: '2026-07-20',
    voucherNo: 'JV/2026/07/005',
    description: 'Penerimaan Donasi Pembangunan Gedung Perpustakaan',
    categoryTag: 'DONASI',
    debitAccountCode: '1102',
    debitAccountName: 'Bank Syariah Yayasan',
    creditAccountCode: '4105',
    creditAccountName: 'Pendapatan Donasi & Hibah Yayasan',
    amount: 150000000,
    referenceNo: 'DON-2026-015',
    notes: 'Donasi Alumni T.A. 2005',
  },
];

// --- INITIAL SIPLAH PROCUREMENTS ---
export const INITIAL_SIPLAH_PROCUREMENTS = [
  {
    id: 'sip-101',
    code: 'SIPLAH/2026/08/001',
    title: 'Pengadaan 10 Unit Laptop Core i5 Lab Komputer (SiPLah)',
    merchantName: 'PT Gramedia Asri Media (Mitra SiPLah)',
    category: 'ASET_TETAP' as const,
    amount: 85000000,
    proposedBy: 'Masykur Rohana, S.Sos (Kepala Sekolah)',
    proposedDate: '2026-08-01',
    approvedByTreasurer: 'Hj. Nurul Aini, S.E., M.Ak (Bendahara Yayasan)',
    approvedTreasurerDate: '2026-08-02',
    acknowledgedByChairman: 'Drs. H. M. Syukri, M.M (Ketua Yayasan)',
    acknowledgedChairmanDate: '2026-08-02',
    status: 'DIKETAHUI_KETUA' as const,
    fundingSource: 'DANA_BOS' as const,
    debitAccountCode: '1204',
    debitAccountName: 'Komputer & Laptop Pembelajaran',
    notes: 'Untuk peremajaan fasilitas ujian berbasis komputer (ANBK) Rombel 5-6.',
    isRegisteredToAssets: false,
  },
  {
    id: 'sip-102',
    code: 'SIPLAH/2026/08/002',
    title: 'Pembelian Buku Cetak Kurikulum Merdeka & Modul Siswa Kelas 1-6',
    merchantName: 'CV Penerbit Erlangga (SiPLah Blibli)',
    category: 'BUKU_MODUL' as const,
    amount: 28500000,
    proposedBy: 'Masykur Rohana, S.Sos (Kepala Sekolah)',
    proposedDate: '2026-08-02',
    approvedByTreasurer: 'Hj. Nurul Aini, S.E., M.Ak (Bendahara Yayasan)',
    approvedTreasurerDate: '2026-08-03',
    status: 'DISETUJUI_BENDAHARA' as const,
    fundingSource: 'DANA_BOS' as const,
    debitAccountCode: '5104',
    debitAccountName: 'Beban Buku Pelajaran',
    notes: 'Sudah disetujui Bendahara Yayasan, menunggu diketahui Ketua Yayasan.',
    isRegisteredToAssets: false,
  },
  {
    id: 'sip-103',
    code: 'SIPLAH/2026/08/003',
    title: 'Pengadaan Kertas HVS & ATK Ujian Tengah Semester (SiPLah Tokopedia)',
    merchantName: 'Toko ATK Makmur Jaya (SiPLah)',
    category: 'PERLENGKAPAN_ATK' as const,
    amount: 6500000,
    proposedBy: 'Masykur Rohana, S.Sos (Kepala Sekolah)',
    proposedDate: '2026-08-03',
    status: 'DIUSULKAN_KEPSEK' as const,
    fundingSource: 'DANA_SPP' as const,
    debitAccountCode: '5112',
    debitAccountName: 'Beban ATK & Cetak Materi',
    notes: 'Pengusulan baru dari Kepala Sekolah.',
    isRegisteredToAssets: false,
  },
];

// --- INITIAL CMS DATA ---
export const INITIAL_HERO_BANNERS = [
  {
    id: 'banner-1',
    title: 'Pendidikan Berkarakter & Berprestasi Internasional',
    subtitle: 'Membentuk generasi unggul, berakhlak mulia, dan siap menghadapi tantangan era digital.',
    imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80',
    ctaText: 'Lihat Profile Sekolah',
  },
  {
    id: 'banner-2',
    title: 'Fasilitas Laboratorium & Perpustakaan Modern',
    subtitle: 'Dukungan teknologi pembelajaran mutakhir melalui dana BOS & Yayasan yang transparan.',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
    ctaText: 'Jelajahi Fasilitas',
  },
  {
    id: 'banner-3',
    title: 'Pengembangan Karakter Rabbani & Tahfidz Al-Qur\'an',
    subtitle: 'Membina adab, integritas, dan hafalan Qur\'an didampingi para pendidik berakreditasi unggul.',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
    ctaText: 'Daftar PPDB Online',
  },
];

export const INITIAL_SPEECHES = {
  chairmanName: 'Drs. H. M. Syukri, M.M',
  chairmanTitle: 'Ketua Pembina Yayasan Daarul Habibah',
  chairmanPhotoUrl: LOCAL_IMAGES.pembina,
  chairmanSpeech:
    'Assalamu’alaikum Warahmatullahi Wabarakatuh. Selamat datang di portal resmi Yayasan Pendidikan Daarul Habibah. Kami bertekad mewujudkan pengelolaan pendidikan yang transparan, akuntabel, dan berorientasi pada pencapaian akhlak mulia serta prestasi akademis siswa dari Kelas 1 hingga Kelas 6. Seluruh pembiayaan dan penggunaan dana diawasi dan diselaraskan secara ketat sesuai standar ISAK 35 dan ARKAS.',
  secretaryName: 'H. Ahmad Subagja, S.H',
  secretaryTitle: 'Sekretaris Yayasan',
  secretaryPhotoUrl: LOCAL_IMAGES.sekretaris,
  secretarySpeech:
    'Menjamin ketertiban administrasi, legalitas Kemenkumham, tata kelola kearsipan digital, serta pelayanan publik dan orang tua murid yang responsif.',
  treasurerName: 'Hj. Nurul Aini, S.E., M.Ak',
  treasurerTitle: 'Bendahara Yayasan',
  treasurerPhotoUrl: LOCAL_IMAGES.bendahara,
  treasurerSpeech:
    'Mengelola akuntabilitas keuangan berbasis ISAK 35, transparansi dana BOS, sistem kuitansi digital SPP, dan efisiensi anggaran sekolah.',
  headmasterName: 'Masykur Rohana, S.Sos',
  headmasterTitle: 'Kepala Sekolah',
  headmasterPhotoUrl: LOCAL_IMAGES.kepalaSekolah,
  headmasterSpeech:
    'Assalamu’alaikum Wr. Wb. Sebagai pimpinan sekolah, fokus utama kami adalah mutu pembelajaran di setiap Rombongan Belajar (Rombel Kelas 1 - Kelas 6). Melalui sistem e-Raport digital dan modul pengadaan belanja barang SiPLah yang disetujui Pengurus Yayasan, kami memastikan setiap rupiah berdampak langsung pada kualitas belajar anak-anak didik kita.',
};

export const INITIAL_VISION_MISSION = {
  vision: 'Menjadi Yayasan Pendidikan Islam unggulan bernuansa akademik dan berkarakter mulia di tingkat Nasional pada tahun 2030.',
  mission: [
    'Menyelenggarakan sistem pendidikan berstandar tinggi yang mengintegrasikan IPTEK dan IMTAK.',
    'Menerapkan tata kelola keuangan yayasan yang akuntabel, efisien, dan transparan sesuai ISAK 35.',
    'Menyediakan sarana prasarana belajar berteknologi tinggi melalui pembelanjaan SiPLah terverifikasi.',
    'Mempererat kemitraan dengan Orang Tua/Wali melalui keterbukaan e-Raport dan status SPP online.',
  ],
};

export const INITIAL_NEWS_ARTICLES = [
  {
    id: 'news-1',
    title: 'Siswa SD Daarul Habibah Sabet Medali Emas OSN Matematika Tingkat Provinsi',
    category: 'PRESTASI' as const,
    date: '2026-08-01',
    author: 'Tim Humas Yayasan',
    excerpt: 'Ananda Ahmad Rizky Pratama siswa Kelas 6 berhasil mengharumkan nama sekolah di ajang OSN 2026.',
    content:
      'Prestasi membanggakan kembali diukir oleh siswa-siswi SD Daarul Habibah. Ahmad Rizky Pratama dari Rombel Kelas 6 berhasil meraih Medali Emas dalam Olimpiade Sains Nasional (OSN) Matematika tingkat Provinsi. Kepala Sekolah menyampaikan apresiasi mendalam dan bonus beasiswa dari Yayasan.',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
  },
  {
    id: 'news-2',
    title: 'Penerbitan e-Raport Digital Semester Ganjil T.A. 2026/2027',
    category: 'PENGUMUMAN' as const,
    date: '2026-07-28',
    author: 'Bagian Kurikulum',
    excerpt: 'Orang tua siswa kini dapat mengecek e-Raport dan status SPP secara online melalui portal resmi.',
    content:
      'Guna meningkatkan transparansi dan kemudahan akses, orang tua murid dapat mengecek nilai e-Raport serta riwayat pembayaran SPP dengan memasukkan NISN di menu Berita & Info portal sekolah.',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    isFeatured: false,
  },
  {
    id: 'news-3',
    title: 'Implementasi Pengadaan Belanja Barang & Jasa SiPLah Kemdikbud',
    category: 'BERITA' as const,
    date: '2026-07-25',
    author: 'Bendahara Sekolah',
    excerpt: 'Seluruh pengeluaran barang & peralatan kelas disetujui secara berjenjang oleh Pengurus Yayasan.',
    content:
      'Sesuai regulasi pemerintah, belanja barang dan jasa sekolah wajib dilakukan via SiPLah dengan persetujuan bertingkat Kepala Sekolah, Bendahara Yayasan, dan Ketua Yayasan.',
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    isFeatured: false,
  },
];

export const INITIAL_GALLERY_ITEMS = [
  {
    id: 'gal-1',
    title: 'Kegiatan Belajar Rombel Komputer & Sains',
    type: 'photo' as const,
    url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    description: 'Siswa kelas 5 sedang mempraktikkan ujian berbasis komputer di Laboratorium.',
    date: '2026-07-20',
    category: 'Kegiatan Belajar' as const,
  },
  {
    id: 'gal-2',
    title: 'Penyerahan Piala Juara OSN Matematika',
    type: 'photo' as const,
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    description: 'Penyerahan penghargaan oleh Ketua Pembina Yayasan pada upacara bendera Hari Senin.',
    date: '2026-08-01',
    category: 'Prestasi Siswa' as const,
  },
  {
    id: 'gal-3',
    title: 'Gedung Sekolah 3 Lantai & Lapangan Olahraga',
    type: 'photo' as const,
    url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    description: 'Fasilitas gedung sekolah milik yayasan dengan ruang kelas ber-AC dan CCTV.',
    date: '2026-06-15',
    category: 'Fasilitas Kampus' as const,
  },
  {
    id: 'gal-4',
    title: 'Dokumentasi Video Profil Sekolah & Kegiatan Ekstrakurikuler',
    type: 'video' as const,
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Video tur lengkap kampus sekolah dan pentas seni akhir tahun ajaran.',
    date: '2026-07-10',
    category: 'Acara Yayasan' as const,
  },
  {
    id: 'gal-5',
    title: 'Video Pembelajaran Praktik Sains & Laboratorium Komputer',
    type: 'video' as const,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    description: 'Dokumentasi video suasana interaktif siswa dalam praktikum sains dan simulasi ANBK.',
    date: '2026-08-05',
    category: 'Kegiatan Belajar' as const,
  },
  {
    id: 'gal-6',
    title: 'Video Wisuda Tahfidz Qur\'an Santri & Pentas Seni Siswa',
    type: 'video' as const,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    description: 'Rekaman video prosesi wisuda tahfidz juz 30 dan penampilan kreasi seni santri.',
    date: '2026-08-10',
    category: 'Prestasi Siswa' as const,
  },
];

export const INITIAL_ACHIEVEMENTS = [
  {
    id: 'ach-1',
    studentName: 'Ahmad Rizky Pratama',
    gradeClass: 'Kelas 6',
    competitionName: 'Olimpiade Sains Nasional (OSN) Matematika',
    achievementTitle: 'Juara 1 / Medali Emas',
    level: 'PROVINSI' as const,
    year: '2026',
    photoUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'ach-2',
    studentName: 'Siti Nurhaliza',
    gradeClass: 'Kelas 5',
    competitionName: 'Lomba MHQ (Musabaqah Hifzhil Qur’an) Jus 30',
    achievementTitle: 'Juara 1 Putri',
    level: 'KABUPATEN' as const,
    year: '2026',
    photoUrl: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'ach-3',
    studentName: 'Budi Santoso',
    gradeClass: 'Kelas 4',
    competitionName: 'Kejuaraan Robotik Sekolah Dasar Nasional',
    achievementTitle: 'Juara Harapan 1',
    level: 'NASIONAL' as const,
    year: '2025',
    photoUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
  },
];

// --- HELPER FUNCTIONS FOR WALI KELAS & ROMBEL MATCHING ---
export interface WaliKelasDetail {
  rombel: string;
  name: string;
  nip: string;
  nipy: string;
  phone: string;
  role: string;
  teacherId: string;
}

export const getWaliKelasDetailByGrade = (gradeClass: string, teachersList: Teacher[] = INITIAL_TEACHERS): WaliKelasDetail => {
  const norm = (gradeClass || '').toLowerCase().trim();
  const digit = norm.match(/\d+/)?.[0];

  const found = teachersList.find((t) => {
    const roleLower = (t.role || '').toLowerCase();
    const rombelLower = (t.assignedRombel || '').toLowerCase();
    if (digit) {
      return (
        roleLower.includes(`kelas ${digit}`) ||
        rombelLower.includes(`kelas ${digit}`) ||
        rombelLower === `kelas ${digit}`
      );
    }
    return rombelLower.includes(norm) || roleLower.includes(norm);
  });

  if (found) {
    return {
      rombel: gradeClass || `Kelas ${digit || '1'}`,
      name: found.name,
      nip: found.nip,
      nipy: found.nipy || `NIPY. ${found.nip}`,
      phone: found.phone,
      role: found.role,
      teacherId: found.id,
    };
  }

  // Exact fallback mapped strictly to registered official teachers
  const map: Record<string, WaliKelasDetail> = {
    '1': { rombel: 'Kelas 1', name: 'Uyat Sukriyati, S.Pd', nip: '1991051005', nipy: 'NIPY. 1991051005', phone: '081233445566', role: 'Wali Kelas 1', teacherId: 'tch-5' },
    '2': { rombel: 'Kelas 2', name: 'Setia Widi Mawaddah, S.Pd', nip: '1993071206', nipy: 'NIPY. 1993071206', phone: '081277889900', role: 'Wali Kelas 2', teacherId: 'tch-6' },
    '3': { rombel: 'Kelas 3', name: 'Ojah Nasiah Ulfah, S.Ag', nip: '1988110504', nipy: 'NIPY. 1988110504', phone: '081577889900', role: 'Koor. Qur\'an & Wali Kelas 3', teacherId: 'tch-4' },
    '4': { rombel: 'Kelas 4', name: 'Iis Rohmayanti, S.Pd', nip: '1990041502', nipy: 'NIPY. 1990041502', phone: '081399990000', role: 'Wakasek Kurikulum & Wali Kelas 4', teacherId: 'tch-2' },
    '5': { rombel: 'Kelas 5', name: 'Nurbibiyatillah', nip: '1994011507', nipy: 'NIPY. 1994011507', phone: '081311223344', role: 'Wali Kelas 5', teacherId: 'tch-7' },
    '6': { rombel: 'Kelas 6', name: 'Mega Andini Putri, S.Pd', nip: '1992082003', nipy: 'NIPY. 1992082003', phone: '081412345678', role: 'Kesiswaan & Wali Kelas 6', teacherId: 'tch-3' },
  };

  if (digit && map[digit]) return map[digit];

  return {
    rombel: gradeClass || 'Kelas 1',
    name: 'Masykur Rohana, S.Sos',
    nip: '1985031201',
    nipy: 'NIPY. 1985031201',
    phone: '081288990011',
    role: 'Kepala Sekolah',
    teacherId: 'tch-1',
  };
};

export const getWaliKelasByGrade = (gradeClass: string, teachersList: Teacher[] = INITIAL_TEACHERS): string => {
  return getWaliKelasDetailByGrade(gradeClass, teachersList).name;
};

export const getWaliKelasList = (teachersList: Teacher[] = INITIAL_TEACHERS): Teacher[] => {
  return teachersList.filter((t) => {
    const roleLower = (t.role || '').toLowerCase();
    const rombelLower = (t.assignedRombel || '').toLowerCase();
    return (
      roleLower.includes('wali kelas') ||
      rombelLower.startsWith('kelas') ||
      rombelLower.startsWith('rombel')
    );
  });
};

export const isClassMatching = (targetClass: string, selectedFilter: string): boolean => {
  if (!selectedFilter || selectedFilter === 'SEMUA' || selectedFilter === 'ALL') return true;
  if (!targetClass) return false;
  const t = targetClass.trim().toLowerCase();
  const f = selectedFilter.trim().toLowerCase();
  if (t === f) return true;
  if (t.includes(f) || f.includes(t)) return true;
  const numT = t.match(/\d+/)?.[0];
  const numF = f.match(/\d+/)?.[0];
  if (numT && numF && numT === numF) return true;
  return false;
};

// --- INITIAL E-RAPORT DATA (Kelas 1 - Kelas 6) ---
export const INITIAL_E_RAPORTS = [
  // === KELAS 6 (Wali Kelas: Mega Andini Putri, S.Pd) ===
  {
    id: 'rap-1',
    studentId: 'std-1',
    studentName: 'Ahmad Rizky Pratama',
    nisn: '2026101',
    gradeClass: 'Kelas 6',
    academicYear: '2026/2027 Semester Ganjil',
    parentName: 'Rahmat Hidayat',
    teacherName: 'Mega Andini Putri, S.Pd',
    grades: [
      { subject: 'Tahfidz', score: 95, letterGrade: 'A' as const, notes: 'Sangat baik dalam hafalan Juz 30 dan makhraj huruf.' },
      { subject: 'MTK 6', score: 98, letterGrade: 'A' as const, notes: 'Sangat menonjol dalam penalaran pecahan, geometri, dan soal cerita.' },
      { subject: 'IPAS 6', score: 92, letterGrade: 'A' as const, notes: 'Memahami ekosistem, sifat cahaya, serta eksperimen sains.' },
      { subject: 'B.Indo 6', score: 88, letterGrade: 'A' as const, notes: 'Mampu menyusun karangan narasi dan pidato singkat.' },
      { subject: 'PPKn 6', score: 90, letterGrade: 'A' as const, notes: 'Memahami penerapan sila Pancasila dalam kehidupan.' },
      { subject: 'Seni 6', score: 89, letterGrade: 'A' as const, notes: 'Kreatif dalam seni rupa dan musik daerah.' },
      { subject: 'B.Inggris 6', score: 87, letterGrade: 'A' as const, notes: 'Aktif percakapan dan menyimak instruksi sederhana.' },
    ],
    attendance: { present: 80, sick: 1, permitted: 0, absent: 0 },
    extracurriculars: [
      { name: 'Pramuka', grade: 'A', notes: 'Sangat aktif sebagai Pemimpin Regu (Pinru).' },
      { name: 'Klub Sains & Robotik', grade: 'A', notes: 'Mewakili sekolah di ajang OSN.' },
    ],
    teacherNotes: 'Ahmad adalah siswa berprestasi tinggi yang rendah hati, sopan, dan menjadi panutan kawan-kawan sekelas.',
    status: 'DITERBITKAN' as const,
    issuedDate: '2026-07-20',
  },
  {
    id: 'rap-2',
    studentId: 'std-2',
    studentName: 'Siti Nurhaliza',
    nisn: '2026102',
    gradeClass: 'Kelas 6',
    academicYear: '2026/2027 Semester Ganjil',
    parentName: 'Hasan Basri',
    teacherName: 'Mega Andini Putri, S.Pd',
    grades: [
      { subject: 'Tahfidz', score: 96, letterGrade: 'A' as const, notes: 'Tartil membaca Al-Qur’an dan rajin salat Dhuha berjemaah.' },
      { subject: 'MTK 6', score: 88, letterGrade: 'A' as const, notes: 'Cukup mahir dalam pemecahan soal statistika dan pecahan.' },
      { subject: 'IPAS 6', score: 90, letterGrade: 'A' as const, notes: 'Sangat antusias saat praktikum sains laboratorium.' },
      { subject: 'B.Indo 6', score: 91, letterGrade: 'A' as const, notes: 'Kosa kata sangat kaya dan aktif menulis puisi.' },
      { subject: 'PPKn 6', score: 89, letterGrade: 'A' as const, notes: 'Aktif dalam diskusi kelompok dan musyawarah Rombel.' },
      { subject: 'Seni 6', score: 94, letterGrade: 'A' as const, notes: 'Hasil karya seni kriya dan menggambar sangat estetik.' },
      { subject: 'B.Inggris 6', score: 88, letterGrade: 'A' as const, notes: 'Mampu merespon kosa kata dasar dengan baik.' },
    ],
    attendance: { present: 79, sick: 2, permitted: 0, absent: 0 },
    extracurriculars: [
      { name: 'Tahfizh Qur’an', grade: 'A', notes: 'Telah menyelesaikan hafalan Juz 30.' },
    ],
    teacherNotes: 'Siti murid yang tekun, santun, serta memiliki bakat seni dan hafalan yang luar biasa.',
    status: 'DITERBITKAN' as const,
    issuedDate: '2026-07-20',
  },
  {
    id: 'rap-13',
    studentId: 'std-13',
    studentName: 'Naufal Farisi',
    nisn: '2026113',
    gradeClass: 'Kelas 6',
    academicYear: '2026/2027 Semester Ganjil',
    parentName: 'Salman',
    teacherName: 'Mega Andini Putri, S.Pd',
    grades: [
      { subject: 'Tahfidz', score: 91, letterGrade: 'A' as const, notes: 'Murojaah harian sangat tertib.' },
      { subject: 'MTK 6', score: 89, letterGrade: 'A' as const, notes: 'Memahami bangun ruang dan statistika.' },
      { subject: 'IPAS 6', score: 88, letterGrade: 'A' as const, notes: 'Aktif dalam simulasi tata surya.' },
      { subject: 'B.Indo 6', score: 86, letterGrade: 'B' as const, notes: 'Lancar dalam presentasi laporan observasi.' },
      { subject: 'PPKn 6', score: 92, letterGrade: 'A' as const, notes: 'Menjunjung tinggi toleransi dan kepemimpinan.' },
      { subject: 'Seni 6', score: 87, letterGrade: 'A' as const, notes: 'Kreatif membuat batik jumputan.' },
      { subject: 'B.Inggris 6', score: 85, letterGrade: 'B' as const, notes: 'Mampu menulis paragraf pendek deskriptif.' },
    ],
    attendance: { present: 80, sick: 0, permitted: 0, absent: 0 },
    extracurriculars: [
      { name: 'Pramuka & Futsal', grade: 'A', notes: 'Disiplin dan berjiwa sportivitas tinggi.' },
    ],
    teacherNotes: 'Naufal memiliki dedikasi belajar yang mantap dan disukai oleh teman-temannya.',
    status: 'DITERBITKAN' as const,
    issuedDate: '2026-07-20',
  },

  // === KELAS 5 (Wali Kelas: Nurbibiyatillah) ===
  {
    id: 'rap-3',
    studentId: 'std-3',
    studentName: 'Muhammad Al-Fatih',
    nisn: '2026103',
    gradeClass: 'Kelas 5',
    academicYear: '2026/2027 Semester Ganjil',
    parentName: 'Abdullah',
    teacherName: 'Nurbibiyatillah',
    grades: [
      { subject: 'Tahfidz', score: 92, letterGrade: 'A' as const, notes: 'Hafalan surah-surah pilihan sangat lancar.' },
      { subject: 'MTK 5', score: 88, letterGrade: 'A' as const, notes: 'Sangat cepat dalam operasi perkalian dan pembagian.' },
      { subject: 'IPAS 5', score: 86, letterGrade: 'B' as const, notes: 'Memahami materi rantai makanan dan ekosistem.' },
      { subject: 'B.Indo 5', score: 85, letterGrade: 'B' as const, notes: 'Membaca pemahaman dan menulis ringkasan sangat baik.' },
      { subject: 'PPKn 5', score: 88, letterGrade: 'A' as const, notes: 'Sangat disiplin dan taat aturan kelas.' },
      { subject: 'Seni 5', score: 87, letterGrade: 'A' as const, notes: 'Kreatif dalam membuat kerajinan dari bahan bekas.' },
      { subject: 'B.Inggris 5', score: 84, letterGrade: 'B' as const, notes: 'Paham instruksi percakapan sederhana di kelas.' },
    ],
    attendance: { present: 80, sick: 0, permitted: 0, absent: 0 },
    extracurriculars: [
      { name: 'Pramuka & Futsal', grade: 'A', notes: 'Disiplin dan aktif dalam latihan.' },
    ],
    teacherNotes: 'Al-Fatih memiliki jiwa kepemimpinan yang baik dan tekun dalam belajar.',
    status: 'DITERBITKAN' as const,
    issuedDate: '2026-07-22',
  },
  {
    id: 'rap-4-std4',
    studentId: 'std-4',
    studentName: 'Aisyah Humaira',
    nisn: '2026104',
    gradeClass: 'Kelas 5',
    academicYear: '2026/2027 Semester Ganjil',
    parentName: 'Umar Khalid',
    teacherName: 'Nurbibiyatillah',
    grades: [
      { subject: 'Tahfidz', score: 94, letterGrade: 'A' as const, notes: 'Tajwid dan tartil bacaan sangat merdu.' },
      { subject: 'MTK 5', score: 86, letterGrade: 'B' as const, notes: 'Memahami konsep FPB dan KPK dengan baik.' },
      { subject: 'IPAS 5', score: 89, letterGrade: 'A' as const, notes: 'Antusias dalam pengamatan siklus air dan alam.' },
      { subject: 'B.Indo 5', score: 92, letterGrade: 'A' as const, notes: 'Keterampilan menulis puisi dan membaca indah sangat baik.' },
      { subject: 'PPKn 5', score: 90, letterGrade: 'A' as const, notes: 'Santun, ramah, dan suka menolong teman.' },
      { subject: 'Seni 5', score: 91, letterGrade: 'A' as const, notes: 'Gambar flora & fauna bergradasi warna sangat rapi.' },
      { subject: 'B.Inggris 5', score: 88, letterGrade: 'A' as const, notes: 'Cakap merespons sapaan bahasa Inggris.' },
    ],
    attendance: { present: 79, sick: 1, permitted: 0, absent: 0 },
    extracurriculars: [
      { name: 'Seni Kaligrafi & Tahfizh', grade: 'A', notes: 'Goresan kaligrafi Khat Naskhi sangat bagus.' },
    ],
    teacherNotes: 'Aisyah siswa yang cerdas, halus budi pekerti, dan selalu bersemangat di kelas.',
    status: 'DITERBITKAN' as const,
    issuedDate: '2026-07-22',
  },
  {
    id: 'rap-14',
    studentId: 'std-14',
    studentName: 'Syifa Fauziah',
    nisn: '2026114',
    gradeClass: 'Kelas 5',
    academicYear: '2026/2027 Semester Ganjil',
    parentName: 'Achmad',
    teacherName: 'Nurbibiyatillah',
    grades: [
      { subject: 'Tahfidz', score: 90, letterGrade: 'A' as const, notes: 'Hafalan Surah An-Nazi’at mutqin.' },
      { subject: 'MTK 5', score: 85, letterGrade: 'B' as const, notes: 'Cermat dalam operasi hitung pecahan.' },
      { subject: 'IPAS 5', score: 87, letterGrade: 'A' as const, notes: 'Memahami fungsi organ pernapasan.' },
      { subject: 'B.Indo 5', score: 88, letterGrade: 'A' as const, notes: 'Mampu menyimpulkan isi bacaan artikel.' },
      { subject: 'PPKn 5', score: 89, letterGrade: 'A' as const, notes: 'Sangat aktif dalam piket kebersihan kelas.' },
      { subject: 'Seni 5', score: 90, letterGrade: 'A' as const, notes: 'Menyanyikan lagu daerah dengan intonasi tepat.' },
      { subject: 'B.Inggris 5', score: 86, letterGrade: 'B' as const, notes: 'Menguasai kosa kata waktu dan kegiatan harian.' },
    ],
    attendance: { present: 80, sick: 0, permitted: 0, absent: 0 },
    extracurriculars: [
      { name: 'Pramuka Penggalang', grade: 'A', notes: 'Disiplin dan tangkas dalam pionering.' },
    ],
    teacherNotes: 'Syifa menunjukkan kemandirian dan rasa tanggung jawab yang membanggakan.',
    status: 'DITERBITKAN' as const,
    issuedDate: '2026-07-22',
  },

  // === KELAS 4 (Wali Kelas: Iis Rohmayanti, S.Pd) ===
  {
    id: 'rap-4',
    studentId: 'std-5',
    studentName: 'Bilal Ramadan',
    nisn: '2026105',
    gradeClass: 'Kelas 4',
    academicYear: '2026/2027 Semester Ganjil',
    parentName: 'Zubair',
    teacherName: 'Iis Rohmayanti, S.Pd',
    grades: [
      { subject: 'Tahfidz', score: 88, letterGrade: 'A' as const, notes: 'Makhraj huruf tajwid sangat rapi dan tartil.' },
      { subject: 'MTK 4', score: 85, letterGrade: 'B' as const, notes: 'Kuasai materi operasi hitung bilangan cacah.' },
      { subject: 'IPAS 4', score: 87, letterGrade: 'A' as const, notes: 'Aktif bertanya dan melakukan pengamatan tanaman.' },
      { subject: 'B.Indo 4', score: 86, letterGrade: 'B' as const, notes: 'Mampu bercerita kembali materi bacaan dengan baik.' },
      { subject: 'PPKn 4', score: 89, letterGrade: 'A' as const, notes: 'Toleran dan bersahabat dengan semua teman.' },
      { subject: 'Seni 4', score: 88, letterGrade: 'A' as const, notes: 'Gambar ilustrasi bernilai artistik tinggi.' },
      { subject: 'B.Inggris 4', score: 82, letterGrade: 'B' as const, notes: 'Hafal nama-nama benda dan profesi dalam bahasa Inggris.' },
    ],
    attendance: { present: 78, sick: 2, permitted: 0, absent: 0 },
    extracurriculars: [
      { name: 'Pramuka', grade: 'A', notes: 'Aktif mengikuti kegiatan perkemahan.' },
    ],
    teacherNotes: 'Bilal sangat ceria, rajin membantu teman, dan menunjukkan perkembangan belajar yang konsisten.',
    status: 'DITERBITKAN' as const,
    issuedDate: '2026-07-22',
  },
  {
    id: 'rap-6-std6',
    studentId: 'std-6',
    studentName: 'Khadijah Az-Zahra',
    nisn: '2026106',
    gradeClass: 'Kelas 4',
    academicYear: '2026/2027 Semester Ganjil',
    parentName: 'Ali bin Abi',
    teacherName: 'Iis Rohmayanti, S.Pd',
    grades: [
      { subject: 'Tahfidz', score: 95, letterGrade: 'A' as const, notes: 'Hafalan Juz 30 sangat lancar dan merdu.' },
      { subject: 'MTK 4', score: 90, letterGrade: 'A' as const, notes: 'Cepat dalam perhitungan luas dan keliling bangun datar.' },
      { subject: 'IPAS 4', score: 92, letterGrade: 'A' as const, notes: 'Memahami perubahan wujud zat melalui eksperimen.' },
      { subject: 'B.Indo 4', score: 91, letterGrade: 'A' as const, notes: 'Menulis karangan narasi dengan struktur yang rapi.' },
      { subject: 'PPKn 4', score: 93, letterGrade: 'A' as const, notes: 'Selalu menaati tata tertib madrasah/sekolah.' },
      { subject: 'Seni 4', score: 89, letterGrade: 'A' as const, notes: 'Kreatif memadukan warna pada seni lukis.' },
      { subject: 'B.Inggris 4', score: 88, letterGrade: 'A' as const, notes: 'Cakap menyusun kalimat tanya sederhana.' },
    ],
    attendance: { present: 80, sick: 0, permitted: 0, absent: 0 },
    extracurriculars: [
      { name: 'Tahfizh Cilik', grade: 'A', notes: 'Aktif memimpin doa sebelum belajar.' },
    ],
    teacherNotes: 'Khadijah teladan kebersihan dan ketertiban di kelas 4.',
    status: 'DITERBITKAN' as const,
    issuedDate: '2026-07-22',
  },
  {
    id: 'rap-15',
    studentId: 'std-15',
    studentName: 'Tariq bin Ziyad',
    nisn: '2026115',
    gradeClass: 'Kelas 4',
    academicYear: '2026/2027 Semester Ganjil',
    parentName: 'Ziyad',
    teacherName: 'Iis Rohmayanti, S.Pd',
    grades: [
      { subject: 'Tahfidz', score: 89, letterGrade: 'A' as const, notes: 'Murojaah Surah Al-Muthaffifin sangat baik.' },
      { subject: 'MTK 4', score: 87, letterGrade: 'A' as const, notes: 'Mampu menyelesaikan soal pecahan senilai.' },
      { subject: 'IPAS 4', score: 88, letterGrade: 'A' as const, notes: 'Aktif dalam percobaan gaya dan gerak.' },
      { subject: 'B.Indo 4', score: 85, letterGrade: 'B' as const, notes: 'Lancar membaca nyaring teks petunjuk.' },
      { subject: 'PPKn 4', score: 90, letterGrade: 'A' as const, notes: 'Gotong royong dan suka bekerjasama dalam tim.' },
      { subject: 'Seni 4', score: 86, letterGrade: 'B' as const, notes: 'Membuat kolase biji-bijian yang indah.' },
      { subject: 'B.Inggris 4', score: 84, letterGrade: 'B' as const, notes: 'Menguasai kosa kata hewan dan tumbuhan.' },
    ],
    attendance: { present: 80, sick: 0, permitted: 0, absent: 0 },
    extracurriculars: [
      { name: 'Panahan & Pramuka', grade: 'A', notes: 'Fokus dan disiplin tinggi.' },
    ],
    teacherNotes: 'Tariq berjiwa kesatria, pemberani, dan ramah terhadap sesama kawan.',
    status: 'DITERBITKAN' as const,
    issuedDate: '2026-07-22',
  },

  // === KELAS 3 (Wali Kelas: Ojah Nasiah Ulfah, S.Ag) ===
  {
    id: 'rap-5',
    studentId: 'std-8',
    studentName: 'Zaid bin Haritsah',
    nisn: '2026108',
    gradeClass: 'Kelas 3',
    academicYear: '2026/2027 Semester Ganjil',
    parentName: 'Haritsah',
    teacherName: 'Ojah Nasiah Ulfah, S.Ag',
    grades: [
      { subject: 'Pendidikan Agama Islam & Budi Pekerti', score: 92, letterGrade: 'A' as const, notes: 'Hafalan doa harian dan bacaan salat sangat baik.' },
      { subject: 'Pendidikan Pancasila', score: 88, letterGrade: 'A' as const, notes: 'Memahami simbol-simbol Pancasila dan gotong royong.' },
      { subject: 'Bahasa Indonesia', score: 86, letterGrade: 'B' as const, notes: 'Membaca nyaring dengan intonasi yang tepat.' },
      { subject: 'Matematika', score: 89, letterGrade: 'A' as const, notes: 'Mahir dalam penjumlahan dan pengurangan ribuan.' },
      { subject: 'IPAS (Ilmu Pengetahuan Alam & Sosial)', score: 87, letterGrade: 'A' as const, notes: 'Memahami wujud benda dan perubahannya.' },
      { subject: 'Seni dan Budaya', score: 85, letterGrade: 'B' as const, notes: 'Kreatif mewarnai dan menyanyikan lagu anak-anak.' },
      { subject: 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)', score: 90, letterGrade: 'A' as const, notes: 'Aktif dan lincah dalam senam kesegaran jasmani.' },
      { subject: 'Bahasa Inggris', score: 84, letterGrade: 'B' as const, notes: 'Mengenal kosa kata keluarga dan lingkungan sekolah.' },
      { subject: 'Muatan Lokal (Bahasa Daerah/Tahfizh)', score: 91, letterGrade: 'A' as const, notes: 'Hafal Surah An-Naba dan An-Nazi’at.' },
    ],
    attendance: { present: 79, sick: 1, permitted: 0, absent: 0 },
    extracurriculars: [
      { name: 'Klub Tahfizh Qur’an', grade: 'A', notes: 'Sangat tekun murojaah setiap pagi.' },
    ],
    teacherNotes: 'Zaid anak yang sholeh, rajin ibadah, dan penuh semangat saat belajar di kelas.',
    status: 'DITERBITKAN' as const,
    issuedDate: '2026-07-22',
  },
  {
    id: 'rap-7-std7',
    studentId: 'std-7',
    studentName: 'Fatimah Zahra',
    nisn: '2026107',
    gradeClass: 'Kelas 3',
    academicYear: '2026/2027 Semester Ganjil',
    parentName: 'Usman',
    teacherName: 'Ojah Nasiah Ulfah, S.Ag',
    grades: [
      { subject: 'Pendidikan Agama Islam & Budi Pekerti', score: 94, letterGrade: 'A' as const, notes: 'Sangat menguasai kisah para nabi dan adab berteman.' },
      { subject: 'Pendidikan Pancasila', score: 91, letterGrade: 'A' as const, notes: 'Disiplin dan gemar berbagi dengan teman sekelas.' },
      { subject: 'Bahasa Indonesia', score: 90, letterGrade: 'A' as const, notes: 'Mampu menyusun kalimat tegak bersambung yang rapi.' },
      { subject: 'Matematika', score: 88, letterGrade: 'A' as const, notes: 'Kuasai perkalian dasar tabel 1 sampai 10.' },
      { subject: 'IPAS (Ilmu Pengetahuan Alam & Sosial)', score: 89, letterGrade: 'A' as const, notes: 'Paham siklus hidup kupu-kupu dan hewan sekitar.' },
      { subject: 'Seni dan Budaya', score: 93, letterGrade: 'A' as const, notes: 'Karya mozaik kertas origami sangat detail.' },
      { subject: 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)', score: 87, letterGrade: 'A' as const, notes: 'Lincah dan gemar senam ceria.' },
      { subject: 'Bahasa Inggris', score: 86, letterGrade: 'B' as const, notes: 'Hafal nama warna, angka, dan benda kelas.' },
      { subject: 'Muatan Lokal (Bahasa Daerah/Tahfizh)', score: 95, letterGrade: 'A' as const, notes: 'Hafal Juz Amma hingga Surah ‘Abasa.' },
    ],
    attendance: { present: 80, sick: 0, permitted: 0, absent: 0 },
    extracurriculars: [
      { name: 'Seni Tari Islami & Tahfizh', grade: 'A', notes: 'Penampilan tari samin sangat memukau.' },
    ],
    teacherNotes: 'Fatimah sangat anggun, santun, dan rajin dalam menyelesaikan lembar kerja.',
    status: 'DITERBITKAN' as const,
    issuedDate: '2026-07-22',
  },
  {
    id: 'rap-16',
    studentId: 'std-16',
    studentName: 'Zahra Amalia',
    nisn: '2026116',
    gradeClass: 'Kelas 3',
    academicYear: '2026/2027 Semester Ganjil',
    parentName: 'Supriyadi',
    teacherName: 'Ojah Nasiah Ulfah, S.Ag',
    grades: [
      { subject: 'Pendidikan Agama Islam & Budi Pekerti', score: 90, letterGrade: 'A' as const, notes: 'Hafal bacaan ruku dan sujud dengan tartil.' },
      { subject: 'Pendidikan Pancasila', score: 89, letterGrade: 'A' as const, notes: 'Menghargai keragaman suku bangsa di kelas.' },
      { subject: 'Bahasa Indonesia', score: 88, letterGrade: 'A' as const, notes: 'Keterampilan menyimak dongeng sangat baik.' },
      { subject: 'Matematika', score: 86, letterGrade: 'B' as const, notes: 'Memahami satuan panjang meter dan centimeter.' },
      { subject: 'IPAS (Ilmu Pengetahuan Alam & Sosial)', score: 88, letterGrade: 'A' as const, notes: 'Mengenal bagian-bagian tumbuhan dan fungsinya.' },
      { subject: 'Seni dan Budaya', score: 91, letterGrade: 'A' as const, notes: 'Pandai menyanyikan lagu-lagu nasional.' },
      { subject: 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)', score: 88, letterGrade: 'A' as const, notes: 'Menunjukkan kelenturan tubuh dalam senam lantai.' },
      { subject: 'Bahasa Inggris', score: 85, letterGrade: 'B' as const, notes: 'Mengenal instruksi sit down, stand up, open book.' },
      { subject: 'Muatan Lokal (Bahasa Daerah/Tahfizh)', score: 92, letterGrade: 'A' as const, notes: 'Hafalan Surah At-Takwir lancar.' },
    ],
    attendance: { present: 79, sick: 1, permitted: 0, absent: 0 },
    extracurriculars: [
      { name: 'Dokter Kecil (UKS)', grade: 'A', notes: 'Sigap membantu kawan yang membutuhkan.' },
    ],
    teacherNotes: 'Zahra anak yang berempati tinggi, ceria, dan teliti saat belajar.',
    status: 'DITERBITKAN' as const,
    issuedDate: '2026-07-22',
  },

  // === KELAS 2 (Wali Kelas: Setia Widi Mawaddah, S.Pd) ===
  {
    id: 'rap-6',
    studentId: 'std-9',
    studentName: 'Maryam Qonita',
    nisn: '2026109',
    gradeClass: 'Kelas 2',
    academicYear: '2026/2027 Semester Ganjil',
    parentName: 'Imran',
    teacherName: 'Setia Widi Mawaddah, S.Pd',
    grades: [
      { subject: 'Pendidikan Agama Islam & Budi Pekerti', score: 94, letterGrade: 'A' as const, notes: 'Hafal rukun iman, rukun Islam, dan doa harian.' },
      { subject: 'Pendidikan Pancasila', score: 90, letterGrade: 'A' as const, notes: 'Disiplin dan menghormati guru serta teman.' },
      { subject: 'Bahasa Indonesia', score: 92, letterGrade: 'A' as const, notes: 'Lancar membaca buku cerita bergambar dan menulis tegak bersambung.' },
      { subject: 'Matematika', score: 88, letterGrade: 'A' as const, notes: 'Kuasai penjumlahan dan pengurangan bersusun sederhana.' },
      { subject: 'Seni dan Budaya', score: 93, letterGrade: 'A' as const, notes: 'Gambar sangat rapi dengan paduan warna yang cerah.' },
      { subject: 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)', score: 88, letterGrade: 'A' as const, notes: 'Terampil dalam gerakan melompat dan lempar tangkap bola.' },
      { subject: 'Bahasa Inggris', score: 87, letterGrade: 'A' as const, notes: 'Hafal angka 1-20 dan warna dalam bahasa Inggris.' },
      { subject: 'Muatan Lokal (Bahasa Daerah/Tahfizh)', score: 95, letterGrade: 'A' as const, notes: 'Hafal Juz Amma surah Ad-Dhuha s/d An-Nas.' },
    ],
    attendance: { present: 80, sick: 0, permitted: 0, absent: 0 },
    extracurriculars: [
      { name: 'Seni Lukis & Tahfizh', grade: 'A', notes: 'Karya gambar dipajang di mading kelas.' },
    ],
    teacherNotes: 'Maryam sangat cerdas, rajin, santun, dan selalu menyelesaikan tugas tepat waktu.',
    status: 'DITERBITKAN' as const,
    issuedDate: '2026-07-22',
  },
  {
    id: 'rap-10-std10',
    studentId: 'std-10',
    studentName: 'Yusuf Habibi',
    nisn: '2026110',
    gradeClass: 'Kelas 2',
    academicYear: '2026/2027 Semester Ganjil',
    parentName: 'Ya\'qub',
    teacherName: 'Setia Widi Mawaddah, S.Pd',
    grades: [
      { subject: 'Pendidikan Agama Islam & Budi Pekerti', score: 91, letterGrade: 'A' as const, notes: 'Hafalan kalimat thoyyibah sangat lancar.' },
      { subject: 'Pendidikan Pancasila', score: 88, letterGrade: 'A' as const, notes: 'Tertib saat berbaris dan bermain di sekolah.' },
      { subject: 'Bahasa Indonesia', score: 87, letterGrade: 'A' as const, notes: 'Mampu menceritakan kembali pengalaman liburan.' },
      { subject: 'Matematika', score: 85, letterGrade: 'B' as const, notes: 'Mengenal nilai mata uang rupiah dan bangun datar.' },
      { subject: 'Seni dan Budaya', score: 90, letterGrade: 'A' as const, notes: 'Kreatif membuat kerajinan plastisin/lempung.' },
      { subject: 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)', score: 92, letterGrade: 'A' as const, notes: 'Sangat lincah dalam lari estafet.' },
      { subject: 'Bahasa Inggris', score: 84, letterGrade: 'B' as const, notes: 'Mengenal anggota tubuh dalam bahasa Inggris.' },
      { subject: 'Muatan Lokal (Bahasa Daerah/Tahfizh)', score: 90, letterGrade: 'A' as const, notes: 'Hafalan Surah Al-Zalzalah s/d Al-Qari’ah lancar.' },
    ],
    attendance: { present: 78, sick: 2, permitted: 0, absent: 0 },
    extracurriculars: [
      { name: 'Pramuka Siaga', grade: 'A', notes: 'Aktif mengikuti kegiatan dwisatya.' },
    ],
    teacherNotes: 'Yusuf anak yang periang, penuh energi, dan perlu terus didorong dalam ketelitian berhitung.',
    status: 'DITERBITKAN' as const,
    issuedDate: '2026-07-22',
  },
  {
    id: 'rap-17',
    studentId: 'std-17',
    studentName: 'Hamzah Asadullah',
    nisn: '2026117',
    gradeClass: 'Kelas 2',
    academicYear: '2026/2027 Semester Ganjil',
    parentName: 'Abdul Muttalib',
    teacherName: 'Setia Widi Mawaddah, S.Pd',
    grades: [
      { subject: 'Pendidikan Agama Islam & Budi Pekerti', score: 93, letterGrade: 'A' as const, notes: 'Rajin salat berjamaah dan hafalan doa masuk masjid.' },
      { subject: 'Pendidikan Pancasila', score: 90, letterGrade: 'A' as const, notes: 'Menghargai perbedaan pendapat saat berdiskusi kelompok.' },
      { subject: 'Bahasa Indonesia', score: 89, letterGrade: 'A' as const, notes: 'Membaca lancar teks bacaan dengan intonasi jelas.' },
      { subject: 'Matematika', score: 88, letterGrade: 'A' as const, notes: 'Mahir membaca jam dinding analog.' },
      { subject: 'Seni dan Budaya', score: 89, letterGrade: 'A' as const, notes: 'Pewarnaan gambar crayon sangat rapi.' },
      { subject: 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)', score: 94, letterGrade: 'A' as const, notes: 'Unggul dalam ketangkasan dan lompat tali.' },
      { subject: 'Bahasa Inggris', score: 86, letterGrade: 'B' as const, notes: 'Mampu menyanyikan lagu ABC dengan fasih.' },
      { subject: 'Muatan Lokal (Bahasa Daerah/Tahfizh)', score: 94, letterGrade: 'A' as const, notes: 'Hafalan Surah Al-Bayyinah sangat tartil.' },
    ],
    attendance: { present: 80, sick: 0, permitted: 0, absent: 0 },
    extracurriculars: [
      { name: 'Pencak Silat Cilik', grade: 'A', notes: 'Kuda-kuda dan gerak jurus sangat kokoh.' },
    ],
    teacherNotes: 'Hamzah murid yang pemberani, jujur, dan bersemangat tinggi dalam belajar.',
    status: 'DITERBITKAN' as const,
    issuedDate: '2026-07-22',
  },

  // === KELAS 1 (Wali Kelas: Uyat Sukriyati, S.Pd) ===
  {
    id: 'rap-7',
    studentId: 'std-11',
    studentName: 'Ibrahim Al-Khalil',
    nisn: '2026111',
    gradeClass: 'Kelas 1',
    academicYear: '2026/2027 Semester Ganjil',
    parentName: 'Azar',
    teacherName: 'Uyat Sukriyati, S.Pd',
    grades: [
      { subject: 'Pendidikan Agama Islam & Budi Pekerti', score: 95, letterGrade: 'A' as const, notes: 'Mengenal huruf Hijaiyah, harakat, dan adab makan/minum.' },
      { subject: 'Pendidikan Pancasila', score: 90, letterGrade: 'A' as const, notes: 'Mengenal aturan di rumah dan di sekolah dengan baik.' },
      { subject: 'Bahasa Indonesia', score: 88, letterGrade: 'A' as const, notes: 'Lancar mengenal suku kata dan membaca kalimat pendek.' },
      { subject: 'Matematika', score: 91, letterGrade: 'A' as const, notes: 'Mahir membilang benda 1-20 dan mengenal bentuk bangun datar.' },
      { subject: 'Seni dan Budaya', score: 92, letterGrade: 'A' as const, notes: 'Senang bernyanyi lagu islami dan menempel kolase.' },
      { subject: 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)', score: 89, letterGrade: 'A' as const, notes: 'Ceria saat senam pagi dan permainan motorik.' },
      { subject: 'Bahasa Inggris', score: 86, letterGrade: 'B' as const, notes: 'Mengenal salam dan ungkapan sederhana (Hello, Good Morning).' },
      { subject: 'Muatan Lokal (Bahasa Daerah/Tahfizh)', score: 96, letterGrade: 'A' as const, notes: 'Hafal Surah Al-Fatihah s/d Al-Kafirun dengan fasih.' },
    ],
    attendance: { present: 80, sick: 0, permitted: 0, absent: 0 },
    extracurriculars: [
      { name: 'Tahfizh Cilik', grade: 'A', notes: 'Sangat bersemangat saat tilawah pagi.' },
    ],
    teacherNotes: 'Ibrahim anak yang ceria, mudah beradaptasi, dan memiliki daya ingat hafalan yang sangat kuat.',
    status: 'DITERBITKAN' as const,
    issuedDate: '2026-07-22',
  },
  {
    id: 'rap-12-std12',
    studentId: 'std-12',
    studentName: 'Anisa Rahmawati',
    nisn: '2026112',
    gradeClass: 'Kelas 1',
    academicYear: '2026/2027 Semester Ganjil',
    parentName: 'Bambang',
    teacherName: 'Uyat Sukriyati, S.Pd',
    grades: [
      { subject: 'Pendidikan Agama Islam & Budi Pekerti', score: 96, letterGrade: 'A' as const, notes: 'Mengenal nama-nama 25 nabi dan rukun iman.' },
      { subject: 'Pendidikan Pancasila', score: 92, letterGrade: 'A' as const, notes: 'Sangat tertib mematuhi tata tertib kelas 1.' },
      { subject: 'Bahasa Indonesia', score: 93, letterGrade: 'A' as const, notes: 'Membaca nyaring sangat lancar dan menulis huruf rapi.' },
      { subject: 'Matematika', score: 90, letterGrade: 'A' as const, notes: 'Cepat dalam penjumlahan benda konkrit 1-20.' },
      { subject: 'Seni dan Budaya', score: 94, letterGrade: 'A' as const, notes: 'Mewarnai gambar sangat rapi tanpa keluar garis.' },
      { subject: 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)', score: 88, letterGrade: 'A' as const, notes: 'Gembira saat senam irama anak.' },
      { subject: 'Bahasa Inggris', score: 89, letterGrade: 'A' as const, notes: 'Hafal nama-nama warna (Red, Blue, Green, Yellow).' },
      { subject: 'Muatan Lokal (Bahasa Daerah/Tahfizh)', score: 97, letterGrade: 'A' as const, notes: 'Hafalan Juz Amma Surah An-Nas s/d Al-Humazah lancar.' },
    ],
    attendance: { present: 80, sick: 0, permitted: 0, absent: 0 },
    extracurriculars: [
      { name: 'Seni Mewarnai & Tahfizh', grade: 'A', notes: 'Karya mewarnai rapi dan paduan warna serasi.' },
    ],
    teacherNotes: 'Anisa murid yang sangat manis, santun, cerdas, dan rajin mencatat.',
    status: 'DITERBITKAN' as const,
    issuedDate: '2026-07-22',
  },
  {
    id: 'rap-18',
    studentId: 'std-18',
    studentName: 'Ruqayyah Jamilah',
    nisn: '2026118',
    gradeClass: 'Kelas 1',
    academicYear: '2026/2027 Semester Ganjil',
    parentName: 'Masykur',
    teacherName: 'Uyat Sukriyati, S.Pd',
    grades: [
      { subject: 'Pendidikan Agama Islam & Budi Pekerti', score: 94, letterGrade: 'A' as const, notes: 'Mengenal rukun Islam dan praktik wudhu sederhana.' },
      { subject: 'Pendidikan Pancasila', score: 91, letterGrade: 'A' as const, notes: 'Suka menolong teman dan menjaga kebersihan meja.' },
      { subject: 'Bahasa Indonesia', score: 90, letterGrade: 'A' as const, notes: 'Lancar membaca kata-kata berakhiran konsonan.' },
      { subject: 'Matematika', score: 89, letterGrade: 'A' as const, notes: 'Mampu membandingkan banyak benda lebih banyak/sedikit.' },
      { subject: 'Seni dan Budaya', score: 93, letterGrade: 'A' as const, notes: 'Kreatif menempel kertas lipat membentuk bunga.' },
      { subject: 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)', score: 89, letterGrade: 'A' as const, notes: 'Lincah dalam jalan jinjit dan melompat.' },
      { subject: 'Bahasa Inggris', score: 88, letterGrade: 'A' as const, notes: 'Mengenal nama-nama anggota keluarga (Father, Mother).' },
      { subject: 'Muatan Lokal (Bahasa Daerah/Tahfizh)', score: 95, letterGrade: 'A' as const, notes: 'Hafalan Surah Al-Fil s/d Al-Quraisy sangat tartil.' },
    ],
    attendance: { present: 80, sick: 0, permitted: 0, absent: 0 },
    extracurriculars: [
      { name: 'Tahfizh Cilik', grade: 'A', notes: 'Rajin murojaah bersama ummi di rumah.' },
    ],
    teacherNotes: 'Ruqayyah anak yang sholehah, ramah, dan selalu bersemangat datang ke sekolah.',
    status: 'DITERBITKAN' as const,
    issuedDate: '2026-07-22',
  },

  // === ARSIP HISTORIS TAHUN AJARAN 2025/2026 (Semester Genap) ===
  {
    id: 'rap-hist-2025-std1',
    studentId: 'std-1',
    studentName: 'Ahmad Rizky Pratama',
    nisn: '2026101',
    gradeClass: 'Kelas 5',
    academicYear: '2025/2026 Semester Genap',
    parentName: 'Rahmat Hidayat',
    teacherName: 'Nurbibiyatillah',
    grades: [
      { subject: 'Tahfidz', score: 94, letterGrade: 'A' as const, notes: 'Selesai hafalan Juz 30 dengan predikat Jayyid Jiddan.' },
      { subject: 'MTK 5', score: 96, letterGrade: 'A' as const, notes: 'Juara 1 Lomba Matematika Tingkat Kecamatan.' },
      { subject: 'IPAS 5', score: 91, letterGrade: 'A' as const, notes: 'Penguasaan konsep materi gaya magnet dan listrik.' },
      { subject: 'B.Indo 5', score: 89, letterGrade: 'A' as const, notes: 'Menulis teks eksplanasi ilmiah sederhana.' },
      { subject: 'PPKn 5', score: 91, letterGrade: 'A' as const, notes: 'Menunjukkan sikap kepemimpinan dan toleransi.' },
      { subject: 'Seni 5', score: 90, letterGrade: 'A' as const, notes: 'Karya seni rupa 3 dimensi sangat kreatif.' },
      { subject: 'B.Inggris 5', score: 87, letterGrade: 'A' as const, notes: 'Mampu bercakap-cakap mengenai hobi dan cita-cita.' },
    ],
    attendance: { present: 82, sick: 0, permitted: 0, absent: 0 },
    extracurriculars: [
      { name: 'Pramuka & OSN Matematika', grade: 'A', notes: 'Mewakili sekolah ke tingkat kabupaten.' },
    ],
    teacherNotes: 'Selamat atas kenaikan ke Kelas 6 dengan predikat Peringkat 1 Kelas.',
    status: 'DITERBITKAN' as const,
    issuedDate: '2026-06-20',
  },
  {
    id: 'rap-hist-2025-std2',
    studentId: 'std-2',
    studentName: 'Siti Nurhaliza',
    nisn: '2026102',
    gradeClass: 'Kelas 5',
    academicYear: '2025/2026 Semester Genap',
    parentName: 'Hasan Basri',
    teacherName: 'Nurbibiyatillah',
    grades: [
      { subject: 'Tahfidz', score: 97, letterGrade: 'A' as const, notes: 'Juara MHQ Juz 30 Tingkat Kabupaten.' },
      { subject: 'MTK 5', score: 89, letterGrade: 'A' as const, notes: 'Pemahaman materi statistika dan diagram batang.' },
      { subject: 'IPAS 5', score: 92, letterGrade: 'A' as const, notes: 'Sangat baik dalam pengamatan ekosistem air tawar.' },
      { subject: 'B.Indo 5', score: 93, letterGrade: 'A' as const, notes: 'Menulis karya cerpen bertema islami.' },
      { subject: 'PPKn 5', score: 90, letterGrade: 'A' as const, notes: 'Santun dan taat pada kesepakatan kelas.' },
      { subject: 'Seni 5', score: 95, letterGrade: 'A' as const, notes: 'Karya seni kriya sangat halus dan indah.' },
      { subject: 'B.Inggris 5', score: 89, letterGrade: 'A' as const, notes: 'Lancar membaca dialog bahasa Inggris.' },
    ],
    attendance: { present: 81, sick: 1, permitted: 0, absent: 0 },
    extracurriculars: [
      { name: 'Tahfidz & Kaligrafi', grade: 'A', notes: 'Sangat tekun dan disiplin.' },
    ],
    teacherNotes: 'Naik ke Kelas 6 dengan hasil sangat memuaskan (Peringkat 2 Kelas).',
    status: 'DITERBITKAN' as const,
    issuedDate: '2026-06-20',
  },

  // === ARSIP HISTORIS TAHUN AJARAN 2024/2025 (Semester Genap) ===
  {
    id: 'rap-hist-2024-std1',
    studentId: 'std-1',
    studentName: 'Ahmad Rizky Pratama',
    nisn: '2026101',
    gradeClass: 'Kelas 4',
    academicYear: '2024/2025 Semester Genap',
    parentName: 'Rahmat Hidayat',
    teacherName: 'Iis Rohmayanti, S.Pd',
    grades: [
      { subject: 'Tahfidz', score: 93, letterGrade: 'A' as const, notes: 'Hafalan Surah An-Naba sampai Al-Muthaffifin mutqin.' },
      { subject: 'MTK 4', score: 95, letterGrade: 'A' as const, notes: 'Sangat unggul dalam operasi hitung pecahan.' },
      { subject: 'IPAS 4', score: 90, letterGrade: 'A' as const, notes: 'Memahami fotosintesis dan rantai makanan.' },
      { subject: 'B.Indo 4', score: 88, letterGrade: 'A' as const, notes: 'Membaca nyaring dan menulis tegak bersambung.' },
      { subject: 'PPKn 4', score: 90, letterGrade: 'A' as const, notes: 'Sopan dan santun kepada guru dan teman.' },
      { subject: 'Seni 4', score: 88, letterGrade: 'A' as const, notes: 'Menggambar dekoratif dengan komposisi seimbang.' },
      { subject: 'B.Inggris 4', score: 86, letterGrade: 'B' as const, notes: 'Mengenal kosa kata waktu dan cuaca.' },
    ],
    attendance: { present: 80, sick: 1, permitted: 0, absent: 0 },
    extracurriculars: [
      { name: 'Pramuka Penggalang', grade: 'A', notes: 'Aktif regu rajawali.' },
    ],
    teacherNotes: 'Naik ke Kelas 5 dengan prestasi gemilang.',
    status: 'DITERBITKAN' as const,
    issuedDate: '2025-06-21',
  },
];

// --- INITIAL TEACHER JOURNALS FOR ROMBEL ---
export const INITIAL_TEACHER_JOURNALS = [
  {
    id: 'jrn-rom-1',
    teacherId: 'tch-3',
    teacherName: 'Mega Andini Putri, S.Pd',
    rombonganBelajar: 'Kelas 6',
    subject: 'Matematika Rombel 6',
    date: '2026-08-01',
    topic: 'Operasi Hitung Campuran Pecahan & Desimal',
    competencySummary: 'Menganalisis dan memecahkan soal cerita pecahan berbasis kehidupan sehari-hari.',
    teachingMaterial: 'Modul Digital SiPLah & Lembar Kerja Siswa Interaktif',
    status: 'DISETUJUI_KEPSEK' as const,
    principalFeedback: 'Materi sangat sesuai Kurikulum Merdeka. Lanjutkan penguatan literasi numerasi.',
    approvedDate: '2026-08-01',
  },
  {
    id: 'jrn-rom-2',
    teacherId: 'tch-2',
    teacherName: 'Iis Rohmayanti, S.Pd',
    rombonganBelajar: 'Kelas 4',
    subject: 'IPAS (Ilmu Pengetahuan Alam & Sosial)',
    date: '2026-08-02',
    topic: 'Wujud Zat dan Perubahannya dalam Kehidupan Sehari-hari',
    competencySummary: 'Melakukan eksperimen sederhana perubahan wujud benda padat, cair, dan gas.',
    teachingMaterial: 'Kit Sains Laboratorium & Lembar Praktikum Siswa',
    status: 'DISETUJUI_KEPSEK' as const,
    principalFeedback: 'Disetujui. Praktikum berbasis eksperimen sangat menarik minat belajar siswa.',
    approvedDate: '2026-08-02',
  },
  {
    id: 'jrn-rom-3',
    teacherId: 'tch-7',
    teacherName: 'Nurbibiyatillah',
    rombonganBelajar: 'Kelas 5',
    subject: 'IPAS Rombel 5',
    date: '2026-08-03',
    topic: 'Sistem Organ Pencernaan Manusia & Pola Makan Sehat Halal',
    competencySummary: 'Mengidentifikasi organ pencernaan melalui alat peraga torso biologi dan bagan interaktif.',
    teachingMaterial: 'Alat Peraga Torso Lab Biologi & Video Pembelajaran SiPLah',
    status: 'DISETUJUI_KEPSEK' as const,
    principalFeedback: 'Bagus sekali. Sertakan juga tinjauan thoyyiban dalam kebiasaan makan.',
    approvedDate: '2026-08-03',
  },
  {
    id: 'jrn-rom-4',
    teacherId: 'tch-4',
    teacherName: 'Ojah Nasiah Ulfah, S.Ag',
    rombonganBelajar: 'Kelas 3',
    subject: 'Al-Qur’an & Hadits Tematik',
    date: '2026-08-04',
    topic: 'Kaidah Hukum Tajwid Mad Thabi’i & Idzhar Halqi',
    competencySummary: 'Menerapkan makhraj huruf dan hukum bacaan mad dalam tilawah Surah Maryam.',
    teachingMaterial: 'Mushaf Al-Qur’an Standar & Audio Murottal Syaikh Misyari',
    status: 'DISETUJUI_KEPSEK' as const,
    principalFeedback: 'Disetujui. Program penguatan tahsin agar terus dijadwalkan setiap pekan.',
    approvedDate: '2026-08-04',
  },
  {
    id: 'jrn-rom-5',
    teacherId: 'tch-6',
    teacherName: 'Setia Widi Mawaddah, S.Pd',
    rombonganBelajar: 'Kelas 2',
    subject: 'Bahasa Indonesia Tematik',
    date: '2026-08-05',
    topic: 'Membaca Lancar Teks Pendek & Kosakata Lingkungan Bersih',
    competencySummary: 'Mampu menyusun kalimat runtut mengenai cara menjaga kebersihan ruang kelas.',
    teachingMaterial: 'Kartu Baca Bergambar & Lembar Kreasi Tulis Siswa',
    status: 'DIUSULKAN_GURU' as const,
  },
  {
    id: 'jrn-rom-6',
    teacherId: 'tch-5',
    teacherName: 'Uyat Sukriyati, S.Pd',
    rombonganBelajar: 'Kelas 1',
    subject: 'Pendidikan Pancasila & Budi Pekerti',
    date: '2026-08-06',
    topic: 'Mengenal Aturan di Rumah dan di Sekolah dengan Suka Cita',
    competencySummary: 'Membiasakan budaya antre, salam, dan merapikan mainan bersama kawan.',
    teachingMaterial: 'Boneka Jari Karakter & Lagu Anak Edukatif',
    status: 'DIUSULKAN_GURU' as const,
  },
];

// --- INITIAL CONSULTATION & PROGRESS INTERACTION MESSAGES (GURU - WALI MURID) ---
export const INITIAL_CONSULTATION_MESSAGES = [
  {
    id: 'msg-1',
    studentId: 'std-1',
    studentName: 'Ahmad Rizky Pratama',
    gradeClass: 'Kelas 6',
    senderType: 'GURU_WALIKELAS' as const,
    senderName: 'Mega Andini Putri, S.Pd (Wali Kelas 6)',
    category: 'PRESTASI' as const,
    title: 'Apresiasi Capaian Hafalan Juz 30 & Juara 1 Olimpiade Matematika',
    message: 'Assalamu\'alaikum Bpk. Rahmat Hidayat. Alhamdulillah ananda Ahmad menunjukkan perkembangan luar biasa di kelas. Beliau telah menyelesaikan tasmi\' hafalan Juz 30 dengan predikat Mumtaz serta lolos seleksi OSN Matematika tingkat kota. Mohon terus didukung murojaah di rumah.',
    timestamp: '2026-08-10 09:30',
    status: 'DITANGGAPI' as const,
    attachmentNote: 'Sertifikat Tasmi Juz 30 & Rekomendasi OSN',
  },
  {
    id: 'msg-2',
    studentId: 'std-1',
    studentName: 'Ahmad Rizky Pratama',
    gradeClass: 'Kelas 6',
    senderType: 'WALI_MURID' as const,
    senderName: 'Bpk. Rahmat Hidayat (Wali Murid)',
    category: 'PRESTASI' as const,
    title: 'Terima Kasih Bimbingan Bu Guru Mega',
    message: 'Wa\'alaikumsalam Warahmatullahi Wabarakatuh Bu Mega. Terima kasih banyak atas bimbingan dan kesabaran Ibu mengajar Ahmad. Kami di rumah akan senantiasa mengingatkan jadwal murojaah setiap ba\'da maghrib.',
    timestamp: '2026-08-10 11:15',
    status: 'DIBACA' as const,
  },
  {
    id: 'msg-3',
    studentId: 'std-4',
    studentName: 'Aisyah Humaira',
    gradeClass: 'Kelas 5',
    senderType: 'GURU_WALIKELAS' as const,
    senderName: 'Nurbibiyatillah (Wali Kelas 5)',
    category: 'KEWAJIBAN_SPP' as const,
    title: 'Pemberitahuan Administrasi SPP & Konfirmasi Pembayaran',
    message: 'Assalamu\'alaikum Ibu/Bpk. Umar Khalid. Mengingatkan kembali bahwa administrasi SPP bulan Agustus ananda Aisyah berstatus Menunggu Verifikasi. Mohon konfirmasi bukti pembayaran ke Bagian Keuangan/Wali Kelas agar E-Raport semesteran dapat langsung diakses pada portal wali murid.',
    timestamp: '2026-08-11 08:45',
    status: 'TERKIRIM' as const,
    attachmentNote: 'Virtual Account BSI: 880202026104 a.n Aisyah Humaira',
  },
  {
    id: 'msg-4',
    studentId: 'std-10',
    studentName: 'Yusuf Habibi',
    gradeClass: 'Kelas 2',
    senderType: 'GURU_WALIKELAS' as const,
    senderName: 'Setia Widi Mawaddah, S.Pd (Wali Kelas 2)',
    category: 'KEWAJIBAN_SPP' as const,
    title: 'Informasi Status SPP & Akses E-Raport Digital',
    message: 'Assalamu\'alaikum Bpk. Ya\'qub. Mohon izin menginfokan bahwa ananda Yusuf memiliki catatan tunggakan SPP. Demi ketertiban administrasi akademik, akses unduh lembar E-Raport di portal wali murid akan terbuka otomatis setelah status pembayaran diverifikasi LUNAS oleh Bendahara.',
    timestamp: '2026-08-12 10:00',
    status: 'TERKIRIM' as const,
    attachmentNote: 'VA BSI: 880202026110 (Rp 250.000 / bln)',
  },
  {
    id: 'msg-5',
    studentId: 'std-11',
    studentName: 'Ibrahim Al-Khalil',
    gradeClass: 'Kelas 1',
    senderType: 'GURU_WALIKELAS' as const,
    senderName: 'Uyat Sukriyati, S.Pd (Wali Kelas 1)',
    category: 'KONSULTASI_BELAJAR' as const,
    title: 'Perkembangan Adaptasi & Calistung Ananda Ibrahim di Kelas 1',
    message: 'Assalamu\'alaikum Ayah/Bunda Ibrahim. Alhamdulillah ananda sangat cepat berbaur dengan teman-temannya. Kemampuan membaca suku kata dan hafalan surah pendeknya sangat menonjol. Tetap jaga semangatnya saat di rumah ya Bunda.',
    timestamp: '2026-08-13 13:20',
    status: 'DITANGGAPI' as const,
    attachmentNote: 'Catatan Observasi Karakter Awal Semester',
  },
  {
    id: 'msg-6',
    studentId: 'std-7',
    studentName: 'Bilqis Az-Zahra',
    gradeClass: 'Kelas 3',
    senderType: 'GURU_WALIKELAS' as const,
    senderName: 'Ojah Nasiah Ulfah, S.Ag (Wali Kelas 3)',
    category: 'PRESTASI' as const,
    title: 'Kemajuan Tajwid & Lomba Kaligrafi Santri',
    message: 'Assalamu\'alaikum Ibu/Bpk. Sulaiman. Alhamdulillah ananda Bilqis sangat mahir dalam penerapan mad thabi\'i dan terpilih mewakili Kelas 3 dalam lomba kaligrafi tingkat kecamatan.',
    timestamp: '2026-08-13 14:10',
    status: 'TERKIRIM' as const,
    attachmentNote: 'Karya Kaligrafi Hiasan Mushaf',
  },
  {
    id: 'msg-7',
    studentId: 'std-5',
    studentName: 'Muhammad Fatih',
    gradeClass: 'Kelas 4',
    senderType: 'GURU_WALIKELAS' as const,
    senderName: 'Iis Rohmayanti, S.Pd (Wali Kelas 4)',
    category: 'KEWAJIBAN_SPP' as const,
    title: 'Konfirmasi Rekapitulasi SPP & E-Raport Semester',
    message: 'Assalamu\'alaikum Ayahanda Fatih. Mengingatkan jadwal pencetakan rapor akhir semester dan pengecekan kelengkapan administrasi SPP bulan berjalan. Terima kasih atas kerja samanya.',
    timestamp: '2026-08-13 15:00',
    status: 'DITANGGAPI' as const,
    attachmentNote: 'No. VA BSI: 880202026105',
  },
];

// --- INITIAL ARKAS 1-YEAR BUDGET PLAN (Rencana Kerja & Anggaran Sekolah 1 T.A.) ---
export const INITIAL_ARKAS_BUDGET = [
  {
    id: 'ark-1',
    code: 'ARK-2026-01',
    activityName: 'Pengadaan Komputer & Laptop Pembelajaran ANBK (SiPLah)',
    category: 'BELANJA_MODAL' as const,
    plannedBudget: 120000000,
    realizedAmount: 85000000,
    fundingSource: 'DANA_BOS' as const,
    targetRombel: 'Rombel Kelas 5 & 6',
  },
  {
    id: 'ark-2',
    code: 'ARK-2026-02',
    activityName: 'Pembelian Buku Cetak Kurikulum Merdeka & Modul Siswa',
    category: 'BELANJA_BARANG' as const,
    plannedBudget: 45000000,
    realizedAmount: 28500000,
    fundingSource: 'DANA_BOS' as const,
    targetRombel: 'Rombel Kelas 1 - 6',
  },
  {
    id: 'ark-3',
    code: 'ARK-2026-03',
    activityName: 'Honorarium Gaji & Tunjangan Guru Tenaga Pendidik',
    category: 'HONOR_SDM' as const,
    plannedBudget: 600000000,
    realizedAmount: 480000000,
    fundingSource: 'DANA_SPP' as const,
    targetRombel: 'Seluruh Tenaga Pendidik',
  },
  {
    id: 'ark-4',
    code: 'ARK-2026-04',
    activityName: 'Pemeliharaan Gedung Kelas & Sarana Sanitasi Sekolah',
    category: 'OPERASIONAL' as const,
    plannedBudget: 60000000,
    realizedAmount: 35000000,
    fundingSource: 'HIBAH_YAYASAN' as const,
    targetRombel: 'Fasilitas Kampus',
  },
  {
    id: 'ark-5',
    code: 'ARK-2026-05',
    activityName: 'Pengadaan Alat Peraga Sains & Laboratorium Sekolah',
    category: 'BELANJA_MODAL' as const,
    plannedBudget: 35000000,
    realizedAmount: 25000000,
    fundingSource: 'DANA_BOS' as const,
    targetRombel: 'Rombel Kelas 4, 5, 6',
  },
];

export const INITIAL_WEBSITE_LAYOUT_CONFIG: WebsiteLayoutConfig = {
  themePalette: 'indigo_royal',
  headerStyle: 'gradient_dark',
  heroStyle: 'slider_overlay',
  photoStyle: {
    borderRadius: 'rounded-3xl',
    imageFit: 'cover',
    shadowStyle: 'shadow-lg',
    borderStyle: 'border border-blue-100',
    hoverEffect: 'zoom',
    filterOverlay: 'none',
  },
  gridColumns: {
    galleryCols: 3,
    newsCols: 3,
    achievementCols: 3,
  },
  sections: [
    { id: 'hero', title: 'Slide Banner Utama (Hero)', visible: true, order: 1 },
    { id: 'speeches', title: 'Sambutan Ketua Yayasan & Kepala Sekolah', visible: true, order: 2 },
    { id: 'guru_staf_org', title: 'Struktur Organisasi Guru & Staf (Dinamis)', visible: true, order: 3 },
    { id: 'stats', title: 'Statistik Rombongan Belajar & Sekolah', visible: true, order: 4 },
    { id: 'vision_mission', title: 'Visi, Misi & Filosofi Pendirian', visible: true, order: 4 },
    { id: 'news', title: 'Berita & Pengumuman Sekolah', visible: true, order: 5 },
    { id: 'gallery', title: 'Galeri Foto & Video Aktivitas', visible: true, order: 6 },
    { id: 'achievements', title: 'Unjuk Prestasi Siswa & Medali', visible: true, order: 7 },
    { id: 'raport_spp', title: 'Portal Cek E-Raport & Status SPP', visible: true, order: 8 },
    { id: 'foundation_profile', title: 'Profil Yayasan & Pengurus', visible: true, order: 9 },
    { id: 'contact', title: 'Kontak & Peta Lokasi Kampus', visible: true, order: 10 },
  ],
};

export const INITIAL_SUBJECTS: SubjectItem[] = [
  {
    id: 'mapel-1',
    nipy: '1988110504',
    teacherName: 'Ojah Nasiah Ulfah, S.Ag',
    waliKelas: 'Kelas 3',
    subjectName: 'Pendidikan Agama Islam & Budi Pekerti',
    gradeClass: 'Kelas 1 - 6',
    kkm: 75,
    category: 'AGAMA',
  },
  {
    id: 'mapel-2',
    nipy: '1993071206',
    teacherName: 'Setia Widi Mawaddah, S.Pd',
    waliKelas: 'Kelas 2',
    subjectName: 'Pendidikan Pancasila',
    gradeClass: 'Kelas 1 - 6',
    kkm: 75,
    category: 'UMUM',
  },
  {
    id: 'mapel-3',
    nipy: '1991051005',
    teacherName: 'Uyat Sukriyati, S.Pd',
    waliKelas: 'Kelas 1',
    subjectName: 'Bahasa Indonesia',
    gradeClass: 'Kelas 1 - 6',
    kkm: 75,
    category: 'UMUM',
  },
  {
    id: 'mapel-4',
    nipy: '1990041502',
    teacherName: 'Iis Rohmayanti, S.Pd',
    waliKelas: 'Kelas 4',
    subjectName: 'Matematika',
    gradeClass: 'Kelas 1 - 6',
    kkm: 75,
    category: 'UMUM',
  },
  {
    id: 'mapel-5',
    nipy: '1992082003',
    teacherName: 'Mega Andini Putri, S.Pd',
    waliKelas: 'Kelas 6',
    subjectName: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
    gradeClass: 'Kelas 3, 4, 5, 6',
    kkm: 75,
    category: 'UMUM',
  },
  {
    id: 'mapel-6',
    nipy: '1994011507',
    teacherName: 'Nurbibiyatillah',
    waliKelas: 'Kelas 5',
    subjectName: 'Bahasa Inggris',
    gradeClass: 'Kelas 1 - 6',
    kkm: 75,
    category: 'UMUM',
  },
  {
    id: 'mapel-7',
    nipy: '1986080811',
    teacherName: 'Muhi, S.Pd',
    waliKelas: '-',
    subjectName: 'Pendidikan Jasmani, Olahraga & Kesehatan (PJOK)',
    gradeClass: 'Kelas 1 - 6',
    kkm: 75,
    category: 'UMUM',
  },
  {
    id: 'mapel-8',
    nipy: '1993071206',
    teacherName: 'Setia Widi Mawaddah, S.Pd',
    waliKelas: 'Kelas 2',
    subjectName: 'Seni Rupa & Prakarya',
    gradeClass: 'Kelas 1 - 6',
    kkm: 75,
    category: 'UMUM',
  },
  {
    id: 'mapel-9',
    nipy: '1988110504',
    teacherName: 'Ojah Nasiah Ulfah, S.Ag',
    waliKelas: 'Kelas 3',
    subjectName: 'Bahasa Arab & Hadits Tematik',
    gradeClass: 'Kelas 1 - 6',
    kkm: 75,
    category: 'AGAMA',
  },
  {
    id: 'mapel-10',
    nipy: '1992090912',
    teacherName: 'Subihat, S.Pd',
    waliKelas: '-',
    subjectName: 'Tahsin & Tahfidz Al-Qur\'an Juz 30',
    gradeClass: 'Kelas 1 - 6',
    kkm: 80,
    category: 'KEISLAMAN',
  },
  {
    id: 'mapel-11',
    nipy: '1992090912',
    teacherName: 'Subihat, S.Pd',
    waliKelas: '-',
    subjectName: 'Bina Pribadi Islam (BPI)',
    gradeClass: 'Kelas 1 - 6',
    kkm: 78,
    category: 'KEISLAMAN',
  },
  {
    id: 'mapel-12',
    nipy: '1989022008',
    teacherName: 'Alvi Maulidi, S.Pd',
    waliKelas: '-',
    subjectName: 'Teknologi Informasi & Komputer (TIK Dasar)',
    gradeClass: 'Kelas 4, 5, 6',
    kkm: 75,
    category: 'MUATAN_LOKAL',
  },
];

export const getSubjectsByClass = (gradeClass: string): string[] => {
  const normalized = gradeClass.toLowerCase();
  if (normalized.includes('1') || normalized.includes('kelas 1')) {
    return [
      'Pendidikan Agama Islam & Budi Pekerti',
      'Pendidikan Pancasila',
      'Bahasa Indonesia (Membaca & Menulis)',
      'Matematika Dasar & Bilangan',
      'Seni Rupa & Prakarya',
      'Pendidikan Jasmani, Olahraga & Kesehatan (PJOK)',
      'Tahsin & Tahfidz Juz 30',
    ];
  }
  if (normalized.includes('2') || normalized.includes('kelas 2')) {
    return [
      'Pendidikan Agama Islam & Budi Pekerti',
      'Pendidikan Pancasila',
      'Bahasa Indonesia',
      'Matematika',
      'Seni Budaya dan Keterampilan',
      'PJOK',
      'Bahasa Inggris Dasar',
      'Tahsin & Tahfidz Al-Qur\'an',
    ];
  }
  if (normalized.includes('3') || normalized.includes('kelas 3')) {
    return [
      'Pendidikan Agama Islam & Budi Pekerti',
      'Pendidikan Pancasila',
      'Bahasa Indonesia',
      'Matematika',
      'IPAS (Ilmu Pengetahuan Alam dan Sosial)',
      'Seni dan Budaya',
      'PJOK',
      'Bahasa Arab Dasar',
      'Tahfidz Al-Qur\'an',
    ];
  }
  if (normalized.includes('4') || normalized.includes('kelas 4')) {
    return [
      'Pendidikan Agama Islam & Budi Pekerti',
      'Pendidikan Pancasila',
      'Bahasa Indonesia',
      'Matematika Terapan',
      'IPAS (Sains & Sosial Merdeka)',
      'Bahasa Inggris',
      'Seni Rupa & Musik',
      'PJOK',
      'Bahasa Arab & Hadits Tematik',
      'Tahfidz Al-Qur\'an Juz 29-30',
    ];
  }
  if (normalized.includes('5') || normalized.includes('kelas 5')) {
    return [
      'Pendidikan Agama Islam & Budi Pekerti',
      'Pendidikan Pancasila',
      'Bahasa Indonesia',
      'Matematika Tingkat Lanjut',
      'IPAS (Eksperimen & Proyek)',
      'Bahasa Inggris',
      'Pendidikan Seni & Prakarya',
      'PJOK',
      'Pendidikan Al-Qur\'an & Hadits',
      'Tahfidz & Murojaah',
    ];
  }
  return [
    'Pendidikan Agama Islam & Budi Pekerti',
    'Pendidikan Pancasila',
    'Bahasa Indonesia (Literasi Lanjutan)',
    'Matematika (Numerasi & Pemecahan Masalah)',
    'IPAS (Sains Terpadu & Ekosistem)',
    'Bahasa Inggris',
    'Seni Budaya & Keterampilan Digital',
    'PJOK',
    'Pendidikan Al-Qur\'an Hadits & Fiqih Ibadah',
    'Tahfidz Al-Qur\'an',
  ];
};

export const getAvailableSubjectsForClass = (gradeClass: string, teachersList?: Teacher[]): string[] => {
  const list: string[] = [];
  const add = (s: string) => {
    const trimmed = s.trim();
    if (trimmed && !list.includes(trimmed)) {
      list.push(trimmed);
    }
  };

  // 1. Core / standard subjects for this class level
  getSubjectsByClass(gradeClass).forEach(add);

  // 2. Add subjects from teachers in Master Guru
  if (teachersList && teachersList.length > 0) {
    teachersList.forEach((t) => {
      if (t.subjectTaught) {
        const raw = t.subjectTaught.trim();
        const matchesThisClass =
          !t.assignedRombel ||
          isClassMatching(t.assignedRombel, gradeClass) ||
          t.assignedRombel.toLowerCase().includes('semua') ||
          t.assignedRombel.toLowerCase().includes('qur') ||
          t.assignedRombel.toLowerCase().includes('bpi');

        if (matchesThisClass) {
          const clean = raw.replace(/\s*&\s*Wali\s*Kelas\s*\d+/gi, '').trim();
          if (clean && !clean.toLowerCase().includes('tata usaha') && !clean.toLowerCase().includes('humas') && !clean.toLowerCase().includes('sarana')) {
            add(clean);
          }
          if (raw && !raw.toLowerCase().includes('tata usaha') && !raw.toLowerCase().includes('humas') && !raw.toLowerCase().includes('sarana')) {
            add(raw);
          }
        }
      }
    });
  }

  return list;
};

export const INITIAL_PPDB_CONFIG: PPDBConfig = {
  academicYear: '2026/2027',
  contactWhatsapp: '0812-3344-5566',
  infoNote: 'Seluruh pembayaran pendaftaran & biaya pendidikan dilakukan melalui Rekening Resmi Yayasan / Kasir Keuangan Sekolah.',
  fees: [
    { id: 'fee-1', name: 'Infaq Formulir & Pendaftaran', amountText: 'Rp 250.000', notes: 'Sekali bayar saat pendaftaran' },
    { id: 'fee-2', name: 'Uang Pangkal & Pembangunan Kampus', amountText: 'Rp 6.500.000', notes: 'Dapat diangsur 3x selama semester ganjil' },
    { id: 'fee-3', name: 'SPP Bulanan (Termasuk Modul)', amountText: 'Rp 600.000 / Bulan', notes: 'Jatuh tempo tanggal 10 tiap bulan' },
    { id: 'fee-4', name: 'Paket Seragam Sekolah (5 Setel)', amountText: 'Rp 1.800.000', notes: 'Termasuk seragam batik, olahraga, pramuka' },
  ],
  scholarships: [
    { id: 'sch-1', title: 'Beasiswa Tahfidz Al-Qur’an', description: 'Bebas Uang Pangkal 100% untuk pendaftar hafiz/hafizah minimal 3 Juz.' },
    { id: 'sch-2', title: 'Beasiswa Prestasi Akademik', description: 'Subsidi SPP 50% bagi peraih Juara 1-3 Olimpiade Sains / OSN.' },
    { id: 'sch-3', title: 'Beasiswa Yatim & Dhuafa', description: 'Subsidi pendidikan penuh dari Dana Infaq ISAK 35 Yayasan.' },
  ],
};

// --- DATA SERAGAM SEKOLAH RESMI & JADWAL PEMAKAIAN ---
export const INITIAL_UNIFORMS: SchoolUniformItem[] = [
  {
    id: 'uniform-1',
    name: 'Seragam Merah Putih dan Rompi',
    category: 'Seragam Nasional & Upacara',
    scheduleDay: 'Senin',
    scheduleTimeNote: 'Pukul 06.45 - 14.30 WIB (Upacara Bendera)',
    description: 'Seragam resmi nasional standar Kementerian Pendidikan yang dipadukan dengan rompi rajut eksklusif warna merah marun berlogo yayasan/sekolah. Digunakan setiap hari Senin saat upacara bendera dan kegiatan formal sekolah.',
    components: [
      'Kemeja putih lengan pendek/panjang berbadge OSIS & bordir bendera',
      'Rompi rajut eksklusif warna merah marun berlogo sekolah',
      'Celana panjang (putra) / Rok rempel panjang (putri) merah marun',
      'Dasi merah berlogo bordir & Topi upacara merah-putih',
      'Ikat pinggang hitam berlogo sekolah',
      'Kaos kaki putih polos & Sepatu hitam dominan',
      'Jilbab putih polos (untuk siswi muslimah)',
    ],
    rules: [
      'Wajib mengenakan rompi, dasi, dan topi saat upacara bendera hari Senin.',
      'Kemeja dimasukkan ke dalam celana/rok secara rapi dan sopan.',
      'Sepatu wajib dominan hitam bertali/velcro dengan kaos kaki putih.',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80',
    priceEstimate: 'Rp 380.000 / Setel (Kemeja + Celana/Rok + Rompi + Topi + Dasi)',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL', 'Custom'],
    badge: 'Senin • Upacara Resmi',
    colorTheme: 'from-rose-600 via-red-500 to-rose-700',
  },
  {
    id: 'uniform-2',
    name: 'Seragam Kotak Ungu & Rompi',
    category: 'Seragam Identitas Khusus Yayasan',
    scheduleDay: 'Selasa',
    scheduleTimeNote: 'Pukul 07.00 - 14.30 WIB',
    description: 'Seragam ciri khas identitas sekolah dengan motif kotak-kotak ungu dipadukan rompi warna violet elegan. Memberikan kesan rapi, modern, santun, dan menanamkan rasa percaya diri bagi seluruh siswa.',
    components: [
      'Kemeja motif kotak-kotak kombinasi ungu muda dan putih lembut',
      'Rompi formal eksklusif warna ungu tua berbadge lambang sekolah',
      'Celana panjang (putra) / Rok rempel panjang (putri) warna navy/ungu',
      'Ikat pinggang berlogo sekolah',
      'Kaos kaki putih polos & Sepatu hitam',
      'Jilbab ungu senada (untuk siswi muslimah)',
    ],
    rules: [
      'Digunakan setiap hari Selasa pada kegiatan pembelajaran reguler di kelas & lab.',
      'Rompi harus terkancing rapi dengan atribut nama dada terpasang.',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1000&q=80',
    priceEstimate: 'Rp 365.000 / Setel (Kemeja Kotak + Rompi Ungu + Bawahan)',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL', 'Custom'],
    badge: 'Selasa • Ciri Khas Sekolah',
    colorTheme: 'from-purple-600 via-violet-600 to-purple-800',
  },
  {
    id: 'uniform-3',
    name: 'Seragam Batik Hijau',
    category: 'Seragam Budaya & Busana Muslimah',
    scheduleDay: 'Rabu',
    scheduleTimeNote: 'Pukul 07.00 - 14.30 WIB',
    description: 'Seragam kemeja batik bernuansa hijau zamrud (emerald green) bercorak kearifan lokal Nusantara yang dipadukan ornamen islami. Bahan katun primisima premium yang sejuk, nyaman, dan menyerap keringat.',
    components: [
      'Kemeja batik katun halus motif hijau zamrud berlogo sekolah',
      'Celana panjang putih/hijau tua (putra) / Rok panjang putih/hijau (putri)',
      'Jilbab hijau senada polos (untuk siswi muslimah)',
      'Kaos kaki putih & Sepatu hitam',
    ],
    rules: [
      'Digunakan setiap hari Rabu untuk menumbuhkan cinta budaya & adab islami.',
      'Dipadukan dengan bawahan bersih, rapi, dan sopan.',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?auto=format&fit=crop&w=1000&q=80',
    priceEstimate: 'Rp 320.000 / Setel (Kemeja Batik Katun + Bawahan + Jilbab)',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL', 'Custom'],
    badge: 'Rabu • Budaya & Karakter',
    colorTheme: 'from-emerald-600 via-green-600 to-teal-700',
  },
  {
    id: 'uniform-4',
    name: 'Seragam Pramuka',
    category: 'Seragam Kepanduan Gerakan Pramuka',
    scheduleDay: 'Jumat & Sabtu',
    scheduleTimeNote: 'Pukul 07.00 - 11.30 WIB (Jumat) / Ekskul Pramuka (Sabtu)',
    description: 'Seragam Gerakan Pramuka lengkap standar Kwartir Nasional untuk tingkatan Siaga (Kelas 1-3) dan Penggalang (Kelas 4-6). Menanamkan jiwa kemandirian, kedisiplinan, dan gotong royong.',
    components: [
      'Kemeja pramuka cokelat muda berlidah bahu dan saku berklep',
      'Celana panjang cokelat tua bersaku kompol (putra) / Rok kulot panjang (putri)',
      'Setangan leher / Kacu merah putih dengan ring dasi pramuka',
      'Tanda Pelantikan, Tanda Pandu Dunia (WOSM), Badge Gugus Depan',
      'Baret cokelat + tatop (putra) / Topi boni beludru (putri)',
      'Kaos kaki hitam bertuliskan pramuka & Sepatu hitam',
    ],
    rules: [
      'Digunakan setiap hari Jumat (kegiatan ibadah & kepanduan) dan Sabtu (ekskul).',
      'Atribut hasduk/kacu dan tanda pelantikan wajib terpasang lengkap.',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80',
    priceEstimate: 'Rp 350.000 / Setel (Kemeja + Bawahan + Kacu + Ring + Baret/Topi)',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL', 'Custom'],
    badge: 'Jumat & Sabtu • Pramuka',
    colorTheme: 'from-amber-800 via-amber-700 to-yellow-900',
  },
  {
    id: 'uniform-5',
    name: 'Seragam Olahraga',
    category: 'Seragam Olahraga & Kebugaran PJOK',
    scheduleDay: 'Kamis',
    scheduleTimeNote: 'Pukul 07.00 - 14.30 WIB (Sesi PJOK & Senam Pagi)',
    description: 'Setelan kaos olahraga berbahan dry-fit combed berteknologi sirkulasi udara optimal dan celana training elastis. Dirancang fleksibel, ringan, dan nyaman untuk aktivitas fisik aktif siswa.',
    components: [
      'Kaos olahraga dry-fit combed lembut kombinasi warna cerah berlogo',
      'Celana training panjang bergaris samping dan bertali pinggang fleksibel',
      'Sepatu olahraga kets / sneakers',
      'Kaos kaki olahraga putih',
      'Jilbab instan olahraga (siswi muslimah)',
    ],
    rules: [
      'Digunakan setiap hari Kamis saat jam PJOK, senam pagi, dan olahraga fisik.',
      'Siswa dianjurkan membawa handuk kecil dan botol minum pribadi.',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1526976668912-1a811878dd37?auto=format&fit=crop&w=1000&q=80',
    priceEstimate: 'Rp 290.000 / Setel (Kaos Dry-Fit + Training Panjang + Jilbab Olahraga)',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL', 'Custom'],
    badge: 'Kamis • Olahraga PJOK',
    colorTheme: 'from-blue-600 via-sky-600 to-indigo-700',
  },
];

export const INITIAL_UNIFORM_SCHEDULE: UniformScheduleDay[] = [
  {
    day: 'Senin',
    uniformName: 'Seragam Merah Putih dan Rompi',
    uniformType: 'Seragam Nasional Formal Upacara',
    colorTheme: 'bg-rose-50 border-rose-200 text-rose-950',
    badgeClass: 'bg-rose-600 text-white',
    accessories: ['Rompi Rajut Merah Marun', 'Dasi Bordir', 'Topi Upacara', 'Sepatu Hitam', 'Kaos Kaki Putih'],
    note: 'Wajib upacara bendera pagi pukul 06.45 WIB. Atribut lengkap.',
  },
  {
    day: 'Selasa',
    uniformName: 'Seragam Kotak Ungu & Rompi',
    uniformType: 'Seragam Khas Identitas Yayasan',
    colorTheme: 'bg-purple-50 border-purple-200 text-purple-950',
    badgeClass: 'bg-purple-600 text-white',
    accessories: ['Kemeja Motif Kotak Ungu', 'Rompi Violet Elegan', 'Bawahan Navy/Ungu', 'Sepatu Hitam'],
    note: 'Pembelajaran reguler di kelas & laboratorium sekolah.',
  },
  {
    day: 'Rabu',
    uniformName: 'Seragam Batik Hijau',
    uniformType: 'Busana Budaya & Karakter Rabbani',
    colorTheme: 'bg-emerald-50 border-emerald-200 text-emerald-950',
    badgeClass: 'bg-emerald-600 text-white',
    accessories: ['Kemeja Batik Hijau Katun Halus', 'Bawahan Putih/Hijau', 'Jilbab Hijau (Siswi)', 'Sepatu Hitam'],
    note: 'Penguatan karakter budaya lokal & penanaman adab islami.',
  },
  {
    day: 'Kamis',
    uniformName: 'Seragam Olahraga',
    uniformType: 'Setelan Olahraga & PJOK Dry-Fit',
    colorTheme: 'bg-sky-50 border-sky-200 text-sky-950',
    badgeClass: 'bg-sky-600 text-white',
    accessories: ['Kaos Olahraga Dry-Fit', 'Celana Training Elastis', 'Sepatu Kets Olahraga', 'Botol Minum'],
    note: 'Kegiatan Senam Kebugaran Jasmani dan praktik PJOK outdoor.',
  },
  {
    day: 'Jumat',
    uniformName: 'Seragam Pramuka',
    uniformType: 'Seragam Kepanduan Pramuka Nasional',
    colorTheme: 'bg-amber-50 border-amber-200 text-amber-950',
    badgeClass: 'bg-amber-800 text-white',
    accessories: ['Kemeja Pramuka Cokelat', 'Kacu Merah Putih + Ring', 'Baret/Topi Boni', 'Kaos Kaki Hitam'],
    note: 'Shalat Dhuha, pembacaan Surah Al-Kahfi & pembelajaran agama.',
  },
  {
    day: 'Sabtu',
    uniformName: 'Seragam Pramuka / Kaos Ekskul',
    uniformType: 'Pengembangan Diri & Ekskul Minat Bakat',
    colorTheme: 'bg-amber-50/70 border-amber-200 text-amber-950',
    badgeClass: 'bg-amber-700 text-white',
    accessories: ['Seragam Pramuka / Kaos Ekskul', 'Sepatu Bebas Sopan', 'Perlengkapan Minat Bakat'],
    note: 'Kegiatan Ekstrakurikuler (Tahfidz, Robotik, Panahan, Silat, Sanggar Seni).',
  },
];

// ============================================================================
// ARSIP KEHIDUPAN YAYASAN & SISWA (LIFETIME FOUNDATION & STUDENT ARCHIVES)
// Multi-Year Persistent Digital Archive Repository across All Categories
// ============================================================================
export const INITIAL_FOUNDATION_ARCHIVES: FoundationArchiveDocument[] = [
  // --- 1. DOKUMEN LEGALITAS, SK & TATA KELOLA YAYASAN ---
  {
    id: 'arc-leg-001',
    documentNumber: 'AKTA/NOT/2018/042',
    title: 'Akta Pendirian Yayasan Pendidikan Daarul Habibah (Notaris)',
    category: 'LEGALITAS_DAN_SK',
    calendarYear: 2018,
    issuerName: 'Notaris & PPAT Hj. Siti Aminah, S.H., M.Kn',
    issuedDate: '2018-04-16',
    fileType: 'PDF',
    fileName: 'Akta_Pendirian_Yayasan_Daarul_Habibah_2018.pdf',
    fileSizeBytes: 2450000,
    description: 'Akta Notaris pendirian badan hukum Yayasan Pendidikan Daarul Habibah, anggaran dasar, susunan dewan pembina dan pengurus pertama.',
    tags: ['Legalitas', 'Akta Notaris', 'Badan Hukum', 'Sejarah Pendirian', 'Dewan Pembina'],
    verifiedBy: 'Drs. H. M. Syukri, M.M (Pembina Yayasan)',
    verificationStatus: 'TERVERIFIKASI_RESMI',
    archivedAt: '2018-04-20 09:00:00',
    confidentialityLevel: 'INTERNAL_YAYASAN',
    metadata: { notaris: 'Hj. Siti Aminah, S.H., M.Kn', noAkta: '42/2018', kota: 'Kabupaten Tangerang' },
  },
  {
    id: 'arc-leg-002',
    documentNumber: 'AHU-0012948.AH.01.04.Tahun 2018',
    title: 'Surat Keputusan Menteri Hukum dan HAM RI (SK Kemenkumham)',
    category: 'LEGALITAS_DAN_SK',
    calendarYear: 2018,
    issuerName: 'Kementerian Hukum dan Hak Asasi Manusia Republik Indonesia',
    issuedDate: '2018-05-02',
    fileType: 'PDF',
    fileName: 'SK_Kemenkumham_Yayasan_Daarul_Habibah_2018.pdf',
    fileSizeBytes: 1850000,
    description: 'Pengesahan Pendirian Badan Hukum Yayasan Pendidikan Daarul Habibah dengan status resmi terdaftar di Ditjen AHU Kemenkumham RI.',
    tags: ['Kemenkumham', 'SK AHU', 'Legalitas Resmi', 'Pemerintah RI'],
    verifiedBy: 'H. Ahmad Subagja, S.H (Sekretaris Yayasan)',
    verificationStatus: 'TERVERIFIKASI_RESMI',
    archivedAt: '2018-05-05 10:30:00',
    confidentialityLevel: 'PUBLIK',
    metadata: { skNumber: 'AHU-0012948.AH.01.04.Tahun 2018', tanggalPengesahan: '02 Mei 2018' },
  },
  {
    id: 'arc-leg-003',
    documentNumber: '421.2/089-Disdik/2019',
    title: 'Izin Operasional Penyelenggaraan Satuan Pendidikan SDIT EL-FATAH',
    category: 'LEGALITAS_DAN_SK',
    calendarYear: 2019,
    issuerName: 'Dinas Pendidikan Kabupaten Tangerang, Banten',
    issuedDate: '2019-06-18',
    fileType: 'PDF',
    fileName: 'Izin_Operasional_SDIT_El_Fatah_Disdik.pdf',
    fileSizeBytes: 1420000,
    description: 'Surat Izin Operasional Sekolah Dasar Islam Terpadu EL-FATAH dari Dinas Pendidikan Kabupaten Tangerang, NPSN Resmi: 69981240.',
    tags: ['Izin Operasional', 'Dinas Pendidikan', 'NPSN', 'SDIT EL-FATAH', 'Izin Sekolah'],
    verifiedBy: 'Masykur Rohana, S.Sos (Kepala Sekolah)',
    verificationStatus: 'TERVERIFIKASI_RESMI',
    archivedAt: '2019-06-20 11:15:00',
    confidentialityLevel: 'PUBLIK',
    metadata: { npsn: '69981240', statusSekolah: 'Swasta Terakreditasi' },
  },
  {
    id: 'arc-leg-004',
    documentNumber: 'SK/YPDH/2026/001-SDM',
    title: 'SK Pengangkatan Dewan Guru & Tenaga Kependidikan Tahun Ajaran 2026/2027',
    category: 'LEGALITAS_DAN_SK',
    academicYear: '2026/2027',
    calendarYear: 2026,
    semester: 'Tahunan',
    issuerName: 'Ketua Yayasan Pendidikan Daarul Habibah',
    issuedDate: '2026-07-01',
    fileType: 'PDF',
    fileName: 'SK_Guru_dan_Staf_2026_2027.pdf',
    fileSizeBytes: 980000,
    description: 'Surat Keputusan Yayasan tentang penetapan Guru Kelas (Wali Kelas 1-6), Guru Bidang Studi, Staf Tata Usaha, dan Struktur Manajemen SDIT EL-FATAH.',
    tags: ['SK Yayasan', 'Penetapan Guru', 'SDM Yayasan', 'Wali Kelas', 'Tahun 2026/2027'],
    verifiedBy: 'H. Ahmad Dahlan, M.Ag (Ketua Yayasan)',
    verificationStatus: 'TERVERIFIKASI_RESMI',
    archivedAt: '2026-07-05 08:30:00',
    confidentialityLevel: 'INTERNAL_YAYASAN',
    metadata: { totalGuru: 12, masaBerlaku: '1 Tahun Ajaran' },
  },

  // --- 2. DOKUMEN E-RAPORT, LEGER & AKADEMIK SISWA MULTI-TAHUN ---
  {
    id: 'arc-rap-2026-ganjil',
    documentNumber: 'ARSIP/RAP/2026-2027/SEM-1',
    title: 'Kumpulan E-Raport Digital Resmi Seluruh Siswa (Semester Ganjil 2026/2027)',
    category: 'RAPORT_DAN_AKADEMIK',
    academicYear: '2026/2027',
    calendarYear: 2026,
    semester: 'Ganjil',
    gradeClass: 'Semua Rombel',
    issuerName: 'SDIT EL-FATAH & Wali Kelas 1-6',
    issuedDate: '2026-12-20',
    fileType: 'DIGITAL_RECORD',
    fileName: 'Kumpulan_Raport_Digital_2026_Ganjil.pdf',
    fileSizeBytes: 5600000,
    description: 'Master arsip e-raport digital Kurikulum Merdeka seluruh kelas (Kelas 1 s/d Kelas 6) semester ganjil tahun ajaran 2026/2027 dengan tanda tangan resmi.',
    tags: ['E-Raport', 'Kurikulum Merdeka', 'Kelas 1-6', 'Nilai Digital', 'Semester Ganjil 2026/2027'],
    verifiedBy: 'Masykur Rohana, S.Sos (Kepala Sekolah)',
    verificationStatus: 'TERVERIFIKASI_RESMI',
    archivedAt: '2026-12-21 15:00:00',
    confidentialityLevel: 'RAHASIA_SISWA',
    metadata: { totalSiswa: 18, ketuntasan: '100%', kurikulum: 'Kurikulum Merdeka' },
  },
  {
    id: 'arc-leg-2026-dkn',
    documentNumber: 'ARSIP/LEGER/2026-2027/DKN-01',
    title: 'Buku Leger Nilai & Daftar Kumpulan Nilai (DKN) Tahun Ajaran 2026/2027',
    category: 'RAPORT_DAN_AKADEMIK',
    academicYear: '2026/2027',
    calendarYear: 2026,
    semester: 'Ganjil',
    gradeClass: 'Semua Rombel',
    issuerName: 'SDIT EL-FATAH (Divisi Kurikulum)',
    issuedDate: '2026-12-22',
    fileType: 'EXCEL',
    fileName: 'Buku_Leger_DKN_2026_2027_Semester_Ganjil.xlsx',
    fileSizeBytes: 1250000,
    description: 'Rekapitulasi matriks nilai komprehensif, pemeringkatan, rerata nilai, dan capaian kompetensi per mata pelajaran Rombel Kelas 1 sampai 6.',
    tags: ['Leger Nilai', 'DKN', 'Matriks Nilai', 'Peringkat Siswa', 'Tahun 2026/2027'],
    verifiedBy: 'Masykur Rohana, S.Sos (Kepala Sekolah)',
    verificationStatus: 'TERVERIFIKASI_RESMI',
    archivedAt: '2026-12-23 10:00:00',
    confidentialityLevel: 'INTERNAL_YAYASAN',
    metadata: { totalMataPelajaran: 12, sistemSkoring: 'Skala 100' },
  },
  {
    id: 'arc-rap-2025-genap',
    documentNumber: 'ARSIP/RAP/2025-2026/SEM-2',
    title: 'Arsip E-Raport Siswa & Kenaikan Kelas (Semester Genap 2025/2026)',
    category: 'RAPORT_DAN_AKADEMIK',
    academicYear: '2025/2026',
    calendarYear: 2026,
    semester: 'Genap',
    gradeClass: 'Semua Rombel',
    issuerName: 'SDIT EL-FATAH Yayasan Daarul Habibah',
    issuedDate: '2026-06-20',
    fileType: 'PDF',
    fileName: 'Arsip_Raport_Kenaikan_Kelas_2025_2026.pdf',
    fileSizeBytes: 4800000,
    description: 'Arsip raport akhir tahun kenaikan kelas dan kelulusan angkatan V tahun ajaran 2025/2026, mencakup rekapitulasi nilai rapor dan ekstrakurikuler.',
    tags: ['Raport Kenaikan Kelas', 'Tahun 2025/2026', 'Kelulusan', 'Arsip Siswa'],
    verifiedBy: 'Masykur Rohana, S.Sos (Kepala Sekolah)',
    verificationStatus: 'TERVERIFIKASI_RESMI',
    archivedAt: '2026-06-25 14:00:00',
    confidentialityLevel: 'RAHASIA_SISWA',
    metadata: { statusKenaikan: '100% Naik Kelas / Lulus', tahunAjaran: '2025/2026' },
  },
  {
    id: 'arc-rap-2024-genap',
    documentNumber: 'ARSIP/RAP/2024-2025/SEM-2',
    title: 'Arsip E-Raport & Transkrip Siswa (Tahun Ajaran 2024/2025)',
    category: 'RAPORT_DAN_AKADEMIK',
    academicYear: '2024/2025',
    calendarYear: 2025,
    semester: 'Genap',
    gradeClass: 'Semua Rombel',
    issuerName: 'SDIT EL-FATAH',
    issuedDate: '2025-06-21',
    fileType: 'PDF',
    fileName: 'Arsip_Raport_Transkrip_2024_2025.pdf',
    fileSizeBytes: 4200000,
    description: 'Dokumentasi arsip nilai raport kurikulum merdeka dan kurikulum 2013 tahun ajaran 2024/2025 seluruh peserta didik SDIT EL-FATAH.',
    tags: ['Raport 2024/2025', 'Transkrip Nilai', 'Buku Induk', 'Histori Siswa'],
    verifiedBy: 'Masykur Rohana, S.Sos (Kepala Sekolah)',
    verificationStatus: 'TERVERIFIKASI_RESMI',
    archivedAt: '2025-06-25 09:30:00',
    confidentialityLevel: 'RAHASIA_SISWA',
    metadata: { tahunAjaran: '2024/2025' },
  },
  {
    id: 'arc-skl-2025',
    documentNumber: 'SKL/SDIT-EF/2025/038',
    title: 'Buku Induk Kelulusan & Surat Keterangan Lulus (SKL) Angkatan IV Tahun 2025',
    category: 'RAPORT_DAN_AKADEMIK',
    academicYear: '2024/2025',
    calendarYear: 2025,
    semester: 'Genap',
    gradeClass: 'Kelas 6',
    issuerName: 'Kepala Sekolah SDIT EL-FATAH',
    issuedDate: '2025-06-15',
    fileType: 'PDF',
    fileName: 'Buku_Induk_Kelulusan_Angkatan_IV_2025.pdf',
    fileSizeBytes: 3100000,
    description: 'Buku induk data kelulusan, nomor seri ijazah, rekap nilai ujian sekolah, dan riwayat tahfidz juz 30 wisudawan angkatan IV tahun 2025.',
    tags: ['SKL', 'Ijazah', 'Kelulusan', 'Buku Induk', 'Alumni', 'Tahun 2025'],
    verifiedBy: 'Masykur Rohana, S.Sos (Kepala Sekolah)',
    verificationStatus: 'TERVERIFIKASI_RESMI',
    archivedAt: '2025-06-18 11:00:00',
    confidentialityLevel: 'INTERNAL_YAYASAN',
    metadata: { jumlahLulusan: 28, rataRataNilaiUjian: 89.4 },
  },

  // --- 3. DOKUMEN KEUANGAN, AUDIT & LPJ TAHUNAN (ISAK 35 & SAK EMKM) ---
  {
    id: 'arc-fin-2025',
    documentNumber: 'LK-YPDH/2025/AUDIT-FINAL',
    title: 'Laporan Keuangan Tahunan Yayasan Tahun Buku 2025 (ISAK 35)',
    category: 'KEUANGAN_DAN_AUDIT',
    calendarYear: 2025,
    issuerName: 'Bendahara Umum Yayasan Pendidikan Daarul Habibah',
    issuedDate: '2026-01-15',
    fileType: 'PDF',
    fileName: 'Laporan_Keuangan_ISAK35_Tahun_2025_Final.pdf',
    fileSizeBytes: 3850000,
    description: 'Laporan Keuangan Entitas Nonlaba ISAK 35 lengkap: Laporan Posisi Keuangan (Neraca), Laporan Penghasilan Komprehensif, Arus Kas, Perubahan Aset Neto, dan Catatan atas Laporan Keuangan (CALK).',
    tags: ['Laporan Keuangan', 'ISAK 35', 'Tahun 2025', 'Audit Keuangan', 'Aset Neto', 'Neraca'],
    verifiedBy: 'Hj. Nurul Aini, S.E., M.Ak (Bendahara Yayasan)',
    verificationStatus: 'TERVERIFIKASI_RESMI',
    archivedAt: '2026-01-20 16:00:00',
    confidentialityLevel: 'INTERNAL_YAYASAN',
    metadata: { totalAset: 1850000000, surplusDefisit: 185000000, opini: 'Wajar Tanpa Pengecualian' },
  },
  {
    id: 'arc-fin-2024',
    documentNumber: 'LK-YPDH/2024/AUDIT-FINAL',
    title: 'Laporan Keuangan Tahunan Yayasan Tahun Buku 2024 (ISAK 35)',
    category: 'KEUANGAN_DAN_AUDIT',
    calendarYear: 2024,
    issuerName: 'Bendahara Umum Yayasan Pendidikan Daarul Habibah',
    issuedDate: '2025-01-18',
    fileType: 'PDF',
    fileName: 'Laporan_Keuangan_ISAK35_Tahun_2024.pdf',
    fileSizeBytes: 3400000,
    description: 'Laporan keuangan tahunan 2024 mencakup realisasi penerimaan infaq/donasi wakaf, operasional pendidikan, gaji guru, dan penyusutan aktiva tetap.',
    tags: ['Laporan Keuangan 2024', 'ISAK 35', 'Aset Neto', 'Laba Rugi Yayasan'],
    verifiedBy: 'Hj. Nurul Aini, S.E., M.Ak (Bendahara Yayasan)',
    verificationStatus: 'TERVERIFIKASI_RESMI',
    archivedAt: '2025-01-22 14:30:00',
    confidentialityLevel: 'INTERNAL_YAYASAN',
    metadata: { totalAset: 1620000000, surplusDefisit: 142000000 },
  },
  {
    id: 'arc-lpj-bos-2025',
    documentNumber: 'LPJ/BOS/2025-2026/REG',
    title: 'Buku Laporan Pertanggungjawaban (LPJ) Realisasi Dana BOS Reguler 2025/2026',
    category: 'KEUANGAN_DAN_AUDIT',
    academicYear: '2025/2026',
    calendarYear: 2025,
    semester: 'Tahunan',
    issuerName: 'Tim Manajemen BOS SDIT EL-FATAH',
    issuedDate: '2025-12-30',
    fileType: 'PDF',
    fileName: 'LPJ_Dana_BOS_Reguler_2025.pdf',
    fileSizeBytes: 2750000,
    description: 'Laporan pertanggungjawaban penggunaan dana Bantuan Operasional Sekolah (BOS) Tahap I & Tahap II sesuai juknis Kemendikbudristek dan sinkronisasi ARKAS.',
    tags: ['LPJ BOS', 'Dana BOS', 'ARKAS', 'Akuntabilitas', 'Kemendikbudristek'],
    verifiedBy: 'Masykur Rohana, S.Sos (Kepala Sekolah)',
    verificationStatus: 'TERVERIFIKASI_RESMI',
    archivedAt: '2026-01-05 10:15:00',
    confidentialityLevel: 'INTERNAL_YAYASAN',
    metadata: { totalRealisasiBos: 145000000, persentaseSerap: '100%' },
  },

  // --- 4. DOKUMEN KELEMBAGAAN, KURIKULUM & AKREDITASI ---
  {
    id: 'arc-akr-2023',
    documentNumber: '1857/BAN-SM/SK/2023',
    title: 'Sertifikat & SK Akreditasi Sekolah Nilai "A" (Unggul) BAN-S/M',
    category: 'KELEMBAGAAN_DAN_KURIKULUM',
    calendarYear: 2023,
    issuerName: 'Badan Akreditasi Nasional Sekolah/Madrasah (BAN-S/M)',
    issuedDate: '2023-11-28',
    fileType: 'PDF',
    fileName: 'Sertifikat_Akreditasi_A_SDIT_EL_FATAH.pdf',
    fileSizeBytes: 1950000,
    description: 'Sertifikat Penetapan Hasil Akreditasi Sekolah Dasar SDIT EL-FATAH dengan Predikat A (Unggul), Nilai 94. Berlaku 5 tahun (2023 - 2028).',
    tags: ['Akreditasi', 'BAN-S/M', 'Predikat A', 'Kualitas Pendidikan', 'Standar Nasional'],
    verifiedBy: 'Drs. H. M. Syukri, M.M (Pembina Yayasan)',
    verificationStatus: 'TERVERIFIKASI_RESMI',
    archivedAt: '2023-12-01 09:00:00',
    confidentialityLevel: 'PUBLIK',
    metadata: { peringkat: 'A (Unggul)', nilai: 94, masaBerlaku: '2023 - 2028' },
  },
  {
    id: 'arc-kosp-2026',
    documentNumber: 'KOSP/SDIT-EF/2026-2027',
    title: 'Kurikulum Operasional Satuan Pendidikan (KOSP) Tahun 2026/2027',
    category: 'KELEMBAGAAN_DAN_KURIKULUM',
    academicYear: '2026/2027',
    calendarYear: 2026,
    semester: 'Tahunan',
    issuerName: 'Tim Pengembang Kurikulum SDIT EL-FATAH',
    issuedDate: '2026-07-10',
    fileType: 'PDF',
    fileName: 'KOSP_Kurikulum_Merdeka_SDIT_El_Fatah_2026_2027.pdf',
    fileSizeBytes: 4100000,
    description: 'Dokumen KOSP terintegrasi Kurikulum Merdeka, Penguatan Profil Pelajar Pancasila & Rahmatan Lil Alamin, target hafalan Tahfidz Al-Qur’an Juz 30, dan program unggulan sains bilingual.',
    tags: ['KOSP', 'Kurikulum Merdeka', 'Profil Pelajar Pancasila', 'Tahfidz', 'Silabus'],
    verifiedBy: 'Masykur Rohana, S.Sos (Kepala Sekolah)',
    verificationStatus: 'TERVERIFIKASI_RESMI',
    archivedAt: '2026-07-15 13:00:00',
    confidentialityLevel: 'PUBLIK',
    metadata: { kurikulumUtama: 'Kurikulum Merdeka', kekhasan: 'Tahfidz & Karakter Islami' },
  },

  // --- 5. SEJARAH, MILESTONE & PRESTASI YAYASAN ---
  {
    id: 'arc-sej-001',
    documentNumber: 'BKP-DH/2018/HISTORI',
    title: 'Buku Kilas Balik & Sejarah Pendirian Yayasan Pendidikan Daarul Habibah',
    category: 'SEJARAH_DAN_PRESTASI',
    calendarYear: 2018,
    issuerName: 'Dewan Pendiri Yayasan Pendidikan Daarul Habibah',
    issuedDate: '2018-04-25',
    fileType: 'PDF',
    fileName: 'Buku_Sejarah_Pendirian_Daarul_Habibah.pdf',
    fileSizeBytes: 6200000,
    description: 'Naskah sejarah pendirian yayasan, niat wakaf tanah, perintis awal pendidikan islami terpadu, dokumentasi peletakan batu pertama, serta peta arah masa depan yayasan.',
    tags: ['Sejarah Yayasan', 'Pendiri', 'Wakaf Tanah', 'Milestone', 'Kilas Balik', 'Kehidupan Yayasan'],
    verifiedBy: 'Drs. H. M. Syukri, M.M & H. Ahmad Dahlan, M.Ag',
    verificationStatus: 'TERVERIFIKASI_RESMI',
    archivedAt: '2018-05-01 10:00:00',
    confidentialityLevel: 'PUBLIK',
    metadata: { luasTanahWakaf: '2.500 m2', tahunMulai: 2018, pendiriUtama: 'Keluarga Besar Pembina Yayasan' },
  },
  {
    id: 'arc-sej-002',
    documentNumber: 'PIAGAM/OSN-KAB/2026/014',
    title: 'Piagam Penghargaan Juara 1 Olimpiade Sains Nasional (OSN) Tingkat Kabupaten',
    category: 'SEJARAH_DAN_PRESTASI',
    academicYear: '2025/2026',
    calendarYear: 2026,
    issuerName: 'Pemerintah Kabupaten Tangerang (Dinas Pendidikan)',
    issuedDate: '2026-05-10',
    fileType: 'IMAGE',
    fileName: 'Piagam_Juara_1_OSN_Ahmad_Rizky.jpg',
    fileSizeBytes: 1540000,
    description: 'Piagam penghargaan atas prestasi Ahmad Rizky Pratama (Siswa Kelas 6 SDIT EL-FATAH) sebagai Juara 1 Matematika & Sains OSN Tingkat Kabupaten.',
    tags: ['Piagam Prestasi', 'OSN', 'Matematika', 'Juara 1', 'Prestasi Siswa', 'Tahun 2026'],
    verifiedBy: 'Masykur Rohana, S.Sos (Kepala Sekolah)',
    verificationStatus: 'TERVERIFIKASI_RESMI',
    archivedAt: '2026-05-12 14:00:00',
    confidentialityLevel: 'PUBLIK',
    metadata: { capaian: 'Juara 1 Tingkat Kabupaten', bidang: 'Matematika & Sains' },
  },
];





