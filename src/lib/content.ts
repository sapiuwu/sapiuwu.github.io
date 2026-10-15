import type { Experience, Lang, Localized, Project, SkillGroup, Stat } from "./types";

export const t = (text: Localized, lang: Lang) => text[lang];

export const NAME = "Wahyu Pratama";

export const nav = {
  about: { id: "Tentang", en: "About" },
  skills: { id: "Keahlian", en: "Skills" },
  projects: { id: "Proyek", en: "Projects" },
  experience: { id: "Pengalaman", en: "Experience" },
  contact: { id: "Kontak", en: "Contact" },
};

export const sideLabels = {
  engineer: { id: "Software Engineer", en: "Software Engineer" },
  analyst: { id: "Investment Analyst", en: "Investment Analyst" },
};

export const sideToggleHint = {
  id: "Ganti sisi untuk melihat identitas saya yang lain",
  en: "Switch sides to see my other identity",
};

export const hero: Record<
  "engineer" | "analyst",
  {
    greeting: { id: string; en: string };
    subtitle: { id: string; en: string };
    description: { id: string; en: string };
    ctaPrimary: { id: string; en: string };
    ctaSecondary: { id: string; en: string };
    stats: Stat[];
  }
> = {
  engineer: {
    greeting: { id: "Halo, saya", en: "Hi, I'm" },
    subtitle: { id: "Software Engineer", en: "Software Engineer" },
    description: {
      id: "Saya membangun aplikasi web yang cepat, terukur, dan mudah dipelihara. Fokus pada pengalaman pengguna dan kode yang bersih.",
      en: "I build fast, scalable, and maintainable web applications. Focused on user experience and clean code.",
    },
    ctaPrimary: { id: "Lihat Proyek", en: "View Projects" },
    ctaSecondary: { id: "Hubungi Saya", en: "Contact Me" },
    stats: [
      { value: "5+", label: { id: "Tahun Pengalaman", en: "Years Experience" } },
      { value: "30+", label: { id: "Proyek Selesai", en: "Projects Shipped" } },
      { value: "15+", label: { id: "Teknologi Dikuasai", en: "Technologies" } },
    ],
  },
  analyst: {
    greeting: { id: "Halo, saya", en: "Hi, I'm" },
    subtitle: { id: "Investment Analyst", en: "Investment Analyst" },
    description: {
      id: "Saya menganalisis fundamental perusahaan dan tren pasar untuk menghasilkan rekomendasi investasi yang terukur dan berbasis data.",
      en: "I analyze company fundamentals and market trends to deliver data-driven, measurable investment recommendations.",
    },
    ctaPrimary: { id: "Lihat Riset", en: "View Research" },
    ctaSecondary: { id: "Hubungi Saya", en: "Contact Me" },
    stats: [
      { value: "Rp 50M+", label: { id: "Aset Dianalisis", en: "Assets Analyzed" } },
      { value: "100+", label: { id: "Laporan Riset", en: "Research Reports" } },
      { value: "4", label: { id: "Sektor Fokus", en: "Focus Sectors" } },
    ],
  },
};

export const about: Record<
  "engineer" | "analyst",
  { title: string; paragraphs: { id: string; en: string }[] }
> = {
  engineer: {
    title: "Tentang Saya sebagai Software Engineer",
    paragraphs: [
      {
        id: "Sebagai software engineer, saya senang memecahkan masalah kompleks menjadi solusi yang sederhana dan elegan. Saya berpengalaman membangun aplikasi web end-to-end, dari perancangan arsitektur hingga deployment.",
        en: "As a software engineer, I love solving complex problems with simple, elegant solutions. I have experience building end-to-end web applications, from architecture design to deployment.",
      },
      {
        id: "Saya percaya bahwa kode yang baik adalah kode yang mudah dibaca oleh manusia. Saya mengutamakan kualitas, testing, dan kolaborasi tim dalam setiap proyek.",
        en: "I believe good code is code that humans can read easily. I prioritize quality, testing, and teamwork in every project.",
      },
    ],
  },
  analyst: {
    title: "Tentang Saya sebagai Investment Analyst",
    paragraphs: [
      {
        id: "Sebagai investment analyst, saya mendalami analisis fundamental dan kuantitatif untuk menilai nilai intrinsik sebuah perusahaan. Saya terbiasa menyusun model valuasi dan laporan riset mendalam.",
        en: "As an investment analyst, I dive deep into fundamental and quantitative analysis to assess a company's intrinsic value. I'm experienced in building valuation models and in-depth research reports.",
      },
      {
        id: "Saya mengambil keputusan berbasis data, bukan emosi. Setiap rekomendasi selalu didukung oleh analisis risiko, tren industri, dan potensi pertumbuhan jangka panjang.",
        en: "I make data-driven decisions, not emotional ones. Every recommendation is backed by risk analysis, industry trends, and long-term growth potential.",
      },
    ],
  },
};

