import {readFile, writeFile} from 'fs-extra';

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
  cbBefore: () => void = () => {},
  cbAfter: () => void = () => {}
) {
  await cbBefore();
  const originalContent = await readFile(filename, 'utf-8');
  const modifiedContent = await replacer(originalContent);

  try {
    await writeFile(filename, modifiedContent);
    await cbAfter();
  } finally {
    await writeFile(filename, originalContent);
    try {
      // Wait until file has been refreshed again to
      // its original content in the browser
      await cbBefore();
    } catch {}
  }
}
