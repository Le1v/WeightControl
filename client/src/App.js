import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import 'materialize-css';
import {useRoutes} from './routs';
import {useAuth} from './hooks/auth.hook';
import {AuthContext} from './context/AuthContext';

function App() {
  const {token, userId, login, logout} = useAuth();
  const isAuthenticated = !!token;
  const routs = useRoutes(isAuthenticated);
  return (
    <AuthContext.Provider value={{token, login, userId, logout, isAuthenticated}}>
      <Router>
        <div className = "container">
          {routs}
        </div>
      </Router>
    </AuthContext.Provider>
  )
};

export default App;
