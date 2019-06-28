import React, { Component } from "react";
import { BUTTON_COMMAND } from "../../../events/definitions";
import "./robot.css";

export default class RobotInterface extends Component {
  state = {
    controls: [],
    logClicks: [],
    displayLog: true,
    clickCounter: 0,
    controlsId: ""
  };

  componentDidUpdate(prevProps) {
    if (prevProps.channel !== this.props.channel && this.props.channel) {
      this.clearAV();
      this.connectAV();
    }
  }

  connectAV() {
    if (this.props.channel) {
      this.connectA();
      this.connectV();
    }
  }

  componentDidMount() {
    if (this.state.controls.length === 0)
      this.setState({ controls: testButtons });
    this.commandListener();
  }

  connectA = () => {
    this.audioPlayer = new window.JSMpeg.Player(
      `ws://dev.remo.tv:1567/recieve?name=${this.props.channel}-audio`,
      { video: false, disableWebAssembly: true }
    );
  };

  connectV = () => {
    this.videoPlayer = new window.JSMpeg.Player(
      `ws://dev.remo.tv:1567/recieve?name=${this.props.channel}-video`,
      {
        canvas: this.refs["video-canvas"],
        videoBufferSize: 1 * 1024 * 1024,
        audio: false,
        disableWebAssembly: true
      }
    );
  };

  clearA = () => {
    try {
      if (this.audioPlayer) {
        this.audioPlayer.destroy();
      }
    } catch (e) {
      console.error(e);
    }
  };

  clearV = () => {
    try {
      if (this.videoPlayer) {
        this.videoPlayer.destroy();
      }
    } catch (e) {
      console.error(e);
    }
  };

  clearAV = () => {
    this.clearA();
    this.clearV();
  };

  componentWillUnmount() {
    this.clearAV();
  }

  commandListener = () => {
    const { socket } = this.props;
    socket.on(BUTTON_COMMAND, command => {
      console.log("Button Command Listener", command);
      this.handleLoggingClicks(command);
    });
    socket.on("CONTROLS_UPDATED", getControlData => {
      console.log("CONTROLS UPDATED: ", getControlData);
      if (getControlData && getControlData.buttons.length > 0)
        this.setState({
          controls: getControlData.buttons,
          controlsId: getControlData.id
        });
    });
  };

  handleClick = click => {
    const { socket } = this.props;
    console.log("CLICK CHECK: ", click);
    socket.emit(BUTTON_COMMAND, {
      user: click.user,
      button: click.button,
      controls_id: this.state.controlsId,
      channel: this.props.channel
    });
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
    if (this.state.controls) {
      return this.state.controls.map(button => {
        return (
          <button
            className={button.hot_key ? "robtn robtn-hot-key" : "robtn"}
            key={button.id}
            onClick={() =>
              this.handleClick({
                user: this.props.user,
                controls_id: this.state.controlsId,
                socket: this.props.socket,
                button: button
              })
            }
          >
            {button.hot_key ? (
              <span className="hotkey">{button.hot_key} :</span>
            ) : (
              <React.Fragment />
            )}
            {button.label}
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
              <canvas className="video-canvas" ref="video-canvas" />
              <div className="display-info-container">
                {this.state.displayLog ? (
                  this.renderClickLog()
                ) : (
                  <React.Fragment />
                )}
              </div>{" "}
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
  { label: "forward", hot_key: "w", id: "1" },
  { label: "back", hot_key: "s", id: "2" },
  { label: "left", hot_key: "a", id: "4" },
  { label: "right", hot_key: "d", id: "3" }
];