export const skills: Record<"engineer" | "analyst", SkillGroup[]> = {
  engineer: [
    {
      title: { id: "Frontend", en: "Frontend" },
      items: [
        { name: "React / Next.js", level: 92 },
        { name: "TypeScript", level: 88 },
        { name: "Tailwind CSS", level: 90 },
        { name: "Framer Motion", level: 80 },
      ],
    },
    {
      title: { id: "Backend", en: "Backend" },
      items: [
        { name: "Node.js", level: 87 },
        { name: "PostgreSQL", level: 82 },
        { name: "REST / GraphQL API", level: 85 },
        { name: "Redis", level: 75 },
      ],
    },
    {
      title: { id: "DevOps & Tools", en: "DevOps & Tools" },
      items: [
        { name: "Docker", level: 80 },
        { name: "CI/CD (GitHub Actions)", level: 78 },
        { name: "AWS / Vercel", level: 76 },
        { name: "Git", level: 90 },
      ],
    },
  ],
  analyst: [
    {
      title: { id: "Analisis Fundamental", en: "Fundamental Analysis" },
      items: [
        { name: "Financial Modeling", level: 90 },
        { name: "DCF Valuation", level: 88 },
        { name: "Ratio Analysis", level: 92 },
        { name: "Industry Research", level: 85 },
      ],
    },
    {
      title: { id: "Analisis Kuantitatif", en: "Quantitative Analysis" },
      items: [
        { name: "Python (pandas, numpy)", level: 86 },
        { name: "Statistical Analysis", level: 82 },
        { name: "Risk Assessment", level: 84 },
        { name: "Excel / Financial Reporting", level: 93 },
      ],
    },
    {
      title: { id: "Pasar & Instrumen", en: "Markets & Instruments" },
      items: [
        { name: "Equity Research", level: 90 },
        { name: "Fixed Income", level: 80 },
        { name: "Portfolio Strategy", level: 83 },
        { name: "Bloomberg Terminal", level: 78 },
      ],
    },
  ],
};

export const projects: Record<"engineer" | "analyst", Project[]> = {
  engineer: [
    {
      title: { id: "Platform E-Commerce", en: "E-Commerce Platform" },
      description: {
        id: "Marketplace full-stack dengan payment gateway, manajemen inventaris, dan dashboard analitik real-time.",
        en: "Full-stack marketplace with payment gateway, inventory management, and real-time analytics dashboard.",
      },
      tags: ["Next.js", "PostgreSQL", "Stripe", "Redis"],
      link: "https://github.com/sapiuwu",
    },
    {
      title: { id: "Aplikasi Chat Real-time", en: "Real-time Chat App" },
      description: {
        id: "Aplikasi messaging dengan WebSocket, enkripsi end-to-end, dan dukungan multi-perangkat.",
        en: "Messaging app with WebSocket, end-to-end encryption, and multi-device support.",
      },
      tags: ["React", "Node.js", "Socket.io", "MongoDB"],
      link: "https://github.com/sapiuwu",
    },
    {
      title: { id: "Dashboard DevOps", en: "DevOps Dashboard" },
      description: {
        id: "Monitoring deployment pipeline dengan visualisasi metrik, log terpusat, dan notifikasi otomatis.",
        en: "Deployment pipeline monitoring with metric visualization, centralized logs, and automated alerts.",
      },
      tags: ["Next.js", "Docker", "Grafana", "GitHub Actions"],
      link: "https://github.com/sapiuwu",
    },
    {
      title: { id: "API Geolokasi", en: "Geolocation API" },
      description: {
        id: "REST API untuk pencarian lokasi dengan caching agresif dan response time di bawah 100ms.",
        en: "REST API for location search with aggressive caching and sub-100ms response time.",
      },
      tags: ["Node.js", "PostGIS", "Redis", "AWS"],
      link: "https://github.com/sapiuwu",
    },
  ],
  analyst: [
    {
      title: { id: "Riset Sektor Teknologi", en: "Technology Sector Research" },
      description: {
        id: "Analisis mendalam 10 emiten teknologi Indonesia dengan model DCF dan rekomendasi alokasi portofolio.",
        en: "In-depth analysis of 10 Indonesian tech issuers with DCF models and portfolio allocation recommendations.",
      },
      tags: ["DCF", "Equity Research", "Python"],
      link: "https://github.com/sapiuwu",
    },
    {
      title: { id: "Model Valuasi Consumer", en: "Consumer Valuation Model" },
      description: {
        id: "Model valuasi terintegrasi untuk sektor konsumer dengan skenario bull/base/bear dan sensitivitas variabel.",
        en: "Integrated valuation model for the consumer sector with bull/base/bear scenarios and variable sensitivity.",
      },
      tags: ["Financial Modeling", "Excel", "Scenario Analysis"],
      link: "https://github.com/sapiuwu",
    },
    {
      title: { id: "Strategi Rotasi Sektor", en: "Sector Rotation Strategy" },
      description: {
        id: "Strategi berbasis siklus ekonomi untuk rotasi antar sektor, diuji pada data historis 10 tahun.",
        en: "Economy-cycle-based strategy for sector rotation, backtested on 10 years of historical data.",
      },
      tags: ["Quantitative", "Backtesting", "Python"],
      link: "https://github.com/sapiuwu",
    },
    {
      title: { id: "Laporan Kinerja Portofolio", en: "Portfolio Performance Report" },
      description: {
        id: "Framework pelaporan bulanan dengan metrik Sharpe, drawdown, dan benchmarking terhadap indeks.",
        en: "Monthly reporting framework with Sharpe, drawdown metrics, and index benchmarking.",
      },
      tags: ["Risk Metrics", "Reporting", "Bloomberg"],
      link: "https://github.com/sapiuwu",
    },
  ],
};

