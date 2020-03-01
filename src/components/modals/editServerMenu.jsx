import React, { Component } from "react";
import EditServerForm from "./editServerForm";
import ServerNotifications from "../forms/serverNotifications/serverNotifications";
import axios from "axios";
import { findServer } from "../../config/client/index";
import PaddedMessage from "../common/paddedMessage/paddedMessage";

export default class EditServerMenu extends Component {
  state = { reload: false, membership: null };

  componentDidMount() {
    const { server } = this.props;
    if (!server.membership && !this.state.reload) {
      this.getMembership();
      this.setState({ reload: true });
    } else {
      this.setState({ membership: server.membership });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.membership !== prevState.membership) this.render();
  }

  /*
 If getSelectedServer isn't called, then we make the same API call here to 
 ensure we have membership information. 
  */

  getMembership = async () => {
    const { server } = this.props;
    const token = localStorage.getItem("token");
    await axios
      .post(
        findServer,
        {
          server_name: server.server_name
        },
        { headers: { authorization: `Bearer ${token}` } }
      )
      .then(response => {
        console.log("Get Membership: ", response.data);
        const { membership } = response.data || null;
        this.setState({ membership: membership });
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const { server, user } = this.props;
    const { membership } = this.state;
    return (
      <React.Fragment>
        {server.owner_id === user.id ? (
          <EditServerForm {...this.props} />
        ) : membership ? (
          membership.status.member === true ? (
            <ServerNotifications membership={membership} {...this.props} />
          ) : (
            <PaddedMessage>
              You are not a member of this server. You must join this server in
              order to become a member.
            </PaddedMessage>
          )
        ) : (
          <PaddedMessage> Waiting for Server Information...</PaddedMessage>
        )}
      </React.Fragment>
    );
  }
}
