import { all, call, put, select, takeEvery } from "redux-saga/effects";
import { match } from "reduxen";

import { playlistsGateway } from "../gateways";

import {
  INDEX_ROUTE__CREATE_PLAYLIST,
  INDEX_ROUTE__SET_NEW_PLAYLIST_TITLE,
  QUERY__RELEASE,
  ROUTER__ENTERED,
  ROUTER__LEFT
} from "../../actions.js";

const matchIndexRoute = match("/");

export const handleEntered = function*(action) {
  if (matchIndexRoute(action.payload.path)) {
    yield call(playlistsGateway.loadPlaylists, "index-route");
  }
};

export const handleLeft = function*(action) {
  if (matchIndexRoute(action.payload.path)) {
    yield put({
      type: QUERY__RELEASE,
      payload: { queryId: "index-route" }
    });

    yield put({
      type: INDEX_ROUTE__SET_NEW_PLAYLIST_TITLE,
      payload: { value: "" }
    });
  }
};

export const reloadPlaylists = function*() {
  const state = yield select();

  if (matchIndexRoute(state.router.path)) {
    yield call(playlistsGateway.loadPlaylists, "index-route", { reload: true });
  }
};

export const handleCreateNewPlaylist = function*() {
  const state = yield select();
  const { newPlaylistName } = state.routes.indexRoute;

  yield call(playlistsGateway.createNewPlaylist, newPlaylistName);

  yield call(reloadPlaylists);
};

const indexRoute = function*() {
  yield all([
    takeEvery(ROUTER__ENTERED, handleEntered),
    takeEvery(ROUTER__LEFT, handleLeft),
    takeEvery(INDEX_ROUTE__CREATE_PLAYLIST, handleCreateNewPlaylist)
  ]);
};

export default indexRoute;
