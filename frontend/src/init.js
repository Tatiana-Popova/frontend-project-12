import React from 'react';
import { Provider } from 'react-redux';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import App from './components/App';
import store from './slices/index.js';
import { actions as messageActions } from './slices/messageSlice';
import { actions as channelActions, changeCurrentChannel } from './slices/channelSlice';

console.log('process.env is', process.env.ACCESSTOKEN);

const rollbarConfig = {
  accessToken: '9e32ac7a1cb24d97a730d404c5ec8682',
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    environment: 'production',
  },
};

const Init = (socket) => {
// eslint-disable-next-line react/destructuring-assignment
  socket.on('newMessage', (data) => {
    store.dispatch(messageActions.addMessage(data));
  });
  // eslint-disable-next-line react/destructuring-assignment
  socket.on('newChannel', (data) => {
    store.dispatch(channelActions.addChannel(data));
  });
  // eslint-disable-next-line react/destructuring-assignment
  socket.on('removeChannel', ({ id }) => {
    store.dispatch(changeCurrentChannel({ reason: 'removing', channelId: id }));
    store.dispatch(channelActions.removeChannel(id));
    store.dispatch(messageActions.removeMessages(id));
  });
  // eslint-disable-next-line react/destructuring-assignment
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
