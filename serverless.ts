import type { AWS, AwsLambdaRuntime } from '@serverless/typescript';
import { handlebarsHandler } from './src/handlers/handlebars/serverless';

const serverlessConfiguration: AWS = {
  service: 'handlebars-test-api',
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
  },
  provider: {
    name: 'aws',
    // We can hard-code this back to just nodejs14.x whenever serverless offline gets support for 14.
    runtime: "nodejs12.x" as AwsLambdaRuntime,
    lambdaHashingVersion: '20201221',
    stage: "dev",
    region: 'us-east-2',
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
