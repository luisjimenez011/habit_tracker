// frontend/src/components/UserChallenges.js
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { markChallengeProgress } from '../services/api';

const UserChallenges = () => {
    const { user, loading, userChallenges, refreshUserChallenges } = useContext(AuthContext);

    const handleMarkProgress = async (challengeId) => {
        try {
            await markChallengeProgress(challengeId);
            alert("¡Progreso actualizado!");
            refreshUserChallenges(); // Esto llama al contexto y actualiza la lista
        } catch (error) {
            console.error('Error al marcar el progreso:', error.response.data);
            alert("Error al marcar el progreso.");
        }
    };

    if (loading) {
        return <p>Cargando retos...</p>;
    }

    if (!user) {
        return <p>Por favor, inicia sesión para ver tus retos.</p>;
    }

    const challengesInProgress = userChallenges.filter(c => c.status === 'in_progress' || c.status === 'active');

    return (
        <div>
            <h2>Mis Retos</h2>
            {challengesInProgress.length === 0 ? (
                <p>Aún no te has unido a ningún reto o has completado todos.</p>
            ) : (
                <ul>
                    {challengesInProgress.map(challenge => (
                        <li key={challenge.id}>
                            <h3>{challenge.title}</h3>
                            <p>Progreso: {challenge.progress_count} / {challenge.duration_days} días</p>
                            <p>Estado: {challenge.status}</p>
                            <button onClick={() => handleMarkProgress(challenge.id)}>Marcar Progreso</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UserChallenges;