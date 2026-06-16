export const stats = [
  { label: "Students Enrolled", value: "2,450+", icon: "students" as const },
  { label: "Expert Teachers", value: "120+", icon: "teachers" as const },
  { label: "Years of Excellence", value: "16+", icon: "years" as const },
  { label: "Success Rate", value: "98%", icon: "success" as const },
];

export const newsItems = [
  {
    id: "1",
    title: "Annual Function 2026",
    excerpt: "Students and staff came together for a memorable annual celebration on stage.",
    date: "2026-06-10",
    category: "Event",
    image: "/images/annual-function.png",
  },
  {
    id: "2",
    title: "Mid-Term Exam Schedule Released",
    excerpt: "Exam dates and guidelines for Classes VI–XII are now available for parents and students.",
    date: "2026-06-14",
    category: "Notice",
    image: "/images/assembly-hall.png",
  },
  {
    id: "3",
    title: "Admissions Open for 2026–27",
    excerpt: "Applications are now being accepted for the new academic session. Limited seats available.",
    date: "2026-06-01",
    category: "Admission Update",
    image: "/images/ribbon-cutting.png",
  },
  {
    id: "4",
    title: "District Science Exhibition Winners",
    excerpt: "SK Academy students secured top positions at the district-level science fair.",
    date: "2026-05-15",
    category: "Achievement",
    image: "/images/school-event.png",
  },
  {
    id: "5",
    title: "Summer Vacation Announcement",
    excerpt: "School will remain closed during the summer break. Reopening details will follow.",
    date: "2026-05-20",
    category: "Announcement",
    image: "/images/celebration-event.png",
  },
  {
    id: "6",
    title: "Morning Assembly Highlights",
    excerpt: "Daily assembly continues to build discipline, values, and unity among our students.",
    date: "2026-05-28",
    category: "Event",
    image: "/images/assembly-prayer.png",
  },
];

export const events = [
  {
    id: "1",
    title: "Parent-Teacher Meeting",
    date: "2026-06-25",
    time: "10:00 AM - 2:00 PM",
    location: "Main Auditorium",
    type: "Meeting",
  },
  {
    id: "2",
    title: "Annual Day Celebration",
    date: "2026-07-15",
    time: "5:00 PM onwards",
    location: "School Ground",
    type: "Cultural",
  },
  {
    id: "3",
    title: "Mid-Term Examinations",
    date: "2026-07-20",
    time: "8:30 AM - 12:30 PM",
    location: "All Classrooms",
    type: "Academic",
  },
  {
    id: "4",
    title: "Career Guidance Workshop",
    date: "2026-08-05",
    time: "11:00 AM - 1:00 PM",
    location: "Seminar Hall",
    type: "Workshop",
  },
  {
    id: "5",
    title: "Inter-School Sports Meet",
    date: "2026-08-20",
    time: "8:00 AM onwards",
    location: "Sports Ground",
    type: "Sports",
  },
];

export const galleryAlbums = [
  {
    id: "1",
    title: "Annual Function",
    count: 3,
    cover: "/images/annual-function.png",
    photos: ["/images/annual-function.png", "/images/staff-group.png", "/images/school-event.png"],
    category: "Annual Function" as const,
  },
  {
    id: "2",
    title: "Morning Assembly",
    count: 2,
    cover: "/images/assembly-prayer.png",
    photos: ["/images/assembly-prayer.png", "/images/assembly-hall.png"],
    category: "Campus Life" as const,
  },
  {
    id: "3",
    title: "Celebrations",
    count: 4,
    cover: "/images/celebration-cake.png",
    photos: [
      "/images/celebration-cake.png",
      "/images/birthday-celebration.png",
      "/images/celebration-event.png",
      "/images/school-event.png",
    ],
    category: "Events" as const,
  },
  {
    id: "4",
    title: "Ceremonies",
    count: 1,
    cover: "/images/ribbon-cutting.png",
    photos: ["/images/ribbon-cutting.png"],
    category: "Achievements" as const,
  },
  {
    id: "5",
    title: "Staff & Events",
    count: 2,
    cover: "/images/staff-group.png",
    photos: ["/images/staff-group.png", "/images/annual-function.png"],
    category: "Events" as const,
  },
  {
    id: "6",
    title: "Campus Life",
    count: 2,
    cover: "/images/assembly-hall.png",
    photos: ["/images/assembly-hall.png", "/images/assembly-prayer.png"],
    category: "Campus Life" as const,
  },
];

export const academics = {
  levels: [
    {
      name: "Primary (I - V)",
      description: "Foundation years focused on literacy, numeracy, and creative exploration.",
      subjects: ["English", "Hindi", "Mathematics", "EVS", "Art & Craft", "Physical Education"],
    },
    {
      name: "Middle (VI - VIII)",
      description: "Structured curriculum with emphasis on critical thinking and collaboration.",
      subjects: ["English", "Hindi", "Mathematics", "Science", "Social Studies", "Computer Science"],
    },
    {
      name: "Secondary (IX - X)",
      description: "Board-aligned preparation with comprehensive subject coverage.",
      subjects: ["English", "Hindi", "Mathematics", "Science", "Social Science", "Optional Language"],
    },
    {
      name: "Senior Secondary (XI - XII)",
      description: "Specialized streams with career-oriented guidance and mentoring.",
      subjects: ["Science Stream", "Commerce Stream", "Humanities Stream"],
    },
  ],
  features: [
    "CBSE-affiliated curriculum",
    "Smart classrooms with digital learning tools",
    "Well-equipped science and computer labs",
    "Dedicated career counseling cell",
    "Regular parent-teacher interactions",
  ],
};

