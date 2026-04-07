import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserRepository } from './domain/repositories/user.repository';
import { PrismaUserRepository } from './prisma/prisma-user.repository';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { AuthController } from './auth.controller';
import { LoginUserUseCase } from './application/use-cases/login-user.use-case';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),

        signOptions: {
          expiresIn: '15m',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    RegisterUserUseCase,
    LoginUserUseCase,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [UserRepository],
})
export class AuthModule {}
