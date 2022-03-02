import path from 'path';
import http from 'http';
import type {IncomingMessage} from 'http';
import fs from 'fs';
import mime from 'mime';
import {URL} from 'url';
import {Request} from '@miniflare/core';
import connect from 'connect';
import type {NextHandleFunction} from 'connect';
import type {MiniOxygen} from './core';

export interface MiniOxygenServerOptions {
  assetsDir: string;
}

function createAssetMiddleware({
  assetsDir,
}: {
  assetsDir: string;
}): NextHandleFunction {
  return (req, res, next) => {
    const url = new URL(req.url || '/', `http://${req.headers.host}`);
    const pathname = url.pathname.substring(1);
    const filePath = path.join(assetsDir, pathname);

    if (pathname !== '' && fs.existsSync(filePath)) {
      const rs = fs.createReadStream(filePath);
      const {size} = fs.statSync(filePath);

      res.setHeader('Content-Type', mime.getType(filePath)!);
      res.setHeader('Content-Length', size);

      return rs.pipe(res);
    }

    next();
  };
}

function createRequestMiddleware(mf: MiniOxygen): NextHandleFunction {
  return async (req, res) => {
    let response;
    let status = 500;
    let headers = {};

    const reqHeaders: Record<string, string> = {};
    for (const key in req.headers) {
      const val = req.headers[key];
      if (Array.isArray(val)) {
        reqHeaders[key] = val.join(',');
      } else if (val !== undefined) {
        reqHeaders[key] = val;
      }
    }
    const request = new Request(urlFromRequest(req), {
      method: req.method,
      headers: reqHeaders,
    });

    try {
      response = await mf.dispatchFetch(request);
      status = response.status;
      headers = response.headers;
      res.writeHead(status, headers);

      if (response.body) {
        for await (const chunk of response.body) {
          if (chunk) res.write(chunk);
        }
      }

      res.end();
    } catch (e: any) {
      res.writeHead(500, {'Content-Type': 'text/plain; charset=UTF-8'});
      res.end(e.stack, 'utf8');
    }

    return response;
  };
}

export async function createServer(
  mf: MiniOxygen,
  {assetsDir}: MiniOxygenServerOptions
) {
  const app = connect();

  app.use(createAssetMiddleware({assetsDir}));
  app.use(createRequestMiddleware(mf));

  const server = http.createServer(app);

  return server;
}

function urlFromRequest(req: IncomingMessage) {
  const protocol = (req.socket as any).encrypted ? 'https' : 'http';
  const origin = `${protocol}://${req.headers.host ?? 'localhost'}`;
  const url = new URL(req.url ?? '', origin);

  return url;
}
