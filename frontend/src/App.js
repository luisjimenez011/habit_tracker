// src/App.js
import React from 'react';
import './App.css';
import { AuthProvider } from './context/AuthContext'; // 1. Importa AuthProvider
import Register from './components/Register';
import Login from './components/Login';
import CreateChallenge from './components/CreateChallenge';
import ChallengeList from './components/ChallengeList';
import UserChallenges from './components/UserChallenges';

function App() {
  return (
    <AuthProvider> {/* 2. Envuelve toda la aplicación con AuthProvider */}
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
        <UserChallenges />
      </div>
    </AuthProvider>
  );
}

export default App;