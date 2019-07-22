import React from "react";
import "./robotServer.css";
import defaultImages from "../../../imgs/placeholders";
import { Link } from "react-router-dom";

const DisplayRobotServer = ({
  serverName,
  defaultChannel,
  displayClasses,
  liveDevices
}) => {
  // console.log("LIVE DEVICES: ", liveDevices);
  return (
    <Link to={`/${serverName}/${defaultChannel}`}>
      <div className={displayClasses}>
        <img
          className={
            liveDevices.length > 0
              ? "display-robot-server-img live"
              : "display-robot-server-img"
          }
          alt=""
          src={defaultImages.default01}
        />
        <div className={"display-robot-server"}>{serverName}</div>
      </div>
    </Link>
  );
};

export default DisplayRobotServer;
