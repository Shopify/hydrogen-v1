import type {HandleMiddlewareParams} from '../../config';
import type {ResolvedHydrogenConfig} from '../../types';

const middlewares = [] as Array<[Record<string, {default: Function}>, string?]>;

//@INJECT_MIDDLEWARES

export default async function runMiddlewares(
  hydrogenConfig: ResolvedHydrogenConfig,
  params: HandleMiddlewareParams
) {
  const {request} = params;
  for (const [middlewareImport, name = 'default'] of middlewares) {
    const [middleware] = Object.values(middlewareImport);
    if (middleware && middleware.default) {
      const plugin = hydrogenConfig.plugins?.find((p) => p.name === name);

      const context = plugin?.context || {};
      request.ctx.scopes.set(name, context);

      let result = middleware.default({...params, context});
      if (result instanceof Promise) result = await result;
      if (result instanceof Response) return result;
    }
  }
}
