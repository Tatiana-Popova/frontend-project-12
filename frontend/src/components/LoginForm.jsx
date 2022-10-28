import React, {useRef} from "react";
import { useFormik } from 'formik';
import * as yup from 'yup';
import avatar from '../assets/avatar.jpg';
import { Form, Button, Image, Container, Row, Col, Card } from 'react-bootstrap';
import useAuth from '../hooks/index.jsx';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import routes from '../routes';
import { useTranslation } from 'react-i18next';
import { actions as channelActions } from '../slices/channelSlice';
import { useDispatch } from "react-redux";

const LoginForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const auth = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef();
  const formik = useFormik({
    initialValues: {
      username: '', 
      password: ''
    },
    validationSchema: yup.object({
      username: yup.string().required(t('errors.required')),
      password: yup.string().required(t('errors.required')),
    }),
    onSubmit: async(values) => {
      const { username, password } = values;
      try {
        const res = await axios.post(routes.loginPath(), { username, password });
        localStorage.clear();
        localStorage.setItem('userId', JSON.stringify(res.data));
        auth.logIn();
        navigate('/');
      } catch (err) {
        if (err.response.status === 401) {
          formik.errors.password = t('errors.wrongNameOrPassword');
          inputRef.current.select();
          return;
        } else {
          dispatch(channelActions(err.code))
        }
        throw err;
      }
    }
  })
  
  return (
    <Container fluid className="h-100">
      <Row className="justify-content-center align-content-center h-100">
        <Col md={8} xxl={6}>
          <Card className="shadow-sm">
            <Card.Body className="row p-5">
              <Col className="d-flex align-items-center justify-content-center">
                <Image src={avatar} className="rounded-circle" alt="Войти"/>
              </Col>
              <Col as={Form} md={6} mt={3} onSubmit={formik.handleSubmit} className="col-12 col-md-6 mt-3 mt-mb-0">
                <fieldset disabled={formik.isSubmitting}>
                  <h1 className="text-center mb-4">{t('enter')}</h1>
                  <Form.Group className="form-floating mb-3"> 
                    <Form.Control 
                      value={formik.values.username} 
                      onChange={formik.handleChange} 
                      onBlur={formik.handleBlur} 
                      placeholder={t('yourNick')}
                      id="username" 
                      className="form-control"
                      isInvalid={formik.touched.username && formik.errors.username}
                      ref={inputRef}/>
                    <Form.Label className="form-label" htmlFor="username">{t('yourNick')}</Form.Label> 
                    {formik.touched.username && formik.errors.username && <div class="invalid-tooltip">{formik.errors.username}</div>}
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
                      className="form-control"/>
                    <Form.Label className="form-label" htmlFor="password">{t('password')}</Form.Label>
                    {formik.touched.password && formik.errors.password && <div class="invalid-tooltip">{formik.errors.password}</div>}
                  </Form.Group>
                  <Button type="Submit" className="w-100 mb-3 btn-outline-primary btn-light">{t('enter')}</Button>
                </fieldset>
              </Col>                
            </Card.Body>
            <Card.Footer className="p-4">
              <div className="text-center">
                <span>{t('haveNoAccount')}</span>
                <a href="/signup">{t('registration')}</a>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default LoginForm;