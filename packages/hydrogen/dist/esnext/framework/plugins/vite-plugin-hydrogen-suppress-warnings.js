export default () => {
    return {
        name: 'hydrogen:suppress-warnings',
        configResolved(config) {
            // TODO: Fix the actual issues that cause these warnings
            const filterOut = (msg) => msg.startsWith("@shopify/hydrogen doesn't appear to be written in CJS") ||
                (msg.includes('missing source files') &&
                    ['kolorist'].some((lib) => msg.includes(lib)));
            for (const method of ['warn', 'warnOnce']) {
                const original = config.logger[method];
                config.logger[method] = (msg, ...args) => {
                    if (filterOut(msg))
                        return;
                    return original(msg, ...args);
                };
            }
        },
    };
};
