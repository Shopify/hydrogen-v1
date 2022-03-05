import React, {ElementType} from 'react';
import type {SanitizeOptions} from '../../types';
import {sanitize} from '../../utilities/sanitize';
import {Props} from '../types';

export interface RawHtmlProps<TTag> {
  /** An HTML string. */
  string: string;
  /** Whether the HTML string should be sanitized */
  unsanitized?: boolean;
  /** An HTML tag to be rendered as the base element wrapper. The default is `div`. */
  as?: TTag;
  /** Sanitize options. */
  sanitizeOptions?: SanitizeOptions;
}

/**
 * The `RawHtml` component renders an HTML string as HTML DOM elements. This should be used for
 * displaying rich text-like descriptions associated with a product.
 *
 * The string passed to `RawHtml` is sanitized with DOMPurify's allowed list of tags and attributes.
 */
export function RawHtml<TTag extends ElementType>(
  props: Props<TTag> & RawHtmlProps<TTag>
) {
  const {string, unsanitized, sanitizeOptions, as, ...passthroughProps} = props;
  const Wrapper = as ?? 'div';
  const sanitizedString = React.useMemo(() => {
    if (unsanitized) {
      return string;
    }

    return sanitize(
      string,
      sanitizeOptions || {
        forbidAttrs: ['style'],
      }
    );
  }, [string, !!unsanitized]);

  return (
    <Wrapper
      {...passthroughProps}
      dangerouslySetInnerHTML={{__html: sanitizedString}}
    ></Wrapper>
  );
}
