import {beforeAll, expect} from 'vitest';
import {describe, MINIMAL_TEMPLATE} from '../test-framework';

describe(
  'multiple-routes',
  ({fs, browser, it}) => {
    beforeAll(async () => {
      await fs.write(MINIMAL_TEMPLATE);

      await fs.write(
        'src/routes/index.server.jsx',
        `
        import {Link} from '@shopify/hydrogen';

        export default function Home() {
          return (
            <>
              <h1>Home</h1>
              <Link className="btn" to="/about">About</Link>
            </>
          );
        }
        `
      );
      await fs.write(
        'src/routes/about.server.jsx',
        `
        import Counter from '../components/Counter.client';

        export default function About() {
          return (
            <>
              <h1 className="about">About</h1>
              <Counter />
            </>
          );
        }
        `
      );
      await fs.write(
        'src/components/Counter.client.jsx',
        `
        import {useState} from 'react';

        export default function Counter() {
          const [count, setCount] = useState(0);

          return (
            <div>
              <h2 className="count">Count is {count}</h2>
              <button className="increase" onClick={() => setCount(count + 1)}>
                increase count
              </button>
            </div>
          );
        }
        `
      );
    });

    it('shows the homepage, navigates to about, and increases the count', async () => {
      await browser.navigate('/');

      expect(await browser.text('h1')).toBe('Home');

      await browser.click('.btn');

      expect(await browser.url().endsWith('/about')).toBeTruthy();
      expect(await browser.text('.about')).toBe('About');
      expect(await browser.text('.count')).toBe('Count is 0');

      await browser.click('.increase');

      expect(await browser.text('.count')).toBe('Count is 1');
    });
  },
  {
    modes: ['node-dev', 'node-prod'],
    routes: import.meta.glob('./routes/*.server.*'),
  }
);
