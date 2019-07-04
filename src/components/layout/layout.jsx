import React, { Component } from "react";
import Login from "./login/login";
import NavBar from "./nav/navBar";
import Signup from "./login/signup";
import RobotServer from "./robotServer/robotServer";
import Modal from "../common/modal";
import "../common/overlay.css";
import { BrowserRouter as Router, Route } from "react-router-dom";

export default class Layout extends Component {
  state = {
    isShowing: false,
    modalContent: []
  };

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
      />
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
              <React.Fragment>
                <Router>
                  <NavBar user={user} socket={socket} />
                  <Route path="/" exact component={this.getRobotServers} />
                </Router>
              </React.Fragment>
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
