import {createData} from '../utils';

export default function Lifecycle({request}) {
  const d1 = createData('d1', 100);
  const d2 = createData('d2', 100);

  // This is an experimental private API, do not use it
  request.on('done', 'unique-key', ({responseAppend}) =>
    responseAppend('<div data-test="lifecycle-done"></div>')
  );

  return (
    <div>
      <h1>Lifecycle</h1>
      <div>{d1.read()}</div>
      <div>{d2.read()}</div>
    </div>
  );
}
