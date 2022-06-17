import type { ResolvedHydrogenConfig } from '../../types';
export declare function ServerAnalyticsRoute(request: Request, { hydrogenConfig }: {
    hydrogenConfig: ResolvedHydrogenConfig;
}): Promise<Response>;
