import React from "react";
import PropTypes from "prop-types";
import { Grid, Row, Col } from "react-flexbox-grid";
import { Button, Loader, Title, TextInput } from "../elements";
import { SongsList } from "../components";

import sortBy from "lodash/sortBy";
import merge from "lodash/merge";

import {
  PLAYLIST_ROUTE__SET_RATING,
  PLAYLIST_ROUTE__TOGGLE_SELECTED_ID,
  PLAYLIST_ROUTE__DELETE_SELECTED,
  PLAYLIST_ROUTE__SET_NEW_SONG_PERFORMER,
  PLAYLIST_ROUTE__SET_NEW_SONG_TITLE,
  PLAYLIST_ROUTE__SET_DRAGGING_SONG_ID,
  PLAYLIST_ROUTE__SET_DRAGGING_INDICATOR_SONG_ID,
  PLAYLIST_ROUTE__SET_POSITION,
  PLAYLIST_ROUTE__ADD_SONG
} from "../../actions.js";

const PlaylistScreen = ({ state, dispatch }) => {
  const initialLoading = state.queries["playlist-route"]
    ? state.queries["playlist-route"].initialLoading
    : true;

  const playlist = Object.values(state.data.playlists).filter(
    playlist => playlist.queryIds["playlist-route"]
  )[0] || { name: "" };

  const songsWithRespositionPatch = merge(
    {},
    state.data.songs,
    state.routes.playlistRoute.repositionPatch
  );

  const songs = Object.values(songsWithRespositionPatch)
    .filter(song => song.queryIds && song.queryIds["playlist-route"])
    .map(song => ({ ...song, name: song.performer + " - " + song.title }));

  const sortedSongs = sortBy(songs, "position");

  const {
    selectedSongIds,
    newSongPerformer,
    newSongTitle,
    draggingSongId,
    draggingIndicatorSongId
  } = state.routes.playlistRoute;

  return (
    <React.Fragment>
      <Loader loading={initialLoading} />
      <Grid>
        <Row>
          <Col xs={12} md={8} mdOffset={2} style={{ display: "flex" }}>
            <Title backLink="/">{playlist.name}</Title>
            {selectedSongIds.length ? (
              <Button
                onClick={() =>
                  dispatch({
                    type: PLAYLIST_ROUTE__DELETE_SELECTED,
                    payload: {}
                  })
                }
                label="Delete selected songs"
                red
              />
            ) : null}
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={8} mdOffset={2}>
            {!initialLoading ? (
              <SongsList
                songs={sortedSongs}
                selectedSongIds={selectedSongIds}
                draggingSongId={draggingSongId}
                draggingIndicatorSongId={draggingIndicatorSongId}
                onRatingChange={(songId, rating) =>
                  dispatch({
                    type: PLAYLIST_ROUTE__SET_RATING,
                    payload: { songId, rating }
                  })
                }
                onToggleSelectedId={songId =>
                  dispatch({
                    type: PLAYLIST_ROUTE__TOGGLE_SELECTED_ID,
                    payload: { songId }
                  })
                }
                onSetDraggingSongId={songId =>
                  dispatch({
                    type: PLAYLIST_ROUTE__SET_DRAGGING_SONG_ID,
                    payload: { songId }
                  })
                }
                onSetDraggingIndicatorSongId={songId =>
                  dispatch({
                    type: PLAYLIST_ROUTE__SET_DRAGGING_INDICATOR_SONG_ID,
                    payload: { songId }
                  })
                }
                onSetPosition={(songId, position) =>
                  dispatch({
                    type: PLAYLIST_ROUTE__SET_POSITION,
                    payload: { songId, position }
                  })
                }
              />
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
              label="Song Performer"
              value={newSongPerformer}
              onChange={value =>
                dispatch({
                  type: PLAYLIST_ROUTE__SET_NEW_SONG_PERFORMER,
                  payload: { value }
                })
              }
            />
            <TextInput
              label="Song Title"
              value={newSongTitle}
              onChange={value =>
                dispatch({
                  type: PLAYLIST_ROUTE__SET_NEW_SONG_TITLE,
                  payload: { value }
                })
              }
            />
            <Button
              label="Add"
              onClick={() =>
                dispatch({
                  type: PLAYLIST_ROUTE__ADD_SONG,
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

PlaylistScreen.propTypes = {
  state: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
};

export default PlaylistScreen;
