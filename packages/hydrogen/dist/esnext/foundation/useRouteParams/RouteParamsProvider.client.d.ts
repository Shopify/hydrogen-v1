import React, { FC, ReactNode } from 'react';
declare type RouteParamsContextValue = {
    routeParams: Record<string, string>;
};
export declare const RouteParamsContext: React.Context<RouteParamsContextValue>;
export declare const RouteParamsProvider: FC<{
    routeParams: Record<string, string>;
    children: ReactNode;
}>;
export {};
