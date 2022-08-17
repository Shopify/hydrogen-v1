import React from 'react';
import {ProductOptionsProvider} from '../ProductOptionsProvider.client.js';
import {mountWithProviders} from '../../../utilities/tests/shopifyMount.js';
import {getProduct} from '../../../utilities/tests/product.js';
import {useProductOptions} from '../../../hooks/useProductOptions/index.js';
import {
  VARIANTS,
  VARIANTS_WITH_SELLING_PLANS,
  SELLING_PLAN_GROUPS_CONNECTION,
} from './fixtures.js';

describe('<ProductOptionsProvider />', () => {
  it('renders its children', () => {
    const Children = () => null;
    const prod = getProduct();
    const productOptionsProvider = mountWithProviders(
      <ProductOptionsProvider data={prod} initialVariantId="">
        <Children />
      </ProductOptionsProvider>
    );

    expect(productOptionsProvider).toContainReactComponent(Children);
  });

  it('returns a structured list of options and values', async () => {
    function Component() {
      const {options} = useProductOptions();
      return <div>{JSON.stringify(options)}</div>;
    }

    const prod = getProduct({variants: VARIANTS});

    const wrapper = await mountWithProviders(
      <ProductOptionsProvider data={prod} initialVariantId="">
        <Component />
      </ProductOptionsProvider>
    );

    expect(wrapper).toContainReactComponent('div', {
      children: JSON.stringify([
        {
          name: 'Color',
          values: ['Black', 'White'],
        },
        {
          name: 'Size',
          values: ['Small', 'Large'],
        },
      ]),
    });
  });

  it('provides setSelectedOption callback', async () => {
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

    const wrapper = await mountWithProviders(
      <ProductOptionsProvider data={prod}>
        <Component />
      </ProductOptionsProvider>
    );

    expect(wrapper).toContainReactComponent('div', {
      children: JSON.stringify({Color: 'Black', Size: 'Small'}),
    });

    await wrapper.find('button', {children: 'White'})?.trigger('onClick');

    expect(wrapper).toContainReactComponent('div', {
      children: JSON.stringify({Color: 'White', Size: 'Small'}),
    });
  });

  it('computes selected options based on initial selected variant', async () => {
    function Component() {
      const {selectedOptions} = useProductOptions();
      return <div>{JSON.stringify(selectedOptions)}</div>;
    }

    const prod = getProduct({
      variants: VARIANTS,
    });

    const wrapper = await mountWithProviders(
      <ProductOptionsProvider
        data={prod}
        initialVariantId={VARIANTS.nodes?.[0]?.id}
      >
        <Component />
      </ProductOptionsProvider>
    );

    expect(wrapper).toContainReactComponent('div', {
      children: JSON.stringify({Color: 'Black', Size: 'Small'}),
    });
  });

  it('provides list of variants', async () => {
    function Component() {
      const {variants} = useProductOptions();
      return <div>{JSON.stringify(variants)}</div>;
    }

    const prod = getProduct({variants: VARIANTS});

    const wrapper = await mountWithProviders(
      <ProductOptionsProvider data={prod} initialVariantId="">
        <Component />
      </ProductOptionsProvider>
    );

    expect(wrapper).toContainReactComponent('div', {
      children: JSON.stringify(VARIANTS.nodes),
    });
  });

  it('provides setSelectedVariant callback', async () => {
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

    const wrapper = await mountWithProviders(
      <ProductOptionsProvider data={prod}>
        <Component />
      </ProductOptionsProvider>
    );

    expect(wrapper).toContainReactComponent('div', {
      children: JSON.stringify(VARIANTS.nodes?.[0]),
    });

    await wrapper
      .find('select', {name: 'variant'})
      ?.trigger('onChange', {target: {value: VARIANTS.nodes?.[1]?.id}});

    expect(wrapper).toContainReactComponent('div', {
      children: JSON.stringify(VARIANTS.nodes?.[1]),
    });
  });

  it('allows setSelectedVariant to be called with null to deselect', async () => {
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

    const wrapper = await mountWithProviders(
      <ProductOptionsProvider data={getProduct({variants: VARIANTS})}>
        <Component />
      </ProductOptionsProvider>
    );

    expect(wrapper).toContainReactComponent('div', {
      children: JSON.stringify(VARIANTS.nodes?.[0]),
    });

    await wrapper.find('button')!.trigger('onClick');

    expect(wrapper).toContainReactComponent('div', {
      children: JSON.stringify(null),
    });
  });

  it('provides out of stock helper', async () => {
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

    const wrapper = await mountWithProviders(
      <ProductOptionsProvider data={prod} initialVariantId="">
        <Component />
      </ProductOptionsProvider>
    );

    expect(wrapper).toContainReactComponentTimes('button', 1, {
      children: 'White',
    });
    expect(wrapper).toContainReactComponentTimes('button', 0, {
      children: 'White (out of stock)',
    });

    await wrapper.find('button', {children: 'Large'})!.trigger('onClick');

    expect(wrapper).toContainReactComponentTimes('button', 1, {
      children: 'White (out of stock)',
    });
  });

  it('supports selecting a selling plan', async () => {
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

    const wrapper = await mountWithProviders(
      <ProductOptionsProvider
        data={prod}
        initialVariantId={VARIANTS_WITH_SELLING_PLANS.nodes?.[0]?.id}
      >
        <Component />
      </ProductOptionsProvider>
    );

    expect(wrapper).toContainReactComponentTimes('div', 0, {
      id: 'selectedSellingPlan',
    });
    expect(wrapper).toContainReactComponentTimes('div', 0, {
      id: 'selectedSellingPlanAllocation',
    });

    await wrapper
      .find('button', {children: 'Deliver every week'})
      ?.trigger('onClick');

    expect(wrapper).toContainReactComponentTimes('div', 1, {
      id: 'selectedSellingPlan',
    });
    expect(wrapper).toContainReactComponentTimes('div', 1, {
      id: 'selectedSellingPlanAllocation',
    });
  });
});
