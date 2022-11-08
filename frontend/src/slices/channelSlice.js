import {
  current,
  createSlice,
  createEntityAdapter,
  createAction,
} from '@reduxjs/toolkit';

export const changeCurrentChannel = createAction('changeCurrentChannel');

const channelsAdapter = createEntityAdapter();
const channelSlice = createSlice({
  name: 'channels',
  initialState: channelsAdapter.getInitialState({ loading: 'idle', error: null }),
  reducers: {
    addChannel: channelsAdapter.addOne,
    addChannels: channelsAdapter.addMany,
    removeChannel: channelsAdapter.removeOne,
    renameChannel: channelsAdapter.setOne,
  },
  extraReducers: (builder) => {
    builder
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
