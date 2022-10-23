import React, { useState, useRef, useEffect} from "react";
import { useFormik } from "formik";
import { Form, Button } from 'react-bootstrap';
import UseSocket from '../../hooks/UseSocket.jsx';
import { useSelector } from "react-redux";
import cn from 'classnames';
import { useTranslation } from 'react-i18next';

const NewMessageForm = ({currentChannel}) => {
  const { t } = useTranslation();
  const socket = UseSocket();
  const [newMessageInput, setNewMessageInput] = useState('');
  const inputRef = useRef();
  const sendButtonRef = useRef();
  const isDisabled = useSelector((state) => state.messages.loading === 'failed');
  useEffect(() => {
    inputRef.current.focus();
  }, []);
  useEffect(() => {
    sendButtonRef.current.disabled = (newMessageInput === '');
  }, [newMessageInput])
  
  const formik = useFormik({
    initialValues: {
      newMessage: '',
    },
    onSubmit: (values, {resetForm}) => {
      const { newMessage } = values;
      const { username } = JSON.parse(localStorage.getItem('userId'));
      const channelId = currentChannel.id;
      socket.emitMessage({body: newMessage, channelId, username});
      resetForm({values: ''});
      setNewMessageInput('');
    },
    
  });

  const btnClass = cn('btn', 'btn-group-vertical', {'disabled': isDisabled });
  return (
    <Form onSubmit={formik.handleSubmit} className="py-1 border rounded-2">
      <Form.Group className="input-group has-validation">
        <Form.Control
          value = {formik.values.newMessage}
          onChange = {(e) => {
            setNewMessageInput(e.target.value);
            formik.handleChange(e);
          }}
          onBlur={formik.handleBlur} 
          placeholder={t('enterAMessage')} 
          id="newMessage" 
          className="border-0 p-0 ps-2 form-control"
          ref={inputRef}
        />
        <Button type="submit" className={btnClass} ref={sendButtonRef}>
          {'>'}
          <span className="visually-hidden">{t('send')}</span>
        </Button>
      </Form.Group>
    </Form>
    )
};

export default NewMessageForm;