import { Injectable } from '@nestjs/common';
import { Clock } from '../../../shared/domain/clock';
import {
  ConflictError,
  NotFoundError,
} from '../../../shared/domain/domain-error';
import { PatientRepository } from '../../../patients/domain/repositories/patient.repository';
import { Appointment } from '../../domain/entities/appointment.entity';
import { AppointmentRepository } from '../../domain/repositories/appointment.repository';

export type ScheduleAppointmentCommand = {
  practitionerId: string;
  patientId: string;
  startsAt: Date;
  endsAt: Date;
};

@Injectable()
export class ScheduleAppointmentUseCase {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly patientRepository: PatientRepository,
    private readonly clock: Clock,
  ) {}

  async execute(command: ScheduleAppointmentCommand): Promise<Appointment> {
    // Les règles du domaine d'abord : inutile d'interroger la base pour une date passée.
    const appointment = Appointment.schedule(
      {
        id: crypto.randomUUID(),
        patientId: command.patientId,
        practitionerId: command.practitionerId,
        startsAt: command.startsAt,
        endsAt: command.endsAt,
      },
      this.clock.now(),
    );

    const patient = await this.patientRepository.findById(command.patientId);
    if (!patient) {
      throw new NotFoundError('Patient not found');
    }

    const overlapping = await this.appointmentRepository.findActiveOverlapping(
      command.practitionerId,
      appointment.startsAt,
      appointment.endsAt,
    );
    if (overlapping.length > 0) {
      throw new ConflictError('This time slot is already booked');
    }

    await this.appointmentRepository.save(appointment);
    return appointment;
  }
}
