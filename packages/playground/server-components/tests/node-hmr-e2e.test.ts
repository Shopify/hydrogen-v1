import {resolve} from 'path';
import {edit, untilUpdated} from '../../utilities';

describe('HMR', () => {
  it('updates the contents when a file changes', async () => {
    const fullPath = resolve(__dirname, '../', 'src/pages/index.server.jsx');
    const newheading = 'Snow Devil';

    // Assert that we have the default heading (h1)
    await untilUpdated(() => page.textContent('h1'), 'Home');

    // Edit the heading (h1) in the JSX code
    // Assert the page updated with the new heading
    await edit(
      fullPath,
      (code) => code.replace('<h1>Home', `<h1>${newheading}`),
      async () => await untilUpdated(() => page.textContent('h1'), newheading)
    );
  });
});
