import React from "react";
import PropTypes from "prop-types";
import { Link } from "reduxen-react-dom";

import { Card } from "../elements";

import style from "./PlaylistsList.css";

const PlaylistsList = ({ playlists }) => (
  <React.Fragment>
    {playlists.length ? (
      playlists.map(item => (
        <Link to={item.path} className={style.link} key={item.id}>
          <Card className={style.card} clickable>
            <div className={style.title}>{item.name}</div>
          </Card>
        </Link>
      ))
    ) : (
      <div className={style.empty}>There are no playlists yet</div>
    )}
  </React.Fragment>
);

PlaylistsList.propTypes = {
  playlists: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string
    })
  )
};

export default PlaylistsList;
