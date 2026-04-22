import { Injectable } from '@nestjs/common';
import {
  NewPatient,
  Patient,
  PatientChanges,
} from '../../domain/entities/patient.entity';
import { PatientRepository } from '../../domain/repositories/patient.repository';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class PrismaPatientRepository implements PatientRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: NewPatient): Promise<Patient> {
    const patient = await this.prisma.patient.create({ data });
    return new Patient(patient.id, patient.firstName, patient.lastName);
  }
  async update(id: string, data: PatientChanges): Promise<Patient> {
    const patient = await this.prisma.patient.update({
      where: {
        id,
      },
      data,
    });
    return new Patient(patient.id, patient.firstName, patient.lastName);
  }

  async findAll(): Promise<Patient[]> {
    const patients = await this.prisma.patient.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return patients.map(
      (patient) => new Patient(patient.id, patient.firstName, patient.lastName),
    );
  }
  async findById(id: string): Promise<Patient | null> {
    const patient = await this.prisma.patient.findUnique({
      where: {
        id,
      },
    });

    if (!patient) {
      return null;
    }

    return new Patient(patient.id, patient.firstName, patient.lastName);
  }
}
