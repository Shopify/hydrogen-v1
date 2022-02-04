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

  return (
    <html {...htmlAttrs}>
      <head dangerouslySetInnerHTML={{__html: head}} />
      <body {...bodyAttrs}>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
