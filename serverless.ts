import type { AWS, AwsLambdaRuntime } from '@serverless/typescript';
import { handlebarsHandler } from './src/handlers/handlebars/serverless';

const serverlessConfiguration: AWS = {
  service: 'obp-document-api',
  frameworkVersion: '2',
  useDotenv: true,
  variablesResolutionMode: '20210326',
  plugins: [
    'serverless-middleware', // must be first
    'serverless-plugin-typescript', // must precede serverless offline
    'serverless-dotenv-plugin',
    'serverless-offline',
  ],
  custom: {
    stages: ['local', 'dev', 'non-prod'],
    aws_account: '${opt:aws_account, env:AWS_ACCOUNT}',
    customAuthorizer: {
      name: 'obp-gigya-custom-authorizer-${self:provider.stage}',
      type: 'request',
      resultTtlInSeconds: 0,
      arn: 'arn:aws:lambda:${self:provider.region}:${self:custom.aws_account}:function:obp-custom-authorizer-${self:provider.stage}-func',
    },
    gluePostgresDatabaseName: 'obp-dmp-postgres-db',
    glueParquetDatabaseName: 'obp_dmp_parquet',
    customDomain: {
      domainName: '${self:provider.stage}.api.obp.agro.services',
      basePath: 'document-api',
      certificateName: '*.api.obp.agro.services',
      stage: '${self:provider.stage}',
      createRoute53Record: false,
      endpointType: 'regional',
    },
    prune: { automatic: true, number: 2 },
    middleware: { cleanFolder: false, pre: ['src/middleware/configuration.configure'] },
  },
  provider: {
    name: 'aws',
    // We can hard-code this back to just nodejs14.x whenever serverless offline gets support for 14.
    runtime: "${env:NODE_RUNTIME, 'nodejs14.x'}" as AwsLambdaRuntime,
    lambdaHashingVersion: '20201221',
    stage: "${opt:stage, env:STAGE, 'local'}",
    environment: {
      VAULT_ROLE_ID: '${env:VAULT_ROLE_ID}',
      VAULT_URL: '${env:VAULT_URL, self:custom.environment.VAULT_URL}',
      VAULT_API: '${env:VAULT_API, self:custom.environment.VAULT_API}',
      VAULT_PATH: '${env:VAULT_PATH, self:custom.environment.VAULT_PATH}',
      ENVIRONMENT: '${self:provider.stage}',
    },
    deploymentBucket: { name: '${opt:deployment_bucket, env:DEPLOYMENT_BUCKET}' },
    iam: { role: 'arn:aws:iam::${self:custom.aws_account}:role/${opt:lambda_role, env:LAMBDA_ROLE}' },
    region: "${opt:region, env:REGION, 'local'}" as 'us-east-1',
    apiGateway: {
      shouldStartNameWithService: true,
      binaryMediaTypes: ['multipart/form-data', 'application/pdf'],
    },
    vpc: {
      subnetIds: ['${opt:subnet_id_1, env:SUBNET_ID_1}', '${opt:subnet_id_2, env:SUBNET_ID_2}'],
      securityGroupIds: ['${opt:cache_security_group_id, env:CACHE_SECURITY_GROUP_ID}'],
    },
    tracing: { lambda: true },
  },
  package: {
    excludeDevDependencies: false,
    patterns: ['src/**', '!.idea/**', '!.dockerignore', '!.env', '!Dockerfile', '!README.MD', '!src/**/*.spec.js'],
  },
  functions: {
    ...handlebarsHandler,
  },
  resources: {
    Resources: {},
  },
};

module.exports = serverlessConfiguration;
