import { IsString, MinLength } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  @MinLength(3, { message: 'First name must be at least 3 characters long' })
  firstName!: string;

  @IsString()
  @MinLength(3, { message: 'Last name must be at least 3 characters long' })
  lastName!: string;
}
