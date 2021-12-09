import {wrapInClientMarker} from '../ClientMarker';

const params = {
  id: '/path/to/Counter.client.jsx',
  name: 'Counter',
  named: true,
  props: {},
};

it('only wraps React-like components', async () => {
  expect(
    wrapInClientMarker({
      ...params,
      component: 'string' as any,
    })
  ).toBe('string');

  expect(
    wrapInClientMarker({
      ...params,
      component: 42 as any,
    })
  ).toBe(42);
});

it('keeps the component name', async () => {
  const wrapped = wrapInClientMarker({
    ...params,
    component: () => 'component' as any,
  });

  expect(wrapped.name).toBe(params.name);
});

it('relays enumerable properties', async () => {
  const fragment = 'MyFragment';
  const component = () => 'component' as any;
  component.Fragment = fragment;

  const wrapped = wrapInClientMarker({
    ...params,
    component,
  });

  // @ts-ignore
  expect(wrapped.Fragment).toBe(fragment);
});
