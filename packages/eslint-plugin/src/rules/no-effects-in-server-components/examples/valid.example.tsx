// Examples of **correct** code for this rule:

// MyClientComponent.client.jsx
import {useEffect} from 'react';

function MyClientComponent() {
  useEffect(() => {
    // in client components, this code will execute as expected
  });
  return null;
}
