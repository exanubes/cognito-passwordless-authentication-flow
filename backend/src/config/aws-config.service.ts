import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AwsConfig } from './configs/aws.config';

@Injectable()
export class AwsConfigService {
  private readonly config: AwsConfig;
  constructor(private readonly configService: ConfigService) {
    this.config = configService.get<AwsConfig>('aws');
  }

  get userPoolClientId() {
    return this.config.userPoolClientId;
  }
  get userPoolId() {
    return this.config.userPoolId;
  }
  get issuerAddress() {
    return this.config.issuerAddress;
  }
  get region() {
    return this.config.region;
  }
  get accessKeyId() {
    return this.config.accessKeyId;
  }
  get secretAccessKey() {
    return this.config.secretAccessKey;
  }
}
