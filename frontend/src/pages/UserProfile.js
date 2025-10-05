import React, { useContext, useState, useEffect, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { getCreatedChallenges, getUserBadges } from "../services/api";
import {
  Container,
  Card,
  Row,
  Col,
  Alert,
  ListGroup,
  Badge,
} from "react-bootstrap";
import { Link } from "react-router-dom";

const UserProfile = () => {
  // Usamos 'loading' del contexto para la carga inicial del usuario
  const {
    user,
    loading: authLoading,
    userChallenges,
  } = useContext(AuthContext);
  const [createdChallenges, setCreatedChallenges] = useState([]);
  const [loadingCreated, setLoadingCreated] = useState(true); 
  const [badges, setBadges] = useState([]);
  const [badgesLoading, setBadgesLoading] = useState(true); 

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

  const fetchUserBadges = useCallback(async () => {
    if (user) {
      setBadgesLoading(true);
      try {
        const response = await getUserBadges();
        setBadges(response.data);
      } catch (err) {
        console.error("Error al cargar insignias:", err);
      } finally {
        setBadgesLoading(false);
      }
    } else {
      setBadgesLoading(false);
    }
  }, [user]); 

  useEffect(() => {
    fetchCreatedChallenges();
    fetchUserBadges(); 
  }, [fetchCreatedChallenges, fetchUserBadges]); 

  if (authLoading || loadingCreated || badgesLoading) {
    return (
      <Container className="my-5">
        <p>Cargando perfil...</p>
      </Container>
    );
  }

  if (!user) {
    return (
      <Alert variant="warning" className="m-5 text-center">
        Debes iniciar sesión para ver tu perfil.
      </Alert>
    );
  } // Contadores basados en los datos del AuthContext
  const completedCount = userChallenges.filter(
    (c) => c.status === "completed"
  ).length;
  const activeCount = userChallenges.filter(
    (c) => c.status !== "completed"
  ).length; 
  const formatBadgeType = (type) => {
a
    return type
      ? type
          .replace(/_/g, " ")
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      : "";
  };

  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center">👤 Perfil de {user.username}</h2>
      <Row className="mb-5">
        {/* Tarjeta de Datos del Usuario */}
        <Col md={4} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title className="text-primary">
                Información General
              </Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>Email: **{user.email}**</ListGroup.Item>
                <ListGroup.Item>
                  Unido desde: **
                  {new Date(user.created_at).toLocaleDateString()}**
                </ListGroup.Item>
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
            <Col sm={3} className="mb-4">
              {" "}
              
              <Card className="text-center bg-info text-white shadow-sm">
                <Card.Body>
                  <Card.Title>{activeCount}</Card.Title>
                  <Card.Text>Retos Activos</Card.Text>
                  <Link to="/user-challenges" className="stretched-link"></Link>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={3} className="mb-4">
              <Card className="text-center bg-success text-white shadow-sm">
                <Card.Body>
                  <Card.Title>{completedCount}</Card.Title>
                  <Card.Text>Retos Completados</Card.Text>
                  <Link
                    to="/completed-challenges"
                    className="stretched-link"
                  ></Link>
                </Card.Body>
              </Card>
            </Col>
            {/* 🔑 NUEVA TARJETA DE PUNTOS */}
            <Col sm={3} className="mb-4">
              <Card className="text-center bg-warning text-dark shadow-sm">
                <Card.Body>
                  <Card.Title>⭐ {user.points || 0}</Card.Title>{" "}
                  {/* Muestra los puntos */}
                  <Card.Text>Puntos Totales</Card.Text>
                  {/* Aquí podrías enlazar al Ranking */}
                  <Link to="/ranking" className="stretched-link"></Link>
                </Card.Body>
              </Card>
            </Col>
            {/* FIN NUEVA TARJETA DE PUNTOS */}
            <Col sm={3} className="mb-4">
              <Card className="text-center bg-secondary text-white shadow-sm">
                <Card.Body>
                  <Card.Title>{createdChallenges.length}</Card.Title>
                  <Card.Text>Retos Creados</Card.Text>
                  <Link
                    to="#created-challenges"
                    className="stretched-link"
                  ></Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
      {/* 🔑 NUEVA SECCIÓN: INSIGNIAS GANADAS */}
      <h3 className="mt-5 mb-3">🏅 Insignias Ganadas ({badges.length})</h3>     
      <Row xs={1} md={2} lg={4} className="g-4 mb-5">
        {badges.length === 0 ? (
          <Col xs={12}>
                                 
            <Alert variant="info" className="text-center">
              ¡Aún no has ganado insignias! Completa retos, acumula puntos o sé
              constante.
            </Alert>
                             
          </Col>
        ) : (
          badges.map((badge) => (
            <Col key={badge.id}>
              <Card
                className="h-100 shadow-lg border-primary"
                style={{ backgroundColor: "#f8f9fa" }}
              >
                <Card.Body>
                                 
                  <Card.Title className="text-primary d-flex justify-content-between align-items-center">
                     🏆 {badge.name}     
                    <Badge bg="info" className="ms-2 text-dark">
                      {formatBadgeType(badge.type)}
                    </Badge>
                  </Card.Title>
                  <Card.Text className="text-muted">
                    {badge.description}
                  </Card.Text>
                  <small className="text-success">
                    Obtenida el:
                    {new Date(badge.awarded_at).toLocaleDateString()}
                  </small>
                                       
                </Card.Body>
                                       
              </Card>
                                     
            </Col>
          ))
        )}
               
      </Row>
      {/* FIN NUEVA SECCIÓN */}
      {/* Retos Creados por el Usuario (Lista) */}
    
      <h3 className="mb-3" id="created-challenges">
        Tus Retos Publicados ({createdChallenges.length})
      </h3>
      <ListGroup>
        {createdChallenges.length > 0 ? (
          createdChallenges.map((challenge) => (
            <ListGroup.Item
              key={challenge.id}
              className="d-flex justify-content-between align-items-center"
            >
              <Link to={`/challenges/${challenge.id}`}>{challenge.title}</Link>
              {/* Requerimos duration_days del backend */}
              <small className="text-muted">
                {challenge.duration_days} días
              </small>
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
