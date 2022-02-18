import {Suspense} from 'react';
import {createData} from '../utils';
import {Helmet} from '@shopify/hydrogen/client';

// Page with many Suspense boundaries to test streaming
export default function Index() {
  const d1 = createData('d1', 200);

  return (
    <>
      <h1>SEO</h1>

      <Helmet>
        <html lang="ja" />
        <meta property="og:url" content="example.com" />
        <body data-test={true} />
      </Helmet>

      <Suspense fallback={null}>
        <div c="1">{d1.read()}</div>
        <span>stuff</span>

        <Helmet>
          <meta property="type" content="website" />
        </Helmet>
      </Suspense>

      <footer>footer!</footer>
    </>
  );
}
