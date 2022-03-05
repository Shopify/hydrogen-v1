import parse, {HTMLElement, TextNode} from 'node-html-parser';
import * as TAGS from './tag';
import * as ATTRS from './attr';
import type {Node} from 'node-html-parser';
import type {SanitizeOptions} from '../../types';

const DEFAULT_ALLOWED_TAGS = [
  ...TAGS.html,
  ...TAGS.svg,
  ...TAGS.svgFilters,
  ...TAGS.mathMl,
  ...TAGS.text,
];

const DEFAULT_ALLOWED_ATTR = [
  ...ATTRS.html,
  ...ATTRS.svg,
  ...ATTRS.mathMl,
  ...ATTRS.xml,
];

type SantizeNodeOptions = {
  allowedTags: Set<string>;
  allowedAttrs: Set<string>;
};

export function sanitize(string: string, options?: SanitizeOptions) {
  const root = parse(string);

  root.removeWhitespace();

  let allowedTags = new Set(DEFAULT_ALLOWED_TAGS);
  let allowedAttrs = new Set(DEFAULT_ALLOWED_ATTR);
  allowedTags = removeFromSet(allowedTags, options?.forbidTags || []);
  allowedAttrs = removeFromSet(allowedAttrs, options?.forbidAttrs || []);

  sanitizeNodes(root.childNodes, {
    allowedTags,
    allowedAttrs,
  });

  return root.toString();
}

function removeFromSet(set: Set<string>, tags: string[]): Set<string> {
  tags.forEach((tag) => {
    set.delete(tag);
  });
  return set;
}

function sanitizeNodes(nodes: Node[], options: SantizeNodeOptions) {
  nodes.forEach((node) => {
    if (node instanceof HTMLElement) {
      const attrs = Object.keys(node.attributes);

      if (!options.allowedTags.has(node.tagName.toLowerCase())) node.remove();

      if (node && attrs.length > 0) {
        attrs.forEach((attrKey) => {
          if (!options.allowedAttrs.has(attrKey.toLowerCase())) {
            node.removeAttribute(attrKey);
          }
        });
      }
      if (node && node.childNodes.length > 0) {
        sanitizeNodes(node.childNodes, options);
      }
    }
    if (node instanceof TextNode) {
      if (node && /<.*[\u0080-\uFFFF]*.*>/.test(node.innerText)) {
        node.textContent = '';
      }
    }
  });
}
