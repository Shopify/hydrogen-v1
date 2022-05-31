import React from 'react';
import {ProductOptionsContext} from '../context';
import {ProductOptionsProvider} from '../ProductOptionsProvider.client';
import {mountWithProviders} from '../../../utilities/tests/shopifyMount';
import {getProduct} from '../../../utilities/tests/product';
import {useProductOptions} from '../../../hooks/useProductOptions';
import {VARIANTS} from './fixtures';

describe('<ProductOptionsProvider />', () => {
  it('sets up a product context for the provided product options', () => {
    const prod = getProduct();
    const productOptionsProvider = mountWithProviders(
      <ProductOptionsProvider data={prod} initialVariantId="">
        Hello world
      </ProductOptionsProvider>
    );

    expect(productOptionsProvider).toProvideReactContext(
      ProductOptionsContext,
      expect.objectContaining({
        options: expect.any(Object),
        selectedVariant: undefined,
        selectedOptions: expect.any(Object),
        selectedSellingPlan: undefined,
        selectedSellingPlanAllocation: undefined,
        sellingPlanGroups: [],
        setSelectedVariant: expect.any(Function),
        setSelectedOptions: expect.any(Function),
        setSelectedOption: expect.any(Function),
        isOptionInStock: expect.any(Function),
        setSelectedSellingPlan: expect.any(Function),
      })
    );
  });

  it('renders its children', () => {
    const Children = () => null;
    const prod = getProduct();
    const productProvider = mountWithProviders(
      <ProductOptionsProvider data={prod} initialVariantId="">
        <Children />
      </ProductOptionsProvider>
    );

    expect(productProvider).toContainReactComponent(Children);
  });

  it('returns a structured list of options and values', async () => {
    function Component() {
      const {options} = useProductOptions();
      return <div>{JSON.stringify(options)}</div>;
    }

    const prod = getProduct();

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

    const prod = getProduct();

    const wrapper = await mountWithProviders(
      <ProductOptionsProvider data={prod} initialVariantId="">
        <Component />
      </ProductOptionsProvider>
    );

    expect(wrapper).toContainReactComponent('div', {
      children: JSON.stringify({Color: 'Black', Size: 'Small'}),
    });

    await wrapper.find('button', {children: 'White'})!.trigger('onClick');

    expect(wrapper).toContainReactComponent('div', {
      children: JSON.stringify({Color: 'White', Size: 'Small'}),
    });
  });

  it('computes selected options based on initial selected variant', async () => {
    function Component() {
      // const {selectedOptions} = useProductOptions({
      //   variants: VARIANTS,
      //   initialVariantId: VARIANTS.edges[0].node.id,
      // });
      const {selectedOptions} = useProductOptions();
      return <div>{JSON.stringify(selectedOptions)}</div>;
    }

    const prod = getProduct();

    const wrapper = await mountWithProviders(
      <ProductOptionsProvider data={prod} initialVariantId="">
        <Component />
      </ProductOptionsProvider>
    );

    expect(wrapper).toContainReactComponent('div', {
      children: JSON.stringify({Color: 'Black', Size: 'Small'}),
    });
  });

  it('provides list of variants', async () => {
    function Component() {
      // const {variants} = useProductOptions({
      //   variants: VARIANTS,
      // });
      const {variants} = useProductOptions();
      return <div>{JSON.stringify(variants)}</div>;
    }

    const prod = getProduct();

    const wrapper = await mountWithProviders(
      <ProductOptionsProvider data={prod} initialVariantId="">
        <Component />
      </ProductOptionsProvider>
    );

    expect(wrapper).toContainReactComponent('div', {
      children: JSON.stringify(VARIANTS),
    });
  });

  it('provides setSelectedVariant callback', async () => {
    function Component() {
      // const {variants, selectedVariant, setSelectedVariant} = useProductOptions(
      //   {
      //     variants: VARIANTS,
      //   }
      // );
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

    const prod = getProduct();

    const wrapper = await mountWithProviders(
      <ProductOptionsProvider data={prod} initialVariantId="">
        <Component />
      </ProductOptionsProvider>
    );

    expect(wrapper).toContainReactComponent('div', {
      children: JSON.stringify(VARIANTS.edges[0].node),
    });

    await wrapper
      .find('select', {name: 'variant'})!
      .trigger('onChange', {target: {value: VARIANTS.edges[1].node.id}});

    expect(wrapper).toContainReactComponent('div', {
      children: JSON.stringify(VARIANTS.edges[1].node),
    });
  });

  it('provides out of stock helper', async () => {
    function Component() {
      // const {options, setSelectedOption, isOptionInStock} = useProductOptions({
      // variants: VARIANTS,
      // });
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

    const prod = getProduct();

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
      // const {
      //   setSelectedSellingPlan,
      //   selectedSellingPlan,
      //   selectedSellingPlanAllocation,
      //   sellingPlanGroups,
      // } = useProductOptions({
      //   variants: VARIANTS_WITH_SELLING_PLANS,
      //   sellingPlanGroups: SELLING_PLAN_GROUPS_CONNECTION,
      //   initialVariantId: VARIANTS_WITH_SELLING_PLANS.edges[0].node.id,
      // });
      const {
        setSelectedSellingPlan,
        selectedSellingPlan,
        selectedSellingPlanAllocation,
        sellingPlanGroups,
      } = useProductOptions();

      const selectSellingPlanMarkup = selectedSellingPlan ? (
        <div id="selectedSellingPlan">
          {JSON.stringify(selectedSellingPlan)}
        </div>
      ) : null;
      const selectedSellingPlanAllocationMarkup =
        selectedSellingPlanAllocation ? (
          <div id="selectedSellingPlanAllocation">
            {JSON.stringify(selectedSellingPlanAllocation)}
          </div>
        ) : null;

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
          {selectSellingPlanMarkup}
          {selectedSellingPlanAllocationMarkup}
        </>
      );
    }

    const prod = getProduct();

    const wrapper = await mountWithProviders(
      <ProductOptionsProvider data={prod} initialVariantId="">
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
      .find('button', {children: 'Deliver every week'})!
      .trigger('onClick');

    expect(wrapper).toContainReactComponentTimes('div', 1, {
      id: 'selectedSellingPlan',
    });
    expect(wrapper).toContainReactComponentTimes('div', 1, {
      id: 'selectedSellingPlanAllocation',
    });
  });
});
