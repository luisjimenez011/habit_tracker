import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Card,
  Row,
  Col,
  Alert,
  Button,
  ProgressBar,
} from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { markChallengeProgress } from "../services/api";

const UserChallenges = () => {
  const { user, loading, userChallenges, refreshUserChallenges } =
    useContext(AuthContext);

  // Nuevo estado para controlar la carga del botón (usando el ID del reto como clave)
  const [isMarkingProgress, setIsMarkingProgress] = useState({});

  const handleMarkProgress = async (challengeId) => {
    // 1. Bloqueo inicial del botón para este reto
    setIsMarkingProgress(prev => ({ ...prev, [challengeId]: true })); 

    try {
      // La ruta es /api/challenges/:id/progress
      const response = await markChallengeProgress(challengeId);
      
      let message = "¡Progreso actualizado!";
      if (response.points_gained > 0) {
          message += ` Ganaste ${response.points_gained} puntos.`;
      }
      alert(message);
      
      // 🔑 REFRESCAR: Llama a la función del contexto para actualizar la lista
      refreshUserChallenges();
    } catch (error) {
      console.error("Error al marcar el progreso:", error.response);
      const errorMessage =
        error.response?.data?.message || "Error al marcar el progreso.";
      alert(errorMessage);
    } finally {
      // 2. Desbloqueo final del botón para este reto
      setIsMarkingProgress(prev => ({ ...prev, [challengeId]: false })); 
    }
  };

  if (loading) {
    return (
      <Container className="my-5">
        <p>Cargando retos...</p>
      </Container>
    );
  }

  if (!user) {
    return (
      <Alert variant="warning" className="m-5 text-center">
        Por favor, inicia sesión para ver tus retos.
      </Alert>
    );
  }

  // Filtramos solo los retos que no están completados
  const challengesInProgress = userChallenges.filter(
    (c) => c.status !== "completed"
  );

  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center">Mis Retos Activos</h2>
      {challengesInProgress.length === 0 ? (
        <Alert variant="info" className="text-center">
          Aún no te has unido a ningún reto o has completado todos. Visita{" "}
          <Link to="/challenges">Buscar Retos</Link> para empezar.
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {challengesInProgress.map((challenge) => {
            const progress =
              (challenge.progress_count / challenge.duration_days) * 100;
            const daysLeft = challenge.duration_days - challenge.progress_count;

            // Formateamos la fecha (manejo simple para mostrar)
            const lastProgressDate = challenge.last_progress_date
              ? new Date(challenge.last_progress_date).toLocaleDateString()
              : "Nunca";

            return (
              <Col key={challenge.id}>
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <Card.Title>
                      <Link to={`/challenges/${challenge.id}`}>
                        {challenge.title}
                      </Link>
                    </Card.Title>
                    <Card.Text className="text-muted small">
                      Meta: {challenge.duration_days} días | Último check-in:{" "}
                      {lastProgressDate}
                    </Card.Text>

                    <div className="mb-3">
                      <ProgressBar
                        now={progress}
                        label={`${Math.round(progress)}%`}
                        variant={daysLeft > 0 ? "success" : "success"}
                      />
                      <small className="text-muted">
                        Día **{challenge.progress_count}** de{" "}
                        {challenge.duration_days}
                      </small>
                    </div>

                    <Button
                      variant="success"
                      onClick={() => handleMarkProgress(challenge.id)}
                      className="w-100 mt-2"
                      
                      disabled={daysLeft <= 0}
                    >
                      Marcar Progreso de Hoy
                    </Button>
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

export default UserChallenges;
