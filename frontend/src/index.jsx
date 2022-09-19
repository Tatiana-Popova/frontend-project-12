
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App.jsx';
import './assets/index.css';
import store from './slices/index.js';
import { Provider } from 'react-redux';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render( 
  <Provider store={store}>
    <App />
  </Provider>
);