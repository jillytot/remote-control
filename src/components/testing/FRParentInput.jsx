import React, { Component } from "react";
import FRInput from "./FRInput";

export default class FRParentInput extends Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  clickHandler = () => {
    this.inputRef.current.focus();
  };

  render() {
    return (
      <div>
        <FRInput ref={this.inputRef} />
        <button onClick={this.clickHandler}> Focus Input </button>
      </div>
    );
  }
}
