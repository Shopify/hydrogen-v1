/// <reference types="vite/client" />
import React, {ReactNode} from 'react';

type HtmlOptions = {
  children: ReactNode;
  template: string;
  headSuffix?: string;
  htmlAttrs?: Record<string, string>;
  bodyAttrs?: Record<string, string>;
};

export function Html({
  children,
  template,
  headSuffix,
  htmlAttrs,
  bodyAttrs,
}: HtmlOptions) {
  const head =
    (template.match(/<head>(.+?)<\/head>/s)![1] || '') + (headSuffix || '');

  return (
    <html {...htmlAttrs}>
      <head dangerouslySetInnerHTML={{__html: head}} />
      <body {...bodyAttrs}>
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
