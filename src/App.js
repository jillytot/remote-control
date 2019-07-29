import React, { Component } from "react";
import "./App.css";
import "./styles/common.css";
import IndexRouter from "./components/routing";
import WindowDimensionsProvider from "./components/providers/windowDimensionProvider";

class App extends Component {
  render() {
    return (
      <div>
        <div className="App">
          <WindowDimensionsProvider>
            <IndexRouter />
          </WindowDimensionsProvider>
        </div>
      </div>
    );
  }
}

export default App;
