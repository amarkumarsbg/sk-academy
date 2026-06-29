export const siteConfig = {
  name: "SK Academy",
  tagline: "Learn • Grow • Excel",
  description:
    "A premier institution in Kahalgaon, Bhagalpur, dedicated to nurturing young minds through quality education, holistic development, and strong values.",
  location: "Kahalgaon, Bhagalpur",
  establishedYear: 2010,
  email: "info@skacademy.net",
  admissionsEmail: "info@skacademy.net",
  phone: "+91 8809877381",
  whatsapp: "+918809877381",
  address: "SK Academy, Kahalgaon, Bhagalpur, Bihar - 813203, India",
  logo: "/logo.png?v=2",
  social: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
  },
};

export const publicNav = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Admissions", href: "/admissions" },
  { label: "Academics", href: "/academics" },
  { label: "Events", href: "/events" },
  { label: "News", href: "/news" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

/** Toggle admin modules without removing routes or backend APIs. */
export const adminFeatures = {
  attendance: false,
  fees: false,
  results: false,
} as const;

export type AdminNavItem = {
  label: string;
  href: string;
  icon: string;
  group?: string;
  hidden?: boolean;
};

export const adminNav: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: "LayoutDashboard", group: "Management" },
  { label: "Students", href: "/admin/students", icon: "GraduationCap", group: "Management" },
  { label: "Teachers", href: "/admin/teachers", icon: "Users", group: "Management" },
  { label: "Admissions", href: "/admin/admissions", icon: "ClipboardList", group: "Management" },
  { label: "Inbox", href: "/admin/inbox", icon: "Inbox", group: "Management" },
  {
    label: "Attendance",
    href: "/admin/attendance",
    icon: "CalendarCheck",
    group: "Academic",
    hidden: !adminFeatures.attendance,
  },
  {
    label: "Fees",
    href: "/admin/fees",
    icon: "IndianRupee",
    group: "Academic",
    hidden: !adminFeatures.fees,
  },
  { label: "Exams", href: "/admin/exams", icon: "FileText", group: "Academic" },
  {
    label: "Results",
    href: "/admin/results",
    icon: "Award",
    group: "Academic",
    hidden: !adminFeatures.results,
  },
  { label: "Notices", href: "/admin/notices", icon: "Bell", group: "Content" },
  { label: "Events", href: "/admin/events", icon: "Calendar", group: "Content" },
  { label: "Website CMS", href: "/admin/cms", icon: "Globe", group: "Content" },
  { label: "Staff Users", href: "/admin/users", icon: "UserCog", group: "System" },
  { label: "Audit Log", href: "/admin/audit-log", icon: "ScrollText", group: "System" },
  { label: "Settings", href: "/admin/settings", icon: "Settings", group: "System" },
];

export const visibleAdminNav = adminNav.filter((item) => !item.hidden);
