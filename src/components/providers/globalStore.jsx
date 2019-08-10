import React, { Component, useContext } from "react";

const GlobalStoreCtx = React.createContext();
class GlobalStore extends Component {
  state = {
    canvas: null,
    setCanvas: ({ value }) => this.setState({ canvas: value })
  };

  render() {
    console.log(this.state, this.props);

    return (
      <GlobalStoreCtx.Provider value={this.state}>
        {this.props.children}
      </GlobalStoreCtx.Provider>
    );
  }
}
export default GlobalStore;
export const UseStore = () => useContext(GlobalStoreCtx);
