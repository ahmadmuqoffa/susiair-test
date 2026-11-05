import { Controller, Get, Query } from '@nestjs/common';
import { GetSchedulesDto } from './dto/get-schedules.dto';
import { SchedulesService } from './schedules.service';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Get()
  findByMonth(@Query() query: GetSchedulesDto) {
    return this.schedulesService.getByMonth(query.year, query.month);
  }
}