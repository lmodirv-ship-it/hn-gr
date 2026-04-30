// Default seed translations. The Admin → Translations page can override
// any of these keys at runtime via the database.
export const SUPPORTED_LANGS = ["en", "ar"] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];

export const LANG_META: Record<Lang, { label: string; native: string; dir: "ltr" | "rtl"; flag: string }> = {
  en: { label: "English", native: "English", dir: "ltr", flag: "🇬🇧" },
  ar: { label: "Arabic", native: "العربية", dir: "rtl", flag: "🇸🇦" },
};

export const seedResources = {
  en: {
    translation: {
      // Navigation
      "nav.home": "Home",
      "nav.services": "Services",
      "nav.portfolio": "Portfolio",
      "nav.bookCall": "Book a call",
      "nav.signIn": "Sign in",
      "nav.dashboard": "Dashboard",
      "nav.adminPanel": "Admin panel",
      "nav.startProject": "Start your project",
      "nav.signOut": "Sign out",

      // Common CTAs
      "cta.contactBtn": "Contact us",
      "cta.applyNow": "Apply Now",
      "cta.readMore": "Read more",
      "cta.viewAll": "View all",
      "cta.learnMore": "Learn more",

      // Hero
      "hero.title": "Innovative Digital Solutions for your Business Future",
      "hero.subtitle":
        "We design, build, and ship modern web platforms — websites, e-commerce, and custom software.",
      "hero.primary": "Start your project",
      "hero.secondary": "View our work",

      // Sections
      "section.about": "About Us",
      "section.services": "Our Services",
      "section.joinUs": "Join Our Team",
      "section.blog": "Latest News & Insights",
      "section.contact": "Contact Us",

      // Footer
      "footer.tagline": "Smart software & web solutions",
      "footer.rights": "All rights reserved.",

      // Admin
      "admin.brand": "Control center",
      "admin.group.main": "Main",
      "admin.group.content": "Content",
      "admin.group.platform": "Platform",
      "admin.group.system": "System",
      "admin.nav.overview": "Overview",
      "admin.nav.leads": "Leads",
      "admin.nav.users": "Users",
      "admin.nav.analytics": "Analytics",
      "admin.nav.chat": "Chat logs",
      "admin.nav.services": "Services",
      "admin.nav.portfolio": "Portfolio",
      "admin.nav.blog": "Blog",
      "admin.nav.careers": "Careers",
      "admin.nav.owner": "Owner Center",
      "admin.nav.connectors": "API Connectors",
      "admin.nav.plugins": "Plugins",
      "admin.nav.monitoring": "Monitoring",
      "admin.nav.activity": "Activity",
      "admin.nav.security": "Security",
      "admin.nav.translations": "Translations",
      "admin.nav.settings": "Settings",
      "admin.topbar.viewSite": "View site",
      "admin.topbar.myDashboard": "My dashboard",

      // Language switcher
      "lang.switcher.label": "Language",
    },
  },
  ar: {
    translation: {
      "nav.home": "الرئيسية",
      "nav.services": "الخدمات",
      "nav.portfolio": "أعمالنا",
      "nav.bookCall": "احجز مكالمة",
      "nav.signIn": "تسجيل الدخول",
      "nav.dashboard": "لوحتي",
      "nav.adminPanel": "لوحة الإدارة",
      "nav.startProject": "ابدأ مشروعك",
      "nav.signOut": "تسجيل الخروج",

      "cta.contactBtn": "اتصل بنا",
      "cta.applyNow": "قدم الآن",
      "cta.readMore": "اقرأ المزيد",
      "cta.viewAll": "عرض الكل",
      "cta.learnMore": "اعرف المزيد",

      "hero.title": "حلول رقمية مبتكرة لمستقبل أعمالك",
      "hero.subtitle":
        "نصمم ونبني ونطلق منصات ويب حديثة — مواقع، متاجر إلكترونية، وبرمجيات مخصصة.",
      "hero.primary": "ابدأ مشروعك",
      "hero.secondary": "اطلع على أعمالنا",

      "section.about": "من نحن",
      "section.services": "خدماتنا",
      "section.joinUs": "انضم إلينا",
      "section.blog": "آخر الأخبار والمقالات",
      "section.contact": "تواصل معنا",

      "footer.tagline": "حلول برمجية وويب ذكية",
      "footer.rights": "جميع الحقوق محفوظة.",

      "admin.brand": "مركز التحكم",
      "admin.group.main": "الأساسيات",
      "admin.group.content": "المحتوى",
      "admin.group.platform": "المنصة",
      "admin.group.system": "النظام",
      "admin.nav.overview": "نظرة عامة",
      "admin.nav.leads": "العملاء المحتملون",
      "admin.nav.users": "المستخدمون",
      "admin.nav.analytics": "التحليلات",
      "admin.nav.chat": "سجل المحادثات",
      "admin.nav.services": "الخدمات",
      "admin.nav.portfolio": "الأعمال",
      "admin.nav.blog": "المدونة",
      "admin.nav.careers": "التوظيف",
      "admin.nav.connectors": "روابط API",
      "admin.nav.plugins": "الإضافات",
      "admin.nav.monitoring": "المراقبة",
      "admin.nav.activity": "سجل النشاط",
      "admin.nav.security": "الأمان",
      "admin.nav.translations": "الترجمات",
      "admin.nav.settings": "الإعدادات",
      "admin.topbar.viewSite": "عرض الموقع",
      "admin.topbar.myDashboard": "لوحتي",

      "lang.switcher.label": "اللغة",
    },
  },
} as const;
