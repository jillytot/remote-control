import React, { Component } from "react";
import "./App.css";
import "./styles/common.css";
import EventHandler from "./components/EventHandler";

class App extends Component {
  render() {
    return (
      <div>
        <div className="App">
          <EventHandler />
        </div>
      </div>
    );
  }
}

export default App;
