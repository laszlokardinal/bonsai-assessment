import { PlaylistScreen } from "./index.js";

const testProps = {
  state: {
    queries: {
      "playlist-route": {
        initialLoading: false,
        loading: false,
        error: null
      }
    },
    data: {
      songs: {
        id1: {
          id: "id1",
          position: 3,
          performer: "test performer 1",
          title: "test title 1",
          rating: 1,
          queryIds: { "playlist-route": true }
        },
        id2: {
          id: "id2",
          position: 1,
          performer: "test performer 2",
          title: "test title 2",
          rating: 2,
          queryIds: { "playlist-route": true }
        },
        id3: {
          id: "id3",
          position: 2,
          performer: "test performer 3",
          title: "test title 3",
          rating: 3,
          queryIds: { "playlist-route": true }
        },
        notToBeIncluded: {
          id: "notToBeIncluded",
          position: 6,
          performer: "error",
          title: " error",
          rating: 3,
          queryIds: { whatever: true }
        }
      },
      playlists: {
        TEST_PLAYLIST_ID: {
          id: "TEST_PLAYLIST_ID",
          name: "test playlist",
          queryIds: { "playlist-route": true }
        },
        notToBeIncluded: {
          id: "notToBeIncluded",
          name: "error",
          queryIds: { whatever: true }
        }
      }
    },
    routes: {
      playlistRoute: {
        selectedSongIds: ["TEST_SELECTED_SONG_ID_1", "TEST_SELECTED_SONG_ID_2"],
        newSongPerformer: "TEST_NEW_SONG_PERFORMER",
        newSongTitle: "TEST_NEW_SONG_TITLE",
        draggingSongId: "TEST_DRAGGING_SONG_ID",
        draggingIndicatorSongId: "TEST_DRAGGING_INDICATOR_SONG_ID",
        repositionPatch: {
          id3: { position: 4 }
        }
      }
    }
  },
  dispatch: () => null
};

