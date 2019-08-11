import omit from "lodash/omit";
import merge from "lodash/merge";

import { QUERY__LOAD_SUCCESS, QUERY__RELEASE } from "../../actions";

const createDataReducer = dataType => (state = {}, action) => {
  const queryId = action.payload ? action.payload.queryId : "";
  const data = action.payload ? action.payload.data : {};

  switch (action.type) {
    case QUERY__LOAD_SUCCESS: {
      if (!data[dataType]) {
        return state;
      }

      const filteredRecords = Object.values(state)
        .map(record =>
          record.queryIds[queryId]
            ? { ...record, queryIds: omit(record.queryIds, queryId) }
            : record
        )
        .filter(record => Object.keys(record.queryIds).length)
        .reduce(
          (resultObject, record) =>
            Object.assign(resultObject, { [record.id]: record }),
          {}
        );

      const newRecordsWithQueryIds = Object.values(data[dataType])
        .map(record => ({ ...record, queryIds: { [queryId]: true } }))
        .reduce(
          (resultObject, record) =>
            Object.assign(resultObject, { [record.id]: record }),
          {}
        );

      return merge({}, filteredRecords, newRecordsWithQueryIds);
    }

    case QUERY__RELEASE: {
      if (!Object.values(state).some(record => record.queryIds[queryId])) {
        return state;
      }

      return Object.values(state)
        .map(record =>
          record.queryIds[queryId]
            ? { ...record, queryIds: omit(record.queryIds, queryId) }
            : record
        )
        .filter(record => Object.keys(record.queryIds).length)
        .reduce(
          (resultObject, record) =>
            Object.assign(resultObject, { [record.id]: record }),
          {}
        );
    }
  }

  return state;
};

export default createDataReducer;
