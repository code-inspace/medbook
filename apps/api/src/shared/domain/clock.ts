/** Port : l'heure courante. Permet de tester les règles qui dépendent du temps. */
export abstract class Clock {
  abstract now(): Date;
}
