import React from 'react';
import {vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import {Image} from '../index.js';
import {getPreviewImage} from '../../../utilities/tests/media.js';
import * as utilities from '../../../utilities/index.js';

describe('<Image />', () => {
  beforeAll(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('Shopify image data', () => {
    it('renders an `img` element', () => {
      const previewImage = getPreviewImage();
      const {url: src, altText, id, width, height} = previewImage;
      render(<Image data={previewImage} />);

      const image = screen.getByRole('img');

      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', src);
      expect(image).toHaveAttribute('id', id);
      expect(image).toHaveAttribute('alt', altText);
      expect(image).toHaveAttribute('width', `${width}`);
      expect(image).toHaveAttribute('height', `${height}`);
      expect(image).toHaveAttribute('loading', 'lazy');
    });

    it('renders an `img` element with provided `id`', () => {
      const previewImage = getPreviewImage();
      const id = 'catImage';
      render(<Image data={previewImage} id={id} />);

      const image = screen.getByRole('img');

      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('id', id);
    });

    it('renders an `img` element with provided `loading` value', () => {
      const previewImage = getPreviewImage();
      const loading = 'eager';
      render(<Image data={previewImage} loading={loading} />);

      const image = screen.getByRole('img');

      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('loading', loading);
    });

    it('renders an `img` with `width` and `height` values', () => {
      const previewImage = getPreviewImage({
        url: 'https://cdn.shopify.com/someimage.jpg',
      });
      const options = {scale: 2 as const};
      const mockDimensions = {
        width: 200,
        height: 100,
      };

      vi.spyOn(utilities, 'getShopifyImageDimensions').mockReturnValue(
        mockDimensions
      );

      render(<Image data={previewImage} loaderOptions={options} />);

      const image = screen.getByRole('img');

      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('width', `${mockDimensions.width}`);
      expect(image).toHaveAttribute('height', `${mockDimensions.height}`);
    });

    it('renders an `img` element without `width` and `height` attributes when invalid dimensions are provided', () => {
      const previewImage = getPreviewImage({
        url: 'https://cdn.shopify.com/someimage.jpg',
      });
      const options = {scale: 2 as const};
      const mockDimensions = {
        width: null,
        height: null,
      };

      vi.spyOn(utilities, 'getShopifyImageDimensions').mockReturnValue(
        mockDimensions
      );

      render(<Image data={previewImage} loaderOptions={options} />);

      const image = screen.getByRole('img');

      expect(image).toBeInTheDocument();
      expect(image).not.toHaveAttribute('width');
      expect(image).not.toHaveAttribute('height');
    });

    describe('Loaders', () => {
      it('calls `shopifyImageLoader()` when no `loader` prop is provided', () => {
        const previewImage = getPreviewImage({
          url: 'https://cdn.shopify.com/someimage.jpg',
        });

        const transformedSrc =
          'https://cdn.shopify.com/someimage_100x200@2x.jpg';

        const options = {width: 100, height: 200, scale: 2 as const};

        const shopifyImageLoaderSpy = vi
          .spyOn(utilities, 'shopifyImageLoader')
          .mockReturnValue(transformedSrc);

        render(<Image data={previewImage} loaderOptions={options} />);

        expect(shopifyImageLoaderSpy).toHaveBeenCalledWith({
          src: previewImage.url,
          ...options,
        });

        const image = screen.getByRole('img');

        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', transformedSrc);
      });
    });

    it('allows passthrough props', () => {
      const previewImage = getPreviewImage({
        url: 'https://cdn.shopify.com/someimage.jpg',
      });

      render(
        <Image
          data={previewImage}
          className="fancyImage"
          id="123"
          alt="Fancy image"
        />
      );

      const image = screen.getByRole('img');

      expect(image).toBeInTheDocument();
      expect(image).toHaveClass('fancyImage');
      expect(image).toHaveAttribute('id', '123');
      expect(image).toHaveAttribute('alt', 'Fancy image');
    });

    it('generates a default srcset', () => {
      const mockUrl = 'https://cdn.shopify.com/someimage.jpg';
      const sizes = [352, 832, 1200, 1920, 2560];
      const expectedSrcset = sizes
        .map((size) => `${mockUrl}?width=${size} ${size}w`)
        .join(', ');
      const previewImage = getPreviewImage({
        url: mockUrl,
        width: 2560,
        height: 2560,
      });

      render(<Image data={previewImage} />);

      const image = screen.getByRole('img');

      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('srcSet', expectedSrcset);
    });

    it('generates a default srcset up to the image height and width', () => {
      const mockUrl = 'https://cdn.shopify.com/someimage.jpg';
      const sizes = [352, 832];
      const expectedSrcset = sizes
        .map((size) => `${mockUrl}?width=${size} ${size}w`)
        .join(', ');
      const previewImage = getPreviewImage({
        url: mockUrl,
        width: 832,
        height: 832,
      });

      render(<Image data={previewImage} />);

      const image = screen.getByRole('img');

      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('srcSet', expectedSrcset);
    });

    it(`uses scale to multiply the srcset width but not the element width, and when crop is missing, does not include height in srcset`, () => {
      const previewImage = getPreviewImage({
        url: 'https://cdn.shopify.com/someimage.jpg',
        width: 500,
        height: 500,
      });

      render(<Image data={previewImage} loaderOptions={{scale: 2}} />);

      const image = screen.getByRole('img');

      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute(
        'srcSet',
        // height is not applied if there is no crop
        // width is not doulbe of the passed width, but instead double of the value in 'sizes_array' / '[number]w'
        `${previewImage.url}?width=704 352w`
      );
      expect(image).toHaveAttribute('width', '500');
      expect(image).toHaveAttribute('height', '500');
    });

    it(`uses scale to multiply the srcset width but not the element width, and when crop is there, includes height in srcset`, () => {
      const previewImage = getPreviewImage({
        url: 'https://cdn.shopify.com/someimage.jpg',
        width: 500,
        height: 500,
      });

      render(
        <Image
          data={previewImage}
          loaderOptions={{scale: 2, crop: 'bottom'}}
          width={500}
          height={250}
        />
      );

      const image = screen.getByRole('img');

      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute(
        'srcSet',
        // height is the aspect ratio (of width + height) * srcSet width, so in this case it should be half of width
        `${previewImage.url}?width=704&height=352&crop=bottom 352w`
      );
      expect(image).toHaveAttribute('width', '500');
      expect(image).toHaveAttribute('height', '250');
    });

    it(`uses scale to multiply the srcset width but not the element width, and when crop is there, includes height in srcset using data.width / data.height for the aspect ratio`, () => {
      const previewImage = getPreviewImage({
        url: 'https://cdn.shopify.com/someimage.jpg',
        width: 500,
        height: 500,
      });

      render(
        <Image data={previewImage} loaderOptions={{scale: 2, crop: 'bottom'}} />
      );

      const image = screen.getByRole('img');

      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute(
        'srcSet',
        // height is the aspect ratio (of data.width + data.height) * srcSet width, so in this case it should be the same as width
        `${previewImage.url}?width=704&height=704&crop=bottom 352w`
      );
      expect(image).toHaveAttribute('width', '500');
      expect(image).toHaveAttribute('height', '500');
    });

    it(`uses scale to multiply the srcset width but not the element width, and when crop is there, calculates height based on aspect ratio in srcset`, () => {
      const previewImage = getPreviewImage({
        url: 'https://cdn.shopify.com/someimage.jpg',
        width: 500,
        height: 1000,
      });

      render(
        <Image data={previewImage} loaderOptions={{scale: 2, crop: 'bottom'}} />
      );

      const image = screen.getByRole('img');

      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute(
        'srcSet',
        // height is the aspect ratio (of data.width + data.height) * srcSet width, so in this case it should be double the width
        `${previewImage.url}?width=704&height=1408&crop=bottom 352w`
      );
      expect(image).toHaveAttribute('width', '500');
      expect(image).toHaveAttribute('height', '1000');
    });

    it(`should pass through width (as an inline prop) when it's a string, and use the first size in the size array for the URL width`, () => {
      const previewImage = getPreviewImage({
        url: 'https://cdn.shopify.com/someimage.jpg',
        width: 100,
        height: 100,
      });

      render(<Image data={previewImage} width="100%" />);

      const image = screen.getByRole('img');

      console.log(image.getAttribute('srcSet'));

      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', `${previewImage.url}?width=352`);
      expect(image).toHaveAttribute('width', '100%');
      expect(image).not.toHaveAttribute('height');
    });

    it(`should pass through width (as part of loaderOptions) when it's a string, and use the first size in the size array for the URL width`, () => {
      const previewImage = getPreviewImage({
        url: 'https://cdn.shopify.com/someimage.jpg',
        width: 100,
        height: 100,
      });

      render(<Image data={previewImage} loaderOptions={{width: '100%'}} />);

      const image = screen.getByRole('img');

      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', `${previewImage.url}?width=352`);
      expect(image).toHaveAttribute('width', '100%');
      expect(image).not.toHaveAttribute('height');
    });
  });

  describe('External image', () => {
    it('renders an `img` element', () => {
      const {url: src, altText, id, width, height} = getPreviewImage();

      render(
        <Image src={src} alt={altText} id={id} width={width} height={height} />
      );

      const image = screen.getByRole('img');

      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', src);
      expect(image).toHaveAttribute('id', id);
      expect(image).toHaveAttribute('alt', altText);
      expect(image).toHaveAttribute('width', `${width}`);
      expect(image).toHaveAttribute('height', `${height}`);
      expect(image).toHaveAttribute('loading', 'lazy');
    });

    it('renders an `img` element with provided `loading` value', () => {
      const {url: src, id, width, height} = getPreviewImage();
      const loading = 'eager';

      render(
        <Image
          src={src}
          id={id}
          width={width}
          height={height}
          loading={loading}
          alt=""
        />
      );

      const image = screen.getByRole('img');

      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('loading', loading);
    });

    describe('Width and height checks', () => {
      it('throws an error when the `width` is set to zero', () => {
        const {url: src, id} = getPreviewImage();
        const width = 0;
        const height = 100;

        expect(() => {
          render(
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
          render(
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
      const loaderMock = vi.fn().mockReturnValue(transformedSrc);
      const loaderOptions = {
        width: 100,
        height: 200,
        scale: 2 as const,
      };

      render(
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

      const image = screen.getByRole('img');

      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', transformedSrc);

      expect(loaderMock).toHaveBeenCalledWith({
        src,
        ...loaderOptions,
      });
    });

    it('allows passthrough props', () => {
      const {url: src, width, height} = getPreviewImage();
      render(
        <Image
          src={src}
          alt="Fancy image"
          width={width}
          height={height}
          className="fancyImage"
          id="123"
        />
      );

      const image = screen.getByRole('img');

      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('id', '123');
      expect(image).toHaveAttribute('alt', 'Fancy image');
      expect(image).toHaveClass('fancyImage');
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

      render(
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

      const image = screen.getByRole('img');

      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('srcSet', expectedSrcset);
    });
  });

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
