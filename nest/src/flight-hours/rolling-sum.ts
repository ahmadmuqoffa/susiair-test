import { addDays } from '../common/date.util';

export type HoursByDate = Map<string, number>;

/**
 * Jumlah jam terbang dalam `windowDays` hari yang berakhir di `endDate`
 * (inklusif). Tanggal yang tidak ada di data dihitung 0.
 */
export function rollingSum(
  hoursByDate: HoursByDate,
  endDate: string,
  windowDays: number,
): number {
  let tenths = 0; // hitung dalam sepersepuluh jam agar bebas error floating point
  for (let i = 0; i < windowDays; i++) {
    tenths += Math.round((hoursByDate.get(addDays(endDate, -i)) ?? 0) * 10);
  }
  return tenths / 10;
}