import {check} from 'k6';
import http from 'k6/http';

export const options = {
  vus: 10,
  duration: '10s',
};

export default function () {
  const res = http.get(
    'https://hydrogen-11.shopify-oxygen-platform.workers.dev/'
  );

  check(res, {
    'Error connecting to data source': (r) => {
      const hitError = r.body.includes(
        'Error: The fetch attempt failed; there was an issue connecting to the data source.'
      );

      return hitError;
    },
  });
}
