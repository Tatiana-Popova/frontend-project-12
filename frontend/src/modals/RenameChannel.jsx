import React, { useEffect, useRef } from 'react';
import _ from 'lodash';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Modal, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import UseSocket from '../hooks/UseSocket.jsx';

const RenameChannel = (props) => {
  const socket = UseSocket();
  const dispatch = useDispatch();
  const existingСhannels = Object.values(useSelector((state) => state.channels.entities));
  const existingChannelsNames = existingСhannels.map(channel => channel.name);

  const generateOnSubmit = ({ modalInfo, onHide }) => (values) => {
    socket.emitRenameChannel({ id: modalInfo.item.id, name: values.body});
    onHide();
  };

  const { onHide } = props;
  const previousName = props.modalInfo.item.name;

  const formik = useFormik({ 
    onSubmit: generateOnSubmit(props), 
    initialValues: { body: previousName },
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
    inputRef.current.select();
  }, []);

  return (
    <Modal show>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>Переименовать канал</Modal.Title>
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

export default RenameChannel;
