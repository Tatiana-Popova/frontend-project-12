import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Modal, Form, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import filter from 'leo-profanity';
import UseSocket from '../hooks/UseSocket.jsx';

const RenameChannel = (props) => {
  const { t } = useTranslation();
  filter.loadDictionary('ru');
  filter.add(filter.getDictionary('en'));
  const socket = UseSocket();
  const existingСhannels = Object.values(useSelector((state) => state.channels.entities));
  const existingChannelsNames = existingСhannels.map((channel) => channel.name);
  
  const { onHide, modalInfo } = props;
  // eslint-disable-next-line react/destructuring-assignment
  const { name } = props.modalInfo.item;

  const formik = useFormik({
    initialValues: { body: name },
    validationSchema: yup.object({
      body: yup
        .string()
        .required(t('errors.required'))
        .min(3, t('errors.fromTo'))
        .max(20, t('errors.fromTo'))
        .test('uniq', t('errors.mustBeUniq'), (value) => !existingChannelsNames.includes(value)),
    }),
    onSubmit: () => {
      formik.setSubmitting(true);
      try {
        const filteredChannelName = filter.clean(formik.values.body);
        socket.emitRenameChannel({ id: modalInfo.item.id, name: filteredChannelName });
        toast.success(t('channelRenaming.success'));
      } catch (error) {
        toast.error(t('channelRenaming.error'));
      }
      formik.setSubmitting(false);
      onHide();
    }
  });

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.select();
  }, []);

  return (
    <Modal show>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{t('renameChannel')}</Modal.Title>
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
              id="body"
              className="mb-2 shadow-none"
              isInvalid={formik.touched.body && formik.errors.body}
            />
            <Form.Label className="visually-hidden" htmlFor="body">{t('channelName')}</Form.Label>
            <Form.Control.Feedback type="invalid">{formik.errors.body}</Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button className="me-2 btn-secondary" onClick={onHide}>{t('cancel')}</Button>
            <Button
              type="submit"
              className="btn-primary"
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

export default RenameChannel;
