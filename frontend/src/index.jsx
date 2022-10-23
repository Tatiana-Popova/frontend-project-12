import ReactDOM from 'react-dom/client';
import './assets/index.css';
import Init from './init.js';
import { io } from 'socket.io-client';
import './i18n';

const socket = io();

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render( 
  Init(socket)
);
