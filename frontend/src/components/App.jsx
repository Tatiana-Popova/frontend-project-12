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
import { useDispatch } from "react-redux";
import { fetchInitialData } from "./Chat.jsx";
import SocketContext from "../contexts/SocketContext.jsx";

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
  const hasToken = localStorage.getItem('userId');
  const location = useLocation();
  return (
    hasToken ? children : <Navigate to="/login" state={{ from: location }} />
  );
};
const SocketProvider = ({socket, children}) => {
  const testEmit = (params) => {
    console.log('SOCKET IS', socket)
    socket.emit('newMessage', params);
  }
  return (
    <SocketContext.Provider value={{testEmit}}>
      {children}
    </SocketContext.Provider>
  )
};

const App = (socket) => {
  const dispatch = useDispatch();
  dispatch(fetchInitialData());

  return (
    <SocketProvider socket={socket}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route
              path="/"
              element={(
                <PrivateRoute>
                  <Chat />
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