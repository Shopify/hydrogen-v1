import type {HandleMiddlewareParams} from '../../config';

const middlewares = [] as Array<Record<string, {default: Function}>>;

//@INJECT_MIDDLEWARES

export default async function handleMiddleware({
  request,
}: HandleMiddlewareParams) {
  for (const middleware of middlewares) {
    const [middlewareImport] = Object.values(middleware);
    if (middlewareImport && middlewareImport.default) {
      let result = middlewareImport.default({request});
      if (result instanceof Promise) result = await result;
      if (result instanceof Response) return result;
    }
  }
}
