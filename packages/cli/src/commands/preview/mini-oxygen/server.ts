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
  autoReload: boolean;
}

const SSEUrl = '/events';
const autoReloadScript = `<script defer type="application/javascript">
(function () {
  // MiniOxygen Auto Reload
  var source = new EventSource('${SSEUrl}');
  source.addEventListener('open', function(e) { console.log('Auto Reload Enabled') }, false);
  source.onmessage = function(e) { if (e.data === 'connected') {console.log('Listening for events...');} else if (e.data === 'reload') {location.reload();} };
})();
</script>`;
const autoReloadScriptLength = Buffer.byteLength(autoReloadScript);

function createAssetMiddleware({assetsDir}: {assetsDir: string}): NextHandleFunction {
  return (req, res, next) => {
    const filePath = path.join(assetsDir, req.url!);
  
    if (req.url !== '/' && fs.existsSync(filePath)) {
      const rs = fs.createReadStream(filePath);
      const {size} = fs.statSync(filePath);

      res.setHeader('Content-Type', mime.getType(filePath)!);
      res.setHeader('Content-Length', size);

      return rs.pipe(res);
    }

    next();
  };
}

function writeSSE(res: http.ServerResponse, data: string) {
  const id = (new Date()).toLocaleTimeString();
  res.write(`id: ${id}` + '\n');
  res.write(`data: ${data}` + '\n\n');
}

function createAutoReloadMiddleware(mf: MiniOxygen): NextHandleFunction {
  return async (req, res) => {
    if (req.headers.accept && req.headers.accept == 'text/event-stream') {
      mf.addEventListener('reload', () => writeSSE(res, 'reload'));

      res.writeHead(200, {
        'Content-Type' : 'text/event-stream',
        'Cache-Control' : 'no-cache',
        'Connection' : 'keep-alive'
      });
    
      return writeSSE(res, 'connected');
    } else {
      res.writeHead(400).end("Bad Request");
    }
  }
}
 
function createRequestMiddleware(mf: MiniOxygen, autoReload: boolean): NextHandleFunction {
  return async (req, res) => {
    let response;
    let status = 500;
    const headers: http.OutgoingHttpHeaders = {};

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

      for (const key in req.headers) {
        const val = req.headers[key];
        if (Array.isArray(val)) {
          headers[key] = val.join(',');
        } else if (val !== undefined) {
          headers[key] = val;
        }
      }
      
      if (autoReload) {
        const contentLength = response.headers.get('content-length');
        if (contentLength) {
          headers['content-length'] = parseInt(contentLength, 10) + autoReloadScriptLength;
        }
      }

      res.writeHead(status, headers);

      if (response.body) {
        for await (const chunk of response.body) {
          if (chunk) res.write(chunk);
        }

        if (autoReload) {
          res.write(autoReloadScript);
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
  {assetsDir, autoReload}: MiniOxygenServerOptions
) {
  const app = connect();

  app.use(createAssetMiddleware({assetsDir}));
  if (autoReload) {
    app.use(SSEUrl, createAutoReloadMiddleware(mf));
  }

  app.use(createRequestMiddleware(mf, autoReload));

  const server = http.createServer(app);

  return server;
}

function urlFromRequest(req: IncomingMessage) {
  const protocol = (req.socket as any).encrypted ? 'https' : 'http';
  const origin = `${protocol}://${req.headers.host ?? 'localhost'}`;
  const url = new URL(req.url ?? '', origin);

  return url;
}
