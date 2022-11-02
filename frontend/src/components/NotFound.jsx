import React from 'react';
import { useTranslation } from 'react-i18next';
import avatarNotFound from '../assets/avatar_not_found.jpg';

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className="text-center">
        <img alt={t('errors.pageIsNotFounded')} className="img-fluid h-25" src={avatarNotFound} />
        <h1 className="h4 text-muted">{t('errors.pageIsNotFounded')}</h1>
        <p className="text-muted">
          {t('youCanGo')}
          <a href="/">
            {t('toTheMainPage')}
          </a>
        </p>
      </div>
    </>
  );
};

export default NotFound;
