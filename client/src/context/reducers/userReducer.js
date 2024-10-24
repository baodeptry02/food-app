const initialState = {
  user: null,
  location: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_USER":
      return state;
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
      };
    case "SET_USER_LOCATION":
      return {
        ...state,
        location: action.payload,
      };
    case "LOGOUT_USER":
      return {
        ...state,
        user: null,
        location: null, // Reset location on logout
      };
    default:
      return state;
  }
};

export default userReducer;
