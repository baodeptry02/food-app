const initialState = {
  cartItems: [],
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        cartItems: action.payload,
      };

    case 'ADD_TO_CART': {
      const existingIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.id
      );
      console.log('existingIndex:', existingIndex);

      if (existingIndex !== -1) {
        const updatedCartItems = [...state.cartItems];
        updatedCartItems[existingIndex] = {
          ...updatedCartItems[existingIndex],
          quantity:
            updatedCartItems[existingIndex].quantity + action.payload.quantity,
        };
        return {
          ...state,
          cartItems: updatedCartItems,
        };
      }

      return {
        ...state,
        cartItems: [...state.cartItems, action.payload],
      };
    }
    case 'SET_SELECTED_PRODUCTS':
      return { ...state, selectedProducts: action.payload };
    case 'REMOVE_SELECTED_ITEMS':
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (item) => !action.payload.includes(item.id)
        ),
      };
    default:
      return state;
  }
};

export default cartReducer;
