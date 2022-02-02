import React, {ElementType, ReactNode} from 'react';
import {useMoney} from '../../hooks';
import {Props} from '../types';
import {MoneyV2} from '../../graphql/types/types';
import {MoneyFragment as Fragment} from '../../graphql/graphql-constants';

export interface MoneyProps {
  /** An HTML tag to be rendered as the base element wrapper. The default is `div`. */
  as?: ElementType;
  /** A [`MoneyV2` object](/api/storefront/reference/common-objects/moneyv2). */
  money: MoneyV2;
  /** A function that takes an object return by the `useMoney` hook and returns a `ReactNode`. */
  children?: ReactNode;
}

/**
 * The `Money` component renders a string of the Storefront API's
 * [`MoneyV2` object](/api/storefront/reference/common-objects/moneyv2) according to the
 * `defaultLocale` in the `shopify.config.js` file. If `children` is a function, then it will
 * provide render props for the `children` corresponding to the object returned by the `useMoney` hook.
 */
export function Money<TTag extends ElementType>(
  props: Props<TTag> & MoneyProps
) {
  const {money, children, as, ...passthroughProps} = props;
  const moneyObject = useMoney(money);
  const Wrapper: any = as ?? 'div';

  return (
    <Wrapper {...passthroughProps}>
      {typeof children === 'function'
        ? children(moneyObject)
        : moneyObject.localizedString}
    </Wrapper>
  );
}

Money.Fragment = Fragment;
export const MoneyFragment = Fragment;
