/// <reference types="vite/client" />
import React, {ReactNode} from 'react';

export function Html({children, head}: {children: ReactNode; head: string}) {
  return (
    <html lang="en">
      <head dangerouslySetInnerHTML={{__html: head}} />
      <body>
        <div id="root">{children}</div>
        {/* In production, Vite bundles the entrypoint JS inside <head> */}
        {/* @ts-ignore because module=commonjs doesn't allow this */}
        {!process.env.PRODUCTION && (
          <script type="module" src="/src/entry-client.jsx"></script>
        )}
      </body>
    </html>
  );
}
