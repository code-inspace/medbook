import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreatePatientDto } from '../../application/dto/create-patient.dto';
import { UpdatePatientDto } from '../../application/dto/update-patient.dto';
import { CreatePatientsUseCase } from '../../application/use-cases/create-patients.use-case';
import { GetPatientsUseCase } from '../../application/use-cases/get-patients.use-case';
import { UpdatePatientsUseCase } from '../../application/use-cases/update-patients.use-case';
import { Patient } from '../../domain/entities/patient.entity';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@Controller('patients')
@UseGuards(JwtAuthGuard)
export class PatientsController {
  constructor(
    private readonly getPatientsUseCase: GetPatientsUseCase,
    private readonly createPatientsUseCase: CreatePatientsUseCase,
    private readonly updatePatientsUseCase: UpdatePatientsUseCase,
  ) {}

  @Get()
  findAll(): Promise<Patient[]> {
    return this.getPatientsUseCase.execute();
  }

  @Post()
  create(@Body() dto: CreatePatientDto): Promise<Patient> {
    return this.createPatientsUseCase.execute(dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePatientDto,
  ): Promise<Patient> {
    return this.updatePatientsUseCase.execute(id, dto);
  }
}
