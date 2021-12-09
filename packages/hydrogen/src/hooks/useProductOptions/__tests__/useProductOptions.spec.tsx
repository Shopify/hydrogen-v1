import React from 'react';
import {screen, render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {useProductOptions} from '../useProductOptions';
import {
  SELLING_PLAN_GROUPS_CONNECTION,
  VARIANTS,
  VARIANTS_WITH_SELLING_PLANS,
} from './fixtures';
import {flattenConnection} from '../../../utilities';

it('returns a structured list of options and values', () => {
  function Component() {
    const {options} = useProductOptions({variants: VARIANTS});

    return <div data-testid="value">{JSON.stringify(options)}</div>;
  }

  render(<Component />);

  const value = JSON.parse(screen.getByTestId('value').innerHTML);

  expect(value).toEqual([
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

it('provides setSelectedOption callback', () => {
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
        <div data-testid="value">{JSON.stringify(selectedOptions)}</div>
      </>
    );
  }

  render(<Component />);

  const value = () => JSON.parse(screen.getByTestId('value').innerHTML);
  expect(value()).toEqual({});

  userEvent.click(screen.getByText('Black'));
  expect(value()).toEqual({Color: 'Black'});
});

it('computes selected variant based on options', () => {
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
        <div data-testid="value">{JSON.stringify(selectedVariant)}</div>
      </>
    );
  }

  render(<Component />);

  const value = () => JSON.parse(screen.getByTestId('value').innerHTML || null);
  expect(value()).toEqual(null);

  userEvent.click(screen.getByText('Black'));
  userEvent.click(screen.getByText('Large'));

  expect(value()).toEqual(VARIANTS.edges[1].node);
});

it('computes selected options based on initial selected variant', () => {
  function Component() {
    const {selectedOptions} = useProductOptions({
      variants: VARIANTS,
      initialVariantId: VARIANTS.edges[0].node.id,
    });

    return <div data-testid="value">{JSON.stringify(selectedOptions)}</div>;
  }

  render(<Component />);

  const value = () => JSON.parse(screen.getByTestId('value').innerHTML || null);
  expect(value()).toEqual({Color: 'Black', Size: 'Small'});
});

it('provides list of variants', () => {
  function Component() {
    const {variants} = useProductOptions({
      variants: VARIANTS,
    });

    return <div data-testid="value">{JSON.stringify(variants)}</div>;
  }

  render(<Component />);

  const value = () => JSON.parse(screen.getByTestId('value').innerHTML || null);
  expect(value()).toEqual(flattenConnection(VARIANTS));
});

it('provides setSelectedVariant callback', () => {
  function Component() {
    const {variants, selectedVariant, setSelectedVariant} = useProductOptions({
      variants: VARIANTS,
    });

    return (
      <>
        <label htmlFor="variant">Variant</label>
        <select
          name="variant"
          id="variant"
          value={selectedVariant?.id}
          onChange={(e) =>
            setSelectedVariant(variants.find((v) => v.id === e.target.value))
          }
        >
          {variants.map((variant) => (
            <option key={variant.id} value={variant.id}>
              {variant.title}
            </option>
          ))}
        </select>
        <div data-testid="value">{JSON.stringify(selectedVariant)}</div>
      </>
    );
  }

  render(<Component />);

  const value = () => JSON.parse(screen.getByTestId('value').innerHTML || null);
  expect(value()).toEqual(null);

  userEvent.selectOptions(
    screen.getByLabelText('Variant'),
    VARIANTS.edges[1].node.id
  );
  expect(value()).toEqual(VARIANTS.edges[1].node);
});

it('provides out of stock helper', () => {
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
                      {value}{' '}
                      {!isOptionInStock(option.name, value) && '(out of stock)'}
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

  render(<Component />);

  expect(screen.getByText('White')).toBeInTheDocument();
  expect(screen.queryByText('White (out of stock)')).not.toBeInTheDocument();

  userEvent.click(screen.getByText('Large'));
  expect(screen.getByText('White (out of stock)')).toBeInTheDocument();
});

it('supports selecting a selling plan', () => {
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

    return (
      <>
        {(sellingPlanGroups ?? []).map((sellingPlanGroup) => (
          <React.Fragment key={sellingPlanGroup.name}>
            <h2>{sellingPlanGroup.name}</h2>
            <ul>
              {sellingPlanGroup.sellingPlans.map((sellingPlan) => {
                return (
                  <li key={sellingPlan.id}>
                    <button onClick={() => setSelectedSellingPlan(sellingPlan)}>
                      {sellingPlan.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </React.Fragment>
        ))}
        <div data-testid="selectedSellingPlan">
          {JSON.stringify(selectedSellingPlan)}
        </div>
        <div data-testid="selectedSellingPlanAllocation">
          {JSON.stringify(selectedSellingPlanAllocation)}
        </div>
      </>
    );
  }

  render(<Component />);

  const selectedSellingPlan = () =>
    JSON.parse(screen.getByTestId('selectedSellingPlan').innerHTML || null);
  const selectedSellingPlanAllocation = () =>
    JSON.parse(
      screen.getByTestId('selectedSellingPlanAllocation').innerHTML || null
    );

  expect(selectedSellingPlan()).toBeNull();
  expect(selectedSellingPlanAllocation()).toBeNull();

  userEvent.click(screen.getByText('Deliver every week'));

  expect(selectedSellingPlan()).toEqual(
    SELLING_PLAN_GROUPS_CONNECTION.edges[0].node.sellingPlans.edges[0].node
  );
  expect(selectedSellingPlanAllocation()).toEqual(
    VARIANTS_WITH_SELLING_PLANS.edges[0].node.sellingPlanAllocations.edges[0]
      .node
  );
});
