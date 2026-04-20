import { Module } from '@nestjs/common';
import { PatientRepository } from './domain/repositories/patient.repository';
import { PrismaPatientRepository } from './infrastructure/prisma/prisma-patient.repository';
import { GetPatientsUseCase } from './application/use-cases/get-patients.use-case';
import { PatientsController } from './presentation/controllers/patients.controller';
import { CreatePatientsUseCase } from './application/use-cases/create-patients.use-case';
import { UpdatePatientsUseCase } from './application/use-cases/update-patients.use-case';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [PatientsController],
  providers: [
    GetPatientsUseCase,
    CreatePatientsUseCase,
    UpdatePatientsUseCase,
    {
      provide: PatientRepository,
      useClass: PrismaPatientRepository,
    },
  ],
  exports: [PatientRepository],
})
export class PatientsModule {}
