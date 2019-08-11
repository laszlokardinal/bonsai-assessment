import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import style from "./Button.css";

const Button = ({ label, onClick, red }) => (
  <button
    className={classNames(style.button, red && style.red)}
    type="button"
    onClick={onClick}
  >
    {label}
  </button>
);

Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  red: PropTypes.bool
};

export default Button;
