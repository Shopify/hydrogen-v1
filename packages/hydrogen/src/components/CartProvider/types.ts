import {
  CartInput,
  CartLineInput,
  CartLineUpdateInput,
  MutationCartNoteUpdateArgs,
  CartBuyerIdentityInput,
  MutationCartAttributesUpdateArgs,
} from '../../storefront-api-types.js';
import {CartFragmentFragment} from './graphql/CartFragment.js';
import {StateMachine} from '@xstate/fsm';

export type Status = State['status'];

export interface Cart {
  /** The cart's ID if it has been created through the Storefront API. */
  id?: string;
  /** The cart lines. */
  lines: CartFragmentFragment['lines']['edges'][1]['node'][];
  /** The checkout URL for the cart, if the cart has been created in the Storefront API. */
  checkoutUrl?: string;
  /** The cart's note. */
  note?: string;
  /** The cart's buyer identity. */
  buyerIdentity?: CartFragmentFragment['buyerIdentity'];
  /** The cart's attributes. */
  attributes: CartFragmentFragment['attributes'];
  /** The discount codes applied to the cart. */
  discountCodes?: CartFragmentFragment['discountCodes'];
  /** The cost for the cart, including the subtotal, total, taxes, and duties. */
  cost?: CartFragmentFragment['cost'];
  /** The total number of items in the cart, across all lines. If there are no lines, then the value is 0. */
  totalQuantity: number;
}

export interface CartWithActions extends Cart {
  /** The status of the cart. This returns 'uninitialized' when the cart is not yet created, `creating` when the cart is being created, `fetching` when an existing cart is being fetched, `updating` when the cart is updating, and `idle` when the cart isn't being created or updated. */
  status: Status;
  /** If an error occurred on the previous cart action, then `error` will exist and `cart` will be put back into the last valid status it was in. */
  error?: string;
  /** A callback that creates a cart. Expects the same input you would provide to the Storefront API's `cartCreate` mutation. */
  cartCreate: (cart: CartInput) => void;
  /** A callback that adds lines to the cart. Expects the same `lines` input that you would provide to the Storefront API's `cartLinesAdd` mutation. If a cart doesn't already exist, then it will create the cart for you. */
  linesAdd: (lines: CartLineInput[]) => void;
  /** A callback that removes lines from the cart. Expects the same `lines` input that you would provide to the Storefront API's `cartLinesRemove` mutation. Only lines that are included in the `lines` parameter will be in the cart afterwards. */
  linesRemove: (lines: string[]) => void;
  /** A callback that updates lines in the cart. Expects the same `lines` input that you would provide to the Storefront API's `cartLinesUpdate` mutation. If a line item is not included in the `lines` parameter, it will still exist in the cart and will not be changed. */
  linesUpdate: (lines: CartLineUpdateInput[]) => void;
  /** A callback that updates the note in the cart. Expects the same `note` input that you would provide to the Storefront API's `cartNoteUpdate` mutation. */
  noteUpdate: (note: MutationCartNoteUpdateArgs['note']) => void;
  /** A callback that updates the buyer identity in the cart. Expects the same `buyerIdentity` input that you would provide to the Storefront API's `cartBuyerIdentityUpdate` mutation. */
  buyerIdentityUpdate: (buyerIdenity: CartBuyerIdentityInput) => void;
  /** A callback that updates the cart attributes. Expects the same `attributes` input that you would provide to the Storefront API's `cartAttributesUpdate` mutation. */
  cartAttributesUpdate: (
    attributes: MutationCartAttributesUpdateArgs['attributes']
  ) => void;
  /** A callback that updates the cart's discount codes. Expects the same `codes` input that you would provide to the Storefront API's `cartDiscountCodesUpdate` mutation. */
  discountCodesUpdate: (discountCodes: string[]) => void;
  /** The total number of items in the cart, across all lines. If there are no lines, then the value is 0. */
  totalQuantity: number;
  /** The fragment used to query the cart object for all queries and mutations. */
  cartFragment: string;
}

export type State =
  /** A cart has not been created yet, or an error occurred when a cart was attempting to be created or fetched. */
  | {status: 'uninitialized'; error?: string}
  /** An existing cart is being fetched from the Storefront API. */
  | {status: 'fetching'}
  /** A new cart is being created through the Storefront API. */
  | {status: 'creating'}
  /** The cart is in the process of being updated. */
  | {status: 'updating'; cart: Cart; lastValidCart: Cart}
  /** The cart has been created and no action is currently happening. */
  | {status: 'idle'; cart: Cart; error?: string};

export type CartAction =
  | {type: 'cartFetch'}
  | {type: 'cartCreate'}
  | {type: 'addLineItem'}
  | {type: 'removeLineItem'; lines: string[]}
  | {type: 'updateLineItem'; lines: CartLineUpdateInput[]}
  | {type: 'noteUpdate'}
  | {type: 'buyerIdentityUpdate'}
  | {type: 'cartAttributesUpdate'}
  | {type: 'discountCodesUpdate'}
  | {type: 'resolve'; cart: Cart; rawCartResult?: CartFragmentFragment}
  | {type: 'reject'; errors: any}
  | {type: 'resetCart'};

