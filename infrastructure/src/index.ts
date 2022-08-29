#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import {
  resolveCurrentUserOwnerName,
  getRegion,
  getAccountId,
} from "@exanubes/cdk-utils";
import { Tags } from "aws-cdk-lib";
import { CognitoStack } from "./stacks/cognito.stack";
require("dotenv").config();

async function main() {
  const owner = await resolveCurrentUserOwnerName();
  const app = new cdk.App();
  const region = await getRegion();
  const account = await getAccountId();
  new CognitoStack(app, "exanubes-cognito-stack", { env: { region, account } });
  Tags.of(app).add("owner", owner);
}

main().catch((error) => {
  console.log(error);
  process.exit(1);
});
