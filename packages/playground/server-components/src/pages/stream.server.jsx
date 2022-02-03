import {defer} from '@shopify/hydrogen/dist/esnext/utilities/defer';
import {Suspense} from 'react';
import Counter from '../components/Counter.client';
import {useServerRequest} from '@shopify/hydrogen';

const fakeCache = {};

const createData = (key, ms) => {
  if (!fakeCache[key]) {
    let result;
    const deferred = defer();
    setTimeout(deferred.resolve, ms);
    deferred.promise.then((r) => {
      result = r;
    });

    fakeCache[key] = {
      read: () => {
        if (deferred.status === 'pending') {
          throw deferred.promise;
        }

        return result || 'done';
      },
    };
  }

  return fakeCache[key];
};

// Page with many Suspense boundaries to test streaming
export default function Index() {
  const d1 = createData('d1', 100);
  const d2 = createData('d2', 200);
  const d3 = createData('d3', 300);
  const d4 = createData('d4', 300);
  const d5 = createData('d5', 400);

  const text = useServerRequest().url.includes('/react?')
    ? 'Long text to make RSC response heavier'.repeat(2000)
    : '';

  return (
    <>
      <h1>Streaming</h1>

      {text}

      <Suspense fallback={null}>
        <div c="1">{d1.read()}</div>
        <span>stuff</span>
      </Suspense>

      <span>hi</span>
      <Suspense fallback={null}>
        <div c="2">{d2.read()}</div>
        <Suspense fallback={null}>
          <div c="3">{d3.read()}</div>
          <Counter />
        </Suspense>

        <span>hi</span>
        <Suspense fallback={null}>
          <div c="4">{d4.read()}</div>
          <Suspense fallback={null}>
            <div c="5">{d5.read()}</div>
          </Suspense>
          <span>stuff</span>
        </Suspense>
      </Suspense>

      <footer>footer!</footer>
    </>
  );
}
