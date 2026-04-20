import { Injectable } from '@nestjs/common';
import { NotFoundError } from '../../../shared/domain/domain-error';
import { Patient } from '../../domain/entities/patient.entity';
import { PatientRepository } from '../../domain/repositories/patient.repository';
import { UpdatePatientDto } from '../dto/update-patient.dto';

@Injectable()
export class UpdatePatientsUseCase {
  constructor(private readonly patientRepository: PatientRepository) {}

  async execute(id: string, data: UpdatePatientDto): Promise<Patient> {
    const patient = await this.patientRepository.findById(id);
    if (!patient) {
      throw new NotFoundError('Patient not found');
    }
    return this.patientRepository.update(id, data);
  }
}
