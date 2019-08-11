import { all, call, put } from "redux-saga/effects";
import { cloneableGenerator } from "@redux-saga/testing-utils";

import { playlistsGateway } from "./index.js";

import { apiService } from "../services";

describe("playlistsGateway", () => {
  describe("loadPlaylists()", () => {
    const gen = cloneableGenerator(playlistsGateway.loadPlaylists)(
      "TEST_QUERY_ID"
    );

    it("dispatches QUERY__LOAD with the queryId", () => {
      expect(gen.next()).to.deep.equal({
        value: put({
          type: "QUERY__LOAD",
          payload: { queryId: "TEST_QUERY_ID", reload: false }
        }),
        done: false
      });
    });

    it("then calls apiService.request with GET /playlists", () => {
      expect(gen.next()).to.deep.equal({
        value: call(apiService.request, "get", "/playlists"),
        done: false
      });
    });

    describe("on successful request", () => {
      it("then dispatches QUERY__LOAD_SUCCESS with the flat playlist data", () => {
        const successfulGen = gen.clone();

        const responseData = {
          playlists: [
            { id: "1a", name: "100a" },
            { id: "2a", name: "200a" },
            { id: "3a", name: "300a" },
            { id: "4a", name: "400a" },
            { id: "5a", name: "500a" }
          ]
        };

        expect(successfulGen.next(responseData)).to.deep.equal({
          value: put({
            type: "QUERY__LOAD_SUCCESS",
            payload: {
              data: {
                playlists: {
                  "1a": { id: "1a", name: "100a", index: 0 },
                  "2a": { id: "2a", name: "200a", index: 1 },
                  "3a": { id: "3a", name: "300a", index: 2 },
                  "4a": { id: "4a", name: "400a", index: 3 },
                  "5a": { id: "5a", name: "500a", index: 4 }
                }
              },
              queryId: "TEST_QUERY_ID"
            }
          }),
          done: false
        });

        expect(successfulGen.next()).to.deep.equal({
          value: undefined,
          done: true
        });
      });
    });

    describe("on erroneous request", () => {
      it("then dispatches QUERY__LOAD_FAILURE with the error", () => {
        const erroneousGen = gen.clone();

        const error = "TEST_ERROR";

        expect(erroneousGen.throw(error)).to.deep.equal({
          value: put({
            type: "QUERY__LOAD_FAILURE",
            payload: {
              queryId: "TEST_QUERY_ID",
              error: "TEST_ERROR"
            }
          }),
          done: false
        });

        expect(erroneousGen.next()).to.deep.equal({
          value: undefined,
          done: true
        });
      });
    });

    describe("with reload=true", () => {
      it("dispatches QUERY__LOAD with reset=true", () => {
        const gen = playlistsGateway.loadPlaylists("TEST_QUERY_ID", {
          reload: true
        });

        expect(gen.next()).to.deep.equal({
          value: put({
            type: "QUERY__LOAD",
            payload: { queryId: "TEST_QUERY_ID", reload: true }
          }),
          done: false
        });
      });
    });
  });

  describe("loadPlaylist()", () => {
    const gen = cloneableGenerator(playlistsGateway.loadPlaylist)(
      "TEST_QUERY_ID",
      "TEST_PLAYLIST_ID"
    );

    it("dispatches QUERY__LOAD with the queryId", () => {
      expect(gen.next()).to.deep.equal({
        value: put({
          type: "QUERY__LOAD",
          payload: { queryId: "TEST_QUERY_ID", reload: false }
        }),
        done: false
      });
    });

    it("then calls apiService.request with GET /playlists/:id and GET /songs", () => {
      expect(gen.next()).to.deep.equal({
        value: all([
          call(apiService.request, "get", "/playlists/TEST_PLAYLIST_ID"),
          call(apiService.request, "get", "/songs")
        ]),
        done: false
      });
    });

    describe("on successful request", () => {
      it("then dispatches QUERY__LOAD_SUCCESS with the flat playlist data", () => {
        const successfulGen = gen.clone();

        const responseData = [
          {
            playlist: {
              id: "TEST_PLAYLIST_ID",
              name: "TEST_NAME",
              songs: [
                { songId: "1", position: 10 },
                { songId: "3", position: 30 },
                { songId: "5", position: 50 }
              ]
            }
          },
          {
            songs: [
              {
                id: "1",
                // missing title
                performer: "performer 1",
                rating: 1
              },
              {
                id: "2",
                title: "should be filtered 2",
                performer: "should be filtered 2",
                rating: 2
              },
              {
                id: "3",
                title: "title 3",
                // missing performer
                rating: 3
              },
              {
                id: "4",
                title: "should be filtered 4",
                performer: "should be filtered 4",
                rating: 4
              },
              {
                id: "5",
                title: "title 5",
                performer: "performer 5"
                // missing rating
              }
            ]
          }
        ];

        expect(successfulGen.next(responseData)).to.deep.equal({
          value: put({
            type: "QUERY__LOAD_SUCCESS",
            payload: {
              data: {
                playlists: {
                  TEST_PLAYLIST_ID: {
                    id: "TEST_PLAYLIST_ID",
                    name: "TEST_NAME"
                  }
                },
                songs: {
                  "1": {
                    id: "1",
                    position: 10,
                    title: "",
                    performer: "performer 1",
                    rating: 1
                  },
                  "3": {
                    id: "3",
                    position: 30,
                    title: "title 3",
                    performer: "",
                    rating: 3
                  },
                  "5": {
                    id: "5",
                    position: 50,
                    title: "title 5",
                    performer: "performer 5",
                    rating: 0
                  }
                }
              },
              queryId: "TEST_QUERY_ID"
            }
          }),
          done: false
        });

        expect(successfulGen.next()).to.deep.equal({
          value: undefined,
          done: true
        });
      });
    });

    describe("on erroneous request", () => {
      it("then dispatches QUERY__LOAD_FAILURE with the error", () => {
        const erroneousGen = gen.clone();

        const error = "TEST_ERROR";

        expect(erroneousGen.throw(error)).to.deep.equal({
          value: put({
            type: "QUERY__LOAD_FAILURE",
            payload: {
              queryId: "TEST_QUERY_ID",
              error: "TEST_ERROR"
            }
          }),
          done: false
        });

        expect(erroneousGen.next()).to.deep.equal({
          value: undefined,
          done: true
        });
      });
    });

    describe("with reload=true", () => {
      it("dispatches QUERY__LOAD with reset=true", () => {
        const gen = playlistsGateway.loadPlaylist(
          "TEST_QUERY_ID",
          "TEST_PLAYLIST_ID",
          {
            reload: true
          }
        );

        expect(gen.next()).to.deep.equal({
          value: put({
            type: "QUERY__LOAD",
            payload: { queryId: "TEST_QUERY_ID", reload: true }
          }),
          done: false
        });
      });
    });
  });

  describe("createNewPlaylist()", () => {
    const gen = playlistsGateway.createNewPlaylist("TEST_NAME");

    it("calls apiService.request with POST /playlists", () => {
      expect(gen.next()).to.deep.equal({
        value: call(apiService.request, "post", "/playlists", {
          name: "TEST_NAME",
          songs: []
        }),
        done: false
      });

      expect(gen.next()).to.deep.equal({
        value: undefined,
        done: true
      });
    });
  });

  describe("addNewSongToPlaylist()", () => {
    const gen = playlistsGateway.addNewSongToPlaylist(
      "TEST_PLAYLIST_ID",
      "TEST_PERFORMER",
      "TEST_TITLE",
      "TEST_POSITION"
    );

    it("calls apiService.request with POST /songs", () => {
      expect(gen.next()).to.deep.equal({
        value: call(apiService.request, "post", "/songs", {
          performer: "TEST_PERFORMER",
          title: "TEST_TITLE"
        }),
        done: false
      });
    });

    it("then calls apiService.request with PATCH /playlists/:playlistId/songs/:songId", () => {
      expect(gen.next({ song: { id: "RESPONSE_SONG_ID" } })).to.deep.equal({
        value: call(
          apiService.request,
          "post",
          "/playlists/TEST_PLAYLIST_ID/songs",
          {
            songId: "RESPONSE_SONG_ID",
            position: "TEST_POSITION"
          }
        ),
        done: false
      });

      expect(gen.next()).to.deep.equal({
        value: undefined,
        done: true
      });
    });
  });

  describe("setSongPositionInPlaylist()", () => {
    const gen = playlistsGateway.setSongPositionInPlaylist(
      "TEST_PLAYLIST_ID",
      "TEST_SONG_ID",
      "TEST_POSITION"
    );

    it("calls apiService.request with PATCH /playlists/:playlistId/songs/:songId", () => {
      expect(gen.next()).to.deep.equal({
        value: call(
          apiService.request,
          "patch",
          "/playlists/TEST_PLAYLIST_ID/songs/TEST_SONG_ID",
          { position: "TEST_POSITION" }
        ),
        done: false
      });

      expect(gen.next()).to.deep.equal({
        value: undefined,
        done: true
      });
    });
  });

  describe("removeSongsFromPlayist()", () => {
    const gen = playlistsGateway.removeSongsFromPlayist("TEST_PLAYLIST_ID", [
      "TEST_SONG_ID1",
      "TEST_SONG_ID2",
      "TEST_SONG_ID3"
    ]);

    it("calls apiService.request with DELETE /playlists/:playlistId/songs/:songId for each songId", () => {
      expect(gen.next()).to.deep.equal({
        value: all([
          call(
            apiService.request,
            "delete",
            "/playlists/TEST_PLAYLIST_ID/songs/TEST_SONG_ID1"
          ),
          call(
            apiService.request,
            "delete",
            "/playlists/TEST_PLAYLIST_ID/songs/TEST_SONG_ID2"
          ),
          call(
            apiService.request,
            "delete",
            "/playlists/TEST_PLAYLIST_ID/songs/TEST_SONG_ID3"
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
});
