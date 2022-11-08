/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { Provider } from 'react-redux';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import App from './components/App';
import store from './slices/index.js';
import { actions as messageActions } from './slices/messageSlice';
import { actions as channelActions, changeCurrentChannel } from './slices/channelSlice';
import resources from './locales/index.js';

const rollbarConfig = {
  accessToken: process.env.REACT_APP_ACCESSTOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    environment: 'production',
  },
};

const Init = (socket) => {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: 'ru',
      fallbackLng: 'ru',
      debug: true,
      interpolation: {
        escapeValue: false,
      },
    });

  socket.on('newMessage', (data) => {
    store.dispatch(messageActions.addMessage(data));
  });
  socket.on('newChannel', (data) => {
    store.dispatch(channelActions.addChannel(data));
  });
  socket.on('removeChannel', ({ id }) => {
    store.dispatch(changeCurrentChannel({ reason: 'removing', channelId: id }));
    store.dispatch(channelActions.removeChannel(id));
    store.dispatch(messageActions.removeMessages(id));
  });
  socket.on('renameChannel', (data) => {
    store.dispatch(channelActions.renameChannel(data));
  });

  return (
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        <Provider store={store}>
          <App socket={socket} />
        </Provider>
      </ErrorBoundary>
    </RollbarProvider>
  );
};

export default Init;
