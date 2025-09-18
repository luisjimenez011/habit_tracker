// frontend/src/components/Dashboard.js
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import ChallengeList from './ChallengeList';
import UserChallenges from './UserChallenges';
import CompletedChallenges from './CompletedChallenges';
import CreateChallenge from './CreateChallenge';

const Dashboard = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <p>Cargando...</p>;
    }

    return (
        <div>
            {user ? (
                <>
                    <h2>Bienvenido, {user.username}</h2>
                    <CreateChallenge />
                    <hr />
                    <UserChallenges />
                    <hr />
                    <CompletedChallenges />
                    <hr />
                    <h3>Todos los Retos</h3>
                    <ChallengeList />
                </>
            ) : (
                <>
                    <h2>Únete a un Reto y Mejora Tu Vida</h2>
                    <p>Por favor, regístrate o inicia sesión para empezar.</p>
                    <hr />
                    <h3>Retos Disponibles</h3>
                    <ChallengeList />
                </>
            )}
        </div>
    );
};

export default Dashboard;