import {Suspense} from 'react';
import {createData} from '../utils';
import {Head} from '@shopify/hydrogen';

// Page with many Suspense boundaries to test streaming
export default function Index() {
  const d1 = createData('d1', 200);

  return (
    <>
      <h1>SEO</h1>

      <Head>
        <html lang="ja" />
        <meta property="og:url" content="example.com" />
        <body data-test={true} className="pb-2" />
      </Head>

      <Suspense fallback={null}>
        <div c="1">{d1.read()}</div>
        <span>stuff</span>

        <Head>
          <meta property="type" content="website" />
        </Head>
      </Suspense>

      <footer>footer!</footer>
    </>
  );
}
