import {
  ConflictError,
  RuleViolationError,
} from '../../../shared/domain/domain-error';
import { Appointment } from './appointment.entity';

const now = new Date('2030-01-01T08:00:00Z');
const at = (time: string) => new Date(`2030-01-01T${time}:00Z`);

const schedule = (startsAt: Date, endsAt: Date) =>
  Appointment.schedule(
    { id: 'a1', patientId: 'p1', practitionerId: 'u1', startsAt, endsAt },
    now,
  );

describe('Appointment', () => {
  describe('schedule', () => {
    it('crée un rendez-vous planifié', () => {
      const appointment = schedule(at('09:00'), at('09:30'));

      expect(appointment.status).toBe('SCHEDULED');
      expect(appointment.createdAt).toEqual(now);
    });

    it('refuse une date dans le passé', () => {
      expect(() => schedule(at('07:00'), at('07:30'))).toThrow(
        RuleViolationError,
      );
    });

    it('refuse une fin avant le début', () => {
      expect(() => schedule(at('10:00'), at('09:00'))).toThrow(
        RuleViolationError,
      );
    });

    it('refuse une durée inférieure à 15 minutes', () => {
      expect(() => schedule(at('09:00'), at('09:10'))).toThrow(
        RuleViolationError,
      );
    });

    it('refuse une durée supérieure à 2 heures', () => {
      expect(() => schedule(at('09:00'), at('11:01'))).toThrow(
        RuleViolationError,
      );
    });

    it('accepte les durées limites de 15 et 120 minutes', () => {
      expect(() => schedule(at('09:00'), at('09:15'))).not.toThrow();
      expect(() => schedule(at('09:00'), at('11:00'))).not.toThrow();
    });

    it('refuse une date invalide', () => {
      expect(() => schedule(new Date('nope'), at('09:30'))).toThrow(
        RuleViolationError,
      );
    });
  });

  describe('cancel', () => {
    it("annule un rendez-vous à venir sans modifier l'original", () => {
      const original = schedule(at('09:00'), at('09:30'));

      const cancelled = original.cancel(now);

      expect(cancelled.status).toBe('CANCELLED');
      expect(original.status).toBe('SCHEDULED');
    });

    it("refuse d'annuler deux fois", () => {
      const cancelled = schedule(at('09:00'), at('09:30')).cancel(now);

      expect(() => cancelled.cancel(now)).toThrow(ConflictError);
    });

    it("refuse d'annuler un rendez-vous déjà commencé", () => {
      const appointment = schedule(at('09:00'), at('09:30'));

      expect(() => appointment.cancel(at('09:05'))).toThrow(RuleViolationError);
    });
  });

  describe('overlaps', () => {
    const appointment = schedule(at('09:00'), at('10:00'));

    it.each([
      ['09:30', '10:30', true],
      ['08:30', '09:30', true],
      ['09:15', '09:45', true],
      ['10:00', '10:30', false],
      ['08:00', '09:00', false],
    ])('%s-%s => %s', (start, end, expected) => {
      expect(appointment.overlaps(at(start), at(end))).toBe(expected);
    });
  });
});
