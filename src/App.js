import React, { Component } from "react";
import "./App.css";
import "./styles/common.css";
import IndexRouter from "./components/routing";
import WindowDimensionsProvider from "./components/providers/windowDimensionProvider";
import ChatProvider from "./components/providers/chatProvider";

class App extends Component {
  render() {
    return (
      <div>
        <div className="App">
          <WindowDimensionsProvider>
            <ChatProvider>
              <IndexRouter />
            </ChatProvider>
          </WindowDimensionsProvider>
        </div>
      </div>
    );
  }
}

export default App;
