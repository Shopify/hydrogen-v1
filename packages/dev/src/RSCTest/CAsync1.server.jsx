import runAsync from './async-stuff';
import CAsync2 from './CAsync2.server';

export default function CAsync1() {
  const result = runAsync('CAsync1');

  return (
    <div>
      c-async-1 {String(result)}
      <div>
        <CAsync2></CAsync2>
      </div>
    </div>
  );
}
