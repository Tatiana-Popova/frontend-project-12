import React, { useState } from "react";
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
import { actions as messageActions } from '../slices/messageSlice';

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
  const dispatch = useDispatch();
  const emitMessage = (params) => {
    socket.emit('newMessage', params, (response) => {
      if (response.status !== 'ok') {
        dispatch(messageActions.addNetworkError(response))
      }
    });
  }
  const emitNewChannel = (params) => {
    socket.emit('newChannel', params, (response) => {
      if (response.status !== 'ok') {
        console.log('ошибка создания канала :(');
      }
    })
  };
  const emitRemoveChannel = (channelId) => {
    socket.emit('removeChannel', channelId, (response) => {
      if (response.status !== 'ok') {
        console.log('ошибка удаления канала');
      }
    });
  }
  const emitRenameChannel = (params) => {
    socket.emit('renameChannel', params, (response) => {
      if (response.status !== 'ok') {
        console.log('ошибка переименования канала');
      }
    })
  }
  return (
    <SocketContext.Provider value={{emitMessage, emitNewChannel, emitRemoveChannel, emitRenameChannel}} >
      {children}
    </SocketContext.Provider>
  )
};

const App = ({socket}) => {
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