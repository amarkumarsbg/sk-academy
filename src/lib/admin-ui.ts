/** Consistent avatar background colors from a name or email. */
const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-indigo-500",
  "bg-orange-500",
] as const;

export function getAvatarColor(seed: string): (typeof AVATAR_COLORS)[number] {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function getStudentStatusClass(status: string): string {
  switch (status) {
    case "Active":
      return "border-emerald-200 bg-emerald-50 text-emerald-800";
    case "Inactive":
      return "border-amber-200 bg-amber-50 text-amber-800";
    case "Graduated":
      return "border-blue-200 bg-blue-50 text-blue-800";
    default:
      return "border-border bg-muted text-muted-foreground";
  }
}

export function getInboxStatusClass(status: string): string {
  switch (status) {
    case "new":
      return "border-amber-200 bg-amber-50 text-amber-800";
    case "read":
      return "border-blue-200 bg-blue-50 text-blue-800";
    case "resolved":
      return "border-emerald-200 bg-emerald-50 text-emerald-800";
    default:
      return "border-border bg-muted text-muted-foreground";
  }
}
