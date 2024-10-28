import Cookies from "js-cookie";

export const setUserDetails = (user) => ({
  type: "SET_USER",
  payload: user,
});

export const getUserDetails = () => ({
  type: "GET_USER",
});

export const logoutUser = () => {
  Cookies.remove("authToken");
  Cookies.remove("refreshToken");
  localStorage.removeItem("user");
  return {
    type: "LOGOUT_USER",
    user: null,
  };
};

export const setUserLocation = (location) => {
  localStorage.setItem("userLocation", JSON.stringify(location));
  return {
    type: "SET_USER_LOCATION",
    payload: location,
  };
};
