import { Injectable, NotFoundException } from '@nestjs/common';
import { Patient } from 'src/patients/domain/entities/patient.entity';
import { PatientRepository } from 'src/patients/domain/repositories/patient.repository';
import { UpdatePatientDto } from '../dto/update-patient.dto';

@Injectable()
export class UpdatePatientsUseCase {
  constructor(private readonly patientRepository: PatientRepository) {}

  async execute(id: string, data: UpdatePatientDto): Promise<Patient> {
    const patient = await this.patientRepository.findById(id);
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    return this.patientRepository.update(id, data);
  }
}
