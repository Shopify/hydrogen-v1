import {readFile, writeFile} from 'fs-extra';
import path from 'path';

export async function untilUpdated(
  testFunction: () => string | Promise<string>,
  expected: string
): Promise<void> {
  for (let tries = 0; tries < 100; tries++) {
    const actual = (await testFunction()) || '';

    if (actual.indexOf(expected) > -1 || tries === 100 - 1) {
      expect(actual).toMatch(expected);

      break;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
}

export async function edit(
  filename: string,
  replacer: (str: string) => string,
  cb: () => void = () => {}
) {
  const content = await readFile(filename, 'utf-8');
  const modified = await replacer(content);

  try {
    await writeFile(filename, modified);
    await cb();
  } finally {
    await writeFile(filename, content);
  }
}
