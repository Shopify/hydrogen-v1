// Examples of **incorrect** code for this rule:

// MyComponent.jsx or MyComponent.server.jsx
import {useState} from 'react';

function MyNonClientComponent() {
  const [state, setState] = useState();
  return null;
}
