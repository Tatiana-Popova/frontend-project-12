import React from "react";
import { Formik } from 'formik';
import * as yup from 'yup';
import avatar from '../assets/avatar.jpg';
import { Form, Button, Image } from 'react-bootstrap';

const LoginForm = () => {
  return (
    <Formik
      initialValues = {{ username: '', password: ''}}
      validationSchema = {yup.object({
        username: yup.string().required(),
        password: yup.string().required(),
      })}
      onSubmit = { (values) => {
        console.log(values)
      }}
    >
      { (props) => (
        <div className="col-12 col-md-8 col-xxl-6">
        <div className="card shadow-sm">
          <div className="card-body row p-5">
            <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
              <Image src={avatar} className="rounded-circle" alt="Войти"/>
            </div>
            <Form onSubmit={props.handleSubmit} className="col-12 col-md-6 mt-3 mt-mb-0">
              <h1 className="text-center mb-4">Войти</h1>
              <Form.Group className="form-floating mb-3"> 
                <Form.Control value={props.values.username} onChange={props.handleChange} onBlur={props.handleBlur} className="username" placeholder="Ваш ник" id="username" class="form-control"/>
                <Form.Label className="form-label" htmlFor="username">Ваш ник</Form.Label> 
                {props.errors.username && <div id="feedback">{props.errors.username}</div>}
              </Form.Group>
              <Form.Group className="form-floating mb-4">
                <Form.Control value={props.values.password} onChange={props.handleChange} onBlur={props.handleBlur} className="password" placeholder="Пароль" type="password" id="password" class="form-control"/>
                <Form.Label className="form-label" htmlFor="password">Пароль</Form.Label>
                {props.errors.password && <div id="feedback">{props.errors.password}</div>}
              </Form.Group>
              <Button type="Submit" className="w-100 mb-3 btn btn-outline-primary">Войти</Button>
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
      )}
    </Formik>
  )
}

export default LoginForm;