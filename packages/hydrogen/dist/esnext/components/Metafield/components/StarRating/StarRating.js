import React, { useMemo } from 'react';
export const STAR_EMPTY = '☆';
export const STAR_FILLED = '★';
export function StarRating(props) {
    const { as, rating, ...passthroughProps } = props;
    const starsArray = useMemo(() => {
        const ratingMin = Math.floor(rating.scale_min);
        const ratingMax = Math.floor(rating.scale_max);
        const ratingInteger = Math.floor(rating.value);
        const ratingPercent = (rating.value % 1) * 100;
        const stars = [];
        for (let i = ratingMin; i <= ratingMax; i++) {
            if (i <= ratingInteger) {
                stars.push(React.createElement(Star, { key: i, percentFilled: 100 }));
            }
            else if (i > ratingInteger + 1) {
                stars.push(React.createElement(Star, { key: i, percentFilled: 0 }));
            }
            else {
                stars.push(React.createElement(Star, { key: i, percentFilled: ratingPercent }));
            }
        }
        return stars;
    }, [rating.scale_min, rating.scale_max, rating.value]);
    const Wrapper = as ?? 'div';
    return React.createElement(Wrapper, { ...passthroughProps }, starsArray);
}
export function Star({ percentFilled }) {
    if (percentFilled === 100) {
        return React.createElement("span", null, STAR_FILLED);
    }
    if (percentFilled === 0) {
        return React.createElement("span", null, STAR_EMPTY);
    }
    return (React.createElement("span", { style: {
            position: 'relative',
            display: 'inline-block',
        } },
        React.createElement("span", null, STAR_EMPTY),
        React.createElement("span", { style: {
                display: 'inline-block',
                position: 'absolute',
                top: '0',
                left: '0',
                width: `${percentFilled}%`,
                overflow: 'hidden',
            } }, STAR_FILLED)));
}
