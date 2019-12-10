import React, { Component } from "react";
import axios from "axios";
import EditMemberForm from "../forms/editMemberForm";
import { getMembers } from "../../config/client";
import "./serverMembersStyle.css";

export default class ServerMembers extends Component {
  state = {
    members: [],
    fetching: true
  };

  async componentDidMount() {
    //get members API call
    console.log("SERVER MEMBERS MOUNT");
    await this.handleGetMembers();
    console.log(this.state.members);
  }

  handleGetMembers = async () => {
    const token = localStorage.getItem("token");
    await axios
      .post(
        getMembers,
        { server_id: this.props.server.server_id },
        {
          headers: { authorization: `Bearer ${token}` }
        }
      )
      .then(response => {
        console.log(response);
        if (!response.data.error) {
          this.setState({ members: response.data, fetching: false });
        }
      })
      .catch(err => {
        console.log(err);
      });
    return;
  };

  handleDisplaymembers = () => {
    const { members } = this.state;
    return members.map(member => {
      return <EditMemberForm member={member} key={member.user_id} />;
      // return <div> {member.username} </div>;
    });
  };

  render() {
    console.log(this.state, this.props);
    return (
      <React.Fragment>
        {this.state.fetching === true ? (
          <div> Fetching Data </div>
        ) : (
          this.handleDisplaymembers()
        )}
      </React.Fragment>
    );
  }
}
