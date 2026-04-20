import { Injectable } from '@nestjs/common';
import { Patient } from '../../domain/entities/patient.entity';
import { PatientRepository } from '../../domain/repositories/patient.repository';
import { CreatePatientDto } from '../dto/create-patient.dto';

@Injectable()
export class CreatePatientsUseCase {
  constructor(private readonly patientRepository: PatientRepository) {}

  execute(data: CreatePatientDto): Promise<Patient> {
    return this.patientRepository.create(data);
  }
}
