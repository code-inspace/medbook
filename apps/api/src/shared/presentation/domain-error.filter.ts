import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import type { Response } from 'express';
import {
  ConflictError,
  DomainError,
  NotFoundError,
  RuleViolationError,
  UnauthenticatedError,
} from '../domain/domain-error';

function statusOf(error: DomainError): number {
  if (error instanceof NotFoundError) return 404;
  if (error instanceof ConflictError) return 409;
  if (error instanceof RuleViolationError) return 422;
  if (error instanceof UnauthenticatedError) return 401;
  return 400;
}

/** Adaptateur d'entrée : traduit les erreurs métier en réponses HTTP. */
@Catch(DomainError)
export class DomainErrorFilter implements ExceptionFilter<DomainError> {
  catch(error: DomainError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const statusCode = statusOf(error);

    response.status(statusCode).json({
      statusCode,
      error: error.name,
      message: error.message,
    });
  }
}
