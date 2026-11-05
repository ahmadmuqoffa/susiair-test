const MS_PER_DAY = 86_400_000;

export function parseISODate(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`);
}

export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addDays(iso: string, days: number): string {
  return toISODate(new Date(parseISODate(iso).getTime() + days * MS_PER_DAY));
}

/** Selisih hari: positif kalau `toIso` setelah `fromIso`. */
export function diffInDays(fromIso: string, toIso: string): number {
  return Math.round(
    (parseISODate(toIso).getTime() - parseISODate(fromIso).getTime()) /
      MS_PER_DAY,
  );
}