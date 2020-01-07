import React, { Component } from "react";
import "./confirm.css";

//Confirm Action Prompt
//Generic component for confirming user actions inline,
//This component is managed by the state of it's parent component

/**
 * Example Parent State: 
 * state = {
    displayConfirm: false, //Recommend using this conditional to render <Confirm />
    displayPending: false,
    displayError: false,
    displaySuccess: ""
  };

  * Parent is also required to have the following handlers: 

  * onConfirm(): inhereted via props
  handleConfirm = async () => {
    this.setState({ displayPending: true });
    //await action to complete
    this.setState({ displaySuccess: "Success Message"})
  };

  * onCancel(): inhereted via props
  handleCancel = () => {
    this.setState({
      displayConfirm: false,
      displayPending: false
    });
  };

  * onComplete(): inhereted via props
  handleComplete = () => {
    this.setState({ 
      displayConfirm: false, 
      displayPending: false,
      displayError: false
      displaySuccess: ""
    })
  }

  * Other input Props: 
      input ( optional ) : Describe the action being confirmed
      displayError ( Optional ) : Formats success message as an error
      
   * Todo ( maybe ) : Style Options
 */

export default class Confirm extends Component {
  handleConfirm = () => {
    const { displayConfirm, displayPending, displaySuccess } = this.props;
    if (!displayConfirm && !displayPending) return <React.Fragment />;
    if (displayConfirm && !displayPending) return this.handleDisplayConfirm();
    if (displayConfirm && displayPending && displaySuccess === "")
      return this.handleDisplayPending();
    if (displayConfirm && displayPending && displaySuccess !== "")
      return this.handleDisplaySuccess();
  };

  handleDisplayPending = () => {
    return (
      <div className="confirm-action-container">...Waiting for response.</div>
    );
  };

  handleDisplaySuccess = () => {
    const { onComplete, displaySuccess, displayError } = this.props;
    let textStyle = "confirm-action-container";
    if (displayError) textStyle = "confirm-action-container error";
    return (
      <div className={textStyle}>
        <div className=""> {`${displaySuccess} `}</div>
        <div className="do-action" onClick={() => onComplete()}>
          {` - dismiss `}
        </div>
      </div>
    );
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
