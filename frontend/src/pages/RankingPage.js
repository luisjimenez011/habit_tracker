// frontend/src/pages/RankingPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Card, Table, Alert, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

const RankingPage = () => {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const response = await axios.get("/api/users/ranking");
        setRanking(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching ranking:", err);
        setError("Error al cargar el ranking. Inténtalo de nuevo más tarde.");
        setLoading(false);
      }
    };
    fetchRanking();
  }, []);

  // Icono simple para los 3 primeros lugares
  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <span style={{ color: "gold", fontWeight: 'bold' }}>🥇</span>;
      case 1:
        return <span style={{ color: "silver", fontWeight: 'bold' }}>🥈</span>;
      case 2:
        return <span style={{ color: "saddlebrown", fontWeight: 'bold' }}>🥉</span>;
      default:
        return index + 1;
    }
  };

  return (
    <Container className="my-5">
      <Card className="shadow-lg">
        <Card.Header className="bg-primary text-white text-center">
          <h2 className="mb-0">Ranking de la Comunidad 💪</h2>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Cargando...</span>
              </Spinner>
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <>
              <p className="text-center text-muted">¡Mira quién está a la cabeza!</p>
              <Table striped bordered hover responsive className="mt-3">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Usuario</th>
                    <th className="text-center">Puntos ⭐</th>
                  </tr>
                </thead>
                <tbody>
                  {ranking.map((user, index) => (
                    <tr key={user.username} className={index < 3 ? 'table-warning' : ''}>
                      <td>{getRankIcon(index)}</td>
                      <td>
                        <Link to={`/profile/${user.id}`}>
                            {user.username}
                        </Link>
                      </td>
                      <td className="text-center">{user.points}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RankingPage;