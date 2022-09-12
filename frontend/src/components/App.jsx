import React from "react";
import LoginForm from "./LoginForm.jsx";
import NotFound from "./notFound.jsx";
import {
  BrowserRouter as Router,
  Routes,
  Switch,
  Route,
  Link
} from "react-router-dom";

const App = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      
  )
};

export default App;