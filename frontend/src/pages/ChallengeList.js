// frontend/src/pages/ChallengeList.js
import React, { useState, useEffect, useContext } from 'react';
import { getChallenges, getCategories, joinChallenge } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const ChallengeList = () => {
    const [challenges, setChallenges] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const { refreshUserChallenges, user } = useContext(AuthContext);

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                // Obtener los retos con los filtros actuales
                const challengesResponse = await getChallenges({
                    search: searchTerm,
                    category_id: selectedCategory,
                });
                setChallenges(challengesResponse.data);

                // Obtener la lista de categorías (solo la primera vez)
                if (categories.length === 0) {
                    const categoriesResponse = await getCategories();
                    setCategories(categoriesResponse.data);
                }
            } catch (err) {
                console.error("Error al obtener los datos:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchChallenges();
    }, [searchTerm, selectedCategory, categories.length]);

    const handleJoin = async (challengeId) => {
        try {
            await joinChallenge(challengeId);
            alert('¡Te has unido al reto exitosamente!');
            
            if(user) {
                refreshUserChallenges();
            }
        } catch (err) {
            console.error('Error al unirse al reto:', err.response.data);
            alert('Error al unirse al reto. Debes iniciar sesión.');
        }
    };
    
    if (loading) {
        return <p>Cargando retos...</p>;
    }

    return (
        <div>
            <h2>Retos disponibles</h2>
            <div className="filters-container">
                <input
                    type="text"
                    placeholder="Buscar por título..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value="">Todas las categorías</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            {challenges.length === 0 ? (
                <p>No hay retos disponibles que coincidan con la búsqueda.</p>
            ) : (
                <ul>
                    {challenges.map(challenge => (
                        <li key={challenge.id}>
                            <h3>{challenge.title}</h3>
                            <p>{challenge.description}</p>
                            <p>Duración: {challenge.duration_days} días</p>
                            <p>Creado por: <Link to={`/profile/${challenge.creator_id}`}>Ver Perfil</Link></p>
                            <button onClick={() => handleJoin(challenge.id)}>Unirse al Reto</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ChallengeList;