/**
 * Susunan sel kalender satu bulan, pekan dimulai Senin.
 * Isinya tanggal ISO, atau null untuk sel kosong di awal bulan.
 */
export function buildMonthGrid(year: number, month: number): (string | null)[] {
  const totalDays = new Date(Date.UTC(year, month, 0)).getUTCDate()
  // getUTCDay: 0 = Minggu. Diubah supaya 0 = Senin.
  const leading = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7
  const mm = String(month).padStart(2, '0')

  const cells: (string | null)[] = Array(leading).fill(null)
  for (let d = 1; d <= totalDays; d++) {
    cells.push(`${year}-${mm}-${String(d).padStart(2, '0')}`)
  }
  return cells
}

/** Pilih teks gelap atau putih supaya terbaca di atas warna latar `hex`. */
export function readableTextColor(hex: string): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.62 ? '#0E2138' : '#FFFFFF'
}