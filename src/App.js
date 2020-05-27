import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Header from './components/Header';
import SideBar from './components/SideBar';
import Content from './components/Content';
import Footer from './components/Footer';

import './App.css';

const App = (props) => {
  const [ filter, setFilter ] = useState('');
  
  function changeFilter(value) {
    setFilter(value)
  }

  return (
      <div className="wrapper">
        <Router>
          <Header cb={ changeFilter } />
          <SideBar  />
          <Content filterText={ filter } { ...props } />
          <Footer />
        </Router>
      </div>
  );
}

export default App;
