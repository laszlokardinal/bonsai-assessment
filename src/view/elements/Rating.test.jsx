import { Rating } from "./";

describe("<Rating />", () => {
  it("matches snapshot", () => {
    const rating = 3;
    const onChange = () => null;

    const wrapper = shallow(<Rating rating={rating} onChange={onChange} />);

    expect(prettyFormat(wrapper.getElement())).not.to.be.differentFrom(`
<div
  className="wrapper"
>
  <div
    className="displayWrapper"
  >
    <i
      className="material-icons md-18 active"
    >
      star
    </i>
    <i
      className="material-icons md-18 active"
    >
      star
    </i>
    <i
      className="material-icons md-18 active"
    >
      star
    </i>
    <i
      className="material-icons md-18"
    >
      star
    </i>
    <i
      className="material-icons md-18"
    >
      star
    </i>
  </div>
  <div
    className="buttonWrapper"
  >
    <i
      className="material-icons md-18 iconButton"
      onClick={[Function]}
    >
      star
    </i>
    <i
      className="material-icons md-18 iconButton"
      onClick={[Function]}
    >
      star
    </i>
    <i
      className="material-icons md-18 iconButton"
      onClick={[Function]}
    >
      star
    </i>
    <i
      className="material-icons md-18 iconButton"
      onClick={[Function]}
    >
      star
    </i>
    <i
      className="material-icons md-18 iconButton"
      onClick={[Function]}
    >
      star
    </i>
  </div>
</div>
`);
  });

  it("calls onClick on clicking on stars", () => {
    const rating = 3;
    const onChange = sinon.spy();

    const wrapper = shallow(<Rating rating={rating} onChange={onChange} />);

    wrapper
      .find(".iconButton")
      .at(4)
      .simulate("click");
    wrapper
      .find(".iconButton")
      .at(3)
      .simulate("click");
    wrapper
      .find(".iconButton")
      .at(2)
      .simulate("click");
    wrapper
      .find(".iconButton")
      .at(1)
      .simulate("click");
    wrapper
      .find(".iconButton")
      .at(0)
      .simulate("click");

    expect(onChange.args).to.deep.equal([[5], [4], [3], [2], [1]]);
  });
});
