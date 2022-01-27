import {useEffect} from 'react';

export default function BoomerangPageTemplate({
  pageTemplate,
}: {
  pageTemplate: string | undefined;
}) {
  if (!pageTemplate) {
    pageTemplate = 'not-set';
  }

  useEffect(() => {
    (function () {
      // @ts-ignore
      window.BOOMR = window.BOOMR || {};

      // @ts-ignore
      window.BOOMR.pageTemplate = pageTemplate.toLowerCase();

      // @ts-ignore
      if (BOOMR.addVar) {
        // @ts-ignore
        BOOMR.addVar('page_template', BOOMR.pageTemplate.toString());
      }
    })();
  }, [pageTemplate]);

  return null;
}
