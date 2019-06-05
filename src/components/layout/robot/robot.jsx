import React, { Component } from "react";
import "./robot.css";

export default class Robot extends Component {
  state = {
    controls: [],
    logClicks: [],
    displayLog: true,
    clickCounter: 0
  };

  componentDidMount() {
    this.setState({ controls: testButtons });
  }

  handleClick = click => {
    this.handleLoggingClicks(click);
  };

  handleLoggingClicks = click => {
    let { logClicks, clickCounter } = this.state;
    clickCounter++;
    click.count = clickCounter;
    logClicks.push(click);
    if (logClicks.length > 12) {
      logClicks.shift();
    }

    this.setState({ logClicks: logClicks, clickCounter: clickCounter });
  };

  renderClickLog = () => {
    return this.state.logClicks.map(click => {
      return (
        <div className="display-info" key={click.count}>
          {`${click.user.username} pressed ${click.button.label}`}
        </div>
      );
    });
  };

  renderButtons = () => {
    if (this.state.controls !== []) {
      return this.state.controls.map(button => {
        return (
          <button
            className="robtn"
            key={button.id}
            onClick={() =>
              this.handleClick({
                user: this.props.user,
                channel: this.props.channel,
                socket: this.props.socket,
                button: button
              })
            }
          >
            <span className="hotkey">{button.hot_key} :</span> {button.label}
          </button>
        );
      });
    }
  };

  render() {
    return (
      <React.Fragment>
        {this.props.channel ? (
          <div className="robot-container">
            <div className="robot-display-container">
              <div className="display-info-container">
                {this.state.displayLog ? (
                  this.renderClickLog()
                ) : (
                  <React.Fragment />
                )}
              </div>
            </div>
            <div className="robot-controls-container">
              {this.renderButtons()}
              <br />
              ...
            </div>
          </div>
        ) : (
          <React.Fragment />
        )}
      </React.Fragment>
    );
  }
}

const testButtons = [
  { label: "forward", hot_key: "f", id: "1" },
  { label: "back", hot_key: "b", id: "2" },
  { label: "right", hot_key: "r", id: "3" },
  { label: "left", hot_key: "l", id: "4" }
];
