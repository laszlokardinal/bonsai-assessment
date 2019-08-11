import {
  all,
  call,
  debounce,
  put,
  select,
  takeEvery,
  throttle
} from "redux-saga/effects";
import { cloneableGenerator } from "@redux-saga/testing-utils";

import { playlistsGateway, songsGateway } from "../gateways";

import { playlistRoute } from "./index.js";
import {
  handleEntered,
  handleLeft,
  reloadPlaylist,
  handleSetRating,
  handleAddSong,
  handleDeleteSelected,
  handleSetPosition,
  handleApplyRepositionPatch
} from "./playlistRoute.js";

describe("playlistRoute", () => {
  describe("handleEntered", () => {
    describe("on matching route", () => {
      const gen = handleEntered({
        type: "ROUTER__ENTERED",
        payload: { path: "/playlists/TEST_PLAYLIST_ID" }
      });

      it("calls playlistsGateway.loadPlaylist", () => {
        expect(gen.next()).to.deep.equal({
          value: call(
            playlistsGateway.loadPlaylist,
            "playlist-route",
            "TEST_PLAYLIST_ID"
          ),
          done: false
        });

        expect(gen.next()).to.deep.equal({
          value: undefined,
          done: true
        });
      });
    });

    describe("on a non-matching route", () => {
      const gen = handleEntered({
        type: "ROUTER__ENTERED",
        payload: { path: "/asd" }
      });

      it("does nothing", () => {
        expect(gen.next()).to.deep.equal({
          value: undefined,
          done: true
        });
      });
    });
  });

  describe("handleLeft", () => {
    describe("on matching route", () => {
      const gen = handleLeft({
        type: "ROUTER__LEFT",
        payload: { path: "/playlists/TEST_PLAYLIST_ID" }
      });

      it("dispatches QUERY_RELEASE", () => {
        expect(gen.next()).to.deep.equal({
          value: put({
            type: "QUERY__RELEASE",
            payload: { queryId: "playlist-route" }
          }),
          done: false
        });
      });

      it("then dispatches PLAYLIST_ROUTE__RESET_NEW_SONG_INPUTS", () => {
        expect(gen.next()).to.deep.equal({
          value: put({
            type: "PLAYLIST_ROUTE__RESET_NEW_SONG_INPUTS",
            payload: {}
          }),
          done: false
        });
      });

      it("then dispatches PLAYLIST_ROUTE__RESET_SELECTED_IDS", () => {
        expect(gen.next()).to.deep.equal({
          value: put({
            type: "PLAYLIST_ROUTE__RESET_SELECTED_IDS",
            payload: {}
          }),
          done: false
        });

        expect(gen.next()).to.deep.equal({
          value: undefined,
          done: true
        });
      });
    });

    describe("on a non-matching route", () => {
      const gen = handleLeft({
        type: "ROUTER__LEFT",
        payload: { path: "/asd" }
      });

      it("does nothing", () => {
        expect(gen.next()).to.deep.equal({
          value: undefined,
          done: true
        });
      });
    });
  });

  describe("reloadPlaylist", () => {
    const gen = cloneableGenerator(reloadPlaylist)();

    it("gets the state", () => {
      expect(gen.next()).to.deep.equal({ value: select(), done: false });
    });

    describe("then on matching route", () => {
      it("calls playlistsGateway.loadPlaylists", () => {
        const matchingGen = gen.clone();

        const state = {
          router: { path: "/playlists/TEST_PLAYLIST_ID" }
        };

        expect(matchingGen.next(state)).to.deep.equal({
          value: call(
            playlistsGateway.loadPlaylist,
            "playlist-route",
            "TEST_PLAYLIST_ID",
            {
              reload: true
            }
          ),
          done: false
        });

        expect(matchingGen.next()).to.deep.equal({
          value: undefined,
          done: true
        });
      });
    });

    describe("then on non-matching route", () => {
      it("does nothing", () => {
        const nonMatchingGen = gen.clone();

        const state = {
          router: { path: "/not-a-match" }
        };

        expect(nonMatchingGen.next(state)).to.deep.equal({
          value: undefined,
          done: true
        });
      });
    });
  });

  describe("handleSetRating", () => {
    const gen = handleSetRating({
      type: "PLAYLIST_ROUTE__SET_RATING",
      payload: { songId: "TEST_SONG_ID", rating: "TEST_SONG_RATING" }
    });

    it("calls songsGateway.setRating", () => {
      expect(gen.next()).to.deep.equal({
        value: call(songsGateway.setRating, "TEST_SONG_ID", "TEST_SONG_RATING"),
        done: false
      });
    });

    it("then reloads the playlist", () => {
      expect(gen.next()).to.deep.equal({
        value: call(reloadPlaylist),
        done: false
      });

      expect(gen.next()).to.deep.equal({
        value: undefined,
        done: true
      });
    });
  });

  describe("handleAddSong", () => {
    const gen = handleAddSong();

    it("gets the state", () => {
      expect(gen.next()).to.deep.equal({
        value: select(),
        done: false
      });
    });

    it("then calls playlistsGateway.addNewSongToPlaylist", () => {
      const state = {
        router: { path: "/playlists/TEST_PLAYLIST_ID" },
        data: {
          songs: {
            "11": {
              id: "11",
              position: 14,
              queryIds: { "playlist-route": true }
            },
            "22": {
              id: "22",
              position: 23,
              queryIds: { "playlist-route": true }
            },
            "33": {
              id: "33",
              position: 13,
              queryIds: { "playlist-route": true }
            },
            "44": {
              id: "44",
              position: 9998,
              queryIds: { "playlist-route": true }
            },
            "55": {
              id: "55",
              position: 1,
              queryIds: { "playlist-route": true }
            },
            "66": { id: "66", position: 100000, queryIds: { whatever: true } }
          }
        },
        routes: {
          playlistRoute: {
            newSongPerformer: "TEST_PERFORMER",
            newSongTitle: "TEST_TITLE"
          }
        }
      };

      expect(gen.next(state)).to.deep.equal({
        value: call(
          playlistsGateway.addNewSongToPlaylist,
          "TEST_PLAYLIST_ID",
          "TEST_PERFORMER",
          "TEST_TITLE",
          9999
        ),
        done: false
      });
    });

    it("then dispatches PLAYLIST_ROUTE__RESET_NEW_SONG_INPUTS", () => {
      expect(gen.next()).to.deep.equal({
        value: put({
          type: "PLAYLIST_ROUTE__RESET_NEW_SONG_INPUTS",
          payload: {}
        }),
        done: false
      });
    });

    it("then reloads the playlist", () => {
      expect(gen.next()).to.deep.equal({
        value: call(reloadPlaylist),
        done: false
      });

      expect(gen.next()).to.deep.equal({
        value: undefined,
        done: true
      });
    });
  });

  describe("handleDeleteSelected", () => {
    const gen = handleDeleteSelected();

    it("gets the state", () => {
      expect(gen.next()).to.deep.equal({
        value: select(),
        done: false
      });
    });

    it("then calls playlistsGateway.removeSongsFromPlayist", () => {
      const state = {
        router: { path: "/playlists/TEST_PLAYLIST_ID" },
        routes: {
          playlistRoute: {
            selectedSongIds: [
              "TEST_SONG_ID_1",
              "TEST_SONG_ID_2",
              "TEST_SONG_ID_3"
            ]
          }
        }
      };

      expect(gen.next(state)).to.deep.equal({
        value: call(
          playlistsGateway.removeSongsFromPlayist,
          "TEST_PLAYLIST_ID",
          ["TEST_SONG_ID_1", "TEST_SONG_ID_2", "TEST_SONG_ID_3"]
        ),
        done: false
      });
    });

    it("then reloads the playlist", () => {
      expect(gen.next()).to.deep.equal({
        value: call(reloadPlaylist),
        done: false
      });
    });

    it("then dispatches PLAYLIST_ROUTE__RESET_NEW_SONG_INPUTS", () => {
      expect(gen.next()).to.deep.equal({
        value: put({
          type: "PLAYLIST_ROUTE__RESET_SELECTED_IDS",
          payload: {}
        }),
        done: false
      });

      expect(gen.next()).to.deep.equal({
        value: undefined,
        done: true
      });
    });
  });

  describe("handleSetPosition", () => {
    const gen = handleSetPosition({
      type: "PLAYLIST_ROUTE__SET_POSITION",
      payload: { songId: "TEST_SONG_ID", position: "TEST_SONG_POSITION" }
    });

    it("then dispatches PLAYLIST_ROUTE__MERGE_REPOSITION_PATCH", () => {
      expect(gen.next()).to.deep.equal({
        value: put({
          type: "PLAYLIST_ROUTE__MERGE_REPOSITION_PATCH",
          payload: { TEST_SONG_ID: { position: "TEST_SONG_POSITION" } }
        }),
        done: false
      });
    });

    it("then dispatches PLAYLIST_ROUTE__APPLY_REPOSITION_PATCH", () => {
      expect(gen.next()).to.deep.equal({
        value: put({
          type: "PLAYLIST_ROUTE__APPLY_REPOSITION_PATCH",
          payload: {}
        }),
        done: false
      });

      expect(gen.next()).to.deep.equal({
        value: undefined,
        done: true
      });
    });
  });

  describe("handleApplyRepositionPatch", () => {
    const gen = handleApplyRepositionPatch();

    it("gets the state", () => {
      expect(gen.next()).to.deep.equal({
        value: select(),
        done: false
      });
    });

    it("then calls playlistsGateway.setSongPositionInPlaylist for each patch item", () => {
      const state = {
        router: {
          path: "/playlists/TEST_PLAYLIST_ID"
        },
        routes: {
          playlistRoute: {
            repositionPatch: {
              id3: { position: 3 },
              id5: { position: 5 },
              id7: { position: 7 }
            }
          }
        }
      };

      expect(gen.next(state)).to.deep.equal({
        value: all({
          id3: call(
            playlistsGateway.setSongPositionInPlaylist,
            "TEST_PLAYLIST_ID",
            "id3",
            3
          ),
          id5: call(
            playlistsGateway.setSongPositionInPlaylist,
            "TEST_PLAYLIST_ID",
            "id5",
            5
          ),
          id7: call(
            playlistsGateway.setSongPositionInPlaylist,
            "TEST_PLAYLIST_ID",
            "id7",
            7
          )
        }),
        done: false
      });
    });

    it("then reloads the playlist", () => {
      expect(gen.next()).to.deep.equal({
        value: call(reloadPlaylist),
        done: false
      });
    });

    it("then dispatches PLAYLIST_ROUTE__REMOVE_FROM_REPOSITION_PATCH for each patch item", () => {
      expect(gen.next()).to.deep.equal({
        value: all({
          id3: put({
            type: "PLAYLIST_ROUTE__REMOVE_FROM_REPOSITION_PATCH",
            payload: {
              songId: "id3",
              position: 3
            }
          }),
          id5: put({
            type: "PLAYLIST_ROUTE__REMOVE_FROM_REPOSITION_PATCH",
            payload: {
              songId: "id5",
              position: 5
            }
          }),
          id7: put({
            type: "PLAYLIST_ROUTE__REMOVE_FROM_REPOSITION_PATCH",
            payload: {
              songId: "id7",
              position: 7
            }
          })
        }),
        done: false
      });

      expect(gen.next()).to.deep.equal({
        value: undefined,
        done: true
      });
    });
  });

  it("assigns handlers to action types", () => {
    const gen = playlistRoute();

    expect(gen.next()).to.deep.equal({
      value: all([
        takeEvery("ROUTER__ENTERED", handleEntered),
        takeEvery("ROUTER__LEFT", handleLeft),
        takeEvery("PLAYLIST_ROUTE__SET_RATING", handleSetRating),
        takeEvery("PLAYLIST_ROUTE__ADD_SONG", handleAddSong),
        takeEvery("PLAYLIST_ROUTE__DELETE_SELECTED", handleDeleteSelected),
        throttle(50, "PLAYLIST_ROUTE__SET_POSITION", handleSetPosition),
        debounce(
          1000,
          "PLAYLIST_ROUTE__APPLY_REPOSITION_PATCH",
          handleApplyRepositionPatch
        )
      ]),
      done: false
    });

    expect(gen.next()).to.deep.equal({
      value: undefined,
      done: true
    });
  });
});
