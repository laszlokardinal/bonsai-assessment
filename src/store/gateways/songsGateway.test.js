import { call } from "redux-saga/effects";

import { songsGateway } from "./index.js";

import { apiService } from "../services";

describe("songsGateway", () => {
  describe("setRating()", () => {
    const gen = songsGateway.setRating("TEST_SONG_ID", "TEST_RATING");

    it("calls apiService.request", () => {
      expect(gen.next()).to.deep.equal({
        value: call(apiService.request, "patch", `/songs/TEST_SONG_ID`, {
          rating: "TEST_RATING"
        }),
        done: false
      });

      expect(gen.next()).to.deep.equal({
        value: undefined,
        done: true
      });
    });
  });
});
