import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import style from "./Card.css";

const Card = ({
  children,
  clickable,
  className,
  draggable,
  onDragStart,
  onDragOver,
  onMouseMove,
  onMouseLeave
}) => (
  <div
    className={classNames(
      style.wrapper,
      clickable && style.clickable,
      className
    )}
    draggable={draggable}
    onDragStart={onDragStart}
    onDragOver={onDragOver}
    onMouseMove={onMouseMove}
    onMouseLeave={onMouseLeave}
  >
    {children}
  </div>
);

Card.propTypes = {
  children: PropTypes.node.isRequired,
  clickable: PropTypes.bool,
  className: PropTypes.string,
  draggable: PropTypes.bool,
  onDragStart: PropTypes.func,
  onDragOver: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseLeave: PropTypes.func
};

export default Card;
