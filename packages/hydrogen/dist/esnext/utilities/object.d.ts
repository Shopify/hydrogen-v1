declare type Descriptor = Parameters<typeof Object.defineProperty>[2];
export declare function createObject<T = object>(properties: T, { prototype, ...descriptor }?: {
    prototype?: any;
} & Exclude<Descriptor, 'value'>): T;
export {};
