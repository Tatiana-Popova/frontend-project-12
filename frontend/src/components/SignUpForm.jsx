import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Form, Button, Image, Container, Col, Row, Card } from 'react-bootstrap';
import avatar_1 from '../assets/avatar_1.jpg';
import * as yup from 'yup';
import routes from "../routes";
import axios from 'axios';
import useAuth from "../hooks";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SignUpForm = () => {
  const { t } = useTranslation();
  const [firstPassword, setFirstPassword] = useState('');
  const navigate = useNavigate();
  const auth = useAuth();
  const formik = useFormik({
    initialValues: {
      userName: '',
      password: '', 
      passwordConfirmation: '',
    },
    validationSchema: yup.object({
      userName: yup.string().required(t('errors.required')).min(3, t('errors.fromTo')).max(20, t('errors.fromTo')),
      password: yup.string().required(t('errors.required')).min(6, t('errors.noLess6')),
      passwordConfirmation: yup
        .string()
        .required(t('errors.required'))
        .test('passwordsMatch', t('errors.passwordsMustBeSame'), (value) => {
          return (value === firstPassword)
        })
    }),
    onSubmit: async(values) => {
      try {
        await axios.post(routes.signUp(), { username: values.userName, password: values.password});

        const loginRes = await axios.post(routes.loginPath(), { username: values.userName, password: values.password});
        localStorage.clear();
        localStorage.setItem('userId', JSON.stringify(loginRes.data));
        auth.logIn();
        navigate('/');
      }
      catch (error) {
        if (error.response.status === 409) {
         formik.errors.userName = t('errors.usernameIsClaimed ');
        }
      };
    }
  });

  useEffect(() => {
    formik.validateField(formik.values.username);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container fluid className="h-100">
      <Row className="justify-content-center align-content-center h-100">
        <Col md={8} xxl={6}>
          <Card className="shadow-sm">
            <Card.Body className="d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
              <div>
                <Image src={avatar_1} className="rounded-circle" alt="Регистрация"/>
              </div>
              <Form onSubmit={formik.handleSubmit} className="w-50">
                <fieldset disabled={formik.isSubmitting}>
                  <h1 className="text-center mb-4">{t('registration')}</h1>
                  <Form.Group className="form-floating mb-3">
                    <Form.Control 
                      value={formik.values.userName}
                      placeholder={t('username')} 
                      id="userName"
                      isInvalid={formik.touched.userName && formik.errors.userName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}>
                    </Form.Control>
                    <Form.Label htmlFor="userName">{t('username')}</Form.Label>  
                    <Form.Control.Feedback type="invalid" tooltip>
                      {formik.touched.userName && formik.errors.userName}
                    </Form.Control.Feedback>    
                  </Form.Group>
                  <Form.Group className="form-floating mb-3">
                    <Form.Control 
                      type="password"
                      value={formik.values.password}
                      placeholder={t('password')}
                      id="password"
                      autocomplete="on"
                      isInvalid={formik.touched.password && formik.errors.password}
                      onChange = {(e) => {
                        setFirstPassword(e.target.value);
                        formik.handleChange(e)
                        }
                      }
                      onBlur={formik.handleBlur}>
                    </Form.Control>
                    <Form.Label htmlFor="password">{t('password')}</Form.Label>
                    <Form.Control.Feedback type="invalid" tooltip>
                      {formik.touched.password && formik.errors.password}
                    </Form.Control.Feedback>    
                  </Form.Group>
                  <Form.Group className="form-floating mb-3">
                    <Form.Control 
                      type="password"
                      value={formik.values.passwordConfirmation}
                      placeholder={t('passwordConfirmation')}
                      id="passwordConfirmation"
                      autocomplete="on"
                      isInvalid={formik.touched.passwordConfirmation && formik.errors.passwordConfirmation}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}>
                    </Form.Control>
                    <Form.Label htmlFor="passwordConfirmation">{t('passwordConfirmation')}</Form.Label>
                    <Form.Control.Feedback type="invalid" tooltip>
                      {formik.touched.passwordConfirmation && formik.errors.passwordConfirmation}
                    </Form.Control.Feedback>    
                  </Form.Group>
                  <Button type="Submit" className="w-100 mb-3 btn btn-outline-primary btn-light">{t('register')}</Button>
                </fieldset>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
};

export default SignUpForm;