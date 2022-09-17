import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {ShopifyTestProviders} from '../../../utilities/tests/provider-helpers.js';
import {ProductOptionsProvider} from '../ProductOptionsProvider.client.js';
import {getProduct} from '../../../utilities/tests/product.js';
import {useProductOptions} from '../../../hooks/useProductOptions/index.js';
import {
  VARIANTS,
  VARIANTS_WITH_SELLING_PLANS,
  SELLING_PLAN_GROUPS_CONNECTION,
} from './fixtures.js';

describe('<ProductOptionsProvider />', () => {
  it('renders its children', () => {
    const prod = getProduct();

    render(
      <ProductOptionsProvider data={prod} initialVariantId="">
        Children
      </ProductOptionsProvider>,
      {
        wrapper: ShopifyTestProviders,
      }
    );

    expect(screen.getByText('Children')).toBeInTheDocument();
  });

  it('returns a structured list of options and values', () => {
    function Component() {
      const {options} = useProductOptions();
      return <div>{JSON.stringify(options)}</div>;
    }

    const prod = getProduct({variants: VARIANTS});

    render(
      <ProductOptionsProvider data={prod} initialVariantId="">
        <Component />
      </ProductOptionsProvider>,
      {
        wrapper: ShopifyTestProviders,
      }
    );

    expect(
      screen.getByText(
        JSON.stringify([
          {
            name: 'Color',
            values: ['Black', 'White'],
          },
          {
            name: 'Size',
            values: ['Small', 'Large'],
          },
        ])
      )
    ).toBeInTheDocument();
  });

  it('provides setSelectedOption callback', async () => {
    const user = userEvent.setup();

    function Component() {
      const {options, setSelectedOption, selectedOptions} = useProductOptions();
      return (
        <>
          <ul>
            {options?.map((option) => (
              <li key={option?.name}>
                <ul>
                  {option?.values?.map((value) => (
                    <li key={value}>
                      <button
                        onClick={() =>
                          setSelectedOption(option?.name ?? '', value ?? '')
                        }
                      >
                        {value}
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <div>{JSON.stringify(selectedOptions)}</div>
        </>
      );
    }

    const prod = getProduct({variants: VARIANTS});

    render(
      <ProductOptionsProvider data={prod}>
        <Component />
      </ProductOptionsProvider>
    );

    expect(
      screen.getByText(JSON.stringify({Color: 'Black', Size: 'Small'}))
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', {name: 'White'}));

    expect(
      screen.getByText(JSON.stringify({Color: 'White', Size: 'Small'}))
    ).toBeInTheDocument();
  });

  it('computes selected options based on initial selected variant', async () => {
    function Component() {
      const {selectedOptions} = useProductOptions();
      return <div>{JSON.stringify(selectedOptions)}</div>;
    }

    const prod = getProduct({
      variants: VARIANTS,
    });

    render(
      <ProductOptionsProvider
        data={prod}
        initialVariantId={VARIANTS.nodes?.[0]?.id}
      >
        <Component />
      </ProductOptionsProvider>,
      {
        wrapper: ShopifyTestProviders,
      }
    );

    expect(
      screen.getByText(JSON.stringify({Color: 'Black', Size: 'Small'}))
    ).toBeInTheDocument();
  });

  it('provides list of variants', async () => {
    function Component() {
      const {variants} = useProductOptions();
      return <div>{JSON.stringify(variants)}</div>;
    }

    const prod = getProduct({variants: VARIANTS});

    render(
      <ProductOptionsProvider data={prod} initialVariantId="">
        <Component />
      </ProductOptionsProvider>,
      {
        wrapper: ShopifyTestProviders,
      }
    );

    expect(
      screen.getByText(JSON.stringify(VARIANTS.nodes))
    ).toBeInTheDocument();
  });

  it('provides setSelectedVariant callback', async () => {
    const user = userEvent.setup();

    function Component() {
      const {variants, selectedVariant, setSelectedVariant} =
        useProductOptions();

      return (
        <>
          <label htmlFor="variant">Variant</label>
          <select
            name="variant"
            id="variant"
            value={selectedVariant?.id}
            onChange={(e) =>
              setSelectedVariant(
                // @ts-expect-error something about select variants not matching types here
                variants?.find((v) => v?.id === e.target.value)
              )
            }
          >
            {variants?.map((variant) => (
              <option key={variant?.id} value={variant?.id}>
                {variant?.title}
              </option>
            ))}
          </select>
          <div>{JSON.stringify(selectedVariant)}</div>
        </>
      );
    }

    const prod = getProduct({variants: VARIANTS});

    render(
      <ProductOptionsProvider data={prod}>
        <Component />
      </ProductOptionsProvider>,
      {
        wrapper: ShopifyTestProviders,
      }
    );

    expect(
      screen.getByText(JSON.stringify(VARIANTS.nodes?.[0]))
    ).toBeInTheDocument();

    const option = screen.getByRole('option', {
      name: VARIANTS.nodes?.[1]?.title || '',
    });

    await user.selectOptions(screen.getByLabelText('Variant'), [option]);

    expect(
      screen.getByText(JSON.stringify(VARIANTS.nodes?.[1]))
    ).toBeInTheDocument();
  });

  it('allows setSelectedVariant to be called with null to deselect', async () => {
    const user = userEvent.setup();

    function Component() {
      const {selectedVariant, setSelectedVariant} = useProductOptions();

      return (
        <>
          <label htmlFor="variant">Variant</label>
          <button onClick={() => setSelectedVariant(null)}>Unselect</button>
          <div data-testid="selected-variant">
            {JSON.stringify(selectedVariant)}
          </div>
        </>
      );
    }

    render(
      <ProductOptionsProvider data={getProduct({variants: VARIANTS})}>
        <Component />
      </ProductOptionsProvider>,
      {
        wrapper: ShopifyTestProviders,
      }
    );

    expect(screen.getByTestId('selected-variant')).toHaveTextContent(
      JSON.stringify(VARIANTS.nodes?.[0])
    );

    await user.click(screen.getByRole('button'));

    expect(screen.getByTestId('selected-variant').textContent).toBe('null');
  });

  it('provides out of stock helper', async () => {
    const user = userEvent.setup();

    function Component() {
      const {options, setSelectedOption, isOptionInStock} = useProductOptions();

      return (
        <>
          <ul>
            {options?.map((option) => (
              <li key={option?.name}>
                <ul>
                  {option?.values?.map((value) => (
                    <li key={value}>
                      <button
                        onClick={() =>
                          setSelectedOption(option?.name ?? '', value ?? '')
                        }
                      >
                        {`${value}${
                          !isOptionInStock(option?.name ?? '', value ?? '')
                            ? ' (out of stock)'
                            : ''
                        }`}
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </>
      );
    }

    const prod = getProduct({variants: VARIANTS});

    render(
      <ProductOptionsProvider data={prod} initialVariantId="">
        <Component />
      </ProductOptionsProvider>,
      {
        wrapper: ShopifyTestProviders,
      }
    );

    expect(screen.getByRole('button', {name: 'White'})).toBeInTheDocument();
    expect(
      screen.queryByRole('button', {name: 'White (out of stock)'})
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', {name: 'Large'}));

    expect(
      screen.getByRole('button', {name: 'White (out of stock)'})
    ).toBeInTheDocument();
  });

  it('supports selecting a selling plan', async () => {
    const user = userEvent.setup();

    function Component() {
      const {
        setSelectedSellingPlan,
        selectedSellingPlan,
        selectedSellingPlanAllocation,
        sellingPlanGroups,
      } = useProductOptions();

      return (
        <>
          {(sellingPlanGroups ?? []).map((sellingPlanGroup) => {
            return (
              <div key={sellingPlanGroup?.name}>
                <h2>{sellingPlanGroup?.name}</h2>
                <ul>
                  {sellingPlanGroup?.sellingPlans?.map((sellingPlan) => {
                    return (
                      <li key={sellingPlan?.id}>
                        <button
                          // @ts-expect-error could be undefined
                          onClick={() => setSelectedSellingPlan(sellingPlan)}
                        >
                          {sellingPlan?.name}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
          {selectedSellingPlan ? (
            <div data-testid="selectedSellingPlan">
              {JSON.stringify(selectedSellingPlan)}
            </div>
          ) : null}
          {selectedSellingPlanAllocation ? (
            <div data-testid="selectedSellingPlanAllocation">
              {JSON.stringify(selectedSellingPlanAllocation)}
            </div>
          ) : null}
        </>
      );
    }

    const prod = getProduct({
      variants: VARIANTS_WITH_SELLING_PLANS,
      sellingPlanGroups: SELLING_PLAN_GROUPS_CONNECTION,
    });

    render(
      <ProductOptionsProvider
        data={prod}
        initialVariantId={VARIANTS_WITH_SELLING_PLANS.nodes?.[0]?.id}
      >
        <Component />
      </ProductOptionsProvider>,
      {
        wrapper: ShopifyTestProviders,
      }
    );

    expect(screen.queryByTestId('selectedSellingPlan')).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('selectedSellingPlanAllocation')
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', {name: 'Deliver every week'}));

    expect(screen.getByTestId('selectedSellingPlan')).toBeInTheDocument();
    expect(
      screen.getByTestId('selectedSellingPlanAllocation')
    ).toBeInTheDocument();
  });
});
