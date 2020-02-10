import React, { Component } from "react";
import axios from "axios";
import { setDefaultChannel } from "../../../config/client";
import "../inlineForms.css";

export default class DefaultChannel extends Component {
  state = {
    isDefault: null,
    error: "",
    status: ""
  };

  handleSetDefault = async () => {
    const { id, host_id } = this.props.channel;
    this.setState({ status: "...pending." });
    const token = localStorage.getItem("token");
    await axios
      .post(
        setDefaultChannel,
        {
          channel_id: id,
          server_id: host_id
        },
        {
          headers: { authorization: `Bearer ${token}` }
        }
      )
      .then(res => {
        console.log("Set Default Channel Response: ", res.data);
        if (res.data.error) {
          this.setState({ error: res.data.error });
        } else {
          this.setState({ status: "Channel is Default" });
        }
      });
  };

  componentDidMount() {
    this.handleCheckDefault();
  }

  handleCheckDefault = () => {
    const { server, channel } = this.props;
    if (server.settings.default_channel === channel.id)
      this.setState({ status: "Channel is Default." });
    return null;
  };

  handleStatus = () => {
    const { status } = this.state;
    if (status !== "")
      return <div className="inline-no-action"> {status} </div>;
    return (
      <div className="inline-action" onClick={() => this.handleSetDefault()}>
        {" "}
        Set as Default{" "}
      </div>
    );
  };

  handleDisplay = () => {
    return (
      <div className="inline-container">
        <div className="inline-label"> Make this my default channel: </div>
        <div className="inline-info"></div>
        {this.handleStatus()}
      </div>
    );
  };

  render() {
    return this.handleDisplay();
  }
}
