import {Link} from '@shopify/hydrogen';

export default function ScriptTestRoute() {
  return (
    <ol>
      <li>
        <Link to="/scripts/script/before-hydration">
          <code>{`<Script load="beforeHydration" /> tests (SPA)`}</code>
        </Link>
      </li>
      <li>
        <a href="/scripts/script/before-hydration">
          <code>{`<Script load="beforeHydration" /> tests (MPA)`}</code>
        </a>
      </li>
      <li>
        <Link to="/scripts/script/in-worker">
          <code>{`<Script load="inWorker" /> tests`}</code>
        </Link>
      </li>
      <li>
        <Link to="/scripts/script/after-hydration">
          <code>{`<Script load="afterHydration" /> tests`}</code>
        </Link>
      </li>
      <li>
        <Link to="/scripts/script/on-idle">
          <code>{`<Script load="onIdle" /> tests`}</code>
        </Link>
      </li>
      <li>
        <Link to="/scripts/use-script">
          <code>{`useScript tests`}</code>
        </Link>
      </li>
    </ol>
  );
}
