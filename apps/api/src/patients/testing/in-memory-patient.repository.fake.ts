import {
  NewPatient,
  Patient,
  PatientChanges,
} from '../domain/entities/patient.entity';
import { PatientRepository } from '../domain/repositories/patient.repository';

export class InMemoryPatientRepository implements PatientRepository {
  readonly items = new Map<string, Patient>();
  private sequence = 0;

  async findAll(): Promise<Patient[]> {
    return [...this.items.values()];
  }

  async create(data: NewPatient): Promise<Patient> {
    const patient = new Patient(
      `p${++this.sequence}`,
      data.firstName,
      data.lastName,
    );
    this.items.set(patient.id, patient);
    return patient;
  }

  async update(id: string, changes: PatientChanges): Promise<Patient> {
    const current = this.items.get(id)!;
    const updated = new Patient(
      id,
      changes.firstName ?? current.firstName,
      changes.lastName ?? current.lastName,
    );
    this.items.set(id, updated);
    return updated;
  }

  async findById(id: string): Promise<Patient | null> {
    return this.items.get(id) ?? null;
  }
}
