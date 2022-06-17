import { CartInput } from '../../storefront-api-types';
import { Cart } from './types';
export declare function useCartFetch(): <T, K>({ query, variables, }: {
    query: string;
    variables: T;
}) => Promise<{
    data: K | undefined;
    error: any;
}>;
export declare function useInstantCheckout(): {
    cart: Cart | undefined;
    checkoutUrl: string | undefined;
    error: string | undefined;
    createInstantCheckout: (cartInput: CartInput) => Promise<void>;
};
