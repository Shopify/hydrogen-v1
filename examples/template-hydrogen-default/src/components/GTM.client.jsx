import Analytics from 'analytics';
import googleTagManager from '@analytics/google-tag-manager';
import {useEffect} from 'react';

let init = false;
export default function GTM() {
  useEffect(() => {
    if (!init) {
      // One time initialization
      Analytics({
        app: 'hydrogen-app',
        plugins: [
          googleTagManager({
            containerId: 'GTM-WLTS4QF',
          }),
        ],
      });
      init = true;
    }
  });
  return null;
}
