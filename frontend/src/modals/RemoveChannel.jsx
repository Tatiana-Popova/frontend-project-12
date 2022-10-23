import React from 'react';
import { useFormik } from 'formik';
import { Modal } from 'react-bootstrap';
import UseSocket from '../hooks/UseSocket.jsx';
import { useTranslation } from 'react-i18next';

const RemoveChannel = (props) => {
  const { t } = useTranslation();
  const socket = UseSocket();

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
        <Modal.Title>{t('deleteChannel')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={formik.handleSubmit}>
            <p class="lead">{t('areYouSure')}</p>
          <div className="d-flex justify-content-end">
            <input type="button" className="me-2 btn btn-secondary" value={t('cancel')} onClick={onHide}/>
            <input type="submit" className="btn btn-danger" value={t('send')} />
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default RemoveChannel;
