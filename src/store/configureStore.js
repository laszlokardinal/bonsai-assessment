import { combineReducers, createStore, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import { createHistoryRouter } from "reduxen";
import createSagaMiddleware from "redux-saga";
import { all } from "redux-saga/effects";

import { createDataReducer, queriesReducer } from "./reducers";

const configureStore = () => {
  const historyRouter = createHistoryRouter();

  const rootReducer = combineReducers({
    router: historyRouter.reducer,
    queries: queriesReducer,
    data: combineReducers({
      songs: createDataReducer("songs"),
      playlists: createDataReducer("playlists")
    })
  });

  const sagaMiddleware = createSagaMiddleware();

  const middlewares = [historyRouter.middleware, sagaMiddleware];

  if (process.env.NODE_ENV === "development") {
    const logger = createLogger();
    middlewares.unshift(logger);
  }

  const store = createStore(rootReducer, applyMiddleware(...middlewares));

  const rootSaga = function*() {
    yield all([]);
  };

  sagaMiddleware.run(rootSaga);

  return store;
};

export default configureStore;
