import type { AWS } from '@serverless/typescript';

export const handlebarsHandler: AWS['functions'] = {
  makeHtml: {
    handler: 'src/handlers/handlebars/handler.makeHtml',
    memorySize: 1024,
    timeout: 30,
    events: [
      {
        http: {
          method: 'post',
          path: 'makeHtml',
          cors: true,
          documentation: {
            summary: 'Make HTML',
            description: 'Uses Handlebars to create HTML from a template',
            tags: ['status', 'health'],
            methodResponses: [{ statusCode: 200 }],
          },
        } as any,
      },
    ],
  },
};
