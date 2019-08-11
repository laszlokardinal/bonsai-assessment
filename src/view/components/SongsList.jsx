import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { Card, Rating } from "../elements";

import style from "./SongsList.css";

const SongsList = ({
  songs,
  selectedSongIds,
  draggingSongId,
  draggingIndicatorSongId,
  onRatingChange,
  onToggleSelectedId,
  onSetDraggingSongId,
  onSetDraggingIndicatorSongId,
  onSetPosition
}) => {
  const showDraggingIndicatorSongId = draggingIndicatorSongId || draggingSongId;

  return (
    <div onDragExit={() => onSetDraggingIndicatorSongId(null)}>
      {songs.length ? (
        songs.map(song => (
          <Card
            className={style.card}
            key={song.id}
            draggable={true}
            onDragStart={e => {
              e.dataTransfer.setData("idc", "_");
              e.dataTransfer.setDragImage(e.target, -999999, -999999);

              onSetDraggingSongId(song.id);
              onSetDraggingIndicatorSongId(null);
            }}
            onDragOver={() => {
              if (!draggingSongId || draggingSongId === song.id) {
                return;
              }

              const targetSongIndex = songs.findIndex(
                ({ id }) => id === song.id
              );
              const draggingSongIndex = songs.findIndex(
                ({ id }) => id === draggingSongId
              );

              const insertBefore = targetSongIndex < draggingSongIndex;

              let newPosition = 0;

              if (insertBefore) {
                if (targetSongIndex === 0) {
                  newPosition = songs[targetSongIndex].position - 1;
                } else {
                  newPosition =
                    (songs[targetSongIndex].position +
                      songs[targetSongIndex - 1].position) /
                    2;
                }
              } else {
                if (targetSongIndex === songs.length - 1) {
                  newPosition = songs[targetSongIndex].position + 1;
                } else {
                  newPosition =
                    (songs[targetSongIndex].position +
                      songs[targetSongIndex + 1].position) /
                    2;
                }
              }

              onSetPosition(draggingSongId, newPosition);
            }}
            onMouseMove={() => onSetDraggingIndicatorSongId(song.id)}
            onMouseLeave={() => onSetDraggingIndicatorSongId(null)}
          >
            <i
              className={classNames(
                "material-icons",
                style.dragIndicator,
                showDraggingIndicatorSongId === song.id &&
                  style.dragIndicatorActive
              )}
            >
              drag_indicator
            </i>
            <button
              className={style.checkbox}
              onClick={() => onToggleSelectedId(song.id)}
            >
              {selectedSongIds.includes(song.id) ? (
                <i className={classNames("material-icons", style.checked)}>
                  check_box
                </i>
              ) : (
                <i className="material-icons">check_box_outline_blank</i>
              )}
            </button>
            <div className={style.title}>{song.name}</div>
            <Rating
              rating={song.rating}
              onChange={rating => onRatingChange(song.id, rating)}
            />
          </Card>
        ))
      ) : (
        <div className={style.empty}>This playlist has no songs yet</div>
      )}
    </div>
  );
};

SongsList.propTypes = {
  songs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      performer: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      position: PropTypes.number.isRequired,
      rating: PropTypes.number.isRequired
    })
  ),
  selectedSongIds: PropTypes.arrayOf(PropTypes.string),
  draggingSongId: PropTypes.string,
  draggingIndicatorSongId: PropTypes.string,
  onRatingChange: PropTypes.func.isRequired,
  onToggleSelectedId: PropTypes.func.isRequired,
  onSetDraggingSongId: PropTypes.func.isRequired,
  onSetDraggingIndicatorSongId: PropTypes.func.isRequired,
  onSetPosition: PropTypes.func.isRequired
};

export default SongsList;
