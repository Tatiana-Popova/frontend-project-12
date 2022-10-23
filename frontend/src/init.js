import React from 'react';
import App from './components/App';
import { Provider } from 'react-redux';
import store from './slices/index.js'
import { actions as messageActions } from './slices/messageSlice';
import { actions as channelActions, changeCurrentChannel } from './slices/channelSlice';

const Init = (socket) => {
  socket.on('newMessage', (data) => {
    store.dispatch(messageActions.addMessage(data));
  });
  socket.on('newChannel', (data) => {
    store.dispatch(channelActions.addChannel(data));
  });
  socket.on('removeChannel', ({id}) => {
    store.dispatch(channelActions.removeChannel(id));
    store.dispatch(messageActions.removeMessages(id));
    store.dispatch(changeCurrentChannel({reason: 'removing'}))
  });
  socket.on('renameChannel', (data) => {
    store.dispatch(channelActions.renameChannel(data));
  })
  
  return (
    <Provider store={store}>
      <App socket={socket}/>
    </Provider>
  );
};

export default Init;