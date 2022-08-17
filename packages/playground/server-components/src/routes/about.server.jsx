import {CacheNone} from '@shopify/hydrogen';
import {ClientCounter as Counter} from '../components/index3';

export default function About({response}) {
  response.cache(CacheNone());

  return (
    <div>
      <h1>About</h1>
      <Counter />
    </div>
  );
}
