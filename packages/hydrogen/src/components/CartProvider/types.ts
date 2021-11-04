import {
  CartInput,
  CartLineInput,
  CartLineUpdateInput,
  MutationCartNoteUpdateArgs,
  CartBuyerIdentityInput,
  MutationCartAttributesUpdateArgs,
} from '../../graphql/types/types';
import {CartFragmentFragment} from './graphql/CartFragment';

export type Status =
  | 'uninitialized'
  | 'fetching'
  | 'creating'
  | 'updating'
  | 'idle';

export interface Cart {
  id?: string;
  lines: CartFragmentFragment['lines']['edges'][1]['node'][];
  checkoutUrl?: string;
  note?: string;
  buyerIdentity?: CartFragmentFragment['buyerIdentity'];
  attributes: CartFragmentFragment['attributes'];
  discountCodes?: CartFragmentFragment['discountCodes'];
  estimatedCost?: CartFragmentFragment['estimatedCost'];
}

export interface CartWithActions extends Cart {
  status: Status;
  error?: string;
  cartCreate: (cart: CartInput) => void;
  linesAdd: (lines: CartLineInput[]) => void;
  linesRemove: (lines: string[]) => void;
  linesUpdate: (lines: CartLineUpdateInput[]) => void;
  noteUpdate: (note: MutationCartNoteUpdateArgs['note']) => void;
  buyerIdentityUpdate: (buyerIdenity: CartBuyerIdentityInput) => void;
  cartAttributesUpdate: (
    attributes: MutationCartAttributesUpdateArgs['attributes']
  ) => void;
  discountCodesUpdate: (discountCodes: string[]) => void;
}

export type State =
  | {status: 'uninitialized'; error?: string}
  | {status: 'fetching'}
  | {status: 'creating'}
  | {status: 'updating'; cart: Cart; lastValidCart: Cart}
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
  | {type: 'resolve'; cart: Cart}
  | {type: 'reject'; error: string}
  | {type: 'resetCart'};
