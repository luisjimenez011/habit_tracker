// frontend/src/pages/CompletedChallenges.js

import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Container, Card, Row, Col, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CompletedChallenges = () => {
    const { user, loading, userChallenges } = useContext(AuthContext);

    if (loading) {
        return <Container className="my-5"><p>Cargando retos completados...</p></Container>;
    }

    if (!user) {
        return <Alert variant="warning" className="m-5 text-center">Debes iniciar sesión para ver tus retos completados.</Alert>;
    }

    // Filtramos solo los retos que tienen el estado 'completed'
    const completedChallenges = userChallenges.filter(c => c.status === 'completed');
    
    return (
        <Container className="my-5">
            <h2 className="mb-4 text-center">🏆 Mis Retos Completados 🏅</h2>
            
            {completedChallenges.length === 0 ? (
                <Alert variant="info" className="text-center">
                    ¡Aún no has completado ningún reto! Empieza uno en "<Link to="/challenges">Buscar Retos</Link>" y haz tu check-in diario.
                </Alert>
            ) : (
                <Row xs={1} md={2} lg={3} className="g-4">
                    {completedChallenges.map(challenge => {
                        // El reto completado tiene progress_count === duration_days
                        const completionDate = challenge.last_progress_date 
                            ? new Date(challenge.last_progress_date).toLocaleDateString() 
                            : 'N/A';
                            
                        return (
                            <Col key={challenge.id}>
                                <Card className="h-100 shadow-sm border-success">
                                    <Card.Body>
                                        <Card.Title className="text-success">
                                            ✅ {challenge.title}
                                        </Card.Title>
                                        <Card.Text>
                                            <p className="mb-1">Duración: **{challenge.duration_days} días**</p>
                                            <p className="mb-0 text-muted small">Finalizado el: {completionDate}</p>
                                        </Card.Text>
                                        <Link to={`/challenges/${challenge.id}`} className="btn btn-outline-success btn-sm mt-2">
                                            Ver Detalles
                                        </Link>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            )}
        </Container>
    );
};

export default CompletedChallenges;