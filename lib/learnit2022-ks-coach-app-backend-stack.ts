import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import {
    ProviderAttribute,
    UserPoolClientIdentityProvider,
} from 'aws-cdk-lib/aws-cognito';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class Learnit2022KsCoachAppBackendStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        // The code that defines your stack goes here
        const uniquePrefix = 'userpooltestlalit';
        const googleClientId =
            '';
        const googleClientSecret = '';
        const callbackUrl = 'https://aws-cdk.com/cognito-google/';

        //cognito user pool and identity pool
        const userPool = new cognito.UserPool(this, 'MyNewUserPool', {
            selfSignUpEnabled: true, //Signup from user
            autoVerify: { email: true }, // email verfication using verfication code
            signInAliases: { email: true }, // Set email as an alias
            removalPolicy: RemovalPolicy.DESTROY,
        });
        const userPoolDomain = userPool.addDomain('default', {
            cognitoDomain: {
                domainPrefix: uniquePrefix,
            },
        });

        new cognito.UserPoolIdentityProviderGoogle(this, 'Google', {
            userPool,
            clientId: googleClientId,
            clientSecret: googleClientSecret,
            scopes: ['email'],
            attributeMapping: {
                email: ProviderAttribute.GOOGLE_EMAIL,
            },
        });

        const userPoolClient = new cognito.UserPoolClient(
            this,
            'MyNewUserPoolClient',
            {
                userPool,
                generateSecret: true, // Don't need to generate secret for web app running on browsers
                supportedIdentityProviders: [
                    UserPoolClientIdentityProvider.GOOGLE,
                    UserPoolClientIdentityProvider.COGNITO,
                ],
                oAuth: {
                    callbackUrls: [callbackUrl],
                    flows: {
                        implicitCodeGrant: true,
                    },
                },
            }
        );
        //client secret//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
        //client id 823507318929-k7f4s1dd2ddl6tertrrd8nvdqj1j552m.apps.googleusercontent.com
        // example resource
        // const queue = new sqs.Queue(this, 'Learnit2022KsCoachAppBackendQueue', {
        //   visibilityTimeout: cdk.Duration.seconds(300)
        // });
    }
}
