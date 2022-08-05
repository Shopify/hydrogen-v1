# State Management

Current state management in `CartProvider` is buggy.
Some requests or states should not happen at all resulting in unexpected Cart changes, or hydrogen crashing

This is because there are race conditions at:

- Creating cart / fetching cart from uninitialized
- Adding item multiple times

Plus we are adding a lot of ifs conditionals to check for valid status which are dispersed throughout the `CartProvider` this makes it hard to reason and debug the state management.

## Cart API contraints

Main problems with current state management.

### Updating actions require a cart

Initial event always need to be:

- CREATE_CART
- FETCH_CART

We need a cart before we can perform the following operations on it:

- REMOVE_CART_LINE
- ADDING_CART_LINE
- UPDATE_CART_LINE
- UPDATE_CART_NOTE
- UPDATE_CART_ATTRIBUTES
- UPDATE_CART_DISCOUNT
- UPDATE_CART_BUYER_IDENTITY

### Actions need to be sequential

Updating actions arbitrarily can result in cart inconsistencies. For example:

- Removing a cart line and then adding a cart line would result in a different cart. Than the inverse.

- Adding a cartline is aggregative vs updating a cartline is idempotent

## State Machine

New state machine proposed:
