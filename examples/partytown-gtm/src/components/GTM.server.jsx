export function GTM() {
  const GTM_ID = Oxygen?.env?.GTM_ID;
  const GA4_ID = Oxygen?.env?.GA4_ID;

  return (
    <>
      {/* init GTM dataLayer container */}
      <script
        id="dataLayer-instance"
        dangerouslySetInnerHTML={{
          __html: `
              dataLayer = window.dataLayer || [];

              function gtag(){
                dataLayer.push(arguments)
              };

              gtag('js', new Date());
              gtag('config', "${GA4_ID}");
            `,
        }}
      />

      {/* GTM script fallback if js is disabled */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{display: 'none', visibility: 'hidden'}}
        />
      </noscript>

      {/* GTM script — loaded via a Partytown Web Worker */}
      <script
        type="text/partytown"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: `
            console.log('Loaded GTM script via partytown 🎉');
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer', "${GTM_ID}");

          `,
        }}
      />
    </>
  );
}
