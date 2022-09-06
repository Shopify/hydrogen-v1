/**
 * Strip out script `src` values from <script> tags in a given HTML template.
 * Returns two lists of scripts, split based on whether they are `type="module"`.
 */
function stripScriptsFromTemplate(template: string) {
  const bootstrapScripts = [] as string[];
  const bootstrapModules = [] as string[];

  const scripts = template.matchAll(
    /<script\n*?.+?src="(?<script>([^"]+?))"\n*.*?><\/script>/g
  );

  for (const match of scripts) {
    const scriptName = match.groups?.script;

    if (!scriptName) continue;

    if (match[0].includes(`type="module"`)) {
      bootstrapModules.push(scriptName);
    } else {
      bootstrapScripts.push(scriptName);
    }

    template = template.replace(match[0], '');
  }

  return {noScriptTemplate: template, bootstrapScripts, bootstrapModules};
}

function extractAttributes(string: string) {
  const attributes = {} as Record<string, string>;
  for (const [, attr, value] of string.matchAll(/\s([\w-]+)="([^"]*?)"/gm)) {
    attributes[attr] = value;
  }

  return attributes;
}

export async function getTemplate(
  indexTemplate:
    | string
    | ((url: string) => Promise<string | {default: string}>),
  url?: URL
) {
  let raw =
    typeof indexTemplate === 'function'
      ? await indexTemplate(url?.toString() || '')
      : indexTemplate;

  if (raw && typeof raw !== 'string') {
    raw = raw.default;
  }

  return {
    raw,
    linkHeader: createLinkHeader(raw),
    ...stripScriptsFromTemplate(raw),
  };
}

export type TemplateParts = Awaited<ReturnType<typeof getTemplate>>;

const ALLOWED_REL_ATTRS = ['stylesheet', 'preconnect', 'preload'];

function createLinkHeader(template: string) {
  const assets = (template.match(/\s*<link[^<>]+?>/gim) || []).map(
    extractAttributes
  );

  const links = [];

  for (const {href, rel = '', ...attrs} of assets) {
    if (href && ALLOWED_REL_ATTRS.includes(rel)) {
      const isStyle = rel === 'stylesheet';
      if (isStyle && !attrs.as) attrs.as = 'style';

      links.push(
        [
          `<${encodeURI(href.replace(/^https?:/i, ''))}>`,
          `rel=${isStyle ? 'preload' : rel}`,
          ...Object.entries(attrs).map((entry) => entry.join('=')),
        ].join('; ')
      );
    }
  }

  return links.join(', ');
}
