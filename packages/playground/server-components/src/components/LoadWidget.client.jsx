import {useLoadScript} from '@shopify/hydrogen';

export function LoadWidget({url, options}) {
  useLoadScript(url, options);

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `
            <script>
              dataLayer = window.dataLayer || [];

              function gtag() {
                dataLayer.push(arguments);
              }
              gtag('js', new Date());
            </script>
          `,
      }}
    />
  );
}
