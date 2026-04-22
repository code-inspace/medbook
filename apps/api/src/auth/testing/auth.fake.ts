import { User } from '../domain/entities/user.entity';
import { UserRepository } from '../domain/repositories/user.repository';
import { PasswordHasher } from '../domain/services/password-hasher';
import { TokenClaims, TokenIssuer } from '../domain/services/token-issuer';

export class InMemoryUserRepository implements UserRepository {
  readonly items: User[] = [];

  async findByEmail(email: string): Promise<User | null> {
    return this.items.find((u) => u.email === email) ?? null;
  }

  async create(user: User): Promise<User> {
    this.items.push(user);
    return user;
  }
}

/** Hachage réversible : suffisant pour tester la logique sans bcrypt. */
export class FakePasswordHasher implements PasswordHasher {
  async hash(plain: string): Promise<string> {
    return `hashed:${plain}`;
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return hashed === `hashed:${plain}`;
  }
}

export class FakeTokenIssuer implements TokenIssuer {
  async issue(claims: TokenClaims): Promise<string> {
    return `token-for-${claims.sub}`;
  }
}
