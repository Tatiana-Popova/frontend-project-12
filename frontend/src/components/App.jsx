import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import LoginForm from './LoginForm.jsx';
import Chat from './Chat.jsx';
import NotFound from './NotFound.jsx';
import NavBar from './NavBar.jsx';
import AuthContext from '../contexts/index.jsx';
import SocketContext from '../contexts/SocketContext.jsx';
import SignUpForm from './SignUpForm.jsx';

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

const SocketProvider = ({ socket, children }) => {
  const emitMessage = (params) => {
    socket.emit('newMessage', params);
  };
  const emitNewChannel = (params) => {
    socket.emit('newChannel', params);
  };
  const emitRemoveChannel = (channelId) => {
    socket.emit('removeChannel', channelId);
  };
  const emitRenameChannel = (params) => {
    socket.emit('renameChannel', params);
  };
  return (
    <SocketContext.Provider
      value={
        { 
          emitMessage, emitNewChannel, emitRemoveChannel, emitRenameChannel
        }
      }
    >
      { children }
    </SocketContext.Provider>
  );
};

const App = ({ socket }) => (
  <SocketProvider socket={socket}>
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column h-100">
          <NavBar />
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
            <Route path="/signup" element={<SignUpForm />} />
          </Routes>
        </div>
        <ToastContainer />
      </Router>
    </AuthProvider>
  </SocketProvider>
);

export default App;
