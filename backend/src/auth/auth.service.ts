import { Injectable } from '@nestjs/common';
import {
  AuthFlowType,
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  ConfirmSignUpCommandInput,
  GetUserCommand,
  GetUserCommandInput,
  InitiateAuthCommand,
  InitiateAuthCommandInput,
  SignUpCommand,
  SignUpCommandInput,
} from '@aws-sdk/client-cognito-identity-provider';
import { SignUpDto } from './dto/sign-up.dto';
import { LoginDto } from './dto/login.dto';
import { AwsConfigService } from '../config/aws-config.service';

@Injectable()
export class AuthService {
  private readonly client: CognitoIdentityProviderClient;
  constructor(private readonly awsConfigService: AwsConfigService) {
    this.client = new CognitoIdentityProviderClient({
      region: awsConfigService.region,
      credentials: {
        accessKeyId: awsConfigService.accessKeyId,
        secretAccessKey: awsConfigService.secretAccessKey,
      },
    });
  }
  async signup({ password, username, email }: SignUpDto) {
    const input: SignUpCommandInput = {
      Password: password,
      Username: username,
      ClientId: this.awsConfigService.userPoolClientId,
      UserAttributes: [{ Name: 'email', Value: email }],
    };
    const command = new SignUpCommand(input);
    return this.client.send(command);
  }

  async verifySignup(code: string, username: string) {
    const input: ConfirmSignUpCommandInput = {
      ClientId: this.awsConfigService.userPoolClientId,
      Username: username,
      ConfirmationCode: code,
    };
    const command = new ConfirmSignUpCommand(input);
    return this.client.send(command);
  }

  async login({ username, password }: LoginDto) {
    const input: InitiateAuthCommandInput = {
      ClientId: this.awsConfigService.userPoolClientId,
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    };
    const command = new InitiateAuthCommand(input);
    const response = await this.client.send(command);
    return response.AuthenticationResult;
  }
}
