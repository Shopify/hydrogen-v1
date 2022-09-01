import * as React from 'react';
import {parseMetafieldValue, Metafield, type Rating} from './Metafield.js';
import {faker} from '@faker-js/faker';
import type {
  Metafield as SFAPIMetafieldType,
  MediaImage,
  Page,
  Product,
  ProductVariant,
} from './storefront-api-types.js';
import type {PartialDeep} from 'type-fest';
import {getPreviewImage} from './Image.test.js';
import {vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import {ShopifyProvider} from './ShopifyProvider.js';
import {getShopifyConfig} from './ShopifyProvider.test.js';

const TEST_ID = 'metafields_test_id';

describe('<Metafield />', () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('renders nothing when the metafield is null', () => {
    expect(() =>
      render(<Metafield data={null} />, {
        wrapper: ({children}) => (
          <ShopifyProvider shopifyConfig={getShopifyConfig()}>
            {children}
          </ShopifyProvider>
        ),
      })
    ).toThrowError();
  });

  it('renders nothing when the metafield value is undefined', () => {
    expect(() =>
      render(<Metafield data={{type: 'color', value: undefined}} />, {
        wrapper: ({children}) => (
          <ShopifyProvider shopifyConfig={getShopifyConfig()}>
            {children}
          </ShopifyProvider>
        ),
      })
    ).toThrowError();
  });

  it.todo(`validates props when a component is passed to the 'as' prop`, () => {
    // render(
    //   <Metafield
    //     data={getRawMetafield({type: 'number_integer'})}
    //     // as={Link}
    //     to="/test"
    //   />
    // );
    // expect(component).toContainReactComponent(Link, {
    //   to: '/test',
    // });
  });

  describe('with `date` type metafield', () => {
    it('renders the localized date as a string in a `time` by default', () => {
      const metafield = getRawMetafield({type: 'date'});
      render(<Metafield data={metafield} />, {
        wrapper: ({children}) => (
          <ShopifyProvider shopifyConfig={getShopifyConfig()}>
            {children}
          </ShopifyProvider>
        ),
      });

      expect(
        screen.getByText(new Date(metafield?.value ?? '').toLocaleDateString())
      ).toBeInTheDocument();
    });

    it('renders the date as a string in the element specified by the `as` prop', () => {
      const metafield = getRawMetafield({type: 'date'});
      const {container} = render(<Metafield data={metafield} as="p" />, {
        wrapper: ({children}) => (
          <ShopifyProvider shopifyConfig={getShopifyConfig()}>
            {children}
          </ShopifyProvider>
        ),
      });

      expect(container.querySelector('p')).toHaveTextContent(
        new Date(metafield?.value ?? '').toLocaleDateString()
      );
    });

    it('allows passthrough props', () => {
      render(
        <Metafield
          data={getRawMetafield({type: 'date'})}
          className="emphasized"
          data-testId={TEST_ID}
        />
      );
      expect(screen.getByTestId(TEST_ID)).toHaveClass('emphasized');
    });
  });

  describe('with `date_time` type metafield', () => {
    it('renders the date as a string in a `time` by default', () => {
      const metafield = getRawMetafield({type: 'date_time'});
      render(<Metafield data={metafield} />, {
        wrapper: ({children}) => (
          <ShopifyProvider shopifyConfig={getShopifyConfig()}>
            {children}
          </ShopifyProvider>
        ),
      });

      expect(
        screen.getByText(new Date(metafield?.value ?? '').toLocaleString())
      ).toBeInTheDocument();
    });

    it('renders the date as a string in the element specified by the `as` prop', () => {
      const metafield = getRawMetafield({type: 'date_time'});
      const {container} = render(<Metafield data={metafield} as="p" />, {
        wrapper: ({children}) => (
          <ShopifyProvider shopifyConfig={getShopifyConfig()}>
            {children}
          </ShopifyProvider>
        ),
      });

      expect(container.querySelector('p')).toHaveTextContent(
        new Date(metafield?.value ?? '').toLocaleString()
      );
    });

    it('allows passthrough props', () => {
      render(
        <Metafield
          data={getRawMetafield({type: 'date_time'})}
          className="emphasized"
          data-testId={TEST_ID}
        />
      );
      expect(screen.getByTestId(TEST_ID)).toHaveClass('emphasized');
    });
  });

  describe('with `weight` type metafield', () => {
    it('renders the weight as a string in a `span` by default', () => {
      const metafield = getRawMetafield({
        type: 'weight',
        value: JSON.stringify({value: 10, unit: 'kg'}),
      });
      render(<Metafield data={metafield} />, {
        wrapper: ({children}) => (
          <ShopifyProvider shopifyConfig={getShopifyConfig()}>
            {children}
          </ShopifyProvider>
        ),
      });

      expect(screen.getByText('10 kg')).toBeInTheDocument();
    });

    it('renders the weight as a string in the element specified by the `as` prop', () => {
      const metafield = getRawMetafield({
        type: 'weight',
        value: JSON.stringify({value: 10, unit: 'kg'}),
      });
      const {container} = render(<Metafield data={metafield} as="p" />, {
        wrapper: ({children}) => (
          <ShopifyProvider shopifyConfig={getShopifyConfig()}>
            {children}
          </ShopifyProvider>
        ),
      });

      expect(container.querySelector('p')).toHaveTextContent('10 kg');
    });

    it('allows passthrough props', () => {
      render(
        <Metafield
          data={getRawMetafield({type: 'weight'})}
          className="emphasized"
          data-testId={TEST_ID}
        />
      );
      expect(screen.getByTestId(TEST_ID)).toHaveClass('emphasized');
    });
  });

  describe('with `volume` type metafield', () => {
    it('renders the volume as a string in a `span` by default', () => {
      const metafield = getRawMetafield({
        type: 'volume',
        value: JSON.stringify({value: 10, unit: 'l'}),
      });
      render(<Metafield data={metafield} />, {
        wrapper: ({children}) => (
          <ShopifyProvider shopifyConfig={getShopifyConfig()}>
            {children}
          </ShopifyProvider>
        ),
      });

      expect(screen.getByText('10 L')).toBeInTheDocument();
    });

    it('renders the volume as a string in the element specified by the `as` prop', () => {
      const metafield = getRawMetafield({
        type: 'volume',
        value: JSON.stringify({value: 10, unit: 'l'}),
      });
      const {container} = render(<Metafield data={metafield} as="p" />, {
        wrapper: ({children}) => (
          <ShopifyProvider shopifyConfig={getShopifyConfig()}>
            {children}
          </ShopifyProvider>
        ),
      });

      expect(container.querySelector('p')).toHaveTextContent('10 L');
    });

    it('allows passthrough props', () => {
      render(
        <Metafield
          data={getRawMetafield({type: 'volume'})}
          className="emphasized"
          data-testId={TEST_ID}
        />
      );
      expect(screen.getByTestId(TEST_ID)).toHaveClass('emphasized');
    });
  });

  describe('with `dimension` type metafield', () => {
    it('renders the dimension as a string in a `span` by default', () => {
      const metafield = getRawMetafield({
        type: 'dimension',
        value: JSON.stringify({value: 5, unit: 'cm'}),
      });
      render(<Metafield data={metafield} />, {
        wrapper: ({children}) => (
          <ShopifyProvider shopifyConfig={getShopifyConfig()}>
            {children}
          </ShopifyProvider>
        ),
      });

      expect(screen.getByText('5 cm')).toBeInTheDocument();
    });

    it('renders the dimension as a string in the element specified by the `as` prop', () => {
      const metafield = getRawMetafield({
        type: 'dimension',
        value: JSON.stringify({value: 5, unit: 'cm'}),
      });
      const {container} = render(<Metafield data={metafield} as="p" />, {
        wrapper: ({children}) => (
          <ShopifyProvider shopifyConfig={getShopifyConfig()}>
            {children}
          </ShopifyProvider>
        ),
      });

      expect(container.querySelector('p')).toHaveTextContent('5 cm');
    });

    it('allows passthrough props', () => {
      render(
        <Metafield
          data={getRawMetafield({type: 'dimension'})}
          className="emphasized"
          data-testId={TEST_ID}
        />
      );
      expect(screen.getByTestId(TEST_ID)).toHaveClass('emphasized');
    });
  });

  describe('with `single_line_text_field` type metafield', () => {
    it('renders the text in a `span` by default', () => {
      const metafield = getRawMetafield({
        type: 'single_line_text_field',
        value: 'hello world',
      });
      render(<Metafield data={metafield} />, {
        wrapper: ({children}) => (
          <ShopifyProvider shopifyConfig={getShopifyConfig()}>
            {children}
          </ShopifyProvider>
        ),
      });

      expect(screen.getByText(metafield.value as string)).toBeInTheDocument();
    });

    it('allows passthrough props', () => {
      const metafield = getRawMetafield({
        type: 'single_line_text_field',
      });
      render(
        <Metafield
          data={metafield}
          className="emphasized"
          as="p"
          data-testId={TEST_ID}
        />,
        {
          wrapper: ({children}) => (
            <ShopifyProvider shopifyConfig={getShopifyConfig()}>
              {children}
            </ShopifyProvider>
          ),
        }
      );
      expect(screen.getByTestId(TEST_ID)).toHaveClass('emphasized');
    });
  });

  describe('with `multi_line_text_field` type metafield', () => {
    it('renders the text in a `div` by default', () => {
      const metafield = getRawMetafield({
        type: 'multi_line_text_field',
        value: `
         <p>hello world</p>
         <p>second line</p>
        `,
      });
      render(<Metafield data={metafield} />, {
        wrapper: ({children}) => (
          <ShopifyProvider shopifyConfig={getShopifyConfig()}>
            {children}
          </ShopifyProvider>
        ),
      });

      expect(screen.getByText(metafield.value as string)).toBeInTheDocument();
    });

    it('allows passthrough props', () => {
      const metafield = getRawMetafield({
        type: 'multi_line_text_field',
      });
      render(
        <Metafield
          data={metafield}
          className="emphasized"
          as="section"
          data-testId={TEST_ID}
        />
      );
      expect(screen.getByTestId(TEST_ID)).toHaveClass('emphasized');
    });
  });

  describe('with `url` type metafield', () => {
    it('renders the url with an `a` tag', () => {
      const metafield = getRawMetafield({
        type: 'url',
        value: 'https://www.example.com',
      });
      render(<Metafield data={metafield} />, {
        wrapper: ({children}) => (
          <ShopifyProvider shopifyConfig={getShopifyConfig()}>
            {children}
          </ShopifyProvider>
        ),
      });

      expect(screen.getByRole('link')).toHaveAttribute(
        'href',
        '//www.example.com/'
      );

      expect(screen.getByRole('link')).toHaveTextContent(
        metafield.value?.toString() ?? ''
      );
    });

    it('allows passthrough props', () => {
      render(
        <Metafield
          data={getRawMetafield({type: 'url'})}
          className="emphasized"
          data-testId={TEST_ID}
        />
      );
      expect(screen.getByTestId(TEST_ID)).toHaveClass('emphasized');
    });
  });

  describe('with `json` type metafield', () => {
    it('renders the json as a string in a `span` by default', () => {
      const metafield = getRawMetafield({type: 'json'});
      render(<Metafield data={metafield} />, {
        wrapper: ({children}) => (
          <ShopifyProvider shopifyConfig={getShopifyConfig()}>
            {children}
          </ShopifyProvider>
        ),
      });

      expect(
        screen.getByText(metafield.value?.toString() ?? '')
      ).toBeInTheDocument();
    });

    it('renders the json as a string in the element specified by the `as` prop', () => {
      const metafield = getRawMetafield({type: 'json'});
      const {container} = render(<Metafield data={metafield} as="p" />, {
        wrapper: ({children}) => (
          <ShopifyProvider shopifyConfig={getShopifyConfig()}>
            {children}
          </ShopifyProvider>
        ),
      });

      expect(container.querySelector('p')).toHaveTextContent(
        metafield.value?.toString() ?? ''
      );
    });

    it('allows passthrough props', () => {
      render(
        <Metafield
          data={getRawMetafield({type: 'json'})}
          className="emphasized"
          data-testId={TEST_ID}
        />
      );
      expect(screen.getByTestId(TEST_ID)).toHaveClass('emphasized');
    });
  });

  describe('with `color` type metafield', () => {
    it('renders the color as a string in a `span` by default', () => {
      const metafield = getRawMetafield({type: 'color'});
      render(<Metafield data={metafield} />, {
        wrapper: ({children}) => (
          <ShopifyProvider shopifyConfig={getShopifyConfig()}>
            {children}
          </ShopifyProvider>
        ),
      });

      expect(
        screen.getByText(metafield.value?.toString() ?? '')
      ).toBeInTheDocument();
    });

    it('renders the color as a string in the element specified by the `as` prop', () => {
      const metafield = getRawMetafield({type: 'color'});
      const {container} = render(<Metafield data={metafield} as="p" />, {
        wrapper: ({children}) => (
          <ShopifyProvider shopifyConfig={getShopifyConfig()}>
            {children}
          </ShopifyProvider>
        ),
      });

      expect(container.querySelector('p')).toHaveTextContent(
        metafield.value?.toString() ?? ''
      );
    });

    it('allows passthrough props', () => {
      render(
        <Metafield
          data={getRawMetafield({type: 'color'})}
          className="emphasized"
          data-testId={TEST_ID}
        />
      );
      expect(screen.getByTestId(TEST_ID)).toHaveClass('emphasized');
    });
  });

  describe('with `product_reference` type metafield', () => {
    it('renders the product reference as a string in a `span` by default', () => {
      const metafield = getRawMetafield({
        type: 'product_reference',
        reference: {title: 'MyProduct'},
      });
      render(<Metafield data={metafield} />, {
        wrapper: ({children}) => (
          <ShopifyProvider shopifyConfig={getShopifyConfig()}>
            {children}
          </ShopifyProvider>
        ),
      });

      expect(
        screen.getByText((metafield?.reference as Product)?.title ?? '')
      ).toBeInTheDocument();
    });

    it('renders the product reference as a string in the element specified by the `as` prop', () => {
      const metafield = getRawMetafield({
        type: 'product_reference',
        reference: {title: 'MyProduct'},
      });
      const {container} = render(<Metafield data={metafield} as="p" />, {
        wrapper: ({children}) => (
          <ShopifyProvider shopifyConfig={getShopifyConfig()}>
            {children}
          </ShopifyProvider>
        ),
      });

      expect(container.querySelector('p')).toHaveTextContent(
        (metafield?.reference as Product)?.title ?? ''
      );
    });

    it('allows passthrough props', () => {
      render(
        <Metafield
          data={getRawMetafield({
            type: 'product_reference',
            reference: {title: 'MyProduct'},
          })}
          className="emphasized"
          data-testId={TEST_ID}
        />
      );
      expect(screen.getByTestId(TEST_ID)).toHaveClass('emphasized');
    });
  });

  describe('with `page_reference` type metafield', () => {
    it('renders the page reference as a string in a `span` by default', () => {
      const metafield = getRawMetafield({
        type: 'page_reference',
        reference: {title: 'MyPage'},
      });
      render(<Metafield data={metafield} />, {
        wrapper: ({children}) => (
          <ShopifyProvider shopifyConfig={getShopifyConfig()}>
            {children}
          </ShopifyProvider>
        ),
      });

      expect(
        screen.getByText((metafield?.reference as Page)?.title ?? '')
      ).toBeInTheDocument();
    });

    it('renders the page reference as a string in the element specified by the `as` prop', () => {
      const metafield = getRawMetafield({
        type: 'page_reference',
        reference: {title: 'MyPage'},
      });
      const {container} = render(<Metafield data={metafield} as="p" />, {
        wrapper: ({children}) => (
          <ShopifyProvider shopifyConfig={getShopifyConfig()}>
            {children}
          </ShopifyProvider>
        ),
      });

      expect(container.querySelector('p')).toHaveTextContent(
        (metafield?.reference as Page)?.title ?? ''
      );
    });

    it('allows passthrough props', () => {
      render(
        <Metafield
          data={getRawMetafield({type: 'page_reference'})}
          className="emphasized"
          data-testId={TEST_ID}
        />
      );
      expect(screen.getByTestId(TEST_ID)).toHaveClass('emphasized');
    });
  });

  describe('with `variant_reference` type metafield', () => {
    it('renders the variant reference as a string in a `span` by default', () => {
      const metafield = getRawMetafield({
        type: 'variant_reference',
        reference: {title: 'MyVariant'},
      });
      render(<Metafield data={metafield} />, {
        wrapper: ({children}) => (
          <ShopifyProvider shopifyConfig={getShopifyConfig()}>
            {children}
          </ShopifyProvider>
        ),
      });

      expect(
        screen.getByText((metafield?.reference as ProductVariant)?.title ?? '')
      ).toBeInTheDocument();
    });

    it('renders the variant reference as a string in the element specified by the `as` prop', () => {
      const metafield = getRawMetafield({
        type: 'variant_reference',
        reference: {title: 'MyVariant'},
      });
      const {container} = render(<Metafield data={metafield} as="p" />, {
        wrapper: ({children}) => (
          <ShopifyProvider shopifyConfig={getShopifyConfig()}>
            {children}
          </ShopifyProvider>
        ),
      });

      expect(container.querySelector('p')).toHaveTextContent(
        (metafield?.reference as ProductVariant)?.title ?? ''
      );
    });

    it('allows passthrough props', () => {
      render(
        <Metafield
          data={getRawMetafield({type: 'variant_reference'})}
          className="emphasized"
          data-testId={TEST_ID}
        />
      );
      expect(screen.getByTestId(TEST_ID)).toHaveClass('emphasized');
    });
  });

  describe('with `file_reference` type metafield', () => {
    describe('when the reference type is a MediaImage', () => {
      it('renders an Image component', () => {
        const metafield = getRawMetafield({
          type: 'file_reference',
          reference: {__typename: 'MediaImage', ...getMediaImage()},
        });
        render(<Metafield data={metafield} />, {
          wrapper: ({children}) => (
            <ShopifyProvider shopifyConfig={getShopifyConfig()}>
              {children}
            </ShopifyProvider>
          ),
        });

        expect(screen.getByRole('img')).toBeInTheDocument();
      });

      it('allows passthrough props', () => {
        const metafield = getRawMetafield({
          type: 'file_reference',
          reference: {__typename: 'MediaImage', ...getMediaImage()},
        });
        render(
          <Metafield
            data={metafield}
            className="emphasized"
            data-testId={TEST_ID}
          />,
          {
            wrapper: ({children}) => (
              <ShopifyProvider shopifyConfig={getShopifyConfig()}>
                {children}
              </ShopifyProvider>
            ),
          }
        );

        expect(screen.getByTestId(TEST_ID)).toHaveClass('emphasized');
      });
    });

    describe('when the reference type is not a MediaImage', () => {
      it('renders the file reference as a string in a `span` by default', () => {
        const metafield = getRawMetafield({type: 'file_reference'});
        render(<Metafield data={metafield} />, {
          wrapper: ({children}) => (
            <ShopifyProvider shopifyConfig={getShopifyConfig()}>
              {children}
            </ShopifyProvider>
          ),
        });

        expect(
          screen.getByText(metafield.value?.toString() ?? '')
        ).toBeInTheDocument();
      });

      it('renders the file reference as a string in the element specified by the `as` prop', () => {
        const metafield = getRawMetafield({type: 'file_reference'});
        const {container} = render(<Metafield data={metafield} as="p" />, {
          wrapper: ({children}) => (
            <ShopifyProvider shopifyConfig={getShopifyConfig()}>
              {children}
            </ShopifyProvider>
          ),
        });

        expect(container.querySelector('p')).toHaveTextContent(
          metafield.value?.toString() ?? ''
        );
      });

      it('allows passthrough props', () => {
        render(
          <Metafield
            data={getRawMetafield({type: 'file_reference'})}
            className="emphasized"
            data-testId={TEST_ID}
          />
        );
        expect(screen.getByTestId(TEST_ID)).toHaveClass('emphasized');
      });
    });
  });

  describe('with `boolean` type metafield', () => {
    it('renders the boolean value as a string in a `span` by default', () => {
      const metafield = getRawMetafield({type: 'boolean'});
      render(<Metafield data={metafield} />, {
        wrapper: ({children}) => (
          <ShopifyProvider shopifyConfig={getShopifyConfig()}>
            {children}
          </ShopifyProvider>
        ),
      });

      expect(
        screen.getByText((metafield.value === 'true').toString() ?? '')
      ).toBeInTheDocument();
    });

    it('renders the boolean as a string in the element specified by the `as` prop', () => {
      const metafield = getRawMetafield({type: 'boolean'});
      const {container} = render(<Metafield data={metafield} as="p" />, {
        wrapper: ({children}) => (
          <ShopifyProvider shopifyConfig={getShopifyConfig()}>
            {children}
          </ShopifyProvider>
        ),
      });

      expect(container.querySelector('p')).toHaveTextContent(
        (metafield.value === 'true').toString() ?? ''
      );
    });

    it('allows passthrough props', () => {
      render(
        <Metafield
          data={getRawMetafield({type: 'boolean'})}
          className="emphasized"
          data-testId={TEST_ID}
        />
      );
      expect(screen.getByTestId(TEST_ID)).toHaveClass('emphasized');
    });
  });

  describe('with `number_integer` type metafield', () => {
    it('renders the integer value as a string in a `span` by default', () => {
      const metafield = getRawMetafield({type: 'number_integer'});
      render(<Metafield data={metafield} />, {
        wrapper: ({children}) => (
          <ShopifyProvider shopifyConfig={getShopifyConfig()}>
            {children}
          </ShopifyProvider>
        ),
      });

      expect(
        screen.getByText(Number(metafield.value).toString() ?? '')
      ).toBeInTheDocument();
    });

    it('renders the boolean as a string in the element specified by the `as` prop', () => {
      const metafield = getRawMetafield({type: 'number_integer'});
      const {container} = render(<Metafield data={metafield} as="p" />, {
        wrapper: ({children}) => (
          <ShopifyProvider shopifyConfig={getShopifyConfig()}>
            {children}
          </ShopifyProvider>
        ),
      });

      expect(container.querySelector('p')).toHaveTextContent(
        Number(metafield.value).toString() ?? ''
      );
    });

    it('allows passthrough props', () => {
      render(
        <Metafield
          data={getRawMetafield({type: 'number_integer'})}
          className="emphasized"
          data-testId={TEST_ID}
        />
      );
      expect(screen.getByTestId(TEST_ID)).toHaveClass('emphasized');
    });
  });

  describe('with `number_decimal` type metafield', () => {
    it('renders the number as a string in a `span` by default', () => {
      const metafield = getRawMetafield({type: 'number_decimal'});
      render(<Metafield data={metafield} />, {
        wrapper: ({children}) => (
          <ShopifyProvider shopifyConfig={getShopifyConfig()}>
            {children}
          </ShopifyProvider>
        ),
      });

      expect(
        screen.getByText(Number(metafield.value).toString() ?? '')
      ).toBeInTheDocument();
    });

    it('renders the number as a string in the element specified by the `as` prop', () => {
      const metafield = getRawMetafield({type: 'number_decimal'});
      const {container} = render(<Metafield data={metafield} as="p" />, {
        wrapper: ({children}) => (
          <ShopifyProvider shopifyConfig={getShopifyConfig()}>
            {children}
          </ShopifyProvider>
        ),
      });

      expect(container.querySelector('p')).toHaveTextContent(
        metafield?.value?.toString() ?? ''
      );
    });

    it('allows passthrough props', () => {
      render(
        <Metafield
          data={getRawMetafield({type: 'number_decimal'})}
          className="emphasized"
          data-testId={TEST_ID}
        />
      );
      expect(screen.getByTestId(TEST_ID)).toHaveClass('emphasized');
    });
  });

  describe('with `rating` type metafield', () => {
    it(`renders a 'span' with the rating inside`, () => {
      const metafield = getRawMetafield({type: 'rating'});
      render(<Metafield data={metafield} />, {
        wrapper: ({children}) => (
          <ShopifyProvider shopifyConfig={getShopifyConfig()}>
            {children}
          </ShopifyProvider>
        ),
      });

      expect(
        screen.getByText(
          (JSON.parse(metafield?.value ?? '') as Rating)?.value ?? ''
        )
      ).toBeInTheDocument();
    });

    it('allows passthrough props', () => {
      render(
        <Metafield
          data={getRawMetafield({type: 'rating'})}
          className="emphasized"
          data-testId={TEST_ID}
        />
      );
      expect(screen.getByTestId(TEST_ID)).toHaveClass('emphasized');
    });
  });
});

