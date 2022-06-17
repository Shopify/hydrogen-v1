import {
  useCart,
  useCartLine,
  CartLineQuantityAdjustButton,
  CartLinePrice,
  CartLineQuantity,
  Image,
  Link,
} from '@shopify/hydrogen';

import {Heading, IconRemove, Text} from '~/components';

export function CartLineItem() {
  const {linesRemove} = useCart();
  const {id: lineId, quantity, merchandise} = useCartLine();

  return (
    <li key={lineId} className="flex">
      <div className="flex-shrink-0">
        {/* TODO: Fix type */}
        <Image
          data={merchandise.image}
          className="object-cover object-center w-24 h-24 border rounded md:w-28 md:h-28"
        />
      </div>

      <div className="flex justify-between flex-1 ml-4 sm:ml-6">
        <div className="relative grid gap-1">
          <Heading as="h3" size="copy">
            <Link to={`/products/${merchandise.product.handle}`}>
              {merchandise.product.title}
            </Link>
          </Heading>

          <div className="flex flex-col justify-start mt-2">
            {(merchandise?.selectedOptions || []).map((option) => (
              <Text color="subtle" key={option.name} className="last:mb-4">
                {option.name}: {option.value}
              </Text>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-auto">
            <div className="flex justify-start text-copy mr-4">
              <CartLineQuantityAdjust
                lineId={lineId}
                quantity={quantity}
                linesRemove={linesRemove}
              />
            </div>
            <button
              type="button"
              onClick={() => linesRemove(lineId)}
              className="h-[40px] w-[40px] border rounded flex justify-center items-center"
            >
              <span className="sr-only">Remove</span>
              <IconRemove
                viewBox="0 0 13 14"
                className="w-[13px] h-[14px]"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
        <Text>
          <CartLinePrice as="span" />
        </Text>
      </div>
    </li>
  );
}

function CartLineQuantityAdjust({
  lineId,
  quantity,
}: {
  lineId: string;
  quantity: number;
}) {
  return (
    <>
      <label htmlFor={`quantity-${lineId}`} className="sr-only">
        Quantity, {quantity}
      </label>
      <div className="flex items-center overflow-auto border rounded">
        <CartLineQuantityAdjustButton
          adjust="decrease"
          aria-label="Decrease quantity"
          className="h-[40px] flex justify-center items-center px-3 py-[0.125rem] transition text-primary/40 hover:text-primary disabled:pointer-events-all disabled:cursor-wait"
        >
          &#8722;
        </CartLineQuantityAdjustButton>
        <CartLineQuantity
          as="div"
          className="h-[40px] flex justify-center items-center text-center py-[0.125rem] px-2 text-primary/90"
        />
        <CartLineQuantityAdjustButton
          adjust="increase"
          aria-label="Increase quantity"
          className="h-[40px] flex justify-center items-center px-3 py-[0.125rem] transition text-primary/40 hover:text-primary disabled:pointer-events-all disabled:cursor-wait"
        >
          &#43;
        </CartLineQuantityAdjustButton>
      </div>
    </>
  );
}
