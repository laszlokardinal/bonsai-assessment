import merge from "lodash/merge";
import omit from "lodash/omit";

import {
  PLAYLIST_ROUTE__SET_NEW_SONG_PERFORMER,
  PLAYLIST_ROUTE__SET_NEW_SONG_TITLE,
  PLAYLIST_ROUTE__RESET_NEW_SONG_INPUTS,
  PLAYLIST_ROUTE__TOGGLE_SELECTED_ID,
  PLAYLIST_ROUTE__RESET_SELECTED_IDS,
  PLAYLIST_ROUTE__MERGE_REPOSITION_PATCH,
  PLAYLIST_ROUTE__REMOVE_FROM_REPOSITION_PATCH,
  PLAYLIST_ROUTE__SET_DRAGGING_SONG_ID,
  PLAYLIST_ROUTE__SET_DRAGGING_INDICATOR_SONG_ID
} from "../../actions.js";

const initialState = {
  newSongPerformer: "",
  newSongTitle: "",
  selectedSongIds: [],
  repositionPatch: {},
  draggingSongId: null,
  draggingIndicatorSongId: null
};

const playlistRouteReducer = (state = initialState, action) => {
  switch (action.type) {
    case PLAYLIST_ROUTE__SET_NEW_SONG_PERFORMER:
      return { ...state, newSongPerformer: action.payload.value };

    case PLAYLIST_ROUTE__SET_NEW_SONG_TITLE:
      return { ...state, newSongTitle: action.payload.value };

    case PLAYLIST_ROUTE__RESET_NEW_SONG_INPUTS:
      return { ...state, newSongPerformer: "", newSongTitle: "" };

    case PLAYLIST_ROUTE__TOGGLE_SELECTED_ID:
      return {
        ...state,
        selectedSongIds: state.selectedSongIds.includes(action.payload.songId)
          ? state.selectedSongIds.filter(id => id !== action.payload.songId)
          : state.selectedSongIds.concat(action.payload.songId)
      };

    case PLAYLIST_ROUTE__RESET_SELECTED_IDS:
      return { ...state, selectedSongIds: [] };

    case PLAYLIST_ROUTE__MERGE_REPOSITION_PATCH:
      return {
        ...state,
        repositionPatch: merge({}, state.repositionPatch, action.payload)
      };

    case PLAYLIST_ROUTE__REMOVE_FROM_REPOSITION_PATCH:
      return state.repositionPatch[action.payload.songId] &&
        state.repositionPatch[action.payload.songId].position ===
          action.payload.position
        ? {
            ...state,
            repositionPatch: omit(state.repositionPatch, action.payload.songId)
          }
        : state;

    case PLAYLIST_ROUTE__SET_DRAGGING_SONG_ID:
      return { ...state, draggingSongId: action.payload.songId };

    case PLAYLIST_ROUTE__SET_DRAGGING_INDICATOR_SONG_ID:
      return { ...state, draggingIndicatorSongId: action.payload.songId };
  }

  return state;
};

export default playlistRouteReducer;
