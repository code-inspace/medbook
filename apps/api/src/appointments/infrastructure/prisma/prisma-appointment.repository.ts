import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Appointment } from '../../domain/entities/appointment.entity';
import { AppointmentRepository } from '../../domain/repositories/appointment.repository';

type AppointmentRow = {
  id: string;
  patientId: string;
  practitionerId: string;
  startsAt: Date;
  endsAt: Date;
  status: 'SCHEDULED' | 'CANCELLED';
  createdAt: Date;
};

function toDomain(row: AppointmentRow): Appointment {
  return Appointment.restore({ ...row });
}

@Injectable()
export class PrismaAppointmentRepository implements AppointmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(appointment: Appointment): Promise<void> {
    const data = {
      patientId: appointment.patientId,
      practitionerId: appointment.practitionerId,
      startsAt: appointment.startsAt,
      endsAt: appointment.endsAt,
      status: appointment.status,
    };

    await this.prisma.appointment.upsert({
      where: { id: appointment.id },
      create: { id: appointment.id, createdAt: appointment.createdAt, ...data },
      update: data,
    });
  }

  async findById(id: string): Promise<Appointment | null> {
    const row = await this.prisma.appointment.findUnique({ where: { id } });
    return row ? toDomain(row) : null;
  }

  async findActiveOverlapping(
    practitionerId: string,
    startsAt: Date,
    endsAt: Date,
  ): Promise<Appointment[]> {
    const rows = await this.prisma.appointment.findMany({
      where: {
        practitionerId,
        status: 'SCHEDULED',
        startsAt: { lt: endsAt },
        endsAt: { gt: startsAt },
      },
    });
    return rows.map(toDomain);
  }

  async findByPractitioner(
    practitionerId: string,
    options?: { from?: Date },
  ): Promise<Appointment[]> {
    const rows = await this.prisma.appointment.findMany({
      where: {
        practitionerId,
        ...(options?.from && { startsAt: { gte: options.from } }),
      },
      orderBy: { startsAt: 'asc' },
    });
    return rows.map(toDomain);
  }
}
