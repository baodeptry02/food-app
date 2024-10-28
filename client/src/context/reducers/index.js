import { combineReducers } from "redux";
import userReducer from "./userReducer";

const myReducer = combineReducers({
  userState: userReducer, // Renamed to `userState` for clarity
});

export default myReducer;
