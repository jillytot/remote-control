import React from "react";
import "./robotServer.css";
import defaultImages from "../../../imgs/placeholders";
import { Link } from "react-router-dom";

const DisplayRobotServer = ({ serverName, displayClasses }) => {
  return (
    <Link to={serverName}>
      <div className={displayClasses}>
        <img
          className="display-robot-server-img"
          alt=""
          src={defaultImages.default01}
        />
        <div className={"display-robot-server"}>{serverName}</div>
      </div>
    </Link>
  );
};

export default DisplayRobotServer;
