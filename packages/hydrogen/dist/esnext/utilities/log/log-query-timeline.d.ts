import { HydrogenRequest } from '../../foundation/HydrogenRequest/HydrogenRequest.server';
import { QueryKey } from '../../types';
import type { RenderType } from './log';
export declare type TimingType = 'requested' | 'resolved' | 'rendered' | 'preload';
export declare type QueryTiming = {
    name: string;
    timingType: TimingType;
    timestamp: number;
    duration?: number;
};
export declare function collectQueryTimings(request: HydrogenRequest, queryKey: QueryKey, timingType: TimingType, duration?: number): void;
export declare function logQueryTimings(type: RenderType, request: HydrogenRequest): void;
