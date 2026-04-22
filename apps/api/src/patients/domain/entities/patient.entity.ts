export class Patient {
  constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly lastName: string,
  ) {}
}

export type NewPatient = { firstName: string; lastName: string };
export type PatientChanges = Partial<NewPatient>;
