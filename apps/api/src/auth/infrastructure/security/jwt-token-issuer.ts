import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenClaims, TokenIssuer } from '../../domain/services/token-issuer';

@Injectable()
export class JwtTokenIssuer implements TokenIssuer {
  constructor(private readonly jwtService: JwtService) {}

  issue(claims: TokenClaims): Promise<string> {
    return this.jwtService.signAsync(claims);
  }
}
