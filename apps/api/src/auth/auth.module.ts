import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserRepository } from './domain/repositories/user.repository';
import { PrismaUserRepository } from './infrastructure/prisma/prisma-user.repository';
import { PasswordHasher } from './domain/services/password-hasher';
import { TokenIssuer } from './domain/services/token-issuer';
import { BcryptPasswordHasher } from './infrastructure/security/bcrypt-password-hasher';
import { JwtTokenIssuer } from './infrastructure/security/jwt-token-issuer';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { AuthController } from './auth.controller';
import { LoginUserUseCase } from './application/use-cases/login-user.use-case';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

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
    JwtAuthGuard,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    { provide: PasswordHasher, useClass: BcryptPasswordHasher },
    { provide: TokenIssuer, useClass: JwtTokenIssuer },
  ],
  exports: [UserRepository, JwtModule, JwtAuthGuard],
})
export class AuthModule {}
