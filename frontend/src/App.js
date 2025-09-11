// src/App.js
import React from 'react';
import './App.css';
import Register from './components/Register';
import Login from './components/Login';

function App() {
  return (
    <div className="App">
      <h1>Bienvenido a la Plataforma de Retos</h1>
      <Register />
      <hr />
      <Login />
    </div>
  );
}

export default App;