import { Injectable } from '@nestjs/common';
import { Clock } from '../../../shared/domain/clock';
import { NotFoundError } from '../../../shared/domain/domain-error';
import { Appointment } from '../../domain/entities/appointment.entity';
import { AppointmentRepository } from '../../domain/repositories/appointment.repository';

export type CancelAppointmentCommand = {
  practitionerId: string;
  appointmentId: string;
};

@Injectable()
export class CancelAppointmentUseCase {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly clock: Clock,
  ) {}

  async execute(command: CancelAppointmentCommand): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findById(
      command.appointmentId,
    );

    // Le rendez-vous d'un autre praticien est traité comme inexistant.
    if (!appointment || appointment.practitionerId !== command.practitionerId) {
      throw new NotFoundError('Appointment not found');
    }

    const cancelled = appointment.cancel(this.clock.now());
    await this.appointmentRepository.save(cancelled);
    return cancelled;
  }
}
