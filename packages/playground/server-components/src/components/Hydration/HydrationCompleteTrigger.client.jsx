import {useLayoutEffect} from 'react';

/*
  We use this button's onClick handler to measure when hydration
  is somewhat ready (e.g responding to clicks).

  HydrationCompleteListener.server.jsx (passed as children)
  triggers the clicks in 5ms intervals and waits for this event to be fired
  by the button click handler.
*/
let hydrated = false;
export default function HydrationComplete({children}) {
  useLayoutEffect(() => {
    if (hydrated) return;
    hydrated = true;
    const hydrationEvent = new CustomEvent('hydration-complete', {
      detail: {
        name: 'hydration-complete',
      },
    });

    window.dispatchEvent(hydrationEvent);
  }, []);

  return (
    <>
      <button id="hydration-button" hidden>
        Hydration Button
      </button>
      <div
        id="hydration-overlay"
        style={{
          position: 'fixed',
          top: '2rem',
          right: '2rem',
          backgroundColor: 'black',
          padding: '1rem',
          color: 'white',
        }}
      />

      {/* HydrogenCompleteListener will be injected here */}
      {children}
    </>
  );
}
