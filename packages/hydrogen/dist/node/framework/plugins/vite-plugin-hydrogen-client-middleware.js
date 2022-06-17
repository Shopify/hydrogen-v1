"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
/**
 * This dev server middleware prevents Vite from applying immutable cache control headers to client
 * components. These client components are part of the user's local source, but since they are
 * referenced via import globs in the `react-dom-server-vite` NPM package, Vite assumes they
 * are 3P deps that can be cached. This middleware responds to the requests early with `no-cache`.
 */
exports.default = () => {
    return {
        name: 'vite-plugin-hydrogen-client-middleware',
        enforce: 'pre',
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                const url = req.url;
                try {
                    if (url.includes('.client.js') &&
                        url.includes('?v=') &&
                        !url.includes('node_modules')) {
                        const result = await server.transformRequest(url, { html: false });
                        if (result) {
                            return (0, vite_1.send)(req, res, result.code, 'js', {
                                etag: result.etag,
                                cacheControl: 'no-cache',
                                headers: server.config.server.headers,
                                map: result.map,
                            });
                        }
                    }
                }
                catch (e) {
                    next(e);
                }
                next();
            });
        },
    };
};
