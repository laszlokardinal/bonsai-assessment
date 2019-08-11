import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import style from "./Loader.css";

const Loader = ({ loading }) => (
  <div className={classNames(style.wrapper, loading && style.loading)}>
    <div className={style.ring}></div>
  </div>
);

Loader.propTypes = {
  loading: PropTypes.bool.isRequired
};

export default Loader;
