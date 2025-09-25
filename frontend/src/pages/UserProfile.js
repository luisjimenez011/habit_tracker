// frontend/src/pages/UserProfile.js

import React, { useContext, useState, useEffect, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getCreatedChallenges } from '../services/api';
import { Container, Card, Row, Col, Alert, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const UserProfile = () => {
    // Usamos 'loading' del contexto para la carga inicial del usuario
    const { user, loading: authLoading, userChallenges } = useContext(AuthContext);
    const [createdChallenges, setCreatedChallenges] = useState([]);
    const [loadingCreated, setLoadingCreated] = useState(true);

    // 1. Lógica de fetching memorizada.
    const fetchCreatedChallenges = useCallback(async () => {
        if (user) {
            setLoadingCreated(true);
            try {
                const response = await getCreatedChallenges();
                setCreatedChallenges(response.data);
            } catch (err) {
                console.error("Error al cargar retos creados:", err);
            } finally {
                setLoadingCreated(false);
            }
        } else {
            setLoadingCreated(false);
        }
    }, [user]);

    // 2. Ejecutar la función cuando el componente se monta (solución al problema).
    useEffect(() => {
        fetchCreatedChallenges();
    }, [fetchCreatedChallenges]); // Dependencia en la función memorizada

    if (authLoading || loadingCreated) {
        return <Container className="my-5"><p>Cargando perfil...</p></Container>;
    }

    if (!user) {
        return <Alert variant="warning" className="m-5 text-center">Debes iniciar sesión para ver tu perfil.</Alert>;
    }
    
    // Contadores basados en los datos del AuthContext
    const completedCount = userChallenges.filter(c => c.status === 'completed').length;
    const activeCount = userChallenges.filter(c => c.status !== 'completed').length;
    
    return (
        <Container className="my-5">
            <h2 className="mb-4 text-center">👤 Perfil de {user.username}</h2>
            
            <Row className="mb-5">
                {/* Tarjeta de Datos del Usuario */}
                <Col md={4} className="mb-4">
                    <Card className="shadow-sm h-100">
                        <Card.Body>
                            <Card.Title className="text-primary">Información General</Card.Title>
                            <ListGroup variant="flush">
                                <ListGroup.Item>Email: **{user.email}**</ListGroup.Item>
                                <ListGroup.Item>Unido desde: **{new Date(user.created_at).toLocaleDateString()}**</ListGroup.Item>
                                <ListGroup.Item>
                                    <Link to="/account-settings">Configuración de Cuenta</Link>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Tarjetas de Estadísticas */}
                <Col md={8}>
                    <Row>
                        <Col sm={4} className="mb-4">
                            <Card className="text-center bg-info text-white shadow-sm">
                                <Card.Body>
                                    <Card.Title>{activeCount}</Card.Title>
                                    <Card.Text>Retos Activos</Card.Text>
                                    <Link to="/user-challenges" className="stretched-link"></Link>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col sm={4} className="mb-4">
                            <Card className="text-center bg-success text-white shadow-sm">
                                <Card.Body>
                                    <Card.Title>{completedCount}</Card.Title>
                                    <Card.Text>Retos Completados</Card.Text>
                                    <Link to="/completed-challenges" className="stretched-link"></Link>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col sm={4} className="mb-4">
                            <Card className="text-center bg-secondary text-white shadow-sm">
                                <Card.Body>
                                    <Card.Title>{createdChallenges.length}</Card.Title>
                                    <Card.Text>Retos Creados</Card.Text>
                                    {/* ⬅️ Aquí hemos cambiado el link para que apunte a la sección */}
                                    <Link to="#created-challenges" className="stretched-link"></Link> 
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>

            {/* Retos Creados por el Usuario (Lista) */}
            {/* ⬅️ Hemos añadido este id para el enlace */}
            <h3 className="mb-3" id="created-challenges">Tus Retos Publicados ({createdChallenges.length})</h3>
            <ListGroup>
                {createdChallenges.length > 0 ? (
                    createdChallenges.map(challenge => (
                        <ListGroup.Item key={challenge.id} className="d-flex justify-content-between align-items-center">
                            <Link to={`/challenges/${challenge.id}`}>{challenge.title}</Link>
                            {/* Requerimos duration_days del backend */}
                            <small className="text-muted">{challenge.duration_days} días</small> 
                        </ListGroup.Item>
                    ))
                ) : (
                    <ListGroup.Item className="text-center text-muted">
                        No has creado ningún reto aún.
                    </ListGroup.Item>
                )}
            </ListGroup>
            
        </Container>
    );
};

export default UserProfile;