export const admissionsSteps = [
  { step: 1, title: "Inquiry", description: "Submit online inquiry or visit the admission office." },
  { step: 2, title: "Application", description: "Complete the application form with required documents." },
  { step: 3, title: "Assessment", description: "Entrance interaction/assessment for eligible grades." },
  { step: 4, title: "Confirmation", description: "Fee payment and enrollment confirmation." },
];

export const students = [
  { id: "STU001", name: "Aarav Sharma", class: "X-A", rollNo: "15", status: "Active", parent: "Rajesh Sharma" },
  { id: "STU002", name: "Priya Patel", class: "X-A", rollNo: "16", status: "Active", parent: "Meena Patel" },
  { id: "STU003", name: "Rohan Gupta", class: "IX-B", rollNo: "08", status: "Active", parent: "Sunil Gupta" },
  { id: "STU004", name: "Ananya Singh", class: "XII-Sci", rollNo: "22", status: "Active", parent: "Vikram Singh" },
  { id: "STU005", name: "Kabir Khan", class: "VIII-C", rollNo: "11", status: "Active", parent: "Imran Khan" },
  { id: "STU006", name: "Sneha Reddy", class: "XI-Com", rollNo: "05", status: "Active", parent: "Lakshmi Reddy" },
];

export const teachers = [
  { id: "TCH001", name: "Dr. Meera Nair", subject: "Physics", classes: "XI-XII", experience: "15 yrs" },
  { id: "TCH002", name: "Mr. Amit Joshi", subject: "Mathematics", classes: "IX-X", experience: "12 yrs" },
  { id: "TCH003", name: "Mrs. Sunita Verma", subject: "English", classes: "VI-XII", experience: "18 yrs" },
  { id: "TCH004", name: "Mr. Rahul Desai", subject: "Computer Science", classes: "VI-XII", experience: "8 yrs" },
  { id: "TCH005", name: "Ms. Kavita Rao", subject: "Chemistry", classes: "XI-XII", experience: "10 yrs" },
];

export const admissionApplications = [
  { id: "ADM001", applicant: "Vihaan Mehta", grade: "III", date: "2026-06-12", status: "Pending" },
  { id: "ADM002", applicant: "Isha Kapoor", grade: "VI", date: "2026-06-10", status: "Under Review" },
  { id: "ADM003", applicant: "Arjun Malhotra", grade: "I", date: "2026-06-08", status: "Approved" },
  { id: "ADM004", applicant: "Diya Choudhary", grade: "IX", date: "2026-06-05", status: "Pending" },
];

export const feeRecords = [
  { id: "FEE001", student: "Aarav Sharma", class: "X-A", amount: 45000, paid: 45000, due: 0, status: "Paid" },
  { id: "FEE002", student: "Priya Patel", class: "X-A", amount: 45000, paid: 30000, due: 15000, status: "Partial" },
  { id: "FEE003", student: "Rohan Gupta", class: "IX-B", amount: 42000, paid: 0, due: 42000, status: "Pending" },
  { id: "FEE004", student: "Ananya Singh", class: "XII-Sci", amount: 52000, paid: 52000, due: 0, status: "Paid" },
];

export const dashboardStats = [
  { label: "Total Students", value: "2,450", change: "+12 this month", icon: "GraduationCap" },
  { label: "Teachers", value: "120", change: "2 new hires", icon: "Users" },
  { label: "Today's Attendance", value: "94.2%", change: "+1.2% vs yesterday", icon: "CalendarCheck" },
  { label: "Pending Fees", value: "₹8.4L", change: "156 students", icon: "IndianRupee" },
];

export const recentActivities = [
  { action: "New admission approved", detail: "Arjun Malhotra — Grade I", time: "2 hours ago" },
  { action: "Fee payment received", detail: "Ananya Singh — ₹52,000", time: "4 hours ago" },
  { action: "Notice published", detail: "Mid-term exam schedule", time: "Yesterday" },
  { action: "Event created", detail: "Annual Day Celebration", time: "Yesterday" },
];

export const notices = [
  { id: "N001", title: "Mid-Term Exam Schedule", date: "2026-06-14", audience: "All Classes", status: "Published" },
  { id: "N002", title: "Summer Vacation Notice", date: "2026-05-20", audience: "All Classes", status: "Published" },
  { id: "N003", title: "Uniform Policy Update", date: "2026-06-01", audience: "VI-XII", status: "Draft" },
];

export const examSchedule = [
  { id: "EX001", name: "Mid-Term Examination", class: "IX-XII", startDate: "2026-07-20", endDate: "2026-07-30", status: "Scheduled" },
  { id: "EX002", name: "Unit Test 3", class: "VI-VIII", startDate: "2026-06-28", endDate: "2026-07-02", status: "Scheduled" },
  { id: "EX003", name: "Annual Examination", class: "All", startDate: "2027-02-15", endDate: "2027-03-05", status: "Upcoming" },
];
