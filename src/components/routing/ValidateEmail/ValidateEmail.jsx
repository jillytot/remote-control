import React, { Component } from "react";
import { Redirect } from "react-router-dom";

export default class ValidateEmail extends Component {
  state = {
    key: "",
    redirect: false
  };

  async componentDidMount() {
    console.log(this.props);
    await this.handleGetUrl();
    console.log("Get Key Result: ", this.state.key, this.props);
  }

  handleGetUrl = () => {
    const name = this.props.match.params.name;
    const path = this.props.location.pathname;
    const key = path.substr(name.length + 2);
    if (key !== "") this.setState({ key: key });
    return key;
  };

  render() {
    console.log("From Render: ", this.props.match);
    return this.state.redirect ? (
      <Redirect to="/"></Redirect>
    ) : (
      <div> Validate Email </div>
    );
  }
}
