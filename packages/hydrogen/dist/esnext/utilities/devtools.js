export function sendMessageToClient(client = 'browser-console', payload) {
    // @ts-ignore
    const devServer = globalThis.__viteDevServer;
    if (devServer) {
        devServer.ws.send({
            type: 'custom',
            event: `hydrogen-${client}`,
            data: payload,
        });
    }
}
