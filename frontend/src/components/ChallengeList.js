// frontend/src/components/ChallengeList.js
import React, { useState, useEffect } from 'react';
import { getChallenges, joinChallenge } from '../services/api'; // Importa joinChallenge

const ChallengeList = () => {
    const [challenges, setChallenges] = useState([]);

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                const response = await getChallenges();
                setChallenges(response.data);
            } catch (err) {
                console.error('Error al obtener los retos:', err);
            }
        };
        fetchChallenges();
    }, []);

    const handleJoin = async (challengeId) => {
        try {
            await joinChallenge(challengeId);
            alert('¡Te has unido al reto exitosamente!');
        } catch (err) {
            console.error('Error al unirse al reto:', err.response.data);
            alert('Error al unirse al reto. Debes iniciar sesión.');
        }
    };

    return (
        <div>
            <h2>Retos disponibles</h2>
            {challenges.length === 0 ? (
                <p>No hay retos disponibles en este momento.</p>
            ) : (
                <ul>
                    {challenges.map(challenge => (
                        <li key={challenge.id}>
                            <h3>{challenge.title}</h3>
                            <p>{challenge.description}</p>
                            <p>Duración: {challenge.duration_days} días</p>
                            <button onClick={() => handleJoin(challenge.id)}>Unirse al Reto</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ChallengeList;