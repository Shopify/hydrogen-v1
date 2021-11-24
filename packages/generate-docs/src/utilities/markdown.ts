import {readFile} from 'fs-extra';
import remark = require('remark');
import strip from 'strip-markdown';

export const inPageAnchors = (mkd: string) =>
  mkd.replace(/\.\/([\w-]+)\.md/g, '#$1');

export const compose = <R>(fn1: (a: R) => R, ...fns: Array<(a: R) => R>) =>
  fns.reduce((prevFn, nextFn) => (value) => prevFn(nextFn(value)), fn1);

export async function concat(
  markdown: string,
  nextPaths: string[]
): Promise<string> {
  const file = nextPaths.pop();
  const newContent = file ? (await readFile(file)) + markdown : markdown;

  return nextPaths.length ? concat(newContent, nextPaths) : newContent;
}

export function padBreak(content: string[], num = 1) {
  const end = ''.padEnd(num, `\n`);
  return content.map((str) => `${str}${end}`);
}

export async function stripMarkdown(content: string): Promise<string> {
  const result = await remark().use(strip).process(content);

  return String(result);
}
