import React from "react";
import { useSelector } from 'react-redux';
import NewMessageForm from "./NewMessageForm.jsx";

const Messages = (socket) => {
  const messages = useSelector((state) => {
    return (Object.values(state.messages.entities))
  });
  console.log('messages = ', messages);
  const channels = useSelector((state) => {
    return Object.values(state.channels.entities);
  });
  const currentChannel = (channels.find(channel => channel.isCurrent));

  return (
    <div className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0">
            <b># {currentChannel ? currentChannel.name : ''}</b>
          </p>
          <span className="text-muted">{messages.length} сообщений</span>
        </div>
        <div id="messages-box" className="chat-messages overflow-auto px-5">
          {
            messages && messages.map((message) => {
              return (
                <div className="text-break mb-2">
                  <b>{message.username}</b>: {message.body}
                </div>
              )
            })
          }
        </div>
        <div className="mt-auto px-5 py-3">
          {currentChannel && <NewMessageForm currentChannel={currentChannel}/>}
        </div>
      </div>
    </div>
  )
};

export default Messages;