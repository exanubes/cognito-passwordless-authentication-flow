import { PickType } from '@nestjs/mapped-types';
import { SignUpDto } from './sign-up.dto';

export class VerifySignupDto extends PickType(SignUpDto, ['username']) {
  code: string;
}
