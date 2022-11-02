import {
  current,
  createSlice,
  createEntityAdapter,
  createAction,
} from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { fetchInitialData } from '../components/Chat';

export const changeCurrentChannel = createAction('changeCurrentChannel');

const channelsAdapter = createEntityAdapter();
const channelSlice = createSlice({
  name: 'channels',
  initialState: channelsAdapter.getInitialState({ loading: 'idle', error: null }),
  reducers: {
    addChannel: channelsAdapter.addOne,
    removeChannel: channelsAdapter.removeOne,
    renameChannel: channelsAdapter.setOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialData.fulfilled, (state, action) => {
        console.log(action.payload);
        const { channels, currentChannelId } = action.payload;
        const markedAsCurrentChannels = channels.map((channel) => {
          // eslint-disable-next-line no-param-reassign
          channel.isCurrent = channel.id === currentChannelId;
          return channel;
        });
        // eslint-disable-next-line no-param-reassign
        state.error = null;
        channelsAdapter.addMany(state, markedAsCurrentChannels);
      })
      .addCase(fetchInitialData.rejected, (state, action) => {
        // eslint-disable-next-line no-param-reassign
        state.error = action.error;
      })
      .addCase(changeCurrentChannel, (state, action) => {
        const reasonToChange = action.payload.reason;
        const channels = Object.values(current(state).entities);
        switch (reasonToChange) {
          case 'removing': {
            const { channelId } = action.payload;
            const currentChannelId = (channels.find((channel) => channel.isCurrent)).id;
            const generalChannelId = channels.find((channel) => channel.name === 'general').id;
            const nextCurrentChannelId = (channelId === currentChannelId)
              ? generalChannelId : currentChannelId;
            console.log(nextCurrentChannelId, currentChannelId, generalChannelId);
            const channelsToUpdate = channels.map((channel) => {
              const isCurrent = (channel.id === nextCurrentChannelId);
              return { ...channel, isCurrent };
            });
            channelsAdapter.setAll(state, channelsToUpdate);
            break;
          }
          case 'new':
          case 'changing': {
            const channelsToUpdate = channels.map((channel) => {
              const { channelIdToChange } = action.payload;
              const isCurrent = (channel.id === channelIdToChange);
              return { ...channel, isCurrent };
            });
            channelsAdapter.setAll(state, channelsToUpdate);
            break;
          }
          default: break;
        }
      });
  },
});

export const { actions } = channelSlice;
export default channelSlice.reducer;
