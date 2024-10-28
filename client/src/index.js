import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { applyMiddleware, createStore, compose } from "redux";
import { Provider } from "react-redux";
import myReducer from "./context/reducers";
import { tokenMiddleware } from "./middlewares/tokenMiddleware";
import { thunk } from "redux-thunk";
import Header from "./components/Header";
import { LocationProvider } from "./context/LocationContext"; // Ensure the path is correct
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const myStore = createStore(
  myReducer,
  composeEnhancers(applyMiddleware(thunk, tokenMiddleware))
);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Router>
      <AnimatePresence>
        <Provider store={myStore}>
          <LocationProvider>
            <App />
          </LocationProvider>
        </Provider>
      </AnimatePresence>
    </Router>
  </React.StrictMode>
);
