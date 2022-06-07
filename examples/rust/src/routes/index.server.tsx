import React from 'react';
import {fib} from '../rust.server';

export default function Home() {
  return (
    <>
      <p>Hello: {fib(30)}</p>
    </>
  );
}
