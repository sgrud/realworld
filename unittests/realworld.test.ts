import express from 'express';
import { Server } from 'http';
import { Browser, launch, Page } from 'puppeteer-core';

describe('sgrud-realworld-example-app', () => {

  /*
   * Fixtures
   */

  const location = new URL('http://127.0.0.1:58080/realworld/');

  let page: Page;
  let puppeteer: Browser;
  let server: Server;

  afterAll(async() => {
    await puppeteer.close();
    server.close();
  });

  beforeAll(async() => {
    page = await (puppeteer = await launch({
      executablePath: '/usr/bin/chromium-browser',
      args: [
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--no-sandbox'
      ]
    })).newPage();

    server = express()
      .use('/', express.static('./'))
      .listen(location.port);
  }, 60000);

  /*
   * Unittests
   */

  describe('rendering the sgrud realworld example app', () => {
    it('correctly bootstraps the app and renders its homepage', async() => {
      await page.goto(location.href, { waitUntil: 'networkidle0' });
      const html = await page.$eval('html', (e: any) => e.getInnerHTML());
      expect(html).toContain('A place to share your <i>SGRUD</i> knowledge.');
    }, 60000);
  });

});
