import { Injectable } from '@nestjs/common';
import { Patient } from 'src/patients/domain/entities/patient.entity';
import { PatientRepository } from 'src/patients/domain/repositories/patient.repository';

@Injectable()
export class GetPatientsUseCase {
  constructor(private readonly patientRepository: PatientRepository) {}

  execute(): Promise<Patient[]> {
    return this.patientRepository.findAll();
  }
}
