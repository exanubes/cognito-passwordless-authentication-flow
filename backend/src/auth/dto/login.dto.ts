import { SignUpDto } from './sign-up.dto';
import { PickType } from '@nestjs/mapped-types';

export class LoginDto extends PickType(SignUpDto, ['username']) {}
