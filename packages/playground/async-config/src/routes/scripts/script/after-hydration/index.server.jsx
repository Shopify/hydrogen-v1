import {Link} from '@shopify/hydrogen';
import {ScriptsAfterHydration} from './ScriptsAfterHydration';

export default function ScriptsAfterHydrationRoute() {
  return (
    <div className="ScriptsAfterHydration">
      <h1>afterHydration scripts</h1>
      <ScriptsAfterHydration />

      <br />
      <Link id="next-page" to="/scripts/script/after-hydration/second-page">
        Simulate navigation
      </Link>
      <br />
      <Link to="/scripts">
        <br />
        Back
        <hr />
      </Link>
    </div>
  );
}
