import { Injectable } from '@nestjs/common';
import { DataService } from '../data/data.service';

@Injectable()
export class SchedulesService {
  constructor(private readonly data: DataService) {}

  getByMonth(year: number, month: number) {
    const prefix = `${year}-${String(month).padStart(2, '0')}`;
    const { legend, schedules } = this.data.schedules;

    return {
      year,
      month,
      legend,
      schedules: schedules.filter((s) => s.duty_date.startsWith(prefix)),
    };
  }
}