import React, { Component } from "react";
import "./App.css";
import "./styles/common.css";
import EventHandler from "./components/EventHandler";
import IndexRouter from './components/routing'

class App extends Component {
  render() {
    return (
      <div>
        <div className="App">
          <IndexRouter></IndexRouter>
        </div>
      </div>
    );
  }
}

export default App;
