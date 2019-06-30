import React, { Component } from "react";

export default class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clear: false
    };
  }

  componentDidMount() {
    console.log("mounting counter: ", this.props);
    this.interval = setInterval(() => {
      console.log("Clear Timer");
      this.setState({ clear: true });
      if (this.props.onClear) {
        this.props.onClear(this.props.press);
      }
    }, this.props.count);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return <React.Fragment />;
  }
}
