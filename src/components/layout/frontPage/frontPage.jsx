import React, { Component } from "react";
import "./frontPage.css";
import axios from "axios";
import { getStats } from "../../../config/clientSettings";

/*
Other fun stats to display: 
Commands Sent Per ( time ), 
Chat Messages Sent Per ( time ),
Active Users in the last 24 hours
*/

export default class FrontPage extends Component {
  state = {
    activeUsers: "...",
    totalUsers: "...",
    totalServers: "...",
    activeDevices: "...",
    registeredDevices: "..."
  };

  render() {
    const {
      activeUsers,
      totalUsers,
      totalServers,
      activeDevices,
      registeredDevices
    } = this.state;
    return (
      <div className="front-page-container">
        <div className="front-page-text">
          Users currently Online: {activeUsers}
          <div>Total users signed up to site: {totalUsers} </div>
          <div>Robot Servers: {totalServers}</div>
          <div>Active Devices Online: {activeDevices} </div>
          <div> Total Devices Registered: {registeredDevices} </div>
        </div>
      </div>
    );
  }
}
