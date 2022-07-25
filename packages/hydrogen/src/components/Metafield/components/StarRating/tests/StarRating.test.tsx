import React from 'react';
import {getRawMetafield} from '../../../../../utilities/tests/metafields.js';
import {mount} from '@shopify/react-testing';
import {StarRating, Star} from '../StarRating.js';
import {Rating} from '../../../../../types.js';
import {Link} from '../../../../Link/Link.client.js';
import {mountWithProviders} from '../../../../../utilities/tests/shopifyMount.js';

describe('<StarRating />', () => {
  it('renders the number of stars in the rating scale', () => {
    const rating = getRawMetafield({type: 'rating'});
    const parsedRating = JSON.parse(rating.value ?? '') as Rating;
    const component = mount(<StarRating rating={parsedRating} />);

    const range = parsedRating.scale_max - parsedRating.scale_min + 1;
    expect(component).toContainReactComponentTimes(Star, range);
  });

  it('renders the number of filled stars corresponding to the rating value', () => {
    const rating = getRawMetafield({type: 'rating'});
    const parsedRating = JSON.parse(rating.value ?? '') as Rating;
    const component = mount(<StarRating rating={parsedRating} />);

    // The number of completely filled stars should be the integer value of the rating
    // minus the minumum scale value, plus one (since the scale is inclusive)
    const numberOfCompletelyFilledStars =
      Math.floor(parsedRating.value) - parsedRating.scale_min + 1;
    const partialStarFill = (parsedRating.value % 1) * 100;

    expect(component).toContainReactComponentTimes(
      Star,
      numberOfCompletelyFilledStars,
      {
        percentFilled: 100,
      }
    );
    expect(component).toContainReactComponentTimes(Star, 1, {
      percentFilled: partialStarFill,
    });
  });

  it(`validates props when passed a component to the 'as' prop`, () => {
    const rating = getRawMetafield({type: 'rating'});
    const parsedRating = JSON.parse(rating.value ?? '') as Rating;

    const component = mountWithProviders(
      <StarRating rating={parsedRating} as={Link} to="/test" />
    );

    expect(component).toContainReactComponent(Link, {
      to: '/test',
    });
  });
});