describe(`parseMetafieldValue()`, () => {
  describe(`handles the different types`, () => {
    it(`boolean`, () => {
      const metafield = getRawMetafield({type: 'boolean', value: 'true'});
      expect(parseMetafieldValue(metafield)).toBe(true);
    });

    it(`number_integer`, () => {
      const metafield = getRawMetafield({type: 'number_integer', value: '7'});
      expect(parseMetafieldValue(metafield)).toBe(7);
    });

    it(`number_decimal`, () => {
      const metafield = getRawMetafield({
        type: 'number_decimal',
        value: '7.77',
      });
      expect(parseMetafieldValue(metafield)).toBe(7.77);
    });

    it(`date`, () => {
      const metafield = getRawMetafield({type: 'date', value: '2022-02-02'});
      expect(parseMetafieldValue(metafield)).toEqual(new Date('2022-02-02'));
    });

    it(`date_time`, () => {
      const metafield = getRawMetafield({
        type: 'date',
        value: '2022-01-01T12:30:00',
      });
      expect(parseMetafieldValue(metafield)).toEqual(
        new Date('2022-01-01T12:30:00')
      );
    });

    it(`json`, () => {
      const metafield = getRawMetafield({
        type: 'json',
        value: JSON.stringify({hey: 'hi'}),
      });
      expect(parseMetafieldValue(metafield)).toEqual({hey: 'hi'});
    });

    it(`weight`, () => {
      const metafield = getRawMetafield({
        type: 'json',
        value: JSON.stringify({
          value: 2.5,
          unit: 'kg',
        }),
      });
      expect(parseMetafieldValue(metafield)).toEqual({
        value: 2.5,
        unit: 'kg',
      });
    });

    it(`dimension`, () => {
      const metafield = getRawMetafield({
        type: 'json',
        value: JSON.stringify({
          value: 25.0,
          unit: 'cm',
        }),
      });
      expect(parseMetafieldValue(metafield)).toEqual({
        value: 25.0,
        unit: 'cm',
      });
    });

    it(`volume`, () => {
      const metafield = getRawMetafield({
        type: 'json',
        value: JSON.stringify({
          value: 20.0,
          unit: 'ml',
        }),
      });
      expect(parseMetafieldValue(metafield)).toEqual({
        value: 20.0,
        unit: 'ml',
      });
    });

    it(`rating`, () => {
      const metafield = getRawMetafield({
        type: 'json',
        value: JSON.stringify({
          value: '3.5',
          scale_min: '1.0',
          scale_max: '5.0',
        }),
      });
      expect(parseMetafieldValue(metafield)).toEqual({
        value: '3.5',
        scale_min: '1.0',
        scale_max: '5.0',
      });
    });

    it(`default`, () => {
      const metafield = getRawMetafield({
        type: 'url',
        value: 'test',
      });

      expect(parseMetafieldValue(metafield)).toBe('test');
    });
  });

  it(`handles if null is passed`, () => {
    expect(parseMetafieldValue(null)).toBeNull();
  });
});

