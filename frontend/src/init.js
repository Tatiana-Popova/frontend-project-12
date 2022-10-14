import React from 'react';
import { I18nextProvider } from 'react-i18next';
import App from './components/App';
import { Provider, useSelector } from 'react-redux';
import store from './slices/index.js'
import i18n from './i18n';
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
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <App socket={socket}/>
      </Provider>
    </I18nextProvider>
  );
};

export default Init;