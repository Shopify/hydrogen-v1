import React from 'react';

export interface RawHtmlProps<TTag> {
  /** An HTML string. */
  dangerouslySetInnerHTMLString: string;
  /** An HTML tag to be rendered as the base element wrapper. The default is `div`. */
  as?: TTag;
}

/**
 * The `RawHtml` component renders an HTML string as HTML DOM elements. This should be used for
 * displaying rich text-like descriptions associated with a product.
 *
 * This component uses `dangerouslySetInnerHTML`. In general, setting HTML from code is risky
 * because it’s easy to inadvertently expose your users to a
 * [cross-site scripting (XSS)](https://en.wikipedia.org/wiki/Cross-site_scripting) attack.
 */
export function RawHtml<TTag extends keyof JSX.IntrinsicElements = 'div'>(
  props: JSX.IntrinsicElements[TTag] & RawHtmlProps<TTag>
) {
  const {dangerouslySetInnerHTMLString, unsanitized, as, ...passthroughProps} =
    props;
  const Wrapper = as ?? 'div';

  return (
    <Wrapper
      {...passthroughProps}
      dangerouslySetInnerHTML={{__html: dangerouslySetInnerHTMLString}}
    ></Wrapper>
  );
}
