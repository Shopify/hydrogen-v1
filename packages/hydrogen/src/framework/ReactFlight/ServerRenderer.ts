import type {Writable} from 'stream';
import type {BundlerConfig, ReactModel} from './ServerConfig';

// @ts-ignore
import createFlightRenderer from 'react-server/flight';
import rendererConfig from './ServerConfig';

const {createRequest, startWork, startFlowing} =
  createFlightRenderer(rendererConfig);

function createDrainHandler(destination: any, request: any) {
  return () => startFlowing(request, destination);
}

type Options = {
  onError?: (error: unknown) => void;
};

type Controls = {
  pipe<T = Writable>(destination: T): T;
};

function renderToPipeableStream(
  model: ReactModel,
  manifest?: BundlerConfig,
  options?: Options
): Controls {
  const request = createRequest(
    model,
    manifest || {},
    options ? options.onError : undefined
  );
  let hasStartedFlowing = false;
  startWork(request);
  return {
    pipe<T = Writable>(destination: T): T {
      if (hasStartedFlowing) {
        throw new Error(
          'React currently only supports piping to one writable stream.'
        );
      }
      hasStartedFlowing = true;
      startFlowing(request, destination);
      (destination as any).on(
        'drain',
        createDrainHandler(destination, request)
      );
      return destination;
    },
  };
}

function renderToReadableStream(
  model: ReactModel,
  manifest?: BundlerConfig,
  options?: Options
): ReadableStream {
  const request = createRequest(
    model,
    manifest || {},
    options ? options.onError : undefined
  );

  const stream = new ReadableStream({
    start(controller) {
      startWork(request);
    },
    pull(controller) {
      // Pull is called immediately even if the stream is not passed to anything.
      // That's buffering too early. We want to start buffering once the stream
      // is actually used by something so we can give it the best result possible
      // at that point.
      if (stream.locked) {
        startFlowing(request, controller);
      }
    },
    cancel(reason) {},
  });

  return stream;
}

// This will be a build-time variable to trigger tree-shaking
const __WORKER__ = typeof process === 'undefined';
// declare global {
// // eslint-disable-next-line no-var
//     var __WORKER__: boolean;
// }

const rscRenderToPipeableStream = __WORKER__
  ? undefined
  : renderToPipeableStream;

const rscRenderToReadableStream = __WORKER__
  ? renderToReadableStream
  : undefined;

export {rscRenderToPipeableStream, rscRenderToReadableStream};
