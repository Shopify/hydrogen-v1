/**
 * Wrap the fetch promise in a way that React Suspense understands.
 * Essentially, keep throwing something until you have legit data.
 */
export function wrapPromise(promise: Promise<any>) {
  let status = 'pending';
  let response: Promise<any> | any;

  const suspender = promise.then(
    (res) => {
      status = 'success';
      response = res;
    },
    (err) => {
      status = 'error';
      response = err;

      throw err;
    }
  );

  const read = () => {
    /**
     * TODO: This logic doesn't hold up when an error is thrown. For some reason.
     * We instead throw the exception above in the suspender. We should revisit
     * this and add a better server fetch implementation.
     */
    switch (status) {
      case 'pending':
        throw suspender;
      case 'error':
        throw response;
      default:
        return response;
    }
  };

  return {read};
}
