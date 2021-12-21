import runAsync from './async-stuff';

export default function CAsync2() {
  const result = runAsync('CAsync2');

  return <div>c-async-2 {String(result)}</div>;
}
