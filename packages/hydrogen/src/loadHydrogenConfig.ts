import {createServer} from 'vite';
import hydrogenVirtualFiles from './framework/plugins/vite-plugin-hydrogen-virtual-files';

export async function loadHydrogenConfig(path: string[]) {
  const server = await createServer({
    clearScreen: false,
    server: {middlewareMode: 'ssr'},
    plugins: [hydrogenVirtualFiles({})],
  });

  const loaded = await server.ssrLoadModule(
    'virtual__proxy__hydrogen.config.ts'
  );

  await server.close();

  return loaded.default;
}
