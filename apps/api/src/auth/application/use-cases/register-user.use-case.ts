import { Injectable } from '@nestjs/common';
import { ConflictError } from '../../../shared/domain/domain-error';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { PasswordHasher } from '../../domain/services/password-hasher';
import { RegisterUserDto } from '../dto/register-user.dto';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(dto: RegisterUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    const user = new User(
      crypto.randomUUID(),
      dto.email,
      await this.passwordHasher.hash(dto.password),
      dto.firstName,
      dto.lastName,
      new Date(),
    );

    return this.userRepository.create(user);
  }
}
