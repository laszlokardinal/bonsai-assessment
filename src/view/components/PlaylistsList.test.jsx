import { PlaylistsList } from "./";

describe("<PlaylistsList />", () => {
  describe("with playlists", () => {
    it("matches snapshot", () => {
      const playlists = [
        { id: 1, name: "TEST NAME 1", path: "/test-path-1" },
        { id: 2, name: "TEST NAME 2", path: "/test-path-2" },
        { id: 3, name: "TEST NAME 3", path: "/test-path-3" }
      ];

      const wrapper = shallow(<PlaylistsList playlists={playlists} />);

      expect(prettyFormat(wrapper.getElement())).not.to.be.differentFrom(`
<React.Fragment>
  <Link
    className="link"
    to="/test-path-1"
  >
    <Card
      className="card"
      clickable={true}
    >
      <div
        className="title"
      >
        TEST NAME 1
      </div>
    </Card>
  </Link>
  <Link
    className="link"
    to="/test-path-2"
  >
    <Card
      className="card"
      clickable={true}
    >
      <div
        className="title"
      >
        TEST NAME 2
      </div>
    </Card>
  </Link>
  <Link
    className="link"
    to="/test-path-3"
  >
    <Card
      className="card"
      clickable={true}
    >
      <div
        className="title"
      >
        TEST NAME 3
      </div>
    </Card>
  </Link>
</React.Fragment>
`);
    });
  });

  describe("without playlists", () => {
    it("matches snapshot", () => {
      const playlists = [];

      const wrapper = shallow(<PlaylistsList playlists={playlists} />);

      expect(prettyFormat(wrapper.getElement())).not.to.be.differentFrom(`
<React.Fragment>
  <div
    className="empty"
  >
    There are no playlists yet
  </div>
</React.Fragment>
`);
    });
  });
});
