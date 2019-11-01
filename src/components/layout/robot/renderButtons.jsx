import React, { Component } from "react";
import "./robot.css";

export default class RenderButtons extends Component {
  //render a single button
  handleButton = ({ aButton, style, hotKeyStyle }) => {
    const { onClick, user, controls_id, socket } = this.props;
    const hotKeyRender = this.handleButtonStyle(aButton);
    if (aButton && aButton.hot_key && aButton.key)
      hotKeyRender = "robtn robtn-hot-key";
    return (
      <button
        className={hotKeyRender}
        key={aButton.id}
        onClick={() =>
          onClick({
            user: user,
            controls_id: controls_id,
            socket: socket,
            button: aButton
          })
        }
        style={style}
      >
        {aButton.hot_key ? (
          <span className={hotKeyStyle}>{aButton.hot_key}</span>
        ) : (
          <React.Fragment />
        )}
        {aButton.label}
      </button>
    );
  };

  handleButtonStyle = aButton => {
    if (aButton.access && aButton.access === "owner") return "robtn-admin";
    return "robtn";
  };

  handleHotKeyStyle = aButton => {
    if (aButton.access && aButton.access === "owner") return "hotkey-admin";
    return "hotkey";
  };

  handleButtons = () => {
    const {
      controls,
      hotKeyStyle,
      renderPresses,
      renderCurrentKey
    } = this.props;

    if (controls) {
      return controls.map((aButton, index) => {
        //console.log("A BUTTON: ", aButton);
        let hotKeyStyle = this.handleHotKeyStyle(aButton);
        let style = {};
        if (aButton.hot_key === renderCurrentKey) {
          style = {
            boxShadow: "inset 0 0 0 2px rgb(5, 214, 186)",
            transform: "translateY(4px)",
            WebkitTransform: "translateY(4px)"
          }; // noice!
        }
        renderPresses.map(press => {
          console.log(aButton.id);
          if (press && press.button.id === aButton.id) {
            if (press.button.access && press.button.access === "owner") {
              style.backgroundColor = "#e44884";
              hotKeyStyle = "hotkey hotkey-admin-highlight";
            } else {
              style.backgroundColor = "rgb(64, 76, 131)";
              hotKeyStyle = "hotkey hotkey-highlight";
            }
          }
          return null;
        });
        if (aButton.break) {
          //console.log("Break!!!!!"); is this saved?
        }
        if (aButton.break) return this.handleBreak(aButton, index);
        return this.handleButton({ aButton, style, hotKeyStyle });
      });
    }
  };

  handleBreakPointStyle = index => {
    //console.log("Checking Breakpoint Index: ", index);
    if (index === 0) return "label label-top";
    return "label";
  };
  handleBreak = (breakPoint, index) => {
    let renderBreak = null;
    //console.log("Break: ", breakPoint);
    if (breakPoint.label !== "") {
      //return label header
      renderBreak = (
        <div className="label-container">
          <div className={this.handleBreakPointStyle(index)}>
            {breakPoint.label}
          </div>
        </div>
      );
    }

    return (
      <React.Fragment>
        {index === 0 ? <React.Fragment /> : <br />}
        {renderBreak}
      </React.Fragment>
    );
  };

  render() {
    return <React.Fragment>{this.handleButtons()}</React.Fragment>;
  }
}
