export declare function viteception(paths: string[]): Promise<{
    server: import("vite").ViteDevServer;
    loaded: Record<string, any>[];
}>;
