import React, { useEffect, useCallback, useReducer, useMemo, useRef, } from 'react';
import { flattenConnection } from '../../utilities/flattenConnection';
import { CartLineAdd, CartCreate, CartLineRemove, CartLineUpdate, CartNoteUpdate, CartBuyerIdentityUpdate, CartAttributesUpdate, CartDiscountCodesUpdate, CartQuery, defaultCartFragment, } from './cart-queries';
import { CountryCode, } from '../../storefront-api-types';
import { useCartFetch } from './hooks.client';
import { CartContext } from './context';
import { CART_ID_STORAGE_KEY } from './constants';
import { ClientAnalytics } from '../../foundation/Analytics/ClientAnalytics';
function cartReducer(state, action) {
    switch (action.type) {
        case 'cartFetch': {
            if (state.status === 'uninitialized') {
                return {
                    status: 'fetching',
                };
            }
            break;
        }
        case 'cartCreate': {
            if (state.status === 'uninitialized') {
                return {
                    status: 'creating',
                };
            }
            break;
        }
        case 'resolve': {
            const resolvableStatuses = ['updating', 'fetching', 'creating'];
            if (resolvableStatuses.includes(state.status)) {
                return {
                    status: 'idle',
                    cart: action.cart,
                };
            }
            break;
        }
        case 'reject': {
            if (state.status === 'fetching' || state.status === 'creating') {
                return { status: 'uninitialized', error: action.error };
            }
            else if (state.status === 'updating') {
                return {
                    status: 'idle',
                    cart: state.lastValidCart,
                    error: action.error,
                };
            }
            break;
        }
        case 'resetCart': {
            if (state.status === 'fetching') {
                return { status: 'uninitialized' };
            }
            break;
        }
        case 'addLineItem': {
            if (state.status === 'idle') {
                return {
                    status: 'updating',
                    cart: state.cart,
                    lastValidCart: state.cart,
                };
            }
            break;
        }
        case 'removeLineItem': {
            if (state.status === 'idle') {
                return {
                    status: 'updating',
                    cart: {
                        ...state.cart,
                        lines: state.cart.lines.filter(({ id }) => !action.lines.includes(id)),
                    },
                    lastValidCart: state.cart,
                };
            }
            break;
        }
        case 'updateLineItem': {
            if (state.status === 'idle') {
                return {
                    status: 'updating',
                    cart: {
                        ...state.cart,
                        lines: state.cart.lines.map((line) => {
                            const updatedLine = action.lines.find(({ id }) => id === line.id);
                            if (updatedLine && updatedLine.quantity) {
                                return {
                                    ...line,
                                    quantity: updatedLine.quantity,
                                };
                            }
                            return line;
                        }),
                    },
                    lastValidCart: state.cart,
                };
            }
            break;
        }
        case 'noteUpdate': {
            if (state.status === 'idle') {
                return {
                    status: 'updating',
                    cart: state.cart,
                    lastValidCart: state.cart,
                };
            }
            break;
        }
        case 'buyerIdentityUpdate': {
            if (state.status === 'idle') {
                return {
                    status: 'updating',
                    cart: state.cart,
                    lastValidCart: state.cart,
                };
            }
            break;
        }
        case 'cartAttributesUpdate': {
            if (state.status === 'idle') {
                return {
                    status: 'updating',
                    cart: state.cart,
                    lastValidCart: state.cart,
                };
            }
            break;
        }
        case 'discountCodesUpdate': {
            if (state.status === 'idle') {
                return {
                    status: 'updating',
                    cart: state.cart,
                    lastValidCart: state.cart,
                };
            }
            break;
        }
    }
    throw new Error(`Cannot dispatch event (${action.type}) for current cart state (${state.status})`);
}
/**
 * The `CartProvider` component creates a context for using a cart. It creates a cart object and callbacks
 * that can be accessed by any descendent component using the `useCart` hook and related hooks. It also carries out
 * any callback props when a relevant action is performed. For example, if a `onLineAdd` callback is provided,
 * then the callback will be called when a new line item is successfully added to the cart.
 *
 * The `CartProvider` component must be a descendent of the `ShopifyProvider` component.
 * You must use this component if you want to use the `useCart` hook or related hooks, or if you would like to use the `AddToCartButton` component.
 */
