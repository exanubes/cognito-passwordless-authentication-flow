import { DefineAuthChallengeTriggerEvent } from "aws-lambda";

const ALLOWED_ATTEMPTS = Infinity;
const challengeName = process.env.CHALLENGE_NAME || "";

exports.handler = async (event: DefineAuthChallengeTriggerEvent) => {
  const [challenge] = event.request.session.reverse();
  const challengeAttempts = event.request.session.length;
  if (challenge) {
    if (challengeAttempts >= ALLOWED_ATTEMPTS) {
      event.response.issueTokens = false;
      event.response.failAuthentication = true;
      return event;
    }
    if (challenge.challengeName === challengeName) {
      event.response.issueTokens = challenge.challengeResult;
      event.response.failAuthentication = !challenge.challengeResult;
      return event;
    }
  }
  event.response.issueTokens = false;
  event.response.failAuthentication = false;
  event.response.challengeName = challengeName;
  return event;
};
