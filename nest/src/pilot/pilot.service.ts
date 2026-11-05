import { Injectable } from '@nestjs/common';
import { DataService } from '../data/data.service';

@Injectable()
export class PilotService {
  constructor(private readonly data: DataService) {}

  getProfile() {
    const { name, totalFlightHours } = this.data.flightHours.pilot;
    return {
      name,
      totalFlightHours,
      // Data tidak menyediakan foto, jadi avatar dibuat dari inisial nama.
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name,
      )}&background=0E2138&color=ffffff&bold=true&size=128`,
    };
  }
}