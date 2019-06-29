import React from "react";
import "../../styles/common.css";
import "../layout/chat/chat.css";
import { chatCharMax } from "../../config/clientSettings";

const TextAreaChat = ({
  name,
  label,
  error,
  type,
  ref,
  onKeyDown,
  ...rest
}) => {
  return (
    <React.Fragment>
      <textarea
        {...rest}
        ref={ref}
        type={type}
        name={name}
        rows="2"
        maxLength={chatCharMax}
        placeholder="The chatbox makes the robots talk"
        className="chat-input"
        autoComplete="off"
        wrap="soft"
        onKeyDown={onKeyDown}
      />
    </React.Fragment>
  );
};

export default TextAreaChat;
