import {createServer} from '../server';
import puppeteer from 'puppeteer';

export async function startHydrogenNodeServer() {
  const app = (await createServer()).app;
  const server = app.listen(0);
  const port = await new Promise((resolve) => {
    server.on('listening', () => {
      resolve(server.address().port);
    });
  });
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const cleanUp = async () => {
    await browser.close();
    await server.close();
  };

  const url = (pathname) => `http://localhost:${port}${pathname}`;

  const visit = async (pathname) => page.goto(url(pathname));

  return {url, page, cleanUp, visit};
}
