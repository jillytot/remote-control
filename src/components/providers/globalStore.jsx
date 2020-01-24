import React, { Component, createContext } from "react";

export const GlobalStoreCtx = createContext();
class GlobalStore extends Component {
  state = {
    canvas: null,
    setCanvas: value => this.handleSetCanvas(value)
  };

  handleSetCanvas = input => {
    // console.log("INPUT: ", input);
    if (input) {
      if (input !== this.state.canvas) this.setState({ canvas: input });
    }
  };

  render() {
    // console.log("Global Store -> State: ", this.state, "Props: ", this.props);

    return (
      <GlobalStoreCtx.Provider value={this.state}>
        {this.props.children}
      </GlobalStoreCtx.Provider>
    );
  }
}
export default GlobalStore;
