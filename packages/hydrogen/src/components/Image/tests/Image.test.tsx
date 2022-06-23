import React from 'react';
import {Image} from '../Image';
import {mount} from '@shopify/react-testing';
import {getPreviewImage} from '../../../utilities/tests/media';
import * as utilities from '../../../utilities';

describe('<Image />', () => {
  let consoleWarnSpy: jest.SpyInstance;
  beforeEach(() => {
    consoleWarnSpy = jest.spyOn(console, 'warn');
    consoleWarnSpy.mockImplementation(() => {});
  });
  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });
  describe('Shopify image data', () => {
    it('renders an `img` element', () => {
      const image = getPreviewImage();
      const {url: src, altText, id, width, height} = image;

      const component = mount(<Image data={image} />);

      expect(component).toContainReactComponent('img', {
        src,
        alt: altText,
        id,
        width,
        height,
        loading: 'lazy',
      });
    });

    it('renders an `img` element with provided `id`', () => {
      const image = getPreviewImage();
      const id = 'catImage';

      const component = mount(<Image data={image} id={id} />);

      expect(component).toContainReactComponent('img', {
        id,
      });
    });

    it('renders an `img` element with provided `loading` value', () => {
      const image = getPreviewImage();
      const loading = 'eager';

      const component = mount(<Image data={image} loading={loading} />);

      expect(component).toContainReactComponent('img', {
        loading,
      });
    });

    it('renders an `img` with `width` and `height` values', () => {
      const image = getPreviewImage({
        url: 'https://cdn.shopify.com/someimage.jpg',
      });
      const options = {scale: 2 as const};
      const mockDimensions = {
        width: 200,
        height: 100,
      };
      jest
        .spyOn(utilities, 'getShopifyImageDimensions')
        .mockReturnValue(mockDimensions);

      const component = mount(<Image data={image} loaderOptions={options} />);

      expect(component).toContainReactComponent('img', {
        width: mockDimensions.width,
        height: mockDimensions.height,
      });

      // @ts-expect-error clear the mock that was created earlier
      utilities.getShopifyImageDimensions.mockRestore();
    });

    it('renders an `img` element without `width` and `height` attributes when invalid dimensions are provided', () => {
      const image = getPreviewImage({
        url: 'https://cdn.shopify.com/someimage.jpg',
      });
      const options = {scale: 2 as const};
      const mockDimensions = {
        width: null,
        height: null,
      };

      jest
        .spyOn(utilities, 'getShopifyImageDimensions')
        .mockReturnValue(mockDimensions);
      const component = mount(<Image data={image} loaderOptions={options} />);

      const img = component.find('img');
      expect(img?.prop('width')).toBeUndefined();
      expect(img?.prop('height')).toBeUndefined();

      // @ts-expect-error This was mocked out and needs to be restored
      utilities.getShopifyImageDimensions.mockRestore();
    });

    describe('Loaders', () => {
      it('calls `shopifyImageLoader()` when no `loader` prop is provided', () => {
        const image = getPreviewImage({
          url: 'https://cdn.shopify.com/someimage.jpg',
        });

        const transformedSrc =
          'https://cdn.shopify.com/someimage_100x200@2x.jpg';

        const options = {width: 100, height: 200, scale: 2 as const};

        const shopifyImageLoaderSpy = jest
          .spyOn(utilities, 'shopifyImageLoader')
          .mockReturnValue(transformedSrc);

        const component = mount(<Image data={image} loaderOptions={options} />);

        expect(shopifyImageLoaderSpy).toHaveBeenCalledWith({
          src: image.url,
          ...options,
        });
        expect(component).toContainReactComponent('img', {
          src: transformedSrc,
        });

        // @ts-expect-error This was mocked out and needs to be restored
        utilities.shopifyImageLoader.mockRestore();
      });
    });

    it('allows passthrough props', () => {
      const image = getPreviewImage({
        url: 'https://cdn.shopify.com/someimage.jpg',
      });

      const component = mount(
        <Image data={image} className="fancyImage" id="123" alt="Fancy image" />
      );

      expect(component).toContainReactComponent('img', {
        className: 'fancyImage',
        id: '123',
        alt: 'Fancy image',
      });
    });

    it('generates a default srcset', () => {
      const mockUrl = 'https://cdn.shopify.com/someimage.jpg';
      const sizes = [352, 832, 1200, 1920, 2560];
      const expectedSrcset = sizes
        .map((size) => `${mockUrl}?width=${size} ${size}w`)
        .join(', ');
      const image = getPreviewImage({
        url: mockUrl,
        width: 2560,
        height: 2560,
      });

      const component = mount(<Image data={image} />);

      expect(component).toContainReactComponent('img', {
        srcSet: expectedSrcset,
      });
    });

    it('generates a default srcset up to the image height and width', () => {
      const mockUrl = 'https://cdn.shopify.com/someimage.jpg';
      const sizes = [352, 832];
      const expectedSrcset = sizes
        .map((size) => `${mockUrl}?width=${size} ${size}w`)
        .join(', ');
      const image = getPreviewImage({
        url: mockUrl,
        width: 832,
        height: 832,
      });

      const component = mount(<Image data={image} />);

      expect(component).toContainReactComponent('img', {
        srcSet: expectedSrcset,
      });
    });

    it(`uses scale to multiply the srcset width but not the element width, and when crop is missing, does not include height in srcset`, () => {
      const image = getPreviewImage({
        url: 'https://cdn.shopify.com/someimage.jpg',
        width: 500,
        height: 500,
      });

      const component = mount(
        <Image data={image} loaderOptions={{scale: 2}} />
      );

      expect(component).toContainReactComponent('img', {
        width: 500,
        height: 500,
        // height is not applied if there is no crop
        // width is not doulbe of the passed width, but instead double of the value in 'sizes_array' / '[number]w'
        srcSet: `${image.url}?width=704 352w`,
      });
    });

    it(`uses scale to multiply the srcset width but not the element width, and when crop is there, includes height in srcset`, () => {
      const image = getPreviewImage({
        url: 'https://cdn.shopify.com/someimage.jpg',
        width: 500,
        height: 500,
      });

      const component = mount(
        <Image
          data={image}
          loaderOptions={{scale: 2, crop: 'bottom'}}
          width={500}
          height={250}
        />
      );

      expect(component).toContainReactComponent('img', {
        width: 500,
        height: 250,
        // height is the aspect ratio (of width + height) * srcSet width, so in this case it should be half of width
        srcSet: `${image.url}?width=704&height=352&crop=bottom 352w`,
      });
    });

    it(`uses scale to multiply the srcset width but not the element width, and when crop is there, includes height in srcset using data.width / data.height for the aspect ratio`, () => {
      const image = getPreviewImage({
        url: 'https://cdn.shopify.com/someimage.jpg',
        width: 500,
        height: 500,
      });

      const component = mount(
        <Image data={image} loaderOptions={{scale: 2, crop: 'bottom'}} />
      );

      expect(component).toContainReactComponent('img', {
        width: 500,
        height: 500,
        // height is the aspect ratio (of data.width + data.height) * srcSet width, so in this case it should be the same as width
        srcSet: `${image.url}?width=704&height=704&crop=bottom 352w`,
      });
    });

    it(`uses scale to multiply the srcset width but not the element width, and when crop is there, calculates height based on aspect ratio in srcset`, () => {
      const image = getPreviewImage({
        url: 'https://cdn.shopify.com/someimage.jpg',
        width: 500,
        height: 1000,
      });

      const component = mount(
        <Image data={image} loaderOptions={{scale: 2, crop: 'bottom'}} />
      );

      expect(component).toContainReactComponent('img', {
        width: 500,
        height: 1000,
        // height is the aspect ratio (of data.width + data.height) * srcSet width, so in this case it should be double the width
        srcSet: `${image.url}?width=704&height=1408&crop=bottom 352w`,
      });
    });

    it(`should pass through width (as an inline prop) when it's a string, and use the first size in the size array for the URL width`, () => {
      const image = getPreviewImage({
        url: 'https://cdn.shopify.com/someimage.jpg',
        width: 100,
        height: 100,
      });

      const component = mount(<Image data={image} width="100%" />);

      expect(component).toContainReactComponent('img', {
        width: '100%',
        src: `${image.url}?width=352`,
        height: undefined, // make sure height isn't NaN
      });
    });

    it(`should pass through width (as part of loaderOptions) when it's a string, and use the first size in the size array for the URL width`, () => {
      const image = getPreviewImage({
        url: 'https://cdn.shopify.com/someimage.jpg',
        width: 100,
        height: 100,
      });

      const component = mount(
        <Image data={image} loaderOptions={{width: '100%'}} />
      );

      expect(component).toContainReactComponent('img', {
        width: '100%',
        src: `${image.url}?width=352`,
        height: undefined, // make sure height isn't NaN
      });
    });
  });

  describe('External image', () => {
    it('renders an `img` element', () => {
      const {url: src, altText, id, width, height} = getPreviewImage();
      const component = mount(
        <Image src={src} alt={altText} id={id} width={width} height={height} />
      );

      expect(component).toContainReactComponent('img', {
        src,
        alt: altText,
        id,
        width,
        height,
        loading: 'lazy',
      });
    });

    it('renders an `img` element with provided `loading` value', () => {
      const {url: src, id, width, height} = getPreviewImage();
      const loading = 'eager';
      const component = mount(
        <Image
          src={src}
          id={id}
          width={width}
          height={height}
          loading={loading}
          alt=""
        />
      );

      expect(component).toContainReactComponent('img', {
        loading,
      });
    });

    describe('Width and height checks', () => {
      let consoleErrorSpy: jest.SpyInstance;

      beforeEach(() => {
        consoleErrorSpy = jest.spyOn(console, 'error');
        consoleErrorSpy.mockImplementation(() => {});
      });

      afterEach(() => {
        consoleErrorSpy.mockRestore();
      });

      it('throws an error when the `width` is set to zero', () => {
        const {url: src, id} = getPreviewImage();
        const width = 0;
        const height = 100;

        expect(() => {
          mount(
            <Image src={src} id={id} width={width} height={height} alt="" />
          );
        }).toThrowError(
          `<Image/>: when 'src' is provided, 'width' and 'height' are required and need to be valid values (i.e. greater than zero). Provided values: 'src': ${src}, 'width': ${width}, 'height': ${height}`
        );
      });

      it('throws an error when the `height` is set to zero', () => {
        const {url: src, id} = getPreviewImage();
        const width = 100;
        const height = 0;

        expect(() => {
          mount(
            <Image src={src} id={id} width={width} height={height} alt="" />
          );
        }).toThrowError(
          `<Image/>: when 'src' is provided, 'width' and 'height' are required and need to be valid values (i.e. greater than zero). Provided values: 'src': ${src}, 'width': ${width}, 'height': ${height}`
        );
      });
    });

    it('uses the `loader` and `loaderOptions` props to transform the src when these props are provided', () => {
      const {
        url: src,
        id,
        width,
        height,
      } = getPreviewImage({
        url: 'https://cdn.shopify.com/someimage.jpg',
      });
      const transformedSrc = 'https://cdn.shopify.com/someimage_100x200@2x.jpg';
      const loaderMock = jest.fn().mockReturnValue(transformedSrc);
      const loaderOptions = {
        width: 100,
        height: 200,
        scale: 2 as const,
      };

      const component = mount(
        <Image
          src={src}
          id={id}
          width={width}
          height={height}
          loader={loaderMock}
          loaderOptions={loaderOptions}
          alt=""
        />
      );

      expect(component).toContainReactComponent('img', {
        src: transformedSrc,
      });

      expect(loaderMock).toHaveBeenCalledWith({
        src,
        ...loaderOptions,
      });
    });

    it('allows passthrough props', () => {
      const {url: src, width, height} = getPreviewImage();
      const component = mount(
        <Image
          src={src}
          alt="Fancy image"
          width={width}
          height={height}
          className="fancyImage"
          id="123"
        />
      );

      expect(component).toContainReactComponent('img', {
        className: 'fancyImage',
        id: '123',
        alt: 'Fancy image',
      });
    });

    it('generates a srcset when a loader and a widths prop are provided', () => {
      const mockUrl = 'https://cdn.externalImg.com/someimage.jpg';
      const sizes = [352, 832, 1200];
      const loaderOptions = {
        width: 600,
        height: 800,
        scale: 1,
      };

      const loader = (loaderOptions: {
        src: string;
        width: number;
        height: number;
        scale: number;
      }): string =>
        `${loaderOptions.src}?w=${loaderOptions.width}&h=${loaderOptions.height}`;

      const heightToWidthRatio = loaderOptions.height / loaderOptions.width;
      const expectedSrcset = sizes
        .map(
          (size) =>
            `${loader({
              src: mockUrl,
              width: size,
              height: Math.floor(size * heightToWidthRatio),
              scale: loaderOptions.scale,
            })} ${size}w`
        )
        .join(', ');

      const component = mount(
        <Image
          src={mockUrl}
          loader={loader as any}
          loaderOptions={loaderOptions}
          widths={sizes}
          width={loaderOptions.width}
          height={loaderOptions.height}
          alt={'Fancy image'}
        />
      );

      expect(component).toContainReactComponent('img', {
        srcSet: expectedSrcset,
      });
    });
  });

  // eslint-disable-next-line jest/expect-expect
  it.skip(`typescript types`, () => {
    // this test is actually just using //@ts-expect-error as the assertion, and don't need to execute in order to have TS validation on them
    // I don't love this idea, but at the moment I also don't have other great ideas for how to easily test our component TS types

    // no errors in these situations
    <Image data={{url: ''}} />;
    <Image src="" width="" height="" alt="" />;

    // @ts-expect-error data.url
    <Image data={{}} />;

    // @ts-expect-error data and src
    <Image data={{url: ''}} src="" width="" height="" />;

    // @ts-expect-error foo is invalid
    <Image data={{url: ''}} foo="bar" />;

    // @ts-expect-error must have alt
    <Image src="" width="" height="" />;

    // @ts-expect-error must have width
    <Image src="" alt="" height="" />;

    // @ts-expect-error must have height
    <Image src="" alt="" width="" />;
  });
});
