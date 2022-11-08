import ReactDOM from 'react-dom/client';
import { io } from 'socket.io-client';
import './assets/index.css';
import Init from './init.js';

const socket = io();

const root = ReactDOM.createRoot(document.getElementById('app'));

root.render(
  Init(socket),
);
