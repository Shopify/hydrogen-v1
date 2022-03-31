// Incorrect code

// MyServerComponent.server.jsx or MyServerComponent.jsx

import {useState} from 'react';

export function MyNonClientComponent() {
  const [state, setState] = useState();
  return null;
}
