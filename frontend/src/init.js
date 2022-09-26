import { useTranslation, I18nextProvider, initReactI18next } from 'react-i18next';
import App from './components/App';
import resources from './locales/index.js';
import React from 'react';
import { Provider } from 'react-redux';
import store from './slices/index.js'
import i18n from './i18n';

const Init = () => {
 
  return (
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <App />
      </Provider>
    </I18nextProvider>
  );
};

export default Init;