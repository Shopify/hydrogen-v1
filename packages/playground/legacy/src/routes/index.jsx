import {Link} from '@shopify/hydrogen';
import {useState} from 'react';

export default function Index() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Hello, world</h1>
      <button onClick={() => setCount((c) => c + 1)}>Click me: {count}</button>
      <p>
        <Link to="/about">About</Link>
      </p>
    </div>
  );
}
