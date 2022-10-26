import { configureStore } from '@reduxjs/toolkit';
import channelSlice from '../slices/channelSlice';
import messageSlice from './messageSlice';

const store =  configureStore({
  reducer: {
    channels: channelSlice,
    messages: messageSlice,
  },
});

export default store;