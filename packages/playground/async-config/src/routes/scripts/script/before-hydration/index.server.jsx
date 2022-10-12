import {Link} from '@shopify/hydrogen';
import {Script} from '@shopify/hydrogen/experimental';

export default function ScriptsBeforeHydration() {
  return (
    <div className="ScriptsBeforeHydration">
      <h1>beforeHydration scripts</h1>
      <p>
        {`<Scripts load="beforeHydration"/>`} are run if rendered at the initial
        page load (like regular {`<script />`} tags).
      </p>
      <p>
        For this reason, these should be included inside shared components like{' '}
        {`"layouts"`} and {`"App.server.tsx."`}
      </p>

      <Link to="/scripts">
        <br />
        Back
        <hr />
      </Link>

      {/* eslint-disable-next-line hydrogen/prefer-script-component */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            console.log('Standard inlined <script dangerouslySetInnerHTML />');
          `,
        }}
      />

      {/* eslint-disable-next-line hydrogen/scripts-in-layout-components */}
      <Script
        id="beforeHydration-dangerouslySetInnerHTML"
        load="beforeHydration"
        dangerouslySetInnerHTML={{
          __html: `
            console.log("💨 Inline <Script beforeHydration dangerouslySetInnerHTML/> injected window._learnq");
            window._learnq = window._learnq || {};
          `,
        }}
      />

      {/* eslint-disable-next-line hydrogen/scripts-in-layout-components */}
      <Script id="beforeHydration-children" load="beforeHydration">
        {`console.log('💨 Inline <Script beforeHydration children/> injected window.dataLayer');`}
        {`window.dataLayer = window.dataLayer || [];`}
      </Script>

      {/* eslint-disable-next-line hydrogen/scripts-in-layout-components */}
      <Script
        load="beforeHydration"
        id="beforeHydration-src"
        src="/scripts/cdn?script=before-hydration-script.js"
      />
    </div>
  );
}
