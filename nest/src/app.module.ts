import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DataModule } from './data/data.module';
import { PilotModule } from './pilot/pilot.module';
import { DocumentsModule } from './documents/documents.module';
import { SchedulesModule } from './schedules/schedules.module';
import { FlightHoursModule } from './flight-hours/flight-hours.module';

@Module({
  imports: [AuthModule, DataModule, PilotModule, DocumentsModule, SchedulesModule, FlightHoursModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
