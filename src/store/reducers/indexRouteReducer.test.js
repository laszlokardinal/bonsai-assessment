import { indexRouteReducer } from "./index.js";

describe("indexRouteReducer", () => {
  it("returns the initial state", () => {
    expect(indexRouteReducer(undefined, { type: "INIT" })).to.deep.equal({
      newPlaylistName: ""
    });
  });

  it("returns the same state on unknown action", () => {
    const state = {};

    expect(indexRouteReducer(state, { type: "UNKNOWN" })).to.equal(state);
  });

  describe("on INDEX_ROUTE__SET_NEW_PLAYLIST_TITLE type", () => {
    it("adds the queryId", () => {
      expect(
        indexRouteReducer(
          { newPlaylistName: "OLD_VALUE" },
          {
            type: "INDEX_ROUTE__SET_NEW_PLAYLIST_TITLE",
            payload: { value: "NEW_VALUE" }
          }
        )
      ).to.deep.equal({
        newPlaylistName: "NEW_VALUE"
      });
    });
  });
});
