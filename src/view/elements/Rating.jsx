import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import style from "./Rating.css";

const Rating = ({ rating, onChange }) => (
  <div className={style.wrapper}>
    <div className={style.displayWrapper}>
      {new Array(5).fill(null).map((_, index) => (
        <i
          className={classNames(
            "material-icons",
            "md-18",
            rating > index && style.active
          )}
          key={index}
        >
          star
        </i>
      ))}
    </div>
    <div className={style.buttonWrapper}>
      {new Array(5).fill(null).map((_, index) => (
        <i
          className={classNames("material-icons", "md-18", style.iconButton)}
          key={index}
          onClick={() => onChange(index + 1)}
        >
          star
        </i>
      ))}
    </div>
  </div>
);

Rating.propTypes = {
  rating: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
};

export default Rating;
