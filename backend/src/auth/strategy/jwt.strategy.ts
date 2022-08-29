import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import jwt_decode from 'jwt-decode';
import * as jwkToPem from 'jwk-to-pem';
import fetch from 'node-fetch';
import { AwsConfigService } from '../../config/aws-config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly awsConfigService: AwsConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: async (request, jwtToken, done) => {
        const jwtHeader: { kid: string } = jwt_decode(jwtToken, {
          header: true,
        });
        const res = await fetch(awsConfigService.issuerAddress);
        const data = await res.json();
        const jwk = data.keys.find((key) => key.kid === jwtHeader.kid);

        if (!jwk) {
          throw new Error('Something went wrong');
        }
        done(null, jwkToPem(jwk));
      },
      algorithms: ['RS256'],
    });
  }
  async validate(payload) {
    return payload;
  }
}
