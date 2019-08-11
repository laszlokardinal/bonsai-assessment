/* global require */

import mock from "mock-require";

describe("index.js", () => {
  it("renders the root component", () => {
    try {
      const render = sinon.spy();

      mock("react-dom", {
        default: { render },
        __esModule: true
      });

      mock("react", {
        default: {
          createElement: (...args) => ["REACT_CREATE_ELEMENT", ...args]
        },
        __esModule: true
      });

      mock("window", {
        default: {
          document: {
            getElementById: (...args) => ["GET_ELEMENT_BY_ID", ...args]
          }
        },
        __esModule: true
      });

      mock("react-redux-root", {
        default: "REACT_REDUX_ROOT",
        __esModule: true
      });

      mock("./store", {
        configureStore: (...args) => ["CONFIGURE_STORE", ...args],
        __esModule: true
      });

      mock("./view", {
        App: "APP_COMPONENT",
        __esModule: true
      });

      require("./index.js");

      expect(render.args).to.deep.equal([
        [
          [
            "REACT_CREATE_ELEMENT",
            "REACT_REDUX_ROOT",
            {
              store: ["CONFIGURE_STORE"],
              component: "APP_COMPONENT"
            }
          ],
          ["GET_ELEMENT_BY_ID", "react-root"]
        ]
      ]);
    } finally {
      mock.stopAll();
    }
  });
});
