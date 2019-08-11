/* global require */

import mock from "mock-require";

describe("configureStore()", () => {
  before(() => {
    mock("redux", {
      combineReducers: (...args) => ["COMBINE_REDUCERS", ...args],
      createStore: (...args) => ["CREATE_STORE", ...args],
      applyMiddleware: (...args) => ["APPLY_MIDDLEWARE", ...args],
      __esModule: true
    });

    mock("reduxen", {
      createHistoryRouter: () => ({
        reducer: "CREATE_HISTORY_ROUTER_REDUCER",
        middleware: "CREATE_HISTORY_ROUTER_MIDDLEWARE"
      }),
      __esModule: true
    });

    mock("redux-logger", {
      createLogger: () => "CREATE_LOGGER_RETURN_VALUE",
      __esModule: true
    });
  });

  after(() => {
    mock.stopAll();
  });

  it("builds the right reducer structure", () => {
    const { configureStore } = require("./index.js");

    const store = configureStore();

    expect(store[0]).to.equal("CREATE_STORE");
    expect(store[1]).to.deep.equal([
      "COMBINE_REDUCERS",
      {
        router: "CREATE_HISTORY_ROUTER_REDUCER"
      }
    ]);
  });

  it("applies the proper middlewares", () => {
    const { configureStore } = require("./index.js");

    const store = configureStore();

    expect(store[0]).to.equal("CREATE_STORE");
    expect(store[2]).to.deep.equal([
      "APPLY_MIDDLEWARE",
      "CREATE_HISTORY_ROUTER_MIDDLEWARE"
    ]);
  });

  it("adds redux-logger in development mode", () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    try {
      const { configureStore } = require("./index.js");

      const store = configureStore();

      expect(store[0]).to.equal("CREATE_STORE");
      expect(store[2]).to.include("CREATE_LOGGER_RETURN_VALUE");
    } finally {
      process.env.NODE_ENV = originalNodeEnv;
    }
  });
});
