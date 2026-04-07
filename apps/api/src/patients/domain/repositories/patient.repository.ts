import { CreatePatientDto } from 'src/patients/application/dto/create-patient.dto';
import { Patient } from '../entities/patient.entity';
import { UpdatePatientDto } from 'src/patients/application/dto/update-patient.dto';

export abstract class PatientRepository {
  abstract findAll(): Promise<Patient[]>;
  abstract create(data: CreatePatientDto): Promise<Patient>;
  abstract update(id: string, data: UpdatePatientDto): Promise<Patient>;
  abstract findById(id: string): Promise<Patient | null>;
}
