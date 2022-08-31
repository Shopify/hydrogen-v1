import {extname, basename} from 'path';

export function renderExample(file: string, content: string) {
  const extension = extname(file).split('.').pop();
  const name = basename(file);

  const renderedExample = [
    `{% codeblock %}`,
    `{% code ${extension}, title: "${name}" %}`,
    `{% raw %}`,
    content,
    '{% endraw %}',
    `{% endcode %}`,
    '{% endcodeblock %}',
  ].join('\n');

  return renderedExample;
}

export function renderMarkdownExample(file: string, content: string) {
  const extension = extname(file).split('.').pop();

  const renderedExample = [
    `\n`,
    `\`\`\` ${extension}`,
    content.trim(),
    `\`\`\``,
    `\n`,
  ].join('\n');

  return renderedExample;
}
