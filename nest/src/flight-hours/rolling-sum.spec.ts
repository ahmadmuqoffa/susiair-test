import data from '../data/mock-flight-hours.json';
import { addDays } from '../common/date.util';
import { rollingSum } from './rolling-sum';

const map = new Map(data.flightHours.map((d) => [d.date, d.hours]));
const TODAY = '2026-05-15';

describe('rollingSum', () => {
  it('menghitung nilai kartu untuk hari ini', () => {
    expect(rollingSum(map, TODAY, 1)).toBe(6.4);
    expect(rollingSum(map, TODAY, 7)).toBe(25.2);
    expect(rollingSum(map, TODAY, 30)).toBe(87.2);
    expect(rollingSum(map, TODAY, 365)).toBe(1013.8);
  });

  it('menganggap tanggal sebelum awal dataset sebagai 0', () => {
    expect(rollingSum(map, '2024-12-27', 7)).toBe(5.7);
    expect(rollingSum(map, '2024-12-29', 7)).toBe(9.1);
  });

  it('mengembalikan 0 untuk tanggal setelah akhir dataset', () => {
    expect(rollingSum(map, '2026-07-01', 7)).toBe(0);
  });

  it('menghasilkan deret 1w yang benar di sekitar hari ini', () => {
    const expected = [
      15.0, 15.0, 16.6, 12.6, 16.3, 22.2, 24.0, 25.2, 31.4, 36.4, 42.8, 44.0,
      44.7, 42.7, 36.3,
    ];
    const actual = Array.from({ length: 15 }, (_, i) =>
      rollingSum(map, addDays(TODAY, i - 7), 7),
    );
    expect(actual).toEqual(expected);
  });

  it('boleh melewati limit tanpa dipotong', () => {
    expect(rollingSum(map, '2026-05-20', 7)).toBe(44.7); // limit 1w = 40
    expect(rollingSum(map, '2026-05-21', 30)).toBe(100.9); // limit 1m = 100
  });
});