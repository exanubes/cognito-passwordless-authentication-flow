const b64 = require("base64-js");
const encryptionSdk = require("@aws-crypto/client-node");
const emailClient = require("@sendgrid/mail");
const { encrypt, decrypt } = encryptionSdk.buildClient(
  encryptionSdk.CommitmentPolicy.REQUIRE_ENCRYPT_ALLOW_DECRYPT
);
const generatorKeyId = String(process.env.KEY_ALIAS);
const keyIds = [String(process.env.KEY_ID)];
const keyring = new encryptionSdk.KmsKeyringNode({ generatorKeyId, keyIds });
const sendgridApiKey = String(process.env.SENDGRID_API_KEY);
emailClient.setApiKey(sendgridApiKey);

exports.handler = async (event: CognitoTriggerEvent) => {
  try {
    //Decrypt the secret code using encryption SDK.
    let plainTextCode;
    if (event.request.code) {
      const { plaintext } = await decrypt(
        keyring,
        b64.toByteArray(event.request.code)
      );
      plainTextCode = plaintext.toString?.();
    }
    //PlainTextCode now has the decrypted secret.
    const user = event.request.userAttributes;
    const email = {
      to: `${event.userName} <${user.email}>`,
      from: "Exanubes.com <newsletter@exanubes.com>",
      subject: `[${event.triggerSource}] Welcome to Exanubes.com`,
      text: `Welcome to exanubes.com,\njoin us by going to http://localhost:3001/verify?code=${plainTextCode}&username=${event.userName}`,
    };

    switch (event.triggerSource) {
      case TriggerSource.SignUp:
        await emailClient.send(email);
        break;
      case TriggerSource.ResendCode:
        break;
      case TriggerSource.ForgotPassword:
        break;
      case TriggerSource.UpdateUserAttribute:
        break;
      case TriggerSource.VerifyUserAttribute:
        break;
      case TriggerSource.AdminCreateUser:
        break;
      case TriggerSource.AccountTakeOverNotification:
        break;
      default:
        const x: never = event.triggerSource;
        console.log("Unhandled case for trigger source: ", event.triggerSource);
        return x;
    }
  } catch (error) {
    console.log(error);
  }
  return;
};

enum TriggerSource {
  SignUp = "CustomEmailSender_SignUp",
  ResendCode = "CustomEmailSender_ResendCode",
  ForgotPassword = "CustomEmailSender_ForgotPassword",
  UpdateUserAttribute = "CustomEmailSender_UpdateUserAttribute",
  VerifyUserAttribute = "CustomEmailSender_VerifyUserAttribute",
  AdminCreateUser = "CustomEmailSender_AdminCreateUser",
  AccountTakeOverNotification = "CustomEmailSender_AccountTakeOverNotification",
}

interface CognitoTriggerEvent {
  triggerSource: TriggerSource;
  userName: string;
  userPoolId: string;
  region: string;
  version: string;
  request: {
    type: string;
    code: string;
    userAttributes: {
      sub: string;
      email_verified: "true" | "false";
      phone_number_verified: "true" | "false";
      email: string;
      phone_number: string;
      "congnito:email_alias": string;
      "congnito:user_status": string;
    };
  };
}
