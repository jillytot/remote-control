import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import "./index.css";
import RobotServer from "../../layout/robotServer/robotServer";
import NavBar from "../../layout/nav/navBar";
import socket from "../../socket";
import ServerPage from "./server";
import {
  listRobotServers,
  listFollowedServers
} from "../../../config/clientSettings";
import axios from "axios";
import Modal from "../../common/modal";
import "../../common/overlay.css";
import FrontPage from "../../layout/frontPage/frontPage";
import BrowseServers from "../../layout/browseServers/browseServers";

export default class ServersPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      robotServers: undefined,
      selectedServer: undefined,
      followedServers: [],
      socketConnected: false,
      user: undefined, // undefined: waiting for gateway, null: gateway said auth no no
      isShowing: false,
      modalContent: [],
      reload: false,
      showMobileNav: true //For handling mobile navigation states
    };
  }

  onCloseModal = e => {
    if (e && e.reload) {
      this.setState({
        isShowing: false,
        modalContent: [],
        reload: true
      });
    } else {
      this.setState({
        isShowing: false,
        modalContent: []
      });
    }
  };

  //Mobile Navigation Handler
  handleMobileFlag = e => {
    const { showMobileNav } = e;
    console.log("Mobile Flag Test", e);
    this.setState({ showMobileNav });
    return null;
  };

  setModal = input => {
    console.log("Modal Input: ", input);
    let updateContent = this.state.modalContent;
    input.map(getInput => updateContent.push(getInput));
    this.setState({
      isShowing: true,
      modalContent: updateContent
    });
    return null;
  };

  handleReload = async () => {
    await this.getServers();
    this.setState({ reload: false });
    window.location.reload();
  };

  getServers = async () => {
    try {
      const response = await axios.get(listRobotServers);
      //console.log(response);
      this.setState({ robotServers: response.data });
    } catch (e) {
      console.error(e);
      setTimeout(this.getServers, 600); //retry
    }
    return null;
  };

  getFollowedServers = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(listFollowedServers, {
        headers: { authorization: `Bearer ${token}` }
      });
      console.log(response);
      this.setState({ followedServers: response.data });
    } catch (e) {
      console.error(e);
      setTimeout(this.getFollowedServers, 600); //retry
    }
    return null;
  };

  appendUnlistedServer = server => {
    console.log("APPEND SERVER: ", server);
    let updateServers = this.state.robotServers;
    if (updateServers) {
      updateServers.push(server);
    }
    this.setState({ robotServers: updateServers });
    return null;
  };

  async componentDidMount() {
    socket.on("VALIDATED", this.setUser);
    socket.on("connect", this.socketConnected);
    socket.on("disconnect", this.socketDisconnected);
    socket.on("ROBOT_SERVER_UPDATED", this.getServers);

    if (socket.connected) {
      this.setState({ socketConnected: true });
      this.emitAuthentication();
    }

    Promise.all([this.getServers(), this.getFollowedServers()]);
  }

  setServer = server => {
    this.setState({ selectedServer: server });
  };

  componentWillUnmount() {
    socket.off("VALIDATED", this.setUser);
    socket.off("connect", this.socketConnected);
    socket.off("disconnect", this.socketDisconnected);
    socket.off("ROBOT_SERVER_UPDATED", this.getServers);
  }

  emitAuthentication = () => {
    socket.emit("AUTHENTICATE", { token: localStorage.getItem("token") });
  };

  setUser = user => {
    this.setState({ user });
  };

  socketConnected = () => {
    this.setState({ socketConnected: true });
    this.emitAuthentication();
  };

  socketDisconnected = () => {
    this.setState({ socketConnected: false });
  };

  render() {
    let loadingText = null;
    console.log("Socket Connected: ", this.state.socketConnected);
    if (!this.state.socketConnected) {
      loadingText = "Connecting...";
    } else if (!this.state.user) {
      loadingText = "Waiting for User...";
    } else if (!this.state.robotServers) {
      loadingText = "Waiting for Robot Servers...";
    }

    if (this.state.user === null) return <Redirect to="/login" />;

    return loadingText ? (
      <div className="ConnectingOverlay">
        <h3 className="ConnectingOverlayText">{loadingText}</h3>
      </div>
    ) : this.state.reload ? (
      this.handleReload()
    ) : (
      <React.Fragment>
        {this.state.isShowing && (
          <React.Fragment>
            <div onClick={this.onCloseModal} className="back-drop" />
            <Modal
              className="modal"
              show={this.state.isShowing}
              close={this.onCloseModal}
              contents={this.state.modalContent}
            />
          </React.Fragment>
        )}
        <NavBar
          user={this.state.user}
          mobileState={this.handleMobileFlag}
          showMobileNav={this.state.showMobileNav}
        />
        <div className="server-container">
          <RobotServer
            modal={this.setModal}
            onCloseModal={this.onCloseModal}
            user={this.state.user}
            robotServers={this.state.robotServers}
            selectedServer={this.state.selectedServer}
            followedServers={this.state.followedServers}
            mobileState={this.handleMobileFlag}
            showMobileNav={this.state.showMobileNav}
          />
          <Switch>
            <Route
              path="/get"
              render={props => (
                <BrowseServers
                  {...props}
                  setServer={this.setServer}
                  user={this.state.user}
                  robotServers={this.state.robotServers}
                  followedServers={this.state.followedServers}
                />
              )}
            />
            <Route
              path="/:name"
              render={props => (
                <ServerPage
                  {...props}
                  modal={this.setModal}
                  onCloseModal={this.onCloseModal}
                  user={this.state.user}
                  isModalShowing={this.state.isShowing}
                  robotServers={this.state.robotServers}
                  selectedServer={this.state.selectedServer}
                  setServer={this.setServer}
                  mobileState={this.handleMobileFlag}
                  showMobileNav={this.state.showMobileNav}
                  appendServer={server => this.appendUnlistedServer(server)}
                />
              )}
            />
            <Route
              path="/"
              render={props => (
                <NoServerPage {...props} setServer={this.setServer} />
              )}
            />
          </Switch>
        </div>
      </React.Fragment>
    );
  }
}

class NoServerPage extends Component {
  componentDidMount() {
    this.props.setServer(null);
  }

  render() {
    return <FrontPage />;
  }
}
