import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const { login: contextLogin } = useContext(AuthContext);

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await contextLogin({ email, password });

      console.log("Inicio de sesión exitoso:", response);
      alert("¡Inicio de sesión exitoso!");

      navigate("/");
    } catch (err) {
      const errorData = err.response ? err.response.data : err;
      console.error("Error de inicio de sesión:", errorData);
      alert("Credenciales incorrectas. Inténtalo de nuevo.");
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card className="shadow-lg border-0 rounded-4">
            <Card.Body className="p-4 p-md-5">
              <Card.Title
                as="h2"
                className="text-center mb-4 fw-bold text-primary"
              >
                Iniciar Sesión
              </Card.Title>
              <Form onSubmit={onSubmit}>
                {/* Campo Correo Electrónico */}
                <Form.Group className="mb-3" controlId="emailInput">
                  <Form.Label className="fw-semibold">
                    Correo Electrónico
                  </Form.Label>
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
                    placeholder="Tu contraseña"
                    name="password"
                    value={password}
                    onChange={onChange}
                    required
                    className="rounded-3"
                  />
                </Form.Group>

                {/* Botón de Submit */}
                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 fw-bold py-2 rounded-3 shadow-sm"
                >
                  Iniciar Sesión
                </Button>
                {/* Añadir enlace a registro */}
                <div className="text-center mt-3">
                  <small className="text-muted">
                    ¿No tienes cuenta?{" "}
                    <a
                      href="/register"
                      className="text-decoration-none fw-semibold"
                    >
                      Regístrate aquí
                    </a>
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

export default Login;