export function CartProvider({ children, numCartLines, onCreate, onLineAdd, onLineRemove, onLineUpdate, onNoteUpdate, onBuyerIdentityUpdate, onAttributesUpdate, onDiscountCodesUpdate, data: cart, cartFragment = defaultCartFragment, customerAccessToken, countryCode = CountryCode.Us, }) {
    const initialStatus = cart
        ? { status: 'idle', cart: cartFromGraphQL(cart) }
        : { status: 'uninitialized' };
    const [state, dispatch] = useReducer((state, dispatch) => cartReducer(state, dispatch), initialStatus);
    const fetchCart = useCartFetch();
    const countryChanged = state.status === 'idle' &&
        countryCode !== state?.cart?.buyerIdentity?.countryCode;
    const cartFetch = useCallback(async (cartId) => {
        dispatch({ type: 'cartFetch' });
        const { data } = await fetchCart({
            query: CartQuery(cartFragment),
            variables: {
                id: cartId,
                numCartLines,
                country: countryCode,
            },
        });
        if (!data?.cart) {
            window.localStorage.removeItem(CART_ID_STORAGE_KEY);
            dispatch({ type: 'resetCart' });
            return;
        }
        dispatch({ type: 'resolve', cart: cartFromGraphQL(data.cart) });
    }, [fetchCart, cartFragment, numCartLines, countryCode]);
    const cartCreate = useCallback(async (cart) => {
        dispatch({ type: 'cartCreate' });
        onCreate?.();
        if (countryCode && !cart.buyerIdentity?.countryCode) {
            if (cart.buyerIdentity == null) {
                cart.buyerIdentity = {};
            }
            cart.buyerIdentity.countryCode = countryCode;
        }
        if (customerAccessToken && !cart.buyerIdentity?.customerAccessToken) {
            if (cart.buyerIdentity == null) {
                cart.buyerIdentity = {};
            }
            cart.buyerIdentity.customerAccessToken = customerAccessToken;
        }
        const { data, error } = await fetchCart({
            query: CartCreate(cartFragment),
            variables: {
                input: cart,
                numCartLines,
                country: countryCode,
            },
        });
        if (error) {
            dispatch({
                type: 'reject',
                error,
            });
        }
        if (data?.cartCreate?.cart) {
            if (cart.lines) {
                ClientAnalytics.publish(ClientAnalytics.eventNames.ADD_TO_CART, true, {
                    addedCartLines: cart.lines,
                    cart: data.cartCreate.cart,
                });
            }
            dispatch({
                type: 'resolve',
                cart: cartFromGraphQL(data.cartCreate.cart),
            });
            window.localStorage.setItem(CART_ID_STORAGE_KEY, data.cartCreate.cart.id);
        }
    }, [
        onCreate,
        countryCode,
        fetchCart,
        cartFragment,
        numCartLines,
        customerAccessToken,
    ]);
    const addLineItem = useCallback(async (lines, state) => {
        if (state.status === 'idle') {
            dispatch({ type: 'addLineItem' });
            onLineAdd?.();
            const { data, error } = await fetchCart({
                query: CartLineAdd(cartFragment),
                variables: {
                    cartId: state.cart.id,
                    lines,
                    numCartLines,
                    country: countryCode,
                },
            });
            if (error) {
                dispatch({
                    type: 'reject',
                    error,
                });
            }
            if (data?.cartLinesAdd?.cart) {
                ClientAnalytics.publish(ClientAnalytics.eventNames.ADD_TO_CART, true, {
                    addedCartLines: lines,
                    cart: data.cartLinesAdd.cart,
                });
                dispatch({
                    type: 'resolve',
                    cart: cartFromGraphQL(data.cartLinesAdd.cart),
                });
            }
        }
    }, [onLineAdd, fetchCart, cartFragment, numCartLines, countryCode]);
    const removeLineItem = useCallback(async (lines, state) => {
        if (state.status === 'idle') {
            dispatch({ type: 'removeLineItem', lines });
            onLineRemove?.();
            const { data, error } = await fetchCart({
                query: CartLineRemove(cartFragment),
                variables: {
                    cartId: state.cart.id,
                    lines,
                    numCartLines,
                    country: countryCode,
                },
            });
            if (error) {
                dispatch({
                    type: 'reject',
                    error,
                });
            }
            if (data?.cartLinesRemove?.cart) {
                ClientAnalytics.publish(ClientAnalytics.eventNames.REMOVE_FROM_CART, true, {
                    removedCartLines: lines,
                    cart: data.cartLinesRemove.cart,
                });
                dispatch({
                    type: 'resolve',
                    cart: cartFromGraphQL(data.cartLinesRemove.cart),
                });
            }
        }
    }, [onLineRemove, fetchCart, cartFragment, numCartLines, countryCode]);
    const updateLineItem = useCallback(async (lines, state) => {
        if (state.status === 'idle') {
            dispatch({ type: 'updateLineItem', lines });
            onLineUpdate?.();
            const { data, error } = await fetchCart({
                query: CartLineUpdate(cartFragment),
                variables: {
                    cartId: state.cart.id,
                    lines,
                    numCartLines,
                    country: countryCode,
                },
            });
            if (error) {
                dispatch({
                    type: 'reject',
                    error,
                });
            }
            if (data?.cartLinesUpdate?.cart) {
                ClientAnalytics.publish(ClientAnalytics.eventNames.UPDATE_CART, true, {
                    updatedCartLines: lines,
                    oldCart: state.cart,
                });
                dispatch({
                    type: 'resolve',
                    cart: cartFromGraphQL(data.cartLinesUpdate.cart),
                });
            }
        }
    }, [onLineUpdate, fetchCart, cartFragment, numCartLines, countryCode]);
    const noteUpdate = useCallback(async (note, state) => {
        if (state.status === 'idle') {
            dispatch({ type: 'noteUpdate' });
            onNoteUpdate?.();
            const { data, error } = await fetchCart({
                query: CartNoteUpdate(cartFragment),
                variables: {
                    cartId: state.cart.id,
                    note,
                    numCartLines,
                    country: countryCode,
                },
            });
            if (error) {
                dispatch({
                    type: 'reject',
                    error,
                });
            }
            if (data?.cartNoteUpdate?.cart) {
                dispatch({
                    type: 'resolve',
                    cart: cartFromGraphQL(data.cartNoteUpdate.cart),
                });
            }
        }
    }, [onNoteUpdate, fetchCart, cartFragment, numCartLines, countryCode]);
    const buyerIdentityUpdate = useCallback(async (buyerIdentity, state) => {
        if (state.status === 'idle') {
            dispatch({ type: 'buyerIdentityUpdate' });
            onBuyerIdentityUpdate?.();
            const { data, error } = await fetchCart({
                query: CartBuyerIdentityUpdate(cartFragment),
                variables: {
                    cartId: state.cart.id,
                    buyerIdentity,
                    numCartLines,
                    country: countryCode,
                },
            });
            if (error) {
                dispatch({
                    type: 'reject',
                    error,
                });
            }
            if (data?.cartBuyerIdentityUpdate?.cart) {
                dispatch({
                    type: 'resolve',
                    cart: cartFromGraphQL(data.cartBuyerIdentityUpdate.cart),
                });
            }
        }
    }, [onBuyerIdentityUpdate, fetchCart, cartFragment, numCartLines, countryCode]);
    const cartAttributesUpdate = useCallback(async (attributes, state) => {
        if (state.status === 'idle') {
            dispatch({ type: 'cartAttributesUpdate' });
            onAttributesUpdate?.();
            const { data, error } = await fetchCart({
                query: CartAttributesUpdate(cartFragment),
                variables: {
                    cartId: state.cart.id,
                    attributes,
                    numCartLines,
                    country: countryCode,
                },
            });
            if (error) {
                dispatch({
                    type: 'reject',
                    error,
                });
            }
            if (data?.cartAttributesUpdate?.cart) {
                dispatch({
                    type: 'resolve',
                    cart: cartFromGraphQL(data.cartAttributesUpdate.cart),
                });
            }
        }
    }, [onAttributesUpdate, fetchCart, cartFragment, numCartLines, countryCode]);
    const discountCodesUpdate = useCallback(async (discountCodes, state) => {
        if (state.status === 'idle') {
            dispatch({ type: 'discountCodesUpdate' });
            onDiscountCodesUpdate?.();
            const { data, error } = await fetchCart({
                query: CartDiscountCodesUpdate(cartFragment),
                variables: {
                    cartId: state.cart.id,
                    discountCodes,
                    numCartLines,
                    country: countryCode,
                },
            });
            if (error) {
                dispatch({
                    type: 'reject',
                    error,
                });
            }
            if (data?.cartDiscountCodesUpdate?.cart) {
                ClientAnalytics.publish(ClientAnalytics.eventNames.DISCOUNT_CODE_UPDATED, true, {
                    updatedDiscountCodes: discountCodes,
                    cart: data.cartDiscountCodesUpdate.cart,
                });
                dispatch({
                    type: 'resolve',
                    cart: cartFromGraphQL(data.cartDiscountCodesUpdate.cart),
                });
            }
        }
    }, [onDiscountCodesUpdate, fetchCart, cartFragment, numCartLines, countryCode]);
    const didFetchCart = useRef(false);
    useEffect(() => {
        if (localStorage.getItem(CART_ID_STORAGE_KEY) &&
            state.status === 'uninitialized' &&
            !didFetchCart.current) {
            didFetchCart.current = true;
            cartFetch(localStorage.getItem(CART_ID_STORAGE_KEY));
        }
    }, [cartFetch, state]);
    useEffect(() => {
        if (!countryChanged)
            return;
        buyerIdentityUpdate({ countryCode, customerAccessToken }, state);
    }, [
        state,
        buyerIdentityUpdate,
        countryCode,
        customerAccessToken,
        countryChanged,
    ]);
    const cartContextValue = useMemo(() => {
        return {
            ...('cart' in state
                ? state.cart
                : {
                    lines: [],
                    attributes: [],
                    ...(cart ? cartFromGraphQL(cart) : {}),
                }),
            status: state.status,
            error: 'error' in state ? state.error : undefined,
            totalQuantity: 'cart' in state ? state?.cart?.totalQuantity ?? 0 : 0,
            cartCreate,
            linesAdd(lines) {
                if ('cart' in state && state.cart.id) {
                    addLineItem(lines, state);
                }
                else {
                    cartCreate({ lines });
                }
            },
            linesRemove(lines) {
                removeLineItem(lines, state);
            },
            linesUpdate(lines) {
                updateLineItem(lines, state);
            },
            noteUpdate(note) {
                noteUpdate(note, state);
            },
            buyerIdentityUpdate(buyerIdentity) {
                buyerIdentityUpdate(buyerIdentity, state);
            },
            cartAttributesUpdate(attributes) {
                cartAttributesUpdate(attributes, state);
            },
            discountCodesUpdate(discountCodes) {
                discountCodesUpdate(discountCodes, state);
            },
            cartFragment,
        };
    }, [
        state,
        cart,
        cartCreate,
        cartFragment,
        addLineItem,
        removeLineItem,
        updateLineItem,
        noteUpdate,
        buyerIdentityUpdate,
        cartAttributesUpdate,
        discountCodesUpdate,
    ]);
    return (React.createElement(CartContext.Provider, { value: cartContextValue }, children));
}
function cartFromGraphQL(cart) {
    return {
        ...cart,
        // @ts-expect-error While the cart still uses fragments, there will be a TS error here until we remove those fragments and get the type in-line
        lines: flattenConnection(cart.lines),
        note: cart.note ?? undefined,
    };
}
