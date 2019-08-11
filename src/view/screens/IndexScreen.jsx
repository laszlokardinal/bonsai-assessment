import React from "react";
import PropTypes from "prop-types";
import { Grid, Row, Col } from "react-flexbox-grid";

import sortBy from "lodash/sortBy";

import { Button, Loader, TextInput, Title } from "../elements";
import { PlaylistsList } from "../components";

import {
  INDEX_ROUTE__SET_NEW_PLAYLIST_TITLE,
  INDEX_ROUTE__CREATE_PLAYLIST
} from "../../actions.js";

const IndexScreen = ({ state, dispatch }) => {
  const initialLoading = state.queries["index-route"]
    ? state.queries["index-route"].initialLoading
    : true;

  const playlists = Object.values(state.data.playlists)
    .filter(playlist => playlist.queryIds["index-route"])
    .map(playlist => ({ ...playlist, path: `/playlists/${playlist.id}` }));

  const sortedPlaylists = sortBy(playlists, "index");

  const newPlaylistName = state.routes.indexRoute.newPlaylistName;

  return (
    <React.Fragment>
      <Loader loading={initialLoading} />
      <Grid>
        <Row>
          <Col xs={12} md={8} mdOffset={2}>
            <Title>My Playlists</Title>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={8} mdOffset={2}>
            {!initialLoading ? (
              <PlaylistsList playlists={sortedPlaylists} />
            ) : null}
          </Col>
        </Row>
        <Row>
          <Col
            xs={12}
            md={8}
            mdOffset={2}
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <TextInput
              label="Playlist name"
              value={newPlaylistName}
              onChange={value =>
                dispatch({
                  type: INDEX_ROUTE__SET_NEW_PLAYLIST_TITLE,
                  payload: { value }
                })
              }
            />
            <Button
              label="Add"
              onClick={() =>
                dispatch({
                  type: INDEX_ROUTE__CREATE_PLAYLIST,
                  payload: {}
                })
              }
            />
          </Col>
        </Row>
      </Grid>
    </React.Fragment>
  );
};

IndexScreen.propTypes = {
  state: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
};

export default IndexScreen;
