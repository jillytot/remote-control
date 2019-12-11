import React from "react";
import Form from "../common/form";

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

  componentDidMount() {
    console.log("Mounted EditMemberForm");
  }

  doSubmit = () => {
    console.log("Submitted");
  };

  handleDoKick = () => {
    const { user_id } = this.props.member;
    const { onKick } = this.props;
    this.setState({ kickPending: true });

    onKick(user_id);
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
    console.log(this.state.confirmKick);
    this.setState({ confirmKick: !this.state.confirmKick });
    console.log(this.state.confirmKick);
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
          {user.id === server.owner_id ? (
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

  render() {
    return <React.Fragment>{this.handleDisplaymember()}</React.Fragment>;
  }
}
