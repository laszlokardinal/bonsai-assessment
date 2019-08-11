import React from "react";
import PropTypes from "prop-types";

import style from "./TextInput.css";

const TextInput = ({ label, value, onChange }) => (
  <div className={style.wrapper}>
    <div className={style.label}>{label}</div>
    <input
      className={style.input}
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  </div>
);

TextInput.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default TextInput;
