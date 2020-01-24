import React from "react";
import Form from "../common/form";
import axios from "axios";
import { kickMember } from "../../config/client";
import "./editMember.css";

export default class EditMemberForm extends Form {
  state = {
    data: {},
    errors: {},
    error: "",
    confirmKick: false,
    kickSuccess: "",
    kickPending: false,
    kickCompleted: false
  };
  schema = {};

  doSubmit = () => {};

  handleDoKick = async () => {
    this.setState({ kickPending: true });
    const token = localStorage.getItem("token");
    await axios
      .post(
        kickMember,
        {
          member: this.props.member,
          server_id: this.props.server.server_id
        },
        {
          headers: { authorization: `Bearer ${token}` }
        }
      )
      .then(res => {
        if (res.data.error) {
          this.setState({
            kickSuccess: res.data.error,
            kickPending: false,
            kickCompleted: true
          });
          return;
        }
        this.setState({
          kickSuccess: res.data.message,
          kickPending: false,
          kickCompleted: true
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleConfirm = () => {
    const { confirmKick, kickPending } = this.state;
    if (!confirmKick && !kickPending) return <React.Fragment />;
    if (kickPending)
      return <div className="confirm-action-container"> ...pending</div>;

    return (
      <div className="confirm-action-container">
        confirm kick ?{" "}
        <div className="do-action" onClick={() => this.handleDoKick()}>
          {" "}
          Yes{" "}
        </div>
        <div className="margin-left-12"> / </div>
        <div
          className="do-action"
          onClick={() => {
            this.setState({ confirmKick: false });
          }}
        >
          {" "}
          No
        </div>
      </div>
    );
  };

  handleKick = () => {
    this.setState({ confirmKick: !this.state.confirmKick });
  };

  handleDisplaymember = () => {
    const { username, joined } = this.props.member;
    const { user, server } = this.props;

    const date = new Date(parseInt(joined)).toDateString();
    return (
      <React.Fragment>
        <div className="member-container">
          <div className="member-username">{username}</div>
          <div className="member-joined">{`Joined: ${date}`}</div>
          {user.id === server.owner_id &&
          user.id !== this.props.member.user_id ? (
            <div className="kick-member" onClick={() => this.handleKick()}>
              {" "}
              kick{" "}
            </div>
          ) : (
            <React.Fragment />
          )}
        </div>
        {this.handleConfirm()}
      </React.Fragment>
    );
  };

  handleSuccess = () => {
    const { user_id } = this.props.member;
    const { onKick } = this.props;

    const { kickSuccess } = this.state;
    return (
      <div className="member-container">
        {" "}
        <div className="member-joined">{kickSuccess}</div>
        <div
          className="kick-member"
          onClick={() => {
            onKick(user_id);
          }}
        >
          Dismiss
        </div>
      </div>
    );
  };

  render() {
    const { kickCompleted } = this.state;
    return (
      <React.Fragment>
        {kickCompleted ? this.handleSuccess() : this.handleDisplaymember()}
      </React.Fragment>
    );
  }
}
