/** Port : hachage des mots de passe. Le domaine ignore bcrypt. */
export abstract class PasswordHasher {
  abstract hash(plain: string): Promise<string>;
  abstract compare(plain: string, hashed: string): Promise<boolean>;
}
