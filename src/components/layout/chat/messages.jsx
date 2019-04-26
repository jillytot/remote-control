import React, { Component } from "react";
import Message from "./message";

export default class Messages extends Component {
  state = {};

  componentWillMount() {
    if (this.props.messages !== null) {
      this.setState({ messages: this.props.messages });
    }
  }

  displayMessages = messages => {
    return this.props.messages.map(message => {
      console.log("mapping messages: ");
      return <Message message={message} key={message["id"]} />;
    });
  };

  render() {
    return (
      <div>
        Loading Chat <div>{this.displayMessages(this.state.messages)}</div>
      </div>
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
