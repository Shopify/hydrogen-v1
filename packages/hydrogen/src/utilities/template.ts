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

  const stylesheets = [];
  for (const linkTag of raw.match(/\s*<link[^<>]+?>/gim) || []) {
    if (linkTag.includes('rel="stylesheet"')) {
      const href = linkTag.match(/href="([^"]+)"/)?.[1];
      if (href) stylesheets.push(href.replace(/^https?:/i, ''));
    }
  }

  return {
    raw,
    stylesheets,
    ...stripScriptsFromTemplate(raw),
  };
}

export type TemplateParts = Awaited<ReturnType<typeof getTemplate>>;
