import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import RegisterRestaurant from './components/RegisterRestaurant';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const { auth } = useAuth();

  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/super-admin/dashboard" component={SuperAdminDashboard} />
        <Route path="/register-restaurant" component={RegisterRestaurant} />
      </Switch>
    </Router>
  );
};

export default App;
