// frontend/src/pages/ChallengeParticipants.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getChallengeParticipants } from '../services/api';

const ChallengeParticipants = () => {
    const { challengeId } = useParams();
    const [participants, setParticipants] = useState([]);

    useEffect(() => {
        const fetchParticipants = async () => {
            try {
                const response = await getChallengeParticipants(challengeId);
                setParticipants(response.data);
            } catch (err) {
                console.error('Error al obtener los participantes:', err);
                // Aquí podrías redirigir o mostrar un mensaje de error
            }
        };
        fetchParticipants();
    }, [challengeId]);

    return (
        <div>
            <h3>Participantes del Reto</h3>
            {participants.length === 0 ? (
                <p>No hay participantes en este reto aún.</p>
            ) : (
                <ul>
                    {participants.map(p => (
                        <li key={p.id}>
                            {p.username} - Progreso: {p.progress_count}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ChallengeParticipants;