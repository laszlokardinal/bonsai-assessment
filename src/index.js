import "@babel/polyfill";

import "./index.css";

import ReactDOM from "react-dom";
import React from "react";
import window from "window";

import Root from "react-redux-root";

import { configureStore } from "./store";
import { App } from "./view";

const store = configureStore();

ReactDOM.render(
  React.createElement(Root, { store, component: App }),
  window.document.getElementById("react-root")
);
