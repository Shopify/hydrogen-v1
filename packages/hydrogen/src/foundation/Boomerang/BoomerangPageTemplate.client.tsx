import {useEffect} from 'react';

export function BoomerangPage({
  pageTemplate = 'fallback_not_set',
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
