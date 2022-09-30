import {  createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { fetchInitialData } from '../components/Chat';

const channelsAdapter = createEntityAdapter();
const channelSlice = createSlice({
  name: 'channels',
  initialState: channelsAdapter.getInitialState({loading: 'idle', error: null}),
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialData.pending, (state) => {
        state.loading = 'loading';
        state.error = null
      })  
      .addCase(fetchInitialData.fulfilled, (state, action) => {
        const { channels, currentChannelId } = action.payload;
        const markedAsCurrentChannels = channels.map((channel) => {
          channel['isCurrent'] = (channel.id === currentChannelId) ? true : false;
          return channel;
        })
        channelsAdapter.addMany(state, markedAsCurrentChannels);    
        state.loading = 'idle';
        state.error = null
      })
      .addCase(fetchInitialData.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error
      })
  }
})
export const {actions} = channelSlice;
export default channelSlice.reducer;
