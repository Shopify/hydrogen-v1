/* eslint-disable @typescript-eslint/no-empty-function */
/**
 * HydrationWriter is an implementation of `WritableStream` which
 * keeps track of chunks emitted from React's `pipeToNodeWritable`.
 */
export class HydrationWriter {
  private chunks: string[] = [];
  drainCallback: () => any = () => {};

  write(chunk: any) {
    this.chunks.push(chunk.toString());
  }

  on(event: string, callback: any) {
    if (event === Events.drain) {
      this.drainCallback = callback;
    }
  }

  drain() {
    this.drainCallback();
  }

  destroy() {}
  end() {}

  toString() {
    return this.chunks.join('');
  }
}

const Events = {
  drain: 'drain',
};
