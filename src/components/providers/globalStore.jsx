import React, { Component, createContext } from "react";

export const GlobalStoreCtx = createContext();
class GlobalStore extends Component {
  state = {
    canvas: null,
    setCanvas: value => this.handleSetCanvas(value)
  };

  handleSetCanvas = input => {
    if (input) {
      console.log(input);
      if (input !== this.state.canvas) this.setState({ canvas: input });
    }
  };

  render() {
    console.log("DING: ", this.state, this.props);

    return (
      <GlobalStoreCtx.Provider value={this.state}>
        {this.props.children}
      </GlobalStoreCtx.Provider>
    );
  }
}
export default GlobalStore;
