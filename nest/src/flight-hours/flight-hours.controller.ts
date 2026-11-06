import { Controller, Get, Query } from '@nestjs/common';
import { GetFlightHoursDto } from './dto/get-flight-hours.dto';
import { GetSummaryDto } from './dto/get-summary.dto';
import { FlightHoursService } from './flight-hours.service';

@Controller('flight-hours')
export class FlightHoursController {
  constructor(private readonly flightHoursService: FlightHoursService) {}

  @Get()
  getRange(@Query() query: GetFlightHoursDto) {
    return this.flightHoursService.getRange(query.from, query.to);
  }

  @Get('summary')
  getSummary(@Query() query: GetSummaryDto) {
    return this.flightHoursService.getSummary(query.range);
  }
}