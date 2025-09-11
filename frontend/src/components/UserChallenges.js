// frontend/src/components/UserChallenges.js
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const UserChallenges = () => {
    const { user, loading, userChallenges } = useContext(AuthContext);

    if (loading) {
        return <p>Cargando retos...</p>;
    }

    if (!user) {
        return <p>Por favor, inicia sesión para ver tus retos.</p>;
    }

    return (
        <div>
            <h2>Mis Retos</h2>
            {userChallenges.length === 0 ? (
                <p>Aún no te has unido a ningún reto.</p>
            ) : (
                <ul>
                    {userChallenges.map(challenge => (
                        <li key={challenge.id}>
                            <h3>{challenge.title}</h3>
                            <p>Progreso: {challenge.progress_count} / {challenge.duration_days} días</p>
                            <p>Estado: {challenge.status}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UserChallenges;