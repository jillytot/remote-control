import React from "react";
import "./robotServer.css";
import defaultImages from "../../../imgs/placeholders";
import { Link } from "react-router-dom";
import Icon from "../../common/icon";
import ICONS from "../../../icons/icons";

const DisplayRobotServer = ({
  serverName,
  defaultChannel,
  displayClasses,
  liveDevices,
  followed
}) => {
  // console.log("LIVE DEVICES: ", liveDevices);
  return (
    <Link to={`/${serverName}/${defaultChannel}`}>
      <div className={displayClasses}>
        {followed ? (
          <div className="heart-followed">
            <Icon icon={ICONS.FOLLOW} color={"#ff5ca3"} size={"11"} />{" "}
          </div>
        ) : (
          <div className="heart-empty" />
        )}
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