export type MetafieldType =
  | 'single_line_text_field'
  | 'multi_line_text_field'
  | 'page_reference'
  | 'product_reference'
  | 'variant_reference'
  | 'file_reference'
  | 'number_integer'
  | 'number_decimal'
  | 'date'
  | 'date_time'
  | 'url'
  | 'json'
  | 'boolean'
  | 'color'
  | 'weight'
  | 'volume'
  | 'dimension'
  | 'rating';

export const METAFIELDS: MetafieldType[] = [
  'single_line_text_field',
  'multi_line_text_field',
  'page_reference',
  'product_reference',
  'variant_reference',
  'file_reference',
  'number_integer',
  'number_decimal',
  'date',
  'date_time',
  'url',
  'json',
  'boolean',
  'color',
  'weight',
  'volume',
  'dimension',
  'rating',
];

export function getRawMetafield(
  metafield: PartialDeep<SFAPIMetafieldType> & {
    type?: MetafieldType;
  } = {}
): PartialDeep<SFAPIMetafieldType> {
  const type: MetafieldType =
    metafield.type == null
      ? faker.helpers.arrayElement(METAFIELDS)
      : metafield.type;

  return {
    __typename: 'Metafield',
    createdAt: metafield.createdAt ?? faker.date.recent().toString(),
    description: metafield.description ?? faker.random.words(),
    id: metafield.id ?? faker.random.words(),
    key: metafield.key ?? `${faker.random.word()}.${faker.random.word()}`,
    namespace: metafield.namespace ?? faker.random.word(),
    type,
    updatedAt: metafield.updatedAt ?? faker.date.recent().toString(),
    value: metafield.value ?? getMetafieldValue(type),
    reference: metafield.reference,
  };
}

