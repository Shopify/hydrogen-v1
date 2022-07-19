import {useLoadScript} from '@shopify/hydrogen';

export function LoadWidgets() {
  useLoadScript('https://www.googletagmanager.com/gtag/js?id=UA-IN-BODY');
  useLoadScript('https://www.googletagmanager.com/gtag/js?id=UA-IN-HEAD', {
    in: 'head',
  });
  useLoadScript(
    'https://www.googletagmanager.com/gtag/js?id=UA-IN-HEAD-MODULE',
    {
      module: true,
      in: 'head',
    }
  );
  useLoadScript(
    'https://www.googletagmanager.com/gtag/js?id=UA-IN-BODY-MODULE',
    {
      module: true,
      in: 'body',
    }
  );

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
