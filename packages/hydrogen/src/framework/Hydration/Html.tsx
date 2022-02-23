/// <reference types="vite/client" />
import React, {ReactNode} from 'react';

type HtmlOptions = {
  children: ReactNode;
  template: string;
  htmlAttrs?: Record<string, string>;
  bodyAttrs?: Record<string, string>;
};

export function Html({children, template, htmlAttrs, bodyAttrs}: HtmlOptions) {
  let head = template.match(/<head>(.+?)<\/head>/s)![1] || '';

  // @ts-ignore
  if (import.meta.env.DEV) {
    // Fix React Refresh for async scripts.
    // https://github.com/vitejs/vite/issues/6759
    head = head.replace(
      />(\s*?import[\s\w]+?['"]\/@react-refresh)/,
      ' async="">$1'
    );
  }

  return (
    <html {...htmlAttrs}>
      <head dangerouslySetInnerHTML={{__html: head}} />
      <body {...bodyAttrs}>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
