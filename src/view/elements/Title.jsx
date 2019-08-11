import React from "react";
import PropTypes from "prop-types";
import { Link } from "reduxen-react-dom";

import style from "./Title.css";

const Title = ({ children, backLink }) => (
  <div className={style.wrapper}>
    {backLink ? (
      <Link className={style.link} to={backLink}>
        <i className="material-icons">keyboard_arrow_left</i>
      </Link>
    ) : null}
    <h1 className={style.title}>{children}</h1>
  </div>
);

Title.propTypes = {
  children: PropTypes.node.isRequired,
  backLink: PropTypes.string
};

export default Title;
