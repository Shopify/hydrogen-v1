import React from 'react';
import {mount} from '@shopify/react-testing';
import {useProductOptions} from '../useProductOptions';
import {
  SELLING_PLAN_GROUPS_CONNECTION,
  VARIANTS,
  VARIANTS_WITH_SELLING_PLANS,
} from './fixtures';
import {flattenConnection} from '../../../utilities';

describe('useProductOptions', () => {
  it('returns a structured list of options and values', async () => {
    function Component() {
      const {options} = useProductOptions({variants: VARIANTS});

      return <div>{JSON.stringify(options)}</div>;
    }

    const wrapper = await mount(<Component />);

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
      const {options, setSelectedOption, selectedOptions} = useProductOptions({
        variants: VARIANTS,
      });

      return (
        <>
          <ul>
            {options.map((option) => (
              <li key={option.name}>
                <ul>
                  {option.values.map((value) => (
                    <li key={value}>
                      <button
                        onClick={() => setSelectedOption(option.name, value)}
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

    const wrapper = await mount(<Component />);

    expect(wrapper).toContainReactComponent('div', {
      children: JSON.stringify({Color: 'Black', Size: 'Small'}),
    });

    await wrapper.find('button', {children: 'White'})!.trigger('onClick');

    expect(wrapper).toContainReactComponent('div', {
      children: JSON.stringify({Color: 'White', Size: 'Small'}),
    });
  });

  it('computes selected variant based on options', async () => {
    function Component() {
      const {options, setSelectedOption, selectedVariant} = useProductOptions({
        variants: VARIANTS,
      });

      return (
        <>
          <ul>
            {options.map((option) => (
              <li key={option.name}>
                <ul>
                  {option.values.map((value) => (
                    <li key={value}>
                      <button
                        onClick={() => setSelectedOption(option.name, value)}
                      >
                        {value}
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <div>{JSON.stringify(selectedVariant)}</div>
        </>
      );
    }

    const wrapper = await mount(<Component />);

    expect(wrapper).toContainReactComponent('div', {
      children: JSON.stringify(VARIANTS.edges[0].node),
    });

    await wrapper.find('button', {children: 'Black'})!.trigger('onClick');
    await wrapper.find('button', {children: 'Large'})!.trigger('onClick');

    expect(wrapper).toContainReactComponent('div', {
      children: JSON.stringify(VARIANTS.edges[1].node),
    });
  });

  it('computes selected options based on initial selected variant', async () => {
    function Component() {
      const {selectedOptions} = useProductOptions({
        variants: VARIANTS,
        initialVariantId: VARIANTS.edges[0].node.id,
      });

      return <div>{JSON.stringify(selectedOptions)}</div>;
    }

    const wrapper = await mount(<Component />);

    expect(wrapper).toContainReactComponent('div', {
      children: JSON.stringify({Color: 'Black', Size: 'Small'}),
    });
  });

  it('provides list of variants', async () => {
    function Component() {
      const {variants} = useProductOptions({
        variants: VARIANTS,
      });

      return <div>{JSON.stringify(variants)}</div>;
    }

    const wrapper = await mount(<Component />);

    expect(wrapper).toContainReactComponent('div', {
      children: JSON.stringify(flattenConnection(VARIANTS)),
    });
  });

  it('provides setSelectedVariant callback', async () => {
    function Component() {
      const {variants, selectedVariant, setSelectedVariant} = useProductOptions(
        {
          variants: VARIANTS,
        }
      );

      return (
        <>
          <label htmlFor="variant">Variant</label>
          <select
            name="variant"
            id="variant"
            value={selectedVariant?.id}
            onChange={(e) =>
              setSelectedVariant(variants.find((v) => v.id === e.target.value)!)
            }
          >
            {variants.map((variant) => (
              <option key={variant.id} value={variant.id}>
                {variant.title}
              </option>
            ))}
          </select>
          <div>{JSON.stringify(selectedVariant)}</div>
        </>
      );
    }

    const wrapper = await mount(<Component />);

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
      const {options, setSelectedOption, isOptionInStock} = useProductOptions({
        variants: VARIANTS,
      });

      return (
        <>
          <ul>
            {options.map((option) => (
              <li key={option.name}>
                <ul>
                  {option.values.map((value) => (
                    <li key={value}>
                      <button
                        onClick={() => setSelectedOption(option.name, value)}
                      >
                        {`${value}${
                          !isOptionInStock(option.name, value)
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
    const wrapper = await mount(<Component />);

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
      } = useProductOptions({
        variants: VARIANTS_WITH_SELLING_PLANS,
        sellingPlanGroups: SELLING_PLAN_GROUPS_CONNECTION,
        initialVariantId: VARIANTS_WITH_SELLING_PLANS.edges[0].node.id,
      });

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
              <div key={sellingPlanGroup.name}>
                <h2>{sellingPlanGroup.name}</h2>
                <ul>
                  {sellingPlanGroup.sellingPlans.map((sellingPlan) => {
                    return (
                      <li key={sellingPlan.id}>
                        <button
                          onClick={() => setSelectedSellingPlan(sellingPlan)}
                        >
                          {sellingPlan.name}
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

    const wrapper = await mount(<Component />);

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
