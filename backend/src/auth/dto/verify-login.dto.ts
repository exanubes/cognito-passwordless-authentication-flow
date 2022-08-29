import { VerifySignupDto } from './verify-signup.dto';

export class VerifyLoginDto extends VerifySignupDto {
  session: string;
}
