import React from "react";
import PropTypes from "prop-types";

import { RouterProvider } from "reduxen-react-dom";

const App = ({ state, dispatch }) => (
  <RouterProvider router={state.router} dispatch={dispatch} />
);

App.propTypes = {
  state: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
};

export default App;
