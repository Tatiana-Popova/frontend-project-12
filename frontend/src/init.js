import { I18nextProvider } from 'react-i18next';
import App from './components/App';
import React from 'react';
import { Provider } from 'react-redux';
import store from './slices/index.js'
import i18n from './i18n';

const Init = (socket) => {
  socket.on('connection', () => {
    console.log('testing', socket.id)
  })
  socket.on('newMessage', (data) => {
    console.log('TEST SOCKET ON', data);
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