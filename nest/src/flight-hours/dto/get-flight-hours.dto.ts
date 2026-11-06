import { IsISO8601, Matches } from 'class-validator';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export class GetFlightHoursDto {
  @Matches(ISO_DATE, { message: 'from must be in YYYY-MM-DD format' })
  @IsISO8601({ strict: true })
  from: string;

  @Matches(ISO_DATE, { message: 'to must be in YYYY-MM-DD format' })
  @IsISO8601({ strict: true })
  to: string;
}