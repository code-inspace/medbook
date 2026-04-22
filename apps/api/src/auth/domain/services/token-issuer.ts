export type TokenClaims = { sub: string; email: string };

/** Port : émission d'un jeton d'accès. Le domaine ignore JWT. */
export abstract class TokenIssuer {
  abstract issue(claims: TokenClaims): Promise<string>;
}
