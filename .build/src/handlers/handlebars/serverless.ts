import type { AWS } from '@serverless/typescript';

export const handlebarsHandler: AWS['functions'] = {
  createEnvelope: {
    handler: 'src/handlers/handlebars/handler.hello',
    memorySize: 1024,
    timeout: 30,
    events: [
      {
        http: {
          method: 'post',
          path: 'hello',
          cors: true,
          documentation: {
            summary: 'Hello',
            description: 'Just making sure the plumbing works.',
            tags: ['status', 'health'],
            methodResponses: [{ statusCode: 200 }],
          },
        } as any, // TODO: If/when AWS allows other things, remove this
      },
    ],
  },
};
