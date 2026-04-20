import { IsInt, IsISO8601, IsString, Min } from 'class-validator';

/** Forme de la requête HTTP. Les règles métier (durée, date future) sont dans le domaine. */
export class ScheduleAppointmentDto {
  @IsString()
  patientId!: string;

  @IsISO8601({ strict: true })
  startsAt!: string;

  @IsInt()
  @Min(1)
  durationMinutes!: number;
}
