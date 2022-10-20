import { useFormik } from "formik";
import React, { useState } from "react";
import { Form, Button, Image, Container, Col, Row, Card } from 'react-bootstrap';
import avatar_1 from '../assets/avatar_1.jpg';
import * as yup from 'yup';
import routes from "../routes";
import axios from 'axios';
import useAuth from "../hooks";
import { useNavigate } from 'react-router-dom';

const SignUpForm = () => {
  const [firstPassword, setFirstPassword] = useState('');
  const navigate = useNavigate();
  const auth = useAuth();
  const formik = useFormik({
    initialValues: {
      userName: '',
      password: '', 
      passwordСonfirmation: '',
    },
    validationSchema: yup.object({
      userName: yup.string().required('Обязательное поле').min(3, 'От 3 до 20 символов').max(20, 'От 3 до 20 символов'),
      password: yup.string().required('Обязательное поле').min(6, 'Не менее 6 символов'),
      passwordConfirmation: yup
        .string()
        .required('Обязательное поле')
        .test('passwordsMatch', 'Пароли должны совпадать', (value) => {
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
        console.log(error)
        if (error.response.status === 409) {
         formik.errors.userName = 'Такой пользователь уже существует';
        }
      };
    }
  })
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
                  <h1 className="text-center mb-4">Регистрация</h1>
                  <Form.Group className="form-floating mb-3">
                    <Form.Control 
                      value={formik.values.userName}
                      placeholder="Имя пользователя" 
                      id="userName"
                      isInvalid={formik.errors.userName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}>
                    </Form.Control>
                    <Form.Label htmlFor="userName">Имя пользователя</Form.Label>      
                    {formik.errors.userName && <div class="invalid-tooltip">{formik.errors.userName}</div>}
                  </Form.Group>
                  <Form.Group className="form-floating mb-3">
                    <Form.Control 
                      type="password"
                      value={formik.values.password}
                      placeholder="Пароль" 
                      id="password"
                      autocomplete="on"
                      isInvalid={formik.errors.password}
                      onChange = {(e) => {
                        setFirstPassword(e.target.value);
                        formik.handleChange(e)
                        }
                      }
                      onBlur={formik.handleBlur}>
                    </Form.Control>
                    <Form.Label htmlFor="userName">Пароль</Form.Label>
                    {formik.errors.password && <div class="invalid-tooltip">{formik.errors.password}</div>}
                  </Form.Group>
                  <Form.Group className="form-floating mb-3">
                    <Form.Control 
                      type="password"
                      value={formik.values.passwordConfirmation}
                      placeholder="Подтвердите пароль" 
                      id="passwordConfirmation"
                      autocomplete="on"
                      isInvalid={formik.errors.passwordConfirmation}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}>
                    </Form.Control>
                    <Form.Label htmlFor="userName">Подтведите пароль</Form.Label>
                    {formik.errors.passwordConfirmation && <div class="invalid-tooltip">{formik.errors.passwordConfirmation}</div>}
                  </Form.Group>
                  <Button type="Submit" className="w-100 mb-3 btn btn-outline-primary btn-light">Зарегистрироваться</Button>
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