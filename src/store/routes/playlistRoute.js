import {
  all,
  call,
  debounce,
  put,
  select,
  takeEvery,
  throttle
} from "redux-saga/effects";
import { match } from "reduxen";

import { playlistsGateway, songsGateway } from "../gateways";

import {
  PLAYLIST_ROUTE__ADD_SONG,
  PLAYLIST_ROUTE__DELETE_SELECTED,
  PLAYLIST_ROUTE__MERGE_REPOSITION_PATCH,
  PLAYLIST_ROUTE__REMOVE_FROM_REPOSITION_PATCH,
  PLAYLIST_ROUTE__RESET_NEW_SONG_INPUTS,
  PLAYLIST_ROUTE__RESET_SELECTED_IDS,
  PLAYLIST_ROUTE__APPLY_REPOSITION_PATCH,
  PLAYLIST_ROUTE__SET_POSITION,
  PLAYLIST_ROUTE__SET_RATING,
  QUERY__RELEASE,
  ROUTER__ENTERED,
  ROUTER__LEFT
} from "../../actions.js";

const matchPlaylistRoute = match("/playlists/:playlistId");

export const handleEntered = function*(action) {
  const match = matchPlaylistRoute(action.payload.path);

  if (match) {
    yield call(
      playlistsGateway.loadPlaylist,
      "playlist-route",
      match.playlistId
    );
  }
};

export const handleLeft = function*(action) {
  if (matchPlaylistRoute(action.payload.path)) {
    yield put({
      type: QUERY__RELEASE,
      payload: { queryId: "playlist-route" }
    });

    yield put({ type: PLAYLIST_ROUTE__RESET_NEW_SONG_INPUTS, payload: {} });
    yield put({ type: PLAYLIST_ROUTE__RESET_SELECTED_IDS, payload: {} });
  }
};

export const reloadPlaylist = function*() {
  const state = yield select();
  const match = matchPlaylistRoute(state.router.path);

  if (match) {
    const { playlistId } = match;

    yield call(playlistsGateway.loadPlaylist, "playlist-route", playlistId, {
      reload: true
    });
  }
};

export const handleSetRating = function*(action) {
  const { songId, rating } = action.payload;

  yield call(songsGateway.setRating, songId, rating);

  yield call(reloadPlaylist);
};

export const handleAddSong = function*() {
  const state = yield select();
  const { playlistId } = matchPlaylistRoute(state.router.path);
  const { newSongPerformer, newSongTitle } = state.routes.playlistRoute;

  const highestPosition = Object.values(state.data.songs)
    .filter(song => song.queryIds["playlist-route"])
    .map(song => song.position)
    .reduce((a, b) => Math.max(a, b), 0);

  const newSongPosition = highestPosition + 1;

  yield call(
    playlistsGateway.addNewSongToPlaylist,
    playlistId,
    newSongPerformer,
    newSongTitle,
    newSongPosition
  );

  yield put({ type: PLAYLIST_ROUTE__RESET_NEW_SONG_INPUTS, payload: {} });

  yield call(reloadPlaylist);
};

export const handleDeleteSelected = function*() {
  const state = yield select();
  const { playlistId } = matchPlaylistRoute(state.router.path);

  const { selectedSongIds } = state.routes.playlistRoute;

  yield call(
    playlistsGateway.removeSongsFromPlayist,
    playlistId,
    selectedSongIds
  );

  yield call(reloadPlaylist);

  yield put({ type: PLAYLIST_ROUTE__RESET_SELECTED_IDS, payload: {} });
};

export const handleSetPosition = function*(action) {
  const { songId, position } = action.payload;

  yield put({
    type: PLAYLIST_ROUTE__MERGE_REPOSITION_PATCH,
    payload: { [songId]: { position } }
  });

  yield put({
    type: PLAYLIST_ROUTE__APPLY_REPOSITION_PATCH,
    payload: {}
  });
};

export const handleApplyRepositionPatch = function*() {
  const state = yield select();
  const { playlistId } = matchPlaylistRoute(state.router.path);

  const { repositionPatch } = state.routes.playlistRoute;

  yield all(
    Object.entries(repositionPatch)
      .map(([songId, { position }]) => [
        songId,
        call(
          playlistsGateway.setSongPositionInPlaylist,
          playlistId,
          songId,
          position
        )
      ])
      .reduce(
        (resultObject, [key, value]) =>
          Object.assign(resultObject, { [key]: value }),
        {}
      )
  );

  yield call(reloadPlaylist);

  yield all(
    Object.entries(repositionPatch)
      .map(([songId, { position }]) => [
        songId,
        put({
          type: PLAYLIST_ROUTE__REMOVE_FROM_REPOSITION_PATCH,
          payload: { songId, position }
        })
      ])
      .reduce(
        (resultObject, [key, value]) =>
          Object.assign(resultObject, { [key]: value }),
        {}
      )
  );
};

const playlistRoute = function*() {
  yield all([
    takeEvery(ROUTER__ENTERED, handleEntered),
    takeEvery(ROUTER__LEFT, handleLeft),
    takeEvery(PLAYLIST_ROUTE__SET_RATING, handleSetRating),
    takeEvery(PLAYLIST_ROUTE__ADD_SONG, handleAddSong),
    takeEvery(PLAYLIST_ROUTE__DELETE_SELECTED, handleDeleteSelected),
    throttle(50, PLAYLIST_ROUTE__SET_POSITION, handleSetPosition),
    debounce(
      1000,
      PLAYLIST_ROUTE__APPLY_REPOSITION_PATCH,
      handleApplyRepositionPatch
    )
  ]);
};

export default playlistRoute;
