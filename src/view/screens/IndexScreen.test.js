import { IndexScreen } from "./index.js";

const testProps = {
  state: {
    queries: {
      "index-route": {
        initialLoading: false,
        loading: false,
        error: null
      }
    },
    data: {
      songs: {},
      playlists: {
        TEST_PLAYLIST_ID: {
          id: "TEST_PLAYLIST_ID",
          name: "test playlist",
          queryIds: { "index-route": true }
        },
        notToBeIncluded: {
          id: "notToBeIncluded",
          name: "error",
          queryIds: { whatever: true }
        }
      }
    },
    routes: {
      indexRoute: {
        newPlaylistName: "TEST_NEW_PLAYLIST_NAME"
      }
    }
  },
  dispatch: () => null
};

describe("<IndexScreen />", () => {
  it("matches snapshot", () => {
    const wrapper = shallow(<IndexScreen {...testProps} />);

    expect(prettyFormat(wrapper.getElement())).not.to.be.differentFrom(`
<React.Fragment>
  <Loader
    loading={false}
  />
  <Grid>
    <Row>
      <Col
        md={8}
        mdOffset={2}
        xs={12}
      >
        <Title>
          My Playlists
        </Title>
      </Col>
    </Row>
    <Row>
      <Col
        md={8}
        mdOffset={2}
        xs={12}
      >
        <PlaylistsList
          playlists={
            Array [
              Object {
                "id": "TEST_PLAYLIST_ID",
                "name": "test playlist",
                "path": "/playlists/TEST_PLAYLIST_ID",
                "queryIds": Object {
                  "index-route": true,
                },
              },
            ]
          }
        />
      </Col>
    </Row>
    <Row>
      <Col
        md={8}
        mdOffset={2}
        style={
          Object {
            "display": "flex",
            "justifyContent": "flex-end",
          }
        }
        xs={12}
      >
        <TextInput
          label="Playlist name"
          onChange={[Function]}
          value="TEST_NEW_PLAYLIST_NAME"
        />
        <Button
          label="Add"
          onClick={[Function]}
        />
      </Col>
    </Row>
  </Grid>
</React.Fragment>
`);
  });

  describe("when initialLoading is true", () => {
    const stateWithInitialLoadingTrue = {
      ...testProps.state,
      queries: {
        ...testProps.state.queries,
        "index-route": {
          ...testProps.state.queries["index-route"],
          initialLoading: true
        }
      }
    };

    it("sets loader's loading to true", () => {
      const wrapper = shallow(
        <IndexScreen {...testProps} state={stateWithInitialLoadingTrue} />
      );

      expect(wrapper.find("Loader")).to.have.prop("loading", true);
    });

    it("does not render PlaylistsList", () => {
      const wrapper = shallow(
        <IndexScreen {...testProps} state={stateWithInitialLoadingTrue} />
      );

      expect(wrapper.find("PlaylistsList")).not.to.exist;
    });
  });

  describe("when the query is missing", () => {
    const stateWithoutQuery = {
      ...testProps.state,
      queries: {}
    };

    it("sets loader's loading to true", () => {
      const wrapper = shallow(
        <IndexScreen {...testProps} state={stateWithoutQuery} />
      );

      expect(wrapper.find("Loader")).to.have.prop("loading", true);
    });

    it("does not render Playlists", () => {
      const wrapper = shallow(
        <IndexScreen {...testProps} state={stateWithoutQuery} />
      );

      expect(wrapper.find("PlaylistsList")).not.to.exist;
    });
  });

  describe("playlist name TextInput's onchange", () => {
    it("dispatches INDEX_ROUTE__SET_NEW_PLAYLIST_TITLE", () => {
      const dispatch = sinon.spy();

      const wrapper = shallow(
        <IndexScreen {...testProps} dispatch={dispatch} />
      );

      expect(dispatch).not.to.have.been.called;

      wrapper
        .find("TextInput[label='Playlist name']")
        .simulate("change", "TEST_VALUE");

      expect(dispatch).to.have.been.calledOnce;
      expect(dispatch).to.have.been.calledWith({
        type: "INDEX_ROUTE__SET_NEW_PLAYLIST_TITLE",
        payload: { value: "TEST_VALUE" }
      });
    });
  });

  describe("add Button's onClick", () => {
    it("dispatches INDEX_ROUTE__CREATE_PLAYLIST", () => {
      const dispatch = sinon.spy();

      const wrapper = shallow(
        <IndexScreen {...testProps} dispatch={dispatch} />
      );

      expect(dispatch).not.to.have.been.called;

      wrapper.find("Button[label='Add']").simulate("click");

      expect(dispatch).to.have.been.calledOnce;
      expect(dispatch).to.have.been.calledWith({
        type: "INDEX_ROUTE__CREATE_PLAYLIST",
        payload: {}
      });
    });
  });
});
