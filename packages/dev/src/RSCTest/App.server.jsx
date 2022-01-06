import {Suspense} from 'react';

// import LoadingFallback from './components/LoadingFallback';
import C1 from './C1.client';
import C2 from './C2.client';
import CShared from './CShared';

export default function App() {
  // const pages = import.meta.globEager('./pages/**/*.server.[jt]sx');

  return (
    <Suspense>
      <div className="p-5">
        <div>hello!</div>
        <C1 />
        <C2 myProp2={true} />
        <CShared myPropShared={true} />
      </div>
    </Suspense>
  );
}
