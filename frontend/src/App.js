// src/App.js
import React from 'react';
import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import CreateChallenge from './components/CreateChallenge';
import ChallengeList from './components/ChallengeList';
import UserChallenges from './components/UserChallenges'; // Importa el nuevo componente

function App() {
  return (
    <div className="App">
      <h1>Bienvenido a la Plataforma de Retos</h1>
      <Register />
      <hr />
      <Login />
      <hr />
      <CreateChallenge />
      <hr />
      <ChallengeList />
      <hr />
      <UserChallenges /> {/* Añade el nuevo componente aquí */}
    </div>
  );
}

export default App;