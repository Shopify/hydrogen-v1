import {
  getShopifyImageDimensions,
  type GetShopifyImageDimensionsProps,
} from './image_size';

describe(`getShopifyImageDimensions`, () => {
  it(`gives 'loaderOptions' priority`, () => {
    expect(getShopifyImageDimensions(sampleProps())).toEqual({
      width: 2,
      height: 3,
    });
  });

  it(`gives 'elementProps' second priority`, () => {
    expect(
      getShopifyImageDimensions({
        ...sampleProps(),
        loaderOptions: undefined,
      })
    ).toEqual({
      width: 4,
      height: 5,
    });
  });

  it(`gives 'data' last priority`, () => {
    expect(
      getShopifyImageDimensions({
        ...sampleProps(),
        loaderOptions: undefined,
        elementProps: undefined,
      })
    ).toEqual({
      width: 6,
      height: 7,
    });
  });

  it(`calculates the aspect ratio for 'loaderOptions' if one param is missing`, () => {
    const props = sampleProps();
    props.loaderOptions!.height = undefined;

    expect(getShopifyImageDimensions(props)).toEqual({
      width: 2,
      height: Math.round(2 * (6 / 7)),
    });

    props.loaderOptions!.height = 3;
    props.loaderOptions!.width = undefined;

    expect(getShopifyImageDimensions(props)).toEqual({
      height: 3,
      width: Math.round(3 * (6 / 7)),
    });
  });

  it(`calculates the aspect ratio for 'elementProps' if one param is missing`, () => {
    const props = {
      ...sampleProps(),
      loaderOptions: undefined,
    };
    props.elementProps!.height = undefined;

    expect(getShopifyImageDimensions(props)).toEqual({
      width: 4,
      height: Math.round(4 * (6 / 7)),
    });

    props.elementProps!.height = 5;
    props.elementProps!.width = undefined;

    expect(getShopifyImageDimensions(props)).toEqual({
      height: 5,
      width: Math.round(5 * (6 / 7)),
    });
  });
});

function sampleProps(): GetShopifyImageDimensionsProps {
  return {
    loaderOptions: {width: 2, height: 3},
    elementProps: {width: 4, height: 5},
    data: {width: 6, height: 7},
  };
}
