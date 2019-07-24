import React from "react";
import { Link } from "react-router-dom";

const Browse = ({ ...props }) => {
  return (
    <Link to={`/get`}>
      <div className="display-robot-server-container align-add-server">
        <div className="add-server ">>></div>
        <div className="display-robot-server">browse</div>
      </div>
    </Link>
  );
};

export default Browse;
