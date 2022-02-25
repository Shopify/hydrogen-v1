import React from 'react';
import {Metafield} from '../Metafield.client';
import {getParsedMetafield} from '../../../utilities/tests/metafields';
import {mountWithProviders} from '../../../utilities/tests/shopifyMount';
import {RawHtml} from '../../RawHtml';
import {Image} from '../../Image';
import {getMediaImage} from '../../../utilities/tests/media';
import type {Rating} from '../../../types';
import {Link} from '../../Link/index';

describe('<Metafield />', () => {
  it('renders nothing when the metafield value is undefined', () => {
    console.warn = jest.fn();

    const component = mountWithProviders(
      <Metafield data={{type: 'color', value: undefined}} />
    );
    expect(component.html()).toBeFalsy();
  });

  it('logs a warning to the console when the metafield value is null', () => {
    console.warn = jest.fn();

    const metafield = {type: 'color', value: undefined};
    mountWithProviders(<Metafield data={metafield} />);

    expect(console.warn).toHaveBeenCalledWith(
      `No metafield value for ${metafield}`
    );
  });

  it(`validates props when a component is passed to the 'as' prop`, () => {
    const component = mountWithProviders(
      <Metafield
        data={getParsedMetafield({type: 'number_integer'})}
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
      const metafield = getParsedMetafield({type: 'date'});
      const component = mountWithProviders(<Metafield data={metafield} />, {
        shopifyConfig: {
          defaultLocale: 'en-us',
        },
      });

      expect(component).toContainReactComponent('time', {
        children: (metafield.value as Date).toLocaleDateString(),
      });
    });

    it('renders the date as a string in the element specified by the `as` prop', () => {
      const metafield = getParsedMetafield({type: 'date'});
      const component = mountWithProviders(
        <Metafield data={metafield} as="p" />,
        {
          shopifyConfig: {
            defaultLocale: 'en-us',
          },
        }
      );

      expect(component).toContainReactComponent('p', {
        children: (metafield.value as Date).toLocaleDateString(),
      });
    });

    it('allows passthrough props', () => {
      const component = mountWithProviders(
        <Metafield
          data={getParsedMetafield({type: 'date'})}
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
      const metafield = getParsedMetafield({type: 'date_time'});
      const component = mountWithProviders(<Metafield data={metafield} />, {
        shopifyConfig: {
          defaultLocale: 'en-us',
        },
      });

      expect(component).toContainReactComponent('time', {
        children: (metafield.value as Date).toLocaleString(),
      });
    });

    it('renders the date as a string in the element specified by the `as` prop', () => {
      const metafield = getParsedMetafield({type: 'date_time'});
      const component = mountWithProviders(
        <Metafield data={metafield} as="p" />,
        {
          shopifyConfig: {
            defaultLocale: 'en-us',
          },
        }
      );

      expect(component).toContainReactComponent('p', {
        children: (metafield.value as Date).toLocaleString(),
      });
    });

    it('allows passthrough props', () => {
      const component = mountWithProviders(
        <Metafield
          data={getParsedMetafield({type: 'date_time'})}
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
      const metafield = getParsedMetafield({
        type: 'weight',
        value: JSON.stringify({value: 10, unit: 'kg'}),
      });
      const component = mountWithProviders(<Metafield data={metafield} />, {
        shopifyConfig: {
          defaultLocale: 'en-us',
        },
      });

      expect(component).toContainReactComponent('span', {
        children: '10 kg',
      });
    });

    it('renders the weight as a string in the element specified by the `as` prop', () => {
      const metafield = getParsedMetafield({
        type: 'weight',
        value: JSON.stringify({value: 10, unit: 'kg'}),
      });
      const component = mountWithProviders(
        <Metafield data={metafield} as="p" />,
        {
          shopifyConfig: {
            defaultLocale: 'en-us',
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
          data={getParsedMetafield({type: 'weight'})}
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
      const metafield = getParsedMetafield({
        type: 'volume',
        value: JSON.stringify({value: 10, unit: 'l'}),
      });
      const component = mountWithProviders(<Metafield data={metafield} />, {
        shopifyConfig: {
          defaultLocale: 'en-us',
        },
      });

      expect(component).toContainReactComponent('span', {
        children: '10 L',
      });
    });

    it('renders the volume as a string in the element specified by the `as` prop', () => {
      const metafield = getParsedMetafield({
        type: 'volume',
        value: JSON.stringify({value: 10, unit: 'l'}),
      });
      const component = mountWithProviders(
        <Metafield data={metafield} as="p" />,
        {
          shopifyConfig: {
            defaultLocale: 'en-us',
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
          data={getParsedMetafield({type: 'volume'})}
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
      const metafield = getParsedMetafield({
        type: 'dimension',
        value: JSON.stringify({value: 5, unit: 'cm'}),
      });
      const component = mountWithProviders(<Metafield data={metafield} />, {
        shopifyConfig: {
          defaultLocale: 'en-us',
        },
      });

      expect(component).toContainReactComponent('span', {
        children: '5 cm',
      });
    });

    it('renders the dimension as a string in the element specified by the `as` prop', () => {
      const metafield = getParsedMetafield({
        type: 'dimension',
        value: JSON.stringify({value: 5, unit: 'cm'}),
      });
      const component = mountWithProviders(
        <Metafield data={metafield} as="p" />,
        {
          shopifyConfig: {
            defaultLocale: 'en-us',
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
          data={getParsedMetafield({type: 'dimension'})}
          className="emphasized"
        />
      );
      expect(component).toContainReactComponent('span', {
        className: 'emphasized',
      });
    });
  });

  describe('with `single_line_text_field` type metafield', () => {
    it('renders the text in a `RawHtml` by default', () => {
      const metafield = getParsedMetafield({
        type: 'single_line_text_field',
        value: 'hello world',
      });
      const component = mountWithProviders(<Metafield data={metafield} />, {
        shopifyConfig: {
          defaultLocale: 'en-us',
        },
      });

      expect(component).toContainReactComponent(RawHtml, {
        string: metafield.value,
      });
    });

    it('allows passthrough props', () => {
      const component = mountWithProviders(
        <Metafield
          data={getParsedMetafield({type: 'single_line_text_field'})}
          className="emphasized"
          as="p"
        />
      );
      expect(component).toContainReactComponent(RawHtml, {
        className: 'emphasized',
        as: 'p',
      });
    });
  });

  describe('with `multi_line_text_field` type metafield', () => {
    it.todo('renders the text in a `RawHtml` by default');

    it('allows passthrough props', () => {
      const component = mountWithProviders(
        <Metafield
          data={getParsedMetafield({type: 'multi_line_text_field'})}
          className="emphasized"
          as="p"
        />
      );
      expect(component).toContainReactComponent(RawHtml, {
        className: 'emphasized',
        as: 'p',
      });
    });
  });

  describe('with `url` type metafield', () => {
    it('renders the url with an `a` tag', () => {
      const metafield = getParsedMetafield({
        type: 'url',
        value: 'https://www.example.com',
      });
      const component = mountWithProviders(<Metafield data={metafield} />);

      expect(component).toContainReactComponent('a', {
        children: metafield.value,
        href: metafield.value as string,
      });
    });

    it('allows passthrough props', () => {
      const component = mountWithProviders(
        <Metafield
          data={getParsedMetafield({type: 'url'})}
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
      const metafield = getParsedMetafield({type: 'json'});
      const component = mountWithProviders(<Metafield data={metafield} />);

      expect(component).toContainReactComponent('span', {
        children: JSON.stringify(metafield.value),
      });
    });

    it('renders the json as a string in the element specified by the `as` prop', () => {
      const metafield = getParsedMetafield({type: 'json'});
      const component = mountWithProviders(
        <Metafield data={metafield} as="p" />
      );

      expect(component).toContainReactComponent('p', {
        children: JSON.stringify(metafield.value),
      });
    });

    it('allows passthrough props', () => {
      const component = mountWithProviders(
        <Metafield
          data={getParsedMetafield({type: 'json'})}
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
      const metafield = getParsedMetafield({type: 'color'});
      const component = mountWithProviders(<Metafield data={metafield} />);

      expect(component).toContainReactComponent('span', {
        children: metafield.value,
      });
    });

    it('renders the color as a string in the element specified by the `as` prop', () => {
      const metafield = getParsedMetafield({type: 'color'});
      const component = mountWithProviders(
        <Metafield data={metafield} as="p" />
      );

      expect(component).toContainReactComponent('p', {
        children: metafield.value,
      });
    });

    it('allows passthrough props', () => {
      const component = mountWithProviders(
        <Metafield
          data={getParsedMetafield({type: 'color'})}
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
      const metafield = getParsedMetafield({type: 'product_reference'});
      const component = mountWithProviders(<Metafield data={metafield} />);

      expect(component).toContainReactComponent('span', {
        children: metafield.value,
      });
    });

    it('renders the product reference as a string in the element specified by the `as` prop', () => {
      const metafield = getParsedMetafield({type: 'product_reference'});
      const component = mountWithProviders(
        <Metafield data={metafield} as="p" />
      );

      expect(component).toContainReactComponent('p', {
        children: metafield.value,
      });
    });

    it('allows passthrough props', () => {
      const component = mountWithProviders(
        <Metafield
          data={getParsedMetafield({type: 'product_reference'})}
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
      const metafield = getParsedMetafield({type: 'page_reference'});
      const component = mountWithProviders(<Metafield data={metafield} />);

      expect(component).toContainReactComponent('span', {
        children: metafield.value,
      });
    });

    it('renders the page reference as a string in the element specified by the `as` prop', () => {
      const metafield = getParsedMetafield({type: 'page_reference'});
      const component = mountWithProviders(
        <Metafield data={metafield} as="p" />
      );

      expect(component).toContainReactComponent('p', {
        children: metafield.value,
      });
    });

    it('allows passthrough props', () => {
      const component = mountWithProviders(
        <Metafield
          data={getParsedMetafield({type: 'page_reference'})}
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
      const metafield = getParsedMetafield({type: 'variant_reference'});
      const component = mountWithProviders(<Metafield data={metafield} />);

      expect(component).toContainReactComponent('span', {
        children: metafield.value,
      });
    });

    it('renders the variant reference as a string in the element specified by the `as` prop', () => {
      const metafield = getParsedMetafield({type: 'variant_reference'});
      const component = mountWithProviders(
        <Metafield data={metafield} as="p" />
      );

      expect(component).toContainReactComponent('p', {
        children: metafield.value,
      });
    });

    it('allows passthrough props', () => {
      const component = mountWithProviders(
        <Metafield
          data={getParsedMetafield({type: 'variant_reference'})}
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
        const metafield = getParsedMetafield({
          type: 'file_reference',
          reference: {__typename: 'MediaImage', ...getMediaImage()},
        });
        const component = mountWithProviders(<Metafield data={metafield} />);

        expect(component).toContainReactComponent(Image);
      });

      it('allows passthrough props', () => {
        const metafield = getParsedMetafield({
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
        const metafield = getParsedMetafield({type: 'file_reference'});
        const component = mountWithProviders(<Metafield data={metafield} />);

        expect(component).toContainReactComponent('span', {
          children: metafield.value,
        });
      });

      it('renders the file reference as a string in the element specified by the `as` prop', () => {
        const metafield = getParsedMetafield({type: 'file_reference'});
        const component = mountWithProviders(
          <Metafield data={metafield} as="p" />
        );

        expect(component).toContainReactComponent('p', {
          children: metafield.value,
        });
      });

      it('allows passthrough props', () => {
        const component = mountWithProviders(
          <Metafield
            data={getParsedMetafield({type: 'file_reference'})}
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
      const metafield = getParsedMetafield({type: 'boolean'});
      const component = mountWithProviders(<Metafield data={metafield} />);

      expect(component).toContainReactComponent('span', {
        children: (metafield.value as boolean).toString(),
      });
    });

    it('renders the boolean as a string in the element specified by the `as` prop', () => {
      const metafield = getParsedMetafield({type: 'boolean'});
      const component = mountWithProviders(
        <Metafield data={metafield} as="p" />
      );

      expect(component).toContainReactComponent('p', {
        children: (metafield.value as boolean).toString(),
      });
    });

    it('allows passthrough props', () => {
      const component = mountWithProviders(
        <Metafield
          data={getParsedMetafield({type: 'boolean'})}
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
      const metafield = getParsedMetafield({type: 'number_integer'});
      const component = mountWithProviders(<Metafield data={metafield} />);

      expect(component).toContainReactComponent('span', {
        children: (metafield.value as number).toString(),
      });
    });

    it('renders the boolean as a string in the element specified by the `as` prop', () => {
      const metafield = getParsedMetafield({type: 'number_integer'});
      const component = mountWithProviders(
        <Metafield data={metafield} as="p" />
      );

      expect(component).toContainReactComponent('p', {
        children: (metafield.value as number).toString(),
      });
    });

    it('allows passthrough props', () => {
      const component = mountWithProviders(
        <Metafield
          data={getParsedMetafield({type: 'number_integer'})}
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
      const metafield = getParsedMetafield({type: 'number_decimal'});
      const component = mountWithProviders(<Metafield data={metafield} />);

      expect(component).toContainReactComponent('span', {
        children: (metafield.value as number).toString(),
      });
    });

    it('renders the number as a string in the element specified by the `as` prop', () => {
      const metafield = getParsedMetafield({type: 'number_decimal'});
      const component = mountWithProviders(
        <Metafield data={metafield} as="p" />
      );

      expect(component).toContainReactComponent('p', {
        children: (metafield.value as number).toString(),
      });
    });

    it('allows passthrough props', () => {
      const component = mountWithProviders(
        <Metafield
          data={getParsedMetafield({type: 'number_decimal'})}
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
      const metafield = getParsedMetafield({type: 'rating'});
      const component = mountWithProviders(<Metafield data={metafield} />);

      expect(component).toContainReactComponent('span', {
        children: (metafield.value as Rating).value,
      });
    });

    it('allows passthrough props', () => {
      const component = mountWithProviders(
        <Metafield
          data={getParsedMetafield({type: 'rating'})}
          className="emphasized"
        />
      );
      expect(component).toContainReactComponent('span', {
        className: 'emphasized',
      });
    });
  });
});
