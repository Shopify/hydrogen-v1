/// <reference types="vite/client" />
import React, {ReactNode} from 'react';
import type {HelmetData as HeadData} from 'react-helmet-async';

type HtmlOptions = {
  children: ReactNode;
  template: string;
  htmlAttrs?: Record<string, string>;
  bodyAttrs?: Record<string, string>;
};

const HTML_ATTR_SEP_RE = /(?<!\=)"\s+/gim;
const getHtmlAttrs = (template: string) =>
  template.match(/<html\s+([^>]+?)\s*>/s)?.[1] || '';
const getBodyAttrs = (template: string) =>
  template.match(/<body\s+([^>]+?)\s*>/s)?.[1] || '';

const REACT_ATTR_MAP = Object.create(null) as Record<string, string>;
REACT_ATTR_MAP.class = 'className';
REACT_ATTR_MAP.style = 'data-style'; // Ignore string styles, it breaks React

function attrsToProps(attrs: string) {
  attrs = attrs?.trim();

  // Assume all attributes are surrounded by double quotes.
  return attrs
    ? Object.fromEntries(
        attrs.split(HTML_ATTR_SEP_RE).map((attr) => {
          const [key, value] = attr.replace(/"/g, '').split(/=(.+)/);
          return [REACT_ATTR_MAP[key.toLowerCase()] || key, value];
        })
      )
    : {};
}

function propsToAttrs(props: Record<string, string>) {
  return Object.entries(props)
    .map(
      ([key, value]) =>
        `${key === REACT_ATTR_MAP.class ? 'class' : key}="${value}"`
    )
    .join(' ');
}

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
    <html {...attrsToProps(getHtmlAttrs(template))} {...htmlAttrs}>
      <head dangerouslySetInnerHTML={{__html: head}} />
      <body {...attrsToProps(getBodyAttrs(template))} {...bodyAttrs}>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}

export function applyHtmlHead(html: string, head: HeadData, template: string) {
  const {bodyAttrs, htmlAttrs, ...headTags} = extractHeadElements(
    head,
    template
  );

  return html
    .replace(
      /<head>(.*?)<\/head>/s,
      generateHeadTag(headTags as Record<string, any>)
    )
    .replace(/<html[^>]*?>/s, htmlAttrs ? `<html ${htmlAttrs}>` : '$&')
    .replace(/<body[^>]*?>/s, bodyAttrs ? `<body ${bodyAttrs}>` : '$&');
}

function extractHeadElements({context: {helmet}}: HeadData, template: string) {
  // There might be existing attributes in the template that are
  // duplicated in the helmet. Transform them to props and back
  // to string attributes to remove duplicates.
  const htmlUniqueProps = attrsToProps(
    `${getHtmlAttrs(template)} ${helmet.htmlAttributes}`
  );
  const bodyUniqueProps = attrsToProps(
    `${getBodyAttrs(template)} ${helmet.bodyAttributes}`
  );

  return {
    htmlAttrs: propsToAttrs(htmlUniqueProps),
    bodyAttrs: propsToAttrs(bodyUniqueProps),
    base: helmet.base.toString(),
    link: helmet.link.toString(),
    meta: helmet.meta.toString(),
    noscript: helmet.noscript.toString(),
    script: helmet.script.toString(),
    style: helmet.style.toString(),
    title: helmet.title.toString(),
  };
}

/**
 * Generate the contents of the `head` tag, and update the existing `<title>` tag
 * if one exists, and if a title is passed.
 */
function generateHeadTag({title, ...rest}: Record<string, string>) {
  const headProps = ['base', 'meta', 'style', 'noscript', 'script', 'link'];

  const otherHeadProps = headProps
    .map((prop) => rest[prop])
    .filter(Boolean)
    .join('\n');

  return (_outerHtml: string, innerHtml: string) => {
    let headHtml = otherHeadProps + innerHtml;

    if (title) {
      if (headHtml.includes('<title>')) {
        headHtml = headHtml.replace(/(<title>(?:.|\n)*?<\/title>)/, title);
      } else {
        headHtml += title;
      }
    }

    return `<head>${headHtml}</head>`;
  };
}
