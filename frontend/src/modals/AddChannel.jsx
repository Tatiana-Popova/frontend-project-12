import React, { useEffect, useRef } from 'react';
import _ from 'lodash';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Modal, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import UseSocket from '../hooks/UseSocket.jsx';
import { changeCurrentChannel } from '../slices/channelSlice.js';

const AddChannel = (props) => {
  const socket = UseSocket();
  const dispatch = useDispatch();
  const existingСhannels = Object.values(useSelector((state) => state.channels.entities));
  const existingChannelsNames = existingСhannels.map(channel => channel.name);

  const generateOnSubmit = ({ modalInfo, onHide }) => (values) => {
    const channel = { id: _.uniqueId(), name: values.body, removable: true, isCurrent: true};
    socket.emitNewChannel(channel);
    dispatch(changeCurrentChannel({reason: 'new', channelIdToChange: channel.id})) 
    onHide();
  };

  const { onHide } = props;
  const formik = useFormik({ 
    onSubmit: generateOnSubmit(props), 
    initialValues: { body: '' },
    validationSchema: yup.object({
      body: yup
        .string()
        .required()
        .test('uniq', 'Должно быть уникальным', (value) => {
          return (!existingChannelsNames.includes(value))
        })
    }),
  });

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <Modal show>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>Добавить канал</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={formik.handleSubmit}>
          <Form.Group>
            <Form.Control
              required
              ref={inputRef}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.body}
              data-testid="input-body"
              name="body"
              className='mb-2 form-control'
              isInvalid={formik.errors.body}
            />
            <Form.Label className="visually-hidden" htmlFor='body'>Имя канала</Form.Label>
            <Form.Control.Feedback type="invalid">{formik.errors.body}</Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <input type="button" className="me-2 btn btn-secondary" value="Отменить" onClick={onHide}/>
            <input type="submit" className="btn btn-primary" value="Отправить" />
          </div>
        
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddChannel;
