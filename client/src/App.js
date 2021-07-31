import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Landing from './components/layout/Landing';
import Navbar from './components/layout/Navbar';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
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


          <Alert />
          <Route exact path="/" component={Landing} />
          <section className="container">
            <Switch>

              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />


            </Switch>
          </section>




        </Fragment>
      </Router>
    </Provider>

  );

}

export default App;
