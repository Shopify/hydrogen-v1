import React from 'react';
import {Metafield} from '../Metafield.client.js';
import {getRawMetafield} from '../../../utilities/tests/metafields.js';
import {mountWithProviders} from '../../../utilities/tests/shopifyMount.js';
import {Image} from '../../Image/index.js';
import {getMediaImage} from '../../../utilities/tests/media.js';
import type {Rating} from '../../../types.js';
import {Link} from '../../Link/Link.client.js';
import {Page, Product, ProductVariant} from '../../../storefront-api-types.js';

describe('<Metafield />', () => {
  it('renders nothing when the metafield is null', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn');
    consoleWarnSpy.mockImplementation(() => {});
    const component = mountWithProviders(<Metafield data={null} />);
    expect(component.html()).toBeFalsy();
    expect(consoleWarnSpy).toHaveBeenCalled();
    consoleWarnSpy.mockRestore();
  });

  it('renders nothing when the metafield value is undefined', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn');
    consoleWarnSpy.mockImplementation(() => {});
    const component = mountWithProviders(
      <Metafield data={{type: 'color', value: undefined}} />
    );
    expect(component.html()).toBeFalsy();
    expect(consoleWarnSpy).toHaveBeenCalled();
    consoleWarnSpy.mockRestore();
  });

  it('logs a warning to the console when the metafield value is null', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn');
    consoleWarnSpy.mockImplementation(() => {});
    const metafield = {type: 'color', value: undefined};
    mountWithProviders(<Metafield data={metafield} />);

    expect(consoleWarnSpy).toHaveBeenCalled();
    consoleWarnSpy.mockRestore();
  });

  it(`validates props when a component is passed to the 'as' prop`, () => {
    const component = mountWithProviders(
      <Metafield
        data={getRawMetafield({type: 'number_integer'})}
        as={Link}
        to="/test"
      />
    );
    expect(component).toContainReactComponent(Link, {
      to: '/test',
    });
  });

  describe('with `date` type metafield', () => {
    it('renders the localized date as a string in a `time` by default', () => {
      const metafield = getRawMetafield({type: 'date'});
      const component = mountWithProviders(<Metafield data={metafield} />, {
        shopifyConfig: {
          defaultLanguageCode: 'en',
          defaultCountryCode: 'us',
        },
      });

      expect(component).toContainReactComponent('time', {
        children: new Date(metafield?.value ?? '').toLocaleDateString(),
      });
    });

    it('renders the date as a string in the element specified by the `as` prop', () => {
      const metafield = getRawMetafield({type: 'date'});
      const component = mountWithProviders(
        <Metafield data={metafield} as="p" />,
        {
          shopifyConfig: {
            defaultLanguageCode: 'en',
            defaultCountryCode: 'us',
          },
        }
      );

      expect(component).toContainReactComponent('p', {
        children: new Date(metafield?.value ?? '').toLocaleDateString(),
      });
    });

    it('allows passthrough props', () => {
      const component = mountWithProviders(
        <Metafield
          data={getRawMetafield({type: 'date'})}
          className="emphasized"
        />
      );
      expect(component).toContainReactComponent('time', {
        className: 'emphasized',
      });
    });
  });

  describe('with `date_time` type metafield', () => {
    it('renders the date as a string in a `time` by default', () => {
      const metafield = getRawMetafield({type: 'date_time'});
      const component = mountWithProviders(<Metafield data={metafield} />, {
        shopifyConfig: {
          defaultLanguageCode: 'en',
          defaultCountryCode: 'us',
        },
      });

      expect(component).toContainReactComponent('time', {
        children: new Date(metafield?.value ?? '').toLocaleString(),
      });
    });

    it('renders the date as a string in the element specified by the `as` prop', () => {
      const metafield = getRawMetafield({type: 'date_time'});
      const component = mountWithProviders(
        <Metafield data={metafield} as="p" />,
        {
          shopifyConfig: {
            defaultLanguageCode: 'en',
            defaultCountryCode: 'us',
          },
        }
      );

      expect(component).toContainReactComponent('p', {
        children: new Date(metafield?.value ?? '').toLocaleString(),
      });
    });

    it('allows passthrough props', () => {
      const component = mountWithProviders(
        <Metafield
          data={getRawMetafield({type: 'date_time'})}
          className="emphasized"
        />
      );
      expect(component).toContainReactComponent('time', {
        className: 'emphasized',
      });
    });
  });

  describe('with `weight` type metafield', () => {
    it('renders the weight as a string in a `span` by default', () => {
      const metafield = getRawMetafield({
        type: 'weight',
        value: JSON.stringify({value: 10, unit: 'kg'}),
      });
      const component = mountWithProviders(<Metafield data={metafield} />, {
        shopifyConfig: {
          defaultLanguageCode: 'en',
          defaultCountryCode: 'us',
        },
      });

      expect(component).toContainReactComponent('span', {
        children: '10 kg',
      });
    });

    it('renders the weight as a string in the element specified by the `as` prop', () => {
      const metafield = getRawMetafield({
        type: 'weight',
        value: JSON.stringify({value: 10, unit: 'kg'}),
      });
      const component = mountWithProviders(
        <Metafield data={metafield} as="p" />,
        {
          shopifyConfig: {
            defaultLanguageCode: 'en',
            defaultCountryCode: 'us',
          },
        }
      );

      expect(component).toContainReactComponent('p', {
        children: '10 kg',
      });
    });

    it('allows passthrough props', () => {
      const component = mountWithProviders(
        <Metafield
          data={getRawMetafield({type: 'weight'})}
          className="emphasized"
        />
      );
      expect(component).toContainReactComponent('span', {
        className: 'emphasized',
      });
    });
  });

  describe('with `volume` type metafield', () => {
    it('renders the volume as a string in a `span` by default', () => {
      const metafield = getRawMetafield({
        type: 'volume',
        value: JSON.stringify({value: 10, unit: 'l'}),
      });
      const component = mountWithProviders(<Metafield data={metafield} />, {
        shopifyConfig: {
          defaultLanguageCode: 'en',
          defaultCountryCode: 'us',
        },
      });

      expect(component).toContainReactComponent('span', {
        children: '10 L',
      });
    });

    it('renders the volume as a string in the element specified by the `as` prop', () => {
      const metafield = getRawMetafield({
        type: 'volume',
        value: JSON.stringify({value: 10, unit: 'l'}),
      });
      const component = mountWithProviders(
        <Metafield data={metafield} as="p" />,
        {
          shopifyConfig: {
            defaultLanguageCode: 'en',
            defaultCountryCode: 'us',
          },
        }
      );

      expect(component).toContainReactComponent('p', {
        children: '10 L',
      });
    });

    it('allows passthrough props', () => {
      const component = mountWithProviders(
        <Metafield
          data={getRawMetafield({type: 'volume'})}
          className="emphasized"
        />
      );
      expect(component).toContainReactComponent('span', {
        className: 'emphasized',
      });
    });
  });

  describe('with `dimension` type metafield', () => {
    it('renders the dimension as a string in a `span` by default', () => {
      const metafield = getRawMetafield({
        type: 'dimension',
        value: JSON.stringify({value: 5, unit: 'cm'}),
      });
      const component = mountWithProviders(<Metafield data={metafield} />, {
        shopifyConfig: {
          defaultLanguageCode: 'en',
          defaultCountryCode: 'us',
        },
      });

      expect(component).toContainReactComponent('span', {
        children: '5 cm',
      });
    });

    it('renders the dimension as a string in the element specified by the `as` prop', () => {
      const metafield = getRawMetafield({
        type: 'dimension',
        value: JSON.stringify({value: 5, unit: 'cm'}),
      });
      const component = mountWithProviders(
        <Metafield data={metafield} as="p" />,
        {
          shopifyConfig: {
            defaultLanguageCode: 'en',
            defaultCountryCode: 'us',
          },
        }
      );

      expect(component).toContainReactComponent('p', {
        children: '5 cm',
      });
    });

    it('allows passthrough props', () => {
      const component = mountWithProviders(
        <Metafield
          data={getRawMetafield({type: 'dimension'})}
          className="emphasized"
        />
      );
      expect(component).toContainReactComponent('span', {
        className: 'emphasized',
      });
    });
  });

  describe('with `single_line_text_field` type metafield', () => {
    it('renders the text in a `span` by default', () => {
      const metafield = getRawMetafield({
        type: 'single_line_text_field',
        value: 'hello world',
      });
      const component = mountWithProviders(<Metafield data={metafield} />, {
        shopifyConfig: {
          defaultLanguageCode: 'en',
          defaultCountryCode: 'us',
        },
      });

      expect(component).toContainReactComponent('span', {
        dangerouslySetInnerHTML: {
          __html: metafield.value as string,
        },
      });
    });

    it('allows passthrough props', () => {
      const metafield = getRawMetafield({
        type: 'single_line_text_field',
      });
      const component = mountWithProviders(
        <Metafield data={metafield} className="emphasized" as="p" />
      );
      expect(component).toContainReactComponent('p', {
        className: 'emphasized',
        dangerouslySetInnerHTML: {
          __html: metafield.value as string,
        },
      });
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
      const component = mountWithProviders(<Metafield data={metafield} />, {
        shopifyConfig: {
          defaultLanguageCode: 'en',
          defaultCountryCode: 'us',
        },
      });

      expect(component).toContainReactComponent('div', {
        dangerouslySetInnerHTML: {
          __html: (metafield.value as string).split('\n').join('<br/>'),
        },
      });
    });

    it('allows passthrough props', () => {
      const metafield = getRawMetafield({
        type: 'multi_line_text_field',
      });
      const component = mountWithProviders(
        <Metafield data={metafield} className="emphasized" as="section" />
      );
      expect(component).toContainReactComponent('section', {
        className: 'emphasized',
        dangerouslySetInnerHTML: {
          __html: (metafield.value as string).split('\n').join('<br/>'),
        },
      });
    });
  });

  describe('with `url` type metafield', () => {
    it('renders the url with an `a` tag', () => {
      const metafield = getRawMetafield({
        type: 'url',
        value: 'https://www.example.com',
      });
      const component = mountWithProviders(<Metafield data={metafield} />);

      expect(component).toContainReactComponent('a', {
        children: metafield.value?.toString(),
        href: '//www.example.com/',
      });
    });

    it('allows passthrough props', () => {
      const component = mountWithProviders(
        <Metafield
          data={getRawMetafield({type: 'url'})}
          className="emphasized"
        />
      );
      expect(component).toContainReactComponent('a', {
        className: 'emphasized',
      });
    });
  });

  describe('with `json` type metafield', () => {
    it('renders the json as a string in a `span` by default', () => {
      const metafield = getRawMetafield({type: 'json'});
      const component = mountWithProviders(<Metafield data={metafield} />);

      expect(component).toContainReactComponent('span', {
        children: metafield.value?.toString(),
      });
    });

    it('renders the json as a string in the element specified by the `as` prop', () => {
      const metafield = getRawMetafield({type: 'json'});
      const component = mountWithProviders(
        <Metafield data={metafield} as="p" />
      );

      expect(component).toContainReactComponent('p', {
        children: metafield.value?.toString(),
      });
    });

    it('allows passthrough props', () => {
      const component = mountWithProviders(
        <Metafield
          data={getRawMetafield({type: 'json'})}
          className="emphasized"
        />
      );
      expect(component).toContainReactComponent('span', {
        className: 'emphasized',
      });
    });
  });

  describe('with `color` type metafield', () => {
    it('renders the color as a string in a `span` by default', () => {
      const metafield = getRawMetafield({type: 'color'});
      const component = mountWithProviders(<Metafield data={metafield} />);

      expect(component).toContainReactComponent('span', {
        children: metafield.value?.toString(),
      });
    });

    it('renders the color as a string in the element specified by the `as` prop', () => {
      const metafield = getRawMetafield({type: 'color'});
      const component = mountWithProviders(
        <Metafield data={metafield} as="p" />
      );

      expect(component).toContainReactComponent('p', {
        children: metafield.value?.toString(),
      });
    });

    it('allows passthrough props', () => {
      const component = mountWithProviders(
        <Metafield
          data={getRawMetafield({type: 'color'})}
          className="emphasized"
        />
      );
      expect(component).toContainReactComponent('span', {
        className: 'emphasized',
      });
    });
  });

  describe('with `product_reference` type metafield', () => {
    it('renders the product reference as a string in a `span` by default', () => {
      const metafield = getRawMetafield({
        type: 'product_reference',
        reference: {title: 'MyProduct'},
      });
      const component = mountWithProviders(<Metafield data={metafield} />);

      expect(component).toContainReactComponent('span', {
        children: (metafield?.reference as Product)?.title,
      });
    });

    it('renders the product reference as a string in the element specified by the `as` prop', () => {
      const metafield = getRawMetafield({
        type: 'product_reference',
        reference: {title: 'MyProduct'},
      });
      const component = mountWithProviders(
        <Metafield data={metafield} as="p" />
      );

      expect(component).toContainReactComponent('p', {
        children: (metafield?.reference as Product)?.title,
      });
    });

    it('allows passthrough props', () => {
      const component = mountWithProviders(
        <Metafield
          data={getRawMetafield({
            type: 'product_reference',
            reference: {title: 'MyProduct'},
          })}
          className="emphasized"
        />
      );
      expect(component).toContainReactComponent('span', {
        className: 'emphasized',
      });
    });
  });

  describe('with `page_reference` type metafield', () => {
    it('renders the page reference as a string in a `span` by default', () => {
      const metafield = getRawMetafield({
        type: 'page_reference',
        reference: {title: 'MyPage'},
      });
      const component = mountWithProviders(<Metafield data={metafield} />);

      expect(component).toContainReactComponent('span', {
        children: (metafield?.reference as Page)?.title,
      });
    });

    it('renders the page reference as a string in the element specified by the `as` prop', () => {
      const metafield = getRawMetafield({
        type: 'page_reference',
        reference: {title: 'MyPage'},
      });
      const component = mountWithProviders(
        <Metafield data={metafield} as="p" />
      );

      expect(component).toContainReactComponent('p', {
        children: (metafield?.reference as Page)?.title,
      });
    });

    it('allows passthrough props', () => {
      const component = mountWithProviders(
        <Metafield
          data={getRawMetafield({type: 'page_reference'})}
          className="emphasized"
        />
      );
      expect(component).toContainReactComponent('span', {
        className: 'emphasized',
      });
    });
  });

  describe('with `variant_reference` type metafield', () => {
    it('renders the variant reference as a string in a `span` by default', () => {
      const metafield = getRawMetafield({
        type: 'variant_reference',
        reference: {title: 'MyVariant'},
      });
      const component = mountWithProviders(<Metafield data={metafield} />);

      expect(component).toContainReactComponent('span', {
        children: (metafield?.reference as ProductVariant)?.title,
      });
    });

    it('renders the variant reference as a string in the element specified by the `as` prop', () => {
      const metafield = getRawMetafield({
        type: 'variant_reference',
        reference: {title: 'MyVariant'},
      });
      const component = mountWithProviders(
        <Metafield data={metafield} as="p" />
      );

      expect(component).toContainReactComponent('p', {
        children: (metafield?.reference as ProductVariant)?.title,
      });
    });

    it('allows passthrough props', () => {
      const component = mountWithProviders(
        <Metafield
          data={getRawMetafield({type: 'variant_reference'})}
          className="emphasized"
        />
      );
      expect(component).toContainReactComponent('span', {
        className: 'emphasized',
      });
    });
  });

  describe('with `file_reference` type metafield', () => {
    describe('when the reference type is a MediaImage', () => {
      it('renders an Image component', () => {
        const metafield = getRawMetafield({
          type: 'file_reference',
          reference: {__typename: 'MediaImage', ...getMediaImage()},
        });
        const component = mountWithProviders(<Metafield data={metafield} />);

        expect(component).toContainReactComponent(Image);
      });

      it('allows passthrough props', () => {
        const metafield = getRawMetafield({
          type: 'file_reference',
          reference: {__typename: 'MediaImage', ...getMediaImage()},
        });
        const component = mountWithProviders(
          <Metafield data={metafield} className="rounded-md" />
        );

        expect(component).toContainReactComponent(Image, {
          className: 'rounded-md',
        });
      });
    });

    describe('when the reference type is not a MediaImage', () => {
      it('renders the file reference as a string in a `span` by default', () => {
        const metafield = getRawMetafield({type: 'file_reference'});
        const component = mountWithProviders(<Metafield data={metafield} />);

        expect(component).toContainReactComponent('span', {
          children: metafield.value?.toString(),
        });
      });

      it('renders the file reference as a string in the element specified by the `as` prop', () => {
        const metafield = getRawMetafield({type: 'file_reference'});
        const component = mountWithProviders(
          <Metafield data={metafield} as="p" />
        );

        expect(component).toContainReactComponent('p', {
          children: metafield.value?.toString(),
        });
      });

      it('allows passthrough props', () => {
        const component = mountWithProviders(
          <Metafield
            data={getRawMetafield({type: 'file_reference'})}
            className="emphasized"
          />
        );
        expect(component).toContainReactComponent('span', {
          className: 'emphasized',
        });
      });
    });
  });

  describe('with `boolean` type metafield', () => {
    it('renders the boolean value as a string in a `span` by default', () => {
      const metafield = getRawMetafield({type: 'boolean'});
      const component = mountWithProviders(<Metafield data={metafield} />);

      expect(component).toContainReactComponent('span', {
        children: (metafield.value === 'true').toString(),
      });
    });

    it('renders the boolean as a string in the element specified by the `as` prop', () => {
      const metafield = getRawMetafield({type: 'boolean'});
      const component = mountWithProviders(
        <Metafield data={metafield} as="p" />
      );

      expect(component).toContainReactComponent('p', {
        children: (metafield.value === 'true').toString(),
      });
    });

    it('allows passthrough props', () => {
      const component = mountWithProviders(
        <Metafield
          data={getRawMetafield({type: 'boolean'})}
          className="emphasized"
        />
      );
      expect(component).toContainReactComponent('span', {
        className: 'emphasized',
      });
    });
  });

  describe('with `number_integer` type metafield', () => {
    it('renders the integer value as a string in a `span` by default', () => {
      const metafield = getRawMetafield({type: 'number_integer'});
      const component = mountWithProviders(<Metafield data={metafield} />);

      expect(component).toContainReactComponent('span', {
        children: Number(metafield.value).toString(),
      });
    });

    it('renders the boolean as a string in the element specified by the `as` prop', () => {
      const metafield = getRawMetafield({type: 'number_integer'});
      const component = mountWithProviders(
        <Metafield data={metafield} as="p" />
      );

      expect(component).toContainReactComponent('p', {
        children: Number(metafield.value).toString(),
      });
    });

    it('allows passthrough props', () => {
      const component = mountWithProviders(
        <Metafield
          data={getRawMetafield({type: 'number_integer'})}
          className="emphasized"
        />
      );
      expect(component).toContainReactComponent('span', {
        className: 'emphasized',
      });
    });
  });

  describe('with `number_decimal` type metafield', () => {
    it('renders the number as a string in a `span` by default', () => {
      const metafield = getRawMetafield({type: 'number_decimal'});
      const component = mountWithProviders(<Metafield data={metafield} />);

      expect(component).toContainReactComponent('span', {
        children: Number(metafield.value).toString(),
      });
    });

    it('renders the number as a string in the element specified by the `as` prop', () => {
      const metafield = getRawMetafield({type: 'number_decimal'});
      const component = mountWithProviders(
        <Metafield data={metafield} as="p" />
      );

      expect(component).toContainReactComponent('p', {
        children: metafield?.value?.toString(),
      });
    });

    it('allows passthrough props', () => {
      const component = mountWithProviders(
        <Metafield
          data={getRawMetafield({type: 'number_decimal'})}
          className="emphasized"
        />
      );
      expect(component).toContainReactComponent('span', {
        className: 'emphasized',
      });
    });
  });

  describe('with `rating` type metafield', () => {
    it(`renders a 'span' with the rating inside`, () => {
      const metafield = getRawMetafield({type: 'rating'});
      const component = mountWithProviders(<Metafield data={metafield} />);

      expect(component).toContainReactComponent('span', {
        children: (JSON.parse(metafield?.value ?? '') as Rating)?.value,
      });
    });

    it('allows passthrough props', () => {
      const component = mountWithProviders(
        <Metafield
          data={getRawMetafield({type: 'rating'})}
          className="emphasized"
        />
      );
      expect(component).toContainReactComponent('span', {
        className: 'emphasized',
      });
    });
  });
});
