import {useQuery} from '@shopify/hydrogen';

export default function Error() {
  useQuery(
    'async-error',
    () => new Promise((resolve) => setTimeout(resolve, 20))
  );
  // eslint-disable-next-line no-undef
  itBroke();
  return <div>Hi</div>;
}
