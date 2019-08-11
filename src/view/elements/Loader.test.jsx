import { Loader } from "./";

describe("<Loader />", () => {
  it("matches snapshot", () => {
    const wrapper = shallow(<Loader loading={false} />);

    expect(prettyFormat(wrapper.getElement())).not.to.be.differentFrom(`
<div
  className="wrapper"
>
  <div
    className="ring"
  />
</div>
`);
  });

  it("adds loading class to wrapper if loading prop is true", () => {
    const wrapper = shallow(<Loader loading={true} />);

    expect(wrapper).to.have.className("loading");
  });
});
