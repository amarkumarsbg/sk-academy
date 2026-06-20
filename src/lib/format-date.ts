const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;
const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

function parseDateParts(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return { year, month, day };
}

/** Stable date formatting for SSR — avoids locale hydration mismatches. */
export function formatMonthShort(dateStr: string) {
  const { month } = parseDateParts(dateStr);
  return MONTHS_SHORT[month - 1];
}

export function formatDay(dateStr: string) {
  return parseDateParts(dateStr).day;
}

export function formatYear(dateStr: string) {
  return parseDateParts(dateStr).year;
}

export function formatDateLong(dateStr: string) {
  const { year, month, day } = parseDateParts(dateStr);
  return `${day} ${MONTHS_LONG[month - 1]} ${year}`;
}

/** Sort ISO date strings (YYYY-MM-DD) newest first. */
export function compareDateDesc(a: string, b: string) {
  return b.localeCompare(a);
}

export function sortByDateDesc<T extends { date: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => compareDateDesc(a.date, b.date));
}
