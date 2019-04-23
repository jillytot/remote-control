import React from "react";
import PropTypes from "prop-types";

//Note, this is correlated to SVG icons located in /src/icons/icons.js

const Icon = props => {
  const styles = {
    svg: {
      display: "inline-block",
      verticalAlign: "middle"
    },
    path: {
      fill: props.color
    }
  };

  return (
    <svg
      style={styles.svg}
      width={`${props.size}px`}
      height={`${props.size}px`}
      viewBox="0 0 1024 1024"
    >
      <path style={styles.path} d={props.icon} />
    </svg>
  );
};

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  size: PropTypes.number,
  color: PropTypes.string
};

Icon.defaultProps = {
  size: 16,
  color: "white"
};

export default Icon;
