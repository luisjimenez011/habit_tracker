import React, { useState, useEffect, useContext } from 'react';
import { getComments, addComment } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Form, Button, ListGroup, InputGroup, Alert } from 'react-bootstrap';

const CommentsSection = ({ challengeId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);

    // Función para obtener y actualizar la lista de comentarios
    const fetchComments = async () => {
        try {
            const response = await getComments(challengeId);
            setComments(response.data);
            setError(null); // Limpiar errores si la carga es exitosa
        } catch (err) {
            console.error("Error al cargar comentarios:", err);
            setError("No se pudieron cargar los comentarios.");
        }
    };

    // Cargar comentarios al iniciar y cuando cambia el ID del reto
    useEffect(() => {
        fetchComments();
    }, [challengeId]);

    // Manejar el envío de un nuevo comentario
    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            await addComment(challengeId, { content: newComment });
            setNewComment('');
            fetchComments(); // Recargar la lista para mostrar el nuevo comentario
        } catch (err) {
            console.error("Error al añadir comentario:", err);
            setError("Error al añadir el comentario. ¿Has iniciado sesión?");
        }
    };

   return (
        <div className="mt-5">
            <h3 className="mb-3">Comentarios</h3>

            {/* Formulario para añadir un nuevo comentario (correcto) */}
            {user ? (
                <Form onSubmit={handleAddComment} className="mb-4">
                    <InputGroup>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            placeholder="Escribe tu comentario..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            required
                        />
                        <Button variant="success" type="submit">
                            Enviar
                        </Button>
                    </InputGroup>
                    {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
                </Form>
            ) : (
                <Alert variant="info">Inicia sesión para dejar un comentario.</Alert>
            )}

            {/* Lista de comentarios (Ajuste en el mapeo) */}
            <ListGroup>
                {comments.length > 0 ? (
                    comments.map(comment => (
                        <ListGroup.Item key={comment.id} className="d-flex justify-content-between align-items-start">
                            <div className="ms-2 me-auto">
                              
                                <div className="fw-bold">{comment.username || 'Usuario desconocido'}</div>
                                
                                
                                {comment.comment_text}
                            </div>
                            <small className="text-muted">{new Date(comment.created_at).toLocaleDateString()}</small>
                        </ListGroup.Item>
                    ))
                ) : (
                    <ListGroup.Item className="text-center text-muted">Sé el primero en comentar.</ListGroup.Item>
                )}
            </ListGroup>
        </div>
    );
};

export default CommentsSection;