export const students = [
  { id: "STU001", name: "Aarav Sharma", class: "Class 10", rollNo: "15", status: "Active", parent: "Rajesh Sharma", parentPhone: "+91 98765 43211", parentEmail: "rajesh.sharma@email.com", photo: "" },
  { id: "STU002", name: "Priya Patel", class: "Class 10", rollNo: "16", status: "Active", parent: "Meena Patel", parentPhone: "+91 98765 43212", parentEmail: "meena.patel@email.com", photo: "" },
  { id: "STU003", name: "Rohan Gupta", class: "Class 9", rollNo: "08", status: "Active", parent: "Sunil Gupta", parentPhone: "+91 98765 43213", parentEmail: "sunil.gupta@email.com", photo: "" },
  { id: "STU004", name: "Ananya Singh", class: "Class 12", rollNo: "22", status: "Active", parent: "Vikram Singh", parentPhone: "+91 98765 43214", parentEmail: "vikram.singh@email.com", photo: "" },
  { id: "STU005", name: "Kabir Khan", class: "Class 8", rollNo: "11", status: "Active", parent: "Imran Khan", parentPhone: "+91 98765 43215", parentEmail: "imran.khan@email.com", photo: "" },
  { id: "STU006", name: "Sneha Reddy", class: "Class 11", rollNo: "05", status: "Active", parent: "Lakshmi Reddy", parentPhone: "+91 98765 43216", parentEmail: "lakshmi.reddy@email.com", photo: "" },
];

export const teachers = [
  { id: "TCH001", name: "Dr. Meera Nair", subject: "Physics", classes: "XI-XII", experience: "15 yrs", phone: "+91 98765 43221", email: "meera.nair@skacademy.edu", qualification: "Ph.D. Physics", joiningDate: "2010-04-01" },
  { id: "TCH002", name: "Mr. Amit Joshi", subject: "Mathematics", classes: "IX-X", experience: "12 yrs", phone: "+91 98765 43222", email: "amit.joshi@skacademy.edu", qualification: "M.Sc. Mathematics", joiningDate: "2013-06-15" },
  { id: "TCH003", name: "Mrs. Sunita Verma", subject: "English", classes: "VI-XII", experience: "18 yrs", phone: "+91 98765 43223", email: "sunita.verma@skacademy.edu", qualification: "M.A. English Literature", joiningDate: "2008-07-01" },
  { id: "TCH004", name: "Mr. Rahul Desai", subject: "Computer Science", classes: "VI-XII", experience: "8 yrs", phone: "+91 98765 43224", email: "rahul.desai@skacademy.edu", qualification: "B.Tech CSE", joiningDate: "2017-08-01" },
  { id: "TCH005", name: "Ms. Kavita Rao", subject: "Chemistry", classes: "XI-XII", experience: "10 yrs", phone: "+91 98765 43225", email: "kavita.rao@skacademy.edu", qualification: "M.Sc. Chemistry", joiningDate: "2015-04-01" },
];

export const admissionApplications = [
  { id: "ADM001", applicant: "Vihaan Mehta", grade: "III", date: "2026-06-12", status: "Pending", parentName: "Raj Mehta", phone: "+91 98765 44001", email: "raj.mehta@email.com", previousSchool: "Little Stars School" },
  { id: "ADM002", applicant: "Isha Kapoor", grade: "VI", date: "2026-06-10", status: "Pending", parentName: "Anita Kapoor", phone: "+91 98765 44002", email: "anita.kapoor@email.com", previousSchool: "Green Valley Public School" },
  { id: "ADM003", applicant: "Arjun Malhotra", grade: "I", date: "2026-06-08", status: "Approved", parentName: "Sanjay Malhotra", phone: "+91 98765 44003", email: "sanjay.m@email.com", previousSchool: "Sunshine Kindergarten" },
  { id: "ADM004", applicant: "Diya Choudhary", grade: "IX", date: "2026-06-05", status: "Rejected", parentName: "Priya Choudhary", phone: "+91 98765 44004", email: "priya.c@email.com", previousSchool: "Delhi Public School" },
];

export const feeRecords = [
  { id: "FEE001", student: "Aarav Sharma", class: "X-A", amount: 45000, paid: 45000, due: 0, status: "Paid", paymentDate: "2026-04-15", paymentMode: "UPI", transactionId: "UPI20260415001" },
  { id: "FEE002", student: "Priya Patel", class: "X-A", amount: 45000, paid: 30000, due: 15000, status: "Partial", paymentDate: "2026-04-20", paymentMode: "Bank Transfer", transactionId: "NEFT20260420002" },
  { id: "FEE003", student: "Rohan Gupta", class: "IX-B", amount: 42000, paid: 0, due: 42000, status: "Pending", paymentDate: "", paymentMode: "", transactionId: "" },
  { id: "FEE004", student: "Ananya Singh", class: "XII-Sci", amount: 52000, paid: 52000, due: 0, status: "Paid", paymentDate: "2026-04-10", paymentMode: "Cash", transactionId: "CSH20260410004" },
];

export const exams = [
  { id: "EX001", name: "Mid-Term Examination", class: "IX-XII", startDate: "2026-07-20", endDate: "2026-07-30", status: "Scheduled" },
  { id: "EX002", name: "Unit Test 3", class: "VI-VIII", startDate: "2026-06-28", endDate: "2026-07-02", status: "Scheduled" },
  { id: "EX003", name: "Annual Examination", class: "All", startDate: "2027-02-15", endDate: "2027-03-05", status: "Upcoming" },
];

export const results = [
  {
    id: "RES001",
    examId: "EX001",
    examName: "Mid-Term Examination",
    studentId: "STU001",
    studentName: "Aarav Sharma",
    class: "X-A",
    subjects: [
      { subject: "English", maxMarks: 100, marks: 88 },
      { subject: "Mathematics", maxMarks: 100, marks: 92 },
      { subject: "Science", maxMarks: 100, marks: 85 },
      { subject: "Social Science", maxMarks: 100, marks: 90 },
      { subject: "Hindi", maxMarks: 100, marks: 87 },
    ],
  },
];
