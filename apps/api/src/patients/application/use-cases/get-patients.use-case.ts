import { Injectable } from '@nestjs/common';
import { Patient } from '../../domain/entities/patient.entity';
import { PatientRepository } from '../../domain/repositories/patient.repository';

@Injectable()
export class GetPatientsUseCase {
  constructor(private readonly patientRepository: PatientRepository) {}

  execute(): Promise<Patient[]> {
    return this.patientRepository.findAll();
  }
}
