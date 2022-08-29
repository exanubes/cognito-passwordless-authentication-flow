import { VerifyAuthChallengeResponseTriggerEvent } from "aws-lambda";

exports.handler = async (event: VerifyAuthChallengeResponseTriggerEvent) => {
  const validCode = event.request.privateChallengeParameters.code;
  event.response.answerCorrect = validCode === event.request.challengeAnswer;
  return event;
};
