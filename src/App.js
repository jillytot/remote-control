import React, { Component } from "react";
import "./App.css";
import "./styles/common.css";
import EventHandler from "./components/EventHandler";
import TestLayout from "./components/testing/testLayout";

class App extends Component {
  render() {
    return (
      <div>
        <div className="App">
          <EventHandler />
          {/* <TestLayout /> */}
        </div>
      </div>
    );
  }
}

export default App;
