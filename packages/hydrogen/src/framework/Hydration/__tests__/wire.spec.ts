import {generateWireSyntaxFromRenderedHtml} from '../wire.server';

it('renders normal html elements', () => {
  const input = `<div class="foo"><p id="bar">Hello!</p></div>`;
  const output = `J0:["$","div",null,{"className":"foo","children":["$","p",null,{"id":"bar","children":"Hello!"}]}]`;

  expect(generateWireSyntaxFromRenderedHtml(input)).toBe(output);
});

it('renders Client Components', () => {
  const input = `<div class="foo">
    <div data-client-component="Counter" data-id="assets/Counter.123.js" data-props='${JSON.stringify(
      {hello: 'world'}
    )}' data-named="false">Hi</div>
  </div>`;

  const output = `M1:{"name":"Counter","id":"assets/Counter.123.js","named":false}
J0:["$","div",null,{"className":"foo","children":["\\n    ",["$","@1",null,{"hello":"world","children":"Hi"}],"\\n  "]}]`;

  expect(generateWireSyntaxFromRenderedHtml(input)).toBe(output);
});

it('renders Client Components with React components as props that are not children', () => {
  const input = `<div class="foo">
    <div data-client-component="Counter" data-id="assets/Counter.123.js" data-props='${JSON.stringify(
      {
        sidebar: {
          key: null,
          props: {
            children: {
              type: 'p',
              key: null,
              ref: null,
              props: {
                children: 'Hello',
              },
              _owner: null,
              _store: {},
            },
          },
          ref: null,
          type: 'div',
          _owner: null,
          _store: {},
        },
      }
    )}' data-named="false">Hi</div>
  </div>`;

  const output = `M1:{"name":"Counter","id":"assets/Counter.123.js","named":false}
J0:["$","div",null,{"className":"foo","children":["\\n    ",["$","@1",null,{"sidebar":["$","div",null,{"children":["$","p",null,{"children":"Hello"}]}],"children":"Hi"}],"\\n  "]}]`;

  expect(generateWireSyntaxFromRenderedHtml(input)).toBe(output);
});

/**
 * NOTE: This test assumes that the JSON props are serialized correctly. However, our mechanism for serializing
 * these just doesn't... work at all. It's missing `type` primarily. Need to revisit this to ensure we can
 * pass components as props to Client Components.
 */
it('renders Client Components with nested React components as props that are not children', () => {
  const input = `<div class="foo">
    <div data-client-component="Counter" data-id="assets/Counter.123.js" data-props='${JSON.stringify(
      {
        sidebar: {
          key: null,
          props: {
            children: {
              type: 'div',
              key: null,
              ref: null,
              props: {
                'data-client-component': 'Bar',
                'data-id': 'assets/Bar.123.js',
                'data-props': JSON.stringify({color: 'red'}),
                children: 'Hello',
              },
              _owner: null,
              _store: {},
            },
          },
          ref: null,
          type: 'div',
          _owner: null,
          _store: {},
        },
      }
    )}' data-named="false">Hi</div>
  </div>`;

  const output = `M1:{"name":"Counter","id":"assets/Counter.123.js","named":false}
M2:{"name":"Bar","id":"assets/Bar.123.js","named":false}
J0:["$","div",null,{"className":"foo","children":["\\n    ",["$","@1",null,{"sidebar":["$","div",null,{"children":["$","@2",null,{"color":"red","children":"Hello"}]}],"children":"Hi"}],"\\n  "]}]`;

  expect(generateWireSyntaxFromRenderedHtml(input)).toBe(output);
});

it('renders Client Components with nested props that have multiple children', () => {
  const input = `<div class="foo"><p>Bar</p><div>Baz</div></div>`;

  const output = `J0:["$","div",null,{"className":"foo","children":[["$","p",null,{"key":0,"children":"Bar"}],["$","div",null,{"key":1,"children":"Baz"}]]}]`;

  expect(generateWireSyntaxFromRenderedHtml(input)).toBe(output);
});

it('renders Client Components with nested props that have multiple children including text nodes', () => {
  const input = `<div data-client-component="Counter" data-id="assets/Counter.123.js" data-props='${JSON.stringify(
    {
      sidebar: {
        key: null,
        props: {
          children: [
            {
              type: 'p',
              key: null,
              ref: null,
              props: {
                children: 'Hello',
              },
              _owner: null,
              _store: {},
            },
            ' to ',
            {
              type: 'a',
              key: null,
              ref: null,
              props: {
                href: '#',
                children: 'you',
              },
              _owner: null,
              _store: {},
            },
          ],
        },
        ref: null,
        type: 'div',
        _owner: null,
        _store: {},
      },
    }
  )}' data-named="false">Hi</div>`;

  const output = `M1:{"name":"Counter","id":"assets/Counter.123.js","named":false}
J0:["$","@1",null,{"sidebar":["$","div",null,{"children":[["$","p",null,{"children":"Hello"}]," to ",["$","a",null,{"href":"#","children":"you"}]]}],"children":"Hi"}]`;

  expect(generateWireSyntaxFromRenderedHtml(input)).toBe(output);
});

it('renders named Client Components', () => {
  const input = `<div data-client-component="Counter" data-id="assets/Counter.123.js" data-props='{}' data-named="true">Hi</div>`;

  const output = `M1:{"name":"Counter","id":"assets/Counter.123.js","named":true}
J0:["$","@1",null,{"children":"Hi"}]`;

  expect(generateWireSyntaxFromRenderedHtml(input)).toBe(output);
});
