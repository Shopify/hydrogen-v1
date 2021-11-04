export interface ClientModule {
  name: string;
  id: string;
}

/**
 * Track the client components discovered while rendering SSR output to wire syntax.
 */
export class ClientComponents {
  modules: string[] = [];

  add(module: ClientModule): number {
    this.modules.push(JSON.stringify(module));

    return this.modules.length;
  }

  indexOf(module: ClientModule) {
    return this.modules.indexOf(JSON.stringify(module)) + 1;
  }

  all() {
    return this.modules.map((module) => JSON.parse(module));
  }
}
