// frontend/src/components/UserChallenges.js
import React, { useState, useEffect } from 'react';
import { getUserChallenges } from '../services/api';

const UserChallenges = () => {
    const [userChallenges, setUserChallenges] = useState([]);

    useEffect(() => {
        const fetchUserChallenges = async () => {
            try {
                const response = await getUserChallenges();
                setUserChallenges(response.data);
            } catch (error) {
                console.error('Error al obtener los retos del usuario:', error);
            }
        };
        fetchUserChallenges();
    }, []);

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