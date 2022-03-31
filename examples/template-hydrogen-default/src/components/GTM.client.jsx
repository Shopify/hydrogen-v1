import Analytics from 'analytics';
import googleTagManager from '@analytics/google-tag-manager';

Analytics({
  app: 'hydrogen-app',
  plugins: [
    googleTagManager({
      containerId: 'GTM-WLTS4QF',
    }),
  ],
});

export default function GTM() {
  return null;
}
