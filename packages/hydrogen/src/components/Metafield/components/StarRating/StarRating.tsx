import React, {useMemo, ElementType} from 'react';
import {Props} from '../../../types';
import {Rating} from '../../../../types';

export const STAR_EMPTY = '☆';
export const STAR_FILLED = '★';

export interface StarRatingProps {
  rating: Rating;
}

export function StarRating<TTag extends ElementType>(
  props: Props<TTag> & StarRatingProps
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
