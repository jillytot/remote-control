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

  handleChannelName = channel_id => {
    const { channels } = this.props;
    const name = channels.find(channel => channel.id === channel_id);
    if (name) return name.name;
    return "";
  };

  handlePrintChannelName = (messages, currentIndex) => {
    console.log(messages[currentIndex]["channel_id"]);
    if (currentIndex === 0) return true;
    if (
      messages[currentIndex - 1]["channel_id"] !==
      messages[currentIndex]["channel_id"]
    )
      return true;
    return false;
  };

  displayMessages = messages => {
    return messages.map((message, index) => {
      if (message.display_message) {
        return (
          <Message
            message={message}
            key={message["id"]}
            color={message.color}
            showMobileNav={this.props.showMobileNav}
            channelName={this.handleChannelName(message.channel_id)}
            printChannelName={this.handlePrintChannelName(messages, index)}
          />
        );
      } else {
        return <React.Fragment key={index} />;
      }
    });
  };

  render() {
    return (
      <div ref="container" className="chat-scroll">
        {this.displayMessages(this.props.messages)}
      </div>
    );
  }
}
