import React from "react";
import PropTypes from "prop-types";
import { match } from "reduxen";

import { RouterProvider } from "reduxen-react-dom";

import { IndexScreen } from "./screens";

const App = ({ state, dispatch }) => {
  const matchIndexRoute = match("/", state.router.path);

  return (
    <RouterProvider router={state.router} dispatch={dispatch}>
      {matchIndexRoute ? (
        <IndexScreen state={state} dispatch={dispatch} />
      ) : null}
    </RouterProvider>
  );
};

App.propTypes = {
  state: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
};

export default App;
