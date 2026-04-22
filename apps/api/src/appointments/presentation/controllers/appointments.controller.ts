import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ListAppointmentsQueryDto } from '../../application/dto/list-appointments-query.dto';
import { ScheduleAppointmentDto } from '../../application/dto/schedule-appointment.dto';
import { CancelAppointmentUseCase } from '../../application/use-cases/cancel-appointment.use-case';
import { ListAppointmentsUseCase } from '../../application/use-cases/list-appointments.use-case';
import { ScheduleAppointmentUseCase } from '../../application/use-cases/schedule-appointment.use-case';
import { Appointment } from '../../domain/entities/appointment.entity';
import { CurrentUser } from '../../../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import type { JwtPayload } from '../../../auth/types/jwt-payload';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(
    private readonly scheduleAppointment: ScheduleAppointmentUseCase,
    private readonly cancelAppointment: CancelAppointmentUseCase,
    private readonly listAppointments: ListAppointmentsUseCase,
  ) {}

  @Get()
  list(
    @CurrentUser() user: JwtPayload,
    @Query() query: ListAppointmentsQueryDto,
  ): Promise<Appointment[]> {
    return this.listAppointments.execute({
      practitionerId: user.sub,
      from: query.from ? new Date(query.from) : undefined,
    });
  }

  @Post()
  schedule(
    @CurrentUser() user: JwtPayload,
    @Body() dto: ScheduleAppointmentDto,
  ): Promise<Appointment> {
    // Le contrôleur traduit la requête HTTP en commande métier.
    const startsAt = new Date(dto.startsAt);
    const endsAt = new Date(startsAt.getTime() + dto.durationMinutes * 60_000);

    return this.scheduleAppointment.execute({
      practitionerId: user.sub,
      patientId: dto.patientId,
      startsAt,
      endsAt,
    });
  }

  @Patch(':id/cancel')
  cancel(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
  ): Promise<Appointment> {
    return this.cancelAppointment.execute({
      practitionerId: user.sub,
      appointmentId: id,
    });
  }
}
