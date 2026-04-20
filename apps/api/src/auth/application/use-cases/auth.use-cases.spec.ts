import {
  ConflictError,
  UnauthenticatedError,
} from '../../../shared/domain/domain-error';
import {
  FakePasswordHasher,
  FakeTokenIssuer,
  InMemoryUserRepository,
} from '../../testing/auth.fake';
import { LoginUserUseCase } from './login-user.use-case';
import { RegisterUserUseCase } from './register-user.use-case';

const registration = {
  email: 'dr@medbook.test',
  password: 'password123',
  firstName: 'Ada',
  lastName: 'Lovelace',
};

function setup() {
  const users = new InMemoryUserRepository();
  const hasher = new FakePasswordHasher();
  return {
    users,
    register: new RegisterUserUseCase(users, hasher),
    login: new LoginUserUseCase(users, hasher, new FakeTokenIssuer()),
  };
}

describe('RegisterUserUseCase', () => {
  it('ne stocke jamais le mot de passe en clair', async () => {
    const { register, users } = setup();

    await register.execute(registration);

    expect(users.items[0].password).not.toBe(registration.password);
  });

  it('refuse un email déjà utilisé', async () => {
    const { register } = setup();
    await register.execute(registration);

    await expect(register.execute(registration)).rejects.toThrow(ConflictError);
  });
});

describe('LoginUserUseCase', () => {
  it('renvoie un jeton pour des identifiants valides', async () => {
    const { register, login } = setup();
    const user = await register.execute(registration);

    const { accessToken } = await login.execute(registration);

    expect(accessToken).toBe(`token-for-${user.id}`);
  });

  it('refuse un mauvais mot de passe', async () => {
    const { register, login } = setup();
    await register.execute(registration);

    await expect(
      login.execute({ email: registration.email, password: 'wrong-password' }),
    ).rejects.toThrow(UnauthenticatedError);
  });

  it('refuse un email inconnu avec le même message', async () => {
    const { login } = setup();

    await expect(login.execute(registration)).rejects.toThrow(
      'Invalid credentials',
    );
  });
});
