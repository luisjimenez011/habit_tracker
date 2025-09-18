import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const CompletedChallenges = () => {
    const { user, loading, userChallenges } = useContext(AuthContext);

    if (loading) {
        return <p>Cargando retos...</p>;
    }

    if (!user) {
        return null; // No mostrar si no hay usuario
    }

    const completedChallenges = userChallenges.filter(c => c.status === 'completed');

    return (
        <div>
            <h2>Retos Completados</h2>
            {completedChallenges.length === 0 ? (
                <p>Aún no has completado ningún reto.</p>
            ) : (
                <ul>
                    {completedChallenges.map(challenge => (
                        <li key={challenge.id}>
                            <h3>{challenge.title}</h3>
                            <p>¡Reto completado! 🎉</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CompletedChallenges;