import React, { createContext, useContext } from "react";
const ChatContext = createContext(null);
const ChatProvider = ({ sendChat, children }) => {
  return (
    <ChatContext.Provider value={sendChat}>{children}</ChatContext.Provider>
  );
};
export default ChatProvider;
export const useChat = () => useContext(ChatContext);
