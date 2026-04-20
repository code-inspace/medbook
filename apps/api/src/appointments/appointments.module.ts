import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PatientsModule } from '../patients/patients.module';
import { Clock } from '../shared/domain/clock';
import { CancelAppointmentUseCase } from './application/use-cases/cancel-appointment.use-case';
import { ListAppointmentsUseCase } from './application/use-cases/list-appointments.use-case';
import { ScheduleAppointmentUseCase } from './application/use-cases/schedule-appointment.use-case';
import { AppointmentRepository } from './domain/repositories/appointment.repository';
import { PrismaAppointmentRepository } from './infrastructure/prisma/prisma-appointment.repository';
import { SystemClock } from './infrastructure/system/system-clock';
import { AppointmentsController } from './presentation/controllers/appointments.controller';

@Module({
  imports: [AuthModule, PatientsModule],
  controllers: [AppointmentsController],
  providers: [
    ScheduleAppointmentUseCase,
    CancelAppointmentUseCase,
    ListAppointmentsUseCase,
    { provide: AppointmentRepository, useClass: PrismaAppointmentRepository },
    { provide: Clock, useClass: SystemClock },
  ],
})
export class AppointmentsModule {}
