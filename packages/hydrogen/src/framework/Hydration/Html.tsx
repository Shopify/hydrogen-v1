/// <reference types="vite/client" />
import React, {ReactNode} from 'react';

export function Html({children, head}: {children: ReactNode; head: string}) {
  return (
    <html lang="en">
      <head dangerouslySetInnerHTML={{__html: head}} />
      <body>
        <script>
          {`
          window.preloadedModules = [];
          window.preloadRSC = function(script) {
            preloadedModules.push(script.dataset.rscId);
            script.parentElement.removeChild(script);
          }`}
        </script>
        <div id="root">{children}</div>
        {/* In production, Vite bundles the entrypoint JS inside <head> */}
        {/* @ts-ignore because module=commonjs doesn't allow this */}
        {import.meta.env.DEV && (
          <script type="module" src="/src/entry-client.jsx"></script>
        )}
      </body>
    </html>
  );
}
