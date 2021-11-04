/**
 * Support selling plans. You should display a selling plan selector to a user
 * when a product has selling plans enabled. You need to pass `sellingPlanGroups` to the hook.
 */
import {useProductOptions} from '@shopify/hydrogen';

export function MyComponent() {
  const {
    selectedSellingPlan,
    setSelectedSellingPlan,
    selectedSellingPlanAllocation,
    sellingPlanGroups,
  } = useProductOptions({
    variants: product.variants,
    sellingPlanGroups: product.sellingPlanGroups,
    initialVariantId: product.variants.edges[0].node.id,
  });

  return (
    <>
      {/* Code for your variant selector goes here */}

      {sellingPlanGroups.map((sellingPlanGroup) => (
        <div key={sellingPlanGroup.id}>
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
        </div>
      ))}
    </>
  );
}
