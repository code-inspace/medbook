/**
 * Erreurs métier. Elles ne connaissent pas HTTP : c'est le filtre de la
 * couche presentation qui les traduit en codes de statut.
 */
export abstract class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

/** La ressource demandée n'existe pas (ou n'est pas visible par l'appelant). */
export class NotFoundError extends DomainError {}

/** L'action est impossible dans l'état actuel (créneau pris, déjà annulé...). */
export class ConflictError extends DomainError {}

/** Une règle métier est violée (date passée, durée invalide...). */
export class RuleViolationError extends DomainError {}

/** L'appelant n'est pas authentifié. */
export class UnauthenticatedError extends DomainError {}
