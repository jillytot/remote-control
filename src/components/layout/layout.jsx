import React, { Component } from "react";
import Login from "./login/login";
import NavBar from "./nav/navBar";
import Signup from "./login/signup";
import RobotServer from "./robotServer/robotServer";
import Modal from "../common/modal";
import "../common/overlay.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./layoutStyles.css";
import Channels from "./robotServer/channels";

export default class Layout extends Component {
  state = {
    isShowing: false,
    modalContent: [],
    selectedServer: null
  };

  componentDidUpdate(prevState) {
    if (prevState !== this.state) {
      this.handleLoadChannels();
    }
  }

  closeModalHandler = () => {
    this.setState({
      isShowing: false,
      modalContent: []
    });
  };

  getModal = input => {
    console.log("Modal Input: ", input);
    let updateContent = this.state.modalContent;
    input.map(getInput => updateContent.push(getInput));
    this.setState({
      isShowing: true,
      modalContent: updateContent
    });
    return null;
  };

  getRobotServers = () => {
    const { socket, user } = this.props;
    return (
      <RobotServer
        socket={socket}
        user={user}
        modal={this.getModal}
        onCloseModal={this.closeModalHandler}
        getServer={e => this.getSelectedServer(e)}
      />
    );
  };

  getSelectedServer = e => {
    this.setState({ selectedServer: e });
    console.log("SELECTED SERVER: ", e);
  };

  handleLoadChannels = () => {
    const { socket, user } = this.props;
    return (
      <Channels
        socket={socket}
        user={user}
        selectedServer={this.state.selectedServer}
        modal={this.getModal}
        onCloseModal={this.closeModalHandler}
      />
    );
  };

  handleRouting = () => {
    const { user, socket } = this.props;
    return (
      <React.Fragment>
        <Router>
          <NavBar user={user} socket={socket} />

          <div className="server-container">
            <Route path="/" component={this.getRobotServers} />

            {this.state.selectedServer ? (
              <Route
                path={`/${this.state.selectedServer.server_name}`}
                exact
                component={this.handleLoadChannels}
              />
            ) : (
              <React.Fragment />
            )}
          </div>
        </Router>
      </React.Fragment>
    );
  };

  render() {
    const { socket, user, setUser, handleAuth } = this.props;
    const { modalContent, isShowing } = this.state;

    return (
      <React.Fragment>
        {socket ? (
          <React.Fragment>
            {isShowing ? (
              <div onClick={this.closeModalHandler} className="back-drop" />
            ) : (
              <React.Fragment />
            )}
            {isShowing ? (
              <Modal
                className="modal"
                show={isShowing}
                close={this.closeModalHandler}
                contents={modalContent}
              />
            ) : (
              <React.Fragment />
            )}

            {user ? (
              this.handleRouting()
            ) : (
              <React.Fragment>
                <Signup
                  socket={socket}
                  setUser={setUser}
                  handleAuth={handleAuth}
                />
                ... or login ...
                <Login
                  socket={socket}
                  setUser={setUser}
                  handleAuth={handleAuth}
                />
              </React.Fragment>
            )}
          </React.Fragment>
        ) : (
          <div> ...Connection To Server Offline... </div>
        )}
        ...
      </React.Fragment>
    );
  }
}
