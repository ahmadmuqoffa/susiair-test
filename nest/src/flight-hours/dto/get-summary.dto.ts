import { IsIn, IsOptional } from 'class-validator';

export const RANGE_KEYS = ['1w', '1m', '3m', '6m', '1y'] as const;
export type RangeKey = (typeof RANGE_KEYS)[number];

export class GetSummaryDto {
  @IsOptional()
  @IsIn(RANGE_KEYS)
  range: RangeKey = '1w';
}