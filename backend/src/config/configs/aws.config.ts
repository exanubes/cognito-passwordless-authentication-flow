import { registerAs } from '@nestjs/config';

export const awsConfig = registerAs(
  'aws',
  (): AwsConfig => ({
    userPoolClientId: process.env.USER_POOL_CLIENT_ID,
    userPoolId: process.env.USER_POOL_ID,
    issuerAddress: process.env.ISSUER_ADDRESS,
    region: process.env.REGION,
    accessKeyId: process.env.IAM_ACCESS_KEY_ID,
    secretAccessKey: process.env.IAM_SECRET_ACCESS_KEY,
  }),
);

export interface AwsConfig {
  userPoolClientId: string;
  userPoolId: string;
  issuerAddress: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
}
