import React from 'react';
import {getParsedMetafield} from '../../../../../utilities/tests/metafields';
import {mount} from '@shopify/react-testing';
import {StarRating, Star} from '../StarRating';
import {Rating} from '../../../../../types';

describe('<StarRating />', () => {
  it('renders the number of stars in the rating scale', () => {
    const rating = getParsedMetafield({type: 'rating'});
    const component = mount(<StarRating rating={rating.value as Rating} />);

    const range =
      parseInt((rating.value! as any).scale_max) -
      parseInt((rating.value! as any).scale_min) +
      1;
    expect(component).toContainReactComponentTimes(Star, range);
  });

  /**
   * TODO: Fix the flakiness of this test, likely due to floating point math :)
   */
  it.skip('renders the number of filled stars corresponding to the rating value', () => {
    const rating = getParsedMetafield({type: 'rating'});
    const component = mount(<StarRating rating={rating.value as Rating} />);

    // The number of completely filled stars should be the integer value of the rating
    // minus the minumum scale value, plus one (since the scale is inclusive)
    const numberOfCompletelyFilledStars =
      parseInt((rating.value as any).value) -
      (rating.value as any).scale_min +
      1;
    const partialStarFill = (parseFloat((rating.value as any).value) % 1) * 100;

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
});
