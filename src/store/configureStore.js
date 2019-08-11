import { combineReducers, createStore, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import { createHistoryRouter } from "reduxen";
import createSagaMiddleware from "redux-saga";
import { all, call } from "redux-saga/effects";

import {
  createDataReducer,
  queriesReducer,
  playlistRouteReducer,
  indexRouteReducer
} from "./reducers";

import { indexRoute, playlistRoute } from "./routes";

const configureStore = () => {
  const historyRouter = createHistoryRouter();

  const rootReducer = combineReducers({
    router: historyRouter.reducer,
    queries: queriesReducer,
    data: combineReducers({
      songs: createDataReducer("songs"),
      playlists: createDataReducer("playlists")
    }),
    routes: combineReducers({
      playlistRoute: playlistRouteReducer,
      indexRoute: indexRouteReducer
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
    yield all([call(indexRoute), call(playlistRoute)]);
  };

  sagaMiddleware.run(rootSaga);

  return store;
};

export default configureStore;
