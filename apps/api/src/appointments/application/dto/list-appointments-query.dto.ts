import { IsISO8601, IsOptional } from 'class-validator';

export class ListAppointmentsQueryDto {
  @IsOptional()
  @IsISO8601({ strict: true })
  from?: string;
}
