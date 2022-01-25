import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Riposte, RiposteResponse } from '@nbm/riposte';

export const hello = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  return Riposte.ok('Hello!');
};
