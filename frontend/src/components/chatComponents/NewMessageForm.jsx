import React, { useRef } from "react";
import { useFormik } from "formik";
import { Form, Button } from 'react-bootstrap';
import UseSocket from '../../hooks/UseSocket.jsx';
import { useSelector } from "react-redux";
import cn from 'classnames';

const NewMessageForm = ({currentChannel}) => {
  const socket = UseSocket();
  const inputRef = useRef();
  const isDisabled = useSelector((state) => state.messages.loading === 'failed');
  const formik = useFormik({
    initialValues: {
      newMessage: '',
    },
    onSubmit: (values) => {
      const { newMessage } = values;
      const { username } = JSON.parse(localStorage.getItem('userId'));
      const channelId = currentChannel.id;
      socket.socketEmit({body: newMessage, channelId, username});
    },
  });

  const btnClass = cn('btn', 'btn-group-vertical', {'disabled': isDisabled });
  return (
    <Form onSubmit={formik.handleSubmit} className="py-1 border rounded-2">
      <Form.Group className="input-group has-validation">
        <Form.Control
          value = {formik.values.newMessage}
          onChange = {formik.handleChange}
          onBlur={formik.handleBlur} 
          placeholder="Введите сообщение..." 
          id="newMessage" 
          className="border-0 p-0 ps-2 form-control"
          ref={inputRef}
        />
        <Button type="submit" className={btnClass}>
          {'>'}
          <span className="visually-hidden">Отправить</span>
        </Button>
      </Form.Group>
    </Form>
    )
};

export default NewMessageForm;