import React, { createContext, useContext } from "react";
import SendChat from "../layout/chat/sendChat";
const ChatContext = createContext(null);
const ChatProvider = ({ getComponet, children }) => {
  const selectComponent = () => {
    if (getComponet === "sendChat") {
      console.log("GET COMPONENT CHECK: ", getComponet);
      return <div> SendChat </div>;
    }
    return <React.Fragment />;
  };

  const getSendChat = ({
    onEvent,
    user,
    socket,
    chatroom,
    handleChatFeedback,
    setChatTabbed,
    chatTabbed,
    isModalShowing,
    showMobileNav
  }) => {
    return (
      <SendChat
        onEvent={onEvent}
        user={user}
        socket={socket}
        chatId={chatroom ? chatroom.id : ""}
        server_id={chatroom ? chatroom.host_id : ""}
        onChatFeedback={handleChatFeedback}
        setChatTabbed={setChatTabbed}
        chatTabbed={chatTabbed}
        isModalShowing={isModalShowing}
        showMobileNav={showMobileNav}
      />
    );
  };

  return (
    <ChatContext.Provider value={selectComponent()}>
      {children}
    </ChatContext.Provider>
  );
};
export default ChatProvider;
export const useChat = () => useContext(ChatContext);
