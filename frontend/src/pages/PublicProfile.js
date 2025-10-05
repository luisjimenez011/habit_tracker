import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getUserProfileById } from "../services/api"; // Función API
import {
  Container,
  Card,
  Row,
  Col,
  Alert,
  ListGroup,
  Badge,
} from "react-bootstrap";

const PublicProfile = () => {
  // Obtener el ID de la URL
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar los datos del perfil
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getUserProfileById(id);

        setProfileData(response.data);
        setError(null);
      } catch (err) {
        console.error("Error al cargar perfil público:", err);

        setError("No se pudo cargar el perfil del usuario. Podría no existir.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <Container className="my-5">
        <p className="text-center">Cargando perfil...</p>
      </Container>
    );
  }

  if (error || !profileData || !profileData.user) {
    return (
      <Alert variant="danger" className="m-5 text-center">
        {error || "Perfil no encontrado."}
      </Alert>
    );
  }

  const { user, createdChallenges, completedChallengesCount } = profileData;

  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center">
        👤 Perfil Público de **{user.username}**
      </h2>

      <Row className="mb-5 justify-content-center">
        {/* Tarjeta de Información Pública */}
        <Col md={6} lg={4} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title className="text-primary">
                Información General
              </Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  Unido desde: **
                  {new Date(user.created_at).toLocaleDateString()}**
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        {/* Tarjeta de Estadísticas Públicas */}
        <Col md={6} lg={4} className="mb-4">
          <Card className="text-center bg-secondary text-white shadow-sm h-100">
            <Card.Body>
              <Card.Title>Estadísticas</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item className="text-white bg-secondary d-flex justify-content-between">
                  Retos Completados:{" "}
                  <Badge bg="light" text="secondary">
                    {completedChallengesCount}
                  </Badge>
                </ListGroup.Item>
                <ListGroup.Item className="text-white bg-secondary d-flex justify-content-between">
                  Retos Creados:{" "}
                  <Badge bg="light" text="secondary">
                    {createdChallenges.length}
                  </Badge>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Retos Creados por Este Usuario (Lista) */}
      <h3 className="mb-3">
        Retos Publicados por {user.username} ({createdChallenges.length})
      </h3>
      <ListGroup>
        {createdChallenges.length > 0 ? (
          createdChallenges.map((challenge) => (
            <ListGroup.Item
              key={challenge.id}
              className="d-flex justify-content-between align-items-center"
            >
              <Link to={`/challenges/${challenge.id}`}>{challenge.title}</Link>
              <small className="text-muted">
                {challenge.duration_days} días
              </small>
            </ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item className="text-center text-muted">
            Este usuario aún no ha publicado retos.
          </ListGroup.Item>
        )}
      </ListGroup>
    </Container>
  );
};

export default PublicProfile;
