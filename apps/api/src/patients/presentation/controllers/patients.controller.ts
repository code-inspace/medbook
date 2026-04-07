import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreatePatientDto } from 'src/patients/application/dto/create-patient.dto';
import { UpdatePatientsUseCase } from 'src/patients/application/use-cases/update-patients.use-case';
import { CreatePatientsUseCase } from 'src/patients/application/use-cases/create-patients.use-case';
import { GetPatientsUseCase } from 'src/patients/application/use-cases/get-patients.use-case';
import { Patient } from 'src/patients/domain/entities/patient.entity';
import { UpdatePatientDto } from 'src/patients/application/dto/update-patient.dto';

@Controller('patients')
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
