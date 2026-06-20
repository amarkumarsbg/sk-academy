export interface ResultSubject {
  subject: string;
  maxMarks: number;
  marks: number;
}

export interface ResultRecord {
  id: string;
  examId: string;
  examName: string;
  studentId: string;
  studentName: string;
  class: string;
  subjects: ResultSubject[];
}

export function calcTotalMarks(subjects: ResultSubject[]) {
  return subjects.reduce((sum, s) => sum + s.marks, 0);
}

export function calcMaxMarks(subjects: ResultSubject[]) {
  return subjects.reduce((sum, s) => sum + s.maxMarks, 0);
}

export function calcPercentage(subjects: ResultSubject[]): number {
  const max = calcMaxMarks(subjects);
  if (max === 0) return 0;
  return Math.round((calcTotalMarks(subjects) / max) * 100);
}

export function calcGrade(percentage: number): string {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  return "F";
}