// CartProvider V2

// State Machine types
export type CartMachineContext = {
  cart?: Cart;
  lastValidCart?: Cart;
  rawCartResult?: CartFragmentFragment;
  prevCart?: Cart;
  errors?: any;
};

export type CartFetchEvent = {
  type: 'CART_FETCH';
  payload: {
    cartId: string;
  };
};

export type CartCreateEvent = {
  type: 'CART_CREATE';
  payload: CartInput;
};

export type CartSetEvent = {
  type: 'CART_SET';
  payload: {
    cart: CartFragmentFragment;
  };
};

export type CartLineAddEvent = {
  type: 'CARTLINE_ADD';
  payload: {
    lines: CartLineInput[];
  };
};

export type CartLineRemoveEvent = {
  type: 'CARTLINE_REMOVE';
  payload: {
    lines: string[];
  };
};

export type CartLineUpdateEvent = {
  type: 'CARTLINE_UPDATE';
  payload: {
    lines: CartLineUpdateInput[];
  };
};

export type NoteUpdateEvent = {
  type: 'NOTE_UPDATE';
  payload: {
    note: MutationCartNoteUpdateArgs['note'];
  };
};

export type BuyerIdentityUpdateEvent = {
  type: 'BUYER_IDENTITY_UPDATE';
  payload: {
    buyerIdentity: CartBuyerIdentityInput;
  };
};

export type CartAttributesUpdateEvent = {
  type: 'CART_ATTRIBUTES_UPDATE';
  payload: {
    attributes: MutationCartAttributesUpdateArgs['attributes'];
  };
};

export type DiscountCodesUpdateEvent = {
  type: 'DISCOUNT_CODES_UPDATE';
  payload: {
    discountCodes: string[];
  };
};

export type CartMachineActionEvent =
  | CartFetchEvent
  | CartCreateEvent
  | CartSetEvent
  | CartLineAddEvent
  | CartLineRemoveEvent
  | CartLineUpdateEvent
  | NoteUpdateEvent
  | BuyerIdentityUpdateEvent
  | CartAttributesUpdateEvent
  | DiscountCodesUpdateEvent;

export type CartMachineFetchResultEvent =
  | {type: 'CART_COMPLETED'; payload: {cartActionEvent: CartMachineActionEvent}}
  | {
      type: 'RESOLVE';
      payload: {
        cartActionEvent: CartMachineActionEvent;
        cart: Cart;
        rawCartResult: CartFragmentFragment;
      };
    }
  | {
      type: 'ERROR';
      payload: {cartActionEvent: CartMachineActionEvent; errors: any};
    };

export type CartMachineEvent =
  | CartMachineActionEvent
  | CartMachineFetchResultEvent;

export type CartMachineTypeState =
  | {
      value: 'uninitialized';
      context: CartMachineContext & {
        cart: undefined;
        lastValidCart: undefined;
        prevCart: undefined;
        errors?: any;
      };
    }
  | {
      value: 'initializationError';
      context: CartMachineContext & {
        cart: undefined;
        lastValidCart: undefined;
        prevCart: undefined;
        errors: any;
      };
    }
  | {
      value: 'cartCompleted';
      context: CartMachineContext & {
        cart: undefined;
        prevCart?: Cart;
        lastValidCart: undefined;
        errors: any;
      };
    }
  | {
      value: 'idle';
      context: CartMachineContext & {
        cart: Cart;
        prevCart?: Cart;
        lastValidCart?: Cart;
        errors?: any;
      };
    }
  | {
      value: 'error';
      context: CartMachineContext & {
        cart?: Cart;
        prevCart?: Cart;
        lastValidCart?: Cart;
        errors: any;
      };
    }
  | {value: 'cartFetching'; context: CartMachineContext}
  | {value: 'cartCreating'; context: CartMachineContext}
  | {value: 'cartLineRemoving'; context: CartMachineContext}
  | {value: 'cartLineUpdating'; context: CartMachineContext}
  | {value: 'cartLineAdding'; context: CartMachineContext}
  | {value: 'noteUpdating'; context: CartMachineContext}
  | {value: 'buyerIdentityUpdating'; context: CartMachineContext}
  | {value: 'cartAttributesUpdating'; context: CartMachineContext}
  | {value: 'discountCodesUpdating'; context: CartMachineContext};

export type CartMachineAction = StateMachine.ActionFunction<
  CartMachineContext,
  CartMachineEvent
>;

export type CartMachineActions = {
  cartFetchAction: CartMachineAction;
  cartCreateAction: CartMachineAction;
  cartLineRemoveAction: CartMachineAction;
  cartLineUpdateAction: CartMachineAction;
  cartLineAddAction: CartMachineAction;
  noteUpdateAction: CartMachineAction;
  buyerIdentityUpdateAction: CartMachineAction;
  cartAttributesUpdateAction: CartMachineAction;
  discountCodesUpdateAction: CartMachineAction;
  onCartActionEntry?: CartMachineAction;
  onCartActionOptimisticUI?: StateMachine.AssignActionObject<
    CartMachineContext,
    CartMachineEvent
  >;
  onCartActionComplete?: CartMachineAction;
};
