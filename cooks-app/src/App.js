
//import React from 'react';
import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import './App.css';

const App = () => {
  const [contentMessage, setContentMessage] = useState('Welcome to the Cook Dashboard');

  return (
    <div className="app-container">
      <Header setContentMessage={setContentMessage} />
      <div className="main-section">
        <Sidebar setContentMessage={setContentMessage} />
        <div className="dashboard-content">
          <h1>{contentMessage}</h1>
        </div>
      </div>
    </div>
  );
};

export default App;
