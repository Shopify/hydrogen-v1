import {Link} from '@shopify/hydrogen';
import {ScriptsOnIdle} from './ScriptsOnIdle';

export default function ScriptsOnIdleTests() {
  return (
    <div className="ScriptsOnIdle">
      <h1>onIdle scripts tests</h1>
      <ScriptsOnIdle />

      <br />
      <Link id="next-page" to="/scripts/script/on-idle/next-page">
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
