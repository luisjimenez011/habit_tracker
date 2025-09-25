// frontend/src/pages/ChallengeDetails.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getChallengeDetails, joinChallenge } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Container, Card, Button } from 'react-bootstrap';
import CommentsSection from '../components/CommentsSection'; 

const ChallengeDetails = () => {
    const { challengeId } = useParams();
    const navigate = useNavigate();
    const { user, refreshUserChallenges } = useContext(AuthContext);
    const [challenge, setChallenge] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChallenge = async () => {
            try {
                const response = await getChallengeDetails(challengeId);
                setChallenge(response.data);
            } catch (err) {
                console.error("Error al obtener los detalles del reto:", err);
                setChallenge(null);
            } finally {
                setLoading(false);
            }
        };
        fetchChallenge();
    }, [challengeId]);

    const handleJoin = async () => {
        try {
            await joinChallenge(challengeId);
            alert('¡Te has unido al reto exitosamente!');
            if (user) {
                refreshUserChallenges();
            }
            navigate('/user-challenges');
        } catch (err) {
            console.error('Error al unirse al reto:', err.response.data);
            alert('Error al unirse al reto. Debes iniciar sesión.');
        }
    };

    if (loading) {
        return <p>Cargando detalles del reto...</p>;
    }

    if (!challenge) {
        return <Container><h2>Reto no encontrado.</h2></Container>;
    }

    return (
        <Container className="my-5">
            <Card>
                <Card.Body>
                    <Card.Title as="h1">{challenge.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                        Duración: {challenge.duration_days} días
                    </Card.Subtitle>
                    <Card.Text>
                        {challenge.description}
                    </Card.Text>
                    {user && (
                        <Button variant="primary" onClick={handleJoin}>
                            Unirse al Reto
                        </Button>
                    )}
                </Card.Body>
            </Card>

            {/* Aquí añadiremos la sección de comentarios más adelante */}
             <CommentsSection challengeId={challenge.id} /> 
        </Container>
    );
};

export default ChallengeDetails;