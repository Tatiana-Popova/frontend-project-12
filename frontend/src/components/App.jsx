import React, { useState, useEffect } from "react";
import LoginForm from "./LoginForm.jsx";
import Chat from "./Chat.jsx"
import NotFound from "./notFound.jsx";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import AuthContext from '../contexts/index.jsx';
import useAuth from '../hooks/index.jsx';
import { useDispatch } from "react-redux";
import { fetchInitialData } from "./Chat.jsx";
import SocketContext from "../contexts/SocketContext.jsx";
import useSocket from "../hooks/useSocket.jsx";

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };
  return (
    <AuthContext.Provider value={{ loggedIn, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};
const PrivateRoute = ({ children }) => {
  const auth = useAuth();
  const hasToken = localStorage.getItem('userId');
  const location = useLocation();
  return (
    hasToken ? children : <Navigate to="/login" state={{ from: location }} />
  );
};
const SocketProvider = ({children}) => {
  const testOn = () => {
    useSocket.on('connection', () => {
      console.log('TEST', useSocket);
    })
  }
  return (
    <SocketContext.Provider value={{testOn}}>
        {children}
    </SocketContext.Provider>
  )
};

const App = (socket) => {
  const dispatch = useDispatch();
  dispatch(fetchInitialData())
   

  return (
    <SocketProvider>
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={(
              <PrivateRoute>
                <Chat value={socket}/>
              </PrivateRoute>
            )}
          />
          <Route path="/login" element={<LoginForm />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
    </SocketProvider>
  )
};

export default App;