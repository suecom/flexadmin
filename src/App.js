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
import Footer from './components/Footer';

// Initialize and load store
const store = configureStore();

// Load it all
store.dispatch(loadUsers());
store.dispatch(loadListings());
store.dispatch(loadTransactions());

const App = (props) => {
  const [ filter, setFilterText ] = useState('');
  
  return (
    <div className="wrapper">
      <Provider store={store}>
        <Router>
          <Header filterText={ filter } setFilterText={ setFilterText } { ...props } />
          <SideBar  />
          <Content filterText={ filter } setFilterText={ setFilterText } { ...props } />
          {/*<Footer />*/}
        </Router>
      </Provider>
    </div>
  );
}

export default App;
