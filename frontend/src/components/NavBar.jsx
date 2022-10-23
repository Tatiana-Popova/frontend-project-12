import React from "react";
import { Container, Navbar, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks";
import { useTranslation } from 'react-i18next';

const NavBar = () => {
  const { t } = useTranslation();
  const hasToken = localStorage.getItem('userId');
  const auth = useAuth();
  const navigate = useNavigate();
  console.log('auth', auth);
  return (
    <Navbar className="shadow-sm navbar-expand-lg navbar-light bg-white">
      <Container>
        <Navbar.Brand href="/">Hexlet Chat</Navbar.Brand>
        {hasToken && <Button className="btn-primary" onClick={()=>{auth.logOut(); navigate('/login')}}>{t('exit')}</Button>}
      </Container>
    </Navbar>
  )
};

export default NavBar;