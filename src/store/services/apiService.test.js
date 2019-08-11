import { call } from "redux-saga/effects";
import { cloneableGenerator } from "@redux-saga/testing-utils";
import axios from "axios";

import { apiService } from "./index.js";

let originalApiBaseUrl = null;
let originalApiToken = null;

describe("apiService", () => {
  before(() => {
    originalApiBaseUrl = process.env.API_BASE_URL;
    process.env.API_BASE_URL = "TEST_API_BASE_URL";

    originalApiToken = process.env.API_TOKEN;
    process.env.API_TOKEN = "TEST_API_TOKEN";
  });

  after(() => {
    process.env.API_BASE_URL = originalApiBaseUrl;
    process.env.API_TOKEN = originalApiToken;
  });

  describe("request()", () => {
    const gen = cloneableGenerator(apiService.request)(
      "TEST_METHOD",
      "/TEST_PATH",
      "TEST_DATA"
    );

    it("calls axios", () => {
      expect(gen.next()).to.deep.equal({
        value: call(axios, {
          method: "TEST_METHOD",
          data: "TEST_DATA",
          url: "TEST_API_BASE_URL/TEST_PATH",
          headers: { "access-token": "TEST_API_TOKEN" }
        }),
        done: false
      });
    });

    describe("in case of successful response", () => {
      it("return the response data", () => {
        const successfulGen = gen.clone();

        expect(successfulGen.next({ data: { TEST_DATA: true } })).to.deep.equal(
          {
            value: { TEST_DATA: true },
            done: true
          }
        );
      });
    });

    describe("in case of erroneous response", () => {
      describe("in case of unsuccessful request", () => {
        it("throws an error", () => {
          const erroneousGen = gen.clone();

          try {
            erroneousGen.throw({
              response: {
                status: 404,
                data: { error: "TEST_ERROR" }
              }
            });

            throw new Error("Expected to throw an error");
          } catch (error) {
            expect(error).to.deep.equal({
              status: 404,
              networkError: false,
              data: { error: "TEST_ERROR" }
            });
          }
        });
      });

      describe("in case of network error", () => {
        it("throws an error", () => {
          const erroneousGen = gen.clone();

          try {
            erroneousGen.throw({});

            throw new Error("Expected to throw an error");
          } catch (error) {
            expect(error).to.deep.equal({
              status: null,
              networkError: true,
              data: {}
            });
          }
        });
      });
    });
  });
});
