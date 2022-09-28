import {Link} from '@shopify/hydrogen';
import UseLoadScripts from './UseLoadScripts';

export default function () {
  return (
    <>
      <UseLoadScripts />

      <Link to="/scripts/use-script">
        <br />
        Simulate navigation (back)
        <hr />
      </Link>
    </>
  );
}
