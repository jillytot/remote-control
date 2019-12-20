import React, { Component } from "react";
import "./frontPage.css";
import axios from "axios";
import { getStats } from "../../../config/client";
import defaultImages from "../../../imgs/placeholders";
import TOS from "./tos";
import PrivacyPolicy from "./privacyPolicy";

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

  async componentDidMount() {
    await axios.get(getStats).then(res => {
      console.log(res);
      this.setState({
        activeUsers: res.data.activeUsers,
        totalUsers: res.data.totalUsers,
        totalServers: res.data.totalServers,
        activeDevices: res.data.activeDevices,
        registeredDevices: res.data.registeredDevices
      });
    });
  }

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
          <DisplayAlert show={false} />
          <br />
          <span>
            Control & share robots online remotely in real time with remo.tv{" "}
            <br />
            Please check documenation and links below for more info. <br />
          </span>
          <br />
          <div>Best used on Desktop with Chrome Browser</div>
          <div>...</div>
          <div>
            Users currently Online: <span className="stat">{activeUsers}</span>{" "}
          </div>
          <div>
            Total users signed up to site:{" "}
            <span className="stat">{totalUsers}</span>{" "}
          </div>
          <div>
            Robot Servers: <span className="stat">{totalServers}</span>
          </div>
          <div>
            Active Devices Online: <span className="stat">{activeDevices}</span>{" "}
          </div>
          <div>
            {" "}
            Total Devices Registered:{" "}
            <span className="stat">{registeredDevices}</span>
          </div>
          <div>...</div>
          <br />

          <div className="front-page-link-container">
            <AddARobot />
            <Discord />
            {/* <Platform /> */}

            <Patreon />
          </div>
          <Platform />
          <Medium />
        </div>
      </div>
    );
  }
}

const DisplayAlert = ({ show }) => {
  return show === true ? (
    <div className="alert">
      <span className="bolder">Important Notice 11/20/2019 </span>
      <div>
        In order to make Remo more secure, we've updated our site's encryption
        methods. As a result, any robot using an API key generated before today
        will not work.
        <div>
          <br />
          You can simply copy and paste the updated key already provided for
          each robot under, "manage robots" to your robot's local settings.
        </div>
      </div>
    </div>
  ) : (
    <React.Fragment />
  );
};

const AddARobot = () => {
  return (
    <React.Fragment>
      <div className="fp-card">
        <a href="https://github.com/remotv/controller">
          <img
            className="icon-element"
            src={defaultImages.gitIcon}
            title="https://github.com/remotv/controller"
          />
          <br />
          Software for adding a robot.
        </a>
      </div>
    </React.Fragment>
  );
};

const Platform = () => {
  return (
    <React.Fragment>
      <div className="">
        {`Remo Web Platform Repo: `}
        <a href="https://github.com/jillytot/remote-control">
          https://github.com/jillytot/remote-control
        </a>
      </div>
    </React.Fragment>
  );
};

const Discord = () => {
  return (
    <React.Fragment>
      <div className="fp-card">
        <a href="https://discord.gg/cczJfYk">
          <img
            className="icon-element"
            src={defaultImages.discordIcon}
            title="https://discord.gg/cczJfYk"
          />
          <br />
          Join our Discord.
        </a>
      </div>
    </React.Fragment>
  );
};

const Patreon = () => {
  return (
    <React.Fragment>
      <div className="fp-card">
        <a href="https://www.patreon.com/letsjill">
          <img
            className="icon-element"
            src={defaultImages.patreonIcon}
            title="https://www.patreon.com/letsjill"
          />
          <br />
          Support us on Patreon!
        </a>
      </div>
    </React.Fragment>
  );
};

const Medium = () => {
  return (
    <React.Fragment>
      <div className="">
        {`Medium Dev Blog: `}
        <a href="https://medium.com/remotv">https://medium.com/remotv</a>
      </div>
    </React.Fragment>
  );
};
