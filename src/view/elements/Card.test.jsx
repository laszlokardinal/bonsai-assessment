import { Card } from "./";

describe("<Card />", () => {
  it("matches snapshot", () => {
    const className = "TEST_CLASSNAME";

    const wrapper = shallow(<Card className={className}>TEST_CHILDREN</Card>);

    expect(prettyFormat(wrapper.getElement())).not.to.be.differentFrom(`
<div
  className="wrapper TEST_CLASSNAME"
>
  TEST_CHILDREN
</div>
`);
  });

  it("adds clickable class if clickable prop is true", () => {
    const wrapper = shallow(<Card clickable>TEST_CHILDREN</Card>);

    expect(wrapper).to.have.className("clickable");
  });

  it("sets the wrapper div draggable if draggable prop is true", () => {
    const wrapper = shallow(<Card draggable>TEST_CHILDREN</Card>);

    expect(wrapper).to.have.prop("draggable", true);
  });

  it("adds drag handlers", () => {
    const handleDragStart = () => null;
    const handleDragOver = () => null;
    const handleMouseMove = () => null;
    const handleMouseLeave = () => null;

    const wrapper = shallow(
      <Card
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        TEST_CHILDREN
      </Card>
    );

    expect(wrapper).to.have.prop("onDragOver", handleDragOver);
    expect(wrapper).to.have.prop("onDragStart", handleDragStart);
    expect(wrapper).to.have.prop("onMouseMove", handleMouseMove);
    expect(wrapper).to.have.prop("onMouseLeave", handleMouseLeave);
  });
});
