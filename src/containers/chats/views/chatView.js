import React from "react";

import Chat from "../chat";
const ChatList = React.lazy(() => import("./chatList"));

export default function ChatView(props) {
  return props.isList ? (
    <ChatList session={props.session} />
  ) : (
    <Chat session={props.session} id={props.id} listView={false} />
  );
}
