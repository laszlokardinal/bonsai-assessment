import { call } from "redux-saga/effects";
import axios from "axios";

class apiService {
  static *request(method, path, data) {
    try {
      const response = yield call(axios, {
        method,
        data,
        url: process.env.API_BASE_URL + path,
        headers: { "access-token": process.env.API_TOKEN }
      });

      return response.data;
    } catch (error) {
      if (error.response) {
        throw {
          status: error.response.status,
          networkError: false,
          data: error.response.data
        };
      }

      throw {
        status: null,
        networkError: true,
        data: {}
      };
    }
  }
}

export default apiService;
