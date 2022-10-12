import React from 'react';
import {BeforeHydrationProps} from './types.js';

const ignoreProps = ['load', 'onReady', 'target'];

type AllowedBeforeHydrationProps = Exclude<
  BeforeHydrationProps,
  typeof ignoreProps
>;

/*
  Adds an inline <script> tag before react hydrates on the client.
*/
export function ScriptBeforeHydration(
  passedProps: BeforeHydrationProps
): JSX.Element {
  const {id, src: srcProp = null} = passedProps;
  const src = typeof srcProp === 'string' ? srcProp : undefined;

  // Remove props that are not allowed on <script> tags
  const props = Object.keys(passedProps).reduce<AllowedBeforeHydrationProps>(
    (acc, key) => {
      if (ignoreProps.includes(key)) {
        // @ts-ignore - we know this is a valid key
        delete acc[key];
      }
      return acc;
    },
    {...passedProps}
  );

  const isInlineScript =
    !src &&
    (props.children !== undefined || props.dangerouslySetInnerHTML?.__html);

  if (isInlineScript) {
    delete props.src;
    let js = '';

    if (props.children) {
      js =
        typeof props.children === 'string'
          ? props.children
          : Array.isArray(props.children)
          ? props.children.join('')
          : '';
      delete props.children;
    } else if (typeof props.dangerouslySetInnerHTML !== 'undefined') {
      js = props.dangerouslySetInnerHTML.__html.trim();
      delete props.dangerouslySetInnerHTML;
    }

    return (
      // eslint-disable-next-line hydrogen/prefer-script-component
      <script
        key={id + js.slice(0, 24)}
        {...props}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{__html: js}}
        data-load="beforeHydration"
      />
    );
  }

  // src provided, default to async and defer false,
  // because this should happen before hydration
  // Not recommended
  return (
    // eslint-disable-next-line hydrogen/prefer-script-component
    <script
      {...props}
      key={(id ?? '') + (src ?? '')}
      id={id}
      src={src}
      async={false}
      defer={false} // for async/defer force user to use onIdle or afterHydration strategies
      data-load="beforeHydration"
    />
  );
}
