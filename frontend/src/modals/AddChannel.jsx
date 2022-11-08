import React, { useEffect, useRef } from 'react';
import _ from 'lodash';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Modal, Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import filter from 'leo-profanity';
import UseSocket from '../hooks/UseSocket.jsx';
// eslint-disable-next-line import/no-cycle
import { changeCurrentChannel } from '../slices/channelSlice.js';

const AddChannel = (props) => {
  const { t } = useTranslation();
  filter.loadDictionary('ru');
  filter.add(filter.getDictionary('en'));
  const socket = UseSocket();
  const dispatch = useDispatch();
  const existingСhannels = Object.values(useSelector((state) => state.channels.entities));
  const existingChannelsNames = existingСhannels.map((channel) => channel.name);

  const generateOnSubmit = ({ onHide }) => (values) => {
    formik.setSubmitting(true);
    const filteredChannelName = filter.clean(values.body);
    const channel = {
      id: _.uniqueId(),
      name: filteredChannelName,
      removable: true,
      isCurrent: true,
    };
    try {
      socket.emitNewChannel(channel);
      dispatch(changeCurrentChannel({ reason: 'new', channelIdToChange: channel.id }));
      toast.success(t('channelCreating.success'));
    } catch (error) {
      toast.error(t('channelCreating.error'));
    }
    formik.setSubmitting(false);
    onHide();
  };

  const { onHide } = props;
  const formik = useFormik({
    onSubmit: generateOnSubmit(props),
    initialValues: { body: '' },
    validationSchema: yup.object({
      body: yup
        .string()
        .required(t('errors.required'))
        .min(3, t('errors.fromTo'))
        .max(20, t('errors.fromTo'))
        .test('uniq', t('errors.mustBeUniq'), (value) => !existingChannelsNames.includes(value)),
    }),
  });

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <Modal show>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{t('addChannel')}</Modal.Title>
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
            <Button className="me-2 btn btn-secondary" onClick={onHide}>{t('cancel')}</Button>
            <Button 
              type="submit"
              className="btn btn-primary"
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

export default AddChannel;
