import { ConflictException, Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { RegisterUserDto } from '../dto/register-user.dto';

@Injectable()
export class RegisterUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(dto: RegisterUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = new User(
      crypto.randomUUID(),
      dto.email,
      hashedPassword,
      dto.firstName,
      dto.lastName,
      new Date(),
    );

    return this.userRepository.create(user);
  }
}
