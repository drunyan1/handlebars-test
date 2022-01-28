import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import * as puppeteer from 'puppeteer';

export const makeHtml = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  let pdf = null;
  let browser = null;

  // Use the Handlebars templating engine to generate the HTML
  const data = JSON.parse(event.body);
  const source = await fs.readFileSync(path.resolve(`templates/${data.template}.hbs`)).toString('utf8');
  const template = Handlebars.compile(source);
  const html = template(data).replace(/(?:\n)/g, '');

  // Take that HTML and use Puppeteer to print it to PDF
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    pdf = await (await page.pdf()).toString('base64');
  } catch (error) {
    console.log(error);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }

  // Return the Base64-encoded PDF
  return {
    statusCode: 200,
    body: (data.html ? html : pdf),
  };
};
