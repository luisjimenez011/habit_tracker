import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/api';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    // Estado para manejar mensajes de error o éxito
    const [statusMessage, setStatusMessage] = useState({ type: '', message: '' });

    const navigate = useNavigate(); 
    
    const { username, email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setStatusMessage({ type: '', message: '' });

        try {
            await register({ username, email, password });
            console.log('Registro exitoso:');
            
            setStatusMessage({ 
                type: 'success', 
                message: '¡Registro exitoso! Serás redirigido al inicio de sesión.' 
            });
            
            // Redirigir después de un breve retraso para que el usuario lea el mensaje
            setTimeout(() => {
                navigate('/login');
            }, 1500); 
            
        } catch (err) {
            const msg = err.response?.data?.message 
                ? err.response.data.message 
                : 'Error al registrarse. Inténtalo de nuevo.';
            
            console.error('Error de registro:', err.response.data);
            setStatusMessage({ type: 'danger', message: msg });
        }
    };


    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={7} lg={5}>
                    <Card className="shadow-lg border-0 rounded-4">
                        <Card.Body className="p-4 p-md-5">
                            <Card.Title as="h2" className="text-center mb-4 fw-bold text-success">
                                Registrar Nueva Cuenta
                            </Card.Title>

                            {/* Alerta de estado (éxito o error) */}
                            {statusMessage.message && (
                                <Alert variant={statusMessage.type} className="mb-4 text-center">
                                    {statusMessage.message}
                                </Alert>
                            )}

                            <Form onSubmit={onSubmit}>
                                
                                {/* Campo Nombre de Usuario */}
                                <Form.Group className="mb-3" controlId="usernameInput">
                                    <Form.Label className="fw-semibold">Nombre de Usuario</Form.Label>
                                    <Form.Control
                                        type="text" 
                                        placeholder="Tu nombre de usuario único" 
                                        name="username" 
                                        value={username} 
                                        onChange={onChange} 
                                        required 
                                        className="rounded-3"
                                    />
                                </Form.Group>

                                {/* Campo Correo Electrónico */}
                                <Form.Group className="mb-3" controlId="emailInput">
                                    <Form.Label className="fw-semibold">Correo Electrónico</Form.Label>
                                    <Form.Control
                                        type="email" 
                                        placeholder="ejemplo@correo.com" 
                                        name="email" 
                                        value={email} 
                                        onChange={onChange} 
                                        required 
                                        className="rounded-3"
                                    />
                                </Form.Group>

                                {/* Campo Contraseña */}
                                <Form.Group className="mb-4" controlId="passwordInput">
                                    <Form.Label className="fw-semibold">Contraseña</Form.Label>
                                    <Form.Control 
                                        type="password" 
                                        placeholder="Mínimo 6 caracteres" 
                                        name="password" 
                                        value={password} 
                                        onChange={onChange} 
                                        required 
                                        minLength="6"
                                        className="rounded-3"
                                    />
                                </Form.Group>
                                
                                {/* Botón de Submit */}
                                <Button 
                                    variant="success" 
                                    type="submit" 
                                    className="w-100 fw-bold py-2 rounded-3 shadow-sm"
                                >
                                    Registrar
                                </Button>

                                {/* Enlace a Iniciar Sesión */}
                                <div className="text-center mt-3">
                                    <small className="text-muted">
                                        ¿Ya tienes una cuenta? <a href="/login" className="text-decoration-none fw-semibold">Inicia Sesión</a>
                                    </small>
                                </div>

                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;
