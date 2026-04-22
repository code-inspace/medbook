import { Appointment } from '../entities/appointment.entity';

/** Port de persistance des rendez-vous. Ne parle que le langage du domaine. */
export abstract class AppointmentRepository {
  /** Crée ou met à jour le rendez-vous. */
  abstract save(appointment: Appointment): Promise<void>;

  abstract findById(id: string): Promise<Appointment | null>;

  /** Rendez-vous non annulés du praticien qui chevauchent l'intervalle. */
  abstract findActiveOverlapping(
    practitionerId: string,
    startsAt: Date,
    endsAt: Date,
  ): Promise<Appointment[]>;

  /** Rendez-vous du praticien, du plus proche au plus lointain. */
  abstract findByPractitioner(
    practitionerId: string,
    options?: { from?: Date },
  ): Promise<Appointment[]>;
}
