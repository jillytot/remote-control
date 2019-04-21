import React, { Component } from "react";
import Layout from "./components/layout/layout";
import "./App.css";
import "./styles/common.css";

class App extends Component {
  render() {
    return (
      <div>
        <div className="App">
          <Layout />
        </div>
      </div>
    );
  }
}

export default App;
