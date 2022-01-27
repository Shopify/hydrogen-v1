const SCRIPTS_LOADED: Record<string, Promise<boolean>> = {};

export function loadScript(src: string, options?: {module?: boolean}) {
  const isScriptLoaded: Promise<boolean> = SCRIPTS_LOADED[src];

  if (isScriptLoaded) {
    return isScriptLoaded;
  }

  const promise = new Promise<boolean>((resolve, reject) => {
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
