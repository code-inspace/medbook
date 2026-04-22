import {
  ConflictError,
  NotFoundError,
  RuleViolationError,
} from '../../../shared/domain/domain-error';
import { FixedClock } from '../../../shared/testing/fixed-clock.fake';
import { InMemoryPatientRepository } from '../../../patients/testing/in-memory-patient.repository.fake';
import { InMemoryAppointmentRepository } from '../../testing/in-memory-appointment.repository.fake';
import { CancelAppointmentUseCase } from './cancel-appointment.use-case';
import { ListAppointmentsUseCase } from './list-appointments.use-case';
import { ScheduleAppointmentUseCase } from './schedule-appointment.use-case';

const now = new Date('2030-01-01T08:00:00Z');
const at = (time: string) => new Date(`2030-01-01T${time}:00Z`);

async function setup() {
  const appointments = new InMemoryAppointmentRepository();
  const patients = new InMemoryPatientRepository();
  const clock = new FixedClock(now);
  const patient = await patients.create({
    firstName: 'Marie',
    lastName: 'Curie',
  });

  return {
    appointments,
    clock,
    patient,
    schedule: new ScheduleAppointmentUseCase(appointments, patients, clock),
    cancel: new CancelAppointmentUseCase(appointments, clock),
    list: new ListAppointmentsUseCase(appointments),
  };
}

const command = (
  patientId: string,
  start: string,
  end: string,
  practitionerId = 'dr1',
) => ({
  practitionerId,
  patientId,
  startsAt: at(start),
  endsAt: at(end),
});

describe('ScheduleAppointmentUseCase', () => {
  it('enregistre un rendez-vous valide', async () => {
    const { schedule, appointments, patient } = await setup();

    const appointment = await schedule.execute(
      command(patient.id, '09:00', '09:30'),
    );

    expect(appointments.items.get(appointment.id)).toBeDefined();
  });

  it('refuse un patient inconnu', async () => {
    const { schedule } = await setup();

    await expect(
      schedule.execute(command('inconnu', '09:00', '09:30')),
    ).rejects.toThrow(NotFoundError);
  });

  it('refuse un créneau qui chevauche un autre rendez-vous du praticien', async () => {
    const { schedule, patient } = await setup();
    await schedule.execute(command(patient.id, '09:00', '10:00'));

    await expect(
      schedule.execute(command(patient.id, '09:30', '10:30')),
    ).rejects.toThrow(ConflictError);
  });

  it('accepte deux rendez-vous qui se suivent', async () => {
    const { schedule, patient } = await setup();
    await schedule.execute(command(patient.id, '09:00', '10:00'));

    await expect(
      schedule.execute(command(patient.id, '10:00', '10:30')),
    ).resolves.toBeDefined();
  });

  it('accepte le même horaire pour un autre praticien', async () => {
    const { schedule, patient } = await setup();
    await schedule.execute(command(patient.id, '09:00', '10:00', 'dr1'));

    await expect(
      schedule.execute(command(patient.id, '09:00', '10:00', 'dr2')),
    ).resolves.toBeDefined();
  });

  it('libère le créneau quand le rendez-vous est annulé', async () => {
    const { schedule, cancel, patient } = await setup();
    const first = await schedule.execute(command(patient.id, '09:00', '10:00'));
    await cancel.execute({ practitionerId: 'dr1', appointmentId: first.id });

    await expect(
      schedule.execute(command(patient.id, '09:00', '10:00')),
    ).resolves.toBeDefined();
  });

  it('applique les règles du domaine avant toute lecture en base', async () => {
    const { schedule, patient } = await setup();

    await expect(
      schedule.execute(command(patient.id, '07:00', '07:30')),
    ).rejects.toThrow(RuleViolationError);
  });
});

describe('CancelAppointmentUseCase', () => {
  it('annule et persiste le nouvel état', async () => {
    const { schedule, cancel, appointments, patient } = await setup();
    const created = await schedule.execute(
      command(patient.id, '09:00', '09:30'),
    );

    await cancel.execute({ practitionerId: 'dr1', appointmentId: created.id });

    expect(appointments.items.get(created.id)?.status).toBe('CANCELLED');
  });

  it("traite le rendez-vous d'un autre praticien comme inexistant", async () => {
    const { schedule, cancel, patient } = await setup();
    const created = await schedule.execute(
      command(patient.id, '09:00', '09:30', 'dr1'),
    );

    await expect(
      cancel.execute({ practitionerId: 'dr2', appointmentId: created.id }),
    ).rejects.toThrow(NotFoundError);
  });

  it('refuse un rendez-vous inconnu', async () => {
    const { cancel } = await setup();

    await expect(
      cancel.execute({ practitionerId: 'dr1', appointmentId: 'nope' }),
    ).rejects.toThrow(NotFoundError);
  });
});

describe('ListAppointmentsUseCase', () => {
  it('ne renvoie que les rendez-vous du praticien, triés par heure', async () => {
    const { schedule, list, patient } = await setup();
    await schedule.execute(command(patient.id, '11:00', '11:30', 'dr1'));
    await schedule.execute(command(patient.id, '09:00', '09:30', 'dr1'));
    await schedule.execute(command(patient.id, '10:00', '10:30', 'dr2'));

    const result = await list.execute({ practitionerId: 'dr1' });

    expect(result.map((a) => a.startsAt.toISOString())).toEqual([
      '2030-01-01T09:00:00.000Z',
      '2030-01-01T11:00:00.000Z',
    ]);
  });
});
