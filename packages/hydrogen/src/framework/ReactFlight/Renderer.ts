import type {Writable} from 'stream';
import type {BundlerConfig, ReactModel} from './Config';

// @ts-ignore
import createFlightRenderer from 'react-server/flight';
import rendererConfig from './Config';

const {createRequest, startWork, startFlowing} =
  createFlightRenderer(rendererConfig);

function createDrainHandler(destination: any, request: any) {
  return () => startFlowing(request, destination);
}

type Options = {
  onError?: (error: any) => void;
};

type Controls = {
  pipe<T = Writable>(destination: T): T;
};

function renderToPipeableStream(
  model: ReactModel,
  webpackMap: BundlerConfig,
  options?: Options
): Controls {
  const request = createRequest(
    model,
    webpackMap,
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

export {renderToPipeableStream};
