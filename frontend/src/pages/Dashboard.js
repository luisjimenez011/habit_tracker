import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Container, Card, Button } from 'react-bootstrap';

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    // Si el usuario no está logueado, redirige o muestra un mensaje
    if (!user) {
        return (
            <Container className="text-center my-5">
                <h2>Debes iniciar sesión para ver este contenido.</h2>
                <p>
                    <Link to="/login" className="btn btn-primary mt-3">Iniciar Sesión</Link>
                </p>
            </Container>
        );
    }

    return (
        <Container className="my-5">
            <h1 className="text-center mb-4">¡Bienvenido, {user.username}!</h1>

            <div className="d-flex justify-content-center gap-4 flex-wrap">
                {/* Tarjeta para "Mis Retos" */}
                <Card style={{ width: '18rem' }} className="shadow-sm">
                    <Card.Body className="text-center">
                        <Card.Title>Mis Retos</Card.Title>
                        <Card.Text>
                            Visualiza y gestiona los retos en los que estás participando.
                        </Card.Text>
                        <Button as={Link} to="/user-challenges" variant="primary">
                            Ir a Mis Retos
                        </Button>
                    </Card.Body>
                </Card>

                {/* Tarjeta para "Retos Completados" */}
                <Card style={{ width: '18rem' }} className="shadow-sm">
                    <Card.Body className="text-center">
                        <Card.Title>Retos Completados</Card.Title>
                        <Card.Text>
                            Revisa el historial de tus logros y retos finalizados.
                        </Card.Text>
                        <Button as={Link} to="/completed-challenges" variant="success">
                            Ver Completados
                        </Button>
                    </Card.Body>
                </Card>

                {/* Tarjeta para "Crear un Reto" */}
                <Card style={{ width: '18rem' }} className="shadow-sm">
                    <Card.Body className="text-center">
                        <Card.Title>Crear un Reto</Card.Title>
                        <Card.Text>
                            ¿Tienes una idea? Crea tu propio reto para que otros se unan.
                        </Card.Text>
                        <Button as={Link} to="/create-challenge" variant="info">
                            Crear Reto
                        </Button>
                    </Card.Body>
                </Card>
            </div>
        </Container>
    );
};

export default Dashboard;