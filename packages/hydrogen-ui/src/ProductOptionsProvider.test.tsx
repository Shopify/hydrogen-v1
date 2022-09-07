import * as React from 'react';
import {
  ProductOptionsProvider,
  useProductOptions,
} from './ProductOptionsProvider.js';
import {
  getProduct,
  VARIANTS,
  VARIANTS_WITH_SELLING_PLANS,
  SELLING_PLAN_GROUPS_CONNECTION,
} from './ProductOptionsProvider.test.helpers.js';
import {render, screen, renderHook} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('<ProductOptionsProvider />', () => {
  it('renders its children', () => {
    const prod = getProduct();
    render(
      <ProductOptionsProvider data={prod} initialVariantId="">
        <span>Hello world</span>
      </ProductOptionsProvider>
    );

    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('returns a structured list of options and values', () => {
    const {result} = renderHook(() => useProductOptions(), {
      wrapper: ({children}) => (
        <ProductOptionsProvider data={getProduct({variants: VARIANTS})}>
          {children}
        </ProductOptionsProvider>
      ),
    });

    expect(result.current.options).toEqual([
      {
        name: 'Color',
        values: ['Black', 'White'],
      },
      {
        name: 'Size',
        values: ['Small', 'Large'],
      },
    ]);
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

    await user.click(screen.getByRole('button', {name: 'White'}));

    expect(
      await screen.findByText(JSON.stringify({Color: 'White', Size: 'Small'}))
    ).toBeInTheDocument();
  });

  it('computes selected options based on initial selected variant', async () => {
    const prod = getProduct({
      variants: VARIANTS,
    });

    const {result} = renderHook(() => useProductOptions(), {
      wrapper: ({children}) => (
        <ProductOptionsProvider
          data={prod}
          initialVariantId={VARIANTS.nodes?.[0]?.id}
        >
          {children}
        </ProductOptionsProvider>
      ),
    });

    expect(result.current.selectedOptions).toEqual({
      Color: 'Black',
      Size: 'Small',
    });
  });

  it('provides list of variants', async () => {
    const prod = getProduct({variants: VARIANTS});

    const {result} = renderHook(() => useProductOptions(), {
      wrapper: ({children}) => (
        <ProductOptionsProvider
          data={prod}
          initialVariantId={VARIANTS.nodes?.[0]?.id}
        >
          {children}
        </ProductOptionsProvider>
      ),
    });

    expect(result.current.variants).toEqual(VARIANTS.nodes);
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
            onChange={(e) => {
              console.log(e.target.value);
              setSelectedVariant(
                variants?.find((v) => v?.id === e.target.value) ?? null
              );
            }}
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
      </ProductOptionsProvider>
    );

    expect(
      screen.getByText(JSON.stringify(VARIANTS.nodes?.[0]))
    ).toBeInTheDocument();

    await user.selectOptions(screen.getByRole('listbox'), [
      VARIANTS.nodes?.[1]?.id ?? '',
    ]);

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
          <div>{JSON.stringify(selectedVariant)}</div>
        </>
      );
    }

    render(
      <ProductOptionsProvider data={getProduct({variants: VARIANTS})}>
        <Component />
      </ProductOptionsProvider>
    );

    expect(
      screen.getByText(JSON.stringify(VARIANTS.nodes?.[0]))
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button'));

    expect(screen.getByText('null')).toBeInTheDocument();
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
      </ProductOptionsProvider>
    );

    expect(screen.getAllByRole('button', {name: 'White'}).length).toBe(1);
    expect(
      screen.queryAllByRole('button', {name: 'White (out of stock)'}).length
    ).toBe(0);

    await user.click(screen.getByRole('button', {name: 'Large'}));

    expect(
      screen.queryAllByRole('button', {name: 'White (out of stock)'}).length
    ).toBe(1);
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
            <div id="selectedSellingPlan">
              {JSON.stringify(selectedSellingPlan)}
            </div>
          ) : null}
          {selectedSellingPlanAllocation ? (
            <div id="selectedSellingPlanAllocation">
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

    const {container} = render(
      <ProductOptionsProvider
        data={prod}
        initialVariantId={VARIANTS_WITH_SELLING_PLANS.nodes?.[0]?.id}
      >
        <Component />
      </ProductOptionsProvider>
    );

    expect(
      container.querySelector('#selectedSellingPlan')
    ).toBeEmptyDOMElement();
    expect(
      container.querySelector('#selectedSellingPlanAllocation')
    ).toBeEmptyDOMElement();

    await user.click(screen.getByRole('button', {name: 'Deliver every week'}));

    expect(
      container.querySelector('#selectedSellingPlan')
    ).not.toBeEmptyDOMElement();
    expect(
      container.querySelector('#selectedSellingPlanAllocation')
    ).not.toBeEmptyDOMElement();
  });
});