export function getMetafieldValue(type: MetafieldType) {
  switch (type) {
    case 'single_line_text_field':
      return faker.random.words();
    case 'multi_line_text_field':
      return `${faker.random.words()}\n${faker.random.words()}\n${faker.random.words()}`;
    case 'page_reference':
    case 'product_reference':
    case 'variant_reference':
    case 'file_reference':
      return faker.random.words();
    case 'number_integer':
      return faker.datatype.number().toString();
    case 'number_decimal':
      return faker.datatype.float().toString();
    case 'date':
    case 'date_time':
      return faker.datatype.datetime().toString();
    case 'url':
      return faker.internet.url();
    case 'json':
      return JSON.stringify(faker.datatype.json());
    case 'boolean':
      return faker.datatype.boolean().toString();
    case 'color':
      return faker.internet.color();
    case 'weight':
      return JSON.stringify({
        value: faker.datatype.number(),
        unit: faker.helpers.arrayElement(['kg', 'g', 'lb', 'oz']),
      });
    case 'volume':
      return JSON.stringify({
        value: faker.datatype.number(),
        unit: faker.helpers.arrayElement([
          'ml',
          'l',
          'us_gal',
          'us_oz',
          'cl',
          'm3',
          'us_pt',
          'us_qt',
          'imp_pt',
          'imp_fl_oz',
          'imp_qt',
          'imp_gal',
        ]),
      });
    case 'dimension':
      return JSON.stringify({
        value: faker.datatype.number(),
        unit: faker.helpers.arrayElement(['mm', 'cm', 'm', 'in', 'ft', 'yd']),
      });
    case 'rating': {
      const max = faker.datatype.number({min: 5, max: 10});
      const min = faker.datatype.number({min: 1, max: 4});
      return JSON.stringify({
        scale_max: max,
        scale_min: min,
        value: faker.datatype.float({min, max, precision: 0.0001}),
      });
    }
    default:
      return JSON.stringify(faker.datatype.json());
  }
}

export function getMediaImage(
  image: PartialDeep<MediaImage> = {}
): PartialDeep<MediaImage> {
  return {
    id: image.id ?? faker.random.words(),
    mediaContentType: 'IMAGE',
    image: getPreviewImage(image.previewImage ?? undefined),
  };
}
