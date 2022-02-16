import {createServer} from '../server';
import puppeteer from 'puppeteer';
import type {Browser} from 'puppeteer';
import type {Server} from 'http';
import {createServer as createViteDevServer} from 'vite';

export async function startHydrogenNodeServer() {
  return await startHydrogenServer('node');
}

export async function startHydrogenDevServer() {
  return await startHydrogenServer('dev');
}

type ServerType = 'node' | 'dev';

async function startHydrogenServer(serverType: ServerType) {
  let app: {server: Server; port: number};

  switch (serverType) {
    case 'node':
      app = await createNodeServer();
      break;
    case 'dev':
      app = await createDevServer();
      break;
  }

  const browser = (await puppeteer.launch()) as Browser;
  const page = await browser.newPage();

  const cleanUp = async () => {
    await browser.close();
    await app.server.close();
  };

  const url = (pathname: string) => `http://localhost:${app.port}${pathname}`;

  const visit = async (pathname: string) => page.goto(url(pathname));

  return {url, page, cleanUp, visit};
}

async function createNodeServer() {
  const app = (await createServer()).app;
  const server = app.listen(0) as Server;
  const port: number = await new Promise((resolve) => {
    server.on('listening', () => {
      resolve(server.address().port);
    });
  });

  return {server, port};
}

async function createDevServer() {
  const app = await createViteDevServer();
  const server = await app.listen(0);

  return {server: server.httpServer, port: server.httpServer.address().port};
}
