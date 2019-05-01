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
          chat header
          <div ref="container" className="chat-scroll">
            {this.displayMessages(this.props.messages)}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

// const chatMessages = [
//   {
//     username: "user-name",
//     message: "This is a message from a user",
//     _id: "25802-2352-25435245-254"
//   },
//   {
//     username: "a User",
//     message: "This is a response to the message",
//     _id: "25802-2352-25435245-255"
//   },
//   {
//     username: "Am a user",
//     message: "I like sending messages because it makes me feel important",
//     _id: "25802-2352-25435245-256"
//   },
//   {
//     username: "the worst user",
//     message: "Read this message and behold my splendor!",
//     _id: "25802-2352-25435245-257"
//   }
// ];

// testMessages = {
//    message : {
//       username: "user-name",
//       message: "This is a message from a user",
//       type: "standard",
//       display: true,
//       room: "AwesomeBot9000",
//       badges: {},
//       color: "light",
//       avatar: "/img"
//     }
// }
