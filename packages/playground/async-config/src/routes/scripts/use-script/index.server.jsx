import {Link} from '@shopify/hydrogen';
import UseLoadScripts from './UseLoadScripts';

export default function () {
  return (
    <>
      <UseLoadScripts />

      <Link id="next-page" to="/scripts/use-script/test">
        <br />
        Simulate navigation
        <hr />
      </Link>
      <Link to="/scripts">
        <br />
        Back to /scripts
        <hr />
      </Link>
    </>
  );
}
