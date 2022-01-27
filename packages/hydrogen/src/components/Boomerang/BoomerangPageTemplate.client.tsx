import {useEffect} from 'react';

export default function BoomerangPageTemplate({
  pageTemplate = 'not-set',
}: {
  pageTemplate: string | undefined;
}) {
  const templateName = pageTemplate.toLowerCase();
  useEffect(() => {
    (function () {
      window.BOOMR = window.BOOMR || {};
      window.BOOMR.pageTemplate = templateName;

      if (window.BOOMR.addVar) {
        window.BOOMR.addVar('page_template', templateName);
      }
    })();
  }, [pageTemplate]);

  return null;
}
