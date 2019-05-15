import React from "react";
import "./robotServer.css";
import defaultImages from "../../../imgs/placeholders";

const DisplayRobotServer = ({ serverName }) => {
  return (
    <React.Fragment>
      <img className="display-robot-server-img" src={defaultImages.default01} />
      <div className="display-robot-server">{serverName}</div>
    </React.Fragment>
  );
};

export default DisplayRobotServer;
