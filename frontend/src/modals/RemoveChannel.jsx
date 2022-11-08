import React from 'react';
import { useFormik } from 'formik';
import { Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import UseSocket from '../hooks/UseSocket.jsx';

const RemoveChannel = (props) => {
  const { t } = useTranslation();
  const socket = UseSocket();

  const { onHide, modalInfo } = props;
  const formik = useFormik({
    initialValues: {},
    onSubmit: () => {
      formik.setSubmitting(true);
      try {
        socket.emitRemoveChannel({ id: modalInfo.item.id });
        toast.success(t('channelRemoving.success'));
      } catch (error) {
        toast.error(t('channelRemoving.error'));
      }
      formik.setSubmitting(false);
      onHide();
    },
  });

  return (
    <Modal show>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{t('deleteChannel')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={formik.handleSubmit}>
          <p className="lead">{t('areYouSure')}</p>
          <div className="d-flex justify-content-end">
            <Button className="me-2 btn-secondary" onClick={onHide}>{t('cancel')}</Button>
            <Button
              type="submit"
              className="btn-danger"
              disabled={formik.isSubmitting}
            >
              {t('send')}
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default RemoveChannel;
