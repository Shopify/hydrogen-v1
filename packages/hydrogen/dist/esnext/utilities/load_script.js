const SCRIPTS_LOADED = {};
export function loadScript(src, options) {
    const isScriptLoaded = SCRIPTS_LOADED[src];
    if (isScriptLoaded) {
        return isScriptLoaded;
    }
    const promise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        if (options?.module) {
            script.type = 'module';
        }
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            reject(false);
        };
        document.body.appendChild(script);
    });
    SCRIPTS_LOADED[src] = promise;
    return promise;
}
