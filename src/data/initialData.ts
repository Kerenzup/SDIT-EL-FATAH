import { Account, FixedAsset, FoundationBoard, FoundationProfile, JournalEntry, OrgStructureMember, PPDBConfig, Student, Supplier, Teacher, WebsiteLayoutConfig } from '../types';
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
    name: 'Dr. H. Bambang Widjaja, M.Pd',
    position: 'Kepala Sekolah',
    category: 'SEKOLAH',
    nipOrNipy: 'NIPY. 1985031201',
    phone: '0813-7777-8888',
    email: 'bambang.widjaja@daarulhabibah.sch.id',
    photoUrl: LOCAL_IMAGES.kepalaSekolah,
    order: 5,
  },
  {
    id: 'org-6',
    name: 'Hj. Fatimah Zahra, S.Pd',
    position: 'Wakasek Kurikulum & Wali Kelas 6',
    category: 'SEKOLAH',
    nipOrNipy: 'NIPY. 1990041502',
    phone: '0813-9999-0000',
    email: 'fatimah.zahra@daarulhabibah.sch.id',
    photoUrl: LOCAL_IMAGES.guruWanita,
    order: 6,
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
  headmasterName: 'Dr. H. Bambang Widjaja, M.Pd',
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
    proposedBy: 'Dr. H. Bambang Widjaja, M.Pd (Kepala Sekolah)',
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
    proposedBy: 'Dr. H. Bambang Widjaja, M.Pd (Kepala Sekolah)',
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
    proposedBy: 'Dr. H. Bambang Widjaja, M.Pd (Kepala Sekolah)',
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
  headmasterName: 'Dr. H. Bambang Widjaja, M.Pd',
  headmasterTitle: 'Kepala Sekolah SD Daarul Habibah',
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

// --- INITIAL E-RAPORT DATA (Kelas 1 - Kelas 6) ---
export const INITIAL_E_RAPORTS = [
  {
    id: 'rap-1',
    studentId: 'std-1',
    studentName: 'Ahmad Rizky Pratama',
    nisn: '20240101',
    gradeClass: 'Kelas 6',
    academicYear: '2026/2027 Semester Ganjil',
    parentName: 'Bpk. H. Hendra Pratama',
    teacherName: 'Hj. Fatimah Zahra, S.Pd',
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
    nisn: '20240102',
    gradeClass: 'Kelas 5',
    academicYear: '2026/2027 Semester Ganjil',
    parentName: 'Bpk. Dr. H. Faisal Rahman',
    teacherName: 'Rina Kartika, S.Si',
    grades: [
      { subject: 'Tahfidz', score: 96, letterGrade: 'A' as const, notes: 'Tartil membaca Al-Qur’an dan rajin salat Dhuha berjemaah.' },
      { subject: 'MTK 5', score: 85, letterGrade: 'B' as const, notes: 'Cukup mahir dalam perkalian dan pembagian bersusun.' },
      { subject: 'IPAS 5', score: 90, letterGrade: 'A' as const, notes: 'Sangat antusias saat praktikum sains laboratorium.' },
      { subject: 'B.Indo 5', score: 91, letterGrade: 'A' as const, notes: 'Kosa kata sangat kaya dan aktif menulis puisi.' },
      { subject: 'PPKn 5', score: 89, letterGrade: 'A' as const, notes: 'Aktif dalam diskusi kelompok dan musyawarah Rombel.' },
      { subject: 'Seni 5', score: 94, letterGrade: 'A' as const, notes: 'Hasil karya seni kriya dan menggambar sangat estetik.' },
      { subject: 'B.Inggris 5', score: 88, letterGrade: 'A' as const, notes: 'Mampu merespon kosa kata dasar dengan baik.' },
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
    id: 'rap-3',
    studentId: 'std-3',
    studentName: 'Budi Santoso',
    nisn: '20240103',
    gradeClass: 'Kelas 4',
    academicYear: '2026/2027 Semester Ganjil',
    parentName: 'Bpk. Bambang Santoso',
    teacherName: 'Eko Prasetyo, S.Kom',
    grades: [
      { subject: 'Tahfidz', score: 82, letterGrade: 'B' as const, notes: 'Perlu bimbingan lebih dalam kelancaran makhraj huruf.' },
      { subject: 'MTK 4', score: 88, letterGrade: 'A' as const, notes: 'Sangat cepat dalam menjawab perkalian dasar.' },
      { subject: 'IPAS 4', score: 84, letterGrade: 'B' as const, notes: 'Aktif bertanya mengenai fenomena alam.' },
      { subject: 'B.Indo 4', score: 80, letterGrade: 'B' as const, notes: 'Mampu membaca dengan lancar, perlu kerapihan tulisan.' },
      { subject: 'PPKn 4', score: 85, letterGrade: 'B' as const, notes: 'Disiplin dan menghargai teman sekelas.' },
      { subject: 'Seni 4', score: 86, letterGrade: 'B' as const, notes: 'Kreatif membuat karya keterampilan tangan.' },
      { subject: 'B.Inggris 4', score: 81, letterGrade: 'B' as const, notes: 'Memahami kosa kata sederhana dalam kelas.' },
    ],
    attendance: { present: 76, sick: 3, permitted: 2, absent: 0 },
    extracurriculars: [
      { name: 'Futsal Sekolah', grade: 'A', notes: 'Kapten tim futsal Rombel Kelas 4.' },
    ],
    teacherNotes: 'Budi berbakat dalam olahraga dan matematika, tingkatkan kebiasaan merapikan alat tulis.',
    status: 'DITERBITKAN' as const,
    issuedDate: '2026-07-22',
  },
];

// --- INITIAL TEACHER JOURNALS FOR ROMBEL ---
export const INITIAL_TEACHER_JOURNALS = [
  {
    id: 'jrn-rom-1',
    teacherId: 'tch-2',
    teacherName: 'Hj. Fatimah Zahra, S.Pd',
    rombonganBelajar: 'Kelas 6',
    subject: 'Matematika Rombel 6',
    date: '2026-08-01',
    topic: 'Operasi Hitung Campuran Pecahan & Desimal',
    competencySummary: 'Menganalisis dan memecahkan soal cerita pecahan berbasis kehidupan sehari-hari.',
    teachingMaterial: 'Modul Digital SiPLah & Lembar Kerja Siswa Interaktif',
    status: 'DISETUJUI_KEPSEK' as const,
    principalFeedback: 'Materi sangat sesuai Kurikulum Merdeka. Lanjutkan penggunaan lab komputer.',
    approvedDate: '2026-08-01',
  },
  {
    id: 'jrn-rom-2',
    teacherId: 'tch-3',
    teacherName: 'Eko Prasetyo, S.Kom',
    rombonganBelajar: 'Kelas 4',
    subject: 'Informatika & Keterampilan Digital',
    date: '2026-08-02',
    topic: 'Pengenalan Pemrograman Visual Scratch Jr & Etika Internet',
    competencySummary: 'Membuat animasi sederhana dan memahami etika berkomunikasi online.',
    teachingMaterial: 'Perangkat Laptop Lab Komputer Sekolah',
    status: 'DISETUJUI_KEPSEK' as const,
    principalFeedback: 'Disetujui. Pastikan pengawasan penggunaan internet ketat.',
    approvedDate: '2026-08-02',
  },
  {
    id: 'jrn-rom-3',
    teacherId: 'tch-4',
    teacherName: 'Rina Kartika, S.Si',
    rombonganBelajar: 'Kelas 5',
    subject: 'IPAS (Ilmu Pengetahuan Alam & Sosial)',
    date: '2026-08-03',
    topic: 'Sistem Organ Pencernaan Manusia & Makanan Sehat',
    competencySummary: 'Mengidentifikasi organ pencernaan melalui alat peraga torso biologi.',
    teachingMaterial: 'Alat Peraga Torso Lab Biologi & Video Pembelajaran',
    status: 'DIUSULKAN_GURU' as const,
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

