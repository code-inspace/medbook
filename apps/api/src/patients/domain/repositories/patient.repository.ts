import {
  NewPatient,
  Patient,
  PatientChanges,
} from '../entities/patient.entity';

export abstract class PatientRepository {
  abstract findAll(): Promise<Patient[]>;
  abstract create(data: NewPatient): Promise<Patient>;
  abstract update(id: string, changes: PatientChanges): Promise<Patient>;
  abstract findById(id: string): Promise<Patient | null>;
}
