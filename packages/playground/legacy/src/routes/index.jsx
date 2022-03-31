import {Link, useRouteData} from '@shopify/hydrogen';
import {useState} from 'react';

export async function data() {
  return 'Hello, world';
}

export default function Index() {
  const [count, setCount] = useState(0);
  const data = useRouteData();

  return (
    <div>
      <h1>{data}</h1>
      <button onClick={() => setCount((c) => c + 1)}>{count}</button>
      <Link to="/about">About</Link>
    </div>
  );
}
