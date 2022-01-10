import React, {Suspense} from 'react';
import {mount} from '@shopify/react-testing';
// import {convertHydrationResponseToReactComponents} from '../Cache.client';

async function convertHydrationResponseToReactComponents(
  payload: any
): Promise<any> {}

jest.mock('../client-imports', () => (id: string) => import(id));

describe.skip('Cache', () => {
  it('handles DOM elements', async () => {
    const tuples = [['$', 'div', null, {children: 'hello'}]];
    const payload = `J0:${JSON.stringify(tuples)}`;

    const result = await convertHydrationResponseToReactComponents(payload);
    const wrapper = await mount(<>{result}</>);

    expect(wrapper).toContainReactHtml('<div>hello</div>');
  });

  it('ignores new lines', async () => {
    const tuples = [['$', 'div', null, {children: 'hello'}]];
    const payload = `\nJ0:${JSON.stringify(tuples)}\n`;

    const result = await convertHydrationResponseToReactComponents(payload);
    const wrapper = await mount(<>{result}</>);

    expect(wrapper).toContainReactHtml('<div>hello</div>');
  });

  it('handles DOM elements with arrays of children', async () => {
    const tuples = [
      [
        '$',
        'div',
        null,
        {children: ['hello', ' ', ['$', 'b', null, {children: 'there'}]]},
      ],
    ];
    const payload = `J0:${JSON.stringify(tuples)}`;

    const result = await convertHydrationResponseToReactComponents(payload);
    const wrapper = await mount(<>{result}</>);

    expect(wrapper).toContainReactHtml('<div>hello <b>there</b></div>');
  });

  it('handles client components', async () => {
    const mod = {
      name: 'Counter',
      id: './fixtures/Counter.js',
      named: false,
    };
    const tuples = [['$', '@1', null, {children: 'hello'}]];
    const payload = `M1:${JSON.stringify(mod)}\nJ0:${JSON.stringify(tuples)}`;

    const result = await convertHydrationResponseToReactComponents(payload);
    const wrapper = await mount(
      <Suspense fallback={'Loading...'}>{result}</Suspense>
    );

    expect(wrapper).toContainReactHtml('<div>hello</div>');
  });

  it('handles client components with props', async () => {
    const mod = {
      name: 'Counter',
      id: './fixtures/Counter.js',
      named: false,
    };
    const tuples = [['$', '@1', null, {children: 'hello', count: 2}]];
    const payload = `M1:${JSON.stringify(mod)}\nJ0:${JSON.stringify(tuples)}`;

    const result = await convertHydrationResponseToReactComponents(payload);
    const wrapper = await mount(
      <Suspense fallback={'Loading...'}>{result}</Suspense>
    );

    expect(wrapper).toContainReactHtml('<div>hello 2</div>');
  });

  it('handles client components with array props', async () => {
    const mod = {
      name: 'Counter',
      id: './fixtures/Counter.js',
      named: false,
    };
    const tuples = [
      [
        '$',
        '@1',
        null,
        {children: 'hello', things: [{id: 1}, {id: 2}, {id: 3}, {id: 4}]},
      ],
    ];
    const payload = `M1:${JSON.stringify(mod)}\nJ0:${JSON.stringify(tuples)}`;

    const result = await convertHydrationResponseToReactComponents(payload);
    const wrapper = await mount(
      <Suspense fallback={'Loading...'}>{result}</Suspense>
    );

    expect(wrapper).toContainReactHtml(
      '<div>hello<p>Thing 1</p><p>Thing 2</p><p>Thing 3</p><p>Thing 4</p></div>'
    );
  });
});
