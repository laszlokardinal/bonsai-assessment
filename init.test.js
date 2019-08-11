/* global require */

const React = require("react");

/*
    MOCK CSS MODULES
*/

var mockCssModules = require("mock-css-modules");
mockCssModules.register([".css"]);

/*
    ENZYME
*/

const Enzyme = require("enzyme");
const Adapter = require("enzyme-adapter-react-16");
Enzyme.configure({ adapter: new Adapter() });
const { shallow } = Enzyme;

const { JSDOM } = require("jsdom");
const { document } = new JSDOM("<!doctype html><html><body></body></html>", {
  userAgent: "node.js"
}).window;
const window = document.defaultView;
const { navigator } = window;

/*
    PRETTY FORMAT
*/

const PrettyFormat = require("pretty-format");

const prettyFormat = element =>
  "\n" +
  PrettyFormat(element, {
    plugins: [PrettyFormat.plugins.ReactElement],
    printFunctionName: false
  }) +
  "\n";

/*
    SINON
*/

const sinon = require("sinon");

/*
    CHAI
*/

const chai = require("chai");
const { expect } = chai;

const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const chaiDiff = require("chai-diff");
chai.use(chaiDiff);

const chaiEnzyme = require("chai-enzyme");
chai.use(chaiEnzyme());

/*
    ASSIGN TO GLOBAL
*/

Object.assign(global, {
  React,
  shallow,
  prettyFormat,
  sinon,
  expect
});
