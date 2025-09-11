import React from 'react';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import Register from './components/Register';
import Login from './components/Login';
import CreateChallenge from './components/CreateChallenge';
import ChallengeList from './components/ChallengeList';
import UserChallenges from './components/UserChallenges';
import CompletedChallenges from './components/CompletedChallenges'; // Importa el nuevo componente

function App() {
  return (
    <AuthProvider>
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
        <hr />
        <CompletedChallenges /> {/* Añade el nuevo componente aquí */}
      </div>
    </AuthProvider>
  );
}

export default App;