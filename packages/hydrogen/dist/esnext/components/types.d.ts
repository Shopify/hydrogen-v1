import { ReactNode, ElementType, ComponentProps, ReactElement } from 'react';
/**
 * Inspired by HeadlessUI
 * @see https://github.com/tailwindlabs/headlessui/blob/6a01c54b15bc0291af737dfc2a225dca88f3fa55/packages/\@headlessui-react/src/types.ts#L11-L13
 */
/**
 * Used as a default value for TOmitableProps. Actual values will be element props
 * we control e.g. `value` which we don't want developers to set on a component.
 */
declare const __: "__";
declare type __ = typeof __;
/**
 * This helper type pulls the ComponentProps from a given `TTag` element. This is
 * nice because it smartly pulls props from native HTML elements in addition to
 * React components.
 */
declare type PropsOf<TTag = any> = TTag extends ElementType ? ComponentProps<TTag> : never;
/**
 * This is a "global" list of props we are always going to control, meaning
 * we'll omit the original prop definition if it exists.
 */
declare type PropsWeControl = keyof OurProps;
/**
 * This is the "global" list of our props, similar to above. It is applied to
 * every component using `Props`.
 */
declare type OurProps = {
    children?: ReactNode;
};
declare type CleanProps<TTag, TOmitableProps extends keyof any = __> = TOmitableProps extends __ ? Omit<PropsOf<TTag>, PropsWeControl> : Omit<PropsOf<TTag>, TOmitableProps | PropsWeControl>;
/**
 * Props is a helper type which allows us to combine the base props of a given element `TTag`, combine "global" `OurProps`,
 * and Omit props that we do not allow for the given component.
 *
 * ## How to use Props
 *
 * Think of it like a function!
 * - The first arg, `TTag`, should extend `React.ElementType` and it might default to a native HTML element,
 * like `input`.
 * - The second arg, `TOmittableProps`, is optional. It is a string or union of strings that represent props
 * that you do NOT allow in your component, because you overwrite them and control them yourself. One example
 * of this is an `onClick` handler for e.g. a button.
 *
 * You can combine `Props` with your own type definition with & to define props for your component.
 *
 * Example:
 *
 * ```
 * type MyProps = {
 *   customThing: string
 * }
 *
 * type PropsWeControl = 'onClick'
 *
 * export function MyButton<TTag extends React.ElementType = 'button'>(props: Props<TTag, PropsWeControl> & MyProps) {
 *   const {customThing, children, ...passthroughProps} = props;
 *
 *   return <button {...passthroughProps} onClick={() => {}}>{children}</button>
 * }
 * ```
 *
 */
export declare type Props<TTag, TOmitableProps extends keyof any = __> = CleanProps<TTag, TOmitableProps> & OurProps;
/**
 * While similar to `Props`, this props an additional second argument `TSlot` which represents the interface
 * of the object passed to the callback via render props. Useful for headless components that expect render props.
 */
export declare type PropsWithSlot<TTag, TSlot = any, TOmitableProps extends keyof any = __> = CleanProps<TTag, TOmitableProps> & {
    children?: ReactNode | ((props: TSlot) => ReactElement);
};
export {};
