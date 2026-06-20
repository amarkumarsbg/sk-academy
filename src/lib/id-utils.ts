/** Generate next ID in PREFIX001, PREFIX002, … format (ignores legacy timestamp IDs). */
export function generateNextId(prefix: string, existingIds: string[], padding = 3): string {
  const pattern = new RegExp(`^${prefix}(\\d{1,6})$`, "i");
  const numbers = existingIds
    .map((id) => {
      const match = id.match(pattern);
      return match ? parseInt(match[1], 10) : null;
    })
    .filter((n): n is number => n !== null && n < 1_000_000);

  const next = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
  return `${prefix}${String(next).padStart(padding, "0")}`;
}
