import React, { Component } from "react";
import { BUTTON_COMMAND } from "../../../events/definitions";
import { buttonRate } from "../../../config/clientSettings";
import EditOptions from "./editOptions";
import "./robot.css";
import VolumeControl from "./volumeControl";
import GetLayout from "../../modules/getLayout";
import { GlobalStoreCtx } from "../../providers/globalStore";
import defaultImages from "../../../imgs/placeholders";

export default class RobotInterface extends Component {
  state = {
    controls: [],
    logClicks: [],
    displayLog: true,
    clickCounter: 0,
    controlsId: "",
    renderCurrentKey: null,
    renderPresses: [],
    canvasHeight: null
  };

  currentKey = null;

  handleBlur = () => {
    if (this.currentKey) {
      this.currentKey = null;
      this.setState({ renderCurrentKey: null });
    }
  };

  sendCurrentKey = () => {
    const button = this.keyMap[this.currentKey];
    if (button && this.props.chatTabbed === false) {
      this.handleClick({
        user: this.props.user,
        controls_id: this.state.controlsId,
        socket: this.props.socket,
        button: button
      });
    }
  };

  componentDidUpdate(prevProps) {
    if (prevProps.channel !== this.props.channel && this.props.channel) {
      this.clearAV();
      this.connectAV();
    }

    if (
      this.refs["video-canvas"] &&
      this.refs["video-canvas"].clientHeight &&
      this.refs["video-canvas"].clientHeight !== this.state.canvasHeight
    ) {
      this.updateCanvas();
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
    this.setupKeyMap(testButtons);
    this.commandListener();
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);
    document.addEventListener("blur", this.handleBlur);
    this.sendInterval = setInterval(this.sendCurrentKey, buttonRate);
  }

  connectA = () => {
    this.audioPlayer = new window.JSMpeg.Player(
      `ws://dev.remo.tv:1567/receive?name=${this.props.channel}-audio`,
      { video: false, disableWebAssembly: true }
    );
  };

  connectV = () => {
    this.videoPlayer = new window.JSMpeg.Player(
      `ws://dev.remo.tv:1567/receive?name=${this.props.channel}-video`,
      {
        canvas: this.refs["video-canvas"],
        videoBufferSize: 1 * 1024 * 1024,
        audio: false,
        disableWebAssembly: true,
        opacity: true
      }
    );
  };

  updateCanvas = () => {
    const height = this.refs["video-canvas"].clientHeight;
    console.log(height);
    this.setState({ canvasHeight: height });
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
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("keyup", this.handleKeyUp);
    document.removeEventListener("blur", this.handleBlur);
    clearInterval(this.sendInterval);
  }

  handleKeyDown = e => {
    if (!this.props.chatTabbed && !this.props.isModalShowing) {
      if (this.currentKey !== e.key) {
        this.setState({ renderCurrentKey: e.key });
        this.currentKey = e.key;
        this.sendCurrentKey();
      }
    }
  };

  handleKeyUp = e => {
    if (e.key === this.currentKey) {
      this.currentKey = null;
      this.setState({ renderCurrentKey: null });
    }
  };

  keyMap = {};

  setupKeyMap = controls => {
    const keyMap = {};
    controls.map(button => {
      return (keyMap[button.hot_key] = button);
    });
    this.keyMap = keyMap;
  };

  commandListener = () => {
    const { socket } = this.props;
    socket.on(BUTTON_COMMAND, command => {
      //console.log("Button Command Listener", command);
      this.handleLoggingClicks(command);
      this.handleRenderPresses(command);
    });
    socket.on("CONTROLS_UPDATED", getControlData => {
      console.log("CONTROLS UPDATED: ", getControlData);
      if (getControlData && getControlData.buttons.length > 0)
        this.setState({
          controls: getControlData.buttons,
          controlsId: getControlData.id
        });
      this.setupKeyMap(getControlData.buttons);
    });
  };

  handleClick = click => {
    const { socket } = this.props;
    socket.emit(BUTTON_COMMAND, {
      user: click.user,
      button: click.button,
      controls_id: this.state.controlsId,
      channel: this.props.channel,
      server: this.props.server.server_id
    });
  };

  handleRenderPresses = press => {
    let updatePresses = this.state.renderPresses;
    press.counter = setTimeout(() => this.handleClear(press), 200);
    updatePresses.push(press);
    this.setState({ renderPresses: updatePresses });
  };

  handleClear = press => {
    clearTimeout(press.counter);
    let updatePresses = [];
    this.state.renderPresses.map(getPress => {
      if (press.button.id === getPress.button.id) {
        //do nothing
      } else {
        updatePresses.push(getPress);
      }
      return null;
    });

    if (this.state.renderPresses !== updatePresses)
      this.setState({ renderPresses: updatePresses });
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
    // console.log("OPTIONS CHECK: ", this.options);
    if (this.state.controls) {
      return this.state.controls.map(button => {
        let hotKeyStyle = "hotkey";
        let style = {};
        if (button.hot_key === this.state.renderCurrentKey) {
          style = {
            boxShadow: "inset 0 0 0 2px rgb(5, 214, 186)",
            transform: "translateY(4px)",
            WebkitTransform: "translateY(4px)"
          }; // noice!
        }
        this.state.renderPresses.map(press => {
          if (press && press.button.id === button.id) {
            style.backgroundColor = "rgb(64, 76, 131)";
            hotKeyStyle = "hotkey hotkey-highlight";
          }
          return null;
        });

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
            style={style}
          >
            {button.hot_key ? (
              <span className={hotKeyStyle}>{button.hot_key}</span>
            ) : (
              <React.Fragment />
            )}
            {button.label}
          </button>
        );
      });
    }
  };

  handleDisplayActivity = () => {
    // console.log(this.refs);
    return (
      <div className="display-info-container">
        {this.state.displayLog ? this.renderClickLog() : <React.Fragment />}
      </div>
    );
  };

  handleMobileOptionsMenu = () => {
    return (
      <div
        className="mobile-options-menu"
        ref={options => {
          this.options = options;
        }}
      >
        ...
      </div>
    );
  };

  handleCanvasHeight = () => {
    const { canvasHeight } = this.state;
    return (
      <GlobalStoreCtx.Consumer>
        {({ setCanvas }) => setCanvas(canvasHeight)}
      </GlobalStoreCtx.Consumer>
    );
  };

  render() {
    return (
      <React.Fragment>
        {this.props.channel ? (
          <div className="robot-container">
            <div className="robot-display-container">
              <canvas className="video-canvas" ref="video-canvas" />
              <img className="video-poster" src={defaultImages.videoImg} />
              <div className="display-controls-container">
                <VolumeControl
                  player={this.audioPlayer}
                  channel={this.props.channel}
                />
              </div>

              <GetLayout
                renderSize={768}
                renderDesktop={this.handleDisplayActivity}
              />
            </div>
            <GetLayout renderMobile={this.handleMobileOptionsMenu} />
            {this.handleCanvasHeight()}
            <div className="robot-controls-container">
              {this.renderButtons()}
              <br />
              <EditOptions
                server={this.props.server}
                user={this.props.user}
                modal={this.props.modal}
                onCloseModal={this.props.onCloseModal}
                channel={this.props.channel}
              />
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
