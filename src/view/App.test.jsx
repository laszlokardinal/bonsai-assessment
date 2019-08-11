import { App } from "./";
import { RouterProvider } from "reduxen-react-dom";

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

  /*
  it("matches snapshot", () => {
    const wrapper = shallow(<App state={{}} dispatch={() => null} />);

    expect(prettyFormat(wrapper.getElement)).not.to.be.differentFrom(`
<div
  className="wrapper"
/>
`);
  });
*/
});
