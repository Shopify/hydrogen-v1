/// <reference types="vite/client" />
import React, {ReactNode} from 'react';

type HtmlOptions = {
  children: ReactNode;
  template: string;
  htmlAttrs?: Record<string, string>;
  bodyAttrs?: Record<string, string>;
};

const REACT_ATTR_MAP = Object.create(null) as Record<string, string>;
REACT_ATTR_MAP.class = 'className';
REACT_ATTR_MAP.style = 'data-style'; // Ignore string styles, it breaks React

function attrsToProps(stringAttrs: string) {
  // Assume all attributes are surrounded by double quotes.
  return stringAttrs
    ? Object.fromEntries(
        stringAttrs.split(/(?<!\=)"\s+/gim).map((attr) => {
          const [key, value] = attr.replace(/"/g, '').split(/=(.+)/);
          return [REACT_ATTR_MAP[key.toLowerCase()] || key, value];
        })
      )
    : {};
}

export function Html({children, template, htmlAttrs, bodyAttrs}: HtmlOptions) {
  const [, existingHtmlAttrs] = template.match(/<html\s+([^>]+?)\s*>/s) || [];
  const [, existingBodyAttrs] = template.match(/<body\s+([^>]+?)\s*>/s) || [];
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
    <html {...attrsToProps(existingHtmlAttrs)} {...htmlAttrs}>
      <head dangerouslySetInnerHTML={{__html: head}} />
      <body {...attrsToProps(existingBodyAttrs)} {...bodyAttrs}>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
