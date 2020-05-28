import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import configureStore from './store/configureStore';
import { loadUsers } from './actions/userActions';

import Header from './components/Header';
import SideBar from './components/SideBar';
import Content from './components/Content';
import Footer from './components/Footer';

// Initialize and load store
const store = configureStore();
store.dispatch(loadUsers());

const App = (props) => {
  const [ filter, setFilter ] = useState('');
  
  function changeFilter(value) {
    setFilter(value)
  }

  return (
    <div className="wrapper">
      <Provider store={store}>
        <Router>
          <Header cb={ changeFilter } />
          <SideBar  />
          <Content filterText={ filter } { ...props } />
          <Footer />
        </Router>
      </Provider>
    </div>
  );
}

export default App;
