import { Injectable } from '@nestjs/common';
import { UnauthenticatedError } from '../../../shared/domain/domain-error';
import { UserRepository } from '../../domain/repositories/user.repository';
import { PasswordHasher } from '../../domain/services/password-hasher';
import { TokenIssuer } from '../../domain/services/token-issuer';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class LoginUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenIssuer: TokenIssuer,
  ) {}

  async execute(dto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findByEmail(dto.email);
    const isPasswordValid =
      user !== null &&
      (await this.passwordHasher.compare(dto.password, user.password));

    if (!user || !isPasswordValid) {
      throw new UnauthenticatedError('Invalid credentials');
    }

    const accessToken = await this.tokenIssuer.issue({
      sub: user.id,
      email: user.email,
    });

    return { accessToken };
  }
}
