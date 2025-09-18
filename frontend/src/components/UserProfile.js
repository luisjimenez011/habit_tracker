// frontend/src/components/UserProfile.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getUserProfileById } from '../services/api';

const UserProfile = () => {
    const { userId } = useParams();
    const { user, userChallenges } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            // Si no hay userId en la URL, se muestra el perfil del usuario logueado
            if (!userId && user) {
                setProfile(user);
            } else if (userId) {
                try {
                    const response = await getUserProfileById(userId);
                    setProfile(response.data);
                } catch (err) {
                    console.error('Error al obtener el perfil:', err);
                    setProfile(null);
                }
            }
        };

        fetchProfile();
    }, [userId, user]);

    if (!profile) {
        return <p>Cargando perfil...</p>;
    }

    return (
        <div>
            <h2>Perfil de {profile.username}</h2>
            {user && user.id === profile.id && (
                <>
                    <h3>Mis Retos</h3>
                    {userChallenges.length === 0 ? (
                        <p>No te has unido a ningún reto aún.</p>
                    ) : (
                        <ul>
                            {userChallenges.map(challenge => (
                                <li key={challenge.id}>
                                    {challenge.title} - {challenge.status}
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
            {/* Aquí podrías mostrar los retos públicos o el progreso de otros usuarios en el futuro */}
        </div>
    );
};

export default UserProfile;