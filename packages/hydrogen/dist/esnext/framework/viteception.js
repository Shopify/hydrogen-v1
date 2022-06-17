import { createServer } from 'vite';
export async function viteception(paths) {
    const isWorker = process.env.WORKER;
    delete process.env.WORKER;
    const server = await createServer({
        clearScreen: false,
        server: { middlewareMode: 'ssr' },
    });
    if (isWorker) {
        process.env.WORKER = isWorker;
    }
    const loaded = await Promise.all(paths.map((path) => server.ssrLoadModule(path)));
    await server.close();
    return { server, loaded };
}
