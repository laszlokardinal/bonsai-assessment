import { playlistRouteReducer } from "./index.js";

describe("playlistRouteReducer", () => {
  it("returns the initial state", () => {
    expect(playlistRouteReducer(undefined, { type: "INIT" })).to.deep.equal({
      newSongPerformer: "",
      newSongTitle: "",
      selectedSongIds: [],
      repositionPatch: {},
      draggingSongId: null,
      draggingIndicatorSongId: null
    });
  });

  it("returns the same state on unknown action", () => {
    const state = {};

    expect(playlistRouteReducer(state, { type: "UNKNOWN" })).to.equal(state);
  });

  describe("on PLAYLIST_ROUTE__SET_NEW_SONG_PERFORMER", () => {
    it("sets newSongPerformer", () => {
      expect(
        playlistRouteReducer(
          {
            someKeyToStay: "someValueToStay",
            newSongPerformer: "OLD_VALUE"
          },
          {
            type: "PLAYLIST_ROUTE__SET_NEW_SONG_PERFORMER",
            payload: { value: "TEST_VALUE" }
          }
        )
      ).to.deep.equal({
        someKeyToStay: "someValueToStay",
        newSongPerformer: "TEST_VALUE"
      });
    });
  });

  describe("on PLAYLIST_ROUTE__SET_NEW_SONG_TITLE", () => {
    it("sets newSongTitle", () => {
      expect(
        playlistRouteReducer(
          {
            someKeyToStay: "someValueToStay",
            newSongTitle: "OLD_VALUE"
          },
          {
            type: "PLAYLIST_ROUTE__SET_NEW_SONG_TITLE",
            payload: { value: "TEST_VALUE" }
          }
        )
      ).to.deep.equal({
        someKeyToStay: "someValueToStay",
        newSongTitle: "TEST_VALUE"
      });
    });
  });

  describe("on PLAYLIST_ROUTE__RESET_NEW_SONG_INPUTS", () => {
    it("resets newSongPerformer and newSongTitle", () => {
      expect(
        playlistRouteReducer(
          {
            someKeyToStay: "someValueToStay",
            newSongPerformer: "OLD_VALUE",
            newSongTitle: "OLD_VALUE"
          },
          {
            type: "PLAYLIST_ROUTE__RESET_NEW_SONG_INPUTS",
            payload: {}
          }
        )
      ).to.deep.equal({
        someKeyToStay: "someValueToStay",
        newSongPerformer: "",
        newSongTitle: ""
      });
    });
  });

  describe("on PLAYLIST_ROUTE__TOGGLE_SELECTED_ID", () => {
    it("removes songId from selected ids", () => {
      expect(
        playlistRouteReducer(
          {
            someKeyToStay: "someValueToStay",
            selectedSongIds: ["STAY", "TOGGLE"]
          },
          {
            type: "PLAYLIST_ROUTE__TOGGLE_SELECTED_ID",
            payload: { songId: "TOGGLE" }
          }
        )
      ).to.deep.equal({
        someKeyToStay: "someValueToStay",
        selectedSongIds: ["STAY"]
      });
    });

    it("adds songId to selected ids", () => {
      const newState = playlistRouteReducer(
        {
          someKeyToStay: "someValueToStay",
          selectedSongIds: ["STAY"]
        },
        {
          type: "PLAYLIST_ROUTE__TOGGLE_SELECTED_ID",
          payload: { songId: "TOGGLE" }
        }
      );

      expect(newState).to.deep.include({ someKeyToStay: "someValueToStay" });
      expect(newState.selectedSongIds).to.have.length(2);
      expect(newState.selectedSongIds).to.include("STAY");
      expect(newState.selectedSongIds).to.include("TOGGLE");
    });
  });

  describe("on PLAYLIST_ROUTE__RESET_SELECTED_IDS", () => {
    it("removes every selected id", () => {
      expect(
        playlistRouteReducer(
          {
            someKeyToStay: "someValueToStay",
            selectedSongIds: ["1", "2", "3"]
          },
          {
            type: "PLAYLIST_ROUTE__RESET_SELECTED_IDS",
            payload: {}
          }
        )
      ).to.deep.equal({
        someKeyToStay: "someValueToStay",
        selectedSongIds: []
      });
    });
  });

  describe("on PLAYLIST_ROUTE__MERGE_REPOSITION_PATCH", () => {
    it("merges payload into reposition patch", () => {
      expect(
        playlistRouteReducer(
          {
            someKeyToStay: "someValueToStay",
            repositionPatch: {
              someIdToStay: { position: 123 }
            }
          },
          {
            type: "PLAYLIST_ROUTE__MERGE_REPOSITION_PATCH",
            payload: { newIdToAdd: { position: 456 } }
          }
        )
      ).to.deep.equal({
        someKeyToStay: "someValueToStay",
        repositionPatch: {
          someIdToStay: { position: 123 },
          newIdToAdd: { position: 456 }
        }
      });
    });
  });

  describe("on PLAYLIST_ROUTE__REMOVE_FROM_REPOSITION_PATCH", () => {
    describe("if the position is matching", () => {
      it("removes id from reposition patch", () => {
        expect(
          playlistRouteReducer(
            {
              someKeyToStay: "someValueToStay",
              repositionPatch: {
                someIdToStay: { position: 123 },
                idToRemove: { position: 456 }
              }
            },
            {
              type: "PLAYLIST_ROUTE__REMOVE_FROM_REPOSITION_PATCH",
              payload: { songId: "idToRemove", position: 456 }
            }
          )
        ).to.deep.equal({
          someKeyToStay: "someValueToStay",
          repositionPatch: {
            someIdToStay: { position: 123 }
          }
        });
      });
    });

    describe("if the position is not matching", () => {
      it("removes the original state", () => {
        expect(
          playlistRouteReducer(
            {
              someKeyToStay: "someValueToStay",
              repositionPatch: {
                someIdToStay: { position: 123 },
                idToRemove: { position: 456 }
              }
            },
            {
              type: "PLAYLIST_ROUTE__REMOVE_FROM_REPOSITION_PATCH",
              payload: { songId: "idToRemove", position: 789 }
            }
          )
        ).to.deep.equal({
          someKeyToStay: "someValueToStay",
          repositionPatch: {
            someIdToStay: { position: 123 },
            idToRemove: { position: 456 }
          }
        });
      });
    });
  });

  describe("on PLAYLIST_ROUTE__SET_DRAGGING_SONG_ID", () => {
    it("sets draggingSongId", () => {
      expect(
        playlistRouteReducer(
          {
            someKeyToStay: "someValueToStay",
            draggingSongId: null
          },
          {
            type: "PLAYLIST_ROUTE__SET_DRAGGING_SONG_ID",
            payload: { songId: "TEST_SONG_ID" }
          }
        )
      ).to.deep.equal({
        someKeyToStay: "someValueToStay",
        draggingSongId: "TEST_SONG_ID"
      });
    });
  });

  describe("on PLAYLIST_ROUTE__SET_DRAGGING_INDICATOR_SONG_ID", () => {
    it("sets draggingSongId", () => {
      expect(
        playlistRouteReducer(
          {
            someKeyToStay: "someValueToStay",
            draggingIndicatorSongId: null
          },
          {
            type: "PLAYLIST_ROUTE__SET_DRAGGING_INDICATOR_SONG_ID",
            payload: { songId: "TEST_SONG_ID" }
          }
        )
      ).to.deep.equal({
        someKeyToStay: "someValueToStay",
        draggingIndicatorSongId: "TEST_SONG_ID"
      });
    });
  });
});
