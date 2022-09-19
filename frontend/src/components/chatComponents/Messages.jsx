import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { Form, Button } from 'react-bootstrap';


const Messages = () => {
  const messages = useSelector((state) => {
    return (Object.values(state.messages.entities))
  });
  const channels = useSelector((state) => {
    return Object.values(state.channels.entities);
  });
  const currentChannel = (channels.find(channel => channel.isCurrent));

  const formik = useFormik({
    initialValues: {
      newMessage: '',
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <div className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0">
            <b># {currentChannel ? currentChannel.name : ''}</b>
          </p>
          <span className="text-muted">{messages.length} сообщений</span>
        </div>
        <div id="messages-box" className="chat-messages overflow-auto px-5">

        </div>
        <div className="mt-auto px-5 py-3">
          <Form onSubmit={formik.handleSubmit} className="py-1 border rounded-2">
            <Form.Group className="input-group has-validation">
              <Form.Control
                value = {formik.values.newMessage}
                onChange = {formik.onChange}
                onBlur={formik.handleBlur} 
                placeholder="Введите сообщение..." 
                id="newMessage" 
                className="border-0 p-0 ps-2 form-control"
              />
            </Form.Group>
            <Button type="submit" className="btn btn-group-vertical">
              {'->'}
              <span className="visually-hidden">Отправить</span>
              </Button>
          </Form>
        </div>
      </div>
    </div>
  )
};

export default Messages;