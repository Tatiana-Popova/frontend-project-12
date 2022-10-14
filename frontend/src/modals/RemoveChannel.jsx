import React, { useEffect, useRef } from 'react';
import _ from 'lodash';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Modal, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import UseSocket from '../hooks/UseSocket.jsx';

const RemoveChannel = (props) => {
  const socket = UseSocket();
  const dispatch = useDispatch();

  const generateOnSubmit = ({ modalInfo, onHide }) => (values) => {
    socket.emitRemoveChannel({ id: modalInfo.item.id });
    onHide();
  };

  const { onHide } = props;
  const formik = useFormik({ 
    onSubmit: generateOnSubmit(props), 
    initialValues: {},
  });

  return (
    <Modal show>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>Удалить канал</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={formik.handleSubmit}>
            <p class="lead">Уверены?</p>
          <div className="d-flex justify-content-end">
            <input type="button" className="me-2 btn btn-secondary" value="Отменить" onClick={onHide}/>
            <input type="submit" className="btn btn-danger" value="Удалить" />
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default RemoveChannel;
