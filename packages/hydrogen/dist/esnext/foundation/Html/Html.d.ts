import { ReactNode } from 'react';
import type { HelmetData as HeadData } from 'react-helmet-async';
import { ResolvedHydrogenConfig } from '../../types';
declare type HtmlOptions = {
    children: ReactNode;
    template: string;
    htmlAttrs?: Record<string, string>;
    bodyAttrs?: Record<string, string>;
    hydrogenConfig: ResolvedHydrogenConfig;
};
export declare function Html({ children, template, htmlAttrs, bodyAttrs, hydrogenConfig, }: HtmlOptions): JSX.Element;
export declare function applyHtmlHead(html: string, head: HeadData, template: string): string;
export {};
