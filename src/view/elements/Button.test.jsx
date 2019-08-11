import { Button } from "./";

describe("<Button />", () => {
  it("matches snapshot", () => {
    const label = "TEST_LABEL";
    const onClick = () => null;

    const wrapper = shallow(<Button label={label} onClick={onClick} />);

    expect(prettyFormat(wrapper.getElement())).not.to.be.differentFrom(`
<button
  className="button"
  onClick={[Function]}
  type="button"
>
  TEST_LABEL
</button>
`);
  });

  it("adds red class if red prop is true", () => {
    const label = "TEST_LABEL";
    const onClick = () => null;

    const wrapper = shallow(<Button label={label} onClick={onClick} red />);

    expect(wrapper).to.have.className("red");
  });

  it("calls onClick prop on click", () => {
    const label = "";
    const onClick = sinon.spy();

    const wrapper = shallow(<Button label={label} onClick={onClick} red />);

    wrapper.simulate("click");

    expect(onClick).to.have.been.calledOnce;
  });
});
