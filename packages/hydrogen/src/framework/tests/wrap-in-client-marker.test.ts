import {wrapInClientMarker, MODULE_TAG} from '../ClientMarker';

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

it('adds descriptor, relays enumerable properties and keeps the component name', async () => {
  const fragment = 'MyFragment';
  const component = () => 'component' as any;
  component.Fragment = fragment;

  const wrapped = wrapInClientMarker({
    ...params,
    component,
  });

  // @ts-ignore
  expect(wrapped.Fragment).toBe(fragment);
  // @ts-ignore
  expect(wrapped.$$typeof_rsc).toBe(MODULE_TAG);
  // @ts-ignore
  expect(wrapped.render.name).toBe(params.name);
});
