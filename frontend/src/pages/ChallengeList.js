// frontend/src/pages/ChallengeList.js
import React, { useState, useEffect, useContext } from 'react';
import { getChallenges, getCategories, joinChallenge } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

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
        <Container className="my-5">
            <h2 className="mb-4 text-center">Explorar Retos Disponibles</h2>

            {/* Contenedor de Filtros con Bootstrap */}
            <Row className="mb-4">
                <Col md={8}>
                    <Form.Control
                        type="text"
                        placeholder="Buscar retos por título..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Col>
                <Col md={4}>
                    <Form.Select 
                        value={selectedCategory} 
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">Todas las categorías</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </Form.Select>
                </Col>
            </Row>

            {/* Lista de Retos con Grid de Bootstrap */}
            {challenges.length === 0 ? (
                <p className="text-center text-muted">No hay retos disponibles que coincidan con la búsqueda.</p>
            ) : (
                <Row xs={1} md={2} lg={3} className="g-4">
                    {challenges.map(challenge => (
                        <Col key={challenge.id}>
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    {/* ENLACE a la página de detalles del reto */}
                                    <h5 className="card-title">
                                        <Link to={`/challenges/${challenge.id}`} className="text-decoration-none">
                                            {challenge.title}
                                        </Link>
                                    </h5>
                                    <p className="card-text">{challenge.description}</p>
                                    <p className="text-muted small">Duración: {challenge.duration_days} días</p>
                                    <p className="text-muted small">
                                        Creado por: <Link to={`/profile/${challenge.creator_id}`}>Ver Perfil</Link>
                                    </p>
                                    <Button 
                                        variant="primary" 
                                        onClick={() => handleJoin(challenge.id)}
                                        className="w-100"
                                    >
                                        Unirse al Reto
                                    </Button>
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default ChallengeList;