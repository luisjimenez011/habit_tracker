// src/App.js
import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile';
import ChallengeParticipants from './pages/ChallengeParticipants';
import Dashboard from './pages/Dashboard';
import AccountSettings from './pages/AccountSettings';
import ChallengeList from './pages/ChallengeList';
import UserChallenges from './pages/UserChallenges';
import CompletedChallenges from './pages/CompletedChallenges';
import CreateChallenge from './pages/CreateChallenge';
import ChallengeDetails from './pages/ChallengeDetails';

function App() {
  return (
    <Router>
      <AuthProvider> {/* CORRECTO: El proveedor envuelve a toda la aplicación */}
        <Navbar /> {/* Se renderiza en todas las páginas */}
        <main>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/challenges" element={<ChallengeList />} />
            <Route path="/create-challenge" element={<CreateChallenge />} />
            <Route path="/challenges/:challengeId/participants" element={<ChallengeParticipants />} />
            <Route path="/challenges/:challengeId" element={<ChallengeDetails />} />

            {/* Rutas que requieren autenticación */}
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/account-settings" element={<AccountSettings />} />
            <Route path="/user-challenges" element={<UserChallenges />} />
            <Route path="/completed-challenges" element={<CompletedChallenges />} />
          </Routes>
        </main>
      </AuthProvider>
    </Router>
  );
}

export default App;