import React from "react";
import Channels from './chatComponents/Channels.jsx';
import Messages from "./chatComponents/Messages.jsx";
import { createAsyncThunk } from '@reduxjs/toolkit';
import routes from "../routes.js";
import axios from "axios";

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
    return data
  }
);

const Chat = (socket) => {
  return (
    <div className="container h-100 my-4 overflow-hidden rounded shadow">
       <div className="row h-100 bg-white flex-md-row">
      <Channels />
      <Messages value={socket}/>
    </div>
    </div>
  )
}
export default Chat;