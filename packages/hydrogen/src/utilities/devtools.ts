import type {ViteDevServer} from 'vite';

type DevMessageTopic = 'warn';

export function sendMessageToClient(topic: DevMessageTopic, data: unknown) {
  // @ts-ignore
  const devServer = globalThis.__viteDevServer as ViteDevServer;

  if (devServer) {
    devServer.ws.send({
      type: 'custom',
      event: 'hydrogen:' + topic,
      data,
    });
  }
}
