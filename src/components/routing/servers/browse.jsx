import React from "react";
import { Link } from "react-router-dom";
import defaultImages from "../../../imgs/placeholders";

const Browse = ({ ...props }) => {
  return (
    <Link to={`/get`}>
      <div className="display-robot-server-container align-add-server">
        <div className="">
          <img
            className="display-robot-server-img"
            alt="Browse Servers"
            src={defaultImages.browse}
          />
        </div>
        <div className="display-robot-server">browse</div>
      </div>
    </Link>
  );
};

export default Browse;
