import { App } from "./";
import { RouterProvider } from "reduxen-react-dom";

import { IndexScreen, PlaylistScreen } from "./screens";

describe("<App />", () => {
  it("renders a RouterProvider", () => {
    const state = { router: { path: "", query: {}, hash: "" } };
    const dispatch = () => null;

    const wrapper = shallow(<App state={state} dispatch={dispatch} />);

    expect(wrapper).to.have.type(RouterProvider);

    expect(wrapper)
      .to.have.prop("router")
      .equal(state.router);

    expect(wrapper)
      .to.have.prop("dispatch")
      .equal(dispatch);
  });

  it("renders IndexScreen on /", () => {
    const state = { router: { path: "/", query: {}, hash: "" } };
    const dispatch = () => null;

    const wrapper = shallow(<App state={state} dispatch={dispatch} />);

    expect(wrapper.children()).to.have.length(1);
    expect(wrapper.children()).to.have.type(IndexScreen);
    expect(wrapper.children()).to.have.prop("state", state);
    expect(wrapper.children()).to.have.prop("dispatch", dispatch);
  });

  it("renders PlaylistScreen on /playlists/:id", () => {
    const state = { router: { path: "/playlists/test", query: {}, hash: "" } };
    const dispatch = () => null;

    const wrapper = shallow(<App state={state} dispatch={dispatch} />);

    expect(wrapper.children()).to.have.length(1);
    expect(wrapper.children()).to.have.type(PlaylistScreen);
    expect(wrapper.children()).to.have.prop("state", state);
    expect(wrapper.children()).to.have.prop("dispatch", dispatch);
  });
});
