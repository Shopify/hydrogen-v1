import {ClientComponents} from './ClientComponents.server';
import {parseReactFromString} from './react-utils';

/**
 * Parse the HTML and convert it to wire syntax model.
 */
export function generateWireSyntaxFromRenderedHtml(html: string) {
  const clientComponents = new ClientComponents();

  const wireModel = parseReactFromString(html, {
    library: {
      // @ts-ignore
      createElement: convertToWireSyntax,
    },
  });

  /**
   * Converts each DOM element to React's "wire" syntax. (I came up with this name; not sure what it's called).
   * This is a terse syntax that records the model tree as an array of tuples. It also lists the client
   * components used with their corresponding IDs to import dynamically.
   */
  function convertToWireSyntax(type: any, props?: any, children?: any) {
    let componentType = type;
    let componentProps = props;

    if (props && props['data-client-component']) {
      const component = {
        name: props['data-client-component'],
        id: props['data-id'],
        named: props['data-named'] === 'true',
      };

      const index =
        clientComponents.indexOf(component) > 0
          ? clientComponents.indexOf(component)
          : clientComponents.add(component);

      componentType = `@${index}`;
      componentProps = JSON.parse(props['data-props']);
    }

    convertComponentPropsToWireSyntax(componentProps ?? {});

    if (
      isDomNode(children) ||
      (children instanceof Array && children.some(isDomNode))
    ) {
      if (children instanceof Array) {
        children = children.map((child) => {
          if (typeof child === 'string') {
            return child;
          }

          const {children, ...props} = child.props;
          return convertToWireSyntax(child.type, props, children);
        });
      } else {
        const {children: childrenChildren, ...childrenProps} = children.props;
        children = convertToWireSyntax(
          children.type,
          childrenProps,
          childrenChildren
        );
      }
    }

    /**
     * TODO: The third position is actually supposed to be `key` I think.
     * It's usually `null` which is what confused me. Find a way to pass
     * through `key` here if we have one in `props`.
     */
    return ['$', componentType, null, {...componentProps, children}];
  }

  function convertComponentPropsToWireSyntax(
    componentProps: Record<string, any>
  ) {
    Object.entries(componentProps).forEach(([key, prop]) => {
      if (isDomNode(prop)) {
        const {children, ...props} = prop.props;
        componentProps[key] = convertToWireSyntax(prop.type, props, children);
      }
    });
  }

  return (
    clientComponents
      .all()
      .map((component, idx) => {
        return `M${idx + 1}:${JSON.stringify(component)}`;
      })
      .join('\n') + `\nJ0:${JSON.stringify(wireModel)}`
  );
}

function isDomNode(item: any) {
  return item !== null && typeof item === 'object' && '_owner' in item;
}
