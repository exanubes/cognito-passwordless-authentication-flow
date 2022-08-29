import { Injectable } from '@nestjs/common';
import { generateRandomString } from '@exanubes/cdk-utils';
import {
  AuthFlowType,
  ChallengeNameType,
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  ConfirmSignUpCommandInput,
  InitiateAuthCommand,
  InitiateAuthCommandInput,
  RespondToAuthChallengeCommand,
  RespondToAuthChallengeCommandInput,
  SignUpCommand,
  SignUpCommandInput,
} from '@aws-sdk/client-cognito-identity-provider';
import { SignUpDto } from './dto/sign-up.dto';
import { LoginDto } from './dto/login.dto';
import { AwsConfigService } from '../config/aws-config.service';
import { VerifyLoginDto } from './dto/verify-login.dto';

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

  async signup({ username, email }: SignUpDto) {
    const input: SignUpCommandInput = {
      Password: generateRandomString(),
      Username: username,
      ClientId: this.awsConfigService.userPoolClientId,
      UserAttributes: [{ Name: 'email', Value: email }],
    };
    const command = new SignUpCommand(input);
    return this.client.send(command);
  }

  async verifySignup({ code, username }) {
    const input: ConfirmSignUpCommandInput = {
      ClientId: this.awsConfigService.userPoolClientId,
      Username: username,
      ConfirmationCode: code,
    };
    const command = new ConfirmSignUpCommand(input);
    return this.client.send(command);
  }

  async login({ username }: LoginDto) {
    const input: InitiateAuthCommandInput = {
      ClientId: this.awsConfigService.userPoolClientId,
      AuthFlow: AuthFlowType.CUSTOM_AUTH,
      AuthParameters: {
        USERNAME: username,
      },
    };
    const command = new InitiateAuthCommand(input);
    return this.client.send(command);
  }

  async verifyLogin({ code, username, session }: VerifyLoginDto) {
    const input: RespondToAuthChallengeCommandInput = {
      ClientId: this.awsConfigService.userPoolClientId,
      ChallengeName: ChallengeNameType.CUSTOM_CHALLENGE,
      Session: session,
      ChallengeResponses: {
        ANSWER: code,
        USERNAME: username,
      },
    };
    const command = new RespondToAuthChallengeCommand(input);
    const response = await this.client.send(command);
    return response.AuthenticationResult;
  }
}
