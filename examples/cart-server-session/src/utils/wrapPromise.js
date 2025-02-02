export function wrapPromise(promise, state) {
  const suspender = promise.then(
    (res) => {
      state.status = 'success';
      state.response = res;
    },
    (err) => {
      state.status = 'error';
      state.response = err;
    }
  );

  function read() {
    console.log('state.status', state.status);
    switch (state.status) {
      case 'pending':
        throw suspender;
      case 'error':
        throw state.response;

      default:
        return state.response;
    }
  }

  return {read};
}
