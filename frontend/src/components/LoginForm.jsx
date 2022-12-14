import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Form,
  Button,
  Image,
  Container,
  Row,
  Col,
  Card,
} from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { actions as channelActions } from '../slices/channelSlice';
import avatar from '../assets/avatar.jpg';
import useAuth from '../hooks/index.jsx';
import routes from '../routes';

const LoginForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const auth = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef();
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: yup.object({
      username: yup.string().required(t('errors.required')),
      password: yup.string().required(t('errors.required')),
    }),
    onSubmit: async (values) => {
      formik.setSubmitting(true);
      const { username, password } = values;
      try {
        const res = await axios.post(routes.loginPath(), { username, password });
        localStorage.clear();
        localStorage.setItem('userId', JSON.stringify(res.data));
        auth.logIn();
        navigate(routes.pages.rootPage);
      } catch (err) {
        if (err.response.status === 401) {
          formik.errors.password = t('errors.wrongNameOrPassword');
          inputRef.current.select();
          return;
        }
        dispatch(channelActions(err.code));
        throw err;
      }
      formik.setSubmitting(false);
    },
  });

  return (
    <Container fluid className="h-100">
      <Row className="justify-content-center align-content-center h-100">
        <Col md={8} xxl={6}>
          <Card className="shadow-sm">
            <Card.Body className="row p-5">
              <Col md={6} className="d-flex align-items-center justify-content-center">
                <Image src={avatar} className="rounded-circle" alt={t('enter')} />
              </Col>
              <Col as={Form} md={6} onSubmit={formik.handleSubmit} className="mt-3 mt-mb-0">
                <h1 className="text-center mb-4">{t('enter')}</h1>
                <Form.Group className="form-floating mb-3">
                  <Form.Control
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={t('yourNick')}
                    id="username"
                    className="shadow-none"
                    isInvalid={formik.touched.username && formik.errors.username}
                    ref={inputRef}
                  />
                  <Form.Label className="form-label" htmlFor="username">{t('yourNick')}</Form.Label>
                  <Form.Control.Feedback type="invalid" tooltip>
                    {formik.touched.username && formik.errors.username}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="form-floating mb-4">
                  <Form.Control
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={t('password')}
                    autocomplete="on"
                    type="password"
                    id="password"
                    isInvalid={formik.errors.password}
                    className="shadow-none"
                  />
                  <Form.Label className="form-label" htmlFor="password">{t('password')}</Form.Label>
                  <Form.Control.Feedback type="invalid" tooltip>
                    {formik.touched.password && formik.errors.password}
                  </Form.Control.Feedback>
                </Form.Group>
                <Button
                  type="Submit"
                  className="w-100 mb-3 btn-outline-primary btn-light"
                  disabled={formik.isSubmitting}
                >
                  {t('enter')}
                </Button>
              </Col>
            </Card.Body>
            <Card.Footer className="p-4">
              <div className="text-center">
                {`${t('haveNoAccount')} `}
                <a href={routes.pages.signup}>{t('registration')}</a>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;
