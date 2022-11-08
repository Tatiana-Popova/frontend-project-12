import { current, createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const messagesAdapter = createEntityAdapter();
const messageSlice = createSlice({
  name: 'messages',
  initialState: messagesAdapter.getInitialState(),
  reducers: {
    addMessage: messagesAdapter.addOne,
    addMessages: messagesAdapter.addMany,
    removeMessages(state, action) {
      const channelId = action.payload;
      const messagesByChannelId = Object
        .values(current(state).entities)
        .filter((message) => message.channelId === channelId);
      messagesAdapter.removeMany(state, messagesByChannelId);
    },
  },
});

export const { actions } = messageSlice;
export default messageSlice.reducer;
