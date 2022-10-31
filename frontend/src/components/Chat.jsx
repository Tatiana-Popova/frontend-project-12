import React from 'react';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { Container, Row } from 'react-bootstrap';
import Channels from './chatComponents/Channels.jsx';
import Messages from './chatComponents/Messages.jsx';
import routes from '../routes.js';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));
  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }
  return {};
};

export const fetchInitialData = createAsyncThunk(
  'fetchInitialData',
  async () => {
    const { data } = await axios.get(routes.usersPath(), { headers: getAuthHeader() });
    return data;
  },
);

const Chat = (socket) => {
  const dispatch = useDispatch();
  dispatch(fetchInitialData());
  return (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <Row className="bg-white flex-md-row" style={{ height: '85vh' }}>
        <Channels />
        <Messages value={socket}/>
      </Row>
    </Container> 
  );
};

export default Chat;
