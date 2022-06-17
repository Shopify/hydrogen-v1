"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.viteception = void 0;
const vite_1 = require("vite");
async function viteception(paths) {
    const isWorker = process.env.WORKER;
    delete process.env.WORKER;
    const server = await (0, vite_1.createServer)({
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
exports.viteception = viteception;
