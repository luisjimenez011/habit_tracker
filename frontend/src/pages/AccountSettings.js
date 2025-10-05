import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  updateUserProfile,
  deleteUserAccount,
  getUserProfile,
} from "../services/api";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";

const AccountSettings = () => {
  const { user, logout, loadUserFromToken } = useContext(AuthContext);

 
  const [username, setUsername] = useState(user ? user.username : "");
  const [statusMessage, setStatusMessage] = useState({ type: "", message: "" });

  // Sincronizar el estado local con el estado del contexto cuando cambia el usuario
  useEffect(() => {
    if (user) {
      setUsername(user.username);
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setStatusMessage({ type: "", message: "" }); // Limpiar mensaje anterior

    try {
      await updateUserProfile({ username });

      const res = await getUserProfile();

      window.location.reload();

      setStatusMessage({
        type: "success",
        message: "Nombre de usuario actualizado exitosamente.",
      });
    } catch (err) {
      console.error("Error al actualizar el perfil:", err.response.data);
      const msg =
        err.response?.data?.message ||
        "Error al actualizar el nombre de usuario.";
      setStatusMessage({ type: "danger", message: msg });
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "¡ADVERTENCIA! ¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es irreversible y se perderán todos tus retos y logros."
      )
    ) {
      try {
        await deleteUserAccount();
        setStatusMessage({
          type: "success",
          message: "Tu cuenta ha sido eliminada exitosamente. Redirigiendo...",
        });

        setTimeout(() => {
          logout();
        }, 1500);
      } catch (err) {
        console.error("Error al eliminar la cuenta:", err.response.data);
        const msg =
          err.response?.data?.message || "Error al eliminar la cuenta.";
        setStatusMessage({ type: "danger", message: msg });
      }
    }
  };

  if (!user) {
    return (
      <Container className="mt-5 text-center">
        <Alert variant="warning">
          Por favor, inicia sesión para gestionar tu cuenta.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h1 className="mb-4 text-center">Configuración de la Cuenta</h1>
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          {/* Mostrar mensaje de estado */}
          {statusMessage.message && (
            <Alert variant={statusMessage.type} className="mb-4">
              {statusMessage.message}
            </Alert>
          )}

          {/* Tarjeta de Actualización de Perfil */}
          <Card className="shadow-sm mb-5">
            <Card.Header as="h5" className="bg-primary text-white">
              Actualizar Perfil
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleUpdate}>
                {/* Campo de Nombre de Usuario */}
                <Form.Group className="mb-3" controlId="formBasicUsername">
                  <Form.Label>Nombre de usuario</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nuevo nombre de usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <Form.Text className="text-muted">
                    Tu nombre de usuario actual es:{" "}
                    <strong>{user.username}</strong>
                  </Form.Text>
                </Form.Group>

                {/* Campo de Email (Solo lectura) */}
                <Form.Group className="mb-4" controlId="formBasicEmail">
                  <Form.Label>Correo Electrónico (No modificable)</Form.Label>
                  <Form.Control
                    type="email"
                    defaultValue={user.email}
                    readOnly
                    disabled
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  disabled={username === user.username}
                >
                  Guardar Cambios
                </Button>
              </Form>
            </Card.Body>
          </Card>

          {/* Tarjeta de Zona de Peligro */}
          <Card className="shadow-sm border-danger">
            <Card.Header as="h5" className="bg-danger text-white">
              Zona de Peligro
            </Card.Header>
            <Card.Body>
              <Card.Text>
                Eliminará permanentemente su cuenta y todos los datos asociados,
                incluyendo su historial de retos, logros y puntos.
              </Card.Text>
              <Button variant="outline-danger" onClick={handleDelete}>
                Eliminar Cuenta
              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default AccountSettings;
