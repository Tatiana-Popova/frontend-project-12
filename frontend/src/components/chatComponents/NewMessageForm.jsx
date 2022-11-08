import React, { useState, useRef, useEffect } from 'react';
import { useFormik } from 'formik';
import { Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import filter from 'leo-profanity';
import UseSocket from '../../hooks/UseSocket.jsx';

const NewMessageForm = ({ currentChannel }) => {
  const { t } = useTranslation();
  const socket = UseSocket();
  filter.loadDictionary('ru');
  filter.add(filter.getDictionary('en'));
  const [newMessageInput, setNewMessageInput] = useState('');
  const inputRef = useRef();
  const sendButtonRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);
  useEffect(() => {
    sendButtonRef.current.disabled = (newMessageInput === '');
  }, [newMessageInput]);

  const formik = useFormik({
    initialValues: {
      newMessage: '',
    },
    onSubmit: (values, { resetForm }) => {
      formik.setSubmitting(true);
      const { newMessage } = values;
      const filteredMessage = filter.clean(newMessage);
      const { username } = JSON.parse(localStorage.getItem('userId'));
      const channelId = currentChannel.id;
      socket.emitMessage({ body: filteredMessage, channelId, username });
      resetForm({ values: '' });
      setNewMessageInput('');
      formik.setSubmitting(false);
    },
  });

  return (
    <Form onSubmit={formik.handleSubmit} className="p-1 border rounded-2">
      <Form.Group className="input-group has-validation">
        <Form.Control
          value={formik.values.newMessage}
          onChange={(e) => {
            setNewMessageInput(e.target.value);
            formik.handleChange(e);
          }}
          onBlur={formik.handleBlur}
          placeholder={t('enterAMessage')}
          id="newMessage"
          aria-label={t('newMessage')}
          className="border-0 p-0 ps-2 me-1 shadow-none"
          ref={inputRef}
        />
        <Button 
          type="submit"
          variant="outline-primary"
          className="rounded ml-2"
          ref={sendButtonRef}
          disabled={formik.isSubmitting}
        >
          {'>'}
          <span className="visually-hidden">{t('send')}</span>
        </Button>
      </Form.Group>
    </Form>
  );
};

export default NewMessageForm;
