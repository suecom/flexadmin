import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import configureStore from './store/configureStore';
import { loadUsers } from './actions/userActions';
import { loadListings } from './actions/listingActions';
import { loadTransactions } from './actions/transactionActions';

import Header from './components/Header';
import SideBar from './components/SideBar';
import Content from './components/Content';

import routes from './routes';
import { marketplaceSdk } from './flexsdk.js'

// Initialize and load store
const store = configureStore();

// Load it all
store.dispatch(loadUsers());
store.dispatch(loadListings());
store.dispatch(loadTransactions());

const App = (props) => {
  const [ filter, setFilterText ] = useState('');
  const [ isAuth, setAuth ] = useState(false);
  const [ authMessage, setAuthMessage ] = useState({ style: 'login-box-msg', text: 'Sign in to start'});

  const authSubmit = (email, password, location, history ) => {
      marketplaceSdk.login({ username: email, password: password }).then(loginRes => {
          if(loginRes.status === 200) {
              marketplaceSdk.currentUser.show().then(res => {
                  if(res.data.data.attributes.profile.protectedData.admin !== undefined &&
                          res.data.data.attributes.profile.protectedData.admin === true) {
                      setAuth(true);

                      if(location.requestedPath !== undefined) {
                          history.push(location.requestedPath)
                      }
                      else {
                          history.push('/users')
                      }
                  }
                  else {
                      setAuthMessage({ style: 'login-box-error-msg', text: 'Not authorized'})
                  }
              })
              .catch(e => {
                  setAuthMessage({ style: 'login-box-error-msg', text: 'Try again...'})
              });
          } 
          console.log(loginRes);
      })
      .catch((e) => {
          setAuthMessage({ style: 'login-box-error-msg', text: 'Try again...'})
      })
  }

  const logout = (e) => {
      marketplaceSdk.logout().then(loginRes => {
          setAuth(false);
          setAuthMessage({ style: 'login-box-msg', text: 'Sign in to start'})
      });
  }

  if(!isAuth) {
      marketplaceSdk.currentUser.show().then(res => {
          if(res != null &&
                  res.data.data.attributes.profile.protectedData.admin !== undefined &&
                  res.data.data.attributes.profile.protectedData.admin === true) {
              setAuth(true);
          }
      });
  }
  
  return (
    <div className="wrapper">
      <Provider store={store}>
        <Router >
          <Header filterText={ filter } setFilterText={ setFilterText } isAuth={ isAuth } logout={ logout } />
          <SideBar  routes={ routes } { ...props } />
          <Content filterText={ filter } setFilterText={ setFilterText } authSubmit={ authSubmit } authMessage={ authMessage } isAuth={ isAuth } />
        </Router>
      </Provider>
    </div>
  );
}

export default App;
