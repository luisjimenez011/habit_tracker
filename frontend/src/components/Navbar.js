// frontend/src/components/Navbar.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';

const AppNavbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <Navbar bg="light" expand="lg" className="shadow-sm">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    Hábitos Tracker
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/challenges">
                            Buscar Retos
                        </Nav.Link>
                        {user && (
                            <>
                                <Nav.Link as={Link} to="/user-challenges">
                                    Mis Retos
                                </Nav.Link>
                                <Nav.Link as={Link} to="/completed-challenges">
                                    Retos Completados
                                </Nav.Link>
                            </>
                        )}
                    </Nav>
                    <Nav>
                        {user ? (
                            <>
                                <Nav.Link as={Link} to="/user-profile">
                                    Mi Perfil
                                </Nav.Link>
                                <Nav.Link as={Link} to="/account-settings">
                                    Ajustes
                                </Nav.Link>
                                <Button variant="outline-primary" onClick={logout}>
                                    Cerrar Sesión
                                </Button>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/register">
                                    Registrarse
                                </Nav.Link>
                                <Nav.Link as={Link} to="/login">
                                    Iniciar Sesión
                                </Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;