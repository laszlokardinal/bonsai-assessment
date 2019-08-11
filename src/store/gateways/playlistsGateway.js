import { call, put, all } from "redux-saga/effects";

import { apiService } from "../services";

import {
  QUERY__LOAD,
  QUERY__LOAD_SUCCESS,
  QUERY__LOAD_FAILURE
} from "../../actions.js";

class playlistsGateway {
  static *loadPlaylists(queryId, { reload = false } = {}) {
    yield put({ type: QUERY__LOAD, payload: { queryId, reload } });

    try {
      const responseData = yield call(apiService.request, "get", "/playlists");
      const playlists = responseData.playlists;

      const flatPlaylists = playlists.reduce(
        (resultObject, playlist, index) =>
          Object.assign(resultObject, {
            [playlist.id]: {
              id: playlist.id,
              name: playlist.name,
              index
            }
          }),
        {}
      );

      yield put({
        type: QUERY__LOAD_SUCCESS,
        payload: {
          queryId,
          data: {
            playlists: flatPlaylists
          }
        }
      });
    } catch (error) {
      yield put({ type: QUERY__LOAD_FAILURE, payload: { queryId, error } });
    }
  }

  static *loadPlaylist(queryId, playlistId, { reload = false } = {}) {
    try {
      yield put({ type: QUERY__LOAD, payload: { queryId, reload } });

      const [playlistResponseData, songsResponseData] = yield all([
        call(apiService.request, "get", `/playlists/${playlistId}`),
        call(apiService.request, "get", "/songs")
      ]);

      const playlist = playlistResponseData.playlist;
      const songs = songsResponseData.songs;

      const playlistSongIds = playlist.songs.map(({ songId }) => songId);

      const playlistSongPositions = playlist.songs.reduce(
        (resultObject, song) =>
          Object.assign(resultObject, { [song.songId]: song.position }),
        {}
      );

      const playlistSongs = songs
        .filter(({ id }) => playlistSongIds.includes(id))
        .map(song => ({
          id: song.id,
          title: song.title || "",
          performer: song.performer || "",
          rating: song.rating == null ? 0 : song.rating,
          position: playlistSongPositions[song.id]
        }));

      const flatSongs = playlistSongs.reduce(
        (resultObject, song) =>
          Object.assign(resultObject, { [song.id]: song }),
        {}
      );

      const flatPlaylists = {
        [playlist.id]: {
          id: playlist.id,
          name: playlist.name
        }
      };

      yield put({
        type: QUERY__LOAD_SUCCESS,
        payload: {
          queryId,
          data: {
            playlists: flatPlaylists,
            songs: flatSongs
          }
        }
      });
    } catch (error) {
      yield put({ type: QUERY__LOAD_FAILURE, payload: { queryId, error } });
    }
  }

  static *createNewPlaylist(name) {
    const playlist = { name, songs: [] };

    yield call(apiService.request, "post", "/playlists", playlist);
  }

  static *addNewSongToPlaylist(playlistId, performer, title, position) {
    const song = { performer, title };

    const responseData = yield call(apiService.request, "post", "/songs", song);

    yield call(apiService.request, "post", `/playlists/${playlistId}/songs`, {
      songId: responseData.song.id,
      position
    });
  }

  static *setSongPositionInPlaylist(playlistId, songId, position) {
    yield call(
      apiService.request,
      "patch",
      `/playlists/${playlistId}/songs/${songId}`,
      { position }
    );
  }

  static *removeSongsFromPlayist(playlistId, songIds) {
    yield all(
      songIds.map(songId =>
        call(
          apiService.request,
          "delete",
          `/playlists/${playlistId}/songs/${songId}`
        )
      )
    );
  }
}

export default playlistsGateway;
