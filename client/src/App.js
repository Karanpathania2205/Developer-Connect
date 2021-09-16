import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Landing from './components/layout/Landing';
import Navbar from './components/layout/Navbar';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard'
import PrivateRoute from './components/routing/PrivateRoute'
import CreateProfile from './components/profile-forms/CreateProfile'
import EditProfile from './components/profile-forms/EditProfile'
import './App.css';
//Redux 
import { Provider } from 'react-redux';
import store from './store';
import Alert from '../src/components/layout/Alert'
import { loaduser } from './actions/auth';
import setAuthToken from './utils/setAuthToken'
if (localStorage.token) {
  setAuthToken(localStorage.token);
}
function App() {

  useEffect(() => {
    store.dispatch(loaduser())
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <Fragment>

          <Navbar />
          <Route exact path="/" component={Landing} />
          <section className="container">
            <Alert />
            <Switch>

              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              {/*Any rotes where we want the user to be logged in for eg the dashboard , we are making it a private route*/}
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute exact path="/create-profile" component={CreateProfile} />
              <PrivateRoute exact path="/edit-profile" component={EditProfile} />

            </Switch>
          </section>




        </Fragment>
      </Router>
    </Provider>

  );

}

export default App;
