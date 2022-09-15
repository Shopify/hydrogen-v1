import {Script} from '@shopify/hydrogen/experimental';

export default function HydrationCompleteListener() {
  return (
    <Script
      id="hydration-complete"
      load="beforeHydration"
      dangerouslySetInnerHTML={{
        __html: `
          const start = performance.now();
          let end;
          let interval;

          // This event is fired by the button click handler which will
          // only happen when the button is hydrated.
          window.addEventListener('hydration-complete', function() {
            end = performance.now();
            const message = '💦 Hydration completed in: '+ Math.round(end - start) + 'ms';
            console.log('------------------------------------------------------------');
            console.log(message);
            console.log('------------------------------------------------------------');

            const overlay = document.getElementById('hydration-overlay');
            overlay.innerHTML = message;
            clearInterval(interval);
            observer.disconnect();
          })
        `,
      }}
    />
  );
}
