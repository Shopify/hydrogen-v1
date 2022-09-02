import {useQuery} from '@shopify/hydrogen';

export default function ({response}) {
  useQuery(
    'somekey',
    () => new Promise((resolve) => setTimeout(() => resolve(), 100))
  );
  response.doNotStream();
  return <div>Call doNotStream after stream has already begun</div>;
}
