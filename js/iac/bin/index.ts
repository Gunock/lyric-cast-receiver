#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as dotenv from 'dotenv';
import 'source-map-support/register';

import CertificatesStack from '@/stacks/CertificatesStack';
import LyricCastReceiverStack from '@/stacks/LyricCastReceiverStack';
import { env } from '@/utils/env';
import type { BaseStackProps } from '@/utils/props';

dotenv.config();

const app = new cdk.App();

const baseProps: BaseStackProps = {
    env: { account: env.AWS_ACCOUNT_ID, region: env.AWS_REGION },
    deploymentEnvironment: env.DEPLOYMENT_ENVIRONMENT,
    domainNameBase: `${env.DEPLOYMENT_ENVIRONMENT}.apps.aws.thomas-kiljanczyk.dev`
};

const certificateStack = new CertificatesStack(app, `certificates-production`, baseProps);

new LyricCastReceiverStack(app, `lyriccast-receiver-production`, {
    ...baseProps,
    lyricCastReceiverCertificate: certificateStack.lyricCastReceiverCertificate
});