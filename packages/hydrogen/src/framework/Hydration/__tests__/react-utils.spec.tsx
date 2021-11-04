import React from 'react';
import {renderReactProps} from '../react-utils';

function TestComponent() {
  return <p>Hi</p>;
}

function NestedComponent() {
  return <TestComponent />;
}

it('renders single react component', () => {
  const props = {
    stuff: {
      $$typeof: Symbol.for('react.element'),
      type: 'div',
      props: {
        children: {
          $$typeof: Symbol.for('react.element'),
          type: TestComponent,
          props: {},
        },
      },
    },
  };

  expect(JSON.stringify(renderReactProps(props))).toBe(
    JSON.stringify({
      stuff: {
        $$typeof: Symbol.for('react.element'),
        type: 'div',
        props: {
          children: {
            type: 'p',
            key: null,
            ref: null,
            props: {
              children: 'Hi',
            },
            _owner: null,
            _store: {},
          },
        },
      },
    })
  );
});

it('renders nested react components', () => {
  const props = {
    stuff: {
      $$typeof: Symbol.for('react.element'),
      type: 'div',
      props: {
        children: {
          $$typeof: Symbol.for('react.element'),
          type: NestedComponent,
          props: {},
        },
      },
    },
  };

  expect(JSON.stringify(renderReactProps(props))).toBe(
    JSON.stringify({
      stuff: {
        $$typeof: Symbol.for('react.element'),
        type: 'div',
        props: {
          children: {
            type: 'p',
            key: null,
            ref: null,
            props: {
              children: 'Hi',
            },
            _owner: null,
            _store: {},
          },
        },
      },
    })
  );
});

it('renders arrays of react components', () => {
  const props = {
    stuff: {
      $$typeof: Symbol.for('react.element'),
      type: 'div',
      props: {
        children: [
          {
            $$typeof: Symbol.for('react.element'),
            type: NestedComponent,
            props: {},
          },
          {
            $$typeof: Symbol.for('react.element'),
            type: 'p',
            props: {children: 'Hello'},
          },
        ],
      },
    },
  };

  expect(JSON.stringify(renderReactProps(props))).toBe(
    JSON.stringify({
      stuff: {
        $$typeof: Symbol.for('react.element'),
        type: 'div',
        props: {
          children: [
            {
              type: 'p',
              key: null,
              ref: null,
              props: {
                children: 'Hi',
              },
              _owner: null,
              _store: {},
            },
            {
              type: 'p',
              props: {
                children: 'Hello',
              },
            },
          ],
        },
      },
    })
  );
});
