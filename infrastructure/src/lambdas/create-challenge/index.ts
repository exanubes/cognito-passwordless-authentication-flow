import { CreateAuthChallengeTriggerEvent } from "aws-lambda";

const { generateRandomString } = require("@exanubes/cdk-utils");
const emailClient = require("@sendgrid/mail");
const sendgridApiKey = String(process.env.SENDGRID_API_KEY);
emailClient.setApiKey(sendgridApiKey);

exports.handler = async (event: CreateAuthChallengeTriggerEvent) => {
  const code = generateRandomString();
  const user = event.request.userAttributes;
  const email = {
    to: `${event.userName} <${user.email}>`,
    from: "Exanubes.com <newsletter@exanubes.com>",
    subject: `[${event.triggerSource}] Your login token`,
    text: `Use the link below to log in to exanubes.com\n http://localhost:4000/verify-login?code=${code}&username=${event.userName} \n this link will expire in three minutes`,
  };
  await emailClient.send(email);
  event.response.publicChallengeParameters = {
    email: user.email,
  };
  event.response.privateChallengeParameters = {
    code,
  };
  event.response.challengeMetadata = `LOGIN-${code}`;
  return event;
};
