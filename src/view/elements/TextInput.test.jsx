import { TextInput } from "./";

describe("<TextInput />", () => {
  it("matches snapshot", () => {
    const label = "TEST_LABEL";
    const value = "TEST_VALUE";
    const onChange = () => null;

    const wrapper = shallow(
      <TextInput label={label} value={value} onChange={onChange} />
    );

    expect(prettyFormat(wrapper.getElement())).not.to.be.differentFrom(`
<div
  className="wrapper"
>
  <div
    className="label"
  >
    TEST_LABEL
  </div>
  <input
    className="input"
    onChange={[Function]}
    type="text"
    value="TEST_VALUE"
  />
</div>
`);
  });

  it("calls onChange handleron change", () => {
    const label = "";
    const value = "";
    const onChange = sinon.spy();

    const wrapper = shallow(
      <TextInput label={label} value={value} onChange={onChange} />
    );

    wrapper.find("input").simulate("change", {
      target: { value: "TEST_TARGET_VALUE" }
    });

    expect(onChange.args).to.deep.equal([["TEST_TARGET_VALUE"]]);
  });
});
