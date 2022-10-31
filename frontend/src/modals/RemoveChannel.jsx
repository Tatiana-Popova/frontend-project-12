import React from 'react';
import { useFormik } from 'formik';
import { Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import UseSocket from '../hooks/UseSocket.jsx';

const RemoveChannel = (props) => {
  const { t } = useTranslation();
  const socket = UseSocket();

  const generateOnSubmit = ({ modalInfo, onHide }) => () => {
    try {
      socket.emitRemoveChannel({ id: modalInfo.item.id });
      toast.success(t('channelRemoving.success'));
    } catch (error) {
      toast.error(t('channelRemoving.error'));
    }
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
          <p classname="lead">{t('areYouSure')}</p>
          <div className="d-flex justify-content-end">
            <Button className="me-2 btn-secondary" onClick={onHide}>{t('cancel')}</Button>
            <Button type="submit" className="btn-danger">{t('send')}</Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default RemoveChannel;
