import {StrictMode} from 'react';
import ReactDOM from 'react-dom';
import {test} from './src/index';

function ComponentPlayground() {
  return (
    <div>
      You can develop and play with your client-side components in the
      ComponentPlayground.tsx file.
      <div>{test}</div>
    </div>
  );
}

ReactDOM.render(
  <StrictMode>
    <ComponentPlayground />
  </StrictMode>,
  document.getElementById('root')
);
