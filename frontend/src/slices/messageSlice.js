import { current, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { fetchInitialData } from '../components/Chat';

const messagesAdapter = createEntityAdapter();
const messageSlice = createSlice({
  name: 'messages',
  initialState: messagesAdapter.getInitialState({ loading: 'idle', error: null }),
  reducers: {
    addMessage: messagesAdapter.addOne,
    removeMessages(state, action) {
      const channelId = action.payload;
      const messagesByChannelId = Object
        .values(current(state).entities)
        .filter((message) => message.channelId === channelId);
      messagesAdapter.removeMany(state, messagesByChannelId);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialData.fulfilled, (state, action) => {
        const { messages } = action.payload;
        messagesAdapter.addMany(state, messages); 
      });
  },
});

export const { actions } = messageSlice;
export default messageSlice.reducer;
