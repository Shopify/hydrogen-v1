import React, {useMemo} from 'react';
import {Rating} from '../../../../types.js';

export const STAR_EMPTY = '☆';
export const STAR_FILLED = '★';

export interface StarRatingProps<TTag> {
  rating: Rating;
  /** An HTML tag to be rendered as the base element wrapper. The default is `div`. */
  as?: TTag;
}

export function StarRating<TTag extends keyof JSX.IntrinsicElements = 'div'>(
  props: JSX.IntrinsicElements[TTag] & StarRatingProps<TTag>
) {
  const {as, rating, ...passthroughProps} = props;

  const starsArray = useMemo(() => {
    const ratingMin = Math.floor(rating.scale_min);
    const ratingMax = Math.floor(rating.scale_max);
    const ratingInteger = Math.floor(rating.value);
    const ratingPercent = (rating.value % 1) * 100;

    const stars = [];
    for (let i = ratingMin; i <= ratingMax; i++) {
      if (i <= ratingInteger) {
        stars.push(<Star key={i} percentFilled={100} />);
      } else if (i > ratingInteger + 1) {
        stars.push(<Star key={i} percentFilled={0} />);
      } else {
        stars.push(<Star key={i} percentFilled={ratingPercent} />);
      }
    }
    return stars;
  }, [rating.scale_min, rating.scale_max, rating.value]);

  const Wrapper = as ?? 'div';

  return <Wrapper {...passthroughProps}>{starsArray}</Wrapper>;
}

export function Star({percentFilled}: {percentFilled: number}) {
  if (percentFilled === 100) {
    return <span>{STAR_FILLED}</span>;
  }

  if (percentFilled === 0) {
    return <span>{STAR_EMPTY}</span>;
  }

  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
      }}
    >
      <span>{STAR_EMPTY}</span>
      <span
        style={{
          display: 'inline-block',
          position: 'absolute',
          top: '0',
          left: '0',
          width: `${percentFilled}%`,
          overflow: 'hidden',
        }}
      >
        {STAR_FILLED}
      </span>
    </span>
  );
}
