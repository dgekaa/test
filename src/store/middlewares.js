import { applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

const logger = (store) => (next) => (action) => {
  return next(action);
};

const thunk =
  ({ dispatch, getState }) =>
  (next) =>
  (action) => {
    return typeof action === "function"
      ? action(dispatch, getState)
      : next(action);
  };

export const middlewares = composeWithDevTools(applyMiddleware(logger, thunk));
