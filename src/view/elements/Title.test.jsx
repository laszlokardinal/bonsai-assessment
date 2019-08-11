import { Title } from "./";

describe("<Title />", () => {
  it("matches snapshot without backLink", () => {
    const wrapper = shallow(<Title>TEST_CHILDREN</Title>);

    expect(prettyFormat(wrapper.getElement())).not.to.be.differentFrom(`
<div
  className="wrapper"
>
  <h1
    className="title"
  >
    TEST_CHILDREN
  </h1>
</div>
`);
  });

  it("matches snapshot with backLink", () => {
    const backLink = "/TEST_BACKLINK";
    const wrapper = shallow(<Title backLink={backLink}>TEST_CHILDREN</Title>);

    expect(prettyFormat(wrapper.getElement())).not.to.be.differentFrom(`
<div
  className="wrapper"
>
  <Link
    className="link"
    to="/TEST_BACKLINK"
  >
    <i
      className="material-icons"
    >
      keyboard_arrow_left
    </i>
  </Link>
  <h1
    className="title"
  >
    TEST_CHILDREN
  </h1>
</div>
`);
  });
});
