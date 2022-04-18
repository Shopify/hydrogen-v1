import {useState} from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2 className="count">Count is {count}</h2>
      <button className="increase" onClick={() => setCount(count + 1)}>
        increase count
      </button>
    </div>
  );
}