export const experience: Record<"engineer" | "analyst", Experience[]> = {
  engineer: [
    {
      role: { id: "Senior Software Engineer", en: "Senior Software Engineer" },
      company: "Tech Nusantara",
      period: { id: "2023 - Sekarang", en: "2023 - Present" },
      description: {
        id: "Memimpin pengembangan platform SaaS yang melayani 50.000+ pengguna aktif bulanan.",
        en: "Led development of a SaaS platform serving 50,000+ monthly active users.",
      },
    },
    {
      role: { id: "Software Engineer", en: "Software Engineer" },
      company: "Digital Karya",
      period: { id: "2021 - 2023", en: "2021 - 2023" },
      description: {
        id: "Membangun dan memelihara microservices untuk sistem pembayaran internal.",
        en: "Built and maintained microservices for the internal payment system.",
      },
    },
    {
      role: { id: "Junior Web Developer", en: "Junior Web Developer" },
      company: "Studio Web Indonesia",
      period: { id: "2019 - 2021", en: "2019 - 2021" },
      description: {
        id: "Mengembangkan website client-side dan CMS custom untuk berbagai industri.",
        en: "Developed client websites and custom CMS for various industries.",
      },
    },
  ],
  analyst: [
    {
      role: { id: "Investment Analyst", en: "Investment Analyst" },
      company: "Capital Asset Management",
      period: { id: "2023 - Sekarang", en: "2023 - Present" },
      description: {
        id: "Menyusun rekomendasi investasi ekuitas dan mengelola riset sektor untuk tim portofolio.",
        en: "Produced equity investment recommendations and managed sector research for the portfolio team.",
      },
    },
    {
      role: { id: "Research Associate", en: "Research Associate" },
      company: "Bursa Sekuritas",
      period: { id: "2021 - 2023", en: "2021 - 2023" },
      description: {
        id: "Menerbitkan laporan riset mingguan dan membangun model valuasi untuk 30+ emiten.",
        en: "Published weekly research reports and built valuation models for 30+ issuers.",
      },
    },
    {
      role: { id: "Financial Analyst Intern", en: "Financial Analyst Intern" },
      company: "Prima Investama",
      period: { id: "2020 - 2021", en: "2020 - 2021" },
      description: {
        id: "Membantu analisis laporan keuangan dan penyusunan materi presentasi klien.",
        en: "Assisted with financial statement analysis and client presentation materials.",
      },
    },
  ],
};

export const contact = {
  title: { id: "Mari Berkolaborasi", en: "Let's Collaborate" },
  description: {
    id: "Terbuka untuk proyek, diskusi, atau peluang kerja sama. Kirim pesan dan saya akan membalas segera.",
    en: "Open to projects, discussions, or collaboration opportunities. Send a message and I'll get back to you soon.",
  },
  name: { id: "Nama", en: "Name" },
  email: { id: "Email", en: "Email" },
  message: { id: "Pesan", en: "Message" },
  submit: { id: "Kirim Pesan", en: "Send Message" },
  success: {
    id: "Terima kasih! Pesan Anda telah terkirim.",
    en: "Thank you! Your message has been sent.",
  },
  required: { id: "Harap isi semua kolom.", en: "Please fill in all fields." },
  invalidEmail: { id: "Format email tidak valid.", en: "Invalid email format." },
};

export const footer = {
  rights: { id: "Hak cipta dilindungi", en: "All rights reserved" },
  built: {
    id: "Dibangun dengan Next.js & Tailwind CSS",
    en: "Built with Next.js & Tailwind CSS",
  },
};
