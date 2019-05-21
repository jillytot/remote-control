import React, { Component } from "react";
import Message from "./message";

export default class Messages extends Component {
  constructor(props) {
    super(props);
    this.scrollDown = this.scrollDown.bind(this);
  }

  scrollDown() {
    const { container } = this.refs;
    container.scrollTop = container.scrollHeight;
  }

  componentDidMount() {
    this.scrollDown();
  }

  componentDidUpdate(prevProps, prevState) {
    this.scrollDown();
  }

  displayMessages = messages => {
    //console.log("messages", messages);

    return messages.map(message => {
      //console.log("Mapping Messages: ", message.sender);
      return (
        <Message message={message} key={message["id"]} color={message.color} />
      );
    });
  };

  render() {
    return (
      <React.Fragment>
        <div className="chat-header">
          {" "}
          {this.props.name}
          <div ref="container" className="chat-scroll">
            {this.displayMessages(this.props.messages)}
          </div>
        </div>
      </React.Fragment>
    );
  }
}
