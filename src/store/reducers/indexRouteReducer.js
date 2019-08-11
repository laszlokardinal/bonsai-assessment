import { INDEX_ROUTE__SET_NEW_PLAYLIST_TITLE } from "../../actions.js";

const initialState = {
  newPlaylistName: ""
};

const indexRouteReducer = (state = initialState, action) => {
  switch (action.type) {
    case INDEX_ROUTE__SET_NEW_PLAYLIST_TITLE:
      return { ...state, newPlaylistName: action.payload.value };
  }

  return state;
};

export default indexRouteReducer;
