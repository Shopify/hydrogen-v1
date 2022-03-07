import {RawHtml} from '@shopify/hydrogen';

export function MyComponent() {
  return <RawHtml dangerouslySetInnerHTMLString="<p>Hello world</p>" />;
}
