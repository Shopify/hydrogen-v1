import '../utilities/web-api-polyfill';
import connect from 'connect';
declare type CreateServerOptions = {
    cache?: Cache;
};
export declare function createServer({ cache }?: CreateServerOptions): Promise<{
    app: connect.Server;
}>;
export {};
