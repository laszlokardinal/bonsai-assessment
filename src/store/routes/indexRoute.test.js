import { all, call, put, takeEvery, select } from "redux-saga/effects";
import { cloneableGenerator } from "@redux-saga/testing-utils";

import { playlistsGateway } from "../gateways";

import { indexRoute } from "./index.js";

import {
  handleEntered,
  handleLeft,
  reloadPlaylists,
  handleCreateNewPlaylist
} from "./indexRoute.js";

describe("indexRoute", () => {
  describe("handleEntered", () => {
    describe("on matching route", () => {
      const gen = handleEntered({
        type: "ROUTER__ENTERED",
        payload: { path: "/" }
      });

      it("calls playlistsGateway.loadPlaylists", () => {
        expect(gen.next()).to.deep.equal({
          value: call(playlistsGateway.loadPlaylists, "index-route"),
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
        payload: { path: "/" }
      });

      it("dispatches QUERY_RELEASE", () => {
        expect(gen.next()).to.deep.equal({
          value: put({
            type: "QUERY__RELEASE",
            payload: { queryId: "index-route" }
          }),
          done: false
        });
      });

      it("then dispatches INDEX_ROUTE__SET_NEW_PLAYLIST_TITLE", () => {
        expect(gen.next()).to.deep.equal({
          value: put({
            type: "INDEX_ROUTE__SET_NEW_PLAYLIST_TITLE",
            payload: { value: "" }
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

  describe("reloadPlaylists", () => {
    const gen = cloneableGenerator(reloadPlaylists)();

    it("gets the state", () => {
      expect(gen.next()).to.deep.equal({ value: select(), done: false });
    });

    describe("then on matching route", () => {
      it("calls playlistsGateway.loadPlaylists", () => {
        const matchingGen = gen.clone();

        const state = {
          router: { path: "/" }
        };

        expect(matchingGen.next(state)).to.deep.equal({
          value: call(playlistsGateway.loadPlaylists, "index-route", {
            reload: true
          }),
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

  describe("handleCreateNewPlaylist", () => {
    const gen = handleCreateNewPlaylist();

    it("gets the state", () => {
      expect(gen.next()).to.deep.equal({ value: select(), done: false });
    });

    it("then calls playlistsGateway.createNewPlaylist", () => {
      const state = {
        routes: { indexRoute: { newPlaylistName: "TEST_PLAYLIST_NAME" } }
      };

      expect(gen.next(state)).to.deep.equal({
        value: call(playlistsGateway.createNewPlaylist, "TEST_PLAYLIST_NAME"),
        done: false
      });
    });

    it("then calls reloadPlaylists", () => {
      expect(gen.next()).to.deep.equal({
        value: call(reloadPlaylists),
        done: false
      });

      expect(gen.next()).to.deep.equal({
        value: undefined,
        done: true
      });
    });
  });

  it("assigns handlers to action types", () => {
    const gen = indexRoute();

    expect(gen.next()).to.deep.equal({
      value: all([
        takeEvery("ROUTER__ENTERED", handleEntered),
        takeEvery("ROUTER__LEFT", handleLeft),
        takeEvery("INDEX_ROUTE__CREATE_PLAYLIST", handleCreateNewPlaylist)
      ]),
      done: false
    });

    expect(gen.next()).to.deep.equal({
      value: undefined,
      done: true
    });
  });
});
