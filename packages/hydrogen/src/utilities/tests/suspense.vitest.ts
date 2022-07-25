import {vi, type Mock} from 'vitest';
import {wrapPromise} from '../suspense.js';

function promiseSuccess(expectedReturn: string) {
  return new Promise<string>((resolve) => {
    resolve(expectedReturn);
  });
}

function promiseFail(errMessage: string) {
  return new Promise<string>((_, reject) => {
    reject(errMessage);
  });
}

async function suspenseLikeBehaviour(
  errorBoundary: Mock,
  suspenseBoundary: Mock,
  wrongErrorBoundary: Mock,
  promiseOrWrappedPromise: Promise<string> | ReturnType<typeof wrapPromise>
): Promise<string> {
  try {
    let data: ReturnType<typeof wrapPromise>;
    let result: any;
    if ('read' in promiseOrWrappedPromise) {
      data = promiseOrWrappedPromise;
    } else {
      data = wrapPromise(promiseOrWrappedPromise);
    }
    try {
      result = data.read();
    } catch (err) {
      if (typeof err === 'object' && 'then' in err!) {
        // In actual suspense implementation, the component doesnt attempt
        // a rerender until after the promise resolves, so this is a decent
        // substitution to mocking that behaviour.
        suspenseBoundary();
        await err;
        return suspenseLikeBehaviour(
          errorBoundary,
          suspenseBoundary,
          wrongErrorBoundary,
          data
        );
      } else {
        errorBoundary();
        result = err;
      }
    }
    return result;
  } catch (e) {
    // this catch should never be triggered, it represents
    // the error bubbling up outside of the errorboundar/ suspense
    // that wraps the function using the data
    wrongErrorBoundary();
    return 'Whoops';
  }
}

let errorBoundary: Mock, suspenseBoundary: Mock, wrongErrorBoundary: Mock;

describe('Suspense', () => {
  beforeEach(() => {
    errorBoundary = vi.fn();
    suspenseBoundary = vi.fn();
    wrongErrorBoundary = vi.fn();
  });

  it('resolves to the expected value on a successful promise resolve', async () => {
    const expected = 'succeeded';
    const res = await suspenseLikeBehaviour(
      errorBoundary,
      suspenseBoundary,
      wrongErrorBoundary,
      promiseSuccess(expected)
    );
    expect(wrongErrorBoundary).toBeCalledTimes(0);
    expect(errorBoundary).toBeCalledTimes(0);
    expect(suspenseBoundary).toBeCalledTimes(1);
    expect(res).toBe(expected);
  });

  it('hits the correct error boundary on a thrown error', async () => {
    const expected = 'Error';
    const res = await suspenseLikeBehaviour(
      errorBoundary,
      suspenseBoundary,
      wrongErrorBoundary,
      promiseFail(expected)
    );
    expect(wrongErrorBoundary).toBeCalledTimes(0);
    expect(errorBoundary).toBeCalledTimes(1);
    expect(suspenseBoundary).toBeCalledTimes(1);
    expect(res).toBe(expected);
  });
});
