import { current, createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import routes from "../routes";
import axios from "axios";
import { fetchInitialData } from "../components/Chat";

const messagesAdapter = createEntityAdapter();
const messageSlice = createSlice({
  name: 'messages',
  initialState: messagesAdapter.getInitialState({loading: 'idle', error: null}),
  reducers: {
    addMessage: messagesAdapter.addOne,
    addNetworkError(state, action) {
      state.loading = 'failed';
      state.error = action;
    } ,
    removeMessages(state, action) {
      const channelId = action.payload;
      const messagesByChannelId = Object.values(current(state).entities)
      .filter((message) => message.channelId === channelId);
      messagesAdapter.removeMany(state, messagesByChannelId);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialData.pending, (state) => {
        state.loading = 'loading';
        state.error = null
      })
      .addCase(fetchInitialData.fulfilled, (state, action) => {
        const { messages } = action.payload;
        messagesAdapter.addMany(state, messages);    
        state.loading = 'idle';
        state.error = null
      })
      .addCase(fetchInitialData.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error
      })
  }
});

export const {actions} = messageSlice;
export default messageSlice.reducer;