import {  current, createSlice, createEntityAdapter, createAction } from '@reduxjs/toolkit';
import { fetchInitialData } from '../components/Chat';

export const changeCurrentChannel = createAction('changeCurrentChannel');

const channelsAdapter = createEntityAdapter();
const channelSlice = createSlice({
  name: 'channels',
  initialState: channelsAdapter.getInitialState({loading: 'idle', error: null}),
  reducers: {
    addChannel: channelsAdapter.addOne,
    removeChannel: channelsAdapter.removeOne,
    renameChannel: channelsAdapter.setOne,
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
        console.log('ОШИБОЧКА', action.error);

        state.loading = 'failed';
        state.error = action.error
      })
      .addCase(changeCurrentChannel, (state, action) => {
        const reasonToChange = action.payload.reason;
        let channelsToUpdate;
        const channels = Object.values(current(state).entities);
        switch(reasonToChange) {
          case 'removing':
            const currentChannel = channels.find((channel) => channel.isCurrent) ?? null;
            if (currentChannel) {
              channelsToUpdate = channels;
            } else {
              const generalChannelId = channels.find((channel) => channel.name === 'general').id;
              channelsToUpdate = channels.map((channel) => {
                const isCurrent = (channel.id === generalChannelId);
                return {...channel, isCurrent};
              })
            }
            break;
          case 'new': 
          case 'changing': {
            channelsToUpdate = channels.map((channel) => {
              const { channelIdToChange } = action.payload;
              const isCurrent = (channel.id === channelIdToChange);
              return {...channel, isCurrent};
            })
            break;
          }
          default: break;
        }
        channelsAdapter.setAll(state, channelsToUpdate);
      })
  }
})
export const {actions} = channelSlice;
export default channelSlice.reducer;
