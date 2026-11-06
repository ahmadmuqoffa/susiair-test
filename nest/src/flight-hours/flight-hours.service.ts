import { BadRequestException, Injectable } from '@nestjs/common';
import { addDays, diffInDays } from '../common/date.util';
import { DataService } from '../data/data.service';
import { RangeKey } from './dto/get-summary.dto';
import { HoursByDate, rollingSum } from './rolling-sum';

const MAX_RANGE_DAYS = 1095;

const CARD_WINDOWS = [
  { key: 'daily', label: 'Daily', windowDays: 1 },
  { key: 'weekly', label: 'Weekly', windowDays: 7 },
  { key: 'monthly', label: 'Monthly', windowDays: 30 },
  { key: 'annual', label: 'Annual', windowDays: 365 },
] as const;

@Injectable()
export class FlightHoursService {
  private readonly hoursByDate: HoursByDate;

  constructor(private readonly data: DataService) {
    this.hoursByDate = new Map(
      data.flightHours.flightHours.map((d) => [d.date, d.hours]),
    );
  }

  /** GET /flight-hours?from&to : jam harian, tanggal kosong diisi 0. */
  getRange(from: string, to: string) {
    const span = diffInDays(from, to);
    if (span < 0) {
      throw new BadRequestException('from must not be after to');
    }
    if (span + 1 > MAX_RANGE_DAYS) {
      throw new BadRequestException(
        `Date range must not exceed ${MAX_RANGE_DAYS} days`,
      );
    }

    const days: { date: string; hours: number }[] = [];
    for (let i = 0; i <= span; i++) {
      const date = addDays(from, i);
      days.push({ date, hours: this.hoursByDate.get(date) ?? 0 });
    }
    const total = Math.round(days.reduce((s, d) => s + d.hours * 10, 0)) / 10;

    return { from, to, total, days };
  }

  /** GET /flight-hours/summary?range : deret rolling sum untuk chart + kartu. */
  getSummary(range: RangeKey) {
    const today = this.data.today;
    const bounds = this.data.flightHours.chartBounds[range];

    const series: {
      date: string;
      hours: number;
      rollingSum: number;
      isToday: boolean;
      isFuture: boolean;
      overLimit: boolean;
    }[] = [];

    for (
      let offset = -bounds.displayRangeDays;
      offset <= bounds.displayRangeDays;
      offset++
    ) {
      const date = addDays(today, offset);
      const sum = rollingSum(this.hoursByDate, date, bounds.windowDays);
      series.push({
        date,
        hours: this.hoursByDate.get(date) ?? 0,
        rollingSum: sum,
        isToday: offset === 0,
        isFuture: offset > 0,
        overLimit: sum > bounds.limit,
      });
    }

    return {
      range,
      today,
      windowDays: bounds.windowDays,
      limit: bounds.limit,
      yMax: bounds.max,
      series,
      cards: this.getCards(),
    };
  }

  private getCards() {
    const limits = this.data.flightHours.limits;
    return CARD_WINDOWS.map(({ key, label, windowDays }) => {
      const current = rollingSum(this.hoursByDate, this.data.today, windowDays);
      const limit = limits[key];
      const percentage = Math.round((current / limit) * 1000) / 10;
      const status =
        current > limit ? 'exceeded' : percentage >= 80 ? 'warning' : 'safe';
      return { key, label, windowDays, current, limit, percentage, status };
    });
  }
}