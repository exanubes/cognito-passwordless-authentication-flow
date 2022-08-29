import {
  CfnOutput,
  Duration,
  RemovalPolicy,
  Stack,
  StackProps,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  UserPool,
  UserPoolOperation,
  VerificationEmailStyle,
} from "aws-cdk-lib/aws-cognito";
import {
  Effect,
  Policy,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";
import { Key, KeySpec } from "aws-cdk-lib/aws-kms";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { join } from "path";

interface Props extends StackProps {}

const keyAlias = "exanubes-custom-emailer-key";

export class CognitoStack extends Stack {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);

    const cmk = this.createCustomManagedKey();
    const userPool = this.createUserPool(cmk);
    const customEmailer = this.createCustomEmailer(cmk);

    const role = new Role(this, "exanubes-user-pool-role", {
      assumedBy: new ServicePrincipal("ecs-tasks.amazonaws.com"),
    });
    userPool.grant(role, "cognito-idp:AdminCreateUser");
    this.setPermissions(cmk, customEmailer);

    userPool.addTrigger(UserPoolOperation.CUSTOM_EMAIL_SENDER, customEmailer);
  }

  private createCustomManagedKey(): Key {
    return new Key(this, "KMS-Symmetric-Key", {
      keySpec: KeySpec.SYMMETRIC_DEFAULT,
      alias: keyAlias,
      enableKeyRotation: false,
    });
  }

  private setPermissions(key: Key, lambda: Function): void {
    // Allow Cognito Service to use key for encryption
    key.addToResourcePolicy(
      new PolicyStatement({
        actions: ["kms:Encrypt"],
        effect: Effect.ALLOW,
        principals: [new ServicePrincipal("cognito-idp.amazonaws.com")],
        resources: ["*"],
      })
    );

    // Allow custom emailer lambda to use key
    lambda.role!.attachInlinePolicy(
      new Policy(this, "userpool-policy", {
        statements: [
          new PolicyStatement({
            actions: ["kms:Decrypt", "kms:DescribeKey"],
            effect: Effect.ALLOW,
            resources: [key.keyArn],
          }),
        ],
      })
    );

    // Allow cognito to use lambda
    lambda.addPermission("exanubes-cognito-custom-mailer-permission", {
      principal: new ServicePrincipal("cognito-idp.amazonaws.com"),
      action: "lambda:InvokeFunction",
    });
  }

  private createUserPool(cmk: Key): UserPool {
    const userPool = new UserPool(this, "exanubes-user-pool", {
      userPoolName: "exanubes_user_pool",
      selfSignUpEnabled: true,
      userVerification: {
        emailSubject: "[Exanubes] - Verify your email",
        emailBody: "Your verification code is {####}",
        emailStyle: VerificationEmailStyle.CODE,
        smsMessage: "Your verification code is {####}",
      },
      userInvitation: {
        emailSubject: "[Exanubes] - Invitation to join our community",
        emailBody:
          "Hi {username}, you have been invited to join our community. Your temporary password is {####}",
        smsMessage:
          "Hi {username}, you have been invited to join our community. Your temporary password is {####}",
      },
      signInAliases: {
        username: true,
        email: true,
      },
      removalPolicy: RemovalPolicy.DESTROY,

      standardAttributes: {
        email: { required: true, mutable: false },
      },
      autoVerify: { email: true },
      customSenderKmsKey: cmk,
    });
    const client = userPool.addClient("exanubes-user-pool-client", {
      userPoolClientName: "exanubes-cognito-app",
      authFlows: {
        userPassword: true,
      },
      accessTokenValidity: Duration.days(1),
      idTokenValidity: Duration.days(1),
      refreshTokenValidity: Duration.days(30),
      preventUserExistenceErrors: true,
    });
    new CfnOutput(this, "exanubes-user-pool-client-id", {
      value: client.userPoolClientId,
    });
    new CfnOutput(this, "exanubes-user-pool-id", {
      value: userPool.userPoolId,
    });
    return userPool;
  }

  private createCustomEmailer(cms: Key): Function {
    return new Function(this, "custom-emailer-lambda", {
      code: Code.fromAsset(
        join(__dirname, "..", "lambdas/custom-email-sender")
      ),
      runtime: Runtime.NODEJS_14_X,
      handler: "index.handler",
      environment: {
        KEY_ID: cms.keyArn,
        KEY_ALIAS: `arn:aws:kms:eu-central-1:145719986153:alias/${keyAlias}`,
        SENDGRID_API_KEY: String(process.env.SENDGRID_API_KEY),
      },
    });
  }
}
