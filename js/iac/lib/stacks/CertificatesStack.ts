/*
 * Created by Tomasz Kiljanczyk on 24/11/2024, 00:48
 * Copyright (c) 2024 . All rights reserved.
 * Last modified 24/11/2024, 00:48
 */
import * as cdk from 'aws-cdk-lib';
import { aws_certificatemanager as cm, aws_route53 as route53 } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { DomainNameConstants } from '@/utils/constants';
import type { BaseStackProps } from '@/utils/props';

class CertificatesStack extends cdk.Stack {
    public readonly lyricCastReceiverCertificate: cm.Certificate;

    constructor(scope: Construct, id: string, props: BaseStackProps) {
        super(scope, id, {
            ...props,
            env: {
                ...props.env,
                // Certificates must be created in us-east-1
                region: 'us-east-1'
            }
        });

        const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
            domainName: props.domainNameBase
        });

        const lyricCastReceiverCertificate = new cm.Certificate(
            this,
            'AmazonCaptchaSolverCertificate',
            {
                domainName: DomainNameConstants.getLyricCastReceiverDomainName(
                    props.domainNameBase
                ),
                validation: cm.CertificateValidation.fromDns(hostedZone)
            }
        );
        this.lyricCastReceiverCertificate = lyricCastReceiverCertificate;
    }
}

export default CertificatesStack;
