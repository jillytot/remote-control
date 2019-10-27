import React, { Component } from "react";
import { BUTTON_COMMAND } from "../../../events/definitions";
import { buttonRate, getControls } from "../../../config/clientSettings";
import EditOptions from "./editOptions";
import "./robot.css";
import VolumeControl from "./volumeControl";
import GetLayout from "../../modules/getLayout";
import { GlobalStoreCtx } from "../../providers/globalStore";
import defaultImages from "../../../imgs/placeholders";
import RenderButtons from "./renderButtons";
import socket from "../../socket";
import axios from "axios";

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
        socket: socket,
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

    //handle channel change / channels list change and no controls id
    if (
      this.props.channel !== prevProps.channel ||
      this.props.channels.length !== prevProps.channels.length
    ) {
      this.emitGetControls();
    }
  }

  emitGetControls = () => {
    console.log("EMIT GET CONTROLS");
    const channel = this.props.channels.find(
      chan => chan.id === this.props.channel
    );

    if (channel) {
      socket.emit("GET_CONTROLS", channel);
    }
  };

  connectAV() {
    if (this.props.channel) {
      this.connectA();
      this.connectV();
    }
  }

  onMount = () => {
    socket.on("GET_USER_CONTROLS", this.onGetControls);
    socket.on(BUTTON_COMMAND, this.onButtonCommand);
    socket.on("CONTROLS_UPDATED", this.onControlsUpdated);
    if (this.state.controls.length === 0)
      this.setState({ controls: testButtons });
    this.setupKeyMap(testButtons);
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);
    document.addEventListener("blur", this.handleBlur);
    this.sendInterval = setInterval(this.sendCurrentKey, buttonRate);
    this.connectAV();
    this.emitGetControls();
  };

  async componentDidMount() {
    this.onMount();
  }

  connectA = () => {
    //need to add client options for video relay
    const protocol = window.location.protocol === "https:" ? "wss://" : "ws://";
    this.audioPlayer = new window.JSMpeg.Player(
      `${protocol}remo.tv/receive?name=${this.props.channel}-audio`,
      { video: false, disableWebAssembly: true }
    );
  };

  connectV = () => {
    const protocol = window.location.protocol === "https:" ? "wss://" : "ws://";
    this.videoPlayer = new window.JSMpeg.Player(
      `${protocol}remo.tv/receive?name=${this.props.channel}-video`,
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
    socket.off(BUTTON_COMMAND, this.onButtonCommand);
    socket.off("GET_USER_CONTROLS", this.onGetControls);
    socket.off("CONTROLS_UPDATED", this.onControlsUpdated);

    clearInterval(this.sendInterval);
    // console.log("Robot Interface Unmounted");
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

  onButtonCommand = command => {
    this.handleLoggingClicks(command);
    this.handleRenderPresses(command);
  };

  onGetControls = getControlData => {
    console.log("OnGetControls: ", getControlData);
    if (getControlData && getControlData.buttons.length > 0) {
      this.setState({
        controls: getControlData.buttons,
        controlsId: getControlData.id
      });
      this.setupKeyMap(getControlData.buttons);
    }
  };

  onControlsUpdated = () => {
    if (this.props.channelInfo && this.props.channelInfo.controls) {
      socket.emit("GET_CONTROLS", this.props.channelInfo);
    } else {
      this.handleGetControls();
    }
  };

  //Uses an API call to get controls for specific user.
  handleGetControls = async () => {
    const token = localStorage.getItem("token");
    console.log("Get Controls for User", this.props.channel);
    console.log(token);
    await axios
      .post(
        getControls,
        {
          channel_id: this.props.channel
        },
        {
          headers: { authorization: `Bearer ${token}` }
        }
      )
      .then(res => {
        console.log(res);
        this.onGetControls(res.data);
      })
      .catch(err => {
        console.log(err);
      });
    return null;
  };

  handleClick = click => {
    // console.log("CONTROLS ID: ", this.state.controlsId);
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
    return (
      <RenderButtons
        controls={this.state.controls}
        renderPresses={this.state.renderPresses}
        renderCurrentKey={this.state.renderCurrentKey}
        onClick={e => this.handleClick(e)}
        user={this.props.user}
        controls_id={this.state.controlsId}
        socket={socket}
      />
    );
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

const testButtons = [{ break: "line", label: "no controls available" }];
