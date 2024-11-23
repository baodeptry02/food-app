export const setCart = (cartItems) => ({
  type: 'SET_CART',
  payload: cartItems,
});

export const addProductToCart = (cartItem) => ({
  type: 'ADD_TO_CART',
  payload: cartItem,
});
