/**
 * SuspensePromise - Externalize the status and the result of a promise
 *
 * In order for R18 to suspend on a data promise, on status
 *
 * 'pending'  - throw this.promise
 * 'success'  - return this.result
 * 'error'    - Deal with error object in this.result
 *
 * When R18 process a component that throws a promise, it will
 * try to process the same component again at a later time
 */

export class SuspensePromise<T> {
  static PENDING = 'pending';
  static SUCCESS = 'success';
  static ERROR = 'error';

  status: string = SuspensePromise.PENDING;
  promise: Promise<T>;
  result: T | undefined;

  constructor(promiseFn: () => Promise<T>) {
    this.promise = promiseFn();
    this.promise.then(
      (r) => {
        this.status = SuspensePromise.SUCCESS;
        this.result = r;
      },
      (e) => {
        this.status = SuspensePromise.ERROR;
        this.result = e;
      }
    );
  }
}
