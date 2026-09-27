export interface Program {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export interface Facility {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface Extracurricular {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface Achievement {
  id: string;
  title: string;
  category: "Akademik" | "Non-Akademik";
  level: "Sekolah" | "Kota" | "Provinsi" | "Nasional";
  year: number;
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover: string;
  date: string;
}

export interface AgendaItem {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate?: string;
}

export interface Teacher {
  id: string;
  name: string;
  role: string;
  subject?: string;
  image: string;
}

export interface GalleryItem {
  id: string;
  album: string;
  image: string;
  caption: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface Stats {
  santriCount: number;
  guruCount: number;
  tahunBerdiri: number;
  alumniCount: number;
}

export const dummyPrograms: Program[] = [
  {
    id: "1",
    name: "Tahfidz Al-Qur'an",
    slug: "tahfidz-alquran",
    description: "Program unggulan untuk menghafal Al-Qur'an dengan target 30 juz dalam waktu 3-6 tahun. Setiap santri mendapat bimbingan intensif dari ustadz tahfidz berpengalaman.",
    icon: "BookOpen",
  },
  {
    id: "2",
    name: "Pendidikan Formal",
    slug: "pendidikan-formal",
    description: "Kurikulum pendidikan formal jenjang MI, MTs, dan MA yang berstandar nasional, lengkap dengan Ujian Nasional dan sertifikasi.",
    icon: "GraduationCap",
  },
  {
    id: "3",
    name: "Bahasa Arab",
    slug: "bahasa-arab",
    description: "Pembelajaran bahasa Arab intensif meliputi nahwu, sharaf, dan maharah lughawiyah (keterampilan berbahasa) untuk mendukung pemahaman kitab kuning.",
    icon: "Languages",
  },
  {
    id: "4",
    name: "Bahasa Inggris",
    slug: "bahasa-inggris",
    description: "Program bahasa Inggris aktif dengan native speaker dan kurikulum komunikatif untuk mempersiapkan santri menghadapi era globalisasi.",
    icon: "Globe",
  },
  {
    id: "5",
    name: "Kajian Kitab Kuning",
    slug: "kajian-kitab-kuning",
    description: "Kajian kitab klasik seperti Fathul Mu'in, Taqrib, dan Tafsir Jalalain untuk membangun fondis keilmuan yang kuat.",
    icon: "ScrollText",
  },
  {
    id: "6",
    name: "Life Skills",
    slug: "life-skills",
    description: "Pelatihan keterampilan hidup seperti bertani, berkebun, memasak, dan kewirausahaan untuk mempersiapkan santri mandiri.",
    icon: "Wrench",
  },
];

export const dummyFacilities: Facility[] = [
  {
    id: "1",
    name: "Masjid Agung",
    description: "Masjid utama dengan kapasitas 300 jamaah, dilengkapi sound system dan perpustakaan kitab.",
    image: "/masjid.jpg",
  },
  {
    id: "2",
    name: "Asrama Putra",
    description: "Asrama nyaman dengan kapasitas 100 santri putra, kamar ber-AC, lemari, dan meja belajar.",
    image: "/asrama-putra.jpg",
  },
  {
    id: "3",
    name: "Asrama Putri",
    description: "Asrama khusus santri putri dengan keamanan 24 jam, fasilitas lengkap, dan ruang belajar.",
    image: "/asrama-putri.jpg",
  },
  {
    id: "4",
    name: "Ruang Kelas",
    description: "12 ruang kelas ber-AC dengan proyektor, whiteboard interaktif, dan koneksi internet.",
    image: "/ruang-kelas.jpg",
  },
  {
    id: "5",
    name: "Perpustakaan",
    description: "Perpustakaan dengan koleksi 5.000+ buku, majalah, dan akses e-book online.",
    image: "/perpustakaan.jpg",
  },
  {
    id: "6",
    name: "Lapangan Olahraga",
    description: "Lapangan multifungsi untuk futsal, basket, dan voli dengan standar nasional.",
    image: "/lapangan.jpg",
  },
  {
    id: "7",
    name: "Kantin",
    description: "Kantin bersih dengan menu sehat dan bergizi, diawasi oleh ahli gizi.",
    image: "/kantin.jpg",
  },
  {
    id: "8",
    name: "Laboratorium Komputer",
    description: "Lab komputer dengan 30 unit PC, internet cepat, dan software pembelajaran terbaru.",
    image: "/lab-komputer.jpg",
  },
];

export const dummyExtracurriculars: Extracurricular[] = [
  {
    id: "1",
    name: "Pramuka",
    description: "Kegiatan kepramukaan untuk melatih kedisiplinan, kerja sama, dan cinta alam.",
    image: "/pramuka.jpg",
  },
  {
    id: "2",
    name: "Pencak Silat",
    description: "Seni bela diri tradisional Indonesia untuk melatih fisik dan mental santri.",
    image: "/pencak-silat.jpg",
  },
  {
    id: "3",
    name: "Panahan",
    description: "Ekskul panahan yang mengajarkan fokus, ketenangan, dan kekuatan fisik.",
    image: "/panahan.jpg",
  },
  {
    id: "4",
    name: "Kaligrafi Arab",
    description: "Seni kaligrafi Islam untuk melatih kesabaran dan keindahan dalam menulis ayat-ayat suci.",
    image: "/kaligrafi.jpg",
  },
  {
    id: "5",
    name: "Nasyid",
    description: "Grup nasyid santri untuk mengembangkan bakat vokal dan kesenian Islami.",
    image: "/nasyid.jpg",
  },
  {
    id: "6",
    name: "Jurnalistik",
    description: "Ekskul jurnalistik untuk melatih menulis berita, fotografi, dan media sosial.",
    image: "/jurnalistik.jpg",
  },
  {
    id: "7",
    name: "Futsal",
    description: "Tim futsal santri yang rutin berlatih dan mengikuti turnamen antar pesantren.",
    image: "/futsal.jpg",
  },
  {
    id: "8",
    name: "English Club",
    description: "Klub bahasa Inggris untuk melatih speaking, debating, dan public speaking.",
    image: "/english-club.jpg",
  },
];

export const dummyAchievements: Achievement[] = [
  { id: "1", title: "Juara 1 MTQ Tingkat Kota Jakarta Selatan", category: "Non-Akademik", level: "Kota", year: 2025 },
  { id: "2", title: "Juara 2 Olimpiade Matematika SD Se-Jabodetabek", category: "Akademik", level: "Nasional", year: 2025 },
  { id: "3", title: "Juara Harapan 1 Festival Nasyid Nasional", category: "Non-Akademik", level: "Nasional", year: 2024 },
  { id: "4", title: "Juara 3 Olimpiade IPA SMP Tingkat Provinsi DKI", category: "Akademik", level: "Provinsi", year: 2024 },
  { id: "5", title: "Juara 1 Pencak Silat Tingkat Kota Jakarta Selatan", category: "Non-Akademik", level: "Kota", year: 2024 },
  { id: "6", title: "Juara 2 Lomba Kaligrafi Nasional", category: "Non-Akademik", level: "Nasional", year: 2023 },
  { id: "7", title: "Juara 1 Olimpiade Bahasa Arab Tingkat Provinsi DKI", category: "Akademik", level: "Provinsi", year: 2023 },
  { id: "8", title: "Juara 3 Debate Bahasa Inggris Tingkat Kota", category: "Akademik", level: "Kota", year: 2023 },
  { id: "9", title: "Juara 1 Pramuka Penggalang Tingkat Provinsi", category: "Non-Akademik", level: "Provinsi", year: 2022 },
  { id: "10", title: "Juara Harapan 2 Olimpiade Fisika SMA Se-Jabodetabek", category: "Akademik", level: "Nasional", year: 2022 },
];

export const dummyNews: NewsItem[] = [
  {
    id: "1",
    title: "Wisuda Tahfidz 30 Juz Angkatan ke-5 Tahun 2025",
    slug: "wisuda-tahfidz-30-juz-angkatan-ke-5",
    excerpt: "Sebanyak 25 santri berhasil menyelesaikan hafalan 30 juz Al-Qur'an dalam acara wisuda tahunan Pondok Pesantren Al Fauzan Nusantara.",
    content: "Alhamdulillah, pada hari Sabtu tanggal 15 Juni 2025, Pondok Pesantren Al Fauzan Nusantara menggelar acara Wisuda Tahfidz 30 Juz untuk angkatan ke-5. Sebanyak 25 santri putra dan putri berhasil menyelesaikan hafalan seluruh 30 juz Al-Qur'an setelah menjalani program intensif selama 4 tahun.\n\nAcara wisuda dihadiri oleh para wali santri, alumni, dan tokoh masyarakat sekitar. KH. Abdullah Fauzan, pimpinan pondok, memberikan sambutan dan nasihat kepada para wisudawan untuk terus istiqomah dalam menghafal dan mengamalkan Al-Qur'an.\n\nPara wisudawan juga menampilkan hataman Al-Qur'an secara kolektif yang menjadi puncak acara. Semoga menjadi generasi Qur'ani yang berakhlak mulia dan bermanfaat bagi umat.",
    cover: "/news/wisuda-tahfidz.jpg",
    date: "2025-06-15",
  },
  {
    id: "2",
    title: "Kunjungan Studi Banding dari Pesantren Al-Ihsan Bandung",
    slug: "kunjungan-studi-banding-al-ihsan-bandung",
    excerpt: "Tim pengurus dan ustadz dari Pesantren Al-Ihsan Bandung berkunjung untuk studi banding manajemen pondok dan program tahfidz.",
    content: "Pondok Pesantren Al Fauzan Nusantara menerima kunjungan studi banding dari Pesantren Al-Ihsan Bandung pada tanggal 10 Mei 2025. Delegasi yang terdiri dari 10 pengurus dan ustadz disambut hangat oleh pimpinan pondok.\n\nSelama kunjungan, delegasi mengamati langsung proses pembelajaran tahfidz, manajemen asrama, dan sistem evaluasi hafalan santri. Diskusi intensif juga dilakukan mengenai tantangan dan solusi dalam mengelola pondok pesantren modern.\n\nKunjungan ini diharapkan dapat memperkuat silaturahmi antar pesantren dan saling berbagi praktik terbaik dalam dunia pendidikan Islam.",
    cover: "/news/studi-banding.jpg",
    date: "2025-05-10",
  },
  {
    id: "3",
    title: "Santri Al Fauzan Raih Juara 1 MTQ Kota Jakarta Selatan",
    slug: "santri-juara-1-mtq-jakarta-selatan",
    excerpt: "Ahmad Fauzi, santri kelas 3 MTs, berhasil meraih juara 1 dalam Musabaqah Tilawatil Qur'an tingkat Kota Jakarta Selatan.",
    content: "Prestasi membanggakan kembali diraih oleh Pondok Pesantren Al Fauzan Nusantara. Ahmad Fauzi, santri kelas 3 MTs, berhasil meraih juara 1 dalam kategori Tilawah Remaja pada MTQ tingkat Kota Jakarta Selatan yang digelar di Balai Kota.\n\nAhmad Fauzi menampilkan bacaan surah Al-Mulk dengan tajwid yang sempurna dan suara yang merdu, memukau dewan juri dan penonton. Prestasi ini adalah hasil dari latihan rutin selama 6 bulan di bawah bimbingan Ustadz Hafiz Rahman.\n\nKepala Bidang Pendidikan menyampaikan apresiasi dan berharap prestasi ini menjadi motivasi bagi santri lain untuk terus meningkatkan kualitas bacaan Al-Qur'an mereka.",
    cover: "/news/juara-mtq.jpg",
    date: "2025-04-22",
  },
  {
    id: "4",
    title: "Pembukaan Program Kajian Kitab Kuning Intensif Ramadhan",
    slug: "kajian-kitab-kuning-ramadhan-2025",
    excerpt: "Selama bulan Ramadhan, pondok mengadakan program kajian kitab kuning intensif dengan tema Fiqih Ibadah.",
    content: "Menyambut bulan Ramadhan 1446 H, Pondok Pesantren Al Fauzan Nusantara mengadakan Program Kajian Kitab Kuning Intensif dengan tema Fiqih Ibadah. Program ini diikuti oleh 80 santri tingkat MTs dan MA.\n\nKitab yang dikaji adalah Fathul Mu'in jilid 1 yang membahas tentang thaharah dan shalat. Kajian dilaksanakan setelah shalat Ashar hingga maghrib, dipandu oleh KH. Abdullah Fauzan dan beberapa ustadz senior.\n\nSelain kajian kitab, program ini juga dilengkapi dengan praktik ibadah langsung dan diskusi kelompok. Program diharapkan dapat memperkuat pemahaman fiqih santri dan menambah keberkahan di bulan suci Ramadhan.",
    cover: "/news/kajian-ramadhan.jpg",
    date: "2025-03-01",
  },
  {
    id: "5",
    title: "Peresmian Gedung Baru Asrama Putri",
    slug: "peresmian-gedung-asrama-putri-baru",
    excerpt: "Gedung asrama putri baru dengan kapasitas 75 santri diresmikan oleh KH. Abdullah Fauzan pada awal tahun 2025.",
    content: "Alhamdulillah, pada tanggal 15 Januari 2025, Pondok Pesantren Al Fauzan Nusantara meresmikan gedung asrama putri baru. Gedung berlantai 3 ini memiliki kapasitas 75 santri putri dengan fasilitas kamar ber-AC, lemari pribadi, meja belajar, dan ruang musholla di setiap lantai.\n\nPeresmian dihadiri oleh para wali santri, alumni, dan perwakilan dari Dinas Pendidikan Kota Jakarta Selatan. KH. Abdullah Fauzan menyampaikan bahwa pembangunan asrama ini adalah bagian dari komitmen pondok untuk menyediakan fasilitas terbaik bagi santri putri.\n\nDengan adanya gedung baru ini, diharapkan jumlah santri putri dapat bertambah dan kualitas pembinaan dapat lebih optimal.",
    cover: "/news/asrama-putri-baru.jpg",
    date: "2025-01-15",
  },
  {
    id: "6",
    title: "Lomba Internal Tahfidz Antar Kelas",
    slug: "lomba-internal-tahfidz-antar-kelas",
    excerpt: "Lomba tahfidz antar kelas diadakan rutin setiap semester untuk memotivasi santri dalam menghafal Al-Qur'an.",
    content: "Setiap semester, Pondok Pesantren Al Fauzan Nusantara mengadakan Lomba Internal Tahfidz Antar Kelas. Lomba ini diikuti oleh seluruh santri dari kelas MI hingga MA.\n\nKategori lomba meliputi hafalan juz 30, hafalan 5 juz terakhir, dan hafalan surat-surat pilihan. Dewan juri terdiri dari ustadz tahfidz dan qori internasional.\n\nPemenang lomba mendapatkan hadiah buku, trophy, dan beasiswa. Kegiatan ini terbukti efektif dalam meningkatkan semangat menghafal santri dan menciptakan suasana kompetisi yang sehat.",
    cover: "/news/lomba-tahfidz.jpg",
    date: "2024-12-10",
  },
];

export const dummyAgenda: AgendaItem[] = [
  {
    id: "1",
    title: "Pengajian Akbar Maulid Nabi Muhammad SAW",
    description: "Pengajian akbar dalam rangka peringatan Maulid Nabi Muhammad SAW dengan pembicara KH. Abdullah Fauzan.",
    location: "Masjid Agung Al Fauzan",
    startDate: "2025-09-28",
    endDate: "2025-09-28",
  },
  {
    id: "2",
    title: "Wisuda Tahfidz 30 Juz Angkatan ke-6",
    description: "Acara wisuda bagi santri yang telah menyelesaikan hafalan 30 juz Al-Qur'an.",
    location: "Aula Utama Al Fauzan",
    startDate: "2025-11-15",
    endDate: "2025-11-15",
  },
  {
    id: "3",
    title: "Lomba Antar Pondok Pesantren Se-Jakarta",
    description: "Lomba MTQ, pidato bahasa Arab, dan pidato bahasa Inggris antar pondok pesantren se-Jakarta.",
    location: "Lapangan Al Fauzan",
    startDate: "2025-10-20",
    endDate: "2025-10-22",
  },
  {
    id: "4",
    title: "Rapat Wali Santri Semester Ganjil",
    description: "Pertemuan wali santri dengan pimpinan pondok untuk memb perkembangan akademik dan non-akademik santri.",
    location: "Ruang Rapat Utama",
    startDate: "2025-10-05",
    endDate: "2025-10-05",
  },
  {
    id: "5",
    title: "Libur Pondok Akhir Tahun",
    description: "Libur akhir tahun ajaran bagi seluruh santri untuk pulang ke keluarga masing-masing.",
    location: "Pondok Pesantren Al Fauzan",
    startDate: "2025-12-20",
    endDate: "2026-01-05",
  },
  {
    id: "6",
    title: "Bakti Sosial ke Panti Asuhan",
    description: "Kegiatan bakti sosial santri ke panti asuhan sekitar Jagakarsa.",
    location: "Panti Asuhan Al-Hidayah, Jagakarsa",
    startDate: "2025-09-15",
    endDate: "2025-09-15",
  },
];

export const dummyTeachers: Teacher[] = [
  { id: "1", name: "KH. Abdullah Fauzan", role: "Pimpinan Pondok", subject: "Aqidah dan Fiqih", image: "/guru/kh-abdullah.jpg" },
  { id: "2", name: "Ustadz Hafiz Rahman", role: "Kepala Bidang Tahfidz", subject: "Tahfidz Al-Qur'an", image: "/guru/ust-hafiz.jpg" },
  { id: "3", name: "Ustadzah Aminah S.Pd", role: "Guru Matematika", subject: "Matematika", image: "/guru/ust-aminah.jpg" },
  { id: "4", name: "Ustadz Budi Santoso", role: "Guru Bahasa Arab", subject: "Bahasa Arab", image: "/guru/ust-budi.jpg" },
  { id: "5", name: "Ustadzah Fitriani S.Pd", role: "Guru Bahasa Inggris", subject: "Bahasa Inggris", image: "/guru/ust-fitriani.jpg" },
  { id: "6", name: "Ustadz Dedi Kurniawan", role: "Guru Fisika", subject: "Fisika", image: "/guru/ust-dedi.jpg" },
  { id: "7", name: "Ustadzah Nurul Hidayah", role: "Guru Biologi", subject: "Biologi", image: "/guru/ust-nurul.jpg" },
  { id: "8", name: "Ustadz Imam Syafii", role: "Guru Sejarah", subject: "Sejarah Islam", image: "/guru/ust-imam.jpg" },
  { id: "9", name: "Ustadzah Siti Khadijah", role: "Kepala Bidang Kesantrian Putri", subject: "Adab dan Akhlak", image: "/guru/ust-khadijah.jpg" },
  { id: "10", name: "Ustadz Ahmad Fauzi", role: "Guru Olahraga", subject: "Pencak Silat", image: "/guru/ust-ahmad.jpg" },
];

export const dummyGallery: GalleryItem[] = [
  { id: "1", album: "Kegiatan Belajar", image: "/gallery/belajar-1.jpg", caption: "Santri sedang mengaji di kelas" },
  { id: "2", album: "Kegiatan Belajar", image: "/gallery/belajar-2.jpg", caption: "Kajian kitab kuning bersama KH. Abdullah" },
  { id: "3", album: "Kegiatan Belajar", image: "/gallery/belajar-3.jpg", caption: "Praktik bahasa Arab di kelas" },
  { id: "4", album: "Kegiatan Belajar", image: "/gallery/belajar-4.jpg", caption: "Belajar komputer dan digital literacy" },
  { id: "5", album: "Wisuda Tahfidz", image: "/gallery/wisuda-1.jpg", caption: "Wisuda tahfidz angkatan ke-5" },
  { id: "6", album: "Wisuda Tahfidz", image: "/gallery/wisuda-2.jpg", caption: "Penyerahan sertifikat hafalan" },
  { id: "7", album: "Wisuda Tahfidz", image: "/gallery/wisuda-3.jpg", caption: "Foto bersama para wisudawan" },
  { id: "8", album: "Wisuda Tahfidz", image: "/gallery/wisuda-4.jpg", caption: "Hataman Al-Qur'an oleh para wisudawan" },
  { id: "9", album: "Olahraga", image: "/gallery/olahraga-1.jpg", caption: "Tim futsal Al Fauzan" },
  { id: "10", album: "Olahraga", image: "/gallery/olahraga-2.jpg", caption: "Latihan pencak silat" },
  { id: "11", album: "Olahraga", image: "/gallery/olahraga-3.jpg", caption: "Kegiatan pramuka di lapangan" },
  { id: "12", album: "Olahraga", image: "/gallery/olahraga-4.jpg", caption: "Latihan panahan" },
  { id: "13", album: "Kegiatan Harian", image: "/gallery/harian-1.jpg", caption: "Shalat berjamaah di masjid" },
  { id: "14", album: "Kegiatan Harian", image: "/gallery/harian-2.jpg", caption: "Makan bersama di kantin" },
  { id: "15", album: "Kegiatan Harian", image: "/gallery/harian-3.jpg", caption: "Bersih-bersih asrama" },
  { id: "16", album: "Kegiatan Harian", image: "/gallery/harian-4.jpg", caption: "Belajar di perpustakaan" },
];

export const dummyFaqs: FaqItem[] = [
  {
    id: "1",
    question: "Apa saja persyaratan masuk Pondok Pesantren Al Fauzan Nusantara?",
    answer: "Persyaratan masuk meliputi: (1) Mengisi formulir pendaftaran online atau offline, (2) Fotokopi akta kelahiran dan kartu keluarga, (3) Fotokopi raport 2 semester terakhir, (4) Surat keterangan sehat dari dokter, (5) Pas foto 3x4 sebanyak 4 lembar, (6) Wawancara dengan pimpinan pondok. Usia minimal 7 tahun untuk jenjang MI dan 12 tahun untuk jenjang MTs.",
  },
  {
    id: "2",
    question: "Berapa biaya pendaftaran dan SPP per bulan?",
    answer: "Biaya pendaftaran (PSB) sebesar Rp 2.500.000 yang mencakup seragam, perlengkapan asrama, dan buku pelajaran. SPP per bulan bervariasi tergantung jenjang: MI Rp 750.000, MTs Rp 850.000, dan MA Rp 950.000. Biaya sudah termasuk makan 3 kali sehari, asrama, dan kegiatan ekstrakurikuler. Terdapat program beasiswa bagi santri berprestasi dan kurang mampu.",
  },
  {
    id: "3",
    question: "Bagaimana jadwal harian santri di pondok?",
    answer: "Jadwal harian santri dimulai pukul 04.00 dengan bangun pagi dan shalat tahajud, dilanjutkan tadarus Al-Qur'an. Shalat subuh berjamaah pukul 05.00, sarjam (sarapan dan mengaji) pukul 06.00. Kegiatan belajar formal berlangsung pukul 07.30-12.00. Istirahat dan shalat dzuhur pukul 12.00-13.00. Kegiatan sore meliputi tahfidz, ekstrakurikuler, dan kajian kitab pukul 14.00-17.30. Shalat maghrib dan isya berjamaah, dilanjutkan dengan muroja'ah dan istirahat malam.",
  },
  {
    id: "4",
    question: "Apakah santri diperbolehkan pulang ke rumah?",
    answer: "Santri diperbolehkan pulang ke rumah pada akhir pekan (Sabtu sore hingga Minggu sore) untuk jenjang MI dan MTs. Untuk jenjang MA, santri boleh pulang setiap dua minggu sekali. Selama libur semester dan libur Lebaran, seluruh santri wajib pulang ke rumah. Santri juga diperbolehkan menerima kunjungan keluarga setiap hari Minggu pukul 08.00-16.00.",
  },
  {
    id: "5",
    question: "Kurikulum apa yang dipakai di pesantren ini?",
    answer: "Pesantren menggabungkan kurikulum Diknas (K-13 dan Merdeka Belajar) untuk pendidikan formal dan kurikulum pesantren salaf untuk keagamaan. Mata pelajaran keagamaan meliputi: Tahfidz Al-Qur'an, Tajwid, Nahwu, Sharaf, Fiqih, Aqidah, Akhlak, Sejarah Islam, dan Bahasa Arab. Mata pelajaran umum meliputi: Matematika, IPA, IPS, B. Indonesia, B. Inggris, dan PKn.",
  },
  {
    id: "6",
    question: "Apakah ada program beasiswa?",
    answer: "Ya, terdapat beberapa program beasiswa: (1) Beasiswa prestasi untuk santri dengan nilai raport minimal 85 dan hafalan minimal 5 juz, (2) Beasiswa Yatim/Dhuafa untuk santri yatim piatu atau dari keluarga kurang mampu, (3) Beasiswa Tahfidz untuk santri dengan hafalan cepat dan mutqin. Pendaftaran beasiswa dibuka setiap awal tahun ajaran dengan mengajukan surat permohonan dan dokumen pendukung.",
  },
  {
    id: "7",
    question: "Fasilitas apa saja yang tersedia untuk santri?",
    answer: "Fasilitas yang tersedia meliputi: Masjid agung, asrama putra dan putri ber-AC, ruang kelas dengan proyektor, perpustakaan dengan 5.000+ koleksi, laboratorium komputer, lapangan olahraga multifungsi, kantin dengan menu sehat, kamar mandi dalam, laundry, kantor pos mini, dan klinik kesehatan sederhana. Seluruh area pondok terkoneksi WiFi untuk keperluan pembelajaran.",
  },
  {
    id: "8",
    question: "Bagaimana sistem keamanan dan pengawasan santri?",
    answer: "Keamanan pondok dijaga 24 jam oleh petugas keamanan. Asrama putra dan putri dipisah dengan area yang jelas dan diawasi oleh musyrif/musyrifah. Setiap santri memiliki kartu identitas yang wajib dipakai. Orang tua dapat menghubungi musyrif/musyrifah kamar setiap hari untuk menanyakan kondisi anak. Terdapat juga sistem laporan harian via aplikasi WhatsApp grup.",
  },
  {
    id: "9",
    question: "Apa saja ekstrakurikuler yang tersedia?",
    answer: "Ekstrakurikuler yang tersedia meliputi: Pramuka, Pencak Silat, Panahan, Kaligrafi Arab, Nasyid, Jurnalistik, Futsal, English Club, Robotik, dan Kewirausahaan. Setiap santri wajib mengikuti minimal 2 ekstrakurikuler. Kegiatan ekstrakurikuler dilaksanakan 3 kali seminggu pada sore hari.",
  },
  {
    id: "10",
    question: "Di mana lokasi Pondok Pesantren Al Fauzan Nusantara?",
    answer: "Pondok Pesantren Al Fauzan Nusantara beralamat di Jl. Gintung, Tanjung Barat, Jagakarsa, Jakarta Selatan 12530. Lokasi mudah dijangkau dengan kendaraan umum (angkot dan bus TransJakarta). Dari Stasiun Tanjung Barat jaraknya sekitar 1,5 km. Untuk info lebih lanjut dan arah jalan, silakan hubungi kami di telepon (021) 786-1234 atau WhatsApp 0812-3456-7890.",
  },
];

export const dummyStats: Stats = {
  santriCount: 150,
  guruCount: 25,
  tahunBerdiri: 2015,
  alumniCount: 500,
};
