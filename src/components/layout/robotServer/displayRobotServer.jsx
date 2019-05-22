import React from "react";
import "./robotServer.css";
import defaultImages from "../../../imgs/placeholders";

const DisplayRobotServer = ({ serverName, displayClasses }) => {
  return (
    <div className={displayClasses}>
      <img
        className="display-robot-server-img"
        alt=""
        src={defaultImages.default01}
      />
      <div className={"display-robot-server"}>{serverName}</div>
    </div>
  );
};

export default DisplayRobotServer;
