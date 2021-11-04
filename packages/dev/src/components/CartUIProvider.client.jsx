import React, {
  useState,
  useMemo,
  useCallback,
  useContext,
  createContext,
} from 'react';

export const CartContext = createContext(null);

export default function CartUIProvider({children}) {
  const [open, setOpen] = useState(false);

  const openCart = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  const closeCart = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const toggleCart = useCallback(() => {
    setOpen(!open);
  }, [setOpen, open]);

  const contextValue = useMemo(() => {
    return {
      isCartOpen: open,
      openCart,
      closeCart,
      toggleCart,
    };
  }, [open, openCart, closeCart, toggleCart]);

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
}

export function useCartUI() {
  return useContext(CartContext);
}
