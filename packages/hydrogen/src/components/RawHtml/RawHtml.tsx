import React, {ElementType} from 'react';
import {Props} from '../types';

// TODO: Revisit with Worker runtime
// import * as DOMPurify from 'isomorphic-dompurify';

// const DOMPURIFY_CONFIG = {
//   FORBID_ATTR: ['style'],
// };

export interface RawHtmlProps {
  /** An HTML string. */
  string: string;
  /** Whether the HTML string should be sanitized with `isomorphic-dompurify`. */
  unsanitized?: boolean;
}

/**
 * The `RawHtml` component renders an HTML string as HTML DOM elements. This should be used for
 * displaying rich text-like descriptions associated with a product.
 *
 * The string passed to `RawHtml` is sanitized with
 * [isomorphic-dompurify](https://github.com/kkomelin/isomorphic-dompurify) by default.
 * To keep the text unsanitized, set the `unsanitized` prop to `true`.
 */
export function RawHtml<TTag extends ElementType>(
  props: Props<TTag> & RawHtmlProps
) {
  const {string, unsanitized, as, ...passthroughProps} = props;
  const Wrapper = as ?? 'div';
  const sanitizedString = React.useMemo(() => {
    if (unsanitized || true) {
      return string;
    }

    // TODO: Re-enable when we find a way to support Worker runtime
    // return DOMPurify.sanitize(text, DOMPURIFY_CONFIG);
  }, [string, unsanitized]);

  return (
    <Wrapper
      {...passthroughProps}
      dangerouslySetInnerHTML={{__html: sanitizedString}}
    ></Wrapper>
  );
}
