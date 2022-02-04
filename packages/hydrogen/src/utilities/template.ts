/**
 * Strip out script `src` values from <script> tags in a given HTML template.
 * Returns two lists of scripts, split based on whether they are `type="module"`.
 */
export function getScriptsFromTemplate(template: string): {
  bootstrapScripts: string[];
  bootstrapModules: string[];
} {
  const bootstrapScripts = [] as string[];
  const bootstrapModules = [] as string[];

  const body = template.match(/<body>(.+)<\/body>/s)?.[1];

  if (body) {
    const scripts = body.matchAll(
      /<script.+?src="(?<script>([\\/\w-_\.]+?))".*?><\/script>/g
    );

    for (const match of scripts) {
      const scriptName = match.groups?.script;

      if (!scriptName) continue;

      if (match[0].includes(`type="module"`)) {
        bootstrapModules.push(scriptName);
      } else {
        bootstrapScripts.push(scriptName);
      }
    }
  }

  return {bootstrapScripts, bootstrapModules};
}
