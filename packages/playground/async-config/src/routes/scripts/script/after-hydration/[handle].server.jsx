import {Link} from '@shopify/hydrogen';
import {ScriptsAfterHydration} from './ScriptsAfterHydration';

export default function ScriptsAfterHydrationNestedRoute() {
  return (
    <div className="ScriptsAfterHydrationNestedRoute">
      <h1>afterHydration (nested) scripts</h1>
      <ScriptsAfterHydration />

      <Link to="/scripts/script/after-hydration">
        <br />
        Back
        <hr />
      </Link>
    </div>
  );
}
