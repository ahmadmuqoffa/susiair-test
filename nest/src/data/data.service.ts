import { Injectable } from '@nestjs/common';
import flightHoursData from './mock-flight-hours.json';
import documentsData from './mock-documents.json';
import schedulesData from './mock-schedules.json';

@Injectable()
export class DataService {
  // "Hari ini" dikunci supaya perilaku aplikasi konsisten saat direview.
  // Bisa diubah lewat environment variable APP_TODAY.
  readonly today: string = process.env.APP_TODAY ?? '2026-05-15';

  readonly flightHours = flightHoursData;
  readonly documents = documentsData;
  readonly schedules = schedulesData;
}