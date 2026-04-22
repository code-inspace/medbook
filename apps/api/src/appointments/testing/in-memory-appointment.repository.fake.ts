import { Appointment } from '../domain/entities/appointment.entity';
import { AppointmentRepository } from '../domain/repositories/appointment.repository';

export class InMemoryAppointmentRepository implements AppointmentRepository {
  readonly items = new Map<string, Appointment>();

  async save(appointment: Appointment): Promise<void> {
    this.items.set(appointment.id, appointment);
  }

  async findById(id: string): Promise<Appointment | null> {
    return this.items.get(id) ?? null;
  }

  async findActiveOverlapping(
    practitionerId: string,
    startsAt: Date,
    endsAt: Date,
  ): Promise<Appointment[]> {
    return [...this.items.values()].filter(
      (a) =>
        a.practitionerId === practitionerId &&
        a.isActive() &&
        a.overlaps(startsAt, endsAt),
    );
  }

  async findByPractitioner(
    practitionerId: string,
    options?: { from?: Date },
  ): Promise<Appointment[]> {
    return [...this.items.values()]
      .filter((a) => a.practitionerId === practitionerId)
      .filter((a) => !options?.from || a.startsAt >= options.from)
      .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
  }
}
