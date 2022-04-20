import {ServerComponentRequest} from '../../framework/Hydration/ServerComponentRequest.server';
import {HydrogenPlugin} from '../../types';
import {useServerRequest} from '../ServerRequestProvider';

export function runHook(
  hookName: keyof Omit<HydrogenPlugin, 'name'>,
  {
    url,
    request,
    plugins,
  }: {
    url: URL;
    request: ServerComponentRequest;
    plugins: HydrogenPlugin[];
  }
) {
  const promises = plugins
    .map((plugin) => {
      const hook = plugin[hookName];
      if (!hook) return;

      request.ctx.plugins[plugin.name] ??= {};
      return hook(url, request, request.ctx.plugins[plugin.name]);
    })
    .filter(Boolean);

  return promises.length > 0 ? Promise.all(promises) : undefined;
}

export function usePluginContext<T>(pluginName: string) {
  const request = useServerRequest();
  return request.ctx.plugins[pluginName] as T;
}
