import React from 'react';
import { I18nextProvider } from 'react-i18next';
import App from './components/App';
import { Provider } from 'react-redux';
import store from './slices/index.js'
import i18n from './i18n';
import { actions as messageActions } from './slices/messageSlice';

const Init = (socket) => {
  socket.on('newMessage', (data) => {
    store.dispatch(messageActions.addMessage(data));
  });
  
  return (
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <App socket={socket}/>
      </Provider>
    </I18nextProvider>
  );
};

export default Init;