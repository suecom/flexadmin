import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import configureStore from './store/configureStore';
import { loadUsers, updateUsers } from './actions/userActions';
import { loadListings, updateListings } from './actions/listingActions';
import { loadTransactions, updateTransactions } from './actions/transactionActions';

import Header from './components/Header';
import SideBar from './components/SideBar';
import Content from './components/Content';

import routes from './routes';
import { marketplaceSdk } from './flexsdk.js'

// Initialize and load store
const store = configureStore();

// Load all entities
store.dispatch(loadUsers());
store.dispatch(loadListings());
store.dispatch(loadTransactions());

// Set to zero for no refresh (lighter network load)
if(process.env.REACT_APP_REFRESH_INTERVAL > 0) {
    // eslint-disable-next-line
    const timerId = setInterval(() => {
        store.dispatch(updateUsers());
        store.dispatch(updateListings());
        store.dispatch(updateTransactions());
    }, process.env.REACT_APP_REFRESH_INTERVAL * 1000)
}

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
        marketplaceSdk.authInfo().then(authInfo => {
            if(authInfo !== null && authInfo.isAnonymous === false) {
                marketplaceSdk.currentUser.show().then(res => {
                    if(res !== null && 
                            res.data !== undefined && res.data !== null && 
                            res.data.data !== undefined && res.data.data !== null && 
                            res.data.data.attributes !== undefined && res.data.data.attribute !== null &&
                            res.data.data.attributes.profile.protectedData.admin !== undefined &&
                            res.data.data.attributes.profile.protectedData.admin === true) {
                        setAuth(true);
                    }
                })
            }
        })
        .catch(err => {
            console.log(err)
        })
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
