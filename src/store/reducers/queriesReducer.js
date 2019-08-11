import omit from "lodash/omit";

import {
  QUERY__LOAD,
  QUERY__LOAD_SUCCESS,
  QUERY__LOAD_FAILURE,
  QUERY__RELEASE
} from "../../actions";

const queriesReducer = (state = {}, action) => {
  switch (action.type) {
    case QUERY__LOAD:
      return {
        ...state,
        [action.payload.queryId]: {
          initialLoading: !action.payload.reload,
          loading: true,
          error: null
        }
      };

    case QUERY__LOAD_SUCCESS:
      return {
        ...state,
        [action.payload.queryId]: {
          initialLoading: false,
          loading: false,
          error: null
        }
      };

    case QUERY__LOAD_FAILURE:
      return {
        ...state,
        [action.payload.queryId]: {
          initialLoading: false,
          loading: false,
          error: action.payload.error
        }
      };

    case QUERY__RELEASE:
      return omit(state, action.payload.queryId);
  }

  return state;
};

export default queriesReducer;
