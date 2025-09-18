// src/App.js
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Register from './components/Register';
import Login from './components/Login';
import UserProfile from './components/UserProfile';
import ChallengeParticipants from './components/ChallengeParticipants';
import Dashboard from './components/Dashboard'; // Importa el Dashboard
import AccountSettings from './components/AccountSettings';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <h1>Plataforma de Retos</h1>
          <nav>
            <Link to="/">Inicio</Link> | <Link to="/profile">Mi Perfil</Link> | <Link to="/settings">Configuración</Link>
          </nav>
          <hr />
          <Routes>
            <Route path="/" element={
              <>
                <Register />
                <hr />
                <Login />
                <hr />
                <Dashboard />
              </>
            } />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/profile/:userId" element={<UserProfile />} />
            <Route path="/settings" element={<AccountSettings />} />
            <Route path="/challenges/:challengeId/participants" element={<ChallengeParticipants />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;