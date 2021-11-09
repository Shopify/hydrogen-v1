import React from 'react';
import {Metafield} from '../Metafield.client';
import {getParsedMetafield} from '../../../utilities/tests/metafields';
import {mountWithShopifyProvider} from '../../../utilities/tests/shopify_provider';
import {RawHtml} from '../../RawHtml';
import {Image} from '../../Image';
import {StarRating} from '../components';
import {getMediaImage} from '../../../utilities/tests/media';
import {ProductProvider} from '../../ProductProvider';

describe('<Metafield />', () => {
  it('renders nothing when the metafield value is undefined', () => {
    const component = mountWithShopifyProvider(
      <Metafield metafield={{type: 'color', value: undefined}} />
    );
    expect(component.html()).toBeFalsy();
  });

  it('logs a warning to the console when the metafield value is null', () => {
    const mock = jest.spyOn(console, 'warn');
    const metafield = {type: 'color', value: undefined};
    mountWithShopifyProvider(<Metafield metafield={metafield} />);

    expect(mock).toHaveBeenCalledWith(`No metafield value for ${metafield}`);
  });

  describe('with `date` type metafield', () => {
    it('renders the localized date as a string in a `time` by default', () => {
      const metafield = getParsedMetafield({type: 'date'});
      const component = mountWithShopifyProvider(
        <Metafield metafield={metafield} />,
        {
          shopifyConfig: {
            locale: 'en-us',
          },
        }
      );

      expect(component).toContainReactComponent('time', {
        children: (metafield.value as Date).toLocaleDateString(),
      });
    });

    it('renders the date as a string in the element specified by the `as` prop', () => {
      const metafield = getParsedMetafield({type: 'date'});
      const component = mountWithShopifyProvider(
        <Metafield metafield={metafield} as="p" />,
        {
          shopifyConfig: {
            locale: 'en-us',
          },
        }
      );

      expect(component).toContainReactComponent('p', {
        children: (metafield.value as Date).toLocaleDateString(),
      });
    });

    it('passes the metafield as a render prop to the children render function', () => {
      const children = jest.fn().mockImplementation(() => {
        return <p>Hello world</p>;
      });
      const metafield = getParsedMetafield({type: 'date'});

      mountWithShopifyProvider(
        <Metafield metafield={metafield}>{children}</Metafield>
      );

      expect(children).toHaveBeenCalledWith({
        ...metafield,
        value: metafield.value,
      });
    });

    it('renders its children', () => {
      const metafield = getParsedMetafield({type: 'date'});
      const component = mountWithShopifyProvider(
        <Metafield metafield={metafield}>
          {({value}) => {
            return <p>The date is {(value as Date).toLocaleDateString()}</p>;
          }}
        </Metafield>
      );

      expect(component).toContainReactComponent('p', {
        children: [
          `The date is `,
          (metafield.value as Date).toLocaleDateString(),
        ],
      });
    });

    it('allows passthrough props', () => {
      const component = mountWithShopifyProvider(
        <Metafield
          metafield={getParsedMetafield({type: 'date'})}
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
      const component = mountWithShopifyProvider(
        <Metafield metafield={metafield} />,
        {
          shopifyConfig: {
            locale: 'en-us',
          },
        }
      );

      expect(component).toContainReactComponent('time', {
        children: (metafield.value as Date).toLocaleString(),
      });
    });

    it('renders the date as a string in the element specified by the `as` prop', () => {
      const metafield = getParsedMetafield({type: 'date_time'});
      const component = mountWithShopifyProvider(
        <Metafield metafield={metafield} as="p" />,
        {
          shopifyConfig: {
            locale: 'en-us',
          },
        }
      );

      expect(component).toContainReactComponent('p', {
        children: (metafield.value as Date).toLocaleString(),
      });
    });

    it('passes the metafield as a render prop to the children render function', () => {
      const children = jest.fn().mockImplementation(() => {
        return <p>Hello world</p>;
      });
      const metafield = getParsedMetafield({type: 'date_time'});

      mountWithShopifyProvider(
        <Metafield metafield={metafield}>{children}</Metafield>
      );

      expect(children).toHaveBeenCalledWith({
        ...metafield,
        value: metafield.value,
      });
    });

    it('renders its children', () => {
      const metafield = getParsedMetafield({type: 'date_time'});
      const component = mountWithShopifyProvider(
        <Metafield metafield={metafield}>
          {({value}) => {
            return <p>The date is {(value as Date).toLocaleString()}</p>;
          }}
        </Metafield>
      );

      expect(component).toContainReactComponent('p', {
        children: [`The date is `, (metafield.value as Date).toLocaleString()],
      });
    });

    it('allows passthrough props', () => {
      const component = mountWithShopifyProvider(
        <Metafield
          metafield={getParsedMetafield({type: 'date_time'})}
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
      const component = mountWithShopifyProvider(
        <Metafield metafield={metafield} />,
        {
          shopifyConfig: {
            locale: 'en-us',
          },
        }
      );

      expect(component).toContainReactComponent('span', {
        children: '10 kg',
      });
    });

    it('renders the weight as a string in the element specified by the `as` prop', () => {
      const metafield = getParsedMetafield({
        type: 'weight',
        value: JSON.stringify({value: 10, unit: 'kg'}),
      });
      const component = mountWithShopifyProvider(
        <Metafield metafield={metafield} as="p" />,
        {
          shopifyConfig: {
            locale: 'en-us',
          },
        }
      );

      expect(component).toContainReactComponent('p', {
        children: '10 kg',
      });
    });

    it('passes the metafield as a render prop to the children render function', () => {
      const children = jest.fn().mockImplementation(() => {
        return <p>Hello world</p>;
      });
      const metafield = getParsedMetafield({type: 'weight'});

      mountWithShopifyProvider(
        <Metafield metafield={metafield}>{children}</Metafield>
      );

      expect(children).toHaveBeenCalledWith({
        ...metafield,
        value: metafield.value,
      });
    });

    it('renders its children', () => {
      const component = mountWithShopifyProvider(
        <Metafield metafield={getParsedMetafield({type: 'weight'})}>
          {() => {
            return <p>The weight is 10 lbs</p>;
          }}
        </Metafield>
      );

      expect(component).toContainReactComponent('p', {
        children: `The weight is 10 lbs`,
      });
    });

    it('allows passthrough props', () => {
      const component = mountWithShopifyProvider(
        <Metafield
          metafield={getParsedMetafield({type: 'weight'})}
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
      const component = mountWithShopifyProvider(
        <Metafield metafield={metafield} />,
        {
          shopifyConfig: {
            locale: 'en-us',
          },
        }
      );

      expect(component).toContainReactComponent('span', {
        children: '10 L',
      });
    });

    it('renders the volume as a string in the element specified by the `as` prop', () => {
      const metafield = getParsedMetafield({
        type: 'volume',
        value: JSON.stringify({value: 10, unit: 'l'}),
      });
      const component = mountWithShopifyProvider(
        <Metafield metafield={metafield} as="p" />,
        {
          shopifyConfig: {
            locale: 'en-us',
          },
        }
      );

      expect(component).toContainReactComponent('p', {
        children: '10 L',
      });
    });

    it('passes the metafield as a render prop to the children render function', () => {
      const children = jest.fn().mockImplementation(() => {
        return <p>Hello world</p>;
      });
      const metafield = getParsedMetafield({type: 'volume'});

      mountWithShopifyProvider(
        <Metafield metafield={metafield}>{children}</Metafield>
      );

      expect(children).toHaveBeenCalledWith({
        ...metafield,
        value: metafield.value,
      });
    });

    it('renders its children', () => {
      const component = mountWithShopifyProvider(
        <Metafield metafield={getParsedMetafield({type: 'volume'})}>
          {() => {
            return <p>The volume is 10 l</p>;
          }}
        </Metafield>
      );

      expect(component).toContainReactComponent('p', {
        children: `The volume is 10 l`,
      });
    });

    it('allows passthrough props', () => {
      const component = mountWithShopifyProvider(
        <Metafield
          metafield={getParsedMetafield({type: 'volume'})}
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
      const component = mountWithShopifyProvider(
        <Metafield metafield={metafield} />,
        {
          shopifyConfig: {
            locale: 'en-us',
          },
        }
      );

      expect(component).toContainReactComponent('span', {
        children: '5 cm',
      });
    });

    it('renders the dimension as a string in the element specified by the `as` prop', () => {
      const metafield = getParsedMetafield({
        type: 'dimension',
        value: JSON.stringify({value: 5, unit: 'cm'}),
      });
      const component = mountWithShopifyProvider(
        <Metafield metafield={metafield} as="p" />,
        {
          shopifyConfig: {
            locale: 'en-us',
          },
        }
      );

      expect(component).toContainReactComponent('p', {
        children: '5 cm',
      });
    });

    it('passes the metafield as a render prop to the children render function', () => {
      const children = jest.fn().mockImplementation(() => {
        return <p>Hello world</p>;
      });
      const metafield = getParsedMetafield({type: 'dimension'});

      mountWithShopifyProvider(
        <Metafield metafield={metafield}>{children}</Metafield>
      );

      expect(children).toHaveBeenCalledWith({
        ...metafield,
        value: metafield.value,
      });
    });

    it('renders its children', () => {
      const component = mountWithShopifyProvider(
        <Metafield metafield={getParsedMetafield({type: 'dimension'})}>
          {() => {
            return <p>The length is 5 cm</p>;
          }}
        </Metafield>
      );

      expect(component).toContainReactComponent('p', {
        children: `The length is 5 cm`,
      });
    });

    it('allows passthrough props', () => {
      const component = mountWithShopifyProvider(
        <Metafield
          metafield={getParsedMetafield({type: 'dimension'})}
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
      const component = mountWithShopifyProvider(
        <Metafield metafield={metafield} />,
        {
          shopifyConfig: {
            locale: 'en-us',
          },
        }
      );

      expect(component).toContainReactComponent(RawHtml, {
        string: metafield.value,
      });
    });

    it('passes the metafield as a render prop to the children render function', () => {
      const children = jest.fn().mockImplementation(() => {
        return <p>Hello world</p>;
      });
      const metafield = getParsedMetafield({type: 'single_line_text_field'});

      mountWithShopifyProvider(
        <Metafield metafield={metafield}>{children}</Metafield>
      );

      expect(children).toHaveBeenCalledWith({
        ...metafield,
        value: metafield.value,
      });
    });

    it('renders its children', () => {
      const component = mountWithShopifyProvider(
        <Metafield
          metafield={getParsedMetafield({type: 'single_line_text_field'})}
        >
          {() => {
            return <p>Hello world</p>;
          }}
        </Metafield>
      );

      expect(component).toContainReactComponent('p', {
        children: `Hello world`,
      });
    });

    it('allows passthrough props', () => {
      const component = mountWithShopifyProvider(
        <Metafield
          metafield={getParsedMetafield({type: 'single_line_text_field'})}
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

    it('passes the metafield as a render prop to the children render function', () => {
      const children = jest.fn().mockImplementation(() => {
        return <p>Hello world</p>;
      });
      const metafield = getParsedMetafield({type: 'multi_line_text_field'});

      mountWithShopifyProvider(
        <Metafield metafield={metafield}>{children}</Metafield>
      );

      expect(children).toHaveBeenCalledWith({
        ...metafield,
        value: metafield.value,
      });
    });

    it('renders its children', () => {
      const component = mountWithShopifyProvider(
        <Metafield
          metafield={getParsedMetafield({type: 'multi_line_text_field'})}
        >
          {() => {
            return <p>Hello world</p>;
          }}
        </Metafield>
      );

      expect(component).toContainReactComponent('p', {
        children: `Hello world`,
      });
    });

    it('allows passthrough props', () => {
      const component = mountWithShopifyProvider(
        <Metafield
          metafield={getParsedMetafield({type: 'multi_line_text_field'})}
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
      const component = mountWithShopifyProvider(
        <Metafield metafield={metafield} />
      );

      expect(component).toContainReactComponent('a', {
        children: metafield.value,
        href: metafield.value as string,
      });
    });

    it('passes the metafield as a render prop to the children render function', () => {
      const children = jest.fn().mockImplementation(() => {
        return <p>Hello world</p>;
      });
      const metafield = getParsedMetafield({type: 'url'});

      mountWithShopifyProvider(
        <Metafield metafield={metafield}>{children}</Metafield>
      );

      expect(children).toHaveBeenCalledWith({
        ...metafield,
        value: metafield.value,
      });
    });

    it('renders its children', () => {
      const component = mountWithShopifyProvider(
        <Metafield metafield={getParsedMetafield({type: 'url'})}>
          {() => {
            return <p>Hello world</p>;
          }}
        </Metafield>
      );

      expect(component).toContainReactComponent('p', {
        children: `Hello world`,
      });
    });

    it('allows passthrough props', () => {
      const component = mountWithShopifyProvider(
        <Metafield
          metafield={getParsedMetafield({type: 'url'})}
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
      const component = mountWithShopifyProvider(
        <Metafield metafield={metafield} />
      );

      expect(component).toContainReactComponent('span', {
        children: JSON.stringify(metafield.value),
      });
    });

    it('renders the json as a string in the element specified by the `as` prop', () => {
      const metafield = getParsedMetafield({type: 'json'});
      const component = mountWithShopifyProvider(
        <Metafield metafield={metafield} as="p" />
      );

      expect(component).toContainReactComponent('p', {
        children: JSON.stringify(metafield.value),
      });
    });

    it('passes the metafield as a render prop to the children render function', () => {
      const children = jest.fn().mockImplementation(() => {
        return null;
      });
      const metafield = getParsedMetafield({type: 'json'});

      mountWithShopifyProvider(
        <Metafield metafield={metafield}>{children}</Metafield>
      );

      expect(children).toHaveBeenCalledWith({
        ...metafield,
        value: metafield.value,
      });
    });

    it('renders its children', () => {
      const metafield = getParsedMetafield({type: 'json'});
      const component = mountWithShopifyProvider(
        <Metafield metafield={metafield}>
          {({value}) => {
            return <p>The value is {JSON.stringify(value)}</p>;
          }}
        </Metafield>
      );

      expect(component).toContainReactComponent('p', {
        children: [`The value is `, JSON.stringify(metafield.value)],
      });
    });

    it('allows passthrough props', () => {
      const component = mountWithShopifyProvider(
        <Metafield
          metafield={getParsedMetafield({type: 'json'})}
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
      const component = mountWithShopifyProvider(
        <Metafield metafield={metafield} />
      );

      expect(component).toContainReactComponent('span', {
        children: metafield.value,
      });
    });

    it('renders the color as a string in the element specified by the `as` prop', () => {
      const metafield = getParsedMetafield({type: 'color'});
      const component = mountWithShopifyProvider(
        <Metafield metafield={metafield} as="p" />
      );

      expect(component).toContainReactComponent('p', {
        children: metafield.value,
      });
    });

    it('passes the metafield as a render prop to the children render function', () => {
      const children = jest.fn().mockImplementation(() => {
        return null;
      });
      const metafield = getParsedMetafield({type: 'color'});

      mountWithShopifyProvider(
        <Metafield metafield={metafield}>{children}</Metafield>
      );

      expect(children).toHaveBeenCalledWith({
        ...metafield,
        value: metafield.value,
      });
    });

    it('renders its children', () => {
      const metafield = getParsedMetafield({type: 'color'});
      const component = mountWithShopifyProvider(
        <Metafield metafield={metafield}>
          {({value}) => {
            return <p>The color is {value}</p>;
          }}
        </Metafield>
      );

      expect(component).toContainReactComponent('p', {
        children: [`The color is `, metafield.value],
      });
    });

    it('allows passthrough props', () => {
      const component = mountWithShopifyProvider(
        <Metafield
          metafield={getParsedMetafield({type: 'color'})}
          className="emphasized"
        />
      );
      expect(component).toContainReactComponent('span', {
        className: 'emphasized',
      });
    });
  });

  describe('with `product_reference` type metafield', () => {
    describe('when `reference` is undefined', () => {
      it('renders the value as a string in a `span` by default', () => {
        const metafield = getParsedMetafield({
          type: 'product_reference',
          reference: undefined,
        });
        const component = mountWithShopifyProvider(
          <Metafield metafield={metafield} />
        );

        expect(component).toContainReactComponent('span', {
          children: metafield.value,
        });
      });

      it('renders the value as a string in the element specified by the `as` prop', () => {
        const metafield = getParsedMetafield({
          type: 'product_reference',
          reference: undefined,
        });
        const component = mountWithShopifyProvider(
          <Metafield metafield={metafield} as="p" />
        );

        expect(component).toContainReactComponent('p', {
          children: metafield.value,
        });
      });

      it('passes the metafield as a render prop to the children render function', () => {
        const children = jest.fn().mockImplementation(() => {
          return null;
        });
        const metafield = getParsedMetafield({
          type: 'product_reference',
          reference: undefined,
        });

        mountWithShopifyProvider(
          <Metafield metafield={metafield}>{children}</Metafield>
        );

        expect(children).toHaveBeenCalledWith({
          ...metafield,
          value: metafield.value,
        });
      });

      it('renders its children', () => {
        const metafield = getParsedMetafield({
          type: 'product_reference',
          reference: undefined,
        });
        const component = mountWithShopifyProvider(
          <Metafield metafield={metafield}>
            {({value}) => {
              return <p>The reference is {value}</p>;
            }}
          </Metafield>
        );

        expect(component).toContainReactComponent('p', {
          children: [`The reference is `, metafield.value],
        });
      });

      it('allows passthrough props', () => {
        const component = mountWithShopifyProvider(
          <Metafield
            metafield={getParsedMetafield({
              type: 'product_reference',
              reference: undefined,
            })}
            className="emphasized"
          />
        );
        expect(component).toContainReactComponent('span', {
          className: 'emphasized',
        });
      });
    });

    describe('when `reference` is not undefined', () => {
      it('renders a `ProductProvider` with its children by default', () => {
        const metafield = getParsedMetafield({type: 'product_reference'});
        function Children() {
          return null;
        }
        const component = mountWithShopifyProvider(
          <Metafield metafield={metafield}>
            <Children />
          </Metafield>
        );

        expect(component).toContainReactComponent(ProductProvider, {
          children: <Children />,
        });
      });

      it('passes the metafield as a render prop to the children render function', () => {
        const children = jest.fn().mockImplementation(() => {
          return null;
        });
        const metafield = getParsedMetafield({type: 'product_reference'});

        mountWithShopifyProvider(
          <Metafield metafield={metafield}>{children}</Metafield>
        );

        expect(children).toHaveBeenCalledWith({
          ...metafield,
          value: metafield.value,
        });
      });
    });
  });

  describe('with `page_reference` type metafield', () => {
    it('renders the page reference as a string in a `span` by default', () => {
      const metafield = getParsedMetafield({type: 'page_reference'});
      const component = mountWithShopifyProvider(
        <Metafield metafield={metafield} />
      );

      expect(component).toContainReactComponent('span', {
        children: metafield.value,
      });
    });

    it('renders the page reference as a string in the element specified by the `as` prop', () => {
      const metafield = getParsedMetafield({type: 'page_reference'});
      const component = mountWithShopifyProvider(
        <Metafield metafield={metafield} as="p" />
      );

      expect(component).toContainReactComponent('p', {
        children: metafield.value,
      });
    });

    it('passes the metafield as a render prop to the children render function', () => {
      const children = jest.fn().mockImplementation(() => {
        return null;
      });
      const metafield = getParsedMetafield({type: 'page_reference'});

      mountWithShopifyProvider(
        <Metafield metafield={metafield}>{children}</Metafield>
      );

      expect(children).toHaveBeenCalledWith({
        ...metafield,
        value: metafield.value,
      });
    });

    it('renders its children', () => {
      const metafield = getParsedMetafield({type: 'page_reference'});
      const component = mountWithShopifyProvider(
        <Metafield metafield={metafield}>
          {({value}) => {
            return <p>The reference is {value}</p>;
          }}
        </Metafield>
      );

      expect(component).toContainReactComponent('p', {
        children: [`The reference is `, metafield.value],
      });
    });

    it('allows passthrough props', () => {
      const component = mountWithShopifyProvider(
        <Metafield
          metafield={getParsedMetafield({type: 'page_reference'})}
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
      const component = mountWithShopifyProvider(
        <Metafield metafield={metafield} />
      );

      expect(component).toContainReactComponent('span', {
        children: metafield.value,
      });
    });

    it('renders the variant reference as a string in the element specified by the `as` prop', () => {
      const metafield = getParsedMetafield({type: 'variant_reference'});
      const component = mountWithShopifyProvider(
        <Metafield metafield={metafield} as="p" />
      );

      expect(component).toContainReactComponent('p', {
        children: metafield.value,
      });
    });

    it('passes the metafield as a render prop to the children render function', () => {
      const children = jest.fn().mockImplementation(() => {
        return null;
      });
      const metafield = getParsedMetafield({type: 'variant_reference'});

      mountWithShopifyProvider(
        <Metafield metafield={metafield}>{children}</Metafield>
      );

      expect(children).toHaveBeenCalledWith({
        ...metafield,
        value: metafield.value,
      });
    });

    it('renders its children', () => {
      const metafield = getParsedMetafield({type: 'variant_reference'});
      const component = mountWithShopifyProvider(
        <Metafield metafield={metafield}>
          {({value}) => {
            return <p>The reference is {value}</p>;
          }}
        </Metafield>
      );

      expect(component).toContainReactComponent('p', {
        children: [`The reference is `, metafield.value],
      });
    });

    it('allows passthrough props', () => {
      const component = mountWithShopifyProvider(
        <Metafield
          metafield={getParsedMetafield({type: 'variant_reference'})}
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
        const component = mountWithShopifyProvider(
          <Metafield metafield={metafield} />
        );

        expect(component).toContainReactComponent(Image);
      });

      it('allows passthrough props', () => {
        const metafield = getParsedMetafield({
          type: 'file_reference',
          reference: {__typename: 'MediaImage', ...getMediaImage()},
        });
        const component = mountWithShopifyProvider(
          <Metafield metafield={metafield} className="rounded-md" />
        );

        expect(component).toContainReactComponent(Image, {
          className: 'rounded-md',
        });
      });
    });

    describe('when the reference type is not a MediaImage', () => {
      it('renders the file reference as a string in a `span` by default', () => {
        const metafield = getParsedMetafield({type: 'file_reference'});
        const component = mountWithShopifyProvider(
          <Metafield metafield={metafield} />
        );

        expect(component).toContainReactComponent('span', {
          children: metafield.value,
        });
      });

      it('renders the file reference as a string in the element specified by the `as` prop', () => {
        const metafield = getParsedMetafield({type: 'file_reference'});
        const component = mountWithShopifyProvider(
          <Metafield metafield={metafield} as="p" />
        );

        expect(component).toContainReactComponent('p', {
          children: metafield.value,
        });
      });

      it('passes the metafield as a render prop to the children render function', () => {
        const children = jest.fn().mockImplementation(() => {
          return null;
        });
        const metafield = getParsedMetafield({type: 'file_reference'});

        mountWithShopifyProvider(
          <Metafield metafield={metafield}>{children}</Metafield>
        );

        expect(children).toHaveBeenCalledWith({
          ...metafield,
          value: metafield.value,
        });
      });

      it('renders its children', () => {
        const metafield = getParsedMetafield({type: 'file_reference'});
        const component = mountWithShopifyProvider(
          <Metafield metafield={metafield}>
            {({value}) => {
              return <p>The reference is {value}</p>;
            }}
          </Metafield>
        );

        expect(component).toContainReactComponent('p', {
          children: [`The reference is `, metafield.value],
        });
      });

      it('allows passthrough props', () => {
        const component = mountWithShopifyProvider(
          <Metafield
            metafield={getParsedMetafield({type: 'file_reference'})}
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
      const component = mountWithShopifyProvider(
        <Metafield metafield={metafield} />
      );

      expect(component).toContainReactComponent('span', {
        children: (metafield.value as boolean).toString(),
      });
    });

    it('renders the boolean as a string in the element specified by the `as` prop', () => {
      const metafield = getParsedMetafield({type: 'boolean'});
      const component = mountWithShopifyProvider(
        <Metafield metafield={metafield} as="p" />
      );

      expect(component).toContainReactComponent('p', {
        children: (metafield.value as boolean).toString(),
      });
    });

    it('passes the metafield as a render prop to the children render function', () => {
      const children = jest.fn().mockImplementation(() => {
        return null;
      });
      const metafield = getParsedMetafield({type: 'boolean'});

      mountWithShopifyProvider(
        <Metafield metafield={metafield}>{children}</Metafield>
      );

      expect(children).toHaveBeenCalledWith({
        ...metafield,
        value: metafield.value,
      });
    });

    it('renders its children', () => {
      const metafield = getParsedMetafield({type: 'boolean'});
      const component = mountWithShopifyProvider(
        <Metafield metafield={metafield}>
          {({value}) => {
            return <p>The value is {value}</p>;
          }}
        </Metafield>
      );

      expect(component).toContainReactComponent('p', {
        children: [`The value is `, metafield.value],
      });
    });

    it('allows passthrough props', () => {
      const component = mountWithShopifyProvider(
        <Metafield
          metafield={getParsedMetafield({type: 'boolean'})}
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
      const component = mountWithShopifyProvider(
        <Metafield metafield={metafield} />
      );

      expect(component).toContainReactComponent('span', {
        children: (metafield.value as number).toString(),
      });
    });

    it('renders the boolean as a string in the element specified by the `as` prop', () => {
      const metafield = getParsedMetafield({type: 'number_integer'});
      const component = mountWithShopifyProvider(
        <Metafield metafield={metafield} as="p" />
      );

      expect(component).toContainReactComponent('p', {
        children: (metafield.value as number).toString(),
      });
    });

    it('passes the metafield as a render prop to the children render function', () => {
      const children = jest.fn().mockImplementation(() => {
        return null;
      });
      const metafield = getParsedMetafield({type: 'number_integer'});

      mountWithShopifyProvider(
        <Metafield metafield={metafield}>{children}</Metafield>
      );

      expect(children).toHaveBeenCalledWith({
        ...metafield,
        value: metafield.value,
      });
    });

    it('renders its children', () => {
      const metafield = getParsedMetafield({type: 'number_integer'});
      const component = mountWithShopifyProvider(
        <Metafield metafield={metafield}>
          {({value}) => {
            return <p>The int is {value}</p>;
          }}
        </Metafield>
      );

      expect(component).toContainReactComponent('p', {
        children: [`The int is `, metafield.value],
      });
    });

    it('allows passthrough props', () => {
      const component = mountWithShopifyProvider(
        <Metafield
          metafield={getParsedMetafield({type: 'number_integer'})}
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
      const component = mountWithShopifyProvider(
        <Metafield metafield={metafield} />
      );

      expect(component).toContainReactComponent('span', {
        children: (metafield.value as number).toString(),
      });
    });

    it('renders the number as a string in the element specified by the `as` prop', () => {
      const metafield = getParsedMetafield({type: 'number_decimal'});
      const component = mountWithShopifyProvider(
        <Metafield metafield={metafield} as="p" />
      );

      expect(component).toContainReactComponent('p', {
        children: (metafield.value as number).toString(),
      });
    });

    it('passes the metafield as a render prop to the children render function', () => {
      const children = jest.fn().mockImplementation(() => {
        return null;
      });
      const metafield = getParsedMetafield({type: 'number_decimal'});

      mountWithShopifyProvider(
        <Metafield metafield={metafield}>{children}</Metafield>
      );

      expect(children).toHaveBeenCalledWith({
        ...metafield,
        value: metafield.value,
      });
    });

    it('renders its children', () => {
      const metafield = getParsedMetafield({type: 'number_decimal'});
      const component = mountWithShopifyProvider(
        <Metafield metafield={metafield}>
          {({value}) => {
            return <p>The number is {value}</p>;
          }}
        </Metafield>
      );

      expect(component).toContainReactComponent('p', {
        children: [`The number is `, metafield.value],
      });
    });

    it('allows passthrough props', () => {
      const component = mountWithShopifyProvider(
        <Metafield
          metafield={getParsedMetafield({type: 'number_decimal'})}
          className="emphasized"
        />
      );
      expect(component).toContainReactComponent('span', {
        className: 'emphasized',
      });
    });
  });

  describe('with `rating` type metafield', () => {
    it('renders <StarRating />', () => {
      const metafield = getParsedMetafield({type: 'rating'});
      const component = mountWithShopifyProvider(
        <Metafield metafield={metafield} />
      );

      expect(component).toContainReactComponent(StarRating, {
        rating: metafield.value,
      });
    });

    it('passes the metafield as a render prop to the children render function', () => {
      const children = jest.fn().mockImplementation(() => {
        return null;
      });
      const metafield = getParsedMetafield({type: 'rating'});

      mountWithShopifyProvider(
        <Metafield metafield={metafield}>{children}</Metafield>
      );

      expect(children).toHaveBeenCalledWith({
        ...metafield,
        value: metafield.value,
      });
    });

    it('renders its children', () => {
      const metafield = getParsedMetafield({type: 'rating'});
      const component = mountWithShopifyProvider(
        <Metafield metafield={metafield}>
          {({value}) => {
            return <p>The rating is {(value as any)!.value}</p>;
          }}
        </Metafield>
      );

      expect(component).toContainReactComponent('p', {
        children: [`The rating is `, (metafield.value as any).value],
      });
    });

    it('allows passthrough props', () => {
      const component = mountWithShopifyProvider(
        <Metafield
          metafield={getParsedMetafield({type: 'rating'})}
          className="emphasized"
        />
      );
      expect(component).toContainReactComponent(StarRating, {
        className: 'emphasized',
      });
    });
  });
});
