import type {ViteDevServer} from 'vite';

export type DevServerMessage =
  | {
      type: 'warn';
      data: string;
    }
  | {
      type: 'error';
      data: {message: string; stack: string};
    };

export function sendMessageToClient(message: DevServerMessage) {
  // @ts-ignore
  const devServer = globalThis.__viteDevServer as ViteDevServer;

  if (devServer) {
    devServer.ws.send({
      type: 'custom',
      event: 'hydrogen',
      data: message,
    });
  }
}
