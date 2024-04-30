export function formatDate(date: string): string {
  if (date.length !== 8) throw new Error('Invalid date format');

  return `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;
}
