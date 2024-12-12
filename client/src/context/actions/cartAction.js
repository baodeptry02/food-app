export const setCart = (cartItems) => ({
  type: 'SET_CART',
  payload: cartItems,
});

export const addProductToCart = (cartItem) => ({
  type: 'ADD_TO_CART',
  payload: cartItem,
});

export const setSelectedProducts = (selectedProducts) => ({
  type: 'SET_SELECTED_PRODUCTS',
  payload: selectedProducts,
});

export const removeSelectedItems = (selectedProducts) => ({
  type: 'REMOVE_SELECTED_ITEMS',
  payload: selectedProducts,
});
