import React, {ElementType} from 'react';
import {Props} from '../types';
import DOMPurify from 'dompurify';

import type {Config as DOMPurifyConfig} from 'dompurify';

const DOMPURIFY_CONFIG: DOMPurifyConfig = {
  FORBID_ATTR: ['style'],
};

export interface RawHtmlProps<TTag> {
  /** An HTML string. */
  string: string;
  /** Whether the HTML string should be sanitized with `DOMPurify`. */
  unsanitized?: boolean;
  /** An HTML tag to be rendered as the base element wrapper. The default is `div`. */
  as?: TTag;
  /** A config object for DOMPurify. Defaults to `{ FORBID_ATTR: ['style'] }` */
  dompurifyConfig?: DOMPurifyConfig;
}

/**
 * The `RawHtml` component renders an HTML string as HTML DOM elements. This should be used for
 * displaying rich text-like descriptions associated with a product.
 *
 * The string passed to `RawHtml` is sanitized with
 * [DOMPurify](https://github.com/cure53/DOMPurify) by default.
 * To keep the text unsanitized, set the `unsanitized` prop to `true`.
 */
export function RawHtml<TTag extends ElementType>(
  props: Props<TTag> & RawHtmlProps<TTag>
) {
  const {string, unsanitized, as, dompurifyConfig, ...passthroughProps} = props;
  const Wrapper = as ?? 'div';

  const sanitizedString = React.useMemo(() => {
    if (unsanitized) {
      return string;
    }

    // TODO: Re-enable when we find a way to support Worker runtime
    return DOMPurify.sanitize(
      string,
      dompurifyConfig || DOMPURIFY_CONFIG
    ).toString();
  }, [string, !!unsanitized]);

  return (
    <Wrapper
      {...passthroughProps}
      dangerouslySetInnerHTML={{__html: sanitizedString}}
    ></Wrapper>
  );
}
