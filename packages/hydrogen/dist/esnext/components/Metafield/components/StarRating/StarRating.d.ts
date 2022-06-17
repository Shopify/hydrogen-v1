import { Rating } from '../../../../types';
export declare const STAR_EMPTY = "\u2606";
export declare const STAR_FILLED = "\u2605";
export interface StarRatingProps<TTag> {
    rating: Rating;
    /** An HTML tag to be rendered as the base element wrapper. The default is `div`. */
    as?: TTag;
}
export declare function StarRating<TTag extends keyof JSX.IntrinsicElements = 'div'>(props: JSX.IntrinsicElements[TTag] & StarRatingProps<TTag>): JSX.Element;
export declare function Star({ percentFilled }: {
    percentFilled: number;
}): JSX.Element;
