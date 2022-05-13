import React from 'react';
import {Image} from '../Image';
import {mount} from '@shopify/react-testing';
import {getPreviewImage} from '../../../utilities/tests/media';
import * as utilities from '../../../utilities';

describe('<Image />', () => {
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
      utilities.getShopifyImageDimensions.mockClear();
    });

    // eslint-disable-next-line jest/no-focused-tests
    it.only('renders an `img` element without `width` and `height` attributes when invalid dimensions are provided', () => {
      const image = getPreviewImage({
        url: 'https://cdn.shopify.com/someimage.jpg',
      });
      const options = {scale: 2 as const};
      const mockDimensions = {
        width: undefined,
        height: undefined,
      };

      jest
        .spyOn(utilities, 'getShopifyImageDimensions')
        .mockReturnValue(mockDimensions);
      const component = mount(<Image data={image} loaderOptions={options} />);

      const img = component.find('img');
      expect(img?.prop('width')).toBeUndefined();
      expect(img?.prop('height')).toBeUndefined();

      // @ts-expect-error This was mocked out and needs to be restored
      utilities.getShopifyImageDimensions.mockClear();
    });

    describe('Loaders', () => {
      it('calls `shopifyImageLoader()` when no `loader` prop is provided', () => {
        const image = getPreviewImage({
          url: 'https://cdn.shopify.com/someimage.jpg',
        });

        const transformedSrc =
          'https://cdn.shopify.com/someimage_100x200@2x.jpg';

        const options = {width: '100', height: '200', scale: 2 as const};

        const shopifyImageLoaderSpy = jest
          .spyOn(utilities, 'shopifyImageLoader')
          .mockReturnValue(transformedSrc);

        const component = mount(<Image data={image} loaderOptions={options} />);

        expect(shopifyImageLoaderSpy).toHaveBeenCalledWith({
          src: image.url,
          options,
        });
        expect(component).toContainReactComponent('img', {
          src: transformedSrc,
        });

        // @ts-expect-error This was mocked out and needs to be restored
        utilities.shopifyImageLoader.mockClear();
      });

      it('uses the `loader` and a combination of both `options` and `loaderOptions` props to transform the src when these props are provided', () => {
        const image = getPreviewImage({
          url: 'https://cdn.shopify.com/someimage.jpg',
        });
        const transformedSrc =
          'https://cdn.shopify.com/someimage_150x200@2x.jpg';
        const loaderMock = jest.fn().mockReturnValue(transformedSrc);
        const options = {width: '150'};
        const loaderOptions = {
          height: 200,
          scale: 2 as const,
        };

        const component = mount(
          <Image
            data={image}
            loader={loaderMock}
            loaderOptions={loaderOptions}
          />
        );

        expect(component).toContainReactComponent('img', {
          src: transformedSrc,
        });

        expect(loaderMock).toHaveBeenCalledWith({
          src: image.url,
          options: {...options, ...loaderOptions},
        });
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
        />
      );

      expect(component).toContainReactComponent('img', {
        loading,
      });
    });

    describe('Width and height checks', () => {
      let consoleErrorSpy: jest.SpyInstance;
      let consoleWarnSpy: jest.SpyInstance;

      beforeEach(() => {
        consoleErrorSpy = jest.spyOn(console, 'error');
        consoleErrorSpy.mockImplementation(() => {});
        consoleWarnSpy = jest.spyOn(console, 'warn');
        consoleWarnSpy.mockImplementation(() => {});
      });

      afterEach(() => {
        consoleErrorSpy.mockRestore();
        consoleWarnSpy.mockRestore();
      });

      it('throws an error when the `width` is set to zero', () => {
        const {url: src, id} = getPreviewImage();
        const width = 0;
        const height = 100;

        expect(() => {
          mount(<Image src={src} id={id} width={width} height={height} />);
        }).toThrowError(
          `<Image/>: when 'src' is provided, 'width' and 'height' are required and need to be valid values (i.e. greater than zero). Provided values: 'src': ${src}, 'width': ${width}, 'height': ${height}`
        );
      });

      it('throws an error when the `height` is set to zero', () => {
        const {url: src, id} = getPreviewImage();
        const width = 100;
        const height = 0;

        expect(() => {
          mount(<Image src={src} id={id} width={width} height={height} />);
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
  });
});
