import React, {useEffect, useState, useRef} from "react";
import { useFormik, ErrorMessage } from 'formik';
import * as yup from 'yup';
import avatar from '../assets/avatar.jpg';
import { Form, Button, Image } from 'react-bootstrap';
import useAuth from '../hooks/index.jsx';
import axios from "axios";
import { useLocation, useNavigate } from 'react-router-dom';
import routes from '../routes';


const LoginForm = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef();
  const [authFailed, setAuthFailed] = useState(false);
  const formik = useFormik({
    initialValues: {
      username: '', 
      password: ''
    },
    validationSchema: yup.object({
      username: yup.string().required(),
      password: yup.string().required(),
    }),
    onSubmit: async(values) => {
      setAuthFailed(false);
      const { username, password } = values;
      try {
        const res = await axios.post(routes.loginPath(), { username, password });
        auth.logIn();
        localStorage.clear();
        localStorage.setItem('userId', res.data.token);

        auth.logIn();
        navigate('/');
      } catch (err) {
        if (axios.isAxiosError(err) || err.response.status === 401) {
          setAuthFailed(true);
          inputRef.current.select();
          return;
        }
        throw err;
      }
    }
  })
  return (
    <div className="col-12 col-md-8 col-xxl-6">
    <div className="card shadow-sm">
      <div className="card-body row p-5">
        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
          <Image src={avatar} className="rounded-circle" alt="Войти"/>
        </div>
        <Form onSubmit={formik.handleSubmit} className="col-12 col-md-6 mt-3 mt-mb-0">
          <fieldset disabled={formik.isSubmitting}>
            <h1 className="text-center mb-4">Войти</h1>
            <Form.Group className="form-floating mb-3"> 
              <Form.Control 
                value={formik.values.username} 
                onChange={formik.handleChange} 
                onBlur={formik.handleBlur} 
                placeholder="Ваш ник" 
                id="username" 
                className="form-control"
                isInvalid={authFailed}
                ref={inputRef}/>
              <Form.Label className="form-label" htmlFor="username">Ваш ник</Form.Label> 
              {formik.errors.username && <div id="feedback">{formik.errors.username}</div>}
            </Form.Group>
            <Form.Group className="form-floating mb-4">
              <Form.Control 
                value={formik.values.password} 
                onChange={formik.handleChange} 
                onBlur={formik.handleBlur} 
                placeholder="Пароль" 
                type="password" 
                id="password" 
                isInvalid={authFailed}
                className="form-control"/>
              <Form.Label className="form-label" htmlFor="password">Пароль</Form.Label>
              {formik.errors.password && <div id="feedback">{formik.errors.password}</div>}
              <Form.Control.Feedback type="invalid">the username or password is incorrect</Form.Control.Feedback>
            </Form.Group>
            <Button type="Submit" className="w-100 mb-3 btn btn-outline-primary">Войти</Button>
          </fieldset>
        </Form>
      </div>
      <div className="card-footer p-4">
        <div className="text-center">
          <span>Нет аккаунта?</span>
          <a href="/signup">Регистрация</a>
        </div>
      </div>
    </div>
  </div>
  )
}

export default LoginForm;