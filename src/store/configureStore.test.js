/* global require */

import mock from "mock-require";
import { all } from "redux-saga/effects";

const runSpy = sinon.spy();

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

    mock("redux-saga", {
      default: () => ({
        CREATE_SAGA_MIDDLEWARE_RETURN_VALUE: true,
        run: runSpy
      }),
      __esModule: true
    });

    mock("redux-logger", {
      createLogger: () => "CREATE_LOGGER_RETURN_VALUE",
      __esModule: true
    });

    mock("./reducers", {
      createDataReducer: (...args) => ["CREATE_DATA_REDUCER", ...args],
      queriesReducer: "QUERIES_REDUCER",
      __esModule: true
    });
  });

  after(() => {
    mock.stopAll();
  });

  beforeEach(() => {
    runSpy.resetHistory();
  });

  it("builds the right reducer structure", () => {
    const { configureStore } = require("./index.js");

    const store = configureStore();

    expect(store[0]).to.equal("CREATE_STORE");
    expect(store[1]).to.deep.equal([
      "COMBINE_REDUCERS",
      {
        router: "CREATE_HISTORY_ROUTER_REDUCER",
        queries: "QUERIES_REDUCER",
        data: [
          "COMBINE_REDUCERS",
          {
            songs: ["CREATE_DATA_REDUCER", "songs"],
            playlists: ["CREATE_DATA_REDUCER", "playlists"]
          }
        ]
      }
    ]);
  });

  it("applies the proper middlewares", () => {
    const { configureStore } = require("./index.js");

    const store = configureStore();

    expect(store[0]).to.equal("CREATE_STORE");
    expect(store[2]).to.deep.equal([
      "APPLY_MIDDLEWARE",
      "CREATE_HISTORY_ROUTER_MIDDLEWARE",
      {
        CREATE_SAGA_MIDDLEWARE_RETURN_VALUE: true,
        run: runSpy
      }
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

  it("runs the root saga", () => {
    const { configureStore } = require("./index.js");

    configureStore();

    expect(runSpy).to.have.been.calledOnce;
    expect(runSpy.args[0][0]).to.be.a("function");

    const gen = runSpy.args[0][0]();

    expect(gen.next()).to.deep.equal({
      value: all([]),
      done: false
    });

    expect(gen.next().done).to.equal(true);
  });
});
