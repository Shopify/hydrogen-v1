import {useEffect, useRef} from 'react';
import {ClientAnalytics} from '@shopify/hydrogen';

export function PageViewEvent() {
  const init = useRef(false);

  useEffect(() => {
    if (!init.current) {
      init.current = true;

      // Fire GTM page view event, on hydrogen's page view event
      ClientAnalytics.subscribe(
        ClientAnalytics.eventNames.PAGE_VIEW,
        (payload) => {
          console.log('Triggering GTM PAGE_VIEW with', payload);
          dataLayer.push({event: 'gtm.js', payload});
          gtag('event', 'page_view', payload);
        }
      );
    }
  }, []);
}
