import { Injectable } from '@nestjs/common';
import { Appointment } from '../../domain/entities/appointment.entity';
import { AppointmentRepository } from '../../domain/repositories/appointment.repository';

export type ListAppointmentsQuery = {
  practitionerId: string;
  from?: Date;
};

@Injectable()
export class ListAppointmentsUseCase {
  constructor(private readonly appointmentRepository: AppointmentRepository) {}

  execute(query: ListAppointmentsQuery): Promise<Appointment[]> {
    return this.appointmentRepository.findByPractitioner(query.practitionerId, {
      from: query.from,
    });
  }
}
