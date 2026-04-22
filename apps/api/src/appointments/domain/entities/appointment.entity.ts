import {
  ConflictError,
  RuleViolationError,
} from '../../../shared/domain/domain-error';

export type AppointmentStatus = 'SCHEDULED' | 'CANCELLED';

export const MIN_DURATION_MINUTES = 15;
export const MAX_DURATION_MINUTES = 120;

export type AppointmentProps = {
  id: string;
  patientId: string;
  practitionerId: string;
  startsAt: Date;
  endsAt: Date;
  status: AppointmentStatus;
  createdAt: Date;
};

export type NewAppointment = Pick<
  AppointmentProps,
  'id' | 'patientId' | 'practitionerId' | 'startsAt' | 'endsAt'
>;

const MS_PER_MINUTE = 60_000;

/**
 * Un rendez-vous entre un praticien et un patient.
 * Les règles métier vivent ici : aucune dépendance à Nest, Prisma ou HTTP.
 */
export class Appointment {
  readonly id: string;
  readonly patientId: string;
  readonly practitionerId: string;
  readonly startsAt: Date;
  readonly endsAt: Date;
  readonly status: AppointmentStatus;
  readonly createdAt: Date;

  private constructor(props: AppointmentProps) {
    this.id = props.id;
    this.patientId = props.patientId;
    this.practitionerId = props.practitionerId;
    this.startsAt = props.startsAt;
    this.endsAt = props.endsAt;
    this.status = props.status;
    this.createdAt = props.createdAt;
  }

  /** Crée un nouveau rendez-vous en appliquant les règles de planification. */
  static schedule(input: NewAppointment, now: Date): Appointment {
    const { startsAt, endsAt } = input;

    if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime())) {
      throw new RuleViolationError('Invalid appointment dates');
    }
    if (endsAt <= startsAt) {
      throw new RuleViolationError('Appointment must end after it starts');
    }
    if (startsAt <= now) {
      throw new RuleViolationError('Appointment must be in the future');
    }

    const minutes = (endsAt.getTime() - startsAt.getTime()) / MS_PER_MINUTE;
    if (minutes < MIN_DURATION_MINUTES || minutes > MAX_DURATION_MINUTES) {
      throw new RuleViolationError(
        `Appointment must last between ${MIN_DURATION_MINUTES} and ${MAX_DURATION_MINUTES} minutes`,
      );
    }

    return new Appointment({ ...input, status: 'SCHEDULED', createdAt: now });
  }

  /** Reconstruit un rendez-vous déjà enregistré, sans rejouer les règles de création. */
  static restore(props: AppointmentProps): Appointment {
    return new Appointment(props);
  }

  cancel(now: Date): Appointment {
    if (this.status === 'CANCELLED') {
      throw new ConflictError('Appointment is already cancelled');
    }
    if (this.startsAt <= now) {
      throw new RuleViolationError(
        'Cannot cancel an appointment that has already started',
      );
    }

    return new Appointment({ ...this, status: 'CANCELLED' });
  }

  isActive(): boolean {
    return this.status === 'SCHEDULED';
  }

  /** Deux créneaux qui se touchent (fin = début) ne se chevauchent pas. */
  overlaps(startsAt: Date, endsAt: Date): boolean {
    return this.startsAt < endsAt && startsAt < this.endsAt;
  }
}
