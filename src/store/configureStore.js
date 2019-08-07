import { combineReducers, createStore, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import { createHistoryRouter } from "reduxen";

const configureStore = () => {
  const historyRouter = createHistoryRouter();

  const rootReducer = combineReducers({
    router: historyRouter.reducer
  });

  const middlewares = [historyRouter.middleware];

  if (process.env.NODE_ENV === "development") {
    const logger = createLogger();
    middlewares.unshift(logger);
  }

  return createStore(rootReducer, applyMiddleware(...middlewares));
};

export default configureStore;
