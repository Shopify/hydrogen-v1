import React, {Suspense} from 'react';
import {screen, render, waitFor} from '@testing-library/react';
import {convertHydrationResponseToReactComponents} from '../Cache.client';

jest.mock('../is-dev');
jest.mock('../import-dev');

it('handles DOM elements', async () => {
  const tuples = [['$', 'div', null, {children: 'hello'}]];
  const payload = `J0:${JSON.stringify(tuples)}`;

  render(await convertHydrationResponseToReactComponents(payload));

  expect(screen.getByText('hello')).toBeInTheDocument();
});

it('handles DOM elements with arrays of children', async () => {
  const tuples = [
    [
      '$',
      'div',
      null,
      {children: ['hello', ['$', 'b', null, {children: 'there'}]]},
    ],
  ];
  const payload = `J0:${JSON.stringify(tuples)}`;

  render(await convertHydrationResponseToReactComponents(payload));

  expect(screen.getByText('there')).toBeInTheDocument();
});

it('handles client components', async () => {
  const mod = {
    name: 'Counter',
    id: './__tests__/fixtures/Counter.js',
    named: false,
  };
  const tuples = [['$', '@1', null, {children: 'hello'}]];
  const payload = `M1:${JSON.stringify(mod)}\nJ0:${JSON.stringify(tuples)}`;

  render(
    <Suspense fallback={'Loading...'}>
      {await convertHydrationResponseToReactComponents(payload)}
    </Suspense>
  );

  await waitFor(() => expect(screen.getByText('hello')).toBeInTheDocument());
});

it('handles client components with props', async () => {
  const mod = {
    name: 'Counter',
    id: './__tests__/fixtures/Counter.js',
    named: false,
  };
  const tuples = [['$', '@1', null, {children: 'hello', count: 2}]];
  const payload = `M1:${JSON.stringify(mod)}\nJ0:${JSON.stringify(tuples)}`;

  render(
    <Suspense fallback={'Loading...'}>
      {await convertHydrationResponseToReactComponents(payload)}
    </Suspense>
  );

  await waitFor(() => expect(screen.getByText('hello 2')).toBeInTheDocument());
});

it('handles client components with array props', async () => {
  const mod = {
    name: 'Counter',
    id: './__tests__/fixtures/Counter.js',
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

  render(
    <Suspense fallback={'Loading...'}>
      {await convertHydrationResponseToReactComponents(payload)}
    </Suspense>
  );

  await waitFor(() => expect(screen.getByText('hello')).toBeInTheDocument());
  await waitFor(() => expect(screen.getByText('Thing 1')).toBeInTheDocument());
  await waitFor(() => expect(screen.getByText('Thing 4')).toBeInTheDocument());
});
