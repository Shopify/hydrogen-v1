/// <reference types="vite/client" />
import React, {ReactNode} from 'react';

type HtmlOptions = {
  children: ReactNode;
  template: string;
  htmlAttrs?: Record<string, string>;
  bodyAttrs?: Record<string, string>;
};

export function Html({children, template, htmlAttrs, bodyAttrs}: HtmlOptions) {
  const head = template.match(/<head>(.+?)<\/head>/s)![1] || '';

  let devEntryPoint = '';

  // @ts-ignore
  if (import.meta.env.DEV) {
    devEntryPoint =
      template
        .substring(template.lastIndexOf('<script type="module"'))
        .match(/src="(.*?)">/i)?.[1] || '';

    if (!devEntryPoint) {
      throw new Error('Could not find entry-client module in index.html');
    }
  }

  return (
    <html {...htmlAttrs}>
      <head dangerouslySetInnerHTML={{__html: head}} />
      <body {...bodyAttrs}>
        <div id="root">{children}</div>
        {/* In production, Vite bundles the entrypoint JS inside <head> */}
        {/* @ts-ignore because module=commonjs doesn't allow this */}
        {import.meta.env.DEV && (
          <script type="module" src={devEntryPoint}></script>
        )}
      </body>
    </html>
  );
}