describe("<PlaylistScreen />", () => {
  it("matches snapshot", () => {
    const wrapper = shallow(<PlaylistScreen {...testProps} />);

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
        style={
          Object {
            "display": "flex",
          }
        }
        xs={12}
      >
        <Title
          backLink="/"
        >
          test playlist
        </Title>
        <Button
          label="Delete selected songs"
          onClick={[Function]}
          red={true}
        />
      </Col>
    </Row>
    <Row>
      <Col
        md={8}
        mdOffset={2}
        xs={12}
      >
        <SongsList
          draggingIndicatorSongId="TEST_DRAGGING_INDICATOR_SONG_ID"
          draggingSongId="TEST_DRAGGING_SONG_ID"
          onRatingChange={[Function]}
          onSetDraggingIndicatorSongId={[Function]}
          onSetDraggingSongId={[Function]}
          onSetPosition={[Function]}
          onToggleSelectedId={[Function]}
          selectedSongIds={
            Array [
              "TEST_SELECTED_SONG_ID_1",
              "TEST_SELECTED_SONG_ID_2",
            ]
          }
          songs={
            Array [
              Object {
                "id": "id2",
                "name": "test performer 2 - test title 2",
                "performer": "test performer 2",
                "position": 1,
                "queryIds": Object {
                  "playlist-route": true,
                },
                "rating": 2,
                "title": "test title 2",
              },
              Object {
                "id": "id1",
                "name": "test performer 1 - test title 1",
                "performer": "test performer 1",
                "position": 3,
                "queryIds": Object {
                  "playlist-route": true,
                },
                "rating": 1,
                "title": "test title 1",
              },
              Object {
                "id": "id3",
                "name": "test performer 3 - test title 3",
                "performer": "test performer 3",
                "position": 4,
                "queryIds": Object {
                  "playlist-route": true,
                },
                "rating": 3,
                "title": "test title 3",
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
          label="Song Performer"
          onChange={[Function]}
          value="TEST_NEW_SONG_PERFORMER"
        />
        <TextInput
          label="Song Title"
          onChange={[Function]}
          value="TEST_NEW_SONG_TITLE"
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
        "playlist-route": {
          ...testProps.state.queries["playlist-route"],
          initialLoading: true
        }
      }
    };

    it("sets loader's loading to true", () => {
      const wrapper = shallow(
        <PlaylistScreen {...testProps} state={stateWithInitialLoadingTrue} />
      );

      expect(wrapper.find("Loader")).to.have.prop("loading", true);
    });

    it("does not render SongsList", () => {
      const wrapper = shallow(
        <PlaylistScreen {...testProps} state={stateWithInitialLoadingTrue} />
      );

      expect(wrapper.find("SongsList")).not.to.exist;
    });
  });

  describe("when the query is missing", () => {
    const stateWithoutQuery = {
      ...testProps.state,
      queries: {}
    };

    it("sets loader's loading to true", () => {
      const wrapper = shallow(
        <PlaylistScreen {...testProps} state={stateWithoutQuery} />
      );

      expect(wrapper.find("Loader")).to.have.prop("loading", true);
    });

    it("does not render SongsList", () => {
      const wrapper = shallow(
        <PlaylistScreen {...testProps} state={stateWithoutQuery} />
      );

      expect(wrapper.find("SongsList")).not.to.exist;
    });
  });

  describe("when the playlist is not loaded yet", () => {
    const stateWithoutData = {
      ...testProps.state,
      data: {
        playlists: {},
        songs: {}
      }
    };

    it("renders the title with an empty string as label", () => {
      const wrapper = shallow(
        <PlaylistScreen {...testProps} state={stateWithoutData} />
      );

      expect(wrapper.find("Title")).to.have.prop("children", "");
    });
  });

  describe("if there are no selected items", () => {
    it("does not render delete button", () => {
      const stateWithEmptySelectedSongIds = {
        ...testProps.state,
        routes: {
          ...testProps.state.routes,
          playlistRoute: {
            ...testProps.state.routes.playlistRoute,
            selectedSongIds: []
          }
        }
      };

      const wrapper = shallow(
        <PlaylistScreen {...testProps} state={stateWithEmptySelectedSongIds} />
      );

      expect(wrapper.find("Button[red]")).not.to.exist;
    });
  });

  describe("delete button's onclick", () => {
    it("dispatches PLAYLIST_ROUTE__DELETE_SELECTED", () => {
      const dispatch = sinon.spy();

      const wrapper = shallow(
        <PlaylistScreen {...testProps} dispatch={dispatch} />
      );

      expect(dispatch).not.to.have.been.called;

      wrapper.find("Button[red]").simulate("click");

      expect(dispatch).to.have.been.calledOnce;
      expect(dispatch).to.have.been.calledWith({
        type: "PLAYLIST_ROUTE__DELETE_SELECTED",
        payload: {}
      });
    });
  });

  describe("SongsList's onRatingChange", () => {
    it("dispatches PLAYLIST_ROUTE__SET_RATING", () => {
      const dispatch = sinon.spy();

      const wrapper = shallow(
        <PlaylistScreen {...testProps} dispatch={dispatch} />
      );

      expect(dispatch).not.to.have.been.called;

      wrapper
        .find("SongsList")
        .simulate("ratingChange", "TEST_SONG_ID", "TEST_RATING");

      expect(dispatch).to.have.been.calledOnce;
      expect(dispatch).to.have.been.calledWith({
        type: "PLAYLIST_ROUTE__SET_RATING",
        payload: {
          songId: "TEST_SONG_ID",
          rating: "TEST_RATING"
        }
      });
    });
  });

  describe("SongsList's onToggleSelectedId", () => {
    it("dispatches PLAYLIST_ROUTE__TOGGLE_SELECTED_ID", () => {
      const dispatch = sinon.spy();

      const wrapper = shallow(
        <PlaylistScreen {...testProps} dispatch={dispatch} />
      );

      expect(dispatch).not.to.have.been.called;

      wrapper.find("SongsList").simulate("toggleSelectedId", "TEST_SONG_ID");

      expect(dispatch).to.have.been.calledOnce;
      expect(dispatch).to.have.been.calledWith({
        type: "PLAYLIST_ROUTE__TOGGLE_SELECTED_ID",
        payload: { songId: "TEST_SONG_ID" }
      });
    });
  });

  describe("SongsList's onSetDraggingSongId", () => {
    it("dispatches PLAYLIST_ROUTE__SET_DRAGGING_SONG_ID", () => {
      const dispatch = sinon.spy();

      const wrapper = shallow(
        <PlaylistScreen {...testProps} dispatch={dispatch} />
      );

      expect(dispatch).not.to.have.been.called;

      wrapper.find("SongsList").simulate("setDraggingSongId", "TEST_SONG_ID");

      expect(dispatch).to.have.been.calledOnce;
      expect(dispatch).to.have.been.calledWith({
        type: "PLAYLIST_ROUTE__SET_DRAGGING_SONG_ID",
        payload: { songId: "TEST_SONG_ID" }
      });
    });
  });

  describe("SongsList's onSetDraggingIndicatorSongId", () => {
    it("dispatches PLAYLIST_ROUTE__SET_DRAGGING_INDICATOR_SONG_ID", () => {
      const dispatch = sinon.spy();

      const wrapper = shallow(
        <PlaylistScreen {...testProps} dispatch={dispatch} />
      );

      expect(dispatch).not.to.have.been.called;

      wrapper
        .find("SongsList")
        .simulate("setDraggingIndicatorSongId", "TEST_SONG_ID");

      expect(dispatch).to.have.been.calledOnce;
      expect(dispatch).to.have.been.calledWith({
        type: "PLAYLIST_ROUTE__SET_DRAGGING_INDICATOR_SONG_ID",
        payload: { songId: "TEST_SONG_ID" }
      });
    });
  });

  describe("SongsList's onSetPosition", () => {
    it("dispatches PLAYLIST_ROUTE__SET_POSITION", () => {
      const dispatch = sinon.spy();

      const wrapper = shallow(
        <PlaylistScreen {...testProps} dispatch={dispatch} />
      );

      expect(dispatch).not.to.have.been.called;

      wrapper
        .find("SongsList")
        .simulate("setPosition", "TEST_SONG_ID", "TEST_POSITION");

      expect(dispatch).to.have.been.calledOnce;
      expect(dispatch).to.have.been.calledWith({
        type: "PLAYLIST_ROUTE__SET_POSITION",
        payload: { songId: "TEST_SONG_ID", position: "TEST_POSITION" }
      });
    });
  });

  describe("performer TextInput's onchange", () => {
    it("dispatches PLAYLIST_ROUTE__SET_NEW_SONG_PERFORMER", () => {
      const dispatch = sinon.spy();

      const wrapper = shallow(
        <PlaylistScreen {...testProps} dispatch={dispatch} />
      );

      expect(dispatch).not.to.have.been.called;

      wrapper
        .find("TextInput[label='Song Performer']")
        .simulate("change", "TEST_VALUE");

      expect(dispatch).to.have.been.calledOnce;
      expect(dispatch).to.have.been.calledWith({
        type: "PLAYLIST_ROUTE__SET_NEW_SONG_PERFORMER",
        payload: { value: "TEST_VALUE" }
      });
    });
  });

  describe("title TextInput's onchange", () => {
    it("dispatches PLAYLIST_ROUTE__SET_NEW_SONG_TITLE", () => {
      const dispatch = sinon.spy();

      const wrapper = shallow(
        <PlaylistScreen {...testProps} dispatch={dispatch} />
      );

      expect(dispatch).not.to.have.been.called;

      wrapper
        .find("TextInput[label='Song Title']")
        .simulate("change", "TEST_VALUE");

      expect(dispatch).to.have.been.calledOnce;
      expect(dispatch).to.have.been.calledWith({
        type: "PLAYLIST_ROUTE__SET_NEW_SONG_TITLE",
        payload: { value: "TEST_VALUE" }
      });
    });
  });

  describe("add Button's onClick", () => {
    it("dispatches PLAYLIST_ROUTE__ADD_SONG", () => {
      const dispatch = sinon.spy();

      const wrapper = shallow(
        <PlaylistScreen {...testProps} dispatch={dispatch} />
      );

      expect(dispatch).not.to.have.been.called;

      wrapper.find("Button[label='Add']").simulate("click");

      expect(dispatch).to.have.been.calledOnce;
      expect(dispatch).to.have.been.calledWith({
        type: "PLAYLIST_ROUTE__ADD_SONG",
        payload: {}
      });
    });
  });
});
