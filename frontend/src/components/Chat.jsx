import React, { useEffect } from 'react';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { Container, Row } from 'react-bootstrap';
// eslint-disable-next-line import/no-cycle
import Channels from './chatComponents/Channels.jsx';
import Messages from './chatComponents/Messages.jsx';
import routes from '../routes.js';
import useAuth from '../hooks/index.jsx';

export const fetchInitialData = createAsyncThunk(
  'fetchInitialData',
  async () => {
    const auth = useAuth();
    const { data } = await axios.get(routes.usersPath(), { headers: auth.getAuthHeader() });
    return data;
  },
);

const Chat = (socket) => {
  const dispatch = useDispatch();
  // useEffect(() => {
    dispatch(fetchInitialData());
  // }, []);

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
