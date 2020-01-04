import React, { Component } from "react";
import "./confirm.css";

//Confirm Action
//Prints Options for confirming an action,
//returns true if action is confirmed, and false if not

export default class Confirm extends Component {
  handleConfirm = () => {
    const { displayConfirm, displayPending } = this.props;
    if (!displayConfirm && !displayPending) return <React.Fragment />;
    if (displayConfirm && !displayPending) return this.handleDisplayConfirm();
  };

  handleDisplayConfirm = () => {
    const { input, onConfirm, onCancel } = this.props;
    return (
      <div className="confirm-action-container">
        {`Confirm ${input || "Action"} ?`}
        <div className="do-action" onClick={() => onConfirm()}>
          {` Yes `}
        </div>
        <div className="margin-left-12"> / </div>
        <div className="do-action" onClick={() => onCancel()}>
          {` No `}
        </div>
      </div>
    );
  };

  render() {
    return this.handleConfirm();
  }
}
