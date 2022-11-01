import ReactDOM from 'react-dom/client';
import { io } from 'socket.io-client';
import './i18n';
import './assets/index.css';
import Init from './init.js';

const socket = io();

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  Init(socket),
);
