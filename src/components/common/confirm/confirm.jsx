import React, { Component } from "react";
import "./confirm.scss";

//This is an updated version of the index.jsx confirm component
//It uses buttons instead of divs & appears inline
//Once old methods are fully replaced, this one can take it's place

//Confirm Action Prompt
//Generic component for confirming user actions inline,
//This component is managed by the state of it's parent component

/**
 * Example Parent State: 
 * state = {
    displayConfirm: false, //Recommend using this conditional to render <Confirm />
    displayPending: false,
    displayError: false,
    displayResult: ""
  };

  * Parent is also required to have the following handlers: 

  * onConfirm(): inhereted via props
  handleConfirm = async () => {
    this.setState({ displayPending: true });
    //await action to complete
    this.setState({ displayResult: "Success Message"})
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
      displayResult: ""
    })
  }

  * Other input Props: 
      input ( optional ) : Describe the action being confirmed
      displayError ( Optional ) : Formats success message as an error
      
   * Todo ( maybe ) : Style Options
 */

export default class Confirm extends Component {
  handleConfirm = () => {
    const { displayConfirm, displayPending, displayResult } = this.props;
    if (!displayConfirm && !displayPending) return <React.Fragment />;
    if (displayConfirm && !displayPending) return this.handleDisplayConfirm();
    if (displayConfirm && displayPending && displayResult === "")
      return this.handleDisplayPending();
    if (displayConfirm && displayPending && displayResult !== "")
      return this.handleDisplaySuccess();
  };

  handleDisplayPending = () => {
    return <div className="Confirm__container">...Waiting for response.</div>;
  };

  handleDisplaySuccess = () => {
    const { onComplete, displayResult, displayError } = this.props;
    let textStyle = "Confirm__result";
    if (displayError) textStyle = "Confirm__error";
    return (
      <div className="Confirm__container">
        <div className={textStyle}> {`${displayResult} `}</div>
        <button className="Confirm__action" onClick={() => onComplete()}>
          {` dismiss `}
        </button>
      </div>
    );
  };

  handleDisplayConfirm = () => {
    const { confirmText, onConfirm, onCancel } = this.props;
    return (
      <div className="Confirm__container">
        {`Confirm ${confirmText || "Action"} ?`}
        <div className="margin-left-12" />
        <button className="Confirm__action-confirm" onClick={() => onConfirm()}>
          {` Yes `}
        </button>

        <button className="Confirm__action" onClick={() => onCancel()}>
          {` Cancel `}
        </button>
      </div>
    );
  };

  render() {
    return this.handleConfirm();
  }
}
