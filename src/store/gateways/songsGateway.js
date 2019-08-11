import { call } from "redux-saga/effects";

import { apiService } from "../services";

class songsGateway {
  static *setRating(songId, rating) {
    yield call(apiService.request, "patch", `/songs/${songId}`, { rating });
  }
}

export default songsGateway;
