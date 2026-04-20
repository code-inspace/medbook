import { Clock } from '../domain/clock';

export class FixedClock extends Clock {
  constructor(private current: Date) {
    super();
  }

  now(): Date {
    return this.current;
  }

  advanceTo(date: Date) {
    this.current = date;
  }
}
