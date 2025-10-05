import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { createChallenge, getCategories } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Form, Button, Container } from 'react-bootstrap';

const CreateChallenge = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [durationDays, setDurationDays] = useState(1);
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategories();
                setCategories(response.data);
            } catch (err) {
                console.error('Error al obtener las categorías:', err);
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('Debes iniciar sesión para crear un reto.');
            return;
        }

        const newChallenge = {
            title,
            description,
            duration_days: parseInt(durationDays),
            category_id: parseInt(categoryId),
        };

        try {
            await createChallenge(newChallenge);
            alert('¡Reto creado exitosamente!');
            navigate('/');
        } catch (err) {
            console.error('Error al crear el reto:', err.response.data);
            alert('Error al crear el reto. Por favor, asegúrate de haber seleccionado una categoría válida.');
        }
    };

    if (!user) {
        return <p>Por favor, inicia sesión para crear un reto.</p>;
    }

    return (
        <Container className="my-5">
            <h2 className="mb-4">Crear un Nuevo Reto</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formTitle">
                    <Form.Label>Título:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Escribe el título del reto"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formDescription">
                    <Form.Label>Descripción:</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Describe el reto en detalle"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formDuration">
                    <Form.Label>Duración (en días):</Form.Label>
                    <Form.Control
                        type="number"
                        min="1"
                        value={durationDays}
                        onChange={(e) => setDurationDays(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formCategory">
                    <Form.Label>Categoría:</Form.Label>
                    <Form.Select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                    >
                        <option value="">Selecciona una categoría</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Button variant="primary" type="submit">
                    Crear Reto
                </Button>
            </Form>
        </Container>
    );
};

export default CreateChallenge;