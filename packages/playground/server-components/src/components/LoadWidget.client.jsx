import {useLoadScript} from '@shopify/hydrogen';

export function LoadWidgets() {
  useLoadScript('https://cdn.judge.me/widget_preloader.js', {in: 'head'});
  useLoadScript('https://cdn.judge.me/assets/installed.js', {in: 'head'});
  useLoadScript('https://www.googletagmanager.com/gtag/js?id=UA-XXXXXXXXX-X}', {
    in: 'body',
  });

  return (
    <>
      <div
        dangerouslySetInnerHTML={{
          __html: `
            <script>
              // GTM
              dataLayer = window.dataLayer || [];

              function gtag() {
                dataLayer.push(arguments);
              }
              gtag('js', new Date());

              // judge.me
              jdgm = window.jdgm || {};
              jdgm.SHOP_DOMAIN = 'glow-beverages.myshopify.com';
              jdgm.PLATFORM = 'shopify';
              jdgm.PUBLIC_TOKEN = '96NJDp3a08tDLK6Y-iWCwziOwCc';
            </script>
          `,
        }}
      />

      <div className="jdgm-widget jdgm-preview-badge" data-id="6849815183475" />

      <div
        className="jdgm-widget jdgm-review-widget jdgm-outside-widget"
        data-id="6849815183475"
        data-product-title="add-your-product-title"
      />
    </>
  );
}
