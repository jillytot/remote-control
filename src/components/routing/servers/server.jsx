import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Channels from "../../layout/robotServer/channels";
import axios from "axios";
import { findServer } from "../../../config/client";
import "../../layout/frontPage/frontPage.css";

export default class ServerPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false
    };
  }

  componentDidMount() {
    this.handleSelectedServer();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.match.params.name !== prevProps.match.params.name ||
      this.props.robotServers.length !== prevProps.robotServers.length
    ) {
      this.handleSelectedServer();
    }
  }

  handleSelectedServer = async () => {
    let found = false;
    this.props.robotServers.map(robotServer => {
      if (robotServer.server_name === this.props.match.params.name) {
        console.log("SELECTED ROBOT SERVER: ", robotServer);
        this.props.setServer(robotServer);
        found = true;
        return true;
      }
      return false;
    });

    //If no server is find, check to see if the server is unlisted.
    if (!found) {
      if (this.props.match.params.name) {
        console.log("FIND SERVER: ", this.props.match.params.name);
        const findServer = await this.handleFindServer(
          this.props.match.params.name
        );

        console.log("Find Server Result: ", findServer);
        if (findServer) {
          await this.props.appendServer(findServer);
          this.props.setServer(findServer);
          found = true;
          return true;
        } else {
          console.log("REDIRECT!");
          this.setState({ redirect: true });
        }
      }
    }
  };

  handleFindServer = async server_name => {
    const token = localStorage.getItem("token");
    let found = null;
    await axios
      .post(
        findServer,
        {
          server_name: server_name
        },
        {
          headers: { authorization: `Bearer ${token}` }
        }
      )
      .then(response => {
        console.log(response);
        found = response.data;
      })
      .catch(err => {
        console.log(err);
      });
    console.log(found);
    if (found && found.server_name) return found;
    return null;
  };

  handleDisplayChannels = () => {
    if (this.state.redirect) return <Redirect to="/" />;
    return this.props.selectedServer ? (
      <Channels
        user={this.props.user}
        selectedServer={this.props.selectedServer}
        modal={this.props.modal}
        isModalShowing={this.props.isModalShowing}
        onCloseModal={this.props.onCloseModal}
        showMobileNav={this.props.showMobileNav}
        mobileState={this.props.mobileState}
        setServer={this.props.setServer}
      />
    ) : (
      <React.Fragment>
        {" "}
        <div className="front-page-container">
          <div className="front-page-text">
            <div>No Server Selected.</div>
            <br />
            <div>This could be because: </div>
            <div>This server does not exist </div>
            <div>This server has been set to private </div>
            <div>You have been kicked, or banned </div>
            <div>or... something broke.</div>
          </div>
        </div>
      </React.Fragment>
    );
  };

  render() {
    return <React.Fragment>{this.handleDisplayChannels()}</React.Fragment>;
  }
}
