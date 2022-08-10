import path from 'path';
import {promises as fs} from 'fs';

export async function readVirtualTemplate(name: 'middleware') {
  try {
    return await fs.readFile(
      path
        .resolve(__dirname, name + '.js')
        // Make sure templates are read from the ESM version
        .replace('/hydrogen/dist/node/', '/hydrogen/dist/esnext/'),
      'utf-8'
    );
  } catch (cause: any) {
    const error = new Error(
      `Could not find or read the "${name}" virtual template. This is a bug in Hydrogen.\n${cause.message}`,
      {cause: cause as Error}
    );

    console.error(error);
    throw error;
  }
}
