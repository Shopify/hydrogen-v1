import {Link} from '@shopify/hydrogen';
import {ScriptsOnIdle} from './ScriptsOnIdle';

export default function ScriptsOnIdleTests() {
  return (
    <div className="ScriptsOnIdle">
      <h1>onIdle scripts tests (nested)</h1>
      <ScriptsOnIdle />

      <Link to="/scripts/script/on-idle">
        <br />
        Back
        <hr />
      </Link>
    </div>
  );
}
