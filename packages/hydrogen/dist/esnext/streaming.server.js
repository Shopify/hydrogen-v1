export { renderToPipeableStream as ssrRenderToPipeableStream, // Only available in Node context
renderToReadableStream as ssrRenderToReadableStream, // Only available in Browser/Worker context
 } from 'react-dom/server';
// @ts-ignore
import { renderToReadableStream as _rscRenderToReadableStream } from '@shopify/hydrogen/vendor/react-server-dom-vite/writer.browser.server';
// @ts-ignore
import { createFromReadableStream as _createFromReadableStream } from '@shopify/hydrogen/vendor/react-server-dom-vite';
export const rscRenderToReadableStream = _rscRenderToReadableStream;
export const createFromReadableStream = _createFromReadableStream;
export async function bufferReadableStream(reader, cb) {
    const decoder = new TextDecoder();
    let result = '';
    while (true) {
        const { done, value } = await reader.read();
        if (done)
            break;
        const stringValue = typeof value === 'string' ? value : decoder.decode(value);
        result += stringValue;
        if (cb) {
            cb(stringValue);
        }
    }
    return result;
}
