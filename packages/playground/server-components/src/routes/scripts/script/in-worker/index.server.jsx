import {Link} from '@shopify/hydrogen';
import {Script} from '@shopify/hydrogen/experimental';

export default function ScriptsInWorker() {
  return (
    <div className="ScriptsInWorker">
      <h1>inWorker scripts</h1>
      <p>
        {`<Scripts load="inWorker"/>`} are loaded by partytown only if rendered
        on the initial page load markup (like regular {`<script />`} tags).
      </p>
      <p>
        For this reason, these should be included inside shared components like{' '}
        {`\"layouts\"`} and {`\"App.server.tsx.\"`}
      </p>

      <Link to="/scripts">
        <br />
        Back
        <hr />
      </Link>

      <div id="partytown-widget">
        Partytown loaded script will inject here...
      </div>

      <div>
        <hr />
        <a
          target="_blank"
          href="https://partytown.builder.io/tests/benchmarks/"
          rel="noreferrer"
        >
          Partytown benchmark
        </a>
        <h1 id="h1">
          <span id="title"></span>
          <span id="result" hidden="">
            running...
          </span>
        </h1>
        <table id="results"></table>
        <div id="output"></div>
      </div>

      {/* Test forwarded function from worker  */}
      {/* eslint-disable-next-line hydrogen/scripts-in-layout-components */}
      <Script id="beforeHydration-children" load="beforeHydration">
        {`console.log('⚙️ Inline <Script beforeHydration children/> executing worker forwardedTestFn');`}
        {`setTimeout(()=>forwardedTestFn(Math.random() * 10), 1500);`}
      </Script>

      {/* Test forwarded function from worker  */}
      <Script id="onIdle-test-inWorker-forward-local" load="onIdle">
        {`
          console.log('⚙️ <Script onIdle inWorker forward children/> executing worker forwardedTestFn()');
          setTimeout(()=>forwardedTestFn(Math.random() * 10), 1000);
        `}
      </Script>

      <Script id="onIdle-test-inWorker-forward-gtm" load="onIdle">
        {`
          console.log('⚙️ <Script onIdle inWorker forward children/> executing worker dataLayer.push');
          window.dataLayer = window.dataLayer || [];
          function gtag(){
            dataLayer.push(arguments)
            console.log('🔬 dataLayer updated', dataLayer);
          };
          gtag('js', new Date());
          gtag('config', "GTM-N5D3D8Q");
          gtag("event", "view_item", {
            currency: "USD",
            value: 7.77,
            items: [
              {
                item_id: "SKU_12345",
                item_name: "Stan and Friends Tee",
                affiliation: "Google Merchandise Store",
                coupon: "SUMMER_FUN",
                currency: "USD",
                discount: 2.22,
                index: 0,
                item_brand: "Google",
                item_category: "Apparel",
                item_category2: "Adult",
                item_category3: "Shirts",
                item_category4: "Crew",
                item_category5: "Short sleeve",
                item_list_id: "related_products",
                item_list_name: "Related Products",
                item_variant: "green",
                location_id: "ChIJIQBpAG2ahYAR_6128GcTUEo",
                price: 9.99,
                quantity: 1
              }
            ]
          });
        `}
      </Script>

      {/* eslint-disable-next-line hydrogen/scripts-in-layout-components */}
      <Script
        load="inWorker"
        src="/scripts/cdn?script=in-worker-script.js"
        id="inWorker-local-src"
      />

      {/*  actual third party scripts loaded via webworker  */}
      {/* eslint-disable-next-line hydrogen/scripts-in-layout-components */}
      <Script
        load="inWorker"
        id="inWorker-analytics-head"
        src="https://www.google-analytics.com/analytics.js?cors=true"
      />

      {/* eslint-disable-next-line hydrogen/scripts-in-layout-components */}
      <Script
        load="inWorker"
        id="inWorker-gtm"
        src="https://www.googletagmanager.com/gtm.js?id=GTM-N5D3D8Q"
      />

      {/* eslint-disable-next-line hydrogen/scripts-in-layout-components */}
      <Script
        id="inWorker-benchmark"
        load="inWorker"
        src="https://partytown.builder.io/tests/benchmarks/benchmark.js"
      />
    </div>
  );
}
