import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Container, Row } from 'react-bootstrap';
// eslint-disable-next-line import/no-cycle
import Channels from './chatComponents/Channels.jsx';
import Messages from './chatComponents/Messages.jsx';
import routes from '../routes.js';
import useAuth from '../hooks/index.jsx';
import { actions as channelActions } from '../slices/channelSlice.js';
import { actions as messageActions } from '../slices/messageSlice.js';

const Chat = (socket) => {
  const dispatch = useDispatch();
  const auth = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const { data } = await axios.get(routes.usersPath(), { headers: auth.getAuthHeader() });
        const { channels, currentChannelId, messages } = data;
        const markedAsCurrentChannels = channels.map((channel) => {
          // eslint-disable-next-line no-param-reassign
          channel.isCurrent = channel.id === currentChannelId;
          return channel;
        });
      dispatch(channelActions.addChannels(markedAsCurrentChannels));
      dispatch(messageActions.addMessages(messages));
      } catch (error) {
        console.log('error', error);
        if (error.code === 'ERR_BAD_REQUEST') {
          auth.logOut();
          navigate(routes.pages.login);
        } else if (error) {
          toast.error(t('errors.networkError'));
        }
      }
    };
    fetchInitialData();
  //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <Row className="bg-white flex-md-row" style={{ height: '85vh' }}>
        <Channels />
        <Messages value={socket} />
      </Row>
    </Container>
  );
};

export default Chat;
