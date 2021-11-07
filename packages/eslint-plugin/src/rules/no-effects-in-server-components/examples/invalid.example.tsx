// Examples of **incorrect** code for this rule:

// MyComponent.jsx or MyComponent.server.jsx
import {useEffect} from 'react';

function MyNonClientComponent() {
  useEffect(() => {
    // code inside this useEffect will not execute as expected
  });

  return null;
}
