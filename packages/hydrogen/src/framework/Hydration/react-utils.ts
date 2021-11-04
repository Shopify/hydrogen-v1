import {renderToString} from 'react-dom/server';
/**
 * Load `domToReact` from within the library so it doesn't try to load `htmlToDom`
 * which seems to always resolve to the client version, even though we want server.
 */
import domToReact from 'html-react-parser/lib/dom-to-react';
import htmlToDOM from 'html-dom-parser';
import {ReactElement} from 'react';

/**
 * Iterate through each prop in an object and render it to an object.
 */
export function renderReactProps(props: any) {
  return Object.entries(props).reduce((memo, [key, prop]: [string, any]) => {
    if (prop instanceof Array) {
      memo[key] = prop.map((p) => renderReactProp(p));
    } else {
      memo[key] = renderReactProp(prop);
    }

    return memo;
  }, {} as Record<string, any>);
}

/**
 * If a prop is a React element (determined by the `$$typeof` property),
 * check to see if it's a Function and call it. Otherwise, recursively
 * render React props to support nested components.
 */
function renderReactProp(prop: any): any {
  if (
    typeof prop === 'object' &&
    prop['$$typeof'] === Symbol.for('react.element')
  ) {
    if (prop.type instanceof Function) {
      /**
       * We can't simply call prop.type(), since this does funky things
       * with hooks, etc. Instead, we render it to string and convert
       * it to a React object. This *still* isn't a perfect approach
       * because the component isn't wrapped in the same context
       * that the developer may have intended. However, we can
       * set expectations as thus when passing components as
       * props within Server Components.
       */
      return parseReactFromString(renderToString(prop as ReactElement));
    } else {
      return {
        ...prop,
        props: renderReactProps(prop.props),
      };
    }
  }

  return prop;
}

export function parseReactFromString(input: string, options: any = {}) {
  return domToReact(
    // @ts-ignore
    htmlToDOM(input, {lowerCaseAttributeNames: false}),
    options
  );
}